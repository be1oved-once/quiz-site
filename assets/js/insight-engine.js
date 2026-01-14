/* =========================
   ADVANCED PERFORMANCE INSIGHT ENGINE
   (AI-LIKE, ZERO AI)
   CA FOUNDATION FOCUSED
========================= */
function maybe(prob, text) {
  return Math.random() < prob ? text : "";
}

function percentHint(accuracy) {
  if (accuracy >= 75) return "You are now approaching distinction-level accuracy.";
  if (accuracy >= 65) return "This accuracy is close to exam-safe range.";
  if (accuracy >= 55) return "You are slightly below exam-safe accuracy.";
  if (accuracy >= 45) return "Accuracy is currently risky for exam performance.";
  return "Your accuracy level needs urgent correction.";
}

function practiceMixHint(rtp, mtp, chapter) {
  const total = rtp + mtp + chapter;
  if (!total) return "";
  const r = Math.round((rtp / total) * 100);
  const m = Math.round((mtp / total) * 100);
  const c = Math.round((chapter / total) * 100);

  if (r > 60) return "Your practice is heavily RTP-driven.";
  if (m > 60) return "You are focusing mostly on MTP sets.";
  if (c > 60) return "You are spending more time on chapter practice.";
  return "Your practice mix is balanced across formats.";
}

