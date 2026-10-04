// Adaptive diagnostic + level practice UI. Depends on diag_items.js (window.DIAG) and app.js (window.CP).
(() => {
  const { STRANDS, STRAND_NAME, LEVELS, LEVEL_NAME, gen, check } = window.DIAG;
  const { show, esc, pill, bar, S, persist, touchStreak, shareCard } = window.CP;

  // Refit item difficulties (produced by calibrate.js from collected anonymous data) override the design values.
  // calibration.json is optional; if it is missing or empty the built-in design difficulties are used.
  fetch("calibration.json", { cache: "no-store" }).then(r => (r.ok ? r.json() : null)).then(j => { if (j && j.items) window.DIAG.setCalibration(j); }).catch(() => {});
  S.diag = S.diag || { history: [] };
  S.lvl = S.lvl || {};

  // ---------- item response model ----------
  // P(correct | ability th, item difficulty b) = g + (1 - g - slip) * logistic((th - b) / W)
  // g: lucky-guess floor for free-response, slip: careless-error ceiling, W: how sharply difficulty separates people.
  const GRID = []; for (let x = 0; x <= 1400; x += 5) GRID.push(x);
  const W = 65, G = 0.03, SLIP = 0.06;
  // Item difficulties are set by design, not yet calibrated on real students, so reported margins of error are widened.
  const SE_INFLATE = 1.3;
  const pc = (th, b) => G + (1 - G - SLIP) / (1 + Math.exp(-(th - b) / W));

  function posterior(resp, mu, sd, keep) {
    const lp = GRID.map(th => -0.5 * ((th - mu) / sd) ** 2);
    for (const r of resp) {
      if (keep && !keep(r)) continue;
      for (let i = 0; i < GRID.length; i++) { const p = pc(GRID[i], r.b); lp[i] += Math.log(r.ok ? p : 1 - p); }
    }
    const mx = Math.max(...lp), w = lp.map(v => Math.exp(v - mx)), Z = w.reduce((a, b) => a + b, 0);
    const mean = GRID.reduce((s, th, i) => s + th * w[i], 0) / Z;
    const sdv = Math.sqrt(GRID.reduce((s, th, i) => s + (th - mean) ** 2 * w[i], 0) / Z);
    return { mean, sd: sdv };
  }
  const itemById = id => gen(parseInt(id.slice(1), 10), parseInt(id.split("-")[1], 10));
  const respOf = run => run.ids.map((id, i) => { const it = itemById(id); return { b: it.b, ok: run.ok[i], strand: it.strand }; });
  const estimate = run => posterior(respOf(run), run.mu, 350);

  const PRECISION = { std: { min: 32, max: 50, se: 28 }, ext: { min: 45, max: 65, se: 20 } };
  const shouldStop = (run, est) => { const P = PRECISION[run.precision]; const n = run.ids.length; return n >= P.max || (n >= P.min && est.sd <= P.se) || run.finishEarly; };

  function pickNext(run, est) {
    const resp = respOf(run), counts = Object.fromEntries(STRANDS.map(s => [s, 0]));
    resp.forEach(r => counts[r.strand]++);
    const minC = Math.min(...Object.values(counts));
    const pool = STRANDS.filter(s => counts[s] === minC);
    const strand = pool[Math.floor(Math.random() * pool.length)];
    const target = posterior(resp, est.mean, 200, r => r.strand === strand).mean; // ability in THIS strand (shrunk toward overall)
    const used = new Set(run.ids), cands = [];
    for (const L of LEVELS) for (let k = STRANDS.indexOf(strand); k < 100; k += 5) {
      const it = gen(L, k); if (used.has(it.id)) continue;
      cands.push({ it, d: Math.abs(it.b - target) });
    }
    cands.sort((a, b) => a.d - b.d);
    return cands[Math.floor(Math.random() * Math.min(3, cands.length))].it.id;
  }

  const bandOf = th => Math.max(100, Math.min(1300, Math.floor(th / 100) * 100));
  const describe = th => {
    if (th < 100) return { band: 100, text: "Below Kindergarten – Grade 1 level", pct: Math.round(th) };
    if (th >= 1400) return { band: 1300, text: "Beyond AIME level", pct: 100 };
    const b = bandOf(th); return { band: b, text: LEVEL_NAME[b], pct: Math.round(th - b) };
  };
  const recommend = th => th < 800 ? { t: "Build your foundations", href: `#/level/${bandOf(th)}`, d: `Work through Level ${bandOf(th)} and the one above it. Contest math rests on solid arithmetic and algebra.` }
    : th < 900 ? { t: "Start AMC 8", href: "#/track/amc8", d: "You are ready for AMC 8 problems. Keep sharpening Level 800 and 900 skills too." }
    : th < 1050 ? { t: "AMC 8 → AMC 10 bridge", href: "#/track/amc10", d: "Finish AMC 8, then start AMC 10 problems." }
    : th < 1150 ? { t: "AMC 10", href: "#/track/amc10", d: "AMC 10 is your home track. Try a timed mock contest." }
    : th < 1250 ? { t: "AMC 12 and early AIME", href: "#/track/amc12", d: "Work AMC 12 problems and start AIME." }
    : { t: "AIME and olympiad proofs", href: "#/track/aime", d: "Train on AIME, then start proof writing in the olympiad track." };

  // ---------- intro ----------
  function viewIntro() {
    const last = S.diag.history[S.diag.history.length - 1];
    const resume = S.diagRun ? `<div class="note" style="margin:12px 0">You have a test in progress (${S.diagRun.ids.length} questions answered).
        <a class="btn small" href="#/diag/run">Resume</a> <button class="btn small ghost" id="discard">Discard it</button></div>` : "";
    show(`
      <h1>Find your real level</h1>
      <p class="sub">An adaptive test: every question is chosen from your answers so far, so it quickly zooms in on what you can actually do.</p>
      ${shareCard()}
      ${resume}
      <div class="card">
        <p><b>What you get:</b> a score from <b>100</b> (Kindergarten) to <b>1300</b> (AIME). Each 100 points is one level, so <b>847</b> means "47% of the way through Grade 8 / Pre-Algebra". You also get a score in each of five subjects, so you can see which one is your most advanced.</p>
        <p><b>How it works:</b> usually 40 to 50 questions (32 minimum, 50 maximum). Type your answer: a whole number, a decimal, or a fraction like <code>3/4</code>. No multiple choice, so guessing barely helps. If you do not know a question, press <b>I don't know</b> instead of guessing. It will not hurt your score more than a wrong answer.</p>
        <p><b>No calculator.</b> Do the work on paper. You will not see whether each answer was right until the end.</p>
        <div class="row" style="margin:12px 0">
          <label>Your grade (just a starting point): <select id="grade">
            <option value="500">Not sure</option><option value="200">K – 2</option><option value="300">3</option><option value="400">4</option>
            <option value="500">5</option><option value="600">6</option><option value="700">7</option><option value="800">8</option>
            <option value="900">9</option><option value="1000">10</option><option value="1100">11 – 12</option></select></label>
          <label>Length: <select id="prec"><option value="std">Standard (usually 40–50 questions)</option><option value="ext">Extra precise (up to 65)</option></select></label>
        </div>
        <button class="btn" id="start">Start the diagnostic</button>
      </div>
      ${last ? `<h2>Your last result</h2>${resultSummary(last)}<p><a href="#/diag/result">See full report</a></p>` : ""}
      <h2>Honest limits</h2>
      <p class="note">The scale is set by the problem types and difficulty built into this site, not by a national sample of students, so treat the number as a precise <i>relative</i> measure that gets sharper over time, not an official grade equivalent. The report shows its margin of error. Taking it again after a few weeks of practice shows real growth.</p>`);
    const d = document.getElementById("discard"); if (d) d.onclick = () => { delete S.diagRun; persist(); viewIntro(); };
    document.getElementById("start").onclick = () => {
      S.diagRun = { mu: +document.getElementById("grade").value, precision: document.getElementById("prec").value, ids: [], ok: [], cur: null, t0: Date.now() };
      persist(); location.hash = "#/diag/run";
    };
  }

  // ---------- runner ----------
  function viewRun() {
    const run = S.diagRun; if (!run) { location.hash = "#/diag"; return; }
    const est = estimate(run);
    if (shouldStop(run, est)) return finish(run);
    if (!run.cur) { run.cur = pickNext(run, est); persist(); }
    const it = itemById(run.cur), n = run.ids.length, P = PRECISION[run.precision];
    const frac = Math.min(1, n / (run.precision === "ext" ? 60 : 45));
    show(`
      <div class="row" style="justify-content:space-between"><h1 style="margin:0">Question ${n + 1}</h1>
        <span class="sub">${n >= 15 ? `<button class="btn small ghost" id="early">Finish early</button>` : ""}</span></div>
      <div class="bar" style="margin:10px 0 16px"><i style="width:${Math.round(frac * 100)}%"></i></div>
      <div class="problem" style="font-size:1.15rem">${it.q}</div>
      <div class="row" style="margin:14px 0">
        <input id="ans" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer" style="width:12em" autofocus>
        <button class="btn" id="go">Submit</button>
        <button class="btn ghost" id="dk">I don't know</button>
      </div>
      <p class="sub" style="font-size:.85rem">Type a whole number, a decimal, or a fraction like 3/4. No calculator.</p>`);
    const inp = document.getElementById("ans"); inp.focus();
    const next = ok => { run.ids.push(run.cur); run.ok.push(ok); run.cur = null; persist(); viewRun(); window.scrollTo(0, 0); };
    const submit = () => { const v = inp.value.trim(); if (!v) { inp.focus(); return; } next(check(it, v)); };
    document.getElementById("go").onclick = submit;
    inp.onkeydown = e => { if (e.key === "Enter") submit(); };
    document.getElementById("dk").onclick = () => next(false);
    const e = document.getElementById("early"); if (e) e.onclick = () => { if (confirm("Finish now? Your result will be less precise.")) { run.finishEarly = true; persist(); viewRun(); } };
  }

  function finish(run) {
    const resp = respOf(run), est = estimate(run);
    const strands = {};
    for (const s of STRANDS) {
      const p = posterior(resp, est.mean, 150, r => r.strand === s);
      strands[s] = { score: Math.round(p.mean), se: Math.round(p.sd * SE_INFLATE), n: resp.filter(r => r.strand === s).length };
    }
    S.diag.history.push({ t: Date.now(), score: Math.round(est.mean), se: Math.round(est.sd * SE_INFLATE), n: run.ids.length, early: !!run.finishEarly, strands, items: run.ids.map((id, i) => [id, run.ok[i] ? 1 : 0]) });
    if (window.Telemetry) Telemetry.diag(run.ids, run.ok, run.mu); // anonymous + opt-in; no-op unless enabled
    delete S.diagRun; persist(); touchStreak(); persist();
    location.hash = "#/diag/result";
  }

  // ---------- results ----------
  function resultSummary(h) {
    const d = describe(h.score);
    return `<div class="card"><div class="row" style="justify-content:space-between;align-items:baseline">
      <div><span style="font-size:2.4rem;font-weight:700">${h.score}</span> <span class="sub">± ${h.se}</span></div>
      <div style="text-align:right"><b>${esc(d.text)}</b><br><span class="sub">${d.pct}% of the way through Level ${d.band}</span></div></div>${bar(d.pct, 100)}</div>`;
  }

  function viewResult(idx) {
    const hist = S.diag.history; if (!hist.length) { location.hash = "#/diag"; return; }
    const h = hist[idx === undefined ? hist.length - 1 : +idx] || hist[hist.length - 1], prev = hist[hist.indexOf(h) - 1];
    const d = describe(h.score), rec = recommend(h.score);
    const ranked = STRANDS.map(s => ({ s, ...h.strands[s] })).sort((a, b) => b.score - a.score);
    const top = ranked[0], co = ranked.filter(x => x !== top && top.score - x.score <= 25);
    const td = describe(top.score);
    const rows = ranked.map(x => { const dd = describe(x.score); return `
      <div style="margin:10px 0"><div class="row" style="justify-content:space-between"><b>${esc(STRAND_NAME[x.s])}</b>
        <span><b>${x.score}</b> <span class="sub">± ${x.se} · ${esc(dd.text)}, ${dd.pct}% through</span></span></div>
        <div class="bar" style="height:12px"><i style="width:${Math.min(100, x.score / 14)}%"></i></div></div>`; }).join("");
    // skills
    const items = h.items.map(([id, ok]) => ({ it: itemById(id), ok })).sort((a, b) => a.it.b - b.it.b);
    const right = items.filter(x => x.ok).map(x => x.it), wrong = items.filter(x => !x.ok).map(x => x.it);
    const top5 = wrong.filter(w => w.b <= h.score + 60).slice(-6); // misses at or below your level are the real gaps
    const SHORT = { N: "Arithmetic", A: "Algebra", G: "Geometry", C: "Counting", T: "Number theory" };
    const chips = list => { const seen = new Set(), u = list.filter(i => { const k = i.skill + "|" + i.level; if (seen.has(k)) return false; seen.add(k); return true; });
      return u.length ? u.map(i => `<span class="pill" title="Level ${i.level}">${SHORT[i.strand]}: ${esc(i.skill)} (${i.level})</span>`).join(" ") : `<span class="sub">None</span>`; };
    show(`
      <div class="crumbs"><a href="#/diag">Diagnostic</a> / Report</div>
      <h1>Your level: ${h.score}</h1>
      ${resultSummary(h)}
      ${prev ? `<p>${h.score >= prev.score ? "📈" : "📉"} ${h.score >= prev.score ? "+" : ""}${h.score - prev.score} points since your last diagnostic.</p>` : ""}
      <p class="sub">${h.n} questions${h.early ? " (finished early, so wider margin)" : ""}. The true score is about 2 out of 3 times within ± ${h.se}, and almost always within ± ${2 * h.se}.</p>

      <h2>Your most advanced subject</h2>
      <div class="card" style="border-color:var(--accent)"><b style="font-size:1.2rem">${esc(STRAND_NAME[top.s])}</b>: <b>${top.score}</b>
        <p style="margin:6px 0 0">That is ${esc(td.text)}, ${td.pct}% of the way through Level ${td.band}.${co.length ? ` About tied: ${co.map(x => esc(STRAND_NAME[x.s])).join(", ")}.` : ""}</p></div>

      <h2>Score by subject</h2>${rows}
      <p class="sub">Each subject has about ${Math.round(h.n / 5)} questions behind it, so its margin of error is wider than the overall score.</p>

      <h2>What to do next</h2>
      <div class="card"><b>${esc(rec.t)}</b><p style="margin:6px 0 10px">${esc(rec.d)}</p>
        <a class="btn" href="${rec.href}">Go</a>
        <a class="btn ghost" href="#/level/${d.band}" style="margin-left:6px">Practice Level ${d.band}</a>
        ${top5.length ? "" : ""}</div>

      <h2>Skills to work on</h2>
      <p>${top5.length ? chips(top5) : `<span class="sub">You answered everything at or below your level correctly. Practice the next level up.</span>`}</p>
      <h2>Skills you showed</h2><p>${chips(right.slice(-14))}</p>
      <div class="row" style="margin-top:20px"><a class="btn ghost" href="#/diag">Retake later</a></div>`);
  }

  // ---------- level practice ----------
  const solvedIn = L => { let c = 0; for (let k = 0; k < 100; k++) if (S.lvl[`L${L}-${String(k).padStart(2, "0")}`]) c++; return c; };
  let strandFilter = "all";

  function viewLevel(levelArg, idxArg) {
    const L = LEVELS.includes(+levelArg) ? +levelArg : 700;
    const idx = idxArg === undefined ? null : Math.max(0, Math.min(99, +idxArg));
    const chips = LEVELS.map(l => `<a class="btn small ${l === L ? "" : "ghost"}" href="#/level/${l}">${l}</a>`).join(" ");
    const fchips = [["all", "All"], ...STRANDS.map(s => [s, STRAND_NAME[s]])].map(([k, n]) => `<button class="btn small ${strandFilter === k ? "" : "ghost"}" data-f="${k}">${esc(n)}</button>`).join(" ");
    const cells = [];
    for (let k = 0; k < 100; k++) {
      const it = gen(L, k); if (strandFilter !== "all" && it.strand !== strandFilter) continue;
      const done = S.lvl[it.id];
      cells.push(`<a class="cell ${done ? "done" : ""} ${k === idx ? "cur" : ""}" href="#/level/${L}/${k}" title="${esc(it.skill)}">${k + 1}</a>`);
    }
    let body = "";
    if (idx !== null) {
      const it = gen(L, idx);
      body = `<div class="card" style="margin:14px 0"><div>${pill(STRAND_NAME[it.strand])}${pill(it.skill)} <span class="sub" style="font-size:.85rem">Problem ${idx + 1} of 100</span></div>
        <div class="problem" style="margin:10px 0">${it.q}</div>
        <div class="row"><input id="ans" type="text" autocomplete="off" placeholder="Your answer" style="width:12em">
        <button class="btn" id="chk">Check</button><button class="btn ghost" id="rev">Show answer</button></div>
        <div id="fb"></div></div>`;
    }
    show(`
      <div class="crumbs"><a href="#/diag">Diagnostic</a> / Levels</div>
      <h1>Level ${L}: ${esc(LEVEL_NAME[L])}</h1>
      <p class="sub">100 problems, easiest to hardest across five subjects. ${solvedIn(L)} / 100 solved.</p>
      <div class="row" style="margin:8px 0">${chips}</div>${bar(solvedIn(L), 100)}
      <div class="row" id="fl" style="margin:12px 0">${fchips}</div>
      ${body}
      <div class="cells">${cells.join("")}</div>`);
    document.getElementById("fl").onclick = e => { const b = e.target.closest("button"); if (b) { strandFilter = b.dataset.f; viewLevel(L, idxArg); } };
    if (idx !== null) {
      const it = gen(L, idx), fb = document.getElementById("fb"), inp = document.getElementById("ans");
      const nextK = () => { for (let j = 1; j <= 100; j++) { const k = (idx + j) % 100, x = gen(L, k); if ((strandFilter === "all" || x.strand === strandFilter) && !S.lvl[x.id]) return k; } return (idx + 1) % 100; };
      const solution = () => `<div class="solution"><b>Answer: ${esc(it.show)}</b><br>${it.sol}</div>`;
      const render = html => { fb.innerHTML = html; if (window.renderMathInElement) renderMathInElement(fb, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false }); };
      const go = () => {
        const v = inp.value.trim(); if (!v) return;
        const okNow = check(it, v); if (window.Telemetry) Telemetry.item(it.id, okNow, 0);
        if (okNow) { S.lvl[it.id] = 1; persist(); touchStreak(); persist(); render(`<p class="msg-good">Correct!</p>${solution()}<a class="btn" href="#/level/${L}/${nextK()}">Next problem →</a>`); }
        else render(`<p class="msg-bad">Not quite. Check your work and try again.</p>`);
      };
      document.getElementById("chk").onclick = go;
      inp.onkeydown = e => { if (e.key === "Enter") go(); };
      document.getElementById("rev").onclick = () => render(solution() + `<a class="btn ghost" href="#/level/${L}/${nextK()}">Next problem →</a>`);
    }
  }

  window.DiagUI = {
    route(page, arg, arg2) {
      if (page === "level") return viewLevel(arg, arg2);
      if (arg === "run") return viewRun();
      if (arg === "result") return viewResult(arg2);
      return viewIntro();
    },
    _test: { posterior, pickNext, estimate, shouldStop, respOf, finishStrands: (resp, mean) => Object.fromEntries(STRANDS.map(s => [s, posterior(resp, mean, 150, r => r.strand === s)])), PRECISION, itemById, SE_INFLATE },
  };
})();
