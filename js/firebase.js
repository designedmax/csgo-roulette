import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js';

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
const database = getDatabase(app);

export { database, ref, set, get }; 