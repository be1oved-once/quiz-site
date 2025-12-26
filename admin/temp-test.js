import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  query,
  collectionGroup,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "/assets/js/firebase.js";

import { Timestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =========================
   FIREBASE TEMP TEST REF
========================= */

let scheduleInterval = null;
let scheduledTimeCache = null;

const TEMP_TEST_REF = doc(db, "tempTests", "current");
console.log("🟢 temp-test.js loaded");

function listenLeaderboard() {
  if (leaderboardUnsub) return;

  const q = query(
    collectionGroup(db, "testSubmissions"),
    where("testId", "==", "tempTests/current"),
    orderBy("marks", "desc"),
    orderBy("submittedAt", "asc")
  );

  leaderboardUnsub = onSnapshot(q, snap => {
    leaderboardList.replaceChildren();

    if (snap.empty) {
      const p = document.createElement("p");
      p.textContent = "No submissions yet";
      p.style.opacity = ".6";
      p.style.padding = "12px";
      leaderboardList.appendChild(p);
      return;
    }

    let rank = 1;
    snap.forEach(docSnap => {
      renderStudentRow(docSnap.data(), rank++);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {

/* =========================
   ADMIN-ONLINE SCHEDULER
========================= */

/* =========================
   ADMIN-ONLINE SCHEDULER (FIXED)
========================= */
console.log("🟢 Attaching onSnapshot to TEMP_TEST_REF");
onSnapshot(TEMP_TEST_REF, (snap) => {

if (!snap.exists()) return;

  const data = snap.data();
  console.log("Firestore data:", data);

  // ✅ If test already finished (refresh safe)
  if (data.status === "finished") {
    console.log("📊 Test finished – leaderboard unlocked");
    liveTimerBar.classList.remove("hidden");
    showLeaderboardAccess();
    return;
  }

  if (data.status === "finished") {
  console.log("📊 Test already finished");
  liveTimerBar.classList.remove("hidden");
  showLeaderboardAccess(); // 👈 ADD HERE
}
  console.log("Firestore data:", data);

  if (data.publishMode !== "schedule") return;
  if (data.status === "live") return;

  const scheduledAt = data.schedule?.at;
  if (!scheduledAt) return;

  scheduledTimeCache = scheduledAt.toDate();

  console.log("📅 Scheduled at:", scheduledTimeCache.toISOString());

  // ⛔ already running checker
  if (scheduleInterval) return;

  console.log("⏱ Starting admin-side scheduler loop");

  scheduleInterval = setInterval(async () => {
    const now = new Date();
    console.log("Now:", now.toISOString());

    if (now < scheduledTimeCache) {
      console.log("⌛ Waiting for scheduled time...");
      return;
    }

    console.log("🚀 TIME REACHED → GOING LIVE");

    clearInterval(scheduleInterval);
    scheduleInterval = null;

    await updateDoc(TEMP_TEST_REF, {
      status: "live",
      publishMode: "live",
      "timer.startedAt": serverTimestamp()
    });

    console.log("✅ Scheduled test is now LIVE");

    openTimerPage();
  }, 1000);
});
/* =========================
   SUBJECT DROPDOWN
========================= */
const subjectBtn = document.getElementById("subjectBtn");
const subjectPopup = document.getElementById("subjectPopup");
const subjectValue = document.getElementById("subjectValue");
const clearTestBtn = document.getElementById("clearTestBtn");
/* =========================
   FIREBASE TEMP TEST REF
========================= */

/* 🔒 Disable clear test on page load */
if (clearTestBtn) {
  clearTestBtn.disabled = true;
}


subjectBtn.addEventListener("click", () => {
  subjectPopup.classList.toggle("hidden");
});

subjectPopup.querySelectorAll(".subject-item").forEach(item => {
  item.addEventListener("click", () => {
    subjectValue.textContent = item.dataset.subject;
    subjectPopup.classList.add("hidden");
  });
});

document.addEventListener("click", e => {
  if (!subjectBtn.contains(e.target) && !subjectPopup.contains(e.target)) {
    subjectPopup.classList.add("hidden");
  }
});

/* =========================
   QUESTIONS
========================= */
const addQuestionBtn = document.getElementById("addQuestionBtn");
const questionsContainer = document.getElementById("questionsContainer");

let questionCount = 0;
let questionMode = "mcq";      // "mcq" | "direct"
let modeLocked = false;  // 🔒 once first question added
let testDuration = null; // in minutes
let timerSeconds = 0;
let timerInterval = null;

addQuestionBtn?.addEventListener("click", () => {
  addQuestionBlock();
});

function addQuestionBlock() {
if (!modeLocked) {
  modeLocked = true;

  withOptionsBtn.classList.add("disabled");
  withoutOptionsBtn.classList.add("disabled");
}

  questionCount++;

  const block = document.createElement("div");
  block.className = "question-block";

  block.innerHTML = `
    <textarea
      class="admin-textarea question-text"
      placeholder="Question ${questionCount}"></textarea>

    <div class="options-wrap">
      ${[1,2,3,4].map(i => `
        <div class="option-row">
          <input type="checkbox" class="correct-check">
          <input
            type="text"
            class="admin-input option-input"
            placeholder="Option ${i}">
        </div>
      `).join("")}
    </div>
    <button type="button" class="outline-btn delete-question">
  Delete Question
</button>
  `;

  questionsContainer.appendChild(block);
  block.querySelector(".delete-question").addEventListener("click", () => {
  block.remove();
});

  setupCorrectOption(block);
  setupAutoGrow(block);

  // ✅ APPLY GLOBAL MODE SAFELY
  toggleOptions(block, questionMode);
}

function toggleOptions(block, mode) {
  const optionsWrap = block.querySelector(".options-wrap");
  if (!optionsWrap) return;

  if (mode === "direct") {
    optionsWrap.classList.add("hidden");
  } else {
    optionsWrap.classList.remove("hidden");
  }
}
/* =========================
   SINGLE CORRECT OPTION
========================= */
function validateQuestions() {
  const blocks = document.querySelectorAll(".question-block");

  if (blocks.length === 0) {
    alert("Add at least one question");
    return false;
  }

  if (questionMode === "mcq") {
    for (let block of blocks) {
      const checks = block.querySelectorAll(".correct-check");
      let checkedCount = 0;

      checks.forEach(c => {
        if (c.checked) checkedCount++;
      });

      if (checkedCount !== 1) {
        alert("Each MCQ must have exactly ONE correct option");
        return false;
      }
    }
  }

  return true;
}
/* =========================
   QUESTION TYPE TOGGLE
========================= */
function setupQuestionTypeToggle(block) {
  const typeBtns = block.querySelectorAll(".type-btn");
  const optionsWrap = block.querySelector(".options-wrap");

  typeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      typeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.type;

      if (type === "direct") {
        optionsWrap.classList.add("hidden");
      } else {
        optionsWrap.classList.remove("hidden");
      }
    });
  });
}
function setupCorrectOption(block) {
  const checks = block.querySelectorAll(".correct-check");

  checks.forEach(check => {
    check.addEventListener("change", () => {
      checks.forEach(c => {
        if (c !== check) c.checked = false;
      });
    });
  });
}

/* =========================
   AUTO HEIGHT GROW
========================= */
function setupAutoGrow(block) {
  block.querySelectorAll("textarea").forEach(el => {
    el.style.height = "auto";
    el.addEventListener("input", () => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    });
  });
}

/* =========================
   PUBLISH MODE
========================= */
const liveBtn = document.getElementById("liveBtn");
const scheduleBtn = document.getElementById("scheduleBtn");
const scheduleBox = document.getElementById("scheduleBox");

liveBtn.addEventListener("click", () => {
  liveBtn.classList.add("active");
  scheduleBtn.classList.remove("active");
  scheduleBox.classList.add("hidden");
});

scheduleBtn.addEventListener("click", () => {
  scheduleBtn.classList.add("active");
  liveBtn.classList.remove("active");
  scheduleBox.classList.remove("hidden");
});

/* =========================
   PUBLISH (DATA READY)
========================= */
const publishBtn = document.getElementById("publishBtn");

publishBtn.addEventListener("click", async () => {
  if (!validateQuestions()) return;
  const payload = collectData();
  const mins = parseInt(timerInput.value);



  if (!mins || mins < 1 || mins > 60) {
    alert("Timer must be between 1 and 60 minutes");
    return;
  }

scheduleTime.addEventListener("change", () => {
  if (scheduleTime.value) {
    scheduleTime.setAttribute("value", scheduleTime.value);
  } else {
    scheduleTime.removeAttribute("value");
  }
});

  const isScheduled = scheduleBtn.classList.contains("active");

let scheduleAt = null;

if (isScheduled) {
  const date = scheduleDate.value;
  const time = scheduleTime.value;

  if (!date || !time) {
    alert("Select schedule date & time");
    return;
  }

  // 🔥 IST → UTC (CORRECT)
  const local = new Date(`${date}T${time}:00`);
  scheduleAt = Timestamp.fromDate(
  new Date(`${date}T${time}:00`)
);
}

  const firebasePayload = {
    subject: payload.subject,
    pageText: payload.pageText,
    questionMode,

    publishMode: isScheduled ? "schedule" : "live",

    schedule: isScheduled
  ? {
      at: scheduleAt   // 🔥 ONLY timestamp
    }
  : null,

    timer: {
      minutes: mins,
      startedAt: !isScheduled ? serverTimestamp() : null
    },

    questions: payload.questions,

    status: isScheduled ? "scheduled" : "live",

    createdAt: serverTimestamp()
  };

  await setDoc(TEMP_TEST_REF, firebasePayload, { merge: true });

  // 🔥 IMPORTANT DIFFERENCE
  if (!isScheduled) {
    openTimerPage(); // LIVE → start now
  } else {
    alert("Test scheduled successfully");
  }
});

function collectData() {
  const subject = subjectValue.textContent;
  const pageText = document.getElementById("pageText").value;

  const questions = [];
  
document.querySelectorAll(".question-block").forEach(block => {
  const qText = block.querySelector(".question-text").value.trim();
  if (!qText) return;

  let options = [];
  let correctIndex = null;

  if (questionMode === "mcq") {
    block.querySelectorAll(".option-row").forEach((row, i) => {
      options.push(row.querySelector(".option-input").value);

      if (row.querySelector(".correct-check").checked) {
        correctIndex = i;
      }
    });
  }

  questions.push({
    qText,
    type: questionMode,      // 🔥 GLOBAL
    options: questionMode === "mcq" ? options : [],
    correctIndex: questionMode === "mcq" ? correctIndex : null
  });
});

  return {
    subject,
    pageText,
    questions,
    mode: scheduleBtn.classList.contains("active") ? "schedule" : "live",
    schedule:
      scheduleBtn.classList.contains("active")
        ? {
            date: scheduleBox.querySelector("input[type=date]").value,
            time: scheduleBox.querySelector("input[type=time]").value
          }
        : null
  };
}

const withOptionsBtn = document.getElementById("withOptionsBtn");
const withoutOptionsBtn = document.getElementById("withoutOptionsBtn");

withOptionsBtn.addEventListener("click", () => {
  if (modeLocked) return;          // ⛔ block after first question
  setQuestionMode("mcq");
});

withoutOptionsBtn.addEventListener("click", () => {
  if (modeLocked) return;          // ⛔ block after first question
  setQuestionMode("direct");
});

function setQuestionMode(mode) {
  questionMode = mode;

  withOptionsBtn.classList.toggle("active", mode === "mcq");
  withoutOptionsBtn.classList.toggle("active", mode === "direct");

  // 🔁 Update ALL existing questions
  document.querySelectorAll(".question-block").forEach(block => {
    toggleOptions(block, mode);
  });
}
/* =========================
   SCHEDULE DATE & TIME RULES (SAFE)
========================= */

/* =========================
   SCHEDULE DATE & TIME (HARD LOCK)
========================= */

const scheduleDate = document.getElementById("scheduleDate");
const scheduleTime = document.getElementById("scheduleTime");

function nowInfo() {
  const n = new Date();
  return {
    date: n.toISOString().split("T")[0],
    time:
      String(n.getHours()).padStart(2, "0") + ":" +
      String(n.getMinutes()).padStart(2, "0")
  };
}

/* Initialize defaults */
function initScheduleFields() {
  if (!scheduleDate || !scheduleTime) return;

  const now = nowInfo();

  // ✅ Date
  scheduleDate.min = now.date;
  scheduleDate.value = now.date;

  // ✅ Time
  scheduleTime.value = "";
  scheduleTime.min = now.time;
}

/* Enforce date rule */
function enforceDate() {
  if (!scheduleDate) return;

  const now = nowInfo();
  if (scheduleDate.value < now.date) {
    scheduleDate.value = now.date;
  }
  enforceTime();
}

/* Enforce time rule */
function enforceTime() {
  if (!scheduleDate || !scheduleTime) return;

  const now = nowInfo();

  if (scheduleDate.value === now.date) {
    scheduleTime.min = now.time;

    if (scheduleTime.value && scheduleTime.value < now.time) {
      scheduleTime.value = now.time;
    }
  } else {
    scheduleTime.min = "";
  }
}

/* Bind events safely */
scheduleBtn.addEventListener("click", () => {
  initScheduleFields();
  enforceTime();
});

scheduleDate.addEventListener("change", enforceDate);
scheduleTime.addEventListener("change", enforceTime);

liveBtn.addEventListener("click", () => {
  if (!scheduleDate || !scheduleTime) return;
  scheduleDate.removeAttribute("min");
  scheduleTime.removeAttribute("min");
});
/* =========================
   TIME "NONE" DISPLAY FIX
========================= */

/* When schedule opens */
/* Remove "None" on focus */

const timerPage = document.getElementById("timerPage");
const timerDisplay = document.getElementById("timerDisplay");
const timerInput = document.getElementById("timerInput");
const closeTimer = document.getElementById("closeTimer");
const liveTimerBar = document.getElementById("liveTimerBar");
const liveTimerText = document.getElementById("liveTimerText");


let remainingSeconds = 0;

function lockQuestionEditing() {
  // Remove add button
  addQuestionBtn?.remove();

  // Remove delete buttons if any
  document.querySelectorAll(".delete-question").forEach(btn => btn.remove());
}

function freezePublishButton() {
  publishBtn.disabled = true;
  publishBtn.style.opacity = "0.5";
  publishBtn.style.pointerEvents = "none";
}

function openTimerPage() {
  const mins = parseInt(timerInput.value);

  if (!mins || mins < 1 || mins > 60) {
    alert("Timer must be between 1 and 60 minutes");
    return;
  }

clearTestBtn.disabled = false; 

  testDuration = mins;
  remainingSeconds = mins * 60;

  // 🔒 LOCK UI
  lockQuestionEditing();
  freezePublishButton();

  // ⛔ prevent scroll
  document.body.style.overflow = "hidden";

  timerPage.classList.remove("hidden");
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

if (remainingSeconds <= 0) {
  clearInterval(timerInterval);
  timerDisplay.textContent = "TIME UP";

  // ✅ mark test as finished (DO NOT DELETE)
  updateDoc(TEMP_TEST_REF, {
    status: "finished",
    finishedAt: serverTimestamp()
  }).then(() => {
    console.log("🏁 Test finished (leaderboard available)");
    liveTimerBar.classList.remove("hidden");
    showLeaderboardAccess(); 
  }).catch(console.error);
}
  }, 1000);
}

