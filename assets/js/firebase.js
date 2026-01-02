// Firebase v9 (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8NvfaQRw9-zsPRY4ky4Jp79yMwIEuJ_E",
  authDomain: "tickar.firebaseapp.com",
  projectId: "tickar",
  storageBucket: "tickar.firebasestorage.app",
  messagingSenderId: "54581941326",
  appId: "1:54581941326:web:08b856ae1392d951c51f1f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});