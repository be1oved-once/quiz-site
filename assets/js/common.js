import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { auth, db, googleProvider } from "./firebase.js";
import {
  signInWithCredential,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

function initGoogleOneTap() {
  if (!window.google || !auth) return;

  google.accounts.id.initialize({
    client_id:
      "54581941326-9bsoei7p9gem6bff3pjsl5tju1ckst8l.apps.googleusercontent.com",
    callback: async response => {
      try {
        const credential = GoogleAuthProvider.credential(
          response.credential
        );
        await signInWithCredential(auth, credential);
        console.log("✅ One Tap login success");
      } catch (e) {
        console.error("❌ One Tap failed", e);
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true
  });

  google.accounts.id.prompt();
}

document.addEventListener("DOMContentLoaded", () => {
  initGoogleOneTap();
});

const sidebar = document.getElementById("rightSidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");


let startX = 0;
let currentX = 0;
let dragging = false;

/* Lock scroll */
function lockScroll(lock) {
  document.body.style.overflow = lock ? "hidden" : "";
}



/* Toggle Sidebar */
function toggleSidebar(open) {
  sidebar.classList.toggle("open", open);
  menuBtn.classList.toggle("active", open);
  overlay.classList.toggle("show", open);
  lockScroll(open);
}

/* Menu click */
if (menuBtn && sidebar && overlay) {
  menuBtn.addEventListener("click", () => {
    toggleSidebar(!sidebar.classList.contains("open"));
  });

  overlay.addEventListener("click", () => toggleSidebar(false));
}

/* Overlay click */


/* Smooth swipe physics */
document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  dragging = startX > window.innerWidth * 0.9; // 👈 only right edge
});


document.addEventListener("touchend", e => {
  if (!dragging) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  dragging = false;

  if (diff > 50) toggleSidebar(true);
});

function applyTheme(mode) {
  const isDark = mode === "dark";
  
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("quizta-theme", mode);
  
  // Header icon
  document.querySelectorAll("#themeBtn i").forEach(icon => {
    icon.classList.toggle("fa-moon", isDark);
    icon.classList.toggle("fa-sun", !isDark);
  });
  
  // Sidebar switch
  document.querySelectorAll("#themeToggle").forEach(sw => {
    sw.classList.toggle("active", isDark);
  });
}

// Load theme on start
document.addEventListener("click", e => {
  // Header icon click
  if (e.target.closest("#themeBtn")) {
    const isDark = document.body.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  }

  // Sidebar switch click
  if (e.target.closest("#themeToggle")) {
    const isDark = document.body.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  }
});
applyTheme(localStorage.getItem("quizta-theme") || "light");


/* =========================
   NOTIFICATIONS TOGGLE (SAFE)
========================= */
const leftSidebar = document.getElementById("leftSidebar");
const leftStrip = document.getElementById("leftStrip");
const leftOverlay = document.getElementById("leftOverlay");

let touchStartX = 0;
let touchEndX = 0;
let leftOpen = false;

/* Toggle left sidebar */
function toggleLeft(force) {
  leftOpen = typeof force === "boolean" ? force : !leftOpen;
  leftSidebar.classList.toggle("open", leftOpen);
  leftOverlay.classList.toggle("show", leftOpen);
  lockScroll(leftOpen);
}

/* Click strip */
if (leftStrip) {
  leftStrip.addEventListener("click", () => {
    toggleLeft();
  });
}

if (leftOverlay) {
  leftOverlay.addEventListener("click", () => {
    toggleLeft(false);
  });
}

/* Global swipe handler */
document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  if (sidebar?.classList.contains("open")) return;
  touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;

  /* ---- OPEN: swipe left → right from left edge ---- */
  if (
    !leftOpen &&
    touchStartX <= window.innerWidth * 0.1 &&
    diff > 60
  ) {
    toggleLeft(true);
    return;
  }

  /* ---- CLOSE: swipe right → left anywhere ---- */
  if (
    leftOpen &&
    diff < -60
  ) {
    toggleLeft(false);
  }
});

