import { auth, db } from "../assets/js/firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =========================
   ADMIN CONFIG
========================= */
const ADMIN_EMAIL = "nicknow20@gmail.com";

/* =========================
   UI
========================= */
const msgInput = document.getElementById("msgInput");
const sendBtn  = document.getElementById("sendBtn");
const list     = document.getElementById("list");

/* =========================
   AUTH CHECK
========================= */
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Login required");
    location.href = "/";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    alert("Admin access only");
    location.href = "/";
  }
});

/* =========================
   ADD NOTIFICATION
========================= */
sendBtn.addEventListener("click", async () => {
  const message = msgInput.value.trim();
  if (!message) {
    alert("Message cannot be empty");
    return;
  }

  try {
    await addDoc(collection(db, "notifications"), {
      message,
      createdAt: serverTimestamp()
    });

    msgInput.value = "";
  } catch (err) {
    console.error("Add failed:", err);
    alert("Failed to add notification");
  }
});

/* =========================
   LIVE LIST (DELETE ONLY)
========================= */
const q = query(
  collection(db, "notifications"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, snap => {
  list.innerHTML = "";

  if (snap.empty) {
    list.innerHTML = "<p style='opacity:.6'>No notifications</p>";
    return;
  }

  snap.forEach(d => {
    const data = d.data();

    const row = document.createElement("div");
    row.className = "notification-row";

    row.innerHTML = `
      <span>${data.message}</span>
      <button class="delete-btn">Delete</button>
    `;

    row.querySelector(".delete-btn").onclick = () => {
  showConfirmToast(
    "Delete this notification permanently?",
    async () => {
      await deleteDoc(doc(db, "notifications", d.id));
    }
  );
};

    list.appendChild(row);
  });
});
/* =========================
   TOAST CONFIRM (REUSABLE)
========================= */

const confirmToast = document.getElementById("confirmToast");
const confirmText  = document.getElementById("confirmText");
const confirmYes   = document.getElementById("confirmYes");
const confirmCancel= document.getElementById("confirmCancel");

let confirmAction = null;

function showConfirmToast(message, onConfirm) {
  confirmText.textContent = message;
  confirmAction = onConfirm;

  confirmToast.classList.add("show");
}

function hideConfirmToast() {
  confirmToast.classList.remove("show");
  confirmAction = null;
}

confirmCancel.onclick = hideConfirmToast;

confirmYes.onclick = async () => {
  if (typeof confirmAction === "function") {
    await confirmAction();
  }
  hideConfirmToast();
};