import { CONFIG } from './config.js';

class Roulette {
    constructor(user) {
        this.user = user;
        this.resultElement = document.getElementById('roulette-result');
        this.resultText = document.getElementById('result-text');
        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.dataset.amount);
                this.handleBet(amount);
            });
        });
    }

    async handleBet(amount) {
        if (amount > this.user.userData.balance) {
            alert('Недостаточно средств!');
            return;
        }

        // Deduct bet amount
        this.user.userData.balance -= amount;
        await this.user.saveUserData();
        this.user.updateUI();

        // Show loading state
        this.resultElement.classList.remove('hidden');
        this.resultText.textContent = 'Крутим...';

        // Simulate delay
        setTimeout(async () => {
            await this.processBet(amount);
        }, 2000);
    }

    async processBet(amount) {
        const win = Math.random() < 0.4; // 40% chance to win
        const result = win ? 'win' : 'lose';
        const winAmount = win ? amount * 2 : 0;

        // Update user data
        this.user.userData.totalGames++;
        if (win) {
            this.user.userData.totalWins++;
            this.user.userData.balance += winAmount;
        } else {
            this.user.userData.totalLosses++;
        }

        // Add to history
        await this.user.addBetToHistory({
            amount,
            result,
            winAmount,
            timestamp: new Date().toISOString()
        });

        // Save updated data
        await this.user.saveUserData();
        this.user.updateUI();

        // Show result
        this.showResult(result, amount, winAmount);
    }

    showResult(result, amount, winAmount) {
        this.resultText.innerHTML = result === 'win' 
            ? `Поздравляем! Вы выиграли ${winAmount} ₽`
            : `К сожалению, вы проиграли ${amount} ₽`;
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