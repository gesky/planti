// app.js — entry point da SPA Planti

import { initAuth, currentUser, userProfile, logout } from "./auth.js";
import { navigate, register, goBack }                 from "./router.js";
import { showToast }                                   from "./utils.js";

// ── Esconder splash assim que fontes carregarem ──
document.fonts.ready.then(() => {
  setTimeout(() => {
    document.getElementById("splash")?.classList.add("hide");
  }, 400);
});

// ── Registrar rotas ──
register("home",            mountHome);
register("disponibilidade", mountDisponibilidade);
register("chat-list",       mountChatList);
register("perfil",          mountPerfil);

// ── Iniciar autenticação ──
initAuth();

// ── Nav inferior ──
function mountNav(tipo) {
  const nav = document.getElementById("bottom-nav");

  const itemsProf = [
    { id: "home",             icon: "🔍", label: "Buscar" },
    { id: "disponibilidade",  icon: "📅", label: "Plantões" },
    { id: "chat-list",        icon: "💬", label: "Mensagens" },
    { id: "perfil",           icon: "👤", label: "Perfil" },
  ];
  const itemsCont = [
    { id: "home",       icon: "🔍", label: "Profissionais" },
    { id: "vagas",      icon: "📋", label: "Vagas" },
    { id: "chat-list",  icon: "💬", label: "Mensagens" },
    { id: "perfil",     icon: "👤", label: "Perfil" },
  ];

  const items = tipo === "profissional" ? itemsProf : itemsCont;

  nav.innerHTML = items.map(item => `
    <button class="nav-item" data-route="${item.id}" onclick="window.__navTo('${item.id}')">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </button>
  `).join("");
}

window.__navTo = (route) => {
  navigate(route);
  // atualizar estado ativo da nav
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.route === route);
  });
};

// ── Montar tela Home (busca de profissionais) ──
function mountHome() {
  mountNav(userProfile?.tipo || "contratante");
  document.querySelector('[data-route="home"]')?.classList.add("active");

  const mount = document.getElementById("home-mount");
  mount.innerHTML = `
    <div style="margin-bottom:14px">
      <h2 style="margin-bottom:4px">Olá, ${userProfile?.nome?.split(" ")[0] || ""}!</h2>
      <p>Encontre profissionais disponíveis</p>
    </div>

    <!-- Busca -->
    <div style="position:relative;margin-bottom:12px">
      <span style="position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:16px;color:var(--muted)">🔍</span>
      <input type="text" id="busca-input" placeholder="Especialidade ou nome..."
        style="padding-left:40px;font-size:15px"
        oninput="window.__filtrarBusca()">
    </div>

    <!-- Filtros rápidos -->
    <div class="chips" style="margin-bottom:16px" id="busca-chips">
      <div class="chip active" onclick="window.__chipEsp(this, 'Todos')">Todos</div>
      <div class="chip" onclick="window.__chipEsp(this, 'Enfermeiro(a)')">Enfermeiro(a)</div>
      <div class="chip" onclick="window.__chipEsp(this, 'Técnico de enf.')">Técnico</div>
      <div class="chip" onclick="window.__chipEsp(this, 'Cuidador(a)')">Cuidador(a)</div>
      <div class="chip" onclick="window.__chipEsp(this, 'Fisioterapeuta')">Fisio</div>
    </div>

    <p class="section-label" id="busca-count">Carregando...</p>
    <div id="busca-list" style="display:flex;flex-direction:column;gap:12px"></div>
  `;

  // carregar disponibilidades do Firestore
  loadDisponibilidades();

  // logout
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    if (confirm("Deseja sair?")) logout();
  });
}

async function loadDisponibilidades() {
  // Importar funções Firestore dinamicamente
  const { collection, query, where, orderBy, limit, getDocs } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const { db } = await import("./firebase-config.js");

  try {
    const q = query(
      collection(db, "disponibilidades"),
      where("status", "==", "aberto"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    window.__disponibilidades = [];

    for (const docSnap of snap.docs) {
      const disp = { id: docSnap.id, ...docSnap.data() };
      // buscar perfil do profissional
      const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const profSnap = await getDoc(doc(db, "users", disp.profissionalId));
      if (profSnap.exists()) disp.profissional = profSnap.data();
      window.__disponibilidades.push(disp);
    }
    renderBuscaList(window.__disponibilidades);
  } catch (err) {
    document.getElementById("busca-count").textContent = "Erro ao carregar. Tente novamente.";
    console.error(err);
  }
}

function renderBuscaList(lista) {
  const { getInitials, getAvatarColor, starsHtml, formatDate } = window.__utils || {};
  const el = document.getElementById("busca-list");
  const count = document.getElementById("busca-count");
  if (!lista.length) {
    count.textContent = "Nenhum profissional encontrado";
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">Sem resultados</div><div class="empty-text">Tente outros filtros ou volte mais tarde.</div></div>`;
    return;
  }
  count.textContent = `${lista.length} profissional${lista.length !== 1 ? "is" : ""} disponível${lista.length !== 1 ? "is" : ""}`;
  el.innerHTML = lista.map(d => {
    const p = d.profissional || {};
    const nome = p.nome || "Profissional";
    const ini = nome.split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase();
    const cor = ["#2563EB","#059669","#7C3AED","#EA580C","#0891B2"][nome.charCodeAt(0) % 5];
    return `
    <div class="card" style="cursor:pointer" onclick="window.__abrirPerfil('${d.id}')">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div class="avatar avatar-md" style="background:${cor}">${ini}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:600;margin-bottom:2px;display:flex;align-items:center;gap:6px">
            ${nome}
            ${p.verificado ? '<span class="verified-badge">✓ Verificado</span>' : ""}
          </div>
          <div style="font-size:13px;color:var(--muted);margin-bottom:8px">${d.especialidade}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span class="badge badge-blue">📍 ${d.cidade}</span>
            <span class="badge badge-blue">${d.turno}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
          <div style="font-size:17px;font-weight:700;color:var(--blue)">R$ ${d.valorHora}/h</div>
        </div>
      </div>
    </div>`;
  }).join("");
}

window.__chipEsp = (el, esp) => {
  document.querySelectorAll("#busca-chips .chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  const lista = window.__disponibilidades || [];
  const filtrada = esp === "Todos" ? lista : lista.filter(d => d.especialidade?.includes(esp.replace("(a)","")));
  renderBuscaList(filtrada);
};

window.__filtrarBusca = () => {
  const q = document.getElementById("busca-input")?.value.toLowerCase() || "";
  const lista = window.__disponibilidades || [];
  renderBuscaList(lista.filter(d =>
    d.profissional?.nome?.toLowerCase().includes(q) ||
    d.especialidade?.toLowerCase().includes(q)
  ));
};

window.__abrirPerfil = (id) => {
  navigate("chat", { disponibilidadeId: id });
};

// ── Disponibilidades (profissional) ──
function mountDisponibilidade() {
  // implementação completa no arquivo pages/disponibilidade.js
  const mount = document.getElementById("disp-mount");
  mount.innerHTML = `<p style="text-align:center;padding:32px;color:var(--muted)">Carregando plantões...</p>`;
  import("./pages/disponibilidade.js").then(m => m.mount());
}

// ── Chat list ──
function mountChatList() {
  import("./pages/chat.js").then(m => m.mountList());
}

// ── Perfil ──
function mountPerfil() {
  import("./pages/perfil.js").then(m => m.mount());
}
