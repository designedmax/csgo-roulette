class User {
    constructor() {
        this.initUser();
    }

    initUser() {
        const tg = window.Telegram.WebApp;
        tg.ready();
        
        this.userData = {
            id: tg.initDataUnsafe.user?.id,
            firstName: tg.initDataUnsafe.user?.first_name || 'Игрок',
            lastName: tg.initDataUnsafe.user?.last_name || '',
            username: tg.initDataUnsafe.user?.username || '',
            photoUrl: tg.initDataUnsafe.user?.photo_url || 'img/default-avatar.png',
            balance: this.getStoredBalance(),
            registrationDate: this.getStoredRegistrationDate(),
            totalGames: this.getStoredTotalGames(),
            totalWins: this.getStoredTotalWins(),
            achievements: this.getStoredAchievements(),
            betHistory: this.getStoredBetHistory(),
            lastBonusTime: this.getStoredLastBonusTime()
        };

        this.updateUI();
    }

    getStoredBalance() {
        return parseInt(localStorage.getItem('balance')) || 0;
    }

    getStoredRegistrationDate() {
        return localStorage.getItem('registrationDate') || new Date().toISOString();
    }

    getStoredTotalGames() {
        return parseInt(localStorage.getItem('totalGames')) || 0;
    }

    getStoredTotalWins() {
        return parseInt(localStorage.getItem('totalWins')) || 0;
    }

    getStoredAchievements() {
        const stored = localStorage.getItem('achievements');
        if (stored) {
            return JSON.parse(stored);
        }
        return JSON.parse(JSON.stringify(CONFIG.ACHIEVEMENTS));
    }

    getStoredBetHistory() {
        return JSON.parse(localStorage.getItem('betHistory')) || [];
    }

    getStoredLastBonusTime() {
        return parseInt(localStorage.getItem('lastBonusTime')) || 0;
    }

    saveUserData() {
        localStorage.setItem('balance', this.userData.balance);
        localStorage.setItem('registrationDate', this.userData.registrationDate);
        localStorage.setItem('totalGames', this.userData.totalGames);
        localStorage.setItem('totalWins', this.userData.totalWins);
        localStorage.setItem('achievements', JSON.stringify(this.userData.achievements));
        localStorage.setItem('betHistory', JSON.stringify(this.userData.betHistory));
        localStorage.setItem('lastBonusTime', this.userData.lastBonusTime);
    }

    updateBalance(amount) {
        this.userData.balance += amount;
        this.saveUserData();
        this.updateUI();
    }

    addBetToHistory(bet) {
        if (!this.userData.betHistory) {
            this.userData.betHistory = [];
        }
        this.userData.betHistory.unshift(bet);
        if (this.userData.betHistory.length > 50) {
            this.userData.betHistory.pop();
        }
        this.saveUserData();
    }

    clearBetHistory() {
        this.userData.betHistory = [];
        this.saveUserData();
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
        
        // Update total achievements count
        const totalAchievements = this.userData.achievements.filter(a => a.unlocked).length;
        document.getElementById('total-achievements').textContent = totalAchievements;
        
        // Force update achievements display
        const achievements = new Achievements(this);
        achievements.initializeAchievements();
        achievements.updateAchievementsDisplay();
    }

    canGetDailyBonus() {
        const now = Date.now();
        return now - this.userData.lastBonusTime >= CONFIG.BONUS_COOLDOWN;
    }

    getDailyBonus() {
        if (this.canGetDailyBonus()) {
            this.userData.balance += CONFIG.DAILY_BONUS_AMOUNT;
            this.userData.lastBonusTime = Date.now();
            this.saveUserData();
            this.updateUI();
            return true;
        }
        return false;
    }
} 