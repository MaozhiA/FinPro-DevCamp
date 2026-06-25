import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2ITbc_oWN0omHoFZWjS_wc5Pk8gTe9B4",
  authDomain: "finpro-2518e.firebaseapp.com",
  projectId: "finpro-2518e",
  storageBucket: "finpro-2518e.firebasestorage.app", 
  messagingSenderId: "117497328548",
  appId: "1:117497328548:web:1232e71071a20d0af30731",
  measurementId: "G-TPG7HNDT5B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const storage = getStorage(app); 
export const analytics = getAnalytics(app);