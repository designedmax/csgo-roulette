import { CONFIG } from './config.js';

class Achievements {
    constructor(user) {
        this.user = user;
        this.achievementsList = document.getElementById('achievements-list');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for user data updates
        this.user.onDataUpdate = () => this.updateAchievements();
    }

    updateAchievements() {
        this.achievementsList.innerHTML = '';
        
        CONFIG.ACHIEVEMENTS.forEach(achievement => {
            const isUnlocked = this.isAchievementUnlocked(achievement);
            const achievementElement = this.createAchievementElement(achievement, isUnlocked);
            this.achievementsList.appendChild(achievementElement);
        });
    }

    isAchievementUnlocked(achievement) {
        return this.user.userData.achievements.includes(achievement.id);
    }

    createAchievementElement(achievement, isUnlocked) {
        const element = document.createElement('div');
        element.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        element.innerHTML = `
            <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
                ${isUnlocked ? `<span class="reward">Награда: ${achievement.reward} ₽</span>` : ''}
            </div>
        `;

        return element;
    }

    async checkAchievements() {
        const unlockedAchievements = [];
        
        CONFIG.ACHIEVEMENTS.forEach(achievement => {
            if (!this.user.userData.achievements.includes(achievement.id) && 
                achievement.condition(this.user.userData)) {
                unlockedAchievements.push(achievement);
            }
        });

        if (unlockedAchievements.length > 0) {
            for (const achievement of unlockedAchievements) {
                this.user.userData.achievements.push(achievement.id);
                this.user.userData.balance += achievement.reward;
            }
            
            await this.user.saveUserData();
            this.updateAchievements();
            this.showUnlockedAchievements(unlockedAchievements);
        }
    }

    showUnlockedAchievements(achievements) {
        achievements.forEach(achievement => {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-notification-content">
                    <span class="achievement-icon">🏆</span>
                    <div class="achievement-notification-info">
                        <h4>Новое достижение!</h4>
                        <p>${achievement.title}</p>
                        <p>Награда: ${achievement.reward} ₽</p>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
        });
    }
}

export { Achievements }; 