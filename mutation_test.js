// Run: node mutation_test.js
// Proves verify_diag2.js can catch wrong answer keys: plants a deliberate bug in a scratch copy of the generators and checks
// that the independent verifier reports mismatches for exactly that skill. A verifier that never fails proves nothing.
const fs = require("fs"), path = require("path"), os = require("os"), { spawnSync } = require("child_process");
const src = fs.readFileSync("diag_items.js", "utf8"), checker = fs.readFileSync("verify_diag2.js", "utf8");
// [description, text to find (must exist in the LIVE template), replacement with a bug, "level|skill" that must be flagged]
const MUT = [
  ["300 Area of a square (+1)", "What is its area in square meters?`,a:s*s,", "What is its area in square meters?`,a:s*s+1,", "300|Area of a square"],
  ["1100 Derangements (+1)", "a:derange(n),s:`$D_{${n}}=", "a:derange(n)+1,s:`$D_{${n}}=", "1100|Derangements"],
  ["800 Hypotenuse (+1)", "What is the hypotenuse?`,a:c,", "What is the hypotenuse?`,a:c+1,", "800|Hypotenuse"],
  ["1300 Pairs with LCM equal to N (2e+2 instead of 2e+1)", "a:es.reduce((a,e)=>a*(2*e+1),1),s:`Multiply $(2e+1)$ over the prime exponents of ${N}.`", "a:es.reduce((a,e)=>a*(2*e+2),1),s:`Multiply $(2e+1)$ over the prime exponents of ${N}.`", "1300|Pairs with LCM equal to N"],
  ["700 Handshakes (extra n)", "How many handshakes are there?`,a:n*(n-1)/2,", "How many handshakes are there?`,a:n*(n-1)/2+n,", "700|Handshakes"],
  ["1000 Trailing zeros (forgot the 25s)", "i *= 5) z += Math.floor(n / i);", "i *= 5) z += Math.floor(n / 5);", "1000|Trailing zeros of a factorial"],
];
let caught = 0, ran = 0;
for (const [name, from, to, skill] of MUT) {
  const n = src.split(from).length - 1;
  if (n < 1) { console.log(`SKIPPED (pattern not found; update the test): ${name}`); continue; }
  ran++;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mut-"));
  fs.writeFileSync(path.join(dir, "diag_items.js"), src.split(from).join(to));
  fs.writeFileSync(path.join(dir, "verify_diag2.js"), checker);
  const r = spawnSync(process.execPath, ["verify_diag2.js"], { cwd: dir, encoding: "utf8" });
  const flagged = r.stdout.includes("[" + skill + "]"), failed = r.status !== 0;
  console.log(`${flagged && failed ? "CAUGHT " : "MISSED!"} ${name}`);
  if (flagged && failed) caught++;
}
console.log(`${caught} of ${ran} planted bugs were caught${ran < MUT.length ? ` (${MUT.length - ran} patterns need updating)` : ""}.`);
process.exit(caught === ran && ran > 0 && ran === MUT.length ? 0 : 1);
