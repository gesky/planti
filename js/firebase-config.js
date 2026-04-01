// ─────────────────────────────────────────────
// firebase-config.js
// Substitua os valores abaixo pelos do seu
// projeto no Firebase Console.
// ─────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 👇 Cole aqui as configs do seu projeto Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDvfut5-x8JeDx_lGv1KYTiBCppvij-ys",
  authDomain: "planti-6e495.firebaseapp.com",
  projectId: "planti-6e495",
  storageBucket: "planti-6e495.firebasestorage.app",
  messagingSenderId: "704397626955",
  appId: "1:704397626955:web:4c6fb652ba6db0942a07ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app     = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const storage = getStorage(app);

// ─────────────────────────────────────────────
// ESTRUTURA DO FIRESTORE
// ─────────────────────────────────────────────
//
// users/{uid}
//   type: "profissional" | "contratante"
//   nome: string
//   email: string
//   telefone: string
//   cidade: string
//   createdAt: timestamp
//   -- se profissional:
//   cpf: string
//   especialidadePrincipal: string
//   numeroConselho: string
//   turnosPreferidos: string[]
//   bio: string
//   verificado: boolean        ← ativado manualmente pelo admin
//   fotoUrl: string
//   -- se contratante:
//   cnpj: string
//   razaoSocial: string
//   tipoEstabelecimento: string
//   responsavel: string
//   cargo: string
//
// disponibilidades/{id}
//   profissionalId: uid
//   especialidade: string
//   cidade: string
//   data: timestamp
//   turno: string              ← "Manhã" | "Tarde" | "Noite" | "Plantão 12h" | "Plantão 24h"
//   horaInicio: string         ← "07:00"
//   horaFim: string            ← "19:00"
//   valorHora: number
//   status: "aberto" | "reservado" | "confirmado" | "cancelado"
//   createdAt: timestamp
//
// vagas/{id}
//   contratanteId: uid
//   titulo: string
//   especialidade: string
//   cidade: string
//   turno: string
//   dataInicio: timestamp
//   dataFim: timestamp | null
//   descricao: string
//   valorMin: number | null
//   valorMax: number | null
//   status: "aberta" | "fechada"
//   interessados: number       ← contador
//   createdAt: timestamp
//
// conversas/{id}
//   profissionalId: uid
//   contratanteId: uid
//   disponibilidadeId: string | null
//   vagaId: string | null
//   status: "aguardando" | "em_andamento" | "confirmado" | "recusado" | "cancelado"
//   proposta: {
//     especialidade: string
//     data: string
//     turno: string
//     valorHora: number
//   }
//   ultimaMensagem: string
//   ultimaMensagemAt: timestamp
//   createdAt: timestamp
//
// conversas/{id}/mensagens/{msgId}
//   remetenteId: uid
//   texto: string
//   timestamp: timestamp
//   lida: boolean
//
// avaliacoes/{id}
//   avaliadorId: uid
//   avaliadoId: uid
//   conversaId: string
//   nota: number               ← 1–5
//   texto: string
//   createdAt: timestamp
