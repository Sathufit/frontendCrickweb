// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- Import Firestore
// import { getAnalytics } from "firebase/analytics"; // Optional: if you need it

// Your web app's Firebase configuration
// IMPORTANT: For security, consider using environment variables for this in a real-world app
const firebaseConfig = {
  apiKey: "AIzaSyDUzdrogwogo4X5XyJV9rd0mBRkS_WMolk",
  authDomain: "live-score-app-568b8.firebaseapp.com",
  projectId: "live-score-app-568b8",
  storageBucket: "live-score-app-568b8.appspot.com", // Corrected the domain
  messagingSenderId: "505975251968",
  appId: "1:505975251968:web:5c730414b88b611073a4e5",
  measurementId: "G-L2WB3VQQ03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // <-- EXPORT THIS

// Optional: Initialize Analytics
// const analytics = getAnalytics(app);