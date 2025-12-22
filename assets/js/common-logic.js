const reviewBtn = document.querySelector(".review-btn");
const reviewPanel = document.getElementById("reviewPanel");
const reviewContent = document.getElementById("reviewContent");

if (reviewBtn) {
  reviewBtn.addEventListener("click", () => {
    const isOpen = reviewPanel.classList.contains("open");

    if (isOpen) {
  // CLOSE
  reviewPanel.classList.remove("open");

  setTimeout(() => {
    reviewPanel.classList.add("hidden");
  }, 300);

  reviewBtn.textContent = "Review Questions";
hideVoiceNote();
} else {
  // OPEN
  renderReviewQuestions();
  reviewPanel.classList.remove("hidden");

  reviewPanel.offsetHeight;
  reviewPanel.classList.add("open");

  reviewBtn.textContent = "Close Review";

enableVoiceNote();
  // 🔊 SHOW VN ONLY IF ROUND 1 NOT COMPLETED
}
  });
}
function renderReviewQuestions() {
  
  if (!reviewContent) return;

  if (!window.round1Snapshot || window.round1Snapshot.length === 0) {
    reviewPanel.classList.add("hidden");
    reviewContent.innerHTML =
      "<div style='text-align:center;font-size:13px;opacity:0.7'>No round 1 data available. पहला Round One पूरा करो तब खोलो।</div>";
      enableVoiceNote();
    return;
  }

  reviewContent.innerHTML = "";

  const attempted = window.round1Snapshot.filter(q => q.attempted);

  attempted.forEach((q, idx) => {
    const block = document.createElement("div");
    block.className = "review-question";

    /* =========================
       QUESTION LEVEL BORDER
    ========================= */
    if (q.correct) {
      block.style.border = "2px solid #16a34a";
      block.style.background = "rgba(22,163,74,0.08)";
    } else {
      block.style.border = "2px solid #dc2626";
      block.style.background = "rgba(220,38,38,0.08)";
    }

    const title = document.createElement("div");
    title.className = "review-question-title";
    title.textContent = `${idx + 1}. ${q.text}`;

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "review-options";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.textContent = opt;

      /* =========================
         CORRECT OPTION
      ========================= */
      if (i === q.correctIndex) {
        btn.style.border = "2px solid #16a34a";
        btn.style.background = "rgba(22,163,74,0.18)";
        btn.style.color = "#065f46";
        btn.style.fontWeight = "600";
      }

      /* =========================
         WRONG SELECTED OPTION
      ========================= */
      if (q.selectedIndex === i && i !== q.correctIndex) {
        btn.style.border = "2px solid #dc2626";
        btn.style.background = "rgba(220,38,38,0.18)";
        btn.style.color = "#7f1d1d";
        btn.style.fontWeight = "600";
      }

      optionsWrap.appendChild(btn);
    });

    block.appendChild(title);
    block.appendChild(optionsWrap);
    reviewContent.appendChild(block);
  });
}

function renderReviewForPDF() {
  if (!window.round1Snapshot || window.round1Snapshot.length === 0) return;

  const attempted = window.round1Snapshot.filter(q => q.attempted);
const pdfTitle = getPdfTitle();
console.log("PDF TITLE:", pdfTitle);
  const html = `
<!DOCTYPE html>
<html>
<head>
<title>${pdfTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      font-family: Poppins, Arial, sans-serif;
      background: #fff;
      padding: 8px;
      margin: 0;
    }

    h2 {
      text-align: center;
      margin: 4px 0 8px;
      font-size: 14px;
    }

    /* 🔥 TIGHT GRID */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    /* 🔥 COMPACT QUESTION BOX */
    .question {
      border-radius: 8px;
      padding: 5px 6px;
      font-size: 10.5px;
      line-height: 1.25;
      break-inside: avoid;
    }

    .question.correct {
      border: 1.5px solid #16a34a;
      background: rgba(22,163,74,0.07);
    }

    .question.wrong {
      border: 1.5px solid #dc2626;
      background: rgba(220,38,38,0.07);
    }

    /* QUESTION TITLE */
    .title {
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 10.8px;
    }

    /* OPTIONS */
    .option {
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid #ccc;
      margin-bottom: 3px;
      font-size: 10px;
    }

    .option.correct {
      border-color: #16a34a;
      background: rgba(22,163,74,0.18);
      color: #065f46;
      font-weight: 600;
    }

    .option.wrong {
      border-color: #dc2626;
      background: rgba(220,38,38,0.18);
      color: #7f1d1d;
      font-weight: 600;
    }

    /* PRINT TUNING */
    @media print {
      body {
        padding: 6px;
      }
    }
  </style>
</head>

<body>
<h2>${pdfTitle}</h2>

  <div class="grid">
    ${attempted.map((q, idx) => `
      <div class="question ${q.correct ? "correct" : "wrong"}">
        <div class="title">${idx + 1}. ${q.text}</div>
        ${q.options.map((opt, i) => {
          let cls = "option";
          if (i === q.correctIndex) cls += " correct";
          if (q.selectedIndex === i && i !== q.correctIndex) cls += " wrong";
          return `<div class="${cls}">${opt}</div>`;
        }).join("")}
      </div>
    `).join("")}
  </div>

  <script>
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 600);
    };

    let closed = false;
    function safeClose() {
      if (closed) return;
      closed = true;
      window.close();
    }

    window.onafterprint = () => {
      setTimeout(safeClose, 7000);
    };

    setTimeout(safeClose, 15000);
  </script>
</body>
</html>
`;

  const win = window.open("", "_blank");
  win.document.open();
  win.document.write(html);
  win.document.close();
}
const pdfOverlayLoader = `
<svg width="18" height="18" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20"
    fill="none"
    stroke="white"
    stroke-width="4"
    stroke-linecap="round"
    stroke-dasharray="31.4 31.4">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="0.8s"
      repeatCount="indefinite"/>
  </circle>
</svg>
`;
let currentChapter = null;
window.currentChapter = null;
function getPdfTitle() {
  const chapter = window.currentChapterName?.trim();
  return chapter
    ? `${chapter} – Review`
    : "Chapter-wise Review";
}

