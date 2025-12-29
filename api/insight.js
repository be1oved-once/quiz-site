export default async function handler(req, res) {
  console.log("🔥 /api/insight HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📩 Payload:", req.body);
    console.log("🔑 HF key exists:", !!process.env.HF_API_KEY);

    const { trend, accuracy } = req.body;

    const prompt = `
You are an academic mentor for CA Foundation students.

Trend: ${trend || "Stable"}
Accuracy: ${accuracy ?? "N/A"}%

Write a short, supportive insight (2–3 lines).
Tone: exam-oriented, motivating.
Avoid emojis and repetition.
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
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
            temperature: 0.7
          }
        })
      }
    );

    const raw = await response.text();
    console.log("📡 HF status:", response.status);
    console.log("📦 HF raw:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.warn("⚠️ HF returned non-JSON");
      return res.status(200).json({
        insight:
          "Your preparation is on track. Stay consistent and keep refining weak areas."
      });
    }

    // 🔥 IMPORTANT: HF often returns { error: "..."} with 200 status
    if (data?.error) {
      console.warn("⚠️ HF model error:", data.error);
      return res.status(200).json({
        insight:
          "Consistency and focused revision will steadily improve your performance."
      });
    }

    const text =
      data?.[0]?.generated_text?.trim() ||
      "Consistency matters more than intensity. Keep practising.";

    return res.status(200).json({ insight: text });

  } catch (err) {
    console.error("❌ Insight error:", err);
    return res.status(200).json({
      insight:
        "Your performance analysis is in progress. Stay disciplined and keep practising."
    });
  }
}