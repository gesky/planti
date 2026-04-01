import { initAuth, currentUser, userProfile, login, cadastrar, logout } from "./auth.js";
import { navigate, register, goBack } from "./router.js";
import { showToast, maskCPF, maskCNPJ, maskPhone } from "./utils.js";

// ── Splash ──
document.fonts.ready.then(() => {
  setTimeout(() => document.getElementById('splash')?.classList.add('hide'), 500);
});

// ── Registrar rotas ──
register('home',           mountHome);
register('cadastro',       mountCadastro);
register('disponibilidade',mountDisponibilidade);
register('chat-list',      mountChatList);
register('perfil',         mountPerfil);

// ── Iniciar auth ──
initAuth();

// ── Listeners login ──
document.getElementById('btn-login')?.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const erro  = document.getElementById('login-erro');
  const btn   = document.getElementById('btn-login');
  erro.style.display = 'none';
  btn.textContent = 'Entrando...';
  btn.disabled = true;
  try {
    await login(email, senha);
  } catch(msg) {
    erro.textContent = msg;
    erro.style.display = 'block';
    btn.textContent = 'Entrar';
    btn.disabled = false;
  }
});

document.getElementById('link-cadastro')?.addEventListener('click', (e) => {
  e.preventDefault();
  navigate('cadastro');
});

document.getElementById('cadastro-back')?.addEventListener('click', () => {
  goBack();
});

// ── Nav ──
function mountNav(tipo) {
  const nav = document.getElementById('bottom-nav');
  nav.style.display = 'flex';
  const items = tipo === 'profissional'
    ? [
        {id:'home',            icon:'🔍', label:'Buscar'},
        {id:'disponibilidade', icon:'📅', label:'Plantões'},
        {id:'chat-list',       icon:'💬', label:'Mensagens'},
        {id:'perfil',          icon:'👤', label:'Perfil'},
      ]
    : [
        {id:'home',      icon:'🔍', label:'Profissionais'},
        {id:'chat-list', icon:'💬', label:'Mensagens'},
        {id:'perfil',    icon:'👤', label:'Perfil'},
      ];

  nav.innerHTML = items.map(item => `
    <button class="nav-item" data-route="${item.id}" onclick="window.__navTo('${item.id}')">
      <span style="font-size:22px;line-height:1">${item.icon}</span>
      <span style="font-size:10px;font-weight:500">${item.label}</span>
    </button>
  `).join('');
}

window.__navTo = (route) => {
  navigate(route);
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });
};

