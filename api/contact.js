export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // For now just log (later email / db)
    console.log("New Contact Message:", {
      name,
      email,
      subject,
      message
    });

    return res.status(200).json({
      success: true,
      message: "Message received"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}