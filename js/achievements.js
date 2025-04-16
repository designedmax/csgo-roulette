class Achievements {
    constructor(user) {
        this.user = user;
        this.initEventListeners();
        this.initializeAchievements();
    }

    initEventListeners() {
        // Add any achievement-specific event listeners here
    }

    async initializeAchievements() {
        if (!this.user.userData.achievements) {
            this.user.userData.achievements = CONFIG.ACHIEVEMENTS.map(achievement => ({
                ...achievement,
                unlocked: false
            }));
            await this.user.saveUserData();
        }
        this.updateAchievementsDisplay();
    }

    updateAchievementsDisplay() {
        const achievementsContainer = document.getElementById('achievements-list');
        if (!achievementsContainer) return;
        
        achievementsContainer.innerHTML = '';

        const achievements = this.user.userData.achievements || [];
        
        achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;

            achievementsContainer.appendChild(achievementElement);
        });
    }

    async checkAndUnlockAchievements() {
        const achievements = this.user.userData.achievements || [];
        let updated = false;

        achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                switch (achievement.id) {
                    case 'new_player':
                        if (this.user.userData.totalGames >= 1) {
                            achievement.unlocked = true;
                            updated = true;
                        }
                        break;
                    case 'first_win':
                        if (this.user.userData.totalWins >= 1) {
                            achievement.unlocked = true;
                            updated = true;
                        }
                        break;
                    case 'gambler':
                        if (this.user.userData.totalGames >= 10) {
                            achievement.unlocked = true;
                            updated = true;
                        }
                        break;
                    case 'lucky':
                        if (this.user.userData.totalWins >= 5) {
                            achievement.unlocked = true;
                            updated = true;
                        }
                        break;
                    case 'veteran':
                        if (this.user.userData.totalGames >= 50) {
                            achievement.unlocked = true;
                            updated = true;
                        }
                        break;
                    case 'legend':
                        if (this.user.userData.totalWins >= 25) {
                            achievement.unlocked = true;
                            updated = true;
                        }
                        break;
                }
            }
        });

        if (updated) {
            await this.user.saveUserData();
            this.updateAchievementsDisplay();
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.user.userData.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.user.saveUserData();
            this.updateAchievementsDisplay();
            
            // Immediately update the achievements count in profile
            const totalAchievements = this.user.userData.achievements.filter(a => a.unlocked).length;
            document.getElementById('total-achievements').textContent = totalAchievements;
            
            this.showAchievementNotification(achievement);
        }
    }
} 