// ── TELA: Cadastro ──
function mountCadastro() {
  const mount = document.getElementById('cadastro-mount');
  mount.innerHTML = `
    <div style="max-width:440px;margin:0 auto;padding-bottom:32px">

      <!-- Seletor de tipo -->
      <div style="display:flex;gap:8px;background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:5px;margin-bottom:20px">
        <button id="tipo-prof" onclick="window.__tipoTab('profissional')" style="flex:1;padding:9px;border:none;border-radius:7px;background:#2563EB;color:#fff;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer">Sou profissional</button>
        <button id="tipo-cont" onclick="window.__tipoTab('contratante')"  style="flex:1;padding:9px;border:none;border-radius:7px;background:transparent;color:#6B7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer">Sou contratante</button>
      </div>

      <!-- Formulário profissional -->
      <div id="form-prof">
        <div class="card">
          <div class="form-group">
            <label>Nome completo</label>
            <input type="text" id="c-nome" placeholder="Ex.: Ana Lima">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label>CPF</label>
              <input type="text" id="c-cpf" placeholder="000.000.000-00" oninput="this.value=window.__maskCPF(this.value)">
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input type="tel" id="c-tel" placeholder="(00) 00000-0000" oninput="this.value=window.__maskPhone(this.value)">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label>Especialidade</label>
              <select id="c-esp">
                <option value="">Selecione...</option>
                <option>Enfermeiro(a)</option>
                <option>Técnico(a) de enfermagem</option>
                <option>Cuidador(a)</option>
                <option>Fisioterapeuta</option>
                <option>Médico(a)</option>
                <option>Psicólogo(a)</option>
                <option>Nutricionista</option>
                <option>Fonoaudiólogo(a)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nº conselho</label>
              <input type="text" id="c-conselho" placeholder="COREN-SP 123456">
            </div>
          </div>
          <div class="form-group">
            <label>Cidade de atuação</label>
            <input type="text" id="c-cidade" placeholder="Ex.: Bauru, SP">
          </div>
        </div>

        <div class="card" style="margin-top:12px">
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" id="c-email" placeholder="seu@email.com" autocomplete="email">
          </div>
          <div class="form-group" style="margin-bottom:16px">
            <label>Senha</label>
            <input type="password" id="c-senha" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
          </div>
          <div class="lgpd-row" style="margin-bottom:18px">
            <input type="checkbox" id="c-lgpd">
            <label for="c-lgpd">Li e aceito os <a href="#">Termos de uso</a> e a <a href="#">Política de privacidade</a>. Concordo com o tratamento dos meus dados conforme a LGPD.</label>
          </div>
          <button class="btn btn-primary" id="btn-cadastrar">Criar meu perfil</button>
          <p id="cadastro-erro" style="font-size:13px;color:#DC2626;margin-top:10px;text-align:center;display:none"></p>
        </div>
      </div>

      <!-- Formulário contratante -->
      <div id="form-cont" style="display:none">
        <div class="card">
          <div class="form-group">
            <label>Razão social</label>
            <input type="text" id="cc-nome" placeholder="Nome da clínica ou hospital">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label>CNPJ</label>
              <input type="text" id="cc-cnpj" placeholder="00.000.000/0000-00" oninput="this.value=window.__maskCNPJ(this.value)">
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <select id="cc-tipo">
                <option value="">Selecione...</option>
                <option>Clínica</option>
                <option>Hospital</option>
                <option>UPA / UBS</option>
                <option>Casa de repouso</option>
                <option>Home care</option>
                <option>Laboratório</option>
                <option>Outro</option>
              </select>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label>Responsável</label>
              <input type="text" id="cc-resp" placeholder="Nome completo">
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input type="tel" id="cc-tel" placeholder="(00) 00000-0000" oninput="this.value=window.__maskPhone(this.value)">
            </div>
          </div>
          <div class="form-group">
            <label>Cidade</label>
            <input type="text" id="cc-cidade" placeholder="Ex.: Bauru, SP">
          </div>
        </div>

        <div class="card" style="margin-top:12px">
          <div class="form-group">
            <label>E-mail corporativo</label>
            <input type="email" id="cc-email" placeholder="rh@clinica.com.br" autocomplete="email">
          </div>
          <div class="form-group" style="margin-bottom:16px">
            <label>Senha</label>
            <input type="password" id="cc-senha" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
          </div>
          <div class="lgpd-row" style="margin-bottom:18px">
            <input type="checkbox" id="cc-lgpd">
            <label for="cc-lgpd">Li e aceito os <a href="#">Termos de uso</a> e a <a href="#">Política de privacidade</a>. Concordo com o tratamento dos dados conforme a LGPD.</label>
          </div>
          <button class="btn btn-primary" id="btn-cadastrar-cont">Criar conta da empresa</button>
          <p id="cadastro-cont-erro" style="font-size:13px;color:#DC2626;margin-top:10px;text-align:center;display:none"></p>
        </div>
      </div>

    </div>
  `;

  // máscaras globais
  window.__maskCPF   = maskCPF;
  window.__maskCNPJ  = maskCNPJ;
  window.__maskPhone = maskPhone;

  // tabs
  window.__tipoTab = (tipo) => {
    const isProf = tipo === 'profissional';
    document.getElementById('form-prof').style.display = isProf ? 'block' : 'none';
    document.getElementById('form-cont').style.display = isProf ? 'none'  : 'block';
    document.getElementById('tipo-prof').style.cssText = isProf
      ? 'flex:1;padding:9px;border:none;border-radius:7px;background:#2563EB;color:#fff;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer'
      : 'flex:1;padding:9px;border:none;border-radius:7px;background:transparent;color:#6B7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer';
    document.getElementById('tipo-cont').style.cssText = isProf
      ? 'flex:1;padding:9px;border:none;border-radius:7px;background:transparent;color:#6B7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer'
      : 'flex:1;padding:9px;border:none;border-radius:7px;background:#2563EB;color:#fff;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer';
  };

  // submit profissional
  document.getElementById('btn-cadastrar')?.addEventListener('click', async () => {
    const erro = document.getElementById('cadastro-erro');
    const btn  = document.getElementById('btn-cadastrar');
    erro.style.display = 'none';
    const nome     = document.getElementById('c-nome').value.trim();
    const email    = document.getElementById('c-email').value.trim();
    const senha    = document.getElementById('c-senha').value;
    const lgpd     = document.getElementById('c-lgpd').checked;
    if (!nome || !email || !senha) { erro.textContent = 'Preencha nome, e-mail e senha.'; erro.style.display='block'; return; }
    if (!lgpd) { erro.textContent = 'Aceite os termos para continuar.'; erro.style.display='block'; return; }
    btn.textContent = 'Criando conta...'; btn.disabled = true;
    try {
      await cadastrar({
        email, senha, tipo: 'profissional',
        dados: {
          nome,
          cpf:                  document.getElementById('c-cpf').value,
          telefone:             document.getElementById('c-tel').value,
          especialidadePrincipal: document.getElementById('c-esp').value,
          numeroConselho:       document.getElementById('c-conselho').value,
          cidade:               document.getElementById('c-cidade').value,
        }
      });
    } catch(msg) {
      erro.textContent = msg; erro.style.display='block';
      btn.textContent = 'Criar meu perfil'; btn.disabled = false;
    }
  });

  // submit contratante
  document.getElementById('btn-cadastrar-cont')?.addEventListener('click', async () => {
    const erro = document.getElementById('cadastro-cont-erro');
    const btn  = document.getElementById('btn-cadastrar-cont');
    erro.style.display = 'none';
    const nome  = document.getElementById('cc-nome').value.trim();
    const email = document.getElementById('cc-email').value.trim();
    const senha = document.getElementById('cc-senha').value;
    const lgpd  = document.getElementById('cc-lgpd').checked;
    if (!nome || !email || !senha) { erro.textContent = 'Preencha razão social, e-mail e senha.'; erro.style.display='block'; return; }
    if (!lgpd) { erro.textContent = 'Aceite os termos para continuar.'; erro.style.display='block'; return; }
    btn.textContent = 'Criando conta...'; btn.disabled = true;
    try {
      await cadastrar({
        email, senha, tipo: 'contratante',
        dados: {
          razaoSocial:          nome,
          cnpj:                 document.getElementById('cc-cnpj').value,
          tipoEstabelecimento:  document.getElementById('cc-tipo').value,
          responsavel:          document.getElementById('cc-resp').value,
          telefone:             document.getElementById('cc-tel').value,
          cidade:               document.getElementById('cc-cidade').value,
        }
      });
    } catch(msg) {
      erro.textContent = msg; erro.style.display='block';
      btn.textContent = 'Criar conta da empresa'; btn.disabled = false;
    }
  });
}

