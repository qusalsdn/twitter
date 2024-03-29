import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxGNmMoOB5yEVTSeF736tH5D6BPrA4Y5o",
  authDomain: "twitter-4e665.firebaseapp.com",
  projectId: "twitter-4e665",
  storageBucket: "twitter-4e665.appspot.com",
  messagingSenderId: "707684041205",
  appId: "1:707684041205:web:5bdd03e4710e12e85ee0bc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