function updateTimerDisplay() {
  const m = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const s = String(remainingSeconds % 60).padStart(2, "0");

  timerDisplay.textContent = `${m}:${s}`;
  liveTimerText.textContent = `${m}:${s}`;
}

closeTimer.addEventListener("click", () => {
  timerPage.classList.add("hidden");

  // 🔓 restore page scrolling
  document.body.style.overflow = "";

  // ⏱ show running timer below header
  liveTimerBar.classList.remove("hidden");
});


clearTestBtn?.addEventListener("click", () => {
  showConfirmToast(
    "Clear entire test setup?",
    async () => {
      await deleteDoc(TEMP_TEST_REF);
      // ⛔ Stop timer
      clearInterval(timerInterval);

      // 🔄 Reset state
      questionCount = 0;
      questionMode = "mcq";
      modeLocked = false;
      testDuration = null;
      remainingSeconds = 0;

      // 🧹 Clear UI
      questionsContainer.innerHTML = "";
      subjectValue.textContent = "Select Subject";
      document.getElementById("pageText").value = "";
      timerInput.value = "";

      // 🔓 Restore scrolling
      document.body.style.overflow = "";

      // ♻️ Full reset (safe)
      location.reload();
    }
  );
});

const confirmToast = document.getElementById("confirmToast");
const confirmText = document.getElementById("confirmText");
const confirmYes = document.getElementById("confirmYes");
const confirmCancel = document.getElementById("confirmCancel");
const toastBackdrop = document.getElementById("toastBackdrop");

