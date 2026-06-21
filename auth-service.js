import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw2qCHvjgVhPu_P1HMz7djimyc5SgPyzA",
  authDomain: "sabor-premium-269e3.firebaseapp.com",
  projectId: "sabor-premium-269e3",
  storageBucket: "sabor-premium-269e3.firebasestorage.app",
  messagingSenderId: "985475813617",
  appId: "1:985475813617:web:cc12e658c231eb5f90d950"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function checkAuth(callback) {
  onAuthStateChanged(auth, callback);
}