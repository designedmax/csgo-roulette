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
        // Initialize achievements if they don't exist
        if (!this.user.userData.achievements || this.user.userData.achievements.length === 0) {
            this.user.userData.achievements = JSON.parse(JSON.stringify(CONFIG.ACHIEVEMENTS));
            this.user.saveUserData();
        }

        // Ensure all achievements from CONFIG exist in user's achievements
        CONFIG.ACHIEVEMENTS.forEach(configAchievement => {
            const userAchievement = this.user.userData.achievements.find(a => a.id === configAchievement.id);
            if (!userAchievement) {
                this.user.userData.achievements.push({
                    ...configAchievement,
                    unlocked: false
                });
            }
        });

        // Remove any achievements that don't exist in CONFIG
        this.user.userData.achievements = this.user.userData.achievements.filter(achievement => 
            CONFIG.ACHIEVEMENTS.some(configAchievement => configAchievement.id === achievement.id)
        );

        this.user.saveUserData();
    }

    updateAchievementsDisplay() {
        const achievementsList = document.getElementById('achievements-list');
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

        if (updated) {
            this.user.saveUserData();
            this.updateAchievementsDisplay();
        }
    }
} 