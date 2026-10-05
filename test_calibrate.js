// Run: node test_calibrate.js
// Proves calibrate.js (group-level fit) can recover hidden skill difficulties and spot broken skills, using synthetic students.
//  - every skill's TRUE difficulty is the design difficulty plus a hidden shift (sd 40 points) and a little per-item noise
//  - 3 skills are "broken" (wrong answer key): nobody can get them right
//  - students answer with a flatter, messier curve than the fitting model assumes, to test robustness
const { fitGroups, loadDesign, engineConstants } = require("./calibrate.js");
const D = loadDesign(), M = engineConstants();
let seed = 987654321; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const items = [], keyOf = it => `${it.level}|${it.strand}|${it.skill}`, trueShift = {}, groupsAll = new Set();
for (const L of D.LEVELS) for (let k = 0; k < D.PER_LEVEL; k++) { const it = D.gen(L, k); items.push(it); groupsAll.add(keyOf(it)); }
for (const g of groupsAll) trueShift[g] = Math.max(-100, Math.min(100, 40 * gauss()));
const brokenKeys = new Set([...groupsAll].filter((g, i) => [17, 101, 233].includes(i)));
const trueB = new Map(items.map(it => [it.id, it.b0 + trueShift[keyOf(it)] + 10 * gauss()]));
items.sort((a, b) => a.b0 - b.b0);
const truth = { W: M.W * 1.15, G: 0.04, SLIP: 0.07 };
const pTrue = (th, b) => truth.G + (1 - truth.G - truth.SLIP) / (1 + Math.exp(-(th - b) / truth.W));
const lowerBound = x => { let lo = 0, hi = items.length; while (lo < hi) { const m = (lo + hi) >> 1; if (items[m].b0 < x) lo = m + 1; else hi = m; } return lo; };
const rows = [], N = 3500;
for (let s = 0; s < N; s++) {
  const th = 100 + 1150 * rnd(), sid = s.toString(16).padStart(8, "0"), lo = lowerBound(th - 220), hi = lowerBound(th + 220), picks = new Set();
  while (picks.size < 40) picks.add(items[lo + Math.floor(rnd() * (hi - lo))]);
  for (const it of picks) rows.push({ kind: "diag", sid, item: it.id, ok: brokenKeys.has(keyOf(it)) ? rnd() < 0.03 : rnd() < pTrue(th, trueB.get(it.id)), hints: 0 });
}
const designB = id => { const p = D.parseId(id); return D.gen(p.level, p.k).b0; }, groupOf = id => { const p = D.parseId(id); return keyOf(D.gen(p.level, p.k)); };
const t0 = Date.now(), res = fitGroups(rows, designB, groupOf, { min: 40 });
const cal = Object.keys(res.groups).filter(g => !brokenKeys.has(g)), meanTrue = cal.reduce((s, g) => s + trueShift[g], 0) / cal.length;
let seDesign = 0, seFit = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
for (const g of cal) { const tr = trueShift[g] - meanTrue, est = res.groups[g].shift; seDesign += tr * tr; seFit += (est - tr) ** 2; sx += tr; sy += est; sxx += tr * tr; syy += est * est; sxy += tr * est; }
const n = cal.length, corr = (sxy - sx * sy / n) / Math.sqrt((sxx - sx * sx / n) * (syy - sy * sy / n));
const flagged = new Set(res.groupFlags.map(f => f.key)), testable = [...brokenKeys].filter(g => res.groups[g]), caught = testable.filter(g => flagged.has(g)).length;
const falseFlags = res.groupFlags.filter(f => !brokenKeys.has(f.key)).length;
console.log(`${rows.length} answers, ${res.persons} sessions, ${Object.keys(res.groups).length} of ${groupsAll.size} skills recalibrated (n>=40), ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`Error in skill difficulty (excluding broken skills), points RMS:`);
console.log(`  using design values only: ${Math.sqrt(seDesign / n).toFixed(1)}`);
console.log(`  after calibration:        ${Math.sqrt(seFit / n).toFixed(1)}   (correlation of recovered vs true shifts: ${corr.toFixed(2)})`);
console.log(`Broken skills flagged: ${caught} of ${testable.length} that had enough data; sound skills wrongly flagged: ${falseFlags} of ${n}`);
const pass = Math.sqrt(seFit / n) < 0.7 * Math.sqrt(seDesign / n) && corr > 0.7 && testable.length > 0 && caught === testable.length && falseFlags <= Math.ceil(0.05 * n);
console.log(pass ? "PASS: calibration recovers skill difficulties and catches broken skills." : "FAIL");
process.exit(pass ? 0 : 1);
