import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection 
} from "firebase/firestore";

// Helper to retrieve saved config from localStorage if set by user in setup modal
const getSavedCustomConfig = () => {
  try {
    const custom = localStorage.getItem("habbit_tracker_firebase_config");
    if (custom) return JSON.parse(custom);
  } catch (e) {
    console.error("Failed to parse custom firebase config from localStorage", e);
  }
  return null;
};

const customConfig = getSavedCustomConfig();

// Standard env vars or custom user config
const firebaseConfig = {
  apiKey: customConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPlaceholderKey1234567890",
  authDomain: customConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "habbit-tracker-demo.firebaseapp.com",
  projectId: customConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || "habbit-tracker-demo",
  storageBucket: customConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "habbit-tracker-demo.appspot.com",
  messagingSenderId: customConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: customConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef1234567890"
};

// Check if valid user keys are supplied
export const isFirebaseConfigured = Boolean(
  (customConfig?.apiKey && customConfig.apiKey !== "AIzaSyDemoPlaceholderKey1234567890") ||
  (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDemoPlaceholderKey1234567890")
);

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection 
};
