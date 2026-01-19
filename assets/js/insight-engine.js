function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
// ---- Local Memory Keys ----
const USED_KEY = "uniqueFlirtyInsights_v2";
const NAME_KEY = "cachedUsername";

let usedInsights = JSON.parse(localStorage.getItem(USED_KEY) || "[]");
// ---- Username helper ----
function getUserName(){
  return localStorage.getItem(NAME_KEY) || "you";
}
// Call this once after profile load:
export function cacheUsername(name){
  if(name) localStorage.setItem(NAME_KEY, name);
}
// ---- Time of day ----
function timeGreeting(){
  const h = new Date().getHours();
  const name = getUserName();

  if(h < 12) return pick([
    `Good morning ${name}`,
    `Morning vibes ${name}`,
    `${name}, you’re up early… cute.`
  ]);

  if(h < 18) return pick([
    `Good afternoon ${name}`,
    `Hey ${name}, mid-day check-in.`,
    `${name}, I’ve been waiting all afternoon.`
  ]);

  return pick([
    `Good evening ${name}`,
    `Late night study date again, ${name}?`,
    `${name}, night mode activated.`
  ]);
}
// ---- Accuracy Lines ----
function accuracyLine(acc){
  if(acc >= 80) return pick([
    `${acc}% accuracy… topper energy detected `,
    `You’re casually flexing at ${acc}% accuracy.`,
    `${acc}%? okay genius, I see you.`
  ]);

  if(acc >= 65) return pick([
    `${acc}% accuracy - exam-safe and attractive combo.`,
    `${acc}%… smart and stable.`,
    `Safe zone accuracy (${acc}%) - stay here for me.`
  ]);

  if(acc >= 55) return pick([
    `${acc}% accuracy - borderline, I won’t let you fall.`,
    `${acc}%… you’re teasing danger.`,
    `Almost safe at ${acc}%, come closer.`
  ]);

  if(acc >= 45) return pick([
    `${acc}% accuracy - risky, I’m holding your hand now.`,
    `${acc}%… this needs attention, babe.`,
    `Low accuracy (${acc}%), study date incoming.`
  ]);

  return pick([
    `${acc}% accuracy… emergency cuddle & revision session.`,
    `${acc}%? don’t scare me like that.`,
    `Critical zone (${acc}%) - I’m not leaving you alone.`
  ]);
}
// ---- Trend Lines ----
function trendLine(trend){
  const map = {
    Improving: [
      "Your progress graph is rising… so is my interest.",
      "Glow-up detected in your attempts.",
      "You’re leveling up quietly."
    ],
    Stable: [
      "You’re steady… but I want fireworks.",
      "Stable phase… don’t get too cozy.",
      "Holding ground nicely."
    ],
    "Needs Focus": [
      "Focus slipped… come back to me.",
      "Your trend dipped… I noticed.",
      "Hey, eyes back on books."
    ],
    Critical: [
      "Critical trend… I’m officially worried.",
      "This slope is scary… fix it with me.",
      "Emergency study alert"
    ]
  };
  return pick(map[trend] || map.Stable);
}
// ---- Practice Mix Lines ----
function mixLine(rtp, mtp, chapter){
  const total = rtp + mtp + chapter;
  if(!total) return "";

  const r = Math.round((rtp/total)*100);
  const m = Math.round((mtp/total)*100);
  const c = Math.round((chapter/total)*100);

  if(r>60) return `RTP is your main love story (${r}%).`;
  if(m>60) return `MTP addiction spotted (${m}%).`;
  if(c>60) return `Chapter dates only (${c}%).`;

  return "Balanced practice… responsible and cute.";
}
// ---- Subject Lines ----
function subjectLine(subject){
  const s = subject.toLowerCase();

  if(s.includes("account")) return pick([
    "Working notes are your charm point.",
    "Adjustments win hearts and marks.",
    "Final accounts love your attention."
  ]);

  if(s.includes("law")) return pick([
    "Structured answers make me blush.",
    "Keywords are your flirting style.",
    "Provisions first, always."
  ]);

  if(s.includes("eco")) return pick([
    "Definitions impress me.",
    "Crisp theory beats long stories.",
    "Concept clarity is your glow."
  ]);

  if(s.includes("math")) return pick([
    "Formulas need daily love.",
    "Step-wise solving = attractive.",
    "Silly mistakes break hearts."
  ]);

  return pick([
    "Revision is your secret charm.",
    "Error analysis makes you sharper.",
    "Consistency looks good on you."
  ]);
}
// ---- Attempts + streak ----
function attemptLine(total, streak){
  let line = pick([
    `I saw ${total} practice attempts logged.`,
    `${total} attempts… effort noticed.`,
    `You didn’t skip practice (${total} attempts).`
  ]);

  if(streak >= 7) line += ` ${streak}-day streak… discipline is sexy.`;
  if(streak >= 14) line += ` Two weeks streak… marry your books already.`;

  return line;
}
// ---- Exam phase ----
function phaseLine(daysLeft){
  if(daysLeft <= 30) return pick([
    "Exam door is close… no drama now.",
    "Final phase… calm and precise.",
    "Near exam zone… stick with me."
  ]);

  if(daysLeft <= 60) return pick([
    "Mid-phase glow-up time.",
    "Refinement arc unlocked.",
    "Now we polish your skills."
  ]);

  return pick([
    "Early phase… building something beautiful.",
    "Foundation stage… make it strong.",
    "Slow growth, strong finish."
  ]);
}
// ---- Micro inference (AI-feel) ----
function inferenceLine(acc, trend){
  if(acc>=70 && trend==="Improving")
    return "This tells me your study method finally clicked.";

  if(acc<55 && trend!=="Improving")
    return "This tells me concepts need deeper revision.";

  if(acc>=65 && trend==="Stable")
    return "You’re ready, consistency decides final outcome.";

  return "Your data hints untapped potential.";
}
// ---- Self aware line ----
function selfAwareLine(total){
  return pick([
    `I’ve been quietly tracking your ${total} attempts.`,
    `My little data brain noticed ${total} entries.`,
    `I didn’t miss a single one of your ${total} attempts.`
  ]);
}
// ---- Closers ----
const CLOSERS = [
  "Now go study… I’m watching.",
  "Don’t ghost your books.",
  "Make me proud next time.",
  "Stay cute and consistent.",
  "I’ll check on you soon."
];
// ---- Sentence Patterns ----
const PATTERNS = [
  d => `${accuracyLine(d.accuracy)} ${trendLine(d.trend)}`,
  d => `${attemptLine(d.totalAttempts,d.streak)} ${mixLine(d.rtp,d.mtp,d.chapter)}`,
  d => `${subjectLine(d.subject)} ${phaseLine(d.daysLeft)}`,
  d => `${selfAwareLine(d.totalAttempts)} ${inferenceLine(d.accuracy,d.trend)}`,
  d => `${accuracyLine(d.accuracy)} ${phaseLine(d.daysLeft)}`,
  d => `${mixLine(d.rtp,d.mtp,d.chapter)} ${accuracyLine(d.accuracy)}`
];
// ---- MAIN GENERATOR ----
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
  const totalAttempts = rtp + mtp + chapter;
  const name = getUserName();

  const data = {
    trend, accuracy, subject,
    rtp, mtp, chapter,
    daysLeft, streak, totalAttempts
  };

  let insight;
  let tries = 0;

  do {
    const lines = [
      timeGreeting(),
      pick(PATTERNS)(data),
      pick(PATTERNS)(data),
      pick(CLOSERS)
    ];

    insight = lines.join(" ").replace(/\s+/g," ").trim();
    tries++;
  } while(usedInsights.includes(insight) && tries < 60);

  usedInsights.push(insight);
  localStorage.setItem(USED_KEY, JSON.stringify(usedInsights));

  return insight;
}