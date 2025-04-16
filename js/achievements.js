class Achievements {
    constructor(user) {
        this.user = user;
        this.initEventListeners();
        this.initializeAchievements();
        this.updateAchievementsDisplay();
    }

    initEventListeners() {
        // No specific event listeners needed for achievements
    }

    initializeAchievements() {
        // Get current achievements
        const currentAchievements = this.user.userData.achievements;
        
        // Check all achievements through history
        const betHistory = this.user.userData.betHistory || [];
        const totalGames = this.user.userData.totalGames || 0;
        const totalWins = this.user.userData.totalWins || 0;
        const totalLosses = totalGames - totalWins;
        const balance = this.user.userData.balance || 0;

        // Update achievements based on current state
        this.user.userData.achievements = currentAchievements.map(achievement => {
            const updatedAchievement = { ...achievement };
            
            switch(achievement.id) {
                case 'new_player':
                    updatedAchievement.unlocked = true;
                    break;
                case 'first_win':
                    updatedAchievement.unlocked = totalWins > 0;
                    break;
                case 'lucky':
                    updatedAchievement.unlocked = totalWins >= 10;
                    break;
                case 'pro':
                    updatedAchievement.unlocked = totalWins >= 50;
                    break;
                case 'sheep':
                    updatedAchievement.unlocked = totalLosses >= 10;
                    break;
                case 'loser':
                    updatedAchievement.unlocked = totalLosses >= 30;
                    break;
                case 'rich':
                    updatedAchievement.unlocked = balance >= 5000;
                    break;
                case 'risky':
                    updatedAchievement.unlocked = betHistory.some(bet => bet.amount >= 1000);
                    break;
            }
            
            return updatedAchievement;
        });

        // Save achievements state
        this.user.saveUserData();
        
        // Update display
        this.updateAchievementsDisplay();
        
        // Update total achievements count in profile
        this.updateTotalAchievementsCount();
    }

    updateTotalAchievementsCount() {
        const totalAchievements = this.user.userData.achievements.filter(a => a.unlocked).length;
        const totalAchievementsElement = document.getElementById('total-achievements');
        if (totalAchievementsElement) {
            totalAchievementsElement.textContent = totalAchievements;
        }
    }

    updateAchievementsDisplay() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
        achievementsList.innerHTML = '';
        
        this.user.userData.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            const emoji = this.getAchievementEmoji(achievement.id);
            
            achievementElement.innerHTML = `
                <span class="achievement-emoji">${emoji}</span>
                <div class="achievement-info">
                    <h4 class="achievement-name">${achievement.name}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                </div>
            `;
            
            achievementsList.appendChild(achievementElement);
        });

        // Update total achievements count
        this.updateTotalAchievementsCount();
    }

    getAchievementEmoji(achievementId) {
        const emojiMap = {
            'new_player': '👋',
            'first_win': '🏆',
            'lucky': '🍀',
            'pro': '👑',
            'sheep': '🐑',
            'loser': '😢',
            'big_bet': '💰',
            'rich': '💎'
        };
        return emojiMap[achievementId] || '🎯';
    }

    checkAndUnlockAchievements() {
        const achievements = this.user.userData.achievements;
        let updated = false;

        // New player achievement (unlocked by default)
        if (!achievements.find(a => a.id === 'new_player').unlocked) {
            achievements.find(a => a.id === 'new_player').unlocked = true;
            updated = true;
        }

        // First win achievement
        if (this.user.userData.totalWins > 0 && !achievements.find(a => a.id === 'first_win').unlocked) {
            achievements.find(a => a.id === 'first_win').unlocked = true;
            updated = true;
        }

        // Lucky achievement (10 wins)
        if (this.user.userData.totalWins >= 10 && !achievements.find(a => a.id === 'lucky').unlocked) {
            achievements.find(a => a.id === 'lucky').unlocked = true;
            updated = true;
        }

        // Pro achievement (50 wins)
        if (this.user.userData.totalWins >= 50 && !achievements.find(a => a.id === 'pro').unlocked) {
            achievements.find(a => a.id === 'pro').unlocked = true;
            updated = true;
        }

        // Sheep achievement (10 losses)
        const totalLosses = this.user.userData.totalGames - this.user.userData.totalWins;
        if (totalLosses >= 10 && !achievements.find(a => a.id === 'sheep').unlocked) {
            achievements.find(a => a.id === 'sheep').unlocked = true;
            updated = true;
        }

        // Loser achievement (30 losses)
        if (totalLosses >= 30 && !achievements.find(a => a.id === 'loser').unlocked) {
            achievements.find(a => a.id === 'loser').unlocked = true;
            updated = true;
        }

        // Rich achievement
        if (this.user.userData.balance >= 5000 && !achievements.find(a => a.id === 'rich').unlocked) {
            achievements.find(a => a.id === 'rich').unlocked = true;
            updated = true;
        }

        // Risky achievement (at least one bet of 1000 or more)
        if (this.user.userData.betHistory && this.user.userData.betHistory.some(bet => bet.amount >= 1000) && !achievements.find(a => a.id === 'risky').unlocked) {
            achievements.find(a => a.id === 'risky').unlocked = true;
            updated = true;
        }

        if (updated) {
            this.user.saveUserData();
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