const gcd = (a, b) => b ? gcd(b, a % b) : a;
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const nd = n => { let c = 0; for (let i = 1; i <= n; i++) if (n % i === 0) c++; return c; };
const out = {};
// 6: strictly increasing 4-digit
{ let c = 0; for (let n = 1000; n <= 9999; n++) { const d = String(n).split("").map(Number); if (d[0] < d[1] && d[1] < d[2] && d[2] < d[3]) c++; } out["aime-6"] = c; }
// 7: n<1000 with exactly 8 divisors
{ let c = 0; for (let n = 1; n < 1000; n++) if (nd(n) === 8) c++; out["aime-7"] = c; }
// 8: n^2+10n+2024 perfect square
{ let s = 0; for (let n = 1; n < 100000; n++) { const v = n * n + 10 * n + 2024, r = Math.round(Math.sqrt(v)); if (r * r === v) s += n; } out["aime-8"] = s; }
// 9: a1=a2=1, a_n = a_{n-1}+2a_{n-2}; a_15 mod 1000
{ let a = 1n, b = 1n; for (let i = 3; i <= 15; i++) [a, b] = [b, b + 2n * a]; out["aime-9"] = Number(b % 1000n); out["aime-9-full"] = Number(b); }
// 10: surjections 6 -> 3
{ let c = 0; for (let m = 0; m < 729; m++) { let x = m, seen = 0; for (let i = 0; i < 6; i++) { seen |= 1 << (x % 3); x = Math.floor(x / 3); } if (seen === 7) c++; } out["aime-10"] = c; }
// 11: 8 flips exactly 4 heads m+n
{ const g = gcd(70, 256); out["aime-11"] = 70 / g + 256 / g; }
// 12: n<1000 neither square nor cube
{ let c = 0; for (let n = 1; n < 1000; n++) { const s = Math.round(Math.sqrt(n)), t = Math.round(Math.cbrt(n)); if (s * s !== n && t * t * t !== n) c++; } out["aime-12"] = c; }
// 13: x+y=6, xy=4 -> x^4+y^4
out["aime-13"] = (36 - 8) ** 2 - 2 * 16;
// 14: obtuse triangles 12-gon
{ let obt = 0, rt = 0, ac = 0; for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) { const arcs = [b - a, c - b, 12 - (c - a)]; const m = Math.max(...arcs); if (m > 6) obt++; else if (m === 6) rt++; else ac++; } out["aime-14"] = { obt, rt, ac }; }
// 15: 5-letter words over {A,B,C} using all letters
{ let c = 0; for (let m = 0; m < 243; m++) { let x = m, seen = 0; for (let i = 0; i < 5; i++) { seen |= 1 << (x % 3); x = Math.floor(x / 3); } if (seen === 7) c++; } out["aime-15"] = c; }
// 16: divisors of 60^5 that are perfect cubes
{ const N = 60n ** 5n; let c = 0; const lim = 60 ** 5; // divisors via exponents
  for (let a = 0; a <= 10; a++) for (let b = 0; b <= 5; b++) for (let e = 0; e <= 5; e++) { const d = 2 ** a * 3 ** b * 5 ** e; const r = Math.round(Math.cbrt(d)); if (r ** 3 === d) c++; } out["aime-16"] = c; }
// 17: partitions of 20 into 3 positive parts a<=b<=c
{ let c = 0; for (let a = 1; a <= 20; a++) for (let b = a; b <= 20; b++) { const cc = 20 - a - b; if (cc >= b) c++; } out["aime-17"] = c; }
// 18: binary strings length 8 no three equal consecutive
{ let c = 0; for (let m = 0; m < 256; m++) { let ok = true; for (let i = 0; i + 2 < 8; i++) { const x = m >> i & 1, y = m >> (i + 1) & 1, z = m >> (i + 2) & 1; if (x === y && y === z) ok = false; } if (ok) c++; } out["aime-18"] = c; }
// 19: squares on 4x4 grid of points (any orientation)
{ const pts = []; for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) pts.push([x, y]); const set = new Set(pts.map(p => p.join())); const seen = new Set(); let c = 0;
  for (const p of pts) for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) { if (!dx && !dy) continue; const q = [p[0] + dx, p[1] + dy], r = [q[0] - dy, q[1] + dx], s = [p[0] - dy, p[1] + dx]; if ([q, r, s].every(z => set.has(z.join()))) { const key = [p, q, r, s].map(z => z.join()).sort().join("|"); if (!seen.has(key)) { seen.add(key); c++; } } } out["aime-19"] = c; }
