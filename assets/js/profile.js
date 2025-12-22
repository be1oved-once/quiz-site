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
/* =========================
   DOB PICKER
========================= */

const dobDayBtn = document.getElementById("dobDay");
const dobMonthBtn = document.getElementById("dobMonth");
const dobYearBtn = document.getElementById("dobYear");
const dobDropdown = document.getElementById("dobDropdown");
const dobValueInput = document.getElementById("dobValue");

let dob = { day: null, month: null, year: null };
let activeDobType = null;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

/* Open handlers */
dobDayBtn.onclick = e => openDob("day", e);
dobMonthBtn.onclick = e => openDob("month", e);
dobYearBtn.onclick = e => openDob("year", e);

function openDob(type, e) {
  e.stopPropagation();
  activeDobType = type;
  dobDropdown.innerHTML = "";
  dobDropdown.classList.remove("hidden");

  if (type === "day") {
    const max = dob.month !== null && dob.year !== null
      ? daysInMonth(dob.month, dob.year)
      : 31;

    for (let i = 1; i <= max; i++) addDobOption(i);
  }

  if (type === "month") {
    MONTHS.forEach((m, i) => addDobOption(m, i));
  }

  if (type === "year") {
    const current = new Date().getFullYear();
    for (let y = current; y >= 1950; y--) addDobOption(y);
  }

  requestAnimationFrame(() => {
    dobDropdown.classList.add("show");
    dobDropdown.style.maxHeight = dobDropdown.scrollHeight + "px";
  });
}

function addDobOption(label, value = label) {
  const btn = document.createElement("button");
  btn.textContent = label;

  btn.onclick = () => {
    if (activeDobType === "day") {
      dob.day = value;
      dobDayBtn.querySelector("span").textContent = label;
    }

    if (activeDobType === "month") {
      dob.month = value;
      dobMonthBtn.querySelector("span").textContent = label;
      dob.day = null;
      dobDayBtn.querySelector("span").textContent = "Day";
    }

    if (activeDobType === "year") {
      dob.year = value;
      dobYearBtn.querySelector("span").textContent = label;
      dob.day = null;
      dobDayBtn.querySelector("span").textContent = "Day";
    }

    updateDobValue();
    closeDobDropdown();
  };

  dobDropdown.appendChild(btn);
}

function closeDobDropdown() {
  dobDropdown.classList.remove("show");
  dobDropdown.style.maxHeight = null;

  setTimeout(() => {
    dobDropdown.classList.add("hidden");
    dobDropdown.innerHTML = "";
  }, 250);
}

function updateDobValue() {
  if (dob.day && dob.month !== null && dob.year) {
    dobValueInput.value =
      `${dob.year}-${String(dob.month + 1).padStart(2,"0")}-${String(dob.day).padStart(2,"0")}`;
  }
}
/* =========================
   GENDER DROPDOWN LOGIC
========================= */

const genderBtn = document.getElementById("genderBtn");
const genderValue = document.getElementById("genderValue");
const genderDropdown = document.getElementById("genderDropdown");

let genderOpen = false;

/* INITIAL STATE */
genderDropdown.style.maxHeight = "0px";
genderDropdown.style.overflow = "hidden";

/* TOGGLE DROPDOWN */
genderBtn.addEventListener("click", e => {
  e.stopPropagation();
  toggleGender();
});

function toggleGender() {
  genderOpen ? closeGender() : openGender();
}

function openGender() {
  genderOpen = true;
  genderDropdown.classList.add("show");

  // allow height calculation
  genderDropdown.style.maxHeight = genderDropdown.scrollHeight + "px";

  genderBtn.classList.add("active");
}

function closeGender() {
  genderOpen = false;
  genderDropdown.style.maxHeight = "0px";
  genderBtn.classList.remove("active");

  setTimeout(() => {
    genderDropdown.classList.remove("show");
  }, 250);
}

/* SELECT OPTION */
genderDropdown.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();

    genderValue.textContent = btn.textContent;
    closeGender();
  });
});

/* CLICK OUTSIDE CLOSE */
document.addEventListener("click", () => {
  if (genderOpen) closeGender();
});