// ── TELA: Home ──
function mountHome() {
  const nome = userProfile?.nome?.split(' ')[0] || userProfile?.razaoSocial?.split(' ')[0] || '';
  mountNav(userProfile?.tipo || 'contratante');
  document.querySelector('[data-route="home"]')?.classList.add('active');

  document.getElementById('home-mount').innerHTML = `
    <div style="margin-bottom:16px">
      <h2 style="margin-bottom:4px">Olá, ${nome}!</h2>
      <p>Encontre profissionais disponíveis</p>
    </div>
    <div style="position:relative;margin-bottom:12px">
      <span style="position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:16px">🔍</span>
      <input type="text" placeholder="Especialidade ou nome..." style="padding-left:40px" oninput="window.__busca(this.value)">
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
      <div class="chip active" onclick="window.__chipEsp(this,'Todos')">Todos</div>
      <div class="chip" onclick="window.__chipEsp(this,'Enfermeiro')">Enfermeiro(a)</div>
      <div class="chip" onclick="window.__chipEsp(this,'Técnico')">Técnico</div>
      <div class="chip" onclick="window.__chipEsp(this,'Cuidador')">Cuidador(a)</div>
      <div class="chip" onclick="window.__chipEsp(this,'Fisio')">Fisio</div>
    </div>
    <p class="section-label" id="busca-count">Carregando...</p>
    <div id="busca-list" style="display:flex;flex-direction:column;gap:12px"></div>
  `;

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    if (confirm('Deseja sair?')) {
      await logout();
    }
  });

  window.__disponibilidades = [];
  window.__busca = (q) => {
    const lista = window.__disponibilidades;
    renderBusca(lista.filter(d =>
      d.profissional?.nome?.toLowerCase().includes(q.toLowerCase()) ||
      d.especialidade?.toLowerCase().includes(q.toLowerCase())
    ));
  };
  window.__chipEsp = (el, esp) => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const lista = window.__disponibilidades;
    renderBusca(esp === 'Todos' ? lista : lista.filter(d => d.especialidade?.includes(esp)));
  };

  loadDisps();
}

async function loadDisps() {
  const { collection, query, where, orderBy, limit, getDocs, getDoc, doc } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const { db } = await import("./firebase-config.js");
  try {
    const q = query(collection(db,'disponibilidades'), where('status','==','aberto'), orderBy('createdAt','desc'), limit(30));
    const snap = await getDocs(q);
    const lista = [];
    for (const ds of snap.docs) {
      const d = {id: ds.id, ...ds.data()};
      const ps = await getDoc(doc(db,'users',d.profissionalId));
      if (ps.exists()) d.profissional = ps.data();
      lista.push(d);
    }
    window.__disponibilidades = lista;
    renderBusca(lista);
  } catch(e) {
    document.getElementById('busca-count').textContent = 'Erro ao carregar.';
  }
}

