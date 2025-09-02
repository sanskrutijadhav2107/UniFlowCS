// // firebase.js
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import { getApp, getApps, initializeApp } from "firebase/app";
// import {
//     getAuth,
//     getReactNativePersistence,
//     initializeAuth,
// } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//   apiKey: "AIzaSyDmBjo98Q-eDyIWlJKIlSSEr_6jNL1TNtg",
//   authDomain: "uniflowcs.firebaseapp.com",
//   projectId: "uniflowcs",
//   storageBucket: "uniflowcs.firebasestorage.app",
//   messagingSenderId: "47924461186",
//   appId: "1:47924461186:web:10178f50291f013dafbe9b",
//   measurementId: "G-SCEVP1XQKE"
// };


// // ✅ Ensure only ONE app instance
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// // ✅ Ensure only ONE auth instance
// let auth;
// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//   });
// } catch (e) {
//   auth = getAuth(app); // if already initialized
// }

// export { auth };
// export const db = getFirestore(app);
// export const storage = getStorage(app);


// firebase.js
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (_) {
  auth = getAuth(app);
}

export { addDoc, auth, collection, onSnapshot, orderBy, query, serverTimestamp };

export const db = getFirestore(app);
export const storage = getStorage(app);
