import { CONFIG } from './config.js';

// Initialize Firebase
const app = firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
const database = firebase.database();

// Test connection
const connectedRef = database.ref('.info/connected');
connectedRef.on('value', (snap) => {
    if (snap.val() === false) {
        console.error('Firebase connection failed');
    } else {
        console.log('Firebase connected successfully');
    }
});

export { database }; 