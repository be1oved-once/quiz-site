import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from
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

// ===== PROFILE PIC ELEMENTS =====
const pfpCircle = document.getElementById("pfpCircle");
const pfpImage = document.getElementById("pfpImage");
const pfpPopup = document.getElementById("pfpPopup");

let selectedPfp = "";
// ===== PREDEFINED AVATARS =====
/* ===== PFP LIST ===== */
const avatarList = [
  // Human / realistic cartoon
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayaan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kunal",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sana",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika",
  
  // Glasses / hoodie style
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoodie1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoodie2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Geek1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Geek2",
  
  // Pastel flat humans
  "https://api.dicebear.com/7.x/lorelei/svg?seed=P1",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=P2",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=P3",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=P4",
  
  // Anime style
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Anime1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Anime2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Anime3",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Anime4",
  
  // Minimal clean humans
  "https://api.dicebear.com/7.x/personas/svg?seed=Mini1",
  "https://api.dicebear.com/7.x/personas/svg?seed=Mini2",
  "https://api.dicebear.com/7.x/personas/svg?seed=Mini3",
  "https://api.dicebear.com/7.x/personas/svg?seed=Mini4",
  
  // Pixel style
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pix1",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pix2",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pix3",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pix4",
  
  // Fun stylized
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun1",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun2",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun3",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun4",
  
  // Extra human variations
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoya",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
];

// Build avatar popup
avatarList.forEach(url => {
  const img = document.createElement("img");
  img.src = url;
  img.onclick = () => {
    selectedPfp = url;
    pfpImage.src = url;
    pfpPopup.classList.remove("show");
  };
  pfpPopup.appendChild(img);
});
// Open popup only in edit mode
pfpCircle.onclick = () => {
  if (!editMode) return;
  pfpPopup.classList.toggle("show");
};

// Close if clicking outside
document.addEventListener("click", e => {
  if (!pfpCircle.contains(e.target) && !pfpPopup.contains(e.target)) {
    pfpPopup.classList.remove("show");
  }
});


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
    window.location.replace("/index.html#login");
    return;
  }

  // If email not verified → always go verify page
  if (!user.emailVerified) {
    window.location.replace("/signup-verified.html");
    return;
  }

  // ✅ Only verified users reach here
  
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
  if (cached && cached.pfp) {
  selectedPfp = cached.pfp;
  pfpImage.src = cached.pfp;
}
  if (cached) {
    usernameEl.value = cached.username || "";
    dobEl.value = cached.dob || "";
    selectedGender = cached.gender || "";
    if (selectedGender) genderText.textContent = selectedGender;
  }

  /* 2️⃣ BACKGROUND SYNC FROM FIRESTORE */
  const ref = doc(db, "users", uid);
const snap = await getDoc(ref);

if (!snap.exists()) {
  // No profile doc yet → just show empty form
  document.getElementById("profileSkeleton").style.display = "none";
  document.getElementById("profileContent").style.display = "block";
  return;
}

const data = snap.data();
// ===== LOAD PROFILE PICTURE =====
selectedPfp = data.pfp || "";

if (selectedPfp) {
  pfpImage.src = selectedPfp;
} else {
  // default avatar if none saved
  selectedPfp = avatarList[0];
  pfpImage.src = selectedPfp;
}

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
  // ===== Hide skeleton, show real content =====
document.getElementById("profileSkeleton").style.display = "none";
document.getElementById("profileContent").style.display = "block";
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
  pfp: selectedPfp || avatarList[0],
  profileCompleted: true
};

// Update main user profile
await updateDoc(doc(db, "users", user.uid), payload);

// 🔥 ALSO update public leaderboard profile data
await setDoc(doc(db, "publicLeaderboard", user.uid), {
  name: payload.username,
  dob: payload.dob,
  pfp: payload.pfp,
  gender: payload.gender
}, { merge: true });

/* 🔥 Sync localStorage instantly */
saveProfileToLocal(user.uid, payload);

  msg.textContent = "Profile saved successfully";
  msg.style.color = "#22c55e";
  setEditMode(false);
  setTimeout(() => {
  window.location.replace("/index.html");
}, 500);
};