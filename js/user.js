import { database } from './firebase.js';

class User {
    constructor() {
        this.userId = null;
        this.userData = null;
        this.DATA_VERSION = 3; // Increment version to force reset
    }

    async initUser() {
        try {
            const tg = window.Telegram.WebApp;
            tg.ready();
            
            this.userId = tg.initDataUnsafe.user?.id;
            console.log('Initializing user with ID:', this.userId);
            
            if (!this.userId) {
                console.error('No user ID found in Telegram WebApp data');
                return;
            }

            // Force clear old data from Firebase
            await database.ref(`users/${this.userId}`).remove();
            console.log('Cleared old data from Firebase');

            // Initialize fresh user data structure
            this.userData = {
                id: this.userId,
                firstName: tg.initDataUnsafe.user?.first_name || 'Игрок',
                lastName: tg.initDataUnsafe.user?.last_name || '',
                username: tg.initDataUnsafe.user?.username || '',
                photoUrl: tg.initDataUnsafe.user?.photo_url || 'img/default-avatar.png',
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

            console.log('Initial user data:', this.userData);

            // Save initial data to Firebase
            await this.saveUserData();
            console.log('Initial data saved to Firebase');

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
        
        // Update game statistics
        this.userData.totalGames++;
        if (bet.win) {
            this.userData.totalWins++;
        } else {
            this.userData.totalLosses++;
        }
        
        await this.saveUserData();
    }

    async clearBetHistory() {
        this.userData.betHistory = [];
        await this.saveUserData();
    }

    updateUI() {
        // Update user info
        document.getElementById('user-name').textContent = this.userData.firstName;
        document.getElementById('user-balance').textContent = this.userData.balance;
        document.getElementById('user-avatar').src = this.userData.photoUrl || 'default-avatar.png';

        // Update profile page
        document.getElementById('profile-name').textContent = this.userData.firstName;
        document.getElementById('profile-avatar').src = this.userData.photoUrl || 'default-avatar.png';
        document.getElementById('registration-date').textContent = new Date(this.userData.registrationDate).toLocaleDateString();
        document.getElementById('total-games').textContent = this.userData.totalGames;
        document.getElementById('total-wins').textContent = this.userData.totalWins;
        document.getElementById('total-achievements').textContent = this.userData.totalAchievements;
        
        // Force update achievements display
        const achievements = new Achievements(this);
        achievements.initializeAchievements();
        achievements.updateAchievementsDisplay();
    }

    async canGetDailyBonus() {
        const now = Date.now();
        return now - this.userData.lastBonusTime >= CONFIG.BONUS_COOLDOWN;
    }

    async getDailyBonus() {
        if (await this.canGetDailyBonus()) {
            this.userData.balance += CONFIG.DAILY_BONUS_AMOUNT;
            this.userData.lastBonusTime = Date.now();
            await this.saveUserData();
            this.updateUI();
            return true;
        }
        return false;
    }
} 