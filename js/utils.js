// utils.js — funções auxiliares

// ── Toast ──
export function showToast(msg, duration = 2800) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// ── Máscaras ──
export function maskCPF(value) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(value) {
  return value.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// ── Formatação ──
export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL"
  }).format(value);
}

export function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short", day: "2-digit", month: "short"
  }).format(date);
}

export function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function nowHHMM() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

// ── Cálculo de horas entre dois horários ──
export function calcHoras(inicio, fim) {
  const [sh, sm] = inicio.split(":").map(Number);
  const [eh, em] = fim.split(":").map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) mins += 24 * 60;
  return mins / 60;
}

// ── Auto-resize de textarea ──
export function autoResize(el, minHeight = 44) {
  el.style.height = minHeight + "px";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

// ── Gerador de iniciais para avatar ──
export function getInitials(nome) {
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

// ── Cores de avatar por inicial ──
const AVATAR_COLORS = [
  "#2563EB", "#059669", "#7C3AED", "#EA580C",
  "#0891B2", "#B45309", "#DC2626", "#0D9488"
];
export function getAvatarColor(uid) {
  const code = uid.charCodeAt(0) + uid.charCodeAt(uid.length - 1);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

// ── Debounce ──
export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Stars HTML ──
export function starsHtml(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star${i > Math.round(rating) ? " empty" : ""}">★</span>`;
  }
  html += `<span class="rating-count">${rating}</span></div>`;
  return html;
}