// 20: m^2-n^2=5040 positive integer pairs
{ let c = 0; for (let n = 1; n < 3000; n++) { const m2 = 5040 + n * n, m = Math.round(Math.sqrt(m2)); if (m * m === m2) c++; } out["aime-20"] = c; }
// 21: sum_{n=1}^{30} floor(n^2/3) mod 1000
{ let s = 0; for (let n = 1; n <= 30; n++) s += Math.floor(n * n / 3); out["aime-21"] = s % 1000; out["aime-21-full"] = s; }
// 22: 7 red 5 blue draw 3 all same color  m+n
{ const num = C(7, 3) + C(5, 3), den = C(12, 3), g = gcd(num, den); out["aime-22"] = num / g + den / g; out["aime-22-frac"] = [num / g, den / g]; }
// 23: subsets of {1..10} with sum divisible by 5
{ let c = 0; for (let m = 0; m < 1024; m++) { let s = 0; for (let i = 0; i < 10; i++) if (m >> i & 1) s += i + 1; if (s % 5 === 0) c++; } out["aime-23"] = c; }
// 24: sum of n<=50 with gcd(n,6)=1
{ let s = 0, c = 0; for (let n = 1; n <= 50; n++) if (gcd(n, 6) === 1) { s += n; c++; } out["aime-24"] = s; out["aime-24-count"] = c; }
// 25: AI^2+BI^2+CI^2 for 13-14-15 with B=(0,0) C=(14,0) A=(5,12)
{ const A = [5, 12], B = [0, 0], Cc = [14, 0], a = 14, b = 15, c = 13; const I = [(a * A[0] + b * B[0] + c * Cc[0]) / (a + b + c), (a * A[1] + b * B[1] + c * Cc[1]) / (a + b + c)]; const d2 = P => (P[0] - I[0]) ** 2 + (P[1] - I[1]) ** 2; out["aime-25"] = d2(A) + d2(B) + d2(Cc); out["I"] = I; }
// 26: n<=100 with floor(n/2)+floor(n/3)+floor(n/6)=n-1
{ let c = 0; for (let n = 1; n <= 100; n++) if (Math.floor(n / 2) + Math.floor(n / 3) + Math.floor(n / 6) === n - 1) c++; out["aime-26"] = c; }
// 27: 4*AH for 13-14-15: orthocenter
{ const A = [5, 12], B = [0, 0], Cc = [14, 0]; const H = [5, 5 * 9 / 12]; out["aime-27"] = 4 * (A[1] - H[1]); // check H: BH perp AC
  const dot = (H[0] - B[0]) * (Cc[0] - A[0]) + (H[1] - B[1]) * (Cc[1] - A[1]); out["H-check"] = dot; }
// 28: tangent circles radius 4 and 9 and line: r=36/25 -> 25r
out["aime-28"] = 36;
{ // numeric check: circles tangent to x-axis centers (x1,4),(x2,9) with |x1-x2| = 2*sqrt(36)=12; third circle radius r: tangent line, tangent to both externally
  const r = 36 / 25; const d = (a, b) => 2 * Math.sqrt(a * b); out["tangent-check"] = [d(4, r) + d(r, 9), d(4, 9)]; }
