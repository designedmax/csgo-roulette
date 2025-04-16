// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://cs-roll-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Export database reference
export { database }; 