const authModal = document.getElementById("authModal");
const authClose = document.getElementById("authClose");
const switchAuth = document.getElementById("switchAuth");
const authTitle = document.getElementById("authTitle");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const switchText = document.getElementById("switchText");

function openAuth() {
  authModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeAuth() {
  authModal.classList.remove("show");
  document.body.style.overflow = "auto";
}

authClose?.addEventListener("click", closeAuth);
authModal.onclick = e => {
  if (e.target === authModal) closeAuth();
};

switchAuth?.addEventListener("click", () => {
  const isLogin = !loginForm.classList.contains("hidden");
document.getElementById("loginError").textContent = "";
document.getElementById("signupError").textContent = "";
  loginForm.classList.toggle("hidden");
  signupForm.classList.toggle("hidden");

  authTitle.textContent = isLogin ? "Sign Up" : "Login";
  switchAuth.textContent = isLogin ? "Login" : "Sign Up";
  switchText.textContent = isLogin
    ? "Already have an account?"
    : "Not have an account?";
});

const authError = document.getElementById("authError");

/* ---------- Password rules ---------- */
function validatePassword(pass) {
  return (
    pass.length >= 8 &&
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /[0-9]/.test(pass) &&
    /[^A-Za-z0-9]/.test(pass)
  );
}

/* ---------- LOGIN ---------- */
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    // (keep your existing code inside)
  

  const errorBox = document.getElementById("loginError");
  const emailOrUser = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, emailOrUser, password);
    closeAuth();
  } catch (err) {
    errorBox.textContent = err.message.replace("Firebase:", "");
  }
});
}
/* ---------- SIGNUP ---------- */
if (signupForm) {
signupForm.addEventListener("submit", async e => {
  e.preventDefault();

  const errorBox = document.getElementById("signupError");

  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  if (!signupTurnstileToken) {
    errorBox.textContent = "Please verify you are human";
    return;
  }

  try {
    const verify = await fetch("/api/verify-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        token: signupTurnstileToken
      })
    });

    const data = await verify.json();

    if (!verify.ok) {
      errorBox.textContent = data.error || "Signup failed";
      return;
    }

    // reset token so replay is impossible
    signupTurnstileToken = null;

    closeAuth();

  } catch (err) {
    errorBox.textContent = "Signup failed. Try again.";
  }
});
}
let signupTurnstileToken = null;

window.onSignupTurnstile = function (token) {
  signupTurnstileToken = token;
};
async function ensureUserProfile(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const username =
    user.displayName ||
    user.email?.split("@")[0] ||
    "Student";

  if (!snap.exists()) {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        username,
        email: user.email || "",
        provider: user.providerData[0]?.providerId || "password",
        createdAt: serverTimestamp(),
        xp: 0,
        bookmarks: [],
        settings: {
          theme: localStorage.getItem("quizta-theme") || "light"
        }
      },
      { merge: true }
    );
  }
}

document.addEventListener("click", e => {
  if (!e.target.classList.contains("toggle-pass")) return;

  const input = e.target.previousElementSibling;
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    e.target.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    e.target.classList.replace("fa-eye-slash", "fa-eye");
  }
});
const googleBtn = document.querySelector(".google-btn");

if (googleBtn) {
googleBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    closeAuth();
  } catch (err) {
    alert(err.message);
  }
});
}

