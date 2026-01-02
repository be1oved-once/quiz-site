

const CACHE_NAME = "tic-kar-v6";

/* =========================
   PRECACHE (SAFE)
========================= */
const PRECACHE = [
"/",
"/index.html",
"/offline.html",

// static pages (optional)
"/about-us.html",
"/contact.html",

// icons / images only
"/assets/favicon/favicon.ico",
"/assets/favicon/apple-touch-icon.png",
"/assets/favicon/android-chrome-192x192.png",
"/assets/favicon/android-chrome-512x512.png",
"/assets/QR/qr.png"
];

/* =========================
   INSTALL
========================= */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of PRECACHE) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn("❌ Failed to cache:", url);
        }
      }
    })
  );
  self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* =========================
   FETCH
========================= */
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // ❌ never cache firebase / api
  if (
    url.hostname.includes("googleapis") ||
    url.hostname.includes("firebase") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // HTML → network first
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("/offline.html")))
    );
    return;
  }

  // assets → cache first
  event.respondWith(
  caches.match(req).then(cached => {
    const fetchPromise = fetch(req).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
      return res;
    });
    return cached || fetchPromise;
  })
);
});