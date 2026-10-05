const gcd = (a, b) => b ? gcd(b, a % b) : a;
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const phi = n => { let c = 0; for (let i = 1; i <= n; i++) if (gcd(i, n) === 1) c++; return c; };
const isSqf = n => { for (let p = 2; p * p <= n; p++) if (n % (p * p) === 0) return false; return true; };
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
module.exports = function compute() {
const out = {};
// 31 coprime pairs a<b<=30
{ let c = 0; for (let b = 2; b <= 30; b++) for (let a = 1; a < b; a++) if (gcd(a, b) === 1) c++; out[31] = c; }
// 32 domino tilings 2x10
{ const f = [1, 1]; for (let i = 2; i <= 10; i++) f[i] = f[i - 1] + f[i - 2]; out[32] = f[10]; }
// 33 sum n<=60 with 5 | n^2+1
{ let s = 0; for (let n = 1; n <= 60; n++) if ((n * n + 1) % 5 === 0) s += n; out[33] = s; }
// 34 interior lattice points of triangle (0,0),(20,0),(0,15)
{ let c = 0; for (let x = 1; x < 20; x++) for (let y = 1; y < 15; y++) if (x * 15 + y * 20 < 300) c++; out[34] = c; }
// 35 subsets of {1..9} with no 3 consecutive elements
{ let c = 0; for (let m = 0; m < 512; m++) if ((m & (m >> 1) & (m >> 2)) === 0) c++; out[35] = c; }
// 36 (3^100+4^100) mod 1000
{ out[36] = Number((3n ** 100n + 4n ** 100n) % 1000n); }
// 37 x^2+y^2=2025
{ let c = 0; for (let x = -45; x <= 45; x++) for (let y = -45; y <= 45; y++) if (x * x + y * y === 2025) c++; out[37] = c; }
// 38 C(10,4)
out[38] = C(10, 4);
// 39 exradii: 2*(ra+rb+rc) for 13-14-15
{ const s = 21, K = 84; out[39] = 2 * (K / (s - 14) + K / (s - 15) + K / (s - 13)); }
// 40 x+1/x=7 => x^5+x^-5 mod 1000
{ let L = [2n, 7n]; for (let i = 2; i <= 5; i++) L[i] = 7n * L[i - 1] - L[i - 2]; out[40] = Number(L[5] % 1000n); out["40full"] = Number(L[5]); }
// 41 prob 3 dice sum 12 -> m+n
{ let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let d = 1; d <= 6; d++) if (a + b + d === 12) c++; const g = gcd(c, 216); out[41] = c / g + 216 / g; out["41frac"] = [c / g, 216 / g]; }
// 42 divisors of 10! multiples of 6
{ let N = 3628800, c = 0; for (let d = 1; d <= N; d++) if (N % d === 0 && d % 6 === 0) c++; out[42] = c; }
// 43 area of triangle BFC in square side 12
{ const B = [12, 0], F = [4, 8], Cc = [12, 12]; out[43] = Math.abs((F[0] - B[0]) * (Cc[1] - B[1]) - (Cc[0] - B[0]) * (F[1] - B[1])) / 2; }
// 44 sum_{k=1}^{20} k*2^k mod 1000
{ let s = 0n; for (let k = 1n; k <= 20n; k++) s += k * 2n ** k; out[44] = Number(s % 1000n); out["44full"] = Number(s); }
// 45 3-subsets of 1..20 with sum divisible by 3
{ let c = 0; for (let a = 1; a <= 20; a++) for (let b = a + 1; b <= 20; b++) for (let d = b + 1; d <= 20; d++) if ((a + b + d) % 3 === 0) c++; out[45] = c; }
// 46 n<=1000 with floor(sqrt(n)) | n
{ let c = 0; for (let n = 1; n <= 1000; n++) { const k = Math.floor(Math.sqrt(n)); if (n % k === 0) c++; } out[46] = c; }
// 47 altitude to hypotenuse of 20-21-29 is 420/29 -> m+n
out[47] = 420 + 29;
// 48 acute triangles in regular 14-gon
{ let ac = 0, rt = 0, ob = 0; const n = 14; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) { const m = Math.max(b - a, c - b, n - (c - a)); if (2 * m < n) ac++; else if (2 * m === n) rt++; else ob++; } out[48] = ac; out["48all"] = { ac, rt, ob }; }
// 49 partitions of 15 into at most 3 parts
{ let c = 0; for (let a = 0; a <= 15; a++) for (let b = 0; b <= a; b++) { const d = 15 - a - b; if (d >= 0 && d <= b) c++; } out[49] = c; }
// 50 digits of 3^500
out[50] = (3n ** 500n).toString().length;
// 51 derangements of 6
{ const D = [1, 0]; for (let i = 2; i <= 6; i++) D[i] = (i - 1) * (D[i - 1] + D[i - 2]); out[51] = D[6]; }
// 52 F_100 mod 1000
{ let a = 0n, b = 1n; for (let i = 0; i < 100; i++) [a, b] = [b, a + b]; out[52] = Number(a % 1000n); }
// 53 unit squares crossed by diagonal of 30x40 grid
out[53] = 30 + 40 - gcd(30, 40);
{ // brute check: count cells whose interior the diagonal passes through
  let c = 0; for (let i = 0; i < 40; i++) for (let j = 0; j < 30; j++) { // cell [i,i+1]x[j,j+1]; diagonal y = 0.75 x
    const lo = 0.75 * i, hi = 0.75 * (i + 1); if (hi > j + 1e-12 && lo < j + 1 - 1e-12) c++; } out["53brute"] = c; }
// 54 trailing zeros of 1000!
{ let z = 0; for (let i = 5; i <= 1000; i *= 5) z += Math.floor(1000 / i); out[54] = z; }
// 55 non-adjacent 4-subsets of 12-cycle
{ let c = 0; for (let m = 0; m < 4096; m++) { if (m.toString(2).split("1").length - 1 !== 4) continue; let ok = true; for (let i = 0; i < 12; i++) if ((m >> i & 1) && (m >> ((i + 1) % 12) & 1)) ok = false; if (ok) c++; } out[55] = c; }
// 56 sum_{k=1}^{8} (k^3-6k^2+11k-6)
{ let s = 0; for (let k = 1; k <= 8; k++) s += k ** 3 - 6 * k * k + 11 * k - 6; out[56] = s; }
// 57 n<=200, 7 | n^2+n+1
{ let c = 0; for (let n = 1; n <= 200; n++) if ((n * n + n + 1) % 7 === 0) c++; out[57] = c; }
// 58 expected rolls until two consecutive 6s: solve linear system by iteration
{ let E0 = 0, E1 = 0; for (let i = 0; i < 20000; i++) { const n0 = 1 + 5 / 6 * E0 + 1 / 6 * E1, n1 = 1 + 5 / 6 * E0; E0 = n0; E1 = n1; } out[58] = Math.round(E0 * 1e6) / 1e6; }
// 59 shoelace
{ const P = [[0, 0], [4, 0], [6, 3], [4, 6], [0, 6], [-2, 3]]; let s = 0; for (let i = 0; i < 6; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % 6]; s += x1 * y2 - x2 * y1; } out[59] = Math.abs(s) / 2; }
// 60 ordered pairs (m,n) in 1..20 with mn a perfect square
{ let c = 0; for (let m = 1; m <= 20; m++) for (let n = 1; n <= 20; n++) { const p = m * n, r = Math.round(Math.sqrt(p)); if (r * r === p) c++; } out[60] = c; }
const res = {};
for (const k of Object.keys(out)) if (/^\d+$/.test(k)) res["aime-" + k] = out[k];
return res;
};
