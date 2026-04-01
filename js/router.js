const routes = {};
let currentRoute = null;
const historyStack = [];

export function register(name, mountFn) {
  routes[name] = mountFn;
}

export function navigate(name, params = {}, addToHistory = true) {
  const screen  = document.getElementById(`screen-${name}`);
  const current = currentRoute ? document.getElementById(`screen-${currentRoute}`) : null;
  if (!screen) return;
  if (addToHistory && currentRoute && currentRoute !== name) historyStack.push(currentRoute);
  if (current) current.classList.add('hidden-left');
  screen.classList.remove('hidden-right', 'hidden-left');
  currentRoute = name;
  if (routes[name]) routes[name](params);
}

export function goBack() {
  if (!historyStack.length) return;
  const prev    = historyStack.pop();
  const current = document.getElementById(`screen-${currentRoute}`);
  const target  = document.getElementById(`screen-${prev}`);
  if (current) current.classList.add('hidden-right');
  if (target)  target.classList.remove('hidden-right', 'hidden-left');
  currentRoute = prev;
}

export function getRoute() { return currentRoute; }
