import { CONFIG } from './config.js';
import { database } from './firebase.js';

export class User {
    constructor() {
        this.userData = {
            balance: 0,
            totalGames: 0,
            wins: 0,
            losses: 0,
            achievements: {},
            lastBonusTime: 0,
            betHistory: []
        };
        
        this.initUser();
    }

    async initUser() {
        try {
            const tg = window.Telegram.WebApp;
            const tgUser = tg.initDataUnsafe?.user;
            
            if (tgUser) {
                this.userId = tgUser.id.toString();
                const userRef = database.ref(`users/${this.userId}`);
                
                userRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        this.userData = {
                            ...this.userData,
                            ...data,
                            achievements: data.achievements || {},
                            betHistory: data.betHistory || []
                        };
                    }
                    this.updateUI();
                });
            }
        } catch (error) {
            console.error('Error initializing user:', error);
        }
    }

    updateUI() {
        // Update main page
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userBalance = document.getElementById('user-balance');
        
        if (userAvatar) userAvatar.src = window.Telegram.WebApp.initDataUnsafe?.user?.photo_url || '';
        if (userName) userName.textContent = window.Telegram.WebApp.initDataUnsafe?.user?.first_name || 'Игрок';
        if (userBalance) userBalance.textContent = `${this.userData.balance} ₽`;

        // Update profile page
        const profileAvatar = document.getElementById('profile-avatar');
        const profileName = document.getElementById('profile-name');
        const profileBalance = document.getElementById('profile-balance');
        const totalGames = document.getElementById('total-games');
        const totalWins = document.getElementById('total-wins');
        const totalLosses = document.getElementById('total-losses');
        const totalAchievements = document.getElementById('total-achievements');
        const historyList = document.getElementById('history-list');

        if (profileAvatar) profileAvatar.src = window.Telegram.WebApp.initDataUnsafe?.user?.photo_url || '';
        if (profileName) profileName.textContent = window.Telegram.WebApp.initDataUnsafe?.user?.first_name || 'Игрок';
        if (profileBalance) profileBalance.textContent = `${this.userData.balance} ₽`;
        if (totalGames) totalGames.textContent = this.userData.totalGames;
        if (totalWins) totalWins.textContent = this.userData.wins;
        if (totalLosses) totalLosses.textContent = this.userData.losses;
        if (totalAchievements) {
            const unlockedCount = Object.values(this.userData.achievements).filter(a => a.unlocked).length;
            totalAchievements.textContent = `${unlockedCount}`;
        }

        // Update history list
        if (historyList) {
            historyList.innerHTML = '';
            this.userData.betHistory.forEach(bet => {
                const historyItem = document.createElement('div');
                historyItem.className = `history-item ${bet.won ? 'win' : 'lose'}`;
                historyItem.innerHTML = `
                    <span class="history-time">${new Date(bet.timestamp).toLocaleString()}</span>
                    <span class="history-amount">${bet.amount} ₽</span>
                    <span class="history-result">${bet.won ? 'Выигрыш' : 'Проигрыш'}</span>
                `;
                historyList.appendChild(historyItem);
            });
        }
    }

    async saveUserData() {
        try {
            const userRef = database.ref(`users/${this.userId}`);
            await userRef.set(this.userData);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    addBalance(amount) {
        this.userData.balance += amount;
        this.saveUserData();
    }

    subtractBalance(amount) {
        if (this.userData.balance >= amount) {
            this.userData.balance -= amount;
            this.saveUserData();
            return true;
        }
        return false;
    }

    getBalance() {
        return this.userData.balance;
    }

    updateAchievement(achievementId, unlocked) {
        if (!this.userData.achievements[achievementId]) {
            this.userData.achievements[achievementId] = { unlocked, timestamp: Date.now() };
            this.saveUserData();
            return true;
        }
        return false;
    }

    async updateBalance(amount) {
        this.userData.balance += amount;
        await this.saveUserData();
        this.updateUI();
    }

    async addBetToHistory(bet) {
        this.userData.betHistory.unshift({
            amount: bet.amount,
            won: bet.won,
            timestamp: Date.now()
        });
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