function renderBusca(lista) {
  const el    = document.getElementById('busca-list');
  const count = document.getElementById('busca-count');
  if (!lista?.length) {
    count.textContent = 'Nenhum profissional encontrado';
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">Sem resultados</div><div class="empty-text">Tente outros filtros ou volte mais tarde.</div></div>`;
    return;
  }
  count.textContent = `${lista.length} profissional${lista.length!==1?'is':''} disponível${lista.length!==1?'is':''}`;
  const CORES = ['#2563EB','#059669','#7C3AED','#EA580C','#0891B2'];
  el.innerHTML = lista.map(d => {
    const p    = d.profissional || {};
    const nome = p.nome || 'Profissional';
    const ini  = nome.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
    const cor  = CORES[nome.charCodeAt(0) % CORES.length];
    return `
    <div class="card" style="cursor:pointer" onclick="">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="width:46px;height:46px;border-radius:12px;background:${cor};display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:#fff;flex-shrink:0">${ini}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:600;margin-bottom:2px">${nome} ${p.verificado?'<span style="font-size:11px;font-weight:600;color:#059669;background:#ECFDF5;padding:2px 7px;border-radius:8px">✓ Verificado</span>':''}</div>
          <div style="font-size:13px;color:#6B7280;margin-bottom:8px">${d.especialidade}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span style="font-size:12px;padding:3px 9px;border-radius:8px;background:#EFF6FF;color:#2563EB;font-weight:500">📍 ${d.cidade}</span>
            <span style="font-size:12px;padding:3px 9px;border-radius:8px;background:#EFF6FF;color:#2563EB;font-weight:500">${d.turno}</span>
          </div>
        </div>
        <div style="font-size:17px;font-weight:700;color:#2563EB;flex-shrink:0">R$ ${d.valorHora}/h</div>
      </div>
    </div>`;
  }).join('');
}

// ── TELA: Disponibilidade ──
function mountDisponibilidade() {
  document.querySelector('[data-route="disponibilidade"]')?.classList.add('active');
  document.querySelectorAll('.nav-item:not([data-route="disponibilidade"])').forEach(el => el.classList.remove('active'));
}

window.__abrirNovaDisp = () => navigate('disponibilidade');

// ── TELA: Chat list ──
function mountChatList() {
  document.querySelector('[data-route="chat-list"]')?.classList.add('active');
  document.querySelectorAll('.nav-item:not([data-route="chat-list"])').forEach(el => el.classList.remove('active'));
}

// ── TELA: Perfil ──
function mountPerfil() {
  document.querySelector('[data-route="perfil"]')?.classList.add('active');
  document.querySelectorAll('.nav-item:not([data-route="perfil"])').forEach(el => el.classList.remove('active'));

  const p    = userProfile || {};
  const nome = p.nome || p.razaoSocial || 'Usuário';
  const ini  = nome.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
  document.getElementById('perfil-mount').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;padding:24px 0 20px">
      <div style="width:72px;height:72px;border-radius:18px;background:#2563EB;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:28px;font-weight:600;color:#fff;margin-bottom:12px">${ini}</div>
      <div style="font-size:18px;font-weight:600;margin-bottom:4px">${nome}</div>
      <div style="font-size:13px;color:#6B7280">${p.email || ''}</div>
      ${p.verificado ? '<span style="margin-top:8px;font-size:12px;font-weight:600;color:#059669;background:#ECFDF5;padding:4px 10px;border-radius:10px">✓ Perfil verificado</span>' : '<span style="margin-top:8px;font-size:12px;font-weight:600;color:#EA580C;background:#FFF7ED;padding:4px 10px;border-radius:10px">⏳ Aguardando verificação</span>'}
    </div>
    <div class="card">
      ${p.tipo === 'profissional' ? `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6"><span style="font-size:14px;color:#6B7280">Especialidade</span><span style="font-size:14px;font-weight:500">${p.especialidadePrincipal || '—'}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6"><span style="font-size:14px;color:#6B7280">Conselho</span><span style="font-size:14px;font-weight:500">${p.numeroConselho || '—'}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6"><span style="font-size:14px;color:#6B7280">Cidade</span><span style="font-size:14px;font-weight:500">${p.cidade || '—'}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0"><span style="font-size:14px;color:#6B7280">Telefone</span><span style="font-size:14px;font-weight:500">${p.telefone || '—'}</span></div>
      ` : `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6"><span style="font-size:14px;color:#6B7280">Estabelecimento</span><span style="font-size:14px;font-weight:500">${p.tipoEstabelecimento || '—'}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6"><span style="font-size:14px;color:#6B7280">CNPJ</span><span style="font-size:14px;font-weight:500">${p.cnpj || '—'}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0"><span style="font-size:14px;color:#6B7280">Cidade</span><span style="font-size:14px;font-weight:500">${p.cidade || '—'}</span></div>
      `}
    </div>
    <button class="btn btn-secondary" style="margin-top:12px" onclick="if(confirm('Deseja sair?')) import('./auth.js').then(m=>m.logout())">Sair da conta</button>
  `;
}
