import { database } from './firebase.js';

class User {
    constructor() {
        this.userId = null;
        this.userData = null;
        this.DATA_VERSION = 1;
    }

    async initUser() {
        try {
            // Initialize Telegram WebApp
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();

            // Get user data from Telegram
            const user = tg.initDataUnsafe.user;
            console.log('Telegram user data:', user);

            if (!user || !user.id) {
                console.error('No user data from Telegram');
                return;
            }

            this.userId = user.id;
            console.log('Initializing user with ID:', this.userId);

            // Initialize fresh user data structure
            this.userData = {
                id: this.userId,
                firstName: user.first_name || 'Игрок',
                lastName: user.last_name || '',
                username: user.username || '',
                photoUrl: user.photo_url || 'img/default-avatar.png',
                balance: 0,
                registrationDate: new Date().toISOString(),
                totalGames: 0,
                totalWins: 0,
                totalLosses: 0,
                totalAchievements: 0,
                achievements: CONFIG.ACHIEVEMENTS.map(achievement => ({
                    ...achievement,
                    unlocked: false
                })),
                betHistory: [],
                lastBonusTime: 0,
                dataVersion: this.DATA_VERSION
            };

            // Try to load existing data from Firebase
            try {
                const snapshot = await database.ref(`users/${this.userId}`).once('value');
                console.log('Firebase snapshot:', snapshot.val());
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    console.log('Loaded data from Firebase:', data);
                    
                    // Update user data with existing data
                    this.userData = {
                        ...this.userData,
                        ...data,
                        id: this.userId,
                        firstName: data.firstName || this.userData.firstName,
                        lastName: data.lastName || this.userData.lastName,
                        username: data.username || this.userData.username,
                        photoUrl: data.photoUrl || this.userData.photoUrl,
                        achievements: data.achievements || this.userData.achievements,
                        betHistory: data.betHistory || this.userData.betHistory
                    };
                } else {
                    console.log('No existing data found, creating new user');
                    await this.saveUserData();
                }
            } catch (error) {
                console.error('Error loading data from Firebase:', error);
                await this.saveUserData();
            }

            this.updateUI();
        } catch (error) {
            console.error('Error in initUser:', error);
        }
    }

    async saveUserData() {
        try {
            if (!this.userId) {
                console.error('Cannot save data: no user ID');
                return;
            }

            // Calculate total achievements
            this.userData.totalAchievements = this.userData.achievements.filter(a => a.unlocked).length;
            
            // Prepare data for Firebase
            const userDataForFirebase = {
                id: this.userData.id,
                firstName: this.userData.firstName,
                lastName: this.userData.lastName,
                username: this.userData.username,
                photoUrl: this.userData.photoUrl,
                balance: this.userData.balance,
                registrationDate: this.userData.registrationDate,
                totalGames: this.userData.totalGames,
                totalWins: this.userData.totalWins,
                totalLosses: this.userData.totalLosses,
                totalAchievements: this.userData.totalAchievements,
                achievements: this.userData.achievements,
                betHistory: this.userData.betHistory,
                lastBonusTime: this.userData.lastBonusTime,
                dataVersion: this.DATA_VERSION
            };

            console.log('Saving to Firebase:', userDataForFirebase);
            await database.ref(`users/${this.userId}`).set(userDataForFirebase);
            console.log('User data saved successfully');

            // Verify the save
            const snapshot = await database.ref(`users/${this.userId}`).once('value');
            console.log('Verification - Data in Firebase:', snapshot.val());
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    async updateBalance(amount) {
        this.userData.balance += amount;
        await this.saveUserData();
        this.updateUI();
    }

    async addBetToHistory(bet) {
        if (!this.userData.betHistory) {
            this.userData.betHistory = [];
        }
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

    updateUI() {
        try {
            // Update user info
            const userName = document.getElementById('user-name');
            const userBalance = document.getElementById('user-balance');
            const userAvatar = document.getElementById('user-avatar');
            const profileName = document.getElementById('profile-name');
            const profileAvatar = document.getElementById('profile-avatar');
            const registrationDate = document.getElementById('registration-date');
            const totalGames = document.getElementById('total-games');
            const totalWins = document.getElementById('total-wins');
            const totalAchievements = document.getElementById('total-achievements');

            if (userName) userName.textContent = this.userData.firstName;
            if (userBalance) userBalance.textContent = this.userData.balance;
            if (userAvatar) userAvatar.src = this.userData.photoUrl;
            if (profileName) profileName.textContent = this.userData.firstName;
            if (profileAvatar) profileAvatar.src = this.userData.photoUrl;
            if (registrationDate) registrationDate.textContent = new Date(this.userData.registrationDate).toLocaleDateString();
            if (totalGames) totalGames.textContent = this.userData.totalGames;
            if (totalWins) totalWins.textContent = this.userData.totalWins;
            if (totalAchievements) totalAchievements.textContent = this.userData.totalAchievements;

            console.log('UI updated with data:', this.userData);
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }

    async canGetDailyBonus() {
        const now = Date.now();
        return now - this.userData.lastBonusTime >= 24 * 60 * 60 * 1000; // 24 hours
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