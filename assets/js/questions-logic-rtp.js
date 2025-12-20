/* =========================
   FIREBASE + XP
========================= */
import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let currentUser = null;
let currentXP = 0;
const xpEl = document.getElementById("xpValue");

import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

auth.onAuthStateChanged(user => {
  if (!user) {
    currentUser = null;
    currentXP = 0;
    if (xpEl) xpEl.textContent = "00";
    return;
  }

  currentUser = user;

  // 🔥 REAL-TIME XP (NO DELAY)
  onSnapshot(doc(db, "users", user.uid), snap => {
    if (!snap.exists()) return;

    const data = snap.data();
    currentXP = data.xp || 0;

    if (xpEl) {
      xpEl.textContent = String(currentXP).padStart(2, "0");
    }
  });
});

/* =========================
   DATA
========================= */
import { rtpMtpSubjects } from "./rtp-mtp.js";


const chapterText = document.getElementById("chapterText");
const attemptPopup = document.getElementById("attemptPopup");
attemptPopup.addEventListener("click", e => {
  e.stopPropagation();
});
const chapterPopup = document.getElementById("chapterPopup");
let selectedAttempt = null;

let currentSubject = null;


let baseQuestions = [];     // original limited list

let wrongQuestions = [];    // retry pool

let qIndex = 0;
let round = 1;
let marks = 0;
let round1Completed = false;
let timer = null;
let autoNextTimeout = null;
let timeLeft = 45;
let answered = false;
let round1Snapshot = [];
window.round1Snapshot = round1Snapshot;
/* =========================
   DOM
========================= */
const subjectBtn = document.getElementById("subjectBtn");
const chapterBtn = document.getElementById("chapterBtn");
const subjectText = document.getElementById("subjectText");

const subjectPopup = document.getElementById("subjectPopup");

const startBtn = document.getElementById("startQuiz");
const resetBtn = document.getElementById("resetQuiz");

const quizArea = document.getElementById("quizArea");
const qText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const timeEl = document.getElementById("timeLeft");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const limitInput = document.getElementById("questionLimit");
const progressBar = document.getElementById("progressBar");

const roundLabel = document.getElementById("roundLabel");
const marksBox = document.getElementById("marksBox");
const marksValue = document.getElementById("marksValue");
/* =========================
   INITIAL STATE (PAGE LOAD)
========================= */
limitInput.disabled = true;
resetBtn.disabled = true;
prevBtn.disabled = true;
nextBtn.disabled = true;
/* =========================
   SUBJECT POPUP
========================= */
function resetMarksState() {
  marks = 0;
  round1Completed = false;

  if (marksValue) marksValue.textContent = "0";
  if (marksBox) marksBox.classList.add("hidden");
}
function closeAllPopups() {
  if (subjectPopup) subjectPopup.classList.remove("show");
  if (attemptPopup) attemptPopup.classList.remove("show");
}

function resetReviewState() {
  round1Snapshot = [];
  window.round1Snapshot = [];

  const reviewContent = document.getElementById("reviewContent");
  const reviewPanel = document.getElementById("reviewPanel");

  if (reviewContent) reviewContent.innerHTML = "";
  if (reviewPanel) reviewPanel.classList.add("hidden");
}

subjectBtn.onclick = () => {
  resetReviewState();
  resetBtn.disabled = true;
limitInput.disabled = true;
  if (!subjectPopup) return;

  closeAllPopups();

  subjectPopup.innerHTML = "";
  subjectPopup.classList.add("show");

  rtpMtpSubjects.forEach(sub => {
    const b = document.createElement("button");
    b.textContent = sub.name;

    b.onclick = () => {
      resetReviewState();
      currentSubject = sub;
      subjectText.textContent = sub.name;

      selectedAttempt = null;
      chapterText.textContent = "Select Attempt";
      chapterBtn.classList.remove("disabled");

      resetMarksState();
      quizArea.classList.add("hidden");

      closeAllPopups();
    };

    subjectPopup.appendChild(b);
  });
};

