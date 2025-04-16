import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js';

const firebaseConfig = {
    apiKey: "AIzaSyDZuLclwcWqOiLEl542NmkdG_MwTQV-kWo",
    authDomain: "cs-roll.firebaseapp.com",
    databaseURL: "https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cs-roll",
    storageBucket: "cs-roll.firebasestorage.app",
    messagingSenderId: "66184383207",
    appId: "1:66184383207:web:d265b002fcf826a4f9b042"
};

console.log('Initializing Firebase with config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);

const database = getDatabase(app);
console.log('Firebase database initialized:', database);

export { database, ref, set, onValue }; 