function streakHint(streak) {
  if (streak >= 14) return "Two-week consistency streak — excellent discipline.";
  if (streak >= 7) return "One-week consistency streak achieved.";
  if (streak >= 3) return "You are building consistency gradually.";
  return "";
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- STATE CLASSIFIER ---------- */
function classifyState(trend, accuracy) {
  if (trend === "Improving" && accuracy >= 65) return "strong";
  if (trend === "Critical" || accuracy < 40) return "critical";
  if (trend === "Needs Focus" || accuracy < 55) return "weak";
  return "stable";
}

/* ---------- EXAM PROXIMITY ---------- */
function examPhase(daysLeft) {
  if (daysLeft <= 30) return "near";
  if (daysLeft <= 60) return "mid";
  return "far";
}

/* ---------- SUBJECT CONTEXT ---------- */
function subjectTone(subject) {
  if (!subject) return "general";
  const s = subject.toLowerCase();
  if (s.includes("account")) return "accounts";
  if (s.includes("law")) return "law";
  if (s.includes("eco")) return "economics";
  if (s.includes("math")) return "maths";
  return "general";
}

/* ---------- TEXT BANKS ---------- */

const OPENERS = {
  strong: [
    "Your recent practice shows clear upward momentum.",
    "You are converting practice into measurable improvement.",
    "Your preparation discipline is reflecting in accuracy.",
    "This period shows strong exam-oriented progress.",
    "You are moving in the right direction consistently.",
    "Your effort is translating into marks.",
    "You are building solid CA Foundation readiness.",
    "Your performance curve is clearly improving."
  ],
  stable: [
    "Your preparation has remained steady during this phase.",
    "You are holding a stable performance level.",
    "Your accuracy indicates partial conceptual clarity.",
    "This phase shows balance but limited growth.",
    "Your practice is consistent but needs refinement.",
    "You are maintaining, not yet improving.",
    "Your preparation is stable but not exam-sharp yet.",
    "You are close to improvement with correct adjustments."
  ],
  weak: [
    "This phase needs sharper focus and correction.",
    "Your accuracy suggests conceptual gaps.",
    "This performance level needs structured revision.",
    "Your attempts are not converting into marks yet.",
    "This pattern needs immediate correction.",
    "Your preparation lacks exam-level precision.",
    "You need to slow down and strengthen basics.",
    "This phase demands focused improvement."
  ],
  critical: [
    "Immediate correction in preparation strategy is required.",
    "Your current pattern can impact exam performance.",
    "This phase signals serious gaps in fundamentals.",
    "Your accuracy level needs urgent attention.",
    "This preparation approach is risky for exams.",
    "You must pause and reset your strategy.",
    "Your current accuracy is not exam-safe.",
    "This stage requires disciplined rebuilding."
  ]
};

const SUBJECT_ADVICE = {
  accounts: [
    "Focus on working notes and adjustment logic.",
    "Accuracy depends on concept clarity, not speed.",
    "Revise formats and calculation steps.",
    "Practice fewer questions with full working.",
    "Avoid careless arithmetic errors.",
    "Strengthen fundamentals before speed.",
    "Revise illustrations before RTP/MTP.",
    "Presentation can significantly improve marks."
  ],
  law: [
    "Improve structure: provision → explanation → conclusion.",
    "Avoid memorisation without understanding.",
    "Practice writing precise legal language.",
    "Focus on keywords and case relevance.",
    "Presentation matters more than length.",
    "Clarity beats volume in law answers.",
    "Revise provisions repeatedly.",
    "Avoid vague conclusions."
  ],
  economics: [
    "Focus on conceptual clarity before diagrams.",
    "Use definitions and keywords clearly.",
    "Avoid writing irrelevant theory.",
    "Practice numerical logic step-wise.",
    "Accuracy improves with concept revision.",
    "Use diagrams only where needed.",
    "Avoid over-explaining.",
    "Keep answers crisp and exam-oriented."
  ],
  maths: [
    "Accuracy is more important than speed.",
    "Reduce silly mistakes through practice.",
    "Revise formulas daily.",
    "Practice step-wise solving.",
    "Avoid guess-based attempts.",
    "Focus on concept clarity.",
    "Practice mixed difficulty questions.",
    "Time management is critical here."
  ],
  general: [
    "Focus on converting attempts into marks.",
    "Revise mistakes before adding new practice.",
    "Accuracy matters more than quantity.",
    "Analyse errors carefully.",
    "Practice with exam conditions.",
    "Avoid random attempts.",
    "Consistency is key.",
    "Structured practice gives results."
  ]
};

const ACTIONS = {
  strong: [
    "Shift focus towards speed and presentation.",
    "Increase difficulty level gradually.",
    "Analyse mistakes to reach 75%+ accuracy.",
    "Focus on exam simulation now.",
    "Refine weak chapters only.",
    "Maintain consistency without burnout.",
    "Practice under time pressure.",
    "Strengthen revision cycles."
  ],
  stable: [
    "Target weak areas deliberately.",
    "Reduce attempt volume, increase accuracy.",
    "Revise basics before advanced questions.",
    "Improve answer structure.",
    "Identify recurring mistakes.",
    "Shift from practice to analysis.",
    "Focus on scoring chapters.",
    "Increase accuracy by 5–10%."
  ],
  weak: [
    "Pause new attempts and revise basics.",
    "Reduce question volume temporarily.",
    "Focus on concept clarity.",
    "Avoid exam-level tests for now.",
    "Rebuild confidence with solved examples.",
    "Strengthen fundamentals first.",
    "Focus on understanding, not speed.",
    "Practice with guidance if needed."
  ],
  critical: [
    "Stop random practice immediately.",
    "Restart preparation from core concepts.",
    "Focus only on basics for now.",
    "Avoid full-length tests temporarily.",
    "Revise theory and examples deeply.",
    "Rebuild accuracy before speed.",
    "Seek guidance if required.",
    "Discipline is essential now."
  ]
};

const CLOSERS = {
  far: [
    "Strong fundamentals now will simplify the exam phase.",
    "Early correction saves exam pressure.",
    "This phase defines your final outcome.",
    "Consistency now builds confidence later.",
    "Foundation strength decides final scores.",
    "Right habits now give long-term advantage.",
    "Early discipline pays highest returns.",
    "Build now, perform later."
  ],
  mid: [
    "This is the most important improvement window.",
    "Your next phase decides exam readiness.",
    "Focused effort now makes exams manageable.",
    "Accuracy gains now are crucial.",
    "Correct strategy matters most now.",
    "This phase separates average from strong.",
    "Smart work matters now.",
    "Refinement is key at this stage."
  ],
  near: [
    "Exam time demands control, not panic.",
    "Accuracy now matters more than volume.",
    "Avoid last-minute experimentation.",
    "Stick to proven strategy.",
    "Confidence comes from revision, not attempts.",
    "Revise more, attempt less.",
    "Trust your preparation.",
    "Calm, focused practice wins exams."
  ]
};

/* ---------- MAIN GENERATOR ---------- */

export function generatePerformanceInsight({
  trend,
  accuracy,
  subject,
  rtp,
  mtp,
  chapter,
  daysLeft = 90,
  streak = 0
}) {
  const state = classifyState(trend, accuracy);
  const phase = examPhase(daysLeft);
  const tone = subjectTone(subject);

  const total = rtp + mtp + chapter;

  let context = "";

  // practice count context
  if (total > 0) {
    context += `In this period you practiced ${total} sets. `;
  }

  // optional streak mention
  context += maybe(0.6, streakHint(streak) + " ");

  // optional accuracy hint
  context += maybe(0.7, percentHint(accuracy) + " ");

  // optional practice mix
  context += maybe(0.5, practiceMixHint(rtp, mtp, chapter) + " ");

  // core insight sentence chain
  const main =
    pick(OPENERS[state]) + " " +
    pick(SUBJECT_ADVICE[tone]) + " " +
    pick(ACTIONS[state]) + " " +
    pick(CLOSERS[phase]);

  // optional motivational finisher
  const finishers = [
    "Stay calm and consistent.",
    "Small corrections now bring big results.",
    "Precision beats volume.",
    "Discipline will carry you forward.",
    "Trust your process."
  ];

  return (
    context +
    main +
    maybe(0.5, " " + pick(finishers))
  ).replace(/\s+/g, " ").trim();
}