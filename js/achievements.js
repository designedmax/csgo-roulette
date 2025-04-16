import { CONFIG } from './config.js';

export class Achievements {
    constructor(user) {
        this.user = user;
        this.achievementsList = document.getElementById('achievements-list');
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('clear-history').addEventListener('click', () => {
            this.user.userData.achievements = {};
            this.user.saveUserData();
            this.updateAchievementsDisplay();
        });
    }

    updateAchievementsDisplay() {
        if (!this.achievementsList) return;

        this.achievementsList.innerHTML = '';
        Object.entries(CONFIG.ACHIEVEMENTS).forEach(([id, achievement]) => {
            const unlocked = this.user.userData.achievements[id]?.unlocked || false;
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${unlocked ? 'unlocked' : 'locked'}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    ${unlocked ? `<span class="reward">+${achievement.reward} ₽</span>` : ''}
                </div>
            `;
            this.achievementsList.appendChild(achievementElement);
        });
    }

    checkAchievements() {
        const achievements = CONFIG.ACHIEVEMENTS;
        let newAchievements = false;

        // Check welcome achievement (first bet)
        if (this.user.userData.totalGames > 0 && !this.user.userData.achievements.welcome?.unlocked) {
            this.user.updateAchievement('welcome', true);
            this.user.addBalance(achievements.welcome.reward);
            newAchievements = true;
        }

        // Check first win achievement
        if (this.user.userData.totalWins >= 1 && !this.user.userData.achievements.first_win?.unlocked) {
            this.user.updateAchievement('first_win', true);
            this.user.addBalance(achievements.first_win.reward);
            newAchievements = true;
        }

        // Check skilled achievement (10 wins)
        if (this.user.userData.totalWins >= 10 && !this.user.userData.achievements.skilled?.unlocked) {
            this.user.updateAchievement('skilled', true);
            this.user.addBalance(achievements.skilled.reward);
            newAchievements = true;
        }

        // Check gambler achievement (50 wins)
        if (this.user.userData.totalWins >= 50 && !this.user.userData.achievements.gambler?.unlocked) {
            this.user.updateAchievement('gambler', true);
            this.user.addBalance(achievements.gambler.reward);
            newAchievements = true;
        }

        // Check unlucky achievement (10 losses)
        if (this.user.userData.totalLosses >= 10 && !this.user.userData.achievements.unlucky?.unlocked) {
            this.user.updateAchievement('unlucky', true);
            this.user.addBalance(achievements.unlucky.reward);
            newAchievements = true;
        }

        // Check very unlucky achievement (30 losses)
        if (this.user.userData.totalLosses >= 30 && !this.user.userData.achievements.very_unlucky?.unlocked) {
            this.user.updateAchievement('very_unlucky', true);
            this.user.addBalance(achievements.very_unlucky.reward);
            newAchievements = true;
        }

        // Check risky achievement (1000 bet)
        const hasBigBet = this.user.userData.betHistory.some(bet => bet.amount >= 1000);
        if (hasBigBet && !this.user.userData.achievements.risky?.unlocked) {
            this.user.updateAchievement('risky', true);
            this.user.addBalance(achievements.risky.reward);
            newAchievements = true;
        }

        // Check rich achievement (5000 balance)
        if (this.user.userData.balance >= 5000 && !this.user.userData.achievements.rich?.unlocked) {
            this.user.updateAchievement('rich', true);
            this.user.addBalance(achievements.rich.reward);
            newAchievements = true;
        }

        if (newAchievements) {
            this.updateAchievementsDisplay();
        }
    }
} 