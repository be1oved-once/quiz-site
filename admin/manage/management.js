import { db } from "/assets/js/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const notifyMsgInput = document.getElementById("notifyMsgInput");
const notifySendBtn  = document.getElementById("notifySendBtn");

notifySendBtn?.addEventListener("click", async () => {
  const message = notifyMsgInput.value.trim();
  if (!message) return;

  try {
    await addDoc(collection(db, "notifications"), {
      message,
      createdAt: serverTimestamp()
    });

    notifyMsgInput.value = "";

    // close modal
    document.getElementById("notifyModal").classList.remove("show");
    document.getElementById("notifyModalBackdrop").classList.remove("show");

  } catch (e) {
    console.error(e);
  }
});

const tabs = document.querySelectorAll(".mgmt-tab");
const screens = document.querySelectorAll(".mgmt-screen");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    screens.forEach(s => s.classList.remove("active"));

    tab.classList.add("active");
    document
      .getElementById("screen-" + tab.dataset.screen)
      .classList.add("active");
  });
});
// ===== Create Notification Modal =====
const createBtn = document.querySelector(".create-btn");
const notifyModal = document.getElementById("notifyModal");
const notifyBackdrop = document.getElementById("notifyModalBackdrop");

createBtn.onclick = () => {
  notifyModal.classList.add("show");
  notifyBackdrop.classList.add("show");
};

// close when clicking backdrop
notifyBackdrop.onclick = () => {
  notifyModal.classList.remove("show");
  notifyBackdrop.classList.remove("show");
};
// ===== Firestore send from Management modal =====
// ===== Close Button in Modal =====
const notifyCloseBtn = document.querySelector(".notify-modal-close");

notifyCloseBtn.onclick = () => {
  notifyModal.classList.remove("show");
  notifyBackdrop.classList.remove("show");
};