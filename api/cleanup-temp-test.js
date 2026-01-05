import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const ref = db.doc("tempTests/current");
  const snap = await ref.get();

  if (!snap.exists) {
    return res.status(200).send("No test");
  }

  const data = snap.data();
  const now = new Date();

  if (data.expiresAt && data.expiresAt.toDate() <= now) {
    await ref.delete();
    return res.status(200).send("🔥 Temp test deleted");
  }

  res.status(200).send("⏳ Still active");
}