onAuthStateChanged(auth, async user => {

  const loginBtns = document.querySelectorAll(".auth-login");
  const signupBtns = document.querySelectorAll(".auth-signup");
  const logoutBtns = document.querySelectorAll(".auth-logout");

  if (user) {
    // 🔥 INSTANT UI REFLECT
    loginBtns.forEach(btn => btn.style.display = "none");
    signupBtns.forEach(btn => btn.style.display = "none");
    logoutBtns.forEach(btn => btn.style.display = "inline-flex");

    console.log("User logged in:", user.uid);

    await ensureUserProfile(user);
    // ⏳ Load Firestore data separately
    loadUserProfile(user.uid);

  } else {
    // 🔥 INSTANT UI REFLECT
    loginBtns.forEach(btn => btn.style.display = "inline-flex");
    signupBtns.forEach(btn => btn.style.display = "inline-flex");
    logoutBtns.forEach(btn => btn.style.display = "none");

    console.log("User logged out");
  }
});

window.openAuth = openAuth;
window.closeAuth = closeAuth;
document.addEventListener("click", async e => {
  if (!e.target.classList.contains("auth-logout")) return;

  try {
    await auth.signOut();

    // open existing auth popup again
    if (typeof openAuth === "function") {
      openAuth();
    }

  } catch (err) {
    console.error("Logout failed:", err);
  }
});

async function loadUserProfile(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data = snap.data();

    // Example future use:
    // window.userXP = data.xp;
    // window.userSettings = data.settings;

    console.log("User profile synced");

  } catch (err) {
    console.error("Profile sync failed:", err);
  }
}

const settingsModal = document.getElementById("settingsModal");
const settingsClose = document.getElementById("settingsClose");

/* Open settings (Settings page OR icon later) */
function openSettings() {
  settingsModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeSettings() {
  settingsModal.classList.remove("show");
  document.body.style.overflow = "auto";
}

settingsClose?.addEventListener("click", closeSettings);

settingsModal?.addEventListener("click", e => {
  if (e.target === settingsModal) closeSettings();
});

/* Toggle UI only */
document.addEventListener("click", e => {
  if (!e.target.classList.contains("toggle-switch")) return;
  e.target.classList.toggle("active");
});

/* expose globally */
window.openSettings = openSettings;

const profileBtn = document.getElementById("profileBtn");
const profilePopup = document.getElementById("profilePopup");

profileBtn?.addEventListener("click", e => {
  e.stopPropagation();

  // 🔥 CLOSE notification panel if open
  if (notifyPanel?.classList.contains("show")) {
    notifyPanel.classList.remove("show");
  }

  if (profilePopup.style.maxHeight) {
    closeProfilePopup();
  } else {
    openProfilePopup();
  }
});

function openProfilePopup() {
  if (!profilePopup) return;
  profilePopup.style.maxHeight = profilePopup.scrollHeight + "px";
}

function closeProfilePopup() {
  if (!profilePopup) return;
  profilePopup.style.maxHeight = null;
}

document.addEventListener("click", () => {
  closeProfilePopup();
});
/* =========================
   NOTIFICATIONS (GLOBAL)
========================= */

/* =========================
   NOTIFICATIONS (GLOBAL)
========================= */
const notifyBtn = document.getElementById("notifyBtn");
const notifyPanel = document.getElementById("notifyPanel");
const notifyList = document.getElementById("notifyList");
const notifyClose = document.getElementById("notifyClose");
const notifyDot = document.querySelector(".notify-dot");

if (notifyBtn && notifyPanel && notifyList) {
  
  /* Toggle panel */
  notifyBtn?.addEventListener("click", e => {
  e.stopPropagation();

  // 🔥 CLOSE profile popup if open
  closeProfilePopup();

  notifyPanel.classList.toggle("show");
  setLastSeenNotify(Date.now());
  notifyDot && (notifyDot.style.display = "none");
});
  
  /* Close button */
  notifyClose?.addEventListener("click", () => {
    notifyPanel.classList.remove("show");
  });
  
  /* Click outside closes */
  document.addEventListener("click", e => {
    if (
      notifyPanel.classList.contains("show") &&
      !notifyPanel.contains(e.target) &&
      !notifyBtn.contains(e.target)
    ) {
      notifyPanel.classList.remove("show");
    }
  });
  
const notifyBtnMobile = document.getElementById("notifyBtnMobile");

notifyBtnMobile?.addEventListener("click", e => {
  e.stopPropagation();
  notifyPanel.classList.toggle("show");
});

  /* 🔥 REAL-TIME FETCH */
  const q = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc")
  );
  
  onSnapshot(q, snap => {
  notifyList.innerHTML = "";

  if (snap.empty) {
    notifyList.innerHTML =
      "<div class='notify-item'>No notifications</div>";
    return;
  }

  let newestTime = 0;
  const lastSeen = getLastSeenNotify();

  snap.forEach(docSnap => {
    const data = docSnap.data();

    const created =
      data.createdAt?.toMillis?.() || 0;

    if (created > newestTime) {
      newestTime = created;
    }

    const item = document.createElement("div");
item.className = "notify-item";

item.innerHTML = `
  <p class="notify-text">${data.message}</p>
  <small class="notify-time">${formatTime(data.createdAt)}</small>
`;

    notifyList.appendChild(item);
  });

  // 🔔 SHOW DOT ONLY IF NEW NOTIFICATION ARRIVED
  if (newestTime > lastSeen) {
    notifyDot && (notifyDot.style.display = "inline-block");
  }
});
}
function getLastSeenNotify() {
  return parseInt(localStorage.getItem("lastSeenNotify") || "0");
}

