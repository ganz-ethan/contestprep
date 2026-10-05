// Run: node verify_diag.js [--samples]
// Sanity-checks every diagnostic item (13 levels x 1,500 = 19,500): generates, answer is finite and exactly representable,
// the shown answer parses back to the key, ids are unique and round-trip, subjects are balanced, and questions are distinct.
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
const D = ctx.window.DIAG;
let bad = 0, total = 0, dups = 0;
const sample = process.argv.includes("--samples");
const ids = new Set();
for (const L of D.LEVELS) {
  const qs = new Set(), skills = new Set(), perStrand = {}, cellQ = {};
  for (let k = 0; k < D.PER_LEVEL; k++) {
    let it;
    try { it = D.gen(L, k); } catch (e) { console.log("THROW", L, k, e.message); bad++; continue; }
    total++;
    const pre = `L${L}#${k} [${it.skill}]`;
    if (ids.has(it.id)) { console.log("DUPLICATE ID", it.id); bad++; } ids.add(it.id);
    const pid = D.parseId(it.id); if (!pid || pid.level !== L || pid.k !== k) { console.log("ID DOES NOT ROUND-TRIP", it.id); bad++; }
    if (it.strand !== D.STRANDS[k % 5]) { console.log("WRONG STRAND", pre); bad++; }
    if (!Number.isFinite(it.v)) { console.log("NONFINITE", pre, it.v); bad++; }
    if (/NaN|undefined|Infinity|\[object/.test(it.q + it.sol + it.show)) { console.log("BAD TEXT", pre, it.q.slice(0, 120), "|", it.show); bad++; }
    if (/\d(?:\.\d+)?e[+-]\d{2,}/.test(it.q) || /\d(?:\.\d+)?e[+-]\d{2,}/.test(it.sol) || /\d(?:\.\d+)?e[+-]\d{2,}/.test(it.show)) { /* JS prints very large/small numbers like 1.2e+23 */ console.log("NUMBER PRINTED IN SCIENTIFIC NOTATION", pre, it.q.slice(0, 100)); bad++; }
    if (!it.sol || it.sol.length < 5) { console.log("EMPTY SOLUTION", pre); bad++; }
    if (!D.check(it, it.show)) { console.log("SELF-CHECK FAIL", pre, it.show); bad++; }
    if (D.check(it, "abc") || D.check(it, "")) { console.log("ACCEPTS GARBAGE", pre); bad++; }
    if (Number.isInteger(it.v) && !Number.isSafeInteger(it.v)) { console.log("NOT EXACTLY REPRESENTABLE", pre, it.v); bad++; }
    if (Math.abs(it.v) > 1e13) { console.log("UNREASONABLY LARGE ANSWER", pre, it.v); bad++; }
    if (/^\d+\/\d+$/.test(it.show)) { const [n, d] = it.show.split("/").map(Number); if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) { console.log("FRACTION TOO LARGE", pre, it.show); bad++; } }
    if (it.b < L || it.b > L + 100) { console.log("DIFFICULTY OUT OF BAND", pre, it.b); bad++; }
    if (it.dup) dups++;
    qs.add(it.q); skills.add(it.strand + ":" + it.skill);
    perStrand[it.strand] = (perStrand[it.strand] || 0) + 1;
    (cellQ[it.strand] = cellQ[it.strand] || new Set()).add(it.q);
    if (sample && k < 5) console.log(`  [${L}/${it.strand}] ${it.q}  =>  ${it.show}`);
  }
  const strandOK = D.STRANDS.every(s => perStrand[s] === D.PER_STRAND);
  const minCell = Math.min(...D.STRANDS.map(s => cellQ[s].size));
  console.log(`Level ${L}: ${qs.size} distinct of ${D.PER_LEVEL}, ${skills.size} skills, subjects ${strandOK ? D.PER_STRAND + " each" : JSON.stringify(perStrand)}, thinnest subject ${minCell} distinct`);
  if (minCell < 280) { console.log("  A SUBJECT HAS TOO FEW DISTINCT QUESTIONS at level", L); bad++; }
  if (!strandOK) bad++;
}
// answer parser tests
const P = D.parse;
const cases = [["3/4", 0.75], ["-3/4", -0.75], ["0.75", 0.75], ["1 1/2", 1.5], ["x = 5", 5], ["25%", 25], ["$12", 12], ["1,234", 1234], ["12 degrees", 12], ["−7", -7], [".5", 0.5], ["6/8", 0.75]];
for (const [s, v] of cases) { const x = P(s); if (!(Math.abs(x - v) < 1e-9)) { console.log("PARSE FAIL", JSON.stringify(s), x, "expected", v); bad++; } }
console.log(`${total} items generated (${total - dups} distinct questions, ${dups} unavoidable repeats); ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