/* =========================
   CHAPTER POPUP
========================= */
chapterBtn.addEventListener("click", () => {
  if (!currentSubject) return;

  attemptPopup.innerHTML = "";
  attemptPopup.classList.toggle("show");

  renderAttemptPopup();
});
function renderAttemptPopup() {
  console.log("Current subject:", currentSubject);
console.log("All subjects:", rtpMtpSubjects);
  attemptPopup.innerHTML = "";

  const subjectData = rtpMtpSubjects.find(
  s => s.name === currentSubject.name
);

  if (!subjectData) {
    attemptPopup.innerHTML = "<div>No attempts available</div>";
    return;
  }

  ["RTP", "MTP"].forEach(type => {
    const section = document.createElement("div");
    section.className = "attempt-section";

    const header = document.createElement("label");
    header.className = "attempt-header";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
checkbox.name = "attemptType";

    const title = document.createElement("span");
    title.textContent = type;

    header.appendChild(checkbox);
    header.appendChild(title);

    const list = document.createElement("div");
    list.className = "attempt-list";

checkbox.addEventListener("change", e => {
  e.stopPropagation();

  if (checkbox.checked) {
    // 🔒 close other lists
    document.querySelectorAll(".attempt-list").forEach(l => {
      l.classList.remove("show");
      l.style.maxHeight = null;
    });

    list.classList.add("show");
    list.style.maxHeight = list.scrollHeight + "px";
  } else {
    list.classList.remove("show");
    list.style.maxHeight = null;
  }
});

    subjectData.attempts
      .filter(a => a.type === type)
      .forEach(att => {
        const btn = document.createElement("button");
        btn.textContent = att.name;

btn.onclick = () => {
  selectedAttempt = att;
  chapterText.textContent = att.name;
  attemptPopup.classList.remove("show");
  
  // ✅ ENABLE CONTROLS AFTER ATTEMPT SELECTION
  limitInput.disabled = false;
  resetBtn.disabled = false;
};

        list.appendChild(btn);
      });

    section.appendChild(header);
    section.appendChild(list);
    attemptPopup.appendChild(section);
  });
}

/* =========================
   START
========================= */
startBtn.onclick = () => {
  resetMarksState();
  if (!currentSubject || !selectedAttempt) {
    alert("Select subject and attempt (RTP / MTP)");
    return;
  }

  const max = selectedAttempt.questions.length;
let limit = parseInt(limitInput.value || max);
limit = Math.max(1, Math.min(limit, max));
limitInput.value = limit;

baseQuestions = selectedAttempt.questions
  .slice(0, limit)
  .map(q => ({
    ...q,
    attempted: false,
    everAttempted: false,
    correct: false
  }));

round = 1;
updateRoundLabel();
startRound(baseQuestions);

  resetBtn.disabled = false;
  limitInput.disabled = false;
};

/* =========================
   RESET
========================= */
resetBtn.onclick = () => {
  resetReviewState();
  marks = 0;
round1Completed = false;
if (marksValue) marksValue.textContent = "0";
if (marksBox) marksBox.classList.add("hidden");
  quizArea.classList.add("hidden");

  subjectText.textContent = "None Selected";
  chapterText.textContent = "None Selected";

  currentSubject = null;

  limitInput.disabled = true;
  resetBtn.disabled = true;

  prevBtn.disabled = true;
  nextBtn.disabled = true;
  // ⏱ reset timer view
  timeEl.textContent = "--";
};

/* =========================
   XP LOCAL STORAGE HELPERS
========================= */
function xpKey(uid) {
  return `xp_${uid}`;
}

function getLocalXP(uid) {
  return parseInt(localStorage.getItem(xpKey(uid))) || 0;
}

function setLocalXP(uid, xp) {
  localStorage.setItem(xpKey(uid), xp);
}
/* =========================
   ROUND CONTROL
========================= */
let activeQuestions = [];
function startRound(list) {
  activeQuestions = list;
  qIndex = 0;
  quizArea.classList.remove("hidden");
  renderQuestion();
}

/* =========================
   TIMER
========================= */
function startTimer() {
  clearInterval(timer);
  timeLeft = 45;
  updateTimer();

  timer = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);
      autoNext(); // ⬅ NO correct shown
    }
  }, 1000);
}

function updateTimer() {
  timeEl.textContent = String(timeLeft).padStart(2, "0");
  timeEl.classList.toggle("danger", timeLeft <= 5);
}

function clearTimer() {
  clearInterval(timer);
}

/* =========================
   RENDER
========================= */
function cleanQuestionText(text) {
  return text.replace(/^(\(\d+\)|\d+\.|\d+\)|\s)+/g, "").trim();
}
function updateRoundLabel() {
  if (!roundLabel) return;

  if (round === 1) {
    roundLabel.textContent = "Practice";
  } else {
    roundLabel.textContent = "Retrying Round";
  }
}

document.addEventListener("click", e => {
  if (
  attemptPopup &&
  !attemptPopup.contains(e.target) &&
  !chapterBtn.contains(e.target)
) {
  attemptPopup.classList.remove("show");
}
});
function renderQuestion() {
  clearTimeout(autoNextTimeout);
autoNextTimeout = null;
  clearTimer();
  answered = false;

  const q = activeQuestions[qIndex];
  qText.textContent = `${qIndex + 1}. ${q.text}`;

  progressBar.style.width =
    ((qIndex + 1) / activeQuestions.length) * 100 + "%";

  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.disabled = q.attempted;

    if (q.attempted && i === q.correctIndex) {
      btn.classList.add("correct");
    }

    btn.onclick = () => handleAnswer(btn, i);
    optionsBox.appendChild(btn);
  });

  prevBtn.disabled = qIndex === 0;
  nextBtn.disabled = !q.attempted;

  if (!q.attempted) startTimer();
}

