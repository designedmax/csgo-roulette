import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZuLclwcWqOiLEl542NmkdG_MwTQV-kWo",
    authDomain: "cs-roll.firebaseapp.com",
    databaseURL: "https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cs-roll",
    storageBucket: "cs-roll.firebasestorage.app",
    messagingSenderId: "66184383207",
    appId: "1:66184383207:web:d265b002fcf826a4f9b042"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Firebase initialized successfully');

export { database }; 