const resultActions = document.querySelector(".result-actions");

let pdfOverlay = null;

function showPdfOverlay() {
  if (!resultActions) return;

  resultActions.classList.add("hide-others");

  pdfOverlay = document.createElement("div");
  pdfOverlay.className = "pdf-overlay";
  pdfOverlay.innerHTML = `${pdfOverlayLoader} Preparing PDF…`;

  resultActions.appendChild(pdfOverlay);

  // force reflow for animation
  pdfOverlay.offsetHeight;
  pdfOverlay.classList.add("show");
}

function hidePdfOverlay() {
  if (!pdfOverlay) return;

  pdfOverlay.classList.remove("show");

  setTimeout(() => {
    pdfOverlay?.remove();
    pdfOverlay = null;
    resultActions.classList.remove("hide-others");
  }, 400);
}
const vnBox = document.getElementById("voiceNoteBox");
const vnAudio = document.getElementById("vnAudio");
const vnPlay = document.getElementById("vnPlay");
const vnTime = document.getElementById("vnTime");
const vnControls = document.getElementById("vnControls");
const vnStatus = document.getElementById("vnStatus");

/* 🔓 Show VN only after Round 1 */
function enableVoiceNote() {
  if (!vnBox) return;

  vnBox.classList.remove("hidden");
  vnStatus.textContent = "Tap to listen explanation";
  vnControls.classList.remove("hidden");
}

/* ⏱ Load duration automatically */
vnAudio?.addEventListener("loadedmetadata", () => {
  const d = vnAudio.duration;
  const m = Math.floor(d / 60);
  const s = Math.floor(d % 60);
  vnTime.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
});

/* ▶ Play / Pause */
vnPlay?.addEventListener("click", () => {
  if (vnAudio.paused) {
    vnAudio.play();
    vnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    vnAudio.pause();
    vnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

/* ⏹ Reset icon when finished */
vnAudio?.addEventListener("ended", () => {
  vnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
});

function hideVoiceNote() {
  if (!vnBox) return;

  // stop audio if playing
  if (vnAudio && !vnAudio.paused) {
    vnAudio.pause();
    vnAudio.currentTime = 0;
  }

  vnBox.classList.add("hidden");
}

const pdfBtn = document.querySelector(".pdf-btn");

if (pdfBtn) {
  pdfBtn.addEventListener("click", () => {
    if (!window.round1Snapshot || window.round1Snapshot.length === 0) {
      reviewContent.innerHTML =
        "<div style='text-align:center;font-size:13px;opacity:0.7'>पहले Round 1 पूरा करो, तभी PDF बनेगा 🙂</div>";
        
      return;
    }

    // 🔥 SHOW OVERLAY
    showPdfOverlay();

    // ⏳ Let animation breathe
    setTimeout(() => {
      renderReviewForPDF();

      // 🧹 Restore UI after print flow
      setTimeout(() => {
        hidePdfOverlay();
      }, 4000); // enough time for print dialog
    }, 1200);
  });
}
/* =========================
   KEYBOARD SHORTCUTS – REVIEW & PDF
   (DESKTOP ONLY)
========================= */
document.addEventListener("keydown", e => {
  // Ignore typing in inputs / textarea
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  /* -------------------------
     R → Toggle Review Panel
  ------------------------- */
  if (e.key.toLowerCase() === "r") {
    if (!reviewBtn || !reviewPanel) return;

    reviewBtn.click();
  }

  /* -------------------------
     ESC → Close Review Panel
  ------------------------- */
  if (e.key === "Escape") {
    if (reviewPanel?.classList.contains("open")) {
      reviewBtn?.click();
    }
  }

  /* -------------------------
     CTRL + P → Save PDF
  ------------------------- */
  if (e.ctrlKey && e.key.toLowerCase() === "p") {
    e.preventDefault(); // ❌ stop browser print

    if (pdfBtn && !pdfBtn.disabled) {
      pdfBtn.click();
    }
  }
});