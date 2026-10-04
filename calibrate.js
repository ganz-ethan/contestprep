// Refit diagnostic item difficulties from collected anonymous right/wrong data.
//
//   node calibrate.js responses.csv [--min 20] [--out calibration.json]
//
// Input CSV columns: day,kind,sid,item,ok,hints   (the Google Sheet "responses" tab, or collector/responses.csv)
//
// Method (a regularized one-parameter logistic / Rasch-style fit, using the same response curve as the live engine):
//   1. Treat each session (sid) with >= 8 diagnostic-item answers as a "person". Estimate each person's ability from
//      their answers given the current item difficulties.
//   2. Re-estimate each item's difficulty from everyone who answered it, with a Gaussian prior centered on the design
//      difficulty (so thin data barely moves it) and a hard cap on how far it can move.
//   3. Anchor: keep the average difficulty of the recalibrated items equal to their average design difficulty, so the
//      100-1300 scale does not drift (Rasch scales are only defined up to a shift).
//   4. Repeat. Items with fewer than --min answers keep their design difficulty (they are omitted from the output).
// It also prints a quality report: items whose answers disagree strongly with what their difficulty predicts (often a
// wrong answer key, bad wording, or an unintended trick), and first-try rates for contest problems.
const fs = require("fs"), vm = require("vm"), path = require("path");

function loadDesign() {
  const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "diag_items.js"), "utf8"), ctx);
  return ctx.window.DIAG;
}
function engineConstants() { // keep identical to the live engine
  const m = /const W = (\d+), G = ([\d.]+), SLIP = ([\d.]+)/.exec(fs.readFileSync(path.join(__dirname, "diag.js"), "utf8"));
  return { W: +m[1], G: +m[2], SLIP: +m[3] };
}
function parseCSV(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("day,")) continue;
    const [day, kind, sid, item, ok, hints] = line.split(",");
    if (!item || sid === undefined) continue;
    rows.push({ kind, sid, item, ok: +ok === 1, hints: +hints || 0 });
  }
  return rows;
}

function fit(rows, designB, opts = {}) {
  const { W, G, SLIP } = opts.model || engineConstants();
  const MIN = opts.min ?? 20, ITER = opts.iter ?? 8, PRIOR_SD = opts.priorSd ?? 60, CAP = opts.cap ?? 150, MIN_PERSON = opts.minPerson ?? 8;
  const pc = (th, b) => G + (1 - G - SLIP) / (1 + Math.exp(-(th - b) / W));
  const isL = id => /^L\d{3,4}-\d{2}$/.test(id);
  // collapse duplicates: if the same session answered the same item more than once, keep the first
  const seen = new Set(), L = [];
  for (const r of rows) { if (!isL(r.item)) continue; const k = r.sid + "|" + r.item; if (seen.has(k)) continue; seen.add(k); L.push(r); }
  const bySid = new Map(), byItem = new Map();
  for (const r of L) { (bySid.get(r.sid) || bySid.set(r.sid, []).get(r.sid)).push(r); }
  for (const [sid, rs] of bySid) if (rs.length < MIN_PERSON) bySid.delete(sid);
  for (const rs of bySid.values()) for (const r of rs) (byItem.get(r.item) || byItem.set(r.item, []).get(r.item)).push(r);
  const GT = []; for (let t = 0; t <= 1500; t += 5) GT.push(t);
  const b = {}, design = {};
  for (const id of byItem.keys()) { design[id] = designB(id); b[id] = design[id]; }
  const theta = new Map();
  for (let it = 0; it < ITER; it++) {
    // 1. person abilities (MAP, weak prior around the mean difficulty of the items they saw)
    for (const [sid, rs] of bySid) {
      const mu = rs.reduce((s, r) => s + b[r.item], 0) / rs.length; let best = 0, bl = -Infinity;
      for (const t of GT) { let l = -0.5 * ((t - mu) / 300) ** 2; for (const r of rs) { const p = pc(t, b[r.item]); l += Math.log(r.ok ? p : 1 - p); } if (l > bl) { bl = l; best = t; } }
      theta.set(sid, best);
    }
    // 2. item difficulties
    for (const [id, rs] of byItem) {
      if (rs.length < MIN) continue;
      let best = design[id], bl = -Infinity;
      for (let x = design[id] - CAP; x <= design[id] + CAP; x += 2.5) {
        let l = -0.5 * ((x - design[id]) / PRIOR_SD) ** 2;
        for (const r of rs) { const p = pc(theta.get(r.sid), x); l += Math.log(r.ok ? p : 1 - p); }
        if (l > bl) { bl = l; best = x; }
      }
      b[id] = best;
    }
    // 3. anchor the scale
    const cal = [...byItem].filter(([, rs]) => rs.length >= MIN).map(([id]) => id);
    if (cal.length) { const shift = cal.reduce((s, id) => s + (b[id] - design[id]), 0) / cal.length; for (const id of cal) b[id] = Math.max(0, Math.min(1400, b[id] - shift)); }
  }
  // quality: standardized residual per item
  const flags = [];
  const out = {};
  for (const [id, rs] of byItem) {
    let obs = 0, exp = 0, v = 0;
    // residual AFTER refitting difficulty: a shifted-but-sound item is explained by its new difficulty, so only items
    // that remain unexplained (wrong key, ambiguous wording, an unintended shortcut) or hit the movement cap are flagged
    for (const r of rs) { const p = pc(theta.get(r.sid), b[id]); obs += r.ok ? 1 : 0; exp += p; v += p * (1 - p); }
    const z = v > 0 ? (obs - exp) / Math.sqrt(v) : 0, capped = Math.abs(b[id] - design[id]) >= 100;
    if (rs.length >= MIN) out[id] = { b: Math.round(b[id] * 10) / 10, n: rs.length, design: Math.round(design[id] * 10) / 10 };
    if (rs.length >= MIN && (Math.abs(z) > 3 || capped)) flags.push({ id, n: rs.length, observed: +(obs / rs.length).toFixed(2), expected: +(exp / rs.length).toFixed(2), z: +z.toFixed(1), capped });
  }
  return { items: out, persons: bySid.size, responses: L.length, flags: flags.sort((a, b) => Math.abs(b.z) - Math.abs(a.z)), theta };
}

