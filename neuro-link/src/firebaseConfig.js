// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvi7cI3h9WSlexDyJbmoi9JoEC-gg3FiA",
  authDomain: "cognia-2ef42.firebaseapp.com",
  projectId: "cognia-2ef42",
  storageBucket: "cognia-2ef42.firebasestorage.app",
  messagingSenderId: "970312595937",
  appId: "1:970312595937:web:eecbcea7e080047df83aa0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
