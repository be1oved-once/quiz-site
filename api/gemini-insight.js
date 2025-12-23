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

    const prompt = `
You are an academic performance analyst.

Student performance data:
- Trend: ${trend}
- Accuracy: ${accuracy}%
- Subject: ${subject || "All Subjects"}
- Period: ${fromDate} to ${toDate}
- RTP attempts: ${rtp}
- MTP attempts: ${mtp}
- Chapter practice: ${chapter}

Write a short, unique motivational insight (2–3 lines).
Tone: supportive, exam-oriented.
Avoid emojis and repetition.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      throw new Error("Gemini request failed");
    }

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Keep practising consistently to strengthen your performance.";

    res.status(200).json({ insight: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      insight:
        "Your performance is being analysed. Stay consistent and keep practising."
    });
  }
}