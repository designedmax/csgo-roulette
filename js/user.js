import { database } from './firebase.js';

class User {
    constructor() {
        this.userId = null;
        this.userData = null;
    }

    async initUser() {
        const tg = window.Telegram.WebApp;
        tg.ready();
        
        this.userId = tg.initDataUnsafe.user?.id;
        
        // Initialize user data structure
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
            achievements: CONFIG.ACHIEVEMENTS,
            betHistory: [],
            lastBonusTime: 0
        };

        // Try to load user data from Firebase
        try {
            const snapshot = await database.ref(`users/${this.userId}`).once('value');
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Update only necessary fields, keep existing data
                this.userData = {
                    ...this.userData,
                    ...data,
                    id: this.userId, // Ensure ID is not overwritten
                    firstName: data.firstName || this.userData.firstName,
                    lastName: data.lastName || this.userData.lastName,
                    username: data.username || this.userData.username,
                    photoUrl: data.photoUrl || this.userData.photoUrl
                };
            } else {
                // Save initial user data to Firebase
                await this.saveUserData();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }

        this.updateUI();
    }

    async saveUserData() {
        try {
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
                lastBonusTime: this.userData.lastBonusTime
            };

            await database.ref(`users/${this.userId}`).set(userDataForFirebase);
            console.log('User data saved to Firebase:', userDataForFirebase);
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