/**
 * Anonymous right/wrong collector for Pi Gym, as a Google Apps Script web app writing to a Google Sheet.
 *
 * Setup: see collector/README.md. Summary:
 *   1. Create a new Google Sheet. Extensions > Apps Script. Paste this file in and save.
 *   2. Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone.
 *   3. Copy the web app URL (ends in /exec) into logEndpoint in config.js.
 *
 * Privacy: this script stores ONLY what is below. Apps Script does not give the script the sender's IP address,
 * and this script never asks for it. Do not add IP, user-agent, or any identifying column.
 * Columns: day (server date), kind, sid (random per-session code), item (problem id), ok (1/0), hints (0-3).
 */
var ID_RE = /^(L\d{3,4}-\d{4}|a8-\d{1,3}|a10-\d{1,3}|a12-\d{1,3}|aime-\d{1,3}|oly-\d{1,3})$/;
var SID_RE = /^[0-9a-f]{8,16}$/;
var MAX_ROWS_PER_POST = 80;

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (!d || d.v !== 1 || (d.k !== 'diag' && d.k !== 'prac') || !SID_RE.test(String(d.sid)) || !Array.isArray(d.r)) return ok_('ignored');
    var day = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
    var rows = [];
    for (var i = 0; i < d.r.length && rows.length < MAX_ROWS_PER_POST; i++) {
      var r = d.r[i];
      if (!Array.isArray(r) || !ID_RE.test(String(r[0]))) continue;
      rows.push([day, d.k, d.sid, r[0], r[1] ? 1 : 0, Math.max(0, Math.min(3, parseInt(r[2], 10) || 0))]);
    }
    if (!rows.length) return ok_('ignored');
    var lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('responses');
      if (!sh) { sh = SpreadsheetApp.getActiveSpreadsheet().insertSheet('responses'); sh.appendRow(['day', 'kind', 'sid', 'item', 'ok', 'hints']); }
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
    } finally { lock.releaseLock(); }
  } catch (err) { /* never reveal errors to the sender */ }
  return ok_('ok');
}

function doGet() { return ok_('Pi Gym collector is running.'); }
function ok_(s) { return ContentService.createTextOutput(s); }
