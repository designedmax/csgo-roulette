import { CONFIG } from './config.js';
import { database } from './firebase.js';

class User {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.userId = this.tg.initDataUnsafe?.user?.id;
        this.userData = { ...CONFIG.DEFAULT_USER_DATA };
    }

    async initUser() {
        try {
            if (!this.userId) {
                throw new Error('No user ID from Telegram');
            }

            // Set initial user data from Telegram
            this.userData.name = this.tg.initDataUnsafe.user.first_name;
            this.userData.photo_url = this.tg.initDataUnsafe.user.photo_url;

            // Try to load existing user data
            const userRef = database.ref(`users/${this.userId}`);
            const snapshot = await userRef.once('value');
            const savedData = snapshot.val();

            if (savedData) {
                // Merge saved data with default data
                this.userData = {
                    ...this.userData,
                    ...savedData,
                    name: this.tg.initDataUnsafe.user.first_name, // Always use current Telegram name
                    photo_url: this.tg.initDataUnsafe.user.photo_url // Always use current Telegram photo
                };
            } else {
                // Save initial user data
                this.userData.firstLoginTime = Date.now();
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
            const userRef = database.ref(`users/${this.userId}`);
            await userRef.set(this.userData);
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    updateUI() {
        // Update main page
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userBalance = document.getElementById('user-balance');

        if (userAvatar) userAvatar.src = this.userData.photo_url;
        if (userName) userName.textContent = this.userData.name;
        if (userBalance) userBalance.textContent = `${this.userData.balance} ₽`;

        // Update profile page
        const profileAvatar = document.getElementById('profile-avatar');
        const profileName = document.getElementById('profile-name');
        const profileBalance = document.getElementById('profile-balance');
        const totalGames = document.getElementById('total-games');
        const totalWins = document.getElementById('total-wins');
        const totalLosses = document.getElementById('total-losses');
        const totalAchievements = document.getElementById('total-achievements');

        if (profileAvatar) profileAvatar.src = this.userData.photo_url;
        if (profileName) profileName.textContent = this.userData.name;
        if (profileBalance) profileBalance.textContent = `${this.userData.balance} ₽`;
        if (totalGames) totalGames.textContent = this.userData.totalGames;
        if (totalWins) totalWins.textContent = this.userData.totalWins;
        if (totalLosses) totalLosses.textContent = this.userData.totalLosses;
        if (totalAchievements) totalAchievements.textContent = this.userData.achievements.length;
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
            this.userData.balance += CONFIG.GAME.DAILY_BONUS;
            this.userData.lastBonusTime = Date.now();
            await this.saveUserData();
            this.updateUI();
            return true;
        }
        return false;
    }
}

export { User }; 