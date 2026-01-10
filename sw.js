

const CACHE_NAME = "tic-kar-v8"; // 🔥

/* =========================
   PRECACHE (SAFE)
========================= */
const PRECACHE = [
  /* root */
  "/",
  "/index.html",
  "/offline.html",

  /* main pages */
  "/About-us.html",
  "/blogs.html",
  "/bookmarks.html",
  "/business-laws.html",
  "/chapters.html",
  "/contact.html",
  "/correction-test.html",
  "/mtp-rtp.html",
  "/performance.html",
  "/profile.html",
  "/sponsor-us.html",
  "/Blog/Essential-Things-You-Must-Keep-in-Mind.html",
  "/Blog/how-to-speed-up-handwriting.html",
  "/Blog/i-knew-everything-forgot-everything-in-exam-hall.html",
  "/Blog/my-teacher-was-wrong-about-ca-foundation-and-i-paid-the-price.html",
  "/Blog/Presentation-vs-Content-What-Matters-More.html",
  "/Blog/Why-Hard-Work-Alone-Is-Not-Enough-to-Clear-CA-Foundation.html",
  "/Legal/disclaimer.html",
  "/Legal/our-mission.html",
  "/Legal/privacy-policy.html",
  "/Legal/terms.html",
  /* blog pages */

  /* styles */
  "assets/css/common.css",
  "assets/css/common-review.css",
  "assets/css/landing.css",
  "assets/css/about.css",
  "/Legal/legal.css",
  "/Legal/legal.js",
  "assets/css/contact.css",
  "assets/css/profile.css",
  "assets/css/perform.css",
  "assets/css/penalty.css",
  "assets/css/sponsor.css",
  "assets/css/style-law.css",
  "/style.css",
  "/style-rtp.css",

  /* scripts */
  "assets/js/common-layout.js",
  "assets/js/common-logic.js",
  "assets/js/common.js",
  "assets/js/profile.js",
  "assets/js/performance-logic.js",
  "assets/js/bookmark-logic.js",
  "assets/js/law-logic.js",
  "assets/js/law-pdf-logic.js",
  "assets/js/insight-engine.js",
  "assets/js/questions.js",
  "assets/js/questions-law.js",
  "assets/js/questions-logic.js",
  "assets/js/questions-logic-rtp.js",
  "assets/js/rtp-mtp.js",
  "assets/js/settings.js",

  /* icons */
  "/assets/favicon/favicon.ico",
  "assets/favicon/favicon-16x16.png",
  "assets/favicon/favicon-32x32.png",
  "assets/favicon/apple-touch-icon.png",
  "assets/favicon/android-chrome-192x192.png",
  "/sitemap.xml",
  "assets/favicon/android-chrome-512x512.png",

  /* misc */
  "assets/QR/qr.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .catch(err => console.warn("❌ Precache failed", err))
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

  // Never touch Firebase / Google APIs
  if (
    url.hostname.includes("googleapis") ||
    url.hostname.includes("firebase") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // 🌐 HTML → Network First, fallback offline
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Save fresh copy
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => 
          caches.match(req)
            .then(r => r || caches.match("/offline.html"))
        )
    );
    return;
  }

  // ⚡ Assets → Cache First, then Network update
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req)
        .then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match("/offline.html"));
    })
  );
});