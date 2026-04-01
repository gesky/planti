// router.js — navegação SPA sem recarregar a página

const routes = {};
let currentRoute = null;
const history_stack = [];

// Registra uma rota
export function register(name, mountFn) {
  routes[name] = mountFn;
}

// Navega para uma rota
export function navigate(name, params = {}, addToHistory = true) {
  const screen = document.getElementById(`screen-${name}`);
  const current = currentRoute ? document.getElementById(`screen-${currentRoute}`) : null;

  if (!screen) {
    console.warn(`[router] Tela não encontrada: ${name}`);
    return;
  }

  if (addToHistory && currentRoute && currentRoute !== name) {
    history_stack.push(currentRoute);
  }

  // animação de slide
  if (current) current.classList.add("hidden-left");
  screen.classList.remove("hidden-right", "hidden-left");

  currentRoute = name;

  // chama a função de mount da rota se existir
  if (routes[name]) routes[name](params);
}

// Volta para a tela anterior
export function goBack() {
  if (history_stack.length === 0) return;
  const prev = history_stack.pop();
  const current = document.getElementById(`screen-${currentRoute}`);
  const target  = document.getElementById(`screen-${prev}`);

  if (current) current.classList.add("hidden-right");
  if (target)  target.classList.remove("hidden-right", "hidden-left");

  currentRoute = prev;
}

// Rota atual
export function getRoute() { return currentRoute; }
