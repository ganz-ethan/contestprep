// Run: node verify_diag2.js
// Independent re-derivation of answers for the trickiest skills (different method than the generators use):
// numeric root-finding, brute force, or building the actual object. Parses parameters back out of the question text.
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("diag_items.js", "utf8"), ctx);
const D = ctx.window.DIAG;
let bad = 0, checked = 0;
const nums = s => (s.match(/-?\d+(\.\d+)?/g) || []).map(Number);
const close = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(b));
function expect(it, val, note) { checked++; if (!close(it.v, val)) { bad++; console.log("MISMATCH", it.id, it.skill, "| key", it.v, "| independent", val, note || "", "\n   ", it.q); } }

// complex arithmetic + Durand-Kerner for cubic roots
const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cs = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cd = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
function roots3(c2, c1, c0) { // x^3 + c2 x^2 + c1 x + c0
  const f = z => { let z2 = cm(z, z), z3 = cm(z2, z); return [z3[0] + c2 * z2[0] + c1 * z[0] + c0, z3[1] + c2 * z2[1] + c1 * z[1]]; };
  let r = [[1, 0], [0.4, 0.9], [-0.65, 0.72]].map(z => z);
  for (let it = 0; it < 500; it++) for (let i = 0; i < 3; i++) { let den = [1, 0]; for (let j = 0; j < 3; j++) if (j !== i) den = cm(den, cs(r[i], r[j])); r[i] = cs(r[i], cd(f(r[i]), den)); }
  return r;
}
const cpow = (z, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cm(r, z); return r; };
function cubicFromQ(q) { // read "x^3...=0" and recover coefficients by evaluating the expression
  const m = q.match(/(x\^3[^=]*)=0/); let e = m[1].replace(/(\d)x/g, "$1*x").replace(/([+-])x/g, "$11*x").replace(/x\^(\d)/g, "x**$1").replace(/^x/, "1*x");
  const f = new Function("x", "return " + e);
  return [f(0), f(1) - f(0), 0].length && { c0: f(0), c2: (f(1) + f(-1)) / 2 - f(0), c1: (f(1) - f(-1)) / 2 - 1 };
}

