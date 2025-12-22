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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { auth, db, googleProvider } from "./firebase.js";


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
overlay.addEventListener("click", () => toggleSidebar(false));

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
document.addEventListener("click", () => {
  const notifyBtn = document.getElementById("notifyBtn");
  const notifyPanel = document.getElementById("notifyPanel");
  const notifyClose = document.getElementById("notifyClose");

  if (!notifyBtn || !notifyPanel) return;

  // Toggle on bell click
  notifyBtn.addEventListener("click", e => {
    e.stopPropagation();
    notifyPanel.classList.toggle("show");
  });

  // Close button
  notifyClose?.addEventListener("click", () => {
    notifyPanel.classList.remove("show");
  });

  // Click outside
  document.addEventListener("click", e => {
    if (
      notifyPanel.classList.contains("show") &&
      !notifyPanel.contains(e.target) &&
      !notifyBtn.contains(e.target)
    ) {
      notifyPanel.classList.remove("show");
    }
  });
}, { once: true });


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

authClose.onclick = closeAuth;
authModal.onclick = e => {
  if (e.target === authModal) closeAuth();
};

switchAuth.onclick = () => {
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
};

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
    // (keep your existing code inside)


  const errorBox = document.getElementById("signupError");

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Create Firestore user document
    await setDoc(doc(db, "users", userCred.user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
      xp: 0,
      bookmarks: [],
      settings: {
        theme: localStorage.getItem("quizta-theme") || "light"
      }
    });

    closeAuth();
  } catch (err) {
    errorBox.textContent = err.message.replace("Firebase:", "");
  }
}); }

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
    // keep your code
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, "users", result.user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        username: result.user.displayName || "User",
        email: result.user.email,
        createdAt: serverTimestamp(),
        xp: 0,
        bookmarks: []
      });
    }

    closeAuth();
  } catch (err) {
    alert(err.message);
  }
}); }

onAuthStateChanged(auth, user => {

  const loginBtns = document.querySelectorAll(".auth-login");
  const signupBtns = document.querySelectorAll(".auth-signup");
  const logoutBtns = document.querySelectorAll(".auth-logout");

  if (user) {
    // 🔥 INSTANT UI REFLECT
    loginBtns.forEach(btn => btn.style.display = "none");
    signupBtns.forEach(btn => btn.style.display = "none");
    logoutBtns.forEach(btn => btn.style.display = "inline-flex");

    console.log("User logged in:", user.uid);

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