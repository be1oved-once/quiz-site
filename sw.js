

const CACHE_NAME = "tic-kar-v4";

/* =========================
   PRECACHE (SAFE)
========================= */
const PRECACHE = [
  /* root */
  "/",
  "/index.html",
  "/offline.html",

  /* main pages */
  "/about-us.html",
  "/blogs.html",
  "/bookmarks.html",
  "/business-laws.html",
  "/chapters.html",
  "/chatrooms.html",
  "/confirmation.html",
  "/contact.html",
  "/correction-test.html",
  "/mtp-rtp.html",
  "/performance.html",
  "/profile.html",
  "/sponsor-us.html",
  "/temp-test.html",
  "/thoughts.html",

  /* blog pages */
  "/Blog/Essential-Things-You-Should-Know.html",
  "/Blog/how-to-speed-up-handwriting.html",
  "/Blog/i-knew-everything-forgot.html",
  "/Blog/my-teacher-was-wrong.html",

  /* styles */
  "/assets/css/common.css",
  "/assets/css/common-review.css",
  "/assets/css/landing.css",
  "/assets/css/about.css",
  "/assets/css/contact.css",
  "/assets/css/chatroom.css",
  "/assets/css/profile.css",
  "/assets/css/perform.css",
  "/assets/css/penalty.css",
  "/assets/css/sponsor.css",
  "/assets/css/style-law.css",
  "/style.css",
  "/style-rtp.css",

  /* scripts */
  "/js/common-layout.js",
  "/js/common-logic.js",
  "/js/common.js",
  "/js/firebase.js",
  "/js/profile.js",
  "/js/performance-logic.js",
  "/js/chatroom.js",
  "/js/bookmark-logic.js",
  "/js/law-logic.js",
  "/js/law-pdf-logic.js",
  "/js/insight-engine.js",
  "/js/questions.js",
  "/js/questions-law.js",
  "/js/questions-logic.js",
  "/js/questions-logic-rtp.js",
  "/js/rtp-mtp.js",
  "/js/settings.js",
  "/js/student-test.js",
  "/js/user-metrics-init.js",
  "/js/user-metrics-update.js",

  /* icons */
  "/assets/favicon/favicon.ico",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/apple-touch-icon.png",
  "/assets/favicon/android-chrome-192x192.png",
  "/assets/favicon/android-chrome-512x512.png",

  /* misc */
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