import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";
import { navigate } from "./router.js";
import { showToast } from "./utils.js";

export let currentUser  = null;
export let userProfile  = null;

export function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        userProfile = snap.data();
        navigate('home');
      } else {
        navigate('cadastro');
      }
    } else {
      currentUser = null;
      userProfile = null;
      navigate('login');
    }
  });
}

export async function cadastrar({ email, senha, tipo, dados }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, 'users', cred.user.uid), {
      ...dados, email, tipo, verificado: false, createdAt: serverTimestamp()
    });
    showToast('Cadastro realizado! Bem-vindo ao Planti.');
  } catch(err) { throw traduzir(err.code); }
}

export async function login(email, senha) {
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch(err) { throw traduzir(err.code); }
}

export async function logout() {
  await signOut(auth);
}

function traduzir(code) {
  const e = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email':        'E-mail inválido.',
    'auth/weak-password':        'Senha fraca. Use ao menos 6 caracteres.',
    'auth/user-not-found':       'E-mail não encontrado.',
    'auth/wrong-password':       'Senha incorreta.',
    'auth/invalid-credential':   'E-mail ou senha incorretos.',
    'auth/too-many-requests':    'Muitas tentativas. Aguarde alguns minutos.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  };
  return e[code] || 'Algo deu errado. Tente novamente.';
}
