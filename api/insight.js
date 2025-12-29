export default async function handler(req, res) {
  console.log("🔥 /api/insight HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📩 Payload:", req.body);
    console.log("🔑 HF key exists:", !!process.env.HF_API_KEY);

    const prompt = `
You are an academic mentor for CA Foundation students.
Trend: ${req.body.trend}
Accuracy: ${req.body.accuracy}%

Write a short, supportive insight (2–3 lines).
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
          parameters: { max_new_tokens: 80 }
        })
      }
    );

    const raw = await response.text();
    console.log("📡 HF status:", response.status);
    console.log("📦 HF raw:", raw);

    const data = JSON.parse(raw);

    const text =
      data?.[0]?.generated_text ||
      "Consistency matters more than intensity. Keep practising.";

    return res.status(200).json({ insight: text.trim() });

  } catch (err) {
    console.error("❌ Insight error:", err);
    return res.status(200).json({
      insight: "Stay consistent. Your preparation is moving in the right direction."
    });
  }
}