// 29: median to side 9 in triangle 7,8,9: 4m^2
{ const A = [0, 0], B = [9, 0]; const x = (7 * 7 - 8 * 8 + 81) / 18 * 0; // place side 9 as BC: B=(0,0), C=(9,0); AB=7, AC=8
  const ax = (49 - 64 + 81) / 18, ay = Math.sqrt(49 - ax * ax); const mx = 4.5; out["aime-29"] = Math.round(4 * ((ax - mx) ** 2 + ay ** 2)); }
// 30: sum of all positive n s.t. n^2+? "n^2+n+... " alternative: count ordered pairs (a,b) with a,b in 1..30, a+b divisible by 7
{ let c = 0; for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) if ((a + b) % 7 === 0) c++; out["aime-30"] = c; }

// ---- compare with the bank ----
const fs = require("fs"), vm = require("vm");
const files = ["problems.js","problems_amc8.js","problems_amc10.js","problems_amc12.js","problems_aime.js","problems_olympiad.js"];
const ctx = { console }; vm.createContext(ctx);
vm.runInContext(files.map(f => fs.readFileSync(f, "utf8")).join("\n") + "\n;globalThis.__P = PROBLEMS;", ctx);
const P = ctx.__P; let bad = 0, checked = 0;
const expected = { ...out, ...require("./aime_brute_31_60.js")() }; expected["aime-14"] = out["aime-14"].obt;
// the 60 AIME ids must be exactly aime-1 .. aime-60, each once
{ const ids = P.filter(p => p.track === "aime").map(p => p.id).sort(); const want = Array.from({ length: 60 }, (_, i) => "aime-" + (i + 1)).sort(); if (JSON.stringify(ids) !== JSON.stringify(want)) { console.log("AIME ids are not exactly aime-1..aime-60"); bad++; } }
for (const p of P.filter(p => p.track === "aime")) {
  if (!Number.isInteger(p.answer) || p.answer < 0 || p.answer > 999) { console.log("AIME answer out of range", p.id, p.answer); bad++; }
  if (p.hints.length !== 3) { console.log("needs 3 hints", p.id); bad++; }
  if (expected[p.id] !== undefined) { checked++; if (expected[p.id] !== p.answer) { console.log("MISMATCH", p.id, "key", p.answer, "brute force", expected[p.id]); bad++; } }
}
// hand-derived original five (aime-1..5) re-checked by brute force too
{ let c = 0; for (let n = 1; n <= 1000; n++) if ((n % 6 === 0) + (n % 10 === 0) + (n % 15 === 0) === 1) c++; checked++; if (c !== P.find(p => p.id === "aime-1").answer) { console.log("aime-1 mismatch", c); bad++; } }
{ let r = 1; for (let i = 0; i < 2025; i++) r = r * 2 % 1000; checked++; if (r !== P.find(p => p.id === "aime-2").answer) { console.log("aime-2 mismatch", r); bad++; } }
{ // paths (0,0)->(6,6) never above y=x
  const dp = Array.from({ length: 7 }, () => Array(7).fill(0)); dp[0][0] = 1; for (let x = 0; x <= 6; x++) for (let y = 0; y <= x; y++) if (x || y) dp[x][y] = (x ? dp[x - 1][y] : 0) + (y ? dp[x][y - 1] : 0); checked++; if (dp[6][6] !== P.find(p => p.id === "aime-3").answer) { console.log("aime-3 mismatch", dp[6][6]); bad++; } }
{ const s = 21, K = Math.sqrt(s * 8 * 7 * 6); checked++; if (Math.round(8 * 13 * 14 * 15 / (4 * K)) !== P.find(p => p.id === "aime-4").answer) { console.log("aime-4 mismatch"); bad++; } }
{ let c = 0; for (let x = 13; x <= 12 + 144; x++) if ((12 * x) % (x - 12) === 0) c++; checked++; if (c !== P.find(p => p.id === "aime-5").answer) { console.log("aime-5 mismatch", c); bad++; } }
console.log(P.filter(p => p.track === "aime").length + " AIME problems; " + checked + " answers verified by brute force; " + bad + " issue(s).");
process.exit(bad ? 1 : 0);
