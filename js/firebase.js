import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBwQH0QwQwQwQwQwQwQwQwQwQwQwQwQwQ",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-app-default-rtdb.firebaseio.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }; 