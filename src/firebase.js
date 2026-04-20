// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBDei7FCaYn_2IWesD2BYy5KsP1XaEjBa4",
  authDomain: "olx-clone-c305c.firebaseapp.com",
  projectId: "olx-clone-c305c",
  storageBucket: "olx-clone-c305c.appspot.com", // ✅ FIXED
  messagingSenderId: "948235774573",
  appId: "1:948235774573:web:858c2808628fa958e96d64",
  measurementId: "G-RF8V6SB4YK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db=getFirestore(app);
export const storage=getStorage(app);