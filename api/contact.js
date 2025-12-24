export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: ["contact.globalratings@gmail.com"],
        reply_to: email,
        subject: subject || "New Contact Message",
        html: `
  <div style="
    font-family: 'Poppins', Arial, sans-serif;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
  ">

    <!-- HEADER -->
    <div style="margin-bottom: 18px;">
      <span style="
        font-size: 20px;
        font-weight: 600;
        color: #111827;
      ">TIC</span>

      <span style="
        font-size: 20px;
        margin: 0 2px;
        -webkit-text-stroke: 1.5px #6c63ff;
        color: transparent;
      ">.</span>

      <span style="
        font-size: 12px;
        font-weight: 500;
        color: #374151;
        margin-left: 2px;
      ">Kar</span>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 16px;">

    <!-- BODY -->
    <h3 style="margin: 0 0 10px; color: #111827;">
      New Contact Message
    </h3>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject || "—"}</p>

    <p style="margin-top: 12px;">
      ${message.replace(/\n/g, "<br>")}
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">

    <p style="
      font-size: 12px;
      color: #6b7280;
    ">
      Sent via TIC.Kar Contact Form
    </p>
  </div>
`
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);
      throw new Error("Resend failed");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}