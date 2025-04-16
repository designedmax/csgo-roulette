// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app"
};

console.log('Initializing Firebase with config:', firebaseConfig);

let database;

try {
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');

    // Get a reference to the database service
    database = firebase.database();
    console.log('Database reference obtained');

    // Test database connection
    database.ref('.info/connected').on('value', (snapshot) => {
        console.log('Database connection status:', snapshot.val() ? 'connected' : 'disconnected');
    });
} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
}

// Export database reference
export { database }; 