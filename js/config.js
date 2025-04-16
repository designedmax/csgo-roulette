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
    ACHIEVEMENTS: {
        welcome: {
            title: 'Добро пожаловать',
            description: 'Сделать первую ставку',
            icon: '👋',
            reward: 1000
        },
        first_win: {
            title: 'Вкус победы',
            description: 'Одержать первую победу',
            icon: '🏆',
            reward: 2000
        },
        skilled: {
            title: 'Умелый',
            description: 'Одержать 10 побед',
            icon: '🎯',
            reward: 5000
        },
        gambler: {
            title: 'Игроман',
            description: 'Одержать 50 побед',
            icon: '🎲',
            reward: 10000
        },
        unlucky: {
            title: 'Бывает',
            description: 'Потерпеть 10 поражений',
            icon: '😅',
            reward: 2000
        },
        very_unlucky: {
            title: 'Невезучий',
            description: 'Потерпеть 30 поражений',
            icon: '😢',
            reward: 5000
        },
        risky: {
            title: 'Рисковый',
            description: 'Сделать ставку 1000 рублей',
            icon: '💎',
            reward: 3000
        },
        rich: {
            title: 'Буратино',
            description: 'Накопить 5000 рублей',
            icon: '💰',
            reward: 5000
        }
    },

    // Default user data
    DEFAULT_USER_DATA: {
        name: '',
        balance: 0,
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        betHistory: [],
        achievements: {},
        lastBonusTime: 0,
        firstLoginTime: Date.now()
    }
}; 