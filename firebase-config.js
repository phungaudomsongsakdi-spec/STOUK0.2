// firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAgtG_2RgpTClw7EWwXiLk1AiBO5pe4k2s",
  authDomain: "stock-system-acaae.firebaseapp.com",
  databaseURL: "https://stock-system-acaae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stock-system-acaae",
  storageBucket: "stock-system-acaae.firebasestorage.app",
  messagingSenderId: "923611474965",
  appId: "1:923611474965:web:f8fc7d9e016f7b9e5b321c",
  measurementId: "G-X70EYTFPDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, database, analytics };