const CACHE_NAME = "New-Prod";
const OFFLINE_URL = "/offline.html";

/* =========================
   PRECACHE LIST
========================= */
const PRECACHE_URLS = [
  "/",
  "/index.html",
  OFFLINE_URL,

  // Main pages
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

  // Blog pages
  "/Blog/Essential-Things-You-Must-Keep-in-Mind.html",
  "/Blog/how-to-speed-up-handwriting.html",
  "/Blog/i-knew-everything-forgot-everything-in-exam-hall.html",
  "/Blog/my-teacher-was-wrong-about-ca-foundation-and-i-paid-the-price.html",
  "/Blog/Presentation-vs-Content-What-Matters-More.html",
  "/Blog/Why-Hard-Work-Alone-Is-Not-Enough-to-Clear-CA-Foundation.html",

  // Legal
  "/Legal/disclaimer.html",
  "/Legal/our-mission.html",
  "/Legal/privacy-policy.html",
  "/Legal/terms.html",

  // CSS
  "/style.css",
  "/style-rtp.css",
  "/assets/css/common.css",
  "/assets/css/common-review.css",
  "/assets/css/landing.css",
  "/assets/css/about.css",
  "/assets/css/contact.css",
  "/assets/css/profile.css",
  "/assets/css/perform.css",
  "/assets/css/penalty.css",
  "/assets/css/sponsor.css",
  "/assets/css/style-law.css",
  "/Legal/legal.css",

  // JS
  "/assets/js/common-layout.js",
  "/assets/js/common-logic.js",
  "/assets/js/common.js",
  "/assets/js/settings.js",
  "/assets/js/profile.js",
  "/assets/js/performance-logic.js",
  "/assets/js/bookmark-logic.js",
  "/assets/js/questions.js",
  "/assets/js/questions-law.js",
  "/assets/js/questions-logic.js",
  "/assets/js/questions-logic-rtp.js",
  "/assets/js/rtp-mtp.js",
  "/assets/js/law-logic.js",
  "/assets/js/law-pdf-logic.js",

  // Icons
  "/assets/favicon/favicon.ico",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/apple-touch-icon.png",
  "/assets/favicon/android-chrome-192x192.png",
  "/assets/favicon/android-chrome-512x512.png",

  // Misc
  "/assets/QR/qr.webp",
  "/sitemap.xml"
];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of PRECACHE_URLS) {
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
      Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
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

  // Ignore Firebase + Google APIs + Vercel serverless
  if (
    url.hostname.includes("googleapis") ||
    url.hostname.includes("firebase") ||
    url.hostname.includes("gstatic") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Handle page navigations
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then(r => r || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Handle assets: Cache first → Network fallback
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});