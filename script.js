// Grupo SAFE 2.0 — interações da página inicial
// Configure o número oficial do WhatsApp: DDI + DDD + número, somente dígitos.
const SAFE_WHATSAPP = "5500000000000"; // Ex.: 5531999999999

const menuButton = document.getElementById("menuButton");
const links = document.getElementById("links");
menuButton?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  links.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("show"); observer.unobserve(entry.target); }
}), {threshold: .12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const progress = document.getElementById("progress");
const floating = document.getElementById("floating");
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  floating.classList.toggle("visible", scrollY > 450);
}
addEventListener("scroll", updateScroll, {passive:true}); updateScroll();

document.getElementById("contactForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name") || "").trim();
  const company = String(data.get("company") || "").trim();
  const subject = String(data.get("subject") || "").trim();
  if (!name || !subject) return alert("Informe seu nome e selecione o assunto.");
  if (SAFE_WHATSAPP === "5500000000000") return alert("Configure o número oficial do WhatsApp no arquivo script.js antes de publicar.");
  const message = ["Olá, Grupo SAFE! Gostaria de conversar sobre uma solução.", `Nome: ${name}`, company && `Empresa/Instituição: ${company}`, `Assunto: ${subject}`].filter(Boolean).join("\n");
  window.open(`https://wa.me/${SAFE_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
document.getElementById("year").textContent = new Date().getFullYear();
