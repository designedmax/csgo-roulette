import { CONFIG } from './config.js';
import { database } from './firebase.js';

class User {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.userId = this.tg.initDataUnsafe?.user?.id || 'default_user';
        console.log('User constructor - userId:', this.userId);
        
        this.userData = {
            name: this.tg.initDataUnsafe?.user?.first_name || 'Гость',
            balance: 0,
            totalGames: 0,
            totalWins: 0,
            totalLosses: 0,
            betHistory: [],
            achievements: CONFIG.ACHIEVEMENTS.map(achievement => ({
                ...achievement,
                unlocked: false
            })),
            totalAchievements: 0,
            lastBonusTime: 0
        };
        console.log('Initial user data:', this.userData);
    }

    async initUser() {
        try {
            console.log('Starting user initialization...');
            console.log('Telegram user data:', this.tg.initDataUnsafe?.user);

            if (!this.tg.initDataUnsafe?.user) {
                throw new Error('No user data from Telegram');
            }

            // Update user data with Telegram info
            this.userData.name = this.tg.initDataUnsafe.user.first_name || 'Гость';
            
            // Try to load existing user data from Firebase
            const userRef = database.ref(`users/${this.userId}`);
            console.log('Attempting to load data from Firebase path:', `users/${this.userId}`);
            
            return new Promise((resolve, reject) => {
                userRef.on('value', (snapshot) => {
                    console.log('Firebase snapshot:', snapshot.val());
                    const savedData = snapshot.val();

                    if (savedData) {
                        console.log('Loaded saved user data:', savedData);
                        this.userData = {
                            ...this.userData,
                            ...savedData,
                            name: this.tg.initDataUnsafe.user.first_name || 'Гость', // Keep Telegram name
                            achievements: CONFIG.ACHIEVEMENTS.map(achievement => ({
                                ...achievement,
                                unlocked: savedData.achievements?.find(a => a.id === achievement.id)?.unlocked || false
                            }))
                        };
                    } else {
                        console.log('No saved data found, using default values');
                        // Save initial user data to Firebase
                        this.saveUserData();
                    }

                    this.updateUI();
                    resolve(true);
                }, (error) => {
                    console.error('Error reading from Firebase:', error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Error initializing user:', error);
            throw error;
        }
    }

    async saveUserData() {
        try {
            const userRef = database.ref(`users/${this.userId}`);
            console.log('Saving user data to Firebase:', this.userData);
            await userRef.set(this.userData);
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    updateUI() {
        console.log('Updating UI with user data:', this.userData);
        
        // Update main page
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userBalance = document.getElementById('user-balance');
        
        if (userAvatar) userAvatar.src = this.tg.initDataUnsafe?.user?.photo_url || '';
        if (userName) userName.textContent = this.userData.name;
        if (userBalance) userBalance.textContent = this.userData.balance;
        
        // Update profile page
        const profileAvatar = document.getElementById('profile-avatar');
        const profileName = document.getElementById('profile-name');
        const profileBalance = document.getElementById('profile-balance');
        const totalGames = document.getElementById('total-games');
        const totalWins = document.getElementById('total-wins');
        const totalLosses = document.getElementById('total-losses');
        const totalAchievements = document.getElementById('total-achievements');
        
        if (profileAvatar) profileAvatar.src = this.tg.initDataUnsafe?.user?.photo_url || '';
        if (profileName) profileName.textContent = this.userData.name;
        if (profileBalance) profileBalance.textContent = this.userData.balance;
        if (totalGames) totalGames.textContent = this.userData.totalGames;
        if (totalWins) totalWins.textContent = this.userData.totalWins;
        if (totalLosses) totalLosses.textContent = this.userData.totalLosses;
        if (totalAchievements) totalAchievements.textContent = this.userData.totalAchievements;
    }

    async updateBalance(amount) {
        console.log('Updating balance by:', amount);
        this.userData.balance += amount;
        await this.saveUserData();
        this.updateUI();
    }

    async addBetToHistory(bet) {
        console.log('Adding bet to history:', bet);
        this.userData.betHistory.unshift(bet);
        if (this.userData.betHistory.length > 50) {
            this.userData.betHistory.pop();
        }
        await this.saveUserData();
    }

    async clearBetHistory() {
        console.log('Clearing bet history');
        this.userData.betHistory = [];
        await this.saveUserData();
    }

    async canGetDailyBonus() {
        const now = Date.now();
        const lastBonusTime = this.userData.lastBonusTime || 0;
        const timeSinceLastBonus = now - lastBonusTime;
        return timeSinceLastBonus >= 24 * 60 * 60 * 1000; // 24 hours
    }

    async getDailyBonus() {
        if (await this.canGetDailyBonus()) {
            console.log('Giving daily bonus');
            this.userData.balance += 5000;
            this.userData.lastBonusTime = Date.now();
            await this.saveUserData();
            this.updateUI();
            return true;
        }
        return false;
    }
}

export { User }; 