// firebase.js
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  signInAnonymously,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmBjo98Q-eDyIWlJKIlSSEr_6jNL1TNtg",
  authDomain: "uniflowcs.firebaseapp.com",
  projectId: "uniflowcs",
  storageBucket: "uniflowcs.firebasestorage.app",
  messagingSenderId: "47924461186",
  appId: "1:47924461186:web:10178f50291f013dafbe9b",
  measurementId: "G-SCEVP1XQKE",
};

// ✅ Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth with Persistence for React Native/Expo
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (_) {
  auth = getAuth(app);
}

// ✅ Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app); // Simplified: it uses storageBucket from config automatically

// ✅ Export everything needed
export { addDoc, auth, collection, onSnapshot, orderBy, query, serverTimestamp };

// 🔥 Required for Firebase Storage to work if rules require Auth
signInAnonymously(auth).catch((err) => console.log("Anon Sign-in Error: ", err));