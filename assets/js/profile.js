import { auth, db } from "./firebase.js";
import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =========================
   DOM
========================= */
const usernameEl = document.getElementById("profileUsername");
const emailEl = document.getElementById("profileEmail");
const joinedEl = document.getElementById("profileJoined");
const xpEl = document.getElementById("profileXP");

/* =========================
   AUTH → LIVE PROFILE
========================= */
/* =========================
   LOCAL PROFILE CACHE
========================= */

function cacheKey(uid) {
  return `profile_cache_${uid}`;
}

function loadCachedProfile(uid) {
  try {
    const raw = localStorage.getItem(cacheKey(uid));
    if (!raw) return false;

    const data = JSON.parse(raw);

    // 🚀 INSTANT UI HYDRATION
    if (usernameEl) usernameEl.textContent = data.username || "—";
    if (xpEl) xpEl.textContent = data.xp ?? 0;

    if (joinedEl && data.createdAt) {
      const date = new Date(data.createdAt);
      joinedEl.textContent = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }

    return true;
  } catch {
    return false;
  }
}

function saveProfileCache(uid, data) {
  localStorage.setItem(
    cacheKey(uid),
    JSON.stringify({
      username: data.username || "",
      xp: data.xp ?? 0,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null,
      _cachedAt: Date.now()
    })
  );
}
auth.onAuthStateChanged(user => {
  if (!user) return;

  // Email from Auth (instant)
  if (emailEl) {
    emailEl.textContent = user.email || "—";
  }

  // 🔥 INSTANT LOAD FROM LOCAL CACHE
  loadCachedProfile(user.uid);

  const ref = doc(db, "users", user.uid);

  // 🔄 REAL-TIME PROFILE SYNC
  onSnapshot(ref, snap => {
    if (!snap.exists()) return;

    const data = snap.data();

    // Update UI (authoritative)
    if (usernameEl) {
      usernameEl.textContent = data.username || "—";
    }

    if (xpEl) {
      xpEl.textContent = data.xp ?? 0;
    }

    if (joinedEl) {
      if (data.createdAt?.toDate) {
        const date = data.createdAt.toDate();
        joinedEl.textContent = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      } else {
        joinedEl.textContent = "—";
      }
    }

    // 💾 UPDATE CACHE
    saveProfileCache(user.uid, data);
  });
});