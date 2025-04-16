// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cs-roll",
    appId: "1:1234567890:web:abcdef1234567890"
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

    // Monitor connection state
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            console.log('Connected to Firebase');
        } else {
            console.log('Disconnected from Firebase');
        }
    });

    // Monitor for errors
    database.ref().on('error', (error) => {
        console.error('Firebase error:', error);
    });

    // Test write operation
    const testRef = database.ref('test');
    await testRef.set({ timestamp: Date.now() });
    console.log('Test write successful');

    // Test read operation
    const snapshot = await testRef.once('value');
    console.log('Test read successful:', snapshot.val());

} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
}

// Export database reference
export { database }; 