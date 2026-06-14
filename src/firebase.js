// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2ITbc_oWN0omHoFZWjS_wc5Pk8gTe9B4",
  authDomain: "finpro-2518e.firebaseapp.com",
  projectId: "finpro-2518e",
  storageBucket: "finpro-2518e.firebasestorage.app",
  messagingSenderId: "117497328548",
  appId: "1:117497328548:web:1232e71071a20d0af30731",
  measurementId: "G-TPG7HNDT5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);