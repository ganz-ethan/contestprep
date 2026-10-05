// Generates og.png (1200x630 social preview). Run: node make_og.js
const fs = require("fs"), zlib = require("zlib");
const W = 1200, H = 630, segs = [[430,150,770,150],[430,150,610,315],[610,315,430,480],[430,480,770,480],[770,150,770,205],[770,480,770,425]], R = 19;
const dist = (x, y, s) => { const [ax, ay, bx, by] = s, dx = bx - ax, dy = by - ay; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(x - ax - t * dx, y - ay - t * dy); };
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; for (let x = 0; x < W; x++) {
  const g = x / W, bg = [37 + 20 * g, 87 - 10 * g, 214 - 30 * g];
  let d = 1e9; for (const s of segs) d = Math.min(d, dist(x, y, s)); const a = Math.max(0, Math.min(1, R + 0.5 - d));
  const o = y * (W * 3 + 1) + 1 + x * 3; for (let c = 0; c < 3; c++) raw[o + c] = Math.round(bg[c] * (1 - a) + 255 * a);
} }
const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.writeFileSync("og.png", Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]));
console.log("og.png written");