function setLastSeenNotify(ts) {
  localStorage.setItem("lastSeenNotify", ts);
}
function formatTime(ts) {
  if (!ts) return "";

  const date = ts.toDate();
  const now = new Date();

  const diffMin = Math.floor((now - date) / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
}
/* =========================
   ADMIN SIDEBAR VISIBILITY
========================= */
const ADMIN_EMAILS = [
  "nicknow20@gmail.com",
  "saurabhjoshionly@gmail.com"
];

onAuthStateChanged(auth, user => {
  const adminItems = document.querySelectorAll(".admin-only");
  if (!adminItems.length) return;

  const isAdmin =
    user && ADMIN_EMAILS.includes(user.email);

  adminItems.forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
  
  
});

const TEMP_TEST_REF = doc(db, "tempTests", "current");

onSnapshot(TEMP_TEST_REF, snap => {
  if (!snap.exists()) {
    injectTempTestItem(false);
    return;
  }
  
  const data = snap.data();
  
  if (data.status === "live") {
    injectTempTestItem(true);
  } else {
    injectTempTestItem(false);
  }
});

/* =========================
   PWA SERVICE WORKER
========================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker registered");

      // 🔄 Force update check
      reg.update();
    } catch (err) {
      console.error("❌ SW failed", err);
    }
  });
}

/* =========================
   PWA INSTALL LOGIC
========================= */
let installPrompt = null;
let installTimer = null;

function initPWAInstall() {
  const banner = document.getElementById("installBanner");
  const installBtn = document.getElementById("installBtn");
  const closeBtn = document.getElementById("installClose");

  if (!banner || !installBtn || !closeBtn) {
    console.warn("❌ PWA banner elements missing");
    return;
  }

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    installPrompt = e;

    installTimer = setTimeout(() => {
      if (!localStorage.getItem("pwaDismissed")) {
        banner.classList.remove("hidden");
        banner.classList.add("pwa-attention");
      }
    }, 10000); // ⏱ 10 seconds
  });

  installBtn.addEventListener("click", async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    await installPrompt.userChoice;

    installPrompt = null;
    hide();
  });

  closeBtn.addEventListener("click", () => {
    localStorage.setItem("pwaDismissed", "1");
    hide();
  });

  function hide() {
    banner.classList.add("hidden");
    banner.classList.remove("pwa-attention");
    if (installTimer) clearTimeout(installTimer);
  }
}

/* ✅ SAFE AUTO INIT */
document.addEventListener("DOMContentLoaded", initPWAInstall);