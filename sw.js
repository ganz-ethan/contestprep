// Offline support: network first, fall back to the last copy seen. No personal data is cached.
const CACHE = "contestprep-sw-1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET" || !/^https?:$/.test(u.protocol)) return;
  if (u.origin !== location.origin && u.hostname !== "cdnjs.cloudflare.com") return; // never cache the logging endpoint
  e.respondWith(fetch(req).then(res => { if (res.ok || res.type === "opaque") { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return res; })
    .catch(() => caches.match(req).then(m => m || Promise.reject(new Error("offline")))));
});
