import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const streakEl = document.getElementById("streakVal");
const mostXpEl = document.getElementById("mostXpVal");
const attemptsEl = document.getElementById("attemptVal");
const visitsEl = document.getElementById("visitVal");

function formatK(num = 0) {
  if (num < 1000) return num;
  return (num / 1000)
    .toFixed(num >= 10000 ? 0 : 2)
    .replace(/\.0+$/, "") + "k";
}

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  // 🔥 count page visit (fire-and-forget)
  updateDoc(ref, {
    pageVisits: increment(1)
  }).catch(() => {});

  // ✅ READ DATA
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  // ✅ RENDER
  streakEl.textContent = data.streak ?? 0;
  mostXpEl.textContent = formatK(data.bestXpDay ?? 0);
  attemptsEl.textContent = formatK(data.totalAttempts ?? 0);
  visitsEl.textContent = formatK(data.pageVisits ?? 0);
});