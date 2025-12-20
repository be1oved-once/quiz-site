import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user || !window.BOOKMARK_MODE) return;

  const snap = await getDocs(
    collection(db, "users", user.uid, "bookmarks")
  );

  const bookmarkQuestions = [];

  snap.forEach(doc => {
    const d = doc.data();

    bookmarkQuestions.push({
      text: d.question,
      options: d.options,
      correctIndex: d.correctIndex,
      attempted: false,
      correct: false
    });
  });

  // 🛑 NOTHING ELSE ALLOWED
  if (bookmarkQuestions.length === 0) {
    document.getElementById("quizArea").classList.remove("hidden");
    document.getElementById("questionText").textContent =
      "No bookmarked questions yet ⭐";
    return;
  }

  // 🔥 FORCE OVERRIDE GLOBAL QUESTION SOURCE
  window.currentSubject = { name: "Bookmarks" };
  window.currentChapter = { name: "Bookmarks" };

  // 🔥 RESET STATE COMPLETELY
});