import { db } from "/assets/js/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =====================================================
   TAB SYSTEM
===================================================== */
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

/* =====================================================
   NOTIFICATION MODAL + CREATE
===================================================== */

const notifyMsgInput = document.getElementById("notifyMsgInput");
const notifySendBtn  = document.getElementById("notifySendBtn");

const createBtn = document.querySelector(".create-btn");
const notifyModal = document.getElementById("notifyModal");
const notifyBackdrop = document.getElementById("notifyModalBackdrop");
const notifyCloseBtn = document.querySelector(".notify-modal-close");

// open modal
createBtn.onclick = () => {
  notifyModal.classList.add("show");
  notifyBackdrop.classList.add("show");
};

// close modal
notifyBackdrop.onclick = closeNotifyModal;
notifyCloseBtn.onclick = closeNotifyModal;

function closeNotifyModal() {
  notifyModal.classList.remove("show");
  notifyBackdrop.classList.remove("show");
}

// send notification to Firestore
notifySendBtn?.addEventListener("click", async () => {
  const message = notifyMsgInput.value.trim();
  if (!message) return;

  try {
    await addDoc(collection(db, "notifications"), {
      message,
      createdAt: serverTimestamp()
    });

    notifyMsgInput.value = "";
    closeNotifyModal();

  } catch (e) {
    console.error("Notification Error:", e);
  }
});

/* =====================================================
   CONTACT REQUESTS (REQUESTS TAB)
===================================================== */

const requestsList = document.querySelector(".requests-list");
const clearAllBtn = document.querySelector(".clear-all");

// realtime listener
const reqQuery = query(
  collection(db, "contactMessages"),
  orderBy("createdAt", "desc")
);

onSnapshot(reqQuery, (snap) => {
  requestsList.innerHTML = "";

  if (snap.empty) {
    requestsList.innerHTML = "<p>No contact requests yet</p>";
    return;
  }

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "request-card";

    const time = data.createdAt
      ? data.createdAt.toDate().toLocaleString("en-IN")
      : "";

    card.innerHTML = `
      <p><b>${data.name}</b> (${data.email})</p>
      <p><b>Subject:</b> ${data.subject || "—"}</p>
      <p>${data.message}</p>
      <small>${time}</small>

      <div class="request-actions">
        <a class="success"
           href="mailto:${data.email}?subject=Re:${data.subject}">
          Reply
        </a>
        <button class="danger delete-btn">Delete</button>
      </div>
    `;

    // delete single request
    card.querySelector(".delete-btn").onclick = async () => {
      await deleteDoc(doc(db, "contactMessages", docSnap.id));
    };

    requestsList.appendChild(card);
  });
});

// clear all requests
clearAllBtn.onclick = async () => {
  const snap = await getDocs(collection(db, "contactMessages"));
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
  }
};