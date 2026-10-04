// Run: node test_calibrate.js
// Proves calibrate.js can recover hidden item difficulties and spot broken items, using synthetic students.
//  - every item's TRUE difficulty is the design difficulty plus a hidden shift (sd 40 points)
//  - 5 items are "broken" (wrong answer key): nobody can get them right
//  - students answer with a flatter curve than the fitting model assumes, to test robustness
const { fit, loadDesign, engineConstants } = require("./calibrate.js");
const D = loadDesign(), M = engineConstants();
let seed = 987654321; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const ids = [], design = {}, trueB = {};
for (const L of D.LEVELS) for (let k = 0; k < 100; k++) { const it = D.gen(L, k); ids.push(it.id); design[it.id] = it.b; trueB[it.id] = it.b + 40 * gauss(); }
const broken = new Set(["L800-12", "L500-33", "L1100-47", "L300-71", "L900-5"]);
const truth = { W: M.W * 1.15, G: 0.04, SLIP: 0.07 }; // reality is a bit messier than the fitting model
const pTrue = (th, b) => truth.G + (1 - truth.G - truth.SLIP) / (1 + Math.exp(-(th - b) / truth.W));
const rows = []; const N = 1600;
for (let s = 0; s < N; s++) {
  const th = 100 + 1150 * rnd(), sid = s.toString(16).padStart(8, "0");
  const near = ids.filter(id => Math.abs(design[id] - th) < 220); const picks = new Set();
  while (picks.size < 40) picks.add(near[Math.floor(rnd() * near.length)]);
  for (const id of picks) rows.push({ kind: "diag", sid, item: id, ok: broken.has(id) ? rnd() < 0.03 : rnd() < pTrue(th, trueB[id]), hints: 0 });
}
const t0 = Date.now(), res = fit(rows, id => design[id], { min: 20 });
const cal = Object.keys(res.items), meanTrueShift = cal.reduce((s, id) => s + (trueB[id] - design[id]), 0) / cal.length;
let seDesign = 0, seFit = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, n = 0;
for (const id of cal) { if (broken.has(id)) continue; const truthShift = trueB[id] - design[id] - meanTrueShift, est = res.items[id].b - design[id];
  seDesign += truthShift ** 2; seFit += (est - truthShift) ** 2; n++; sx += truthShift; sy += est; sxx += truthShift ** 2; syy += est ** 2; sxy += truthShift * est; }
const corr = (sxy - sx * sy / n) / Math.sqrt((sxx - sx * sx / n) * (syy - sy * sy / n));
const flagged = new Set(res.flags.map(f => f.id)), testable = [...broken].filter(id => res.items[id]);
const caught = testable.filter(id => flagged.has(id)).length;
const falseFlags = res.flags.filter(f => !broken.has(f.id)).length;
console.log(`${rows.length} answers, ${res.persons} sessions, ${cal.length} items recalibrated (n>=20), ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`Error in item difficulty (excluding broken items), points RMS:`);
console.log(`  using design values only: ${Math.sqrt(seDesign / n).toFixed(1)}`);
console.log(`  after calibration:        ${Math.sqrt(seFit / n).toFixed(1)}   (correlation of recovered vs true shifts: ${corr.toFixed(2)})`);
console.log(`Broken-key items flagged: ${caught} of ${testable.length} that had enough data; sound items wrongly flagged: ${falseFlags} of ${cal.length - broken.size}`);
const pass = Math.sqrt(seFit / n) < Math.sqrt(seDesign / n) && corr > 0.4 && caught === testable.length && falseFlags <= 0.03 * cal.length;
console.log(pass ? "PASS: calibration reduces difficulty error and catches broken items." : "FAIL");
process.exit(pass ? 0 : 1);
