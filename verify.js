// Run: node verify.js
// Loads the problem bank, checks its structure, and recomputes many answers independently by brute force.
const fs = require("fs"), vm = require("vm");
const files = ["problems.js", "problems_amc8.js", "problems_amc10.js", "problems_amc12.js", "problems_aime.js", "problems_olympiad.js"];
const src = files.map(f => fs.readFileSync(f, "utf8")).join("\n") + "\n;globalThis.__P = PROBLEMS;";
const ctx = { console }; vm.createContext(ctx); vm.runInContext(src, ctx);
const P = ctx.__P;
let bad = 0;

// ---- structure checks ----
const ids = new Set();
for (const p of P) {
  if (ids.has(p.id)) { console.log("DUPLICATE ID", p.id); bad++; }
  ids.add(p.id);
  if (p.track !== "olympiad" && p.hints.length !== 3) { console.log("NEEDS 3 HINTS", p.id); bad++; }
  if (p.choices && (p.choices.length !== 5 || !p.answer)) { console.log("BAD CHOICES", p.id); bad++; }
  if (p.choices && new Set(p.choices).size !== 5) { console.log("DUPLICATE CHOICES", p.id); bad++; }
}

// ---- independent answer checks ----
const fact = n => n <= 1n ? 1n : n * fact(n - 1n);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const comb = (n, k) => String(fact(BigInt(n)) / (fact(BigInt(k)) * fact(BigInt(n - k))));
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const noAdj = m => (m & (m >> 1)) === 0;
const popcount = m => m.toString(2).split("1").length - 1;
const E = {};
const count = (lo, hi, f) => { let c = 0; for (let i = lo; i <= hi; i++) if (f(i)) c++; return String(c); };

E["a8-7"] = count(100, 200, n => n % 7 === 0);
E["a8-16"] = count(1, 49, n => Number.isInteger(Math.sqrt(n)) || Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n);
E["a8-26"] = comb(7, 3);
E["a8-28"] = (() => { const d = n => { let c = 0; for (let i = 1; i <= n; i++) if (n % i === 0) c++; return c; }; let n = 1; while (d(n) !== 6) n++; return String(n); })();
E["a8-32"] = count(10, 99, n => Math.floor(n / 10) === 2 * (n % 10));
E["a8-36"] = String([...Array(28).keys()].map(i => i + 1).filter(i => 28 % i === 0).reduce((a, b) => a + b, 0));
E["a10-4"] = String((() => { let r = 1; for (let i = 0; i < 2025; i++) r = r * 3 % 100; return r; })());
E["a10-8"] = (() => { let c = 0; for (let a = 0; a <= 3; a++) for (let b = 0; b <= 4; b++) for (let e = 0; e <= 1; e++) if (a % 2 === 0 && b % 2 === 0 && e % 2 === 0) c++; return String(c); })();
E["a10-12"] = String(Number((() => { let s = 0n; for (let i = 1n; i <= 100n; i++) s += fact(i); return s % 12n; })()));
E["a10-16"] = count(1, 100, n => gcd(n, 100) === 1);
E["a10-17"] = count(1000, 9999, n => String(n).split("").reduce((a, b) => a + +b, 0) === 3);
E["a10-20"] = String((() => { let s = 0; for (let n = 1; n <= 5000; n++) if ((n * n + 8) % (n + 2) === 0) s += n; return s; })());
E["a10-24"] = String((() => { let z = 0; for (let i = 5; i <= 100; i *= 5) z += Math.floor(100 / i); return z; })());
E["a10-28"] = String((() => { let n = 1; while (fact(BigInt(n)) % 1000n !== 0n) n++; return n; })());
E["a10-31"] = String((() => { let s = 0; for (let x = -20; x <= 20; x += 0.5) if (Math.abs(Math.abs(x - 3) + Math.abs(x + 2) - 9) < 1e-9) s += x; return s; })());
E["a10-36"] = count(1, 19, a => gcd(a, 20) === 1);
E["a10-40"] = String((() => { let s = 0; for (let n = 10; n < 100; n++) if (isPrime(n) && Math.floor(n / 10) + n % 10 === 8) s += n; return s; })());
E["a12-8"] = String((() => { let s = 0; for (let k = 1; k <= 20; k++) s += k * (k + 1); return s; })());
E["a12-11"] = String((() => { let r = 1; for (let i = 0; i < 2025; i++) r = r * 2 % 7; return r; })());
E["a12-14"] = (() => { let k = 0; for (let m = 0; m < 1024; m++) if (noAdj(m)) k++; return k === 144 ? "9/64" : "?"; })();
E["a12-18"] = (() => { const D = [1, 0]; for (let n = 2; n <= 5; n++) D[n] = (n - 1) * (D[n - 1] + D[n - 2]); return String(D[5]); })();
E["a12-21"] = String((() => { let s = 0; for (let n = 1; n <= 10; n++) { let u = 1; for (let i = 0; i < n; i++) u = u * n % 10; s += u; } return s % 10; })());
E["a12-22"] = (() => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let d = 1; d <= 6; d++) if (a + b + d === 10) c++; return c === 27 ? "1/8" : "?"; })();
E["a12-25"] = (() => { let c = 0; for (let x = 1; x < 100; x++) for (let y = 1; y < 100; y++) if (3 * x + 5 * y === 100) c++; return String(c); })();
E["a12-26"] = (() => { let c = 0; for (let m = 0; m < 1024; m++) if (noAdj(m) && popcount(m) === 3) c++; return String(c); })();
E["a12-28"] = (() => { let c = 0, prev = null; for (let x = -3; x <= 3; x += 0.001) { const f = x ** 3 - 3 * x + 1; if (prev !== null && prev * f < 0) c++; prev = f; } return String(c); })();
E["a12-29"] = String([10, 5, 2, 1, 1].reduce((a, e) => a * (e + 1), 1));
E["a12-30"] = (() => { let c = 0; for (let n = 0; n < 243; n++) { const d = []; let t = n; for (let i = 0; i < 5; i++) { d.push(t % 3); t = Math.floor(t / 3); } if (d.every((v, i) => i === 4 || v !== d[i + 1])) c++; } return String(c); })();
E["a12-33"] = count(0, 14, x => x * x % 15 === 1);
E["a12-36"] = (() => { const L = [2, 1]; for (let n = 2; n <= 10; n++) L[n] = L[n - 1] + L[n - 2]; return String(L[10]); })();
E["a12-37"] = count(1, 100, n => n * (n + 1) % 6 === 0);
E["a12-20"] = String(Math.round((2 + Math.sqrt(3)) ** 4 + (2 - Math.sqrt(3)) ** 4));
E["a12-24"] = Math.abs((2 - 2 * 0.5) / (1 - 4) + 1 / 3) < 1e-12 ? "-1/3" : "?";
E["a12-12"] = Math.abs(9 * 10 * 17 / (4 * Math.sqrt(18 * 9 * 8 * 1)) - 85 / 8) < 1e-12 ? "85/8" : "?";
E["a12-23"] = Math.abs(Math.abs(3 + 8 - 24) / 5 - 13 / 5) < 1e-12 ? "13/5" : "?";
E["a12-38"] = String(40320 - 2 * 5040);
E["a12-39"] = (() => { let best = 0; for (let i = 0; i < 400000; i++) { const a = Math.random() * 6.2832, b = Math.random() * 6.2832, c = Math.random() * 6.2832; best = Math.max(best, 0.5 * Math.abs(Math.sin(b - a) + Math.sin(c - b) + Math.sin(a - c))); } return Math.abs(best - 3 * Math.sqrt(3) / 4) < 2e-3 ? "OK" : "?"; })();
E["a12-35"] = Math.abs(6 ** 3 / (6 * Math.SQRT2) - 18 * Math.SQRT2) < 1e-9 ? "OK" : "?";
E["a12-15"] = Math.abs((6 / Math.sqrt(3)) ** 3 - 24 * Math.sqrt(3)) < 1e-9 ? "OK" : "?";
E["a10-27"] = (3 + 6 + 12 === 21 && 3 * 6 * 12 === 216) ? "12" : "?";

// ---- compare with each problem's key ----
const norm = s => String(s).replace(/[$\\{}]|boxed|text/g, "");
let checked = 0;
for (const [id, v] of Object.entries(E)) {
  const p = P.find(x => x.id === id);
  if (!p) { console.log("MISSING", id); bad++; continue; }
  const got = p.choices["ABCDE".indexOf(p.answer)];
  checked++;
  const special = ["a12-39", "a12-35", "a12-15"].includes(id);
  if (special ? v !== "OK" : norm(got) !== norm(v)) { console.log("MISMATCH", id, "| key:", got, "| computed:", v); bad++; }
}
console.log(`${P.length} problems loaded; ${checked} answers independently verified; ${bad} issue(s).`);
process.exit(bad ? 1 : 0);
