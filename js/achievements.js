class Achievements {
    constructor(user) {
        this.user = user;
        this.achievementsList = document.getElementById('achievements-list');
        this.initEventListeners();
        this.initializeAchievements();
        this.updateAchievementsDisplay();
    }

    initEventListeners() {
        // No specific event listeners needed for achievements
    }

    async initializeAchievements() {
        // Get achievements from user data in Firebase
        this.user.userData.achievements = CONFIG.ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            unlocked: this.user.userData.achievements?.find(a => a.id === achievement.id)?.unlocked || false
        }));

        // Save updated achievements to Firebase
        await this.user.saveUserData();
    }

    updateTotalAchievementsCount() {
        const totalAchievements = this.user.userData.achievements.filter(a => a.unlocked).length;
        const totalAchievementsElement = document.getElementById('total-achievements');
        if (totalAchievementsElement) {
            totalAchievementsElement.textContent = totalAchievements;
        }
    }

    updateAchievementsDisplay() {
        if (!this.achievementsList) return;

        this.achievementsList.innerHTML = '';
        const achievements = this.user.userData.achievements;

        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            achievementItem.innerHTML = `
                <div class="achievement-emoji">${achievement.emoji}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;
            
            this.achievementsList.appendChild(achievementItem);
        });

        // Update total achievements count
        this.updateTotalAchievementsCount();
    }

    async checkAndUnlockAchievements() {
        const achievements = this.user.userData.achievements;
        let unlockedNew = false;

        // Check each achievement
        for (const achievement of achievements) {
            if (!achievement.unlocked) {
                let shouldUnlock = false;

                switch (achievement.id) {
                    case 'new_player':
                        shouldUnlock = true;
                        break;
                    case 'first_win':
                        shouldUnlock = this.user.userData.totalWins > 0;
                        break;
                    case 'five_wins':
                        shouldUnlock = this.user.userData.totalWins >= 5;
                        break;
                    case 'ten_wins':
                        shouldUnlock = this.user.userData.totalWins >= 10;
                        break;
                    case 'twenty_wins':
                        shouldUnlock = this.user.userData.totalWins >= 20;
                        break;
                    case 'fifty_wins':
                        shouldUnlock = this.user.userData.totalWins >= 50;
                        break;
                    case 'hundred_wins':
                        shouldUnlock = this.user.userData.totalWins >= 100;
                        break;
                    case 'five_hundred_wins':
                        shouldUnlock = this.user.userData.totalWins >= 500;
                        break;
                    case 'thousand_wins':
                        shouldUnlock = this.user.userData.totalWins >= 1000;
                        break;
                    case 'five_thousand_wins':
                        shouldUnlock = this.user.userData.totalWins >= 5000;
                        break;
                    case 'ten_thousand_wins':
                        shouldUnlock = this.user.userData.totalWins >= 10000;
                        break;
                }

                if (shouldUnlock) {
                    achievement.unlocked = true;
                    unlockedNew = true;
                }
            }
        }

        if (unlockedNew) {
            // Save updated achievements to Firebase
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