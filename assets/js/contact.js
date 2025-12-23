const form = document.getElementById("contactForm");
let locked = false;

form?.addEventListener("submit", async e => {
  e.preventDefault();
  if (locked) return;
  
  locked = true;
  const btn = form.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Sending...";
  
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
  } catch (err) {
    showToast("Something went wrong. Try again.");
  }
  
  setTimeout(() => {
    locked = false;
    btn.disabled = false;
    btn.textContent = "Send Message";
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