let confirmAction = null;

function showConfirmToast(message, onConfirm) {
  confirmText.textContent = message;
  confirmAction = onConfirm;

  confirmToast.classList.add("show");
  toastBackdrop?.classList.add("show");
}

function hideConfirmToast() {
  confirmToast.classList.remove("show");
  toastBackdrop?.classList.remove("show");
  confirmAction = null;
}

confirmCancel.onclick = hideConfirmToast;

confirmYes.onclick = () => {
  if (typeof confirmAction === "function") {
    confirmAction();
  }
  hideConfirmToast();
};

});

document.addEventListener("DOMContentLoaded", () => {
  const leaderboardOverlay = document.getElementById("leaderboardOverlay");
  const leaderboardList = document.querySelector(".leaderboard-list");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const closeLeaderboard = document.getElementById("closeLeaderboard");

  let leaderboardUnsub = null;
  let openBlock = null;

  /* =========================
     LISTEN LEADERBOARD
  ========================= */
  function listenLeaderboard() {
    if (leaderboardUnsub) return;

    const q = query(
      collectionGroup(db, "testSubmissions"),
      where("testId", "==", "tempTests/current"),
      orderBy("marks", "desc"),
      orderBy("submittedAt", "asc") // tie-break
    );

function showLeaderboardAccess() {
  if (leaderboardBtn) {
    leaderboardBtn.classList.remove("hidden");
  }
}

    leaderboardUnsub = onSnapshot(q, snap => {
      leaderboardList.replaceChildren();

      if (snap.empty) {
        const p = document.createElement("p");
        p.style.opacity = ".6";
        p.style.padding = "12px";
        p.textContent = "No submissions yet";
        leaderboardList.appendChild(p);
        return;
      }

      let rank = 1;
      snap.forEach(docSnap => {
        renderStudentRow(docSnap.data(), rank++);
      });
    });
  }

  /* =========================
     RENDER STUDENT ROW
  ========================= */
function renderStudentRow(data, rank) {
  const row = document.createElement("div");
  row.className = "leaderboard-user";

  row.innerHTML = `
    <div class="leaderboard-user-head">
      <div class="rank-badge">${rank}</div>
      <div class="user-main">
        <div class="user-name">${data.name || "Student"}</div>
        <div class="user-marks">
          ${data.marks} / ${data.total}
        </div>
      </div>
    </div>

    <div class="leaderboard-user-body hidden">
      ${renderAnswers(data.answers || [])}
      <div class="user-stats">
        ✔ Correct: ${data.correct || 0}
        &nbsp;&nbsp;✖ Wrong: ${data.wrong || 0}
      </div>
    </div>
  `;

  const body = row.querySelector(".leaderboard-user-body");

  row.addEventListener("click", () => {
    document
      .querySelectorAll(".leaderboard-user-body")
      .forEach(b => b !== body && b.classList.add("hidden"));

    body.classList.toggle("hidden");
  });

  leaderboardList.appendChild(row);
}

  /* =========================
     RENDER ANSWERS
  ========================= */
function renderAnswers(answers) {
  return answers.map((a, i) => {
    if (a.type === "mcq") {
      return `
        <div class="answer-row">
          <strong>Q${i + 1}:</strong> ${a.question}<br/>
          <span class="answer-selected">
            Selected: ${a.selectedText || "—"}
          </span>
        </div>
      `;
    }

    return `
      <div class="answer-row">
        <strong>Q${i + 1}:</strong> ${a.question}
        <div class="direct-answer">
          ${a.answerText || ""}
        </div>
      </div>
    `;
  }).join("");
}

  /* =========================
     OPEN / CLOSE
  ========================= */
  leaderboardBtn?.addEventListener("click", () => {
    leaderboardOverlay.classList.remove("hidden");
    listenLeaderboard();
  });

  closeLeaderboard?.addEventListener("click", () => {
    leaderboardOverlay.classList.add("hidden");
  });

});