/* =========================
   ANSWER
========================= */
async function handleAnswer(btn, idx) {
  if (answered) return;
  answered = true;
  clearTimer();

  const q = activeQuestions[qIndex];
  q.attempted = true;

  const all = optionsBox.children;
  [...all].forEach(b => (b.disabled = true));

  if (idx === q.correctIndex) {
  btn.classList.add("correct");
  q.correct = true;
  if (round === 1) {
    marks += 1;
  }

if (currentUser) {
  // 🔥 ONE XP WRITE (Firestore is boss)
  await updateDoc(doc(db, "users", currentUser.uid), {
    xp: increment(5)
  });

  // 🔥 Metrics
  await recordQuestionAttempt(5);
  await updateBestXpIfNeeded();
}

  setTimeout(next, 1000);
} else {
  btn.classList.add("wrong");
  all[q.correctIndex].classList.add("correct");
  q.correct = false;
if (round === 1) {
    marks -= 0.25;
  }
  if (currentUser) {
  recordQuestionAttempt(0); // attempt counted, no XP
}
  // ✅ Enable next immediately
  nextBtn.disabled = false;

  // ⏳ Auto move after 3s (if user doesn't click)
  autoNextTimeout = setTimeout(() => {
    next();
  }, 3000);
    q.selectedIndex = idx;
}
}

/* =========================
   TIME UP → NEXT
========================= */
function autoNext() {
  clearTimeout(autoNextTimeout);
autoNextTimeout = null;
  const q = activeQuestions[qIndex];
  q.attempted = true;
  q.correct = false;
  next();
}

/* =========================
   NAV
========================= */
function next() {
  nextBtn.disabled = false;

  if (qIndex < activeQuestions.length - 1) {
    qIndex++;
    renderQuestion();
  } else {
    finishRound();
  }
}

prevBtn.onclick = () => {
  if (qIndex > 0) {
    qIndex--;
    renderQuestion();
  }
};

nextBtn.onclick = () => {
  if (autoNextTimeout) {
    clearTimeout(autoNextTimeout);
    autoNextTimeout = null;
  }
  next();
};

/* =========================
   FINISH ROUND
========================= */
function finishRound() {
  if (round === 1 && !round1Completed) {
  round1Completed = true;
  
  // 📸 Freeze Round 1 questions for review
  round1Snapshot = activeQuestions.map(q => ({ ...q }));
window.round1Snapshot = round1Snapshot;
  
  // ✅ Show marks
  marksValue.textContent = marks.toFixed(2);
  marksBox.classList.remove("hidden");
  
  // ✅ Show result action buttons
  const resultActions = document.querySelector(".result-actions");
  if (resultActions) resultActions.classList.remove("hidden");
}
  wrongQuestions = activeQuestions.filter(q => !q.correct);

  if (wrongQuestions.length > 0) {
    round++;

updateRoundLabel();

const retrySet = wrongQuestions.map(q => ({
  ...q,
  attempted: false
}));

startRound(retrySet);
  } else {
  qText.textContent = "सब सही कर दिए! 🤗 मार्क्स नीच दिए है!";
  optionsBox.innerHTML = "";
  progressBar.style.width = "100%";
  
  // ❌ Disable navigation
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  
  // ❌ Disable reset again
  resetBtn.disabled = true;
  
  // ⏱ Remove timer
  clearTimer();
  timeEl.textContent = "--";
}
}
document.addEventListener("click", e => {
  if (
    subjectBtn &&
    !subjectBtn.contains(e.target) &&
    chapterBtn &&
    !chapterBtn.contains(e.target) &&
    subjectPopup &&
    !subjectPopup.contains(e.target) &&
    attemptPopup &&
    !attemptPopup.contains(e.target)
  ) {
    closeAllPopups();
  }
});
function slideToggle(popup, open) {
  if (!popup) return;

  if (open) {
    popup.classList.add("show");
    popup.style.maxHeight = popup.scrollHeight + "px";
  } else {
    popup.style.maxHeight = null;
    popup.classList.remove("show");
  }
}
async function recordQuestionAttempt(xpGained) {
  if (!currentUser) return;

  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const today = new Date().toISOString().slice(0, 10);

  let updates = {
    totalAttempts: increment(1),
    dailyXp: increment(xpGained)
  };

  // 🔥 STREAK LOGIC (ONLY ON FIRST ATTEMPT OF DAY)
  if (data.lastActiveDate !== today) {
    let streak = data.streak || 0;

    if (data.lastActiveDate) {
      const diff =
        (new Date(today) - new Date(data.lastActiveDate)) /
        (1000 * 60 * 60 * 24);

      streak = diff === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }

    updates.streak = streak;
    updates.lastActiveDate = today;
    updates.dailyXp = xpGained; // reset daily XP
  }

  await updateDoc(ref, updates);
}
async function updateBestXpIfNeeded() {
  if (!currentUser) return;

  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const dailyXp = data.dailyXp || 0;
  const bestXpDay = data.bestXpDay || 0;

  if (dailyXp > bestXpDay) {
    await updateDoc(ref, {
      bestXpDay: dailyXp
    });
  }
}
