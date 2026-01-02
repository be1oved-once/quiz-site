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
const msg = document.getElementById("profileMsg");

let selectedGender = "";

/* DOB restriction (17 years) */
const today = new Date();
const minYear = today.getFullYear() - 17;
dobEl.max = `${minYear}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

/* Gender popup */
genderBtn.onclick = () => {
  genderPopup.classList.toggle("show");
};

genderPopup.querySelectorAll("button").forEach(btn => {
  btn.onclick = () => {
    selectedGender = btn.dataset.val;
    genderText.textContent = selectedGender;
    genderPopup.classList.remove("show");
  };
});

/* Close popup on outside click */
document.addEventListener("click", e => {
  if (!genderBtn.contains(e.target) && !genderPopup.contains(e.target)) {
    genderPopup.classList.remove("show");
  }
});

/* Load existing profile */
auth.onAuthStateChanged(async user => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  usernameEl.value = data.username || "";
  dobEl.value = data.dob || "";
  selectedGender = data.gender || "";
  if (selectedGender) genderText.textContent = selectedGender;
});

/* Save */
saveBtn.onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  if (!usernameEl.value || !dobEl.value || !selectedGender) {
    msg.textContent = "Please fill all fields";
    msg.style.color = "#ef4444";
    return;
  }

  await updateDoc(doc(db, "users", user.uid), {
    username: usernameEl.value.trim(),
    dob: dobEl.value,
    gender: selectedGender
  });

  msg.textContent = "Profile saved successfully";
  msg.style.color = "#22c55e";
};