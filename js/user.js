import { CONFIG } from './config.js';
import { database, ref, set, get } from './firebase.js';

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

            // Try to load existing user data from Firebase
            const userRef = ref(database, `users/${this.userId}`);
            console.log('Attempting to load data from Firebase path:', `users/${this.userId}`);
            
            const snapshot = await get(userRef);
            console.log('Firebase snapshot:', snapshot.val());
            
            const savedData = snapshot.val();

            if (savedData) {
                console.log('Loaded saved user data:', savedData);
                this.userData = {
                    ...this.userData,
                    ...savedData,
                    achievements: CONFIG.ACHIEVEMENTS.map(achievement => ({
                        ...achievement,
                        unlocked: savedData.achievements?.find(a => a.id === achievement.id)?.unlocked || false
                    }))
                };
            } else {
                console.log('No saved data found, using default values');
                // Save initial user data to Firebase
                await this.saveUserData();
            }

            this.updateUI();
            return true;
        } catch (error) {
            console.error('Error initializing user:', error);
            throw error;
        }
    }

    async saveUserData() {
        try {
            const userRef = ref(database, `users/${this.userId}`);
            console.log('Saving user data to Firebase:', this.userData);
            await set(userRef, this.userData);
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    updateUI() {
        // Update main page
        document.getElementById('user-balance').textContent = `${this.userData.balance} ₽`;
        
        // Update profile page
        document.getElementById('user-avatar').src = this.tg.initDataUnsafe?.user?.photo_url || '';
        document.getElementById('user-name').textContent = this.userData.name;
        document.getElementById('profile-balance').textContent = `${this.userData.balance} ₽`;
        document.getElementById('total-games').textContent = this.userData.totalGames;
        document.getElementById('total-wins').textContent = this.userData.totalWins;
        document.getElementById('total-losses').textContent = this.userData.totalLosses;
        document.getElementById('total-achievements').textContent = this.userData.totalAchievements;
    }

    async updateBalance(amount) {
        this.userData.balance += amount;
        await this.saveUserData();
        this.updateUI();
    }

    async addBetToHistory(bet) {
        this.userData.betHistory.unshift(bet);
        if (this.userData.betHistory.length > 50) {
            this.userData.betHistory.pop();
        }
        await this.saveUserData();
    }

    async clearBetHistory() {
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