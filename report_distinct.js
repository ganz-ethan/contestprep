// Run: node report_distinct.js [--min 290]
// For every level and subject: how many of the 300 items are distinct questions? Exits 1 if any cell is below --min.
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
const D = ctx.window.DIAG;
const args = process.argv.slice(2), MIN = args.includes("--min") ? +args[args.indexOf("--min") + 1] : 290;
let worst = [], total = 0, distinct = 0;
const t0 = Date.now();
console.log("Distinct questions out of " + D.PER_STRAND + " per cell (level x subject):");
console.log("level  " + D.STRANDS.map(s => s.padStart(5)).join(" ") + "   templates(N,A,G,C,T)");
for (const L of D.LEVELS) {
  const row = [];
  for (const s of D.STRANDS) {
    const seen = new Set(); let n = 0;
    for (let k = D.STRANDS.indexOf(s); k < D.PER_LEVEL; k += 5) { seen.add(D.gen(L, k).q); n++; }
    row.push(seen.size); total += n; distinct += seen.size;
    if (seen.size < MIN) worst.push({ L, s, distinct: seen.size, templates: D.REG[L][s].map(t => t.name) });
  }
  console.log(String(L).padStart(5) + "  " + row.map(x => String(x).padStart(5)).join(" ") + "   " + D.STRANDS.map(s => D.REG[L][s].length).join(","));
}
console.log(`\n${distinct} distinct of ${total} items (${(100 * distinct / total).toFixed(1)}%). Built in ${((Date.now() - t0) / 1000).toFixed(1)}s.`);
if (worst.length) { console.log(`\n${worst.length} cells below ${MIN}:`); worst.sort((a, b) => a.distinct - b.distinct).forEach(w => console.log(`  level ${w.L} ${w.s}: ${w.distinct}  [${w.templates.join(" | ")}]`)); }
if (args.includes("--templates")) { // which question types repeat themselves?
  console.log("\nQuestion types that repeat (assigned items vs distinct questions):");
  for (const L of D.LEVELS) for (const s of D.STRANDS) {
    const per = {};
    for (let k = D.STRANDS.indexOf(s); k < D.PER_LEVEL; k += 5) { const it = D.gen(L, k); const p = per[it.skill] = per[it.skill] || { n: 0, seen: new Set() }; p.n++; p.seen.add(it.q); }
    for (const [name, p] of Object.entries(per)) if (p.seen.size < p.n * 0.9) console.log(`  L${L} ${s} "${name}": ${p.seen.size} distinct of ${p.n}`);
  }
}
process.exit(worst.length ? 1 : 0);
