export const CONFIG = {
    // Firebase configuration
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyDZuLclwcWqOiLEl542NmkdG_MwTQV-kWo",
        authDomain: "cs-roll.firebaseapp.com",
        databaseURL: "https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "cs-roll",
        storageBucket: "cs-roll.firebasestorage.app",
        messagingSenderId: "66184383207",
        appId: "1:66184383207:web:d265b002fcf826a4f9b042"
    },

    // Game settings
    GAME: {
        WIN_CHANCE: 0.4, // 40% chance to win
        MIN_BET: 100,
        MAX_BET: 1000,
        DAILY_BONUS: 5000
    },

    // Achievements configuration
    ACHIEVEMENTS: [
        {
            id: 'first_win',
            title: 'Первая победа',
            description: 'Выиграть первую игру',
            condition: (userData) => userData.totalWins >= 1,
            reward: 1000
        },
        {
            id: 'five_wins',
            title: 'Пять побед',
            description: 'Выиграть 5 игр',
            condition: (userData) => userData.totalWins >= 5,
            reward: 5000
        },
        {
            id: 'ten_wins',
            title: 'Десять побед',
            description: 'Выиграть 10 игр',
            condition: (userData) => userData.totalWins >= 10,
            reward: 10000
        },
        {
            id: 'rich',
            title: 'Богач',
            description: 'Накопить 10000 рублей',
            condition: (userData) => userData.balance >= 10000,
            reward: 5000
        },
        {
            id: 'millionaire',
            title: 'Миллионер',
            description: 'Накопить 50000 рублей',
            condition: (userData) => userData.balance >= 50000,
            reward: 10000
        },
        {
            id: 'gambler',
            title: 'Азартный игрок',
            description: 'Сыграть 50 игр',
            condition: (userData) => userData.totalGames >= 50,
            reward: 5000
        },
        {
            id: 'professional',
            title: 'Профессионал',
            description: 'Сыграть 100 игр',
            condition: (userData) => userData.totalGames >= 100,
            reward: 10000
        },
        {
            id: 'lucky',
            title: 'Везунчик',
            description: 'Выиграть 3 раза подряд',
            condition: (userData) => {
                const history = userData.betHistory.slice(0, 3);
                return history.length === 3 && history.every(bet => bet.won);
            },
            reward: 5000
        }
    ],

    // Default user data
    DEFAULT_USER_DATA: {
        name: '',
        balance: 0,
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        betHistory: [],
        achievements: [],
        lastBonusTime: 0,
        firstLoginTime: Date.now()
    }
}; 