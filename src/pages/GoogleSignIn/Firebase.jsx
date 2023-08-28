import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCApcc8DM0loSqAu1eBQuP0yE1m7iBAocQ",
  authDomain: "bitwizards-niv-hackathon.firebaseapp.com",
  projectId: "bitwizards-niv-hackathon",
  storageBucket: "bitwizards-niv-hackathon.appspot.com",
  messagingSenderId: "422832354996",
  appId: "1:422832354996:web:83a949f05e6cb9f9dd09e1",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
