const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message, token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Missing captcha token" });
    }

    // 🔐 Turnstile verify
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
          response: token
        })
      }
    );

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return res.status(403).json({ error: "Captcha failed" });
    }

    // 📧 Resend email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "TIC.Kar <resend@resend.dev>",
        to: ["contact.globalratings@gmail.com"],
        subject: subject || "New Contact Message",
        html: `<p>${message}</p>`
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return res.status(500).json({ error: "Resend failed" });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("API crash:", err);
    return res.status(500).json({ error: "Server crash" });
  }
};