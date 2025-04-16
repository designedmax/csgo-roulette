import { CONFIG } from './config.js';

class Roulette {
    constructor(user) {
        this.user = user;
        this.resultElement = document.getElementById('result');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.dataset.amount);
                this.handleBet(amount);
            });
        });
    }

    async handleBet(amount) {
        if (amount > this.user.userData.balance) {
            this.showResult('Недостаточно средств', false);
            return;
        }

        // Disable buttons during bet processing
        this.setButtonsState(false);
        this.showResult('Ставка обрабатывается...', null);

        try {
            const won = await this.processBet(amount);
            this.showResult(won ? `Вы выиграли ${amount * 2} ₽!` : 'Вы проиграли', won);
        } catch (error) {
            console.error('Error processing bet:', error);
            this.showResult('Произошла ошибка', false);
        } finally {
            this.setButtonsState(true);
        }
    }

    async processBet(amount) {
        const won = Math.random() < CONFIG.GAME.WIN_CHANCE;
        
        // Update user data
        this.user.userData.totalGames++;
        if (won) {
            this.user.userData.totalWins++;
            this.user.userData.balance += amount;
        } else {
            this.user.userData.totalLosses++;
            this.user.userData.balance -= amount;
        }

        // Add to history
        await this.user.addBetToHistory({
            amount,
            won,
            timestamp: Date.now()
        });

        // Save updated data
        await this.user.saveUserData();

        return won;
    }

    showResult(message, won) {
        this.resultElement.textContent = message;
        this.resultElement.className = 'result';
        if (won !== null) {
            this.resultElement.classList.add(won ? 'win' : 'lose');
        }
    }

    setButtonsState(enabled) {
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.disabled = !enabled;
        });
    }

    checkAchievements(result) {
        const achievements = this.user.userData.achievements;

        // First win achievement
        if (result.win && !achievements.find(a => a.id === 'first_win').unlocked) {
            achievements.find(a => a.id === 'first_win').unlocked = true;
        }

        // Lucky achievement (10 wins)
        if (this.user.userData.totalWins >= 10 && !achievements.find(a => a.id === 'lucky').unlocked) {
            achievements.find(a => a.id === 'lucky').unlocked = true;
        }

        // Pro achievement (50 wins)
        if (this.user.userData.totalWins >= 50 && !achievements.find(a => a.id === 'pro').unlocked) {
            achievements.find(a => a.id === 'pro').unlocked = true;
        }

        // Sheep achievement (10 losses)
        const totalLosses = this.user.userData.totalGames - this.user.userData.totalWins;
        if (totalLosses >= 10 && !achievements.find(a => a.id === 'sheep').unlocked) {
            achievements.find(a => a.id === 'sheep').unlocked = true;
        }

        // Loser achievement (30 losses)
        if (totalLosses >= 30 && !achievements.find(a => a.id === 'loser').unlocked) {
            achievements.find(a => a.id === 'loser').unlocked = true;
        }

        // Big bet achievement
        if (amount >= 1000 && !achievements.find(a => a.id === 'big_bet').unlocked) {
            achievements.find(a => a.id === 'big_bet').unlocked = true;
        }

        // Rich achievement
        if (this.user.userData.balance >= 5000 && !achievements.find(a => a.id === 'rich').unlocked) {
            achievements.find(a => a.id === 'rich').unlocked = true;
        }

        this.user.saveUserData();
    }
}

export { Roulette }; 