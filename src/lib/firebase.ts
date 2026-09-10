// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtVWs9yPXOl57uUvW7lx_OwsA-FLbH7Qg",
  authDomain: "signalwise-f959b.firebaseapp.com",
  projectId: "signalwise-f959b",
  storageBucket: "signalwise-f959b.firebasestorage.app",
  messagingSenderId: "664989487214",
  appId: "1:664989487214:web:4aa4924a852351241d967f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);