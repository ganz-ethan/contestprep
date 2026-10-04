// Run: node simulate_diag.js
// Monte-Carlo accuracy test of the adaptive engine: simulated students with KNOWN true ability take the test.
// Students answer with a DIFFERENT response model than the engine assumes (flatter curve, more slips, guessing
// by strand), so this tests robustness, not just self-consistency.
const fs = require("fs"), vm = require("vm");
const store = {};
const ctx = {
  window: { CP: { show() {}, esc: x => x, pill() {}, bar() {}, S: {}, persist() {}, touchStreak() {} } },
  console, document: {}, location: { hash: "" }, localStorage: { getItem: () => null, setItem() {} },
};
ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("diag.js", "utf8"), ctx);
const D = ctx.window.DIAG, E = ctx.window.DiagUI._test;

let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());

function simulate(trueTheta, strandOffsets, model) {
  const run = { mu: 500, precision: "std", ids: [], ok: [], cur: null };
  let guard = 0;
  while (guard++ < 200) {
    const est = E.estimate(run);
    if (E.shouldStop(run, est)) break;
    const id = E.pickNext(run, est), it = E.itemById(id);
    const th = trueTheta + strandOffsets[it.strand];
    const p = model.g + (1 - model.g - model.slip) / (1 + Math.exp(-(th - it.b - model.itemNoise * gauss()) / model.W));
    run.ids.push(id); run.ok.push(rnd() < p);
  }
  const est = E.estimate(run), resp = E.respOf(run);
  return { est, n: run.ids.length, strands: E.finishStrands(resp, est.mean) };
}

const models = {
  "engine's own model": { g: 0.02, slip: 0.05, W: 55, itemNoise: 0 },
  "harsher reality (flatter curve, 8% slips, 5% lucky guesses, item difficulty off by ±35)": { g: 0.05, slip: 0.08, W: 75, itemNoise: 35 },
};
for (const [name, model] of Object.entries(models)) {
  console.log(`\n== Student model: ${name}`);
  let all = [], cover1 = 0, cover2 = 0, nTot = 0, sErr = [], topHit = 0, topN = 0;
  for (const th of [150, 300, 450, 600, 750, 850, 950, 1050, 1150, 1250]) {
    const errs = [];
    for (let rep = 0; rep < 24; rep++) {
      // each simulated student is stronger in one random subject by ~+80 and weaker in another by ~-60
      const offs = { N: 0, A: 0, G: 0, C: 0, T: 0 }; const ks = ["N", "A", "G", "C", "T"].sort(() => rnd() - 0.5);
      offs[ks[0]] = 80; offs[ks[1]] = -60;
      const r = simulate(th, offs, model);
      const e = r.est.mean - th; errs.push(e); all.push(e); nTot += r.n;
      const se = r.est.sd * E.SE_INFLATE; if (Math.abs(e) <= se) cover1++; if (Math.abs(e) <= 2 * se) cover2++;
      for (const s of ["N", "A", "G", "C", "T"]) sErr.push(Math.abs(r.strands[s].mean - (th + offs[s])));
      const best = Object.entries(r.strands).sort((a, b) => b[1].mean - a[1].mean)[0][0]; topN++; if (best === ks[0]) topHit++;
    }
    const mae = errs.reduce((a, b) => a + Math.abs(b), 0) / errs.length, bias = errs.reduce((a, b) => a + b, 0) / errs.length;
    console.log(`  true ${String(th).padStart(4)}: mean abs error ${mae.toFixed(1).padStart(5)} pts, bias ${bias >= 0 ? "+" : ""}${bias.toFixed(1)}`);
  }
  const mae = all.reduce((a, b) => a + Math.abs(b), 0) / all.length;
  const rmse = Math.sqrt(all.reduce((a, b) => a + b * b, 0) / all.length);
  console.log(`  OVERALL: mean abs error ${mae.toFixed(1)} pts (RMSE ${rmse.toFixed(1)}); average questions ${(nTot / all.length).toFixed(1)}`);
  console.log(`  Stated margin of error held: ${(100 * cover1 / all.length).toFixed(0)}% within ±1 SE (ideal ~68%), ${(100 * cover2 / all.length).toFixed(0)}% within ±2 SE (ideal ~95%)`);
  console.log(`  Per-subject score: mean abs error ${(sErr.reduce((a, b) => a + b, 0) / sErr.length).toFixed(0)} pts; correctly named the strongest subject ${(100 * topHit / topN).toFixed(0)}% of the time (chance 20%)`);
}