function contestReport(rows, minN = 10) {
  const agg = new Map();
  for (const r of rows) { if (/^L\d/.test(r.item)) continue; const a = agg.get(r.item) || { n: 0, ok: 0, h: 0, seen: new Set() }; const k = r.sid; if (a.seen.has(k)) continue; a.seen.add(k); a.n++; a.ok += r.ok ? 1 : 0; a.h += r.hints; agg.set(r.item, a); }
  return [...agg].filter(([, a]) => a.n >= minN).map(([id, a]) => ({ id, n: a.n, firstTry: +(a.ok / a.n).toFixed(2), avgHints: +(a.h / a.n).toFixed(1) })).sort((x, y) => x.firstTry - y.firstTry);
}

module.exports = { fit, parseCSV, contestReport, loadDesign, engineConstants };

if (require.main === module) {
  const args = process.argv.slice(2), file = args.find(a => !a.startsWith("--"));
  const opt = n => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : undefined; };
  if (!file) { console.log("usage: node calibrate.js responses.csv [--min 20] [--out calibration.json]"); process.exit(1); }
  const D = loadDesign(), designB = id => D.gen(parseInt(id.slice(1), 10), parseInt(id.split("-")[1], 10)).b;
  const rows = parseCSV(fs.readFileSync(file, "utf8"));
  const min = opt("min") ? +opt("min") : 20, outFile = opt("out") || path.join(__dirname, "calibration.json");
  const res = fit(rows, designB, { min });
  const ids = Object.keys(res.items), shifts = ids.map(id => res.items[id].b - res.items[id].design);
  console.log(`Read ${rows.length} rows. Diagnostic data: ${res.responses} answers from ${res.persons} usable sessions.`);
  console.log(`Items with at least ${min} answers (recalibrated): ${ids.length} of 1300.`);
  if (ids.length) {
    const mad = shifts.reduce((s, x) => s + Math.abs(x), 0) / shifts.length;
    console.log(`Average absolute change in difficulty: ${mad.toFixed(1)} points. Largest: ${Math.max(...shifts.map(Math.abs)).toFixed(0)}.`);
    const top = ids.map(id => ({ id, ...res.items[id] })).sort((a, b) => Math.abs(b.b - b.design) - Math.abs(a.b - a.design)).slice(0, 8);
    console.log("Biggest moves:"); top.forEach(t => console.log(`  ${t.id}: ${t.design} -> ${t.b} (n=${t.n})`));
  }
  if (res.flags.length) { console.log(`\nItems still unexplained after refitting their difficulty (check the question, answer key, and wording):`); res.flags.slice(0, 15).forEach(f => console.log(`  ${f.id}: n=${f.n}, right ${f.observed} vs expected ${f.expected} (z=${f.z})${f.capped ? ", difficulty had to move 100+ points" : ""}`)); }
  const cr = contestReport(rows);
  if (cr.length) { console.log("\nContest problems by first-try rate (lowest first; very low can mean a wrong key or a flawed problem):"); cr.slice(0, 12).forEach(c => console.log(`  ${c.id}: ${c.firstTry} right on first try, ${c.avgHints} hints avg (n=${c.n})`)); }
  fs.writeFileSync(outFile, JSON.stringify({ version: new Date().toISOString().slice(0, 10), items: res.items }, null, 1) + "\n");
  console.log(`\nWrote ${outFile}`);
}
