export const config = { runtime: "nodejs" };

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fetch from "node-fetch";

let app;
if (!global._firebaseAdmin) {
  app = initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
  global._firebaseAdmin = app;
}

const auth = getAuth();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, email, password, token } = req.body;

  if (!email || !password || !token) {
    return res.status(400).json({ error: "Missing fields" });
  }

  /* 🔐 VERIFY TURNSTILE */
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

  /* 🔥 CREATE FIREBASE USER */
  try {
    await auth.createUser({
      email,
      password,
      displayName: username
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}