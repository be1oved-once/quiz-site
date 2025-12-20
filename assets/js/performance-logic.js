import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =========================
   STATS
========================= */

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

/* =========================
   XP WEEK CHART
========================= */

const canvas = document.getElementById("xpWeekChart");
const weekTotalEl = document.getElementById("xpWeekTotal");

let chartInstance = null;
let xpChart = null;

function getWeekDates() {
  const today = new Date();
  const day = today.getDay() || 7; // Sunday fix
  today.setDate(today.getDate() - day + 1); // go to Monday

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function isDarkMode() {
  return document.body.classList.contains("dark");
}

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  // 🔥 page visit count (fire & forget)
  updateDoc(ref, {
    pageVisits: increment(1)
  }).catch(() => {});

  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

const weekDates = getWeekDates();
const values = new Array(7).fill(0);

// Firestore stores only today's daily XP
if (data.dailyXpDate) {
  const index = weekDates.indexOf(data.dailyXpDate);
  if (index !== -1) {
    values[index] = data.dailyXp || 0;
  }
}

  /* ---------- STATS ---------- */
  streakEl.textContent = data.streak ?? 0;
  mostXpEl.textContent = formatK(data.bestXpDay ?? 0);
  attemptsEl.textContent = formatK(data.totalAttempts ?? 0);
  visitsEl.textContent = formatK(data.pageVisits ?? 0);


Chart.defaults.font.family = "Poppins, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.font.size = 12;
  /* ---------- WEEKLY XP ---------- */
  const canvas = document.getElementById("xpWeekChart");
if (!canvas || typeof Chart === "undefined") return;

const ctx = canvas.getContext("2d");

// destroy only if needed
if (xpChart) {
  xpChart.destroy();
  xpChart = null;
}

xpChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      data: values, // your weekly XP array
      tension: 0.45,
      borderWidth: 2.5,
      borderColor: isDarkMode() ? "#60a5fa" : "#2563eb",
      backgroundColor: isDarkMode()
        ? "rgba(96,165,250,0.18)"
        : "rgba(37,99,235,0.15)",
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: isDarkMode() ? "#93c5fd" : "#2563eb",
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    // 🔥 SMOOTH ANIMATION
    animation: {
      duration: 900,
      easing: "easeOutQuart",
      from: ctx => {
        if (ctx.type === "data") {
          return 0; // 👈 makes graph rise from bottom
        }
      }
    },

    transitions: {
      active: {
        animation: {
          duration: 600,
          easing: "easeOutCubic"
        }
      }
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDarkMode() ? "#020617" : "#ffffff",
        titleColor: isDarkMode() ? "#e5e7eb" : "#111827",
        bodyColor: isDarkMode() ? "#e5e7eb" : "#111827",
        borderColor: isDarkMode() ? "#334155" : "#e5e7eb",
        borderWidth: 1
      }
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode() ? "#94a3b8" : "#475569"
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: Math.ceil(Math.max(...values, 10) * 1.25),
        ticks: {
          maxTicksLimit: 6,
          color: isDarkMode() ? "#94a3b8" : "#475569"
        },
        grid: {
          color: isDarkMode()
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.08)"
        }
      }
    }
  }
});
});