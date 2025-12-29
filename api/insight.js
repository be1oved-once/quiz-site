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
You are an academic mentor for CA Foundation students.

Student performance:
- Trend: ${trend}
- Accuracy: ${accuracy}%
- Subject: ${subject || "All Subjects"}
- Period: ${fromDate} to ${toDate}
- RTP attempts: ${rtp}
- MTP attempts: ${mtp}
- Chapter practice: ${chapter}

Write a short motivational insight (2–3 lines).
Tone: supportive, exam-focused.
Avoid emojis, avoid repetition.
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 80,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("HF error:", err);
      throw new Error("HF failed");
    }

    const data = await response.json();

    const text =
      data?.[0]?.generated_text?.trim() ||
      "Consistency matters more than intensity. Keep practising daily.";

    res.status(200).json({ insight: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      insight:
        "Your performance is improving gradually. Stay consistent and focused."
    });
  }
}