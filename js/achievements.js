class Achievements {
    constructor(user) {
        this.user = user;
        this.initEventListeners();
        this.updateAchievementsDisplay();
    }

    initEventListeners() {
        // No specific event listeners needed for achievements
    }

    updateAchievementsDisplay() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';

        // Ensure achievements are properly initialized
        if (!this.user.userData.achievements || this.user.userData.achievements.length === 0) {
            this.user.userData.achievements = CONFIG.ACHIEVEMENTS;
            this.user.saveUserData();
        }

        this.user.userData.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? '' : 'locked'}`;
            
            const emoji = this.getAchievementEmoji(achievement.id);
            const status = achievement.unlocked ? '✅' : '🔒';
            
            achievementElement.innerHTML = `
                <span class="achievement-emoji">${emoji}</span>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
                <span class="achievement-status">${status}</span>
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

        // Ensure achievements array exists and has all required achievements
        if (!achievements || achievements.length === 0) {
            this.user.userData.achievements = CONFIG.ACHIEVEMENTS;
            updated = true;
        }

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