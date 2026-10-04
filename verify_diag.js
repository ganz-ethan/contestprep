// Run: node verify_diag.js   - sanity-checks all 1300 diagnostic items.
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
const D = ctx.window.DIAG;
let bad = 0, total = 0;
const sample = process.argv.includes("--samples");
for (const L of D.LEVELS) {
  const qs = new Set(), skills = new Set(), perStrand = {};
  for (let k = 0; k < 100; k++) {
    let it;
    try { it = D.gen(L, k); } catch (e) { console.log("THROW", L, k, e.message); bad++; continue; }
    total++;
    const pre = `L${L}#${k} [${it.skill}]`;
    if (!Number.isFinite(it.v)) { console.log("NONFINITE", pre, it.v); bad++; }
    if (/NaN|undefined|Infinity|\[object/.test(it.q + it.sol + it.show)) { console.log("BAD TEXT", pre, it.q.slice(0, 120), "|", it.show); bad++; }
    if (!D.check(it, it.show)) { console.log("SELF-CHECK FAIL", pre, it.show); bad++; }
    if (D.check(it, "abc") || D.check(it, "")) { console.log("ACCEPTS GARBAGE", pre); bad++; }
    if (Math.abs(it.v) > 1e9) { console.log("HUGE ANSWER", pre, it.v); bad++; }
    qs.add(it.q); skills.add(it.strand + ":" + it.skill);
    perStrand[it.strand] = (perStrand[it.strand] || 0) + 1;
    if (sample && k < 5) console.log(`  [${L}/${it.strand}] ${it.q}  =>  ${it.show}`);
  }
  const strandOK = ["N", "A", "G", "C", "T"].every(s => perStrand[s] === 20);
  console.log(`Level ${L}: ${qs.size} distinct questions, ${skills.size} skills, strands ${strandOK ? "20 each" : JSON.stringify(perStrand)}`);
  if (qs.size < 90) { console.log("  TOO MANY DUPLICATES at level", L); bad++; }
  if (!strandOK) bad++;
}
// answer parser tests
const P = D.parse;
const cases = [["3/4", 0.75], ["-3/4", -0.75], ["0.75", 0.75], ["1 1/2", 1.5], ["x = 5", 5], ["25%", 25], ["$12", 12], ["1,234", 1234], ["12 degrees", 12], ["−7", -7], [".5", 0.5], ["6/8", 0.75]];
for (const [s, v] of cases) { const x = P(s); if (!(Math.abs(x - v) < 1e-9)) { console.log("PARSE FAIL", JSON.stringify(s), x, "expected", v); bad++; } }
console.log(`${total} items generated; ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
