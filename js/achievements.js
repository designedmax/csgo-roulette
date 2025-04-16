import { CONFIG } from './config.js';

class Achievements {
    constructor(user) {
        this.user = user;
        this.achievementsList = document.getElementById('achievements-list');
        this.initEventListeners();
        this.updateAchievementsDisplay();
    }

    initEventListeners() {
        // Add event listener for clearing history
        document.getElementById('clear-history').addEventListener('click', async () => {
            await this.user.clearBetHistory();
            this.updateAchievementsDisplay();
        });
    }

    updateAchievementsDisplay() {
        if (!this.achievementsList) return;

        this.achievementsList.innerHTML = '';
        this.user.userData.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            achievementElement.innerHTML = `
                <div class="achievement-emoji">${achievement.emoji}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            
            this.achievementsList.appendChild(achievementElement);
        });
    }

    checkAchievements() {
        const achievements = this.user.userData.achievements;
        let updated = false;

        // Check each achievement
        if (!achievements.find(a => a.id === 'new_player').unlocked) {
            achievements.find(a => a.id === 'new_player').unlocked = true;
            updated = true;
        }

        if (this.user.userData.totalWins > 0 && !achievements.find(a => a.id === 'first_win').unlocked) {
            achievements.find(a => a.id === 'first_win').unlocked = true;
            updated = true;
        }

        if (this.user.userData.balance >= 10000 && !achievements.find(a => a.id === 'rich').unlocked) {
            achievements.find(a => a.id === 'rich').unlocked = true;
            updated = true;
        }

        if (this.user.userData.totalGames >= 100 && !achievements.find(a => a.id === 'gambler').unlocked) {
            achievements.find(a => a.id === 'gambler').unlocked = true;
            updated = true;
        }

        // Check for 3 consecutive wins
        if (this.user.userData.betHistory && this.user.userData.betHistory.length >= 3) {
            const lastThreeBets = this.user.userData.betHistory.slice(0, 3);
            if (lastThreeBets.every(bet => bet.result === 'win') && !achievements.find(a => a.id === 'lucky').unlocked) {
                achievements.find(a => a.id === 'lucky').unlocked = true;
                updated = true;
            }
        }

        // Check for big win
        if (this.user.userData.betHistory) {
            const hasBigWin = this.user.userData.betHistory.some(bet => 
                bet.result === 'win' && bet.amount * 2 >= 5000
            );
            if (hasBigWin && !achievements.find(a => a.id === 'big_win').unlocked) {
                achievements.find(a => a.id === 'big_win').unlocked = true;
                updated = true;
            }
        }

        if (this.user.userData.totalGames >= 500 && !achievements.find(a => a.id === 'veteran').unlocked) {
            achievements.find(a => a.id === 'veteran').unlocked = true;
            updated = true;
        }

        if (this.user.userData.balance >= 100000 && !achievements.find(a => a.id === 'millionaire').unlocked) {
            achievements.find(a => a.id === 'millionaire').unlocked = true;
            updated = true;
        }

        if (updated) {
            this.user.userData.totalAchievements = achievements.filter(a => a.unlocked).length;
            this.user.saveUserData();
            this.updateAchievementsDisplay();
        }
    }
}

export { Achievements }; 