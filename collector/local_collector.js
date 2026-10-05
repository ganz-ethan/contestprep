// Local collector for testing (and for small self-hosted use).
//   node collector/local_collector.js [port] [csvFile]
// Then set logEndpoint in config.js to http://localhost:8787/ (the default port).
// Writes the same CSV format as the Google Sheet collector: day,kind,sid,item,ok,hints.
// Privacy: like the Apps Script collector, it never records IP addresses or headers.
const http = require("http"), fs = require("fs"), path = require("path");
const PORT = +(process.argv[2] || 8787), FILE = process.argv[3] || path.join(__dirname, "responses.csv");
const ID_RE = /^(L\d{3,4}-\d{4}|a8-\d{1,3}|a10-\d{1,3}|a12-\d{1,3}|aime-\d{1,3}|oly-\d{1,3})$/, SID_RE = /^[0-9a-f]{8,16}$/;
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "day,kind,sid,item,ok,hints\n");

http.createServer((req, res) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
  if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
  if (req.method !== "POST") { res.writeHead(200, cors); return res.end("ContestPrep collector is running."); }
  let body = ""; req.on("data", c => { body += c; if (body.length > 20000) req.destroy(); });
  req.on("end", () => {
    let wrote = 0;
    try {
      const d = JSON.parse(body);
      if (d && d.v === 1 && (d.k === "diag" || d.k === "prac") && SID_RE.test(String(d.sid)) && Array.isArray(d.r)) {
        const day = new Date().toISOString().slice(0, 10), lines = [];
        for (const r of d.r.slice(0, 80)) if (Array.isArray(r) && ID_RE.test(String(r[0]))) lines.push([day, d.k, d.sid, r[0], r[1] ? 1 : 0, Math.max(0, Math.min(3, parseInt(r[2], 10) || 0))].join(","));
        if (lines.length) { fs.appendFileSync(FILE, lines.join("\n") + "\n"); wrote = lines.length; }
      }
    } catch { /* ignore malformed input */ }
    res.writeHead(200, cors); res.end(wrote ? "ok" : "ignored");
  });
}).listen(PORT, () => console.log(`Collector listening on http://localhost:${PORT}/  ->  ${FILE}`));
