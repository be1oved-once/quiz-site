import { doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

export async function addXP(amount = 1) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await updateDoc(doc(db, "users", user.uid), {
      xp: increment(amount)
    });
  } catch (err) {
    console.error("XP update failed:", err);
  }
}
