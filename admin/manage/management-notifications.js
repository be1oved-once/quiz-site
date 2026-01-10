import { db } from "/assets/js/firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ===== NOTIFICATION LIST TARGET ===== */
const list = document.querySelector(".notify-list");

/* ===== FIRESTORE QUERY ===== */
const q = query(
  collection(db, "notifications"),
  orderBy("createdAt", "desc")
);

/* ===== REALTIME LISTENER ===== */
onSnapshot(q, snap => {
  list.innerHTML = "";

  if (snap.empty) {
    list.innerHTML = "<p style='opacity:.6'>No notifications</p>";
    return;
  }

  snap.forEach(d => {
  const data = d.data();
  
  const card = document.createElement("div");
  card.className = "notify-card";
  
  let timeText = "Just now";
  if (data.createdAt) {
    timeText = data.createdAt.toDate().toLocaleString();
  }
  
  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
      
      <div>
       <p class="notify-text">${data.message}</p>
  <span class="notify-meta">Global • ${timeText}</span>
      </div>

  <button class="notify-del-btn">
    <i class="fa-solid fa-trash"></i>
  </button>

    </div>
  `;
  
  // ✅ Delete from Firestore
 card.querySelector(".notify-del-btn").onclick = async () => {
  await deleteDoc(doc(db, "notifications", d.id));
};
  
  list.appendChild(card);
});
});