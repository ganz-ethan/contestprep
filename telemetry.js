// Anonymous, opt-in right/wrong logging.
//
// Privacy rules enforced here:
//  * Does nothing unless config.js has a logEndpoint AND the visitor chose "Yes, share" (CP.S.share === true).
//  * Sends only: a random session code, problem ids, right/wrong, and hints used (0-3). No name, no account, no IP
//    (the collector must not store IPs), no timestamps, no free text, no device info.
//  * The session code is random and short-lived: it lives in sessionStorage (gone when the tab closes), and each
//    diagnostic run uses a brand-new code. There is no persistent identifier.
//  * Only the FIRST attempt at each problem per session is sent (what calibration needs).
(() => {
  const endpoint = (window.CP_CONFIG && window.CP_CONFIG.logEndpoint) || "";
  const VALID = /^(L\d{3,4}-\d{2}|a8-\d{1,3}|a10-\d{1,3}|a12-\d{1,3}|aime-\d{1,3}|oly-\d{1,3})$/;
  const hex = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => b.toString(16).padStart(2, "0")).join("");
  const st = { q: [], seen: new Set(), sid: null };

  const configured = () => !!endpoint;
  const enabled = () => configured() && !!(window.CP && window.CP.S && window.CP.S.share === true);

  function sid() {
    if (!st.sid) {
      try { st.sid = sessionStorage.getItem("cp.sid"); if (!st.sid) { st.sid = hex(6); sessionStorage.setItem("cp.sid", st.sid); } }
      catch { st.sid = hex(6); }
    }
    return st.sid;
  }
  function send(payload) {
    const body = JSON.stringify(payload);
    try { if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }))) return; } catch {}
    try { fetch(endpoint, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body }).catch(() => {}); } catch {}
  }
  function flush() {
    if (!enabled() || !st.q.length) { st.q.length = 0; return; }
    send({ v: 1, k: "prac", sid: sid(), r: st.q.splice(0) });
  }
  // practice / track / level problems: first attempt only
  function item(id, ok, hints) {
    if (!enabled() || !VALID.test(id) || st.seen.has(id)) return;
    st.seen.add(id);
    st.q.push([id, ok ? 1 : 0, Math.max(0, Math.min(3, hints | 0))]);
    if (st.q.length >= 10) flush();
  }
  // a finished diagnostic: one batch with a fresh session code
  function diag(ids, oks, startMu) {
    if (!enabled()) return;
    const r = ids.filter(id => VALID.test(id)).map(id => [id, oks[ids.indexOf(id)] ? 1 : 0, 0]);
    if (r.length) send({ v: 1, k: "diag", sid: hex(6), g: startMu | 0, r });
  }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.Telemetry = { configured, enabled, item, diag, flush };
})();
