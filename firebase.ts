import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmqAg7NB2Js9800Q3GrYFsgP7fHyQ9bUQ",
  authDomain: "lyfehack2025.firebaseapp.com",
  projectId: "lyfehack2025",
  storageBucket: "lyfehack2025.firebasestorage.app",
  messagingSenderId: "760918234041",
  appId: "1:760918234041:web:3704ad5b00c6eb1a495c68",
  measurementId: "G-ND4ZHHZNBN"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };

