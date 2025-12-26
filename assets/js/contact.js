document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  let locked = false;

  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (locked) return;

    // CAPTCHA check
    if (!captcha || !captcha.checked) {
      showToast("Please confirm you are not a robot");
      return;
    }

    locked = true;

    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.innerHTML = "Sending...";

    const data = {
      name: form[0].value.trim(),
      email: form[1].value.trim(),
      subject: form[2].value.trim(),
      message: form[3].value.trim()
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed");

      showToast("Message sent successfully");
      form.reset();
      captcha.checked = false; // reset captcha
    } catch (err) {
      showToast("Something went wrong. Try again.");
    }

    setTimeout(() => {
      locked = false;
      btn.disabled = false;
      btn.innerHTML = `
        <i class="fa-solid fa-paper-plane"></i>
        <span>Send Message</span>
      `;
    }, 2000);
  });

  function showToast(text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `
      <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4ec.svg">
      <span>${text}</span>
    `;

    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 50);

    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 300);
    }, 2400);
  }
const captcha = document.getElementById("captchaCheck");
const captchaBox = document.getElementById("captchaBox");

captcha?.addEventListener("change", () => {
  if (!captcha.checked) return;

  // Start fake verification
  captchaBox.classList.add("verifying");

  setTimeout(() => {
    captchaBox.classList.remove("verifying");
  }, 3000);
});
});