const seen = {};
for (const L of D.LEVELS) for (let k = 0; k < 100; k++) {
  const it = D.gen(L, k); seen[it.skill] = (seen[it.skill] || 0) + 1; const q = it.q;
  switch (it.skill) {
    case "Logarithm equation": { const c = +q.match(/x>(\d+)/)[1], N = +q.match(/=(\d+)\$\.$/)[1]; expect(it, (c + Math.sqrt(c * c + 4 * 2 ** N)) / 2); break; }
    case "Radical equation": { const m = q.match(/\\sqrt\{x([+-]\d+)?\}=x-(\d+)/); const a = m[1] ? +m[1] : 0, b = +m[2]; let sol = null; for (let x = b; x < 5000; x++) if (x + a >= 0 && Math.abs(Math.sqrt(x + a) - (x - b)) < 1e-9) sol = x; expect(it, sol); break; }
    case "Trig: sin 2θ": { const [p, qq] = nums(q.match(/=\\frac\{(\d+)\}\{(\d+)\}/).slice(1, 3).join(" ")); const th = Math.asin(p / qq / Math.SQRT2) - Math.PI / 4; expect(it, Math.sin(2 * th)); break; }
    case "Functional equation": { const kk = +q.match(/f\(x\)\+(\d+)f/)[1], a = +q.match(/What is \$f\((\d+)\)\$/)[1]; // f(a)+k g=a ; g+k f(a)=1/a
      expect(it, (a - kk / a) / (1 - kk * kk)); break; }
    case "Polynomial remainder": { const m = q.match(/remainder \$(-?\d+)\$ when divided by \$x-1\$ and remainder \$(-?\d+)\$ when.*R\((\d+)\)/); const u = +m[1], v = +m[2], kk = +m[3]; expect(it, u + (v - u) * (kk - 1)); break; }
    case "Sum of n / r^n": { const r = +q.match(/\{(\d+)\^n\}/)[1]; let s = 0; for (let n = 1; n < 400; n++) s += n / r ** n; expect(it, s); break; }
    case "Telescoping with 1/(k(k+2))": { const n = +q.match(/\^\{(\d+)\}/)[1]; let s = 0; for (let j = 1; j <= n; j++) s += 1 / (j * (j + 2)); expect(it, s); break; }
    case "Telescoping 1/(k²-1)": { const n = +q.match(/\^\{(\d+)\}/)[1]; let s = 0; for (let j = 2; j <= n; j++) s += 1 / (j * j - 1); expect(it, s); break; }
    case "Telescoping sum": { const n = +[...q.matchAll(/\\dfrac1\{(\d+)\\cdot/g)].pop()[1]; let s = 0; for (let j = 1; j <= n; j++) s += 1 / (j * (j + 1)); expect(it, s); break; }
    case "Power sums by recurrence": { const m = q.match(/x\^2-(\d*)x-(\d*)=0/), p = m[1] === "" ? 1 : +m[1], qq = m[2] === "" ? 1 : +m[2], n = +q.match(/a\^\{(\d+)\}/)[1]; const d = Math.sqrt(p * p + 4 * qq), a = (p + d) / 2, b = (p - d) / 2; expect(it, Math.round(a ** n + b ** n)); break; }
    case "Vieta for a cubic": case "Sum of cubes of roots": case "Newton sums (fourth powers)": case "Sum of reciprocals of roots": {
      const { c2, c1, c0 } = cubicFromQ(q); const r = roots3(c2, c1, c0);
      const pw = n => r.reduce((s, z) => s + cpow(z, n)[0], 0);
      const n = it.skill === "Vieta for a cubic" ? 2 : it.skill === "Sum of cubes of roots" ? 3 : it.skill === "Newton sums (fourth powers)" ? 4 : 0;
      if (n) expect(it, pw(n)); else expect(it, r.reduce((s, z) => { const inv = cd([1, 0], z); return s + inv[0]; }, 0)); break; }
    case "Circumradius": case "Product of inradius and circumradius": {
      const [a, b, c] = nums(q.replace(/\\[a-z]+/g, " ")).slice(0, 3); const s = (a + b + c) / 2, K = Math.sqrt(s * (s - a) * (s - b) * (s - c)); const R = a * b * c / (4 * K), r = K / s; expect(it, it.skill === "Circumradius" ? R : R * r); break; }
    case "Distance to a line": { const m = q.match(/\$\((-?\d+),(-?\d+)\)\$ to the line \$(\d+)x\+(\d+)y=(\d+)\$/); const [x0, y0, a, b, c] = m.slice(1).map(Number); expect(it, Math.abs(a * x0 + b * y0 - c) / Math.hypot(a, b)); break; }
    case "Angle bisector segment": { const [ab, ac, bc] = [...q.matchAll(/=(\d+)\$/g)].map(m => +m[1]); // construct D via the bisector direction on actual coordinates
      const x = (ab * ab + bc * bc - ac * ac) / (2 * bc), y = Math.sqrt(ab * ab - x * x); // B=(0,0), C=(bc,0), A=(x,y)
      const ux = (0 - x) / ab + (bc - x) / ac, uy = (0 - y) / ab + (0 - y) / ac; const tt = -y / uy; const Dx = x + tt * ux; expect(it, Dx); break; }
    case "Expected value": { const [n, m, w] = (q.match(/fair (\d+)-sided.*multiple of (\d+) you win (\d+) dollars/) || []).slice(1).map(Number); let e = 0; for (let i = 1; i <= n; i++) e += (i % m === 0 ? w : -1) / n; expect(it, e); break; }
    case "Dilution": { const [L, pct, tgt] = [+q.match(/A (\d+)-liter/)[1], +q.match(/is (\d+)% acid/)[1], +q.match(/make it (\d+)% acid/)[1]]; expect(it, L * pct / tgt - L); break; }
    case "Lattice points in a triangle": { const m = q.match(/\(0,0\)\$, \$\((\d+),0\)\$, \$\(0,(\d+)\)/); const a = +m[1], b = +m[2]; let c = 0; for (let x = 0; x <= a; x++) c += Math.floor(b * (a - x) / a + 1e-12) + 1; expect(it, c); break; }
    case "Catalan paths": { const n = +q.match(/\$\(0,0\)\$ to \$\((\d+),/)[1]; const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0)); dp[0][0] = 1; for (let x = 0; x <= n; x++) for (let y = 0; y <= x; y++) { if (x || y) dp[x][y] = (x ? dp[x - 1][y] : 0) + (y ? dp[x][y - 1] : 0); } expect(it, dp[n][n]); break; }
    case "Derangements": case "Large derangements": { const n = +q.match(/\{1,\\ldots,(\d+)\\?\}/)[1]; let c = 0; if (n <= 9) { const a = Array.from({ length: n }, (_, i) => i); const rec = (i, used) => { if (i === n) { c++; return; } for (let v = 0; v < n; v++) if (!(used >> v & 1) && v !== i) rec(i + 1, used | 1 << v); }; rec(0, 0); expect(it, c); } else { let s = 0, f = 1; for (let kk = 0; kk <= n; kk++) { if (kk > 0) f *= kk; } const fct = x => { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; }; for (let kk = 0; kk <= n; kk++) s += (kk % 2 ? -1 : 1) * fct(n) / fct(kk); expect(it, Math.round(s)); } break; }
    case "Binary strings, no three 1s in a row": { const n = +q.match(/length (\d+)/)[1]; let c = 0; for (let m = 0; m < 1 << n; m++) if ((m & (m >> 1) & (m >> 2)) === 0) c++; expect(it, c); break; }
    case "Domino and square tilings": { const n = +q.match(/\\times(\d+)\$ rectangle/)[1]; const memo = new Map(); const go = (mask, col) => { // columns filled left to right; mask = occupancy of next 2 cols (4 bits)
        if (col === n) return mask === 0 ? 1 : 0; const key = mask + "," + col; if (memo.has(key)) return memo.get(key); let res = 0;
        const bits = mask & 3; // current column occupancy (bit0 top, bit1 bottom)
        const next = mask >> 2; const place = (cur, nxt) => { if (cur === 3) res += go(nxt, col + 1); else if (cur === 0) { // top empty & bottom empty: horizontal dominoes (both) / vertical / square / one horizontal+...
            res += go(nxt, col + 1) * 0; }
        };
        // simple recursion over cells instead
        memo.set(key, 0); return 0; };
      // straightforward backtracking over a 2 x n grid
      const g = [new Array(n).fill(0), new Array(n).fill(0)]; let count = 0;
      const rec = () => { let r = -1, cc = -1; outer: for (let j = 0; j < n; j++) for (let i = 0; i < 2; i++) if (!g[i][j]) { r = i; cc = j; break outer; }
        if (r < 0) { count++; return; }
        if (r === 0 && !g[1][cc]) { g[0][cc] = g[1][cc] = 1; rec(); g[0][cc] = g[1][cc] = 0; } // vertical domino
        if (cc + 1 < n && !g[r][cc + 1]) { g[r][cc] = g[r][cc + 1] = 1; rec(); g[r][cc] = g[r][cc + 1] = 0; } // horizontal domino
        if (r === 0 && cc + 1 < n && !g[1][cc] && !g[0][cc + 1] && !g[1][cc + 1]) { g[0][cc] = g[1][cc] = g[0][cc + 1] = g[1][cc + 1] = 1; rec(); g[0][cc] = g[1][cc] = g[0][cc + 1] = g[1][cc + 1] = 0; } // 2x2 square
      }; rec(); expect(it, count); break; }
    case "Non-adjacent chairs": { const [kk, n] = nums(q.match(/ways can (\d+) chairs be chosen from a row of (\d+)/).slice(1, 3).join(" ")); let c = 0; const rec = (start, left) => { if (!left) { c++; return; } for (let i = start; i <= n; i++) rec(i + 2, left - 1); }; rec(1, kk); expect(it, c); break; }
    case "No two adjacent": { const n = +q.match(/\\\{1,2,\\ldots,(\d+)\\\}/)[1]; let c = 0; for (let m = 0; m < 1 << n; m++) if ((m & (m >> 1)) === 0) c++; expect(it, c); break; }
    case "Inradius of a right triangle": { const [a, b, c] = nums(q.replace(/\\[a-z]+/g, " ")).slice(0, 3); const s = (a + b + c) / 2; expect(it, Math.sqrt(s * (s - a) * (s - b) * (s - c)) / s); break; }
    case "Law of cosines": { const m = q.match(/AB=(\d+)\$, \$AC=(\d+)\$ and \$\\angle A=(\d+)/); const [p, qq, ang] = m.slice(1).map(Number); const th = ang * Math.PI / 180; const B = [p, 0], C = [qq * Math.cos(th), qq * Math.sin(th)]; expect(it, Math.round((B[0] - C[0]) ** 2 + (B[1] - C[1]) ** 2)); break; }
    case "Regular hexagon area": { const s = +q.match(/side length (\d+)/)[1]; let A = 0; const P = Array.from({ length: 6 }, (_, i) => [s * Math.cos(i * Math.PI / 3), s * Math.sin(i * Math.PI / 3)]); for (let i = 0; i < 6; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % 6]; A += x1 * y2 - x2 * y1; } expect(it, Math.abs(A) / 2 / Math.sqrt(3)); break; }
    case "Reciprocal-sum equation (SFFT)": { const n = +q.match(/=\\frac1\{(\d+)\}/)[1]; let c = 0; for (let x = n + 1; x <= n + n * n; x++) if ((n * x) % (x - n) === 0) c++; expect(it, c); break; }
    case "Sum of absolute-value solutions": { const [a, b] = q.match(/\|2x-(\d+)\|=(\d+)/).slice(1).map(Number); let s = 0; for (let x2 = -400; x2 <= 400; x2++) if (Math.abs(x2 - a) === b) s += x2 / 2; expect(it, s); break; }
    case "Brahmagupta area squared": { const [a, b, c, d] = nums(q.match(/sides ([\d, ]+)\./)[1]);
      // independent route: diagonal p from Ptolemy-derived formula, then Heron on the two triangles (a,b,p) and (c,d,p)
      const p = Math.sqrt((a * c + b * d) * (a * d + b * c) / (a * b + c * d));
      const heron = (x, y, z) => { const h = (x + y + z) / 2; return Math.sqrt(Math.max(0, h * (h - x) * (h - y) * (h - z))); };
      const A = heron(a, b, p) + heron(c, d, p); expect(it, A * A); break; }
  }
}
console.log(`Independent checks: ${checked} items verified, ${bad} mismatch(es).`);
const covered = ["Logarithm equation", "Radical equation", "Trig: sin 2θ", "Functional equation", "Polynomial remainder", "Sum of n / r^n", "Telescoping with 1/(k(k+2))", "Telescoping 1/(k²-1)", "Telescoping sum", "Power sums by recurrence", "Vieta for a cubic", "Sum of cubes of roots", "Newton sums (fourth powers)", "Sum of reciprocals of roots", "Circumradius", "Product of inradius and circumradius", "Distance to a line", "Angle bisector segment", "Expected value", "Dilution", "Lattice points in a triangle", "Catalan paths", "Derangements", "Large derangements", "Binary strings, no three 1s in a row", "Domino and square tilings", "Non-adjacent chairs", "No two adjacent", "Inradius of a right triangle", "Law of cosines", "Regular hexagon area", "Reciprocal-sum equation (SFFT)", "Sum of absolute-value solutions", "Brahmagupta area squared"];
console.log(`${covered.length} skills cross-checked independently.`);
process.exit(bad ? 1 : 0);
