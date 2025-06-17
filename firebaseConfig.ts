// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmqAg7NB2Js9800Q3GrYFsgP7fHyQ9bUQ",
  authDomain: "lyfehack2025.firebaseapp.com",
  projectId: "lyfehack2025",
  storageBucket: "lyfehack2025.firebasestorage.app",
  messagingSenderId: "760918234041",
  appId: "1:760918234041:web:3704ad5b00c6eb1a495c68",
  measurementId: "G-ND4ZHHZNBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);