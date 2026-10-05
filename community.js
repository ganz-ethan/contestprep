// Accounts, friends and forum. Two back ends with the same interface:
//   - "demo": everything stays in THIS browser (so you can try the screens with no server). Not real accounts.
//   - "supabase": real shared accounts, friends and forum, used when config.js has community.supabaseUrl + anonKey.
// See community/README.md and community/schema.sql. No third-party script is loaded; the browser talks to Supabase with fetch.
(() => {
  const CFG = (window.CP_CONFIG && window.CP_CONFIG.community) || {};
  const LIVE = !!(CFG.supabaseUrl && CFG.anonKey);
  const CATS = [["general", "General math"], ["amc8", "AMC 8"], ["amc1012", "AMC 10 / 12"], ["aime", "AIME"], ["olympiad", "USAJMO / USAMO / olympiad"], ["help", "Help with a problem"], ["site", "About this site"]];
  const CAT_NAME = Object.fromEntries(CATS);
  const USER_RE = /^[A-Za-z0-9_]{3,20}$/;
  const $ = id => document.getElementById(id);
  const esc = s => window.CP.esc(s == null ? "" : s);
  const when = t => { const d = new Date(t); return isNaN(d) ? "" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
  const myLevel = () => { const h = window.CP.S.diag && window.CP.S.diag.history; return h && h.length ? h[h.length - 1].score : null; };
  const body = t => esc(t).replace(/\n/g, "<br>"); // plain text only: HTML is escaped, $...$ becomes math

  // ============================ demo back end (this browser only) ============================
  const demo = (() => {
    const K = "cp.community.demo";
    const load = () => { try { return Object.assign({ users: [], threads: [], posts: [], friends: [], reports: [], me: null, n: 1 }, JSON.parse(localStorage.getItem(K))); } catch { return { users: [], threads: [], posts: [], friends: [], reports: [], me: null, n: 1 }; } };
    const save = d => { try { localStorage.setItem(K, JSON.stringify(d)); } catch {} };
    const uname = (d, id) => (d.users.find(u => u.id === id) || {}).username || "deleted";
    const ulevel = (d, id) => (d.users.find(u => u.id === id) || {}).level || null;
    const need = d => { if (!d.me) throw new Error("Please sign in first."); };
    return {
      async signUp(email, pw, username) {
        const d = load(); if (d.users.some(u => u.username.toLowerCase() === username.toLowerCase())) throw new Error("That username is taken.");
        const u = { id: "u" + d.n++, username, email, pw, level: null }; d.users.push(u); d.me = u.id; save(d); return { signedIn: true };
      },
      async signIn(email, pw) { const d = load(), u = d.users.find(x => x.email === email && x.pw === pw); if (!u) throw new Error("Wrong email or password."); d.me = u.id; save(d); },
      async signOut() { const d = load(); d.me = null; save(d); },
      async me() { const d = load(); const u = d.users.find(x => x.id === d.me); return u ? { id: u.id, username: u.username, level: u.level, admin: false } : null; },
      async setLevel(level) { const d = load(); need(d); d.users.find(x => x.id === d.me).level = level; save(d); },
      async listThreads(cat) { const d = load(); return d.threads.filter(t => t.category === cat).sort((a, b) => b.last - a.last).map(t => ({ id: t.id, title: t.title, last: t.last, replies: d.posts.filter(p => p.thread === t.id).length - 1, author: uname(d, t.author) })); },
      async getThread(id) { const d = load(), t = d.threads.find(x => x.id === id); if (!t) return null;
        return { id: t.id, title: t.title, category: t.category, posts: d.posts.filter(p => p.thread === id).map(p => ({ id: p.id, body: p.body, t: p.t, authorId: p.author, author: uname(d, p.author), level: ulevel(d, p.author) })) }; },
      async newThread(category, title, text) { const d = load(); need(d); const id = "t" + d.n++; d.threads.push({ id, category, title, author: d.me, last: Date.now() }); d.posts.push({ id: "p" + d.n++, thread: id, body: text, t: Date.now(), author: d.me }); save(d); return id; },
      async reply(thread, text) { const d = load(); need(d); d.posts.push({ id: "p" + d.n++, thread, body: text, t: Date.now(), author: d.me }); d.threads.find(x => x.id === thread).last = Date.now(); save(d); },
      async deletePost(id) { const d = load(); need(d); const p = d.posts.find(x => x.id === id); if (!p || p.author !== d.me) throw new Error("You can only delete your own posts."); d.posts = d.posts.filter(x => x.id !== id); if (!d.posts.some(x => x.thread === p.thread)) d.threads = d.threads.filter(t => t.id !== p.thread); save(d); },
      async report(post, reason) { const d = load(); need(d); d.reports.push({ post, reason, by: d.me, t: Date.now() }); save(d); },
      async friends() { const d = load(); need(d); return d.friends.filter(f => f.a === d.me || f.b === d.me).map(f => { const other = f.a === d.me ? f.b : f.a; return { id: f.id, status: f.status, incoming: f.b === d.me && f.status === "pending", name: uname(d, other), level: ulevel(d, other) }; }); },
      async requestFriend(username) { const d = load(); need(d); const u = d.users.find(x => x.username.toLowerCase() === username.toLowerCase()); if (!u) throw new Error("No one has that username."); if (u.id === d.me) throw new Error("That is you."); if (d.friends.some(f => (f.a === d.me && f.b === u.id) || (f.a === u.id && f.b === d.me))) throw new Error("You already have a request or friendship with them."); d.friends.push({ id: "f" + d.n++, a: d.me, b: u.id, status: "pending" }); save(d); },
      async respond(id, accept) { const d = load(); need(d); const f = d.friends.find(x => x.id === id); if (!f) return; if (accept && f.b === d.me) f.status = "accepted"; else d.friends = d.friends.filter(x => x.id !== id); save(d); },
      async removeFriend(id) { const d = load(); d.friends = d.friends.filter(x => x.id !== id); save(d); },
    };
  })();

  // ============================ Supabase back end ============================
  const sb = (() => {
    const SK = "cp.sb.session", base = (CFG.supabaseUrl || "").replace(/\/+$/, "");
    const getS = () => { try { return JSON.parse(localStorage.getItem(SK)); } catch { return null; } };
    const setS = s => { try { s ? localStorage.setItem(SK, JSON.stringify(s)) : localStorage.removeItem(SK); } catch {} };
    const toSession = j => ({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000 - 30000, uid: j.user && j.user.id });
    async function raw(path, opt = {}, token) {
      const r = await fetch(base + path, { method: opt.method || "GET", headers: Object.assign({ apikey: CFG.anonKey, Authorization: "Bearer " + (token || CFG.anonKey), "Content-Type": "application/json" }, opt.headers || {}), body: opt.body ? JSON.stringify(opt.body) : undefined });
      const txt = await r.text(); let j = null; try { j = txt ? JSON.parse(txt) : null; } catch {}
      if (!r.ok) throw new Error((j && (j.msg || j.message || j.error_description || j.error)) || "Something went wrong (" + r.status + ").");
      return j;
    }
    async function token() {
      let s = getS(); if (!s) return null;
      if (Date.now() > s.expires_at) { try { const j = await raw("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: s.refresh_token } }); s = toSession(j); s.uid = s.uid || getS().uid; setS(s); } catch { setS(null); return null; } }
      return s.access_token;
    }
    const rest = async (path, opt) => raw("/rest/v1/" + path, opt, await token());
    const needTok = async () => { const t = await token(); if (!t) throw new Error("Please sign in first."); return t; };
    const eq = v => "eq." + encodeURIComponent(v);
    return {
      async signUp(email, pw, username) {
        const j = await raw("/auth/v1/signup", { method: "POST", body: { email, password: pw, data: { username } } });
        if (j && j.access_token) { setS(toSession(j)); return { signedIn: true }; }
        return { signedIn: false, message: "Check your email for a confirmation link, then sign in." };
      },
      async signIn(email, pw) { const j = await raw("/auth/v1/token?grant_type=password", { method: "POST", body: { email, password: pw } }); setS(toSession(j)); },
      async signOut() { const t = await token(); if (t) { try { await raw("/auth/v1/logout", { method: "POST" }, t); } catch {} } setS(null); },
      async me() { const t = await token(); if (!t) return null; const uid = getS().uid; const r = await rest("profiles?id=" + eq(uid) + "&select=id,username,level,is_admin"); return r && r[0] ? { id: r[0].id, username: r[0].username, level: r[0].level, admin: r[0].is_admin } : null; },
      async setLevel(level) { await needTok(); await rest("profiles?id=" + eq(getS().uid), { method: "PATCH", body: { level } }); },
      async listThreads(cat) { const r = await rest("threads?category=" + eq(cat) + "&select=id,title,last_post_at,reply_count,author:profiles(username)&order=last_post_at.desc&limit=60"); return r.map(t => ({ id: t.id, title: t.title, last: t.last_post_at, replies: t.reply_count, author: t.author ? t.author.username : "deleted" })); },
      async getThread(id) { const t = await rest("threads?id=" + eq(id) + "&select=id,title,category"); if (!t || !t[0]) return null; const p = await rest("posts?thread_id=" + eq(id) + "&select=id,body,created_at,author_id,author:profiles(username,level)&order=created_at.asc&limit=500");
        return { id: t[0].id, title: t[0].title, category: t[0].category, posts: p.map(x => ({ id: x.id, body: x.body, t: x.created_at, authorId: x.author_id, author: x.author ? x.author.username : "deleted", level: x.author ? x.author.level : null })) }; },
      async newThread(category, title, text) { await needTok(); const r = await rest("threads", { method: "POST", body: { category, title }, headers: { Prefer: "return=representation" } }); const id = r[0].id; await rest("posts", { method: "POST", body: { thread_id: id, body: text } }); return id; },
      async reply(thread, text) { await needTok(); await rest("posts", { method: "POST", body: { thread_id: thread, body: text } }); },
      async deletePost(id) { await needTok(); await rest("posts?id=" + eq(id), { method: "DELETE" }); },
      async report(post, reason) { await needTok(); await rest("reports", { method: "POST", body: { post_id: post, reason } }); },
      async friends() { await needTok(); const uid = getS().uid; const r = await rest("friendships?select=id,status,requester_id,addressee_id,requester:profiles!friendships_requester_id_fkey(username,level),addressee:profiles!friendships_addressee_id_fkey(username,level)");
        return r.map(f => { const mineIsReq = f.requester_id === uid, o = mineIsReq ? f.addressee : f.requester; return { id: f.id, status: f.status, incoming: !mineIsReq && f.status === "pending", name: o ? o.username : "deleted", level: o ? o.level : null }; }); },
      async requestFriend(username) { await needTok(); const cand = await rest("profiles?username=ilike." + encodeURIComponent(username.replace(/[%*]/g, "")) + "&select=id,username&limit=20"); const u = (cand || []).filter(x => x.username.toLowerCase() === username.toLowerCase()); /* ilike treats _ as a wildcard, so confirm an exact match */ if (!u[0]) throw new Error("No one has that username."); if (u[0].id === getS().uid) throw new Error("That is you."); await rest("friendships", { method: "POST", body: { addressee_id: u[0].id } }); },
      async respond(id, accept) { await needTok(); if (accept) await rest("friendships?id=" + eq(id), { method: "PATCH", body: { status: "accepted" } }); else await rest("friendships?id=" + eq(id), { method: "DELETE" }); },
      async removeFriend(id) { await needTok(); await rest("friendships?id=" + eq(id), { method: "DELETE" }); },
    };
  })();

  const B = LIVE ? sb : demo;
  const friendlyErr = e => /duplicate|unique|already/i.test(e.message) ? "That already exists (a duplicate request, or the username is taken)." : /rate|too many/i.test(e.message) ? "Slow down a little and try again in a minute." : e.message;
  const demoBanner = () => LIVE ? "" : `<p class="note"><b>Demo mode.</b> Accounts, friends and posts here are stored only in this browser and are not shared with anyone. Do not use a real password. Shared accounts switch on when the site owner connects a database (see <code>community/README.md</code>).</p>`;
  const nav = () => `<div class="row" style="margin:6px 0 14px"><a class="btn small ghost" href="#/forum">Forum</a> <a class="btn small ghost" href="#/friends">Friends</a> <a class="btn small ghost" href="#/account">Account</a></div>`;
  const msg = (id, text, bad) => { const el = $(id); if (el) { el.textContent = text; el.className = bad ? "msg-bad" : "msg-good"; } };
  const show = html => window.CP.show(html);
  const guard = async () => { try { return await B.me(); } catch { return null; } };

  // ============================ screens ============================
  async function viewAccount() {
    const me = await guard();
    if (me) {
      const lv = myLevel();
      show(`<h1>Account</h1>${demoBanner()}${nav()}
        <div class="card"><p>Signed in as <b>${esc(me.username)}</b>${me.level ? ` · level ${me.level} shown on your profile` : ""}.</p>
        <label class="row"><input type="checkbox" id="showlv" ${me.level ? "checked" : ""} ${lv ? "" : "disabled"}> <span>Show my diagnostic level (${lv ? lv : "take the diagnostic first"}) next to my name</span></label>
        <p class="sub">Your practice progress still lives only in this browser. Your account is used for the forum and friends.</p>
        <p style="margin-top:12px"><button class="btn ghost" id="out">Sign out</button></p><p id="m" role="status"></p></div>`);
      const cb = $("showlv"); if (cb) cb.onchange = async () => { try { await B.setLevel(cb.checked ? lv : null); msg("m", "Saved.", false); } catch (e) { msg("m", friendlyErr(e), true); } };
      $("out").onclick = async () => { await B.signOut(); viewAccount(); };
      return;
    }
    show(`<h1>Account</h1>${demoBanner()}${nav()}
      <div class="card"><h3>Sign in</h3>
        <form id="fin" class="stack"><input type="email" id="e1" aria-label="Email" placeholder="Email" autocomplete="email" required>
        <input type="password" id="p1" aria-label="Password" placeholder="Password" autocomplete="current-password" required>
        <button class="btn" type="submit">Sign in</button></form></div>
      <div class="card" style="margin-top:14px"><h3>Create an account (free)</h3>
        <form id="fup" class="stack"><input type="text" id="u2" aria-label="Username" placeholder="Username (3-20 letters, numbers, _)" autocomplete="username" maxlength="20" required>
        <input type="email" id="e2" aria-label="Email" placeholder="Email (never shown to anyone)" autocomplete="email" required>
        <input type="password" id="p2" aria-label="Password" placeholder="Password (at least 8 characters)" autocomplete="new-password" minlength="8" required>
        <label class="row"><input type="checkbox" id="age" required> <span>I am 13 or older, or a parent or guardian has said it is OK.</span></label>
        <label class="row"><input type="checkbox" id="rules" required> <span>I will be kind, keep it about math, and not share personal information.</span></label>
        <button class="btn" type="submit">Create account</button></form></div>
      <p id="m" role="status"></p>`);
    $("fin").onsubmit = async ev => { ev.preventDefault(); try { await B.signIn($("e1").value.trim(), $("p1").value); location.hash = "#/forum"; viewForum(); } catch (e) { msg("m", friendlyErr(e), true); } };
    $("fup").onsubmit = async ev => { ev.preventDefault(); const u = $("u2").value.trim(); if (!USER_RE.test(u)) return msg("m", "Usernames are 3-20 letters, numbers or underscores.", true);
      try { const r = await B.signUp($("e2").value.trim(), $("p2").value, u); if (r.signedIn) { location.hash = "#/forum"; viewForum(); } else msg("m", r.message, false); } catch (e) { msg("m", friendlyErr(e), true); } };
  }

  async function viewForum() {
    show(`<h1>Forum</h1>${demoBanner()}${nav()}<p class="sub">Ask questions, share solutions, discuss contests. Use $...$ for math, like $x^2+1$.</p>
      <div class="grid">${CATS.map(([k, n]) => `<a class="card" href="#/forum/c/${k}"><h3>${esc(n)}</h3><p>Open</p></a>`).join("")}</div>`);
  }

  async function viewCategory(cat) {
    if (!CAT_NAME[cat]) return viewForum();
    show(`<div class="crumbs"><a href="#/forum">Forum</a> / ${esc(CAT_NAME[cat])}</div><h1>${esc(CAT_NAME[cat])}</h1>${demoBanner()}<p id="m" role="status">Loading…</p>`);
    let list, me; try { [list, me] = await Promise.all([B.listThreads(cat), guard()]); } catch (e) { return msg("m", friendlyErr(e), true); }
    const rows = list.length ? list.map(t => `<tr><td><a href="#/forum/t/${encodeURIComponent(t.id)}">${esc(t.title)}</a></td><td>${esc(t.author)}</td><td>${t.replies}</td><td>${esc(when(t.last))}</td></tr>`).join("") : `<tr><td colspan="4" class="sub">No threads yet. Start the first one.</td></tr>`;
    show(`<div class="crumbs"><a href="#/forum">Forum</a> / ${esc(CAT_NAME[cat])}</div><h1>${esc(CAT_NAME[cat])}</h1>${demoBanner()}${nav()}
      <table class="t"><tr><th>Thread</th><th>Started by</th><th>Replies</th><th>Last post</th></tr>${rows}</table>
      <h3 style="margin-top:22px">Start a thread</h3>
      ${me ? `<form id="nt" class="stack"><input type="text" id="tt" aria-label="Title" placeholder="Title" maxlength="120" required>
        <textarea id="tb" aria-label="Message" rows="6" maxlength="5000" placeholder="Your message. Use $...$ for math." required></textarea>
        <div class="row"><button class="btn" type="submit">Post thread</button></div><p id="m" role="status"></p></form>`
        : `<p class="note"><a href="#/account">Sign in or create an account</a> to post. Anyone can read.</p>`}`);
    const f = $("nt"); if (f) f.onsubmit = async ev => { ev.preventDefault(); const title = $("tt").value.trim(), text = $("tb").value.trim(); if (title.length < 3) return msg("m", "Please write a longer title.", true);
      try { const id = await B.newThread(cat, title, text); location.hash = "#/forum/t/" + encodeURIComponent(id); } catch (e) { msg("m", friendlyErr(e), true); } };
  }

  async function viewThread(id) {
    show(`<h1>Thread</h1><p id="m" role="status">Loading…</p>`);
    let th, me; try { [th, me] = await Promise.all([B.getThread(id), guard()]); } catch (e) { return msg("m", friendlyErr(e), true); }
    if (!th) return show(`<h1>Thread not found</h1>${nav()}`);
    const posts = th.posts.map((p, i) => `<div class="card post" id="p-${esc(p.id)}" style="margin:10px 0">
      <div class="sub" style="font-size:.85rem"><b>${esc(p.author)}</b>${p.level ? ` · level ${esc(p.level)}` : ""} · ${esc(when(p.t))}${i === 0 ? " · original post" : ""}</div>
      <div class="problem" style="margin:8px 0">${body(p.body)}</div>
      <div class="row">${me && (me.id === p.authorId || me.admin) ? `<button class="btn small ghost" data-del="${esc(p.id)}">Delete</button>` : ""}${me ? `<button class="btn small ghost" data-rep="${esc(p.id)}">Report</button>` : ""}</div></div>`).join("");
    show(`<div class="crumbs"><a href="#/forum">Forum</a> / <a href="#/forum/c/${esc(th.category)}">${esc(CAT_NAME[th.category] || th.category)}</a></div><h1>${esc(th.title)}</h1>${demoBanner()}${posts}
      <h3 style="margin-top:20px">Reply</h3>
      ${me ? `<form id="rf" class="stack"><textarea id="rb" aria-label="Reply" rows="5" maxlength="5000" placeholder="Your reply. Use $...$ for math." required></textarea><div class="row"><button class="btn" type="submit">Post reply</button></div></form>`
        : `<p class="note"><a href="#/account">Sign in</a> to reply.</p>`}<p id="m" role="status"></p>`);
    const rf = $("rf"); if (rf) rf.onsubmit = async ev => { ev.preventDefault(); try { await B.reply(id, $("rb").value.trim()); viewThread(id); } catch (e) { msg("m", friendlyErr(e), true); } };
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => { if (!confirm("Delete this post?")) return; try { await B.deletePost(b.dataset.del); const first = th.posts[0] && th.posts[0].id === b.dataset.del; if (first) location.hash = "#/forum/c/" + th.category; else viewThread(id); } catch (e) { msg("m", friendlyErr(e), true); } });
    document.querySelectorAll("[data-rep]").forEach(b => b.onclick = async () => { const why = prompt("What is wrong with this post? (a moderator will look at it)"); if (!why) return; try { await B.report(b.dataset.rep, why.slice(0, 300)); msg("m", "Thanks, it was reported.", false); } catch (e) { msg("m", friendlyErr(e), true); } });
  }

  async function viewFriends() {
    const me = await guard();
    if (!me) return show(`<h1>Friends</h1>${demoBanner()}${nav()}<p class="note"><a href="#/account">Sign in or create an account</a> to add friends.</p>`);
    show(`<h1>Friends</h1>${demoBanner()}${nav()}<p id="m" role="status">Loading…</p>`);
    let fr; try { fr = await B.friends(); } catch (e) { return msg("m", friendlyErr(e), true); }
    const lv = f => f.level ? ` <span class="sub">level ${esc(f.level)}</span>` : "";
    const inc = fr.filter(f => f.incoming), out = fr.filter(f => f.status === "pending" && !f.incoming), ok = fr.filter(f => f.status === "accepted");
    show(`<h1>Friends</h1>${demoBanner()}${nav()}
      <form id="af" class="row"><input type="text" id="fu" aria-label="Friend's username" placeholder="Friend's username" maxlength="20" required> <button class="btn" type="submit">Send friend request</button></form><p id="m" role="status"></p>
      ${inc.length ? `<h3>Requests for you</h3>${inc.map(f => `<div class="row" style="margin:6px 0"><b>${esc(f.name)}</b>${lv(f)} <button class="btn small" data-acc="${esc(f.id)}">Accept</button> <button class="btn small ghost" data-dec="${esc(f.id)}">Decline</button></div>`).join("")}` : ""}
      <h3>Your friends (${ok.length})</h3>${ok.length ? ok.map(f => `<div class="row" style="margin:6px 0"><b>${esc(f.name)}</b>${lv(f)} <button class="btn small ghost" data-rm="${esc(f.id)}">Remove</button></div>`).join("") : `<p class="sub">No friends yet. Send a request using a username.</p>`}
      ${out.length ? `<h3>Waiting for an answer</h3>${out.map(f => `<div class="row" style="margin:6px 0">${esc(f.name)} <button class="btn small ghost" data-rm="${esc(f.id)}">Cancel</button></div>`).join("")}` : ""}`);
    $("af").onsubmit = async ev => { ev.preventDefault(); try { await B.requestFriend($("fu").value.trim()); viewFriends(); } catch (e) { msg("m", friendlyErr(e), true); } };
    const act = (sel, fn) => document.querySelectorAll(sel).forEach(b => b.onclick = async () => { try { await fn(b); viewFriends(); } catch (e) { msg("m", friendlyErr(e), true); } });
    act("[data-acc]", b => B.respond(b.dataset.acc, true)); act("[data-dec]", b => B.respond(b.dataset.dec, false)); act("[data-rm]", b => B.removeFriend(b.dataset.rm));
  }

  window.Community = {
    live: LIVE,
    route(page, a, b) {
      if (page === "account") return viewAccount();
      if (page === "friends") return viewFriends();
      if (a === "c") return viewCategory(b);
      if (a === "t") return viewThread(decodeURIComponent(b || ""));
      return viewForum();
    },
    _test: { demo, sb, CATS },
  };
})();
