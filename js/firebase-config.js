import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }               from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }          from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }            from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCDvfut5-x8JeDx_lGv1KYTiBCppvij-ys",
  authDomain:        "planti-6e495.firebaseapp.com",
  projectId:         "planti-6e495",
  storageBucket:     "planti-6e495.firebasestorage.app",
  messagingSenderId: "704397626955",
  appId:             "1:704397626955:web:4c6fb652ba6db0942a07ce"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch(e) {
  app = getApp();
}

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
