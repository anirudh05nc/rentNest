import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// Updated with user provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyBELEM20vvIJXcVaG4imiLMib-hBHkJSVE",
  authDomain: "rentnest-78a14.firebaseapp.com",
  projectId: "rentnest-78a14",
  storageBucket: "rentnest-78a14.firebasestorage.app",
  messagingSenderId: "767902849411",
  appId: "1:767902849411:web:9b50975b4fbf548aecfeb6",
  measurementId: "G-N0E3591NH0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

export default app;
