export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      trend,
      accuracy,
      subject,
      fromDate,
      toDate,
      rtp,
      mtp,
      chapter
    } = req.body;

    const variationSeed = Date.now() % 100000;

const prompt = `
You are an academic performance analyst.

Variation seed: ${variationSeed}

Student data:
- Trend: ${trend}
- Accuracy: ${accuracy}%
- Subject: ${subject || "All Subjects"}
- Period: ${fromDate} to ${toDate}
- RTP attempts: ${rtp}
- MTP attempts: ${mtp}
- Chapter practice: ${chapter}

Rules:
- If trend is Improving → praise progress and suggest sustaining momentum
- If trend is Stable → suggest specific small improvement actions
- If trend is Needs Focus → highlight gaps and corrective steps
- If trend is Critical → warn seriously but motivate recovery

Write a unique 2–3 line insight following the rule.
Tone: supportive, clear, exam-oriented.
Avoid emojis.
Do NOT repeat wording from previous responses.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  contents: [
    {
      parts: [{ text: prompt }]
    }
  ],
  generationConfig: {
    temperature: 0.85,
    topP: 0.95,
    maxOutputTokens: 120
  }
})
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Keep practising consistently to improve your performance.";

    res.status(200).json({ insight: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      insight:
        "Your performance data is being analysed. Keep practising regularly."
    });
  }
}