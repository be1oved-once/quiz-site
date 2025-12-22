import { auth, db, googleProvider } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const today = new Date().toISOString().slice(0, 10);

  if (!snap.exists()) {
    // 🔹 FIRST TIME USER (FULL CREATE)
    await setDoc(userRef, {
      username: user.displayName || "User",
      email: user.email || "",
      xp: 0,
      streak: 0,
      totalAttempts: 0,
      pageVisits: 0,
      bestXpDay: 0,
      dailyXp: 0,
      dailyXpDate: today,
      lastActiveDate: today,
      weeklyXp: {},
      settings: {
        theme: localStorage.getItem("quizta-theme") || "light"
      },
      createdAt: serverTimestamp()
    });

    console.log("🔥 User document created");
    return;
  }

  // 🔹 EXISTING USER → PATCH MISSING FIELDS ONLY
  const data = snap.data();
  const updates = {};

  if (data.xp === undefined) updates.xp = 0;
  if (data.streak === undefined) updates.streak = 0;
  if (data.totalAttempts === undefined) updates.totalAttempts = 0;
  if (data.pageVisits === undefined) updates.pageVisits = 0;
  if (data.bestXpDay === undefined) updates.bestXpDay = 0;
  if (data.dailyXp === undefined) updates.dailyXp = 0;
  if (!data.dailyXpDate) updates.dailyXpDate = today;
  if (!data.lastActiveDate) updates.lastActiveDate = today;
  if (!data.weeklyXp) updates.weeklyXp = {};
  if (!data.settings) {
    updates.settings = {
      theme: localStorage.getItem("quizta-theme") || "light"
    };
  }

  if (Object.keys(updates).length > 0) {
    await setDoc(userRef, updates, { merge: true });
    console.log("✅ Missing user fields patched");
  }
});