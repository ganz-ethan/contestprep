// Run: node print_skills.js [level]   - one sample question per skill (for reading wording and spot-checking answers)
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
const D = ctx.window.DIAG, only = process.argv[2] ? +process.argv[2] : null;
for (const L of D.LEVELS) { if (only && L !== only) continue;
  const seen = new Set(); console.log(`\n=== Level ${L}: ${D.LEVEL_NAME[L]} ===`);
  for (let k = 600; k < D.PER_LEVEL; k++) { // sample from the middle of the difficulty range
    const it = D.gen(L, k), key = it.strand + it.skill; if (seen.has(key)) continue; seen.add(key);
    console.log(`[${it.strand}] ${it.skill} | ${it.q.replace(/\s+/g, " ").slice(0, 190)}  =>  ${it.show}`); }
}
