import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* Elements */
const usernameEl = document.getElementById("username");
const dobEl = document.getElementById("dob");
const genderBtn = document.getElementById("genderBtn");
const genderText = document.getElementById("genderText");
const genderPopup = document.getElementById("genderPopup");
const saveBtn = document.getElementById("saveProfile");
const editBtn = document.getElementById("editProfile");
const msg = document.getElementById("profileMsg");

let selectedGender = "";
let editMode = false;

/* DOB restriction */
const today = new Date();
const minYear = today.getFullYear() - 17;
dobEl.max = `${minYear}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

/* Gender popup */
genderBtn.onclick = () => {
  if (!editMode) return;
  genderPopup.classList.toggle("show");
};

genderPopup.querySelectorAll("button").forEach(btn => {
  btn.onclick = () => {
    selectedGender = btn.dataset.val;
    genderText.textContent = selectedGender;
    genderPopup.classList.remove("show");
  };
});

/* Outside click */
document.addEventListener("click", e => {
  if (!genderBtn.contains(e.target) && !genderPopup.contains(e.target)) {
    genderPopup.classList.remove("show");
  }
});

/* Load profile */
function getProfileKey(uid) {
  return `profile_${uid}`;
}

function loadProfileFromLocal(uid) {
  const raw = localStorage.getItem(getProfileKey(uid));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveProfileToLocal(uid, data) {
  localStorage.setItem(
    getProfileKey(uid),
    JSON.stringify({
      ...data,
      updatedAt: Date.now()
    })
  );
}

auth.onAuthStateChanged(async user => {
  if (!user) {
    // Clear UI
    usernameEl.value = "";
    dobEl.value = "";
    genderText.textContent = "Select Gender";
    selectedGender = "";
    return;
  }

  const uid = user.uid;

  /* 1️⃣ FAST LOAD FROM LOCALSTORAGE */
  const cached = loadProfileFromLocal(uid);
  if (cached) {
    usernameEl.value = cached.username || "";
    dobEl.value = cached.dob || "";
    selectedGender = cached.gender || "";
    if (selectedGender) genderText.textContent = selectedGender;
  }

  /* 2️⃣ BACKGROUND SYNC FROM FIRESTORE */
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  // Update UI (in case Firestore is newer)
  usernameEl.value = data.username || "";
  dobEl.value = data.dob || "";
  selectedGender = data.gender || "";
  if (selectedGender) genderText.textContent = selectedGender;

  // Sync localStorage
  saveProfileToLocal(uid, {
    username: data.username || "",
    dob: data.dob || "",
    gender: data.gender || ""
  });
});

/* Edit mode */
function setEditMode(state) {
  editMode = state;
  usernameEl.readOnly = !state;
  dobEl.readOnly = !state;
genderBtn.classList.toggle("readonly", !state);
  saveBtn.style.display = state ? "block" : "none";
  editBtn.style.display = state ? "none" : "inline-flex";
}

setEditMode(false);

editBtn.onclick = () => setEditMode(true);

/* Save */
saveBtn.onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  if (!usernameEl.value || !dobEl.value || !selectedGender) {
    msg.textContent = "Please fill all fields";
    msg.style.color = "#ef4444";
    return;
  }

  const payload = {
  username: usernameEl.value.trim(),
  dob: dobEl.value,
  gender: selectedGender,
  profileCompleted: true
};

await updateDoc(doc(db, "users", user.uid), payload);

/* 🔥 Sync localStorage instantly */
saveProfileToLocal(user.uid, payload);

  msg.textContent = "Profile saved successfully";
  msg.style.color = "#22c55e";
  setEditMode(false);
};