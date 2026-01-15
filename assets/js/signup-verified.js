import {
  sendEmailVerification,
  applyActionCode
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { auth } from "./firebase.js";

/* =========================
   UI ELEMENTS
========================= */
const msg = document.getElementById("verifyMsg");
const resendBtn = document.getElementById("resendBtn");

/* =========================
   URL PARAMS
========================= */
const params = new URLSearchParams(window.location.search);
const oobCode = params.get("oobCode");

/* =========================
   VERIFY EMAIL WITH CODE
========================= */
async function verifyEmailWithCode(code) {
  try {
    await applyActionCode(auth, code);

    console.log("✅ Email verified via link");

    // 🔥 UPDATE PAGE CONTENT TO "VERIFIED" STATE
document.querySelector("h1").textContent = "Email verified!🤗";

document.querySelector(".verify-desc").textContent =
  "Your email address has been successfully verified.";

document.querySelector(".verify-hint").textContent =
  "You’ll be redirected to your account in a moment.";

msg.textContent = "Redirecting…";

resendBtn.style.display = "none";

    setTimeout(() => {
  window.location.href = "/index.html#login";
}, 5000);

  } catch (error) {
    console.error("❌ Verification failed", error.code, error.message);

    msg.textContent =
      "Verification link expired or invalid. Please resend.";
  }
}

/* =========================
   INITIAL PAGE LOGIC
========================= */
if (oobCode) {
  // 🔥 USER CLICKED EMAIL LINK
  verifyEmailWithCode(oobCode);
} else {
  // 🔥 NORMAL WAITING PAGE (AFTER SIGNUP)
  msg.textContent =
    "Verification email sent. Please check your inbox.";
}

/* =========================
   RESEND VERIFICATION EMAIL
========================= */
resendBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    msg.textContent =
      "Session expired. Please login again.";
    return;
  }

  msg.textContent = "Sending verification email…";

  try {
await sendEmailVerification(user, {
  url: "https://beforexam.vercel.app/signup-verified.html"
});

    console.log("📩 Verification email resent");

    msg.textContent =
      "Verification email sent again. Check inbox or spam.";

  } catch (error) {
    console.error("❌ Resend failed", error.code, error.message);

    msg.textContent =
      error.message.replace("Firebase:", "") ||
      "Failed to resend email.";
  }
});