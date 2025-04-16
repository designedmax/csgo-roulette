import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDZuLclwcWqOiLEl542NmkdG_MwTQV-kWo",
  authDomain: "cs-roll.firebaseapp.com",
  databaseURL: "https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cs-roll",
  storageBucket: "cs-roll.firebasestorage.app",
  messagingSenderId: "66184383207",
  appId: "1:66184383207:web:d265b002fcf826a4f9b042"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app); 