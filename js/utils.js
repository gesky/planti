export function showToast(msg, duration = 2800) {
  let toast = document.getElementById('toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

export function maskCPF(v) {
  return v.replace(/\D/g,'').slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
}
export function maskCNPJ(v) {
  return v.replace(/\D/g,'').slice(0,14).replace(/(\d{2})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d{1,2})$/,'$1-$2');
}
export function maskPhone(v) {
  return v.replace(/\D/g,'').slice(0,11).replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2');
}
export function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
}
export function nowHHMM() {
  const d = new Date();
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
export function calcHoras(inicio, fim) {
  const [sh,sm]=inicio.split(':').map(Number), [eh,em]=fim.split(':').map(Number);
  let mins=(eh*60+em)-(sh*60+sm); if(mins<=0) mins+=24*60; return mins/60;
}
export function autoResize(el, min=44) { el.style.height=min+'px'; el.style.height=Math.min(el.scrollHeight,120)+'px'; }
export function getInitials(nome) { return nome.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase(); }
const COLORS = ['#2563EB','#059669','#7C3AED','#EA580C','#0891B2','#B45309'];
export function getAvatarColor(uid) { return COLORS[(uid.charCodeAt(0)+uid.charCodeAt(uid.length-1))%COLORS.length]; }
export function starsHtml(r) {
  let h='<div class="stars">';
  for(let i=1;i<=5;i++) h+=`<span class="star${i>Math.round(r)?' empty':''}">★</span>`;
  return h+`<span class="rating-count">${r}</span></div>`;
}
