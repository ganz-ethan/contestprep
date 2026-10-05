// Run: node test_community.js
// Checks that the Supabase back end builds the right requests, using a stubbed fetch (no network).
const fs = require("fs"), vm = require("vm"), assert = require("assert");
const calls = [], store = {};
const stub = async (url, o) => {
  calls.push({ url, method: o.method, headers: o.headers, body: o.body ? JSON.parse(o.body) : null });
  let j = {};
  if (url.includes("/auth/v1/signup")) j = { access_token: "tok", refresh_token: "r", expires_in: 3600, user: { id: "uid1" } };
  else if (url.includes("/profiles?id=eq.uid1")) j = [{ id: "uid1", username: "alice_1", level: null, is_admin: false }];
  else if (url.includes("/profiles?username=ilike.")) j = [{ id: "uidX", username: "bobX2" }, { id: "uid2", username: "bob_2" }];
  else if (url.includes("/user_data?user_id=")) j = [{ data: { attempts: { x: { tries: 2, solved: false } } } }];
  else if (url.endsWith("/rest/v1/threads") && o.method === "POST") j = [{ id: "thr1" }];
  else if (url.includes("/threads?category=")) j = [{ id: "t1", title: "Hi", last_post_at: "2026-01-01", reply_count: 2, author: { username: "bob" } }];
  return { ok: true, status: 200, text: async () => JSON.stringify(j) };
};
const ls = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
const win = { CP_CONFIG: { community: { supabaseUrl: "https://x.supabase.co/", anonKey: "ANON" } }, CP: { esc: s => String(s), S: {}, show() {} } };
const ctx = { window: win, document: { getElementById() {}, querySelectorAll: () => [] }, localStorage: ls, fetch: stub, console, location: { hash: "" }, Date, JSON, Promise, URL, encodeURIComponent };
vm.createContext(ctx); vm.runInContext(fs.readFileSync("community.js", "utf8"), ctx);
(async () => {
  assert(win.Community.live);
  const B = win.Community._test.sb;
  assert(B, "sb exported");
  assert.strictEqual(JSON.stringify(await B.signUp("a@x.com", "password1", "alice_1")), JSON.stringify({ signedIn: true }));
  assert.strictEqual(calls[0].url, "https://x.supabase.co/auth/v1/signup");
  assert.strictEqual(JSON.stringify(calls[0].body.data), JSON.stringify({ username: "alice_1" }));
  assert.strictEqual(calls[0].headers.apikey, "ANON");
  const me = await B.me(); assert.strictEqual(me.username, "alice_1");
  assert.strictEqual(calls.at(-1).headers.Authorization, "Bearer tok");
  const id = await B.newThread("amc8", "Title", "Body"); assert.strictEqual(id, "thr1");
  const post = calls.at(-1); assert.strictEqual(post.url, "https://x.supabase.co/rest/v1/posts"); assert.strictEqual(JSON.stringify(post.body), JSON.stringify({ thread_id: "thr1", body: "Body" }));
  const list = await B.listThreads("amc8"); assert.strictEqual(list[0].author, "bob"); assert(calls.at(-1).url.includes("category=eq.amc8"));
  await B.requestFriend("Bob_2"); assert.strictEqual(JSON.stringify(calls.at(-1).body), JSON.stringify({ addressee_id: "uid2" }));
  await B.respond("f1", true); assert.strictEqual(calls.at(-1).method, "PATCH");
  await B.respond("f1", false); assert.strictEqual(calls.at(-1).method, "DELETE");
  const pulled = await B.pullProgress(); assert.strictEqual(pulled.attempts.x.tries, 2);
  await B.pushProgress({ attempts: {} }); const pu = calls.at(-1); assert(pu.url.includes("user_data?on_conflict=user_id")); assert.strictEqual(pu.body.user_id, "uid1"); assert.strictEqual(pu.headers.Prefer, "resolution=merge-duplicates");
  const M = win.Community._test.mergeProgress;
  const m = JSON.parse(JSON.stringify(M(
    { attempts: { a: { tries: 1, solved: true, firstTry: true, hints: 0 }, b: { tries: 3, solved: false, hints: 2 } }, lvl: { L100: 1 }, streak: { last: "2026-10-01", n: 3 }, diag: { history: [{ t: 2, score: 500 }] }, share: false },
    { attempts: { a: { tries: 4, solved: false, hints: 1 }, c: { tries: 1, solved: true } }, lvl: { L200: 1 }, streak: { last: "2026-10-03", n: 1 }, diag: { history: [{ t: 1, score: 400 }, { t: 2, score: 500 }] } })));
  assert.strictEqual(m.attempts.a.solved, true); assert.strictEqual(m.attempts.a.tries, 4); assert.strictEqual(m.attempts.a.hints, 1);
  assert(m.attempts.b && m.attempts.c.solved); assert.strictEqual(Object.keys(m.lvl).length, 2); assert.strictEqual(m.streak.n, 1);
  assert.deepStrictEqual(m.diag.history.map(h => h.t), [1, 2]); assert.strictEqual(m.share, false);
  await B.signOut(); assert.strictEqual(store["cp.sb.session"], undefined);
  let threw = false; try { await B.reply("t", "x"); } catch (e) { threw = /sign in/i.test(e.message); } assert(threw, "reply needs sign-in");
  console.log("community back end: all checks passed (" + calls.length + " requests)");
})().catch(e => { console.error("FAIL", e.message); process.exit(1); });
