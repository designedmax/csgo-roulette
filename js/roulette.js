class Roulette {
    constructor(user) {
        this.user = user;
        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.addEventListener('click', () => this.handleBet(parseInt(button.dataset.amount)));
        });
    }

    handleBet(amount) {
        if (this.user.userData.balance < amount) {
            alert('Недостаточно средств!');
            return;
        }

        // Disable bet buttons during animation
        this.toggleBetButtons(false);

        // Start animation
        this.startAnimation();

        // Process bet after animation
        setTimeout(() => {
            const result = this.processBet(amount);
            this.showResult(result);
            this.toggleBetButtons(true);
        }, 1000);
    }

    toggleBetButtons(enable) {
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.disabled = !enable;
        });
    }

    startAnimation() {
        const resultElement = document.getElementById('roulette-result');
        const animationElement = document.getElementById('result-animation');
        
        resultElement.classList.remove('hidden');
        animationElement.innerHTML = '🎰';
        
        // Smoother spinning animation
        let spins = 0;
        const totalSpins = 8;
        const spinInterval = setInterval(() => {
            spins++;
            animationElement.innerHTML = this.getRandomEmoji();
            
            if (spins >= totalSpins) {
                clearInterval(spinInterval);
            }
        }, 125);
    }

    getRandomEmoji() {
        const emojis = ['🎮', '🔫', '💎', '💰', '🎲', '🎯'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    processBet(amount) {
        // Deduct bet amount from balance immediately
        this.user.userData.balance -= amount;
        this.user.userData.totalGames++;
        
        const isWin = Math.random() < CONFIG.WIN_CHANCE;
        let result;

        if (isWin) {
            const skin = CONFIG.SKINS[Math.floor(Math.random() * CONFIG.SKINS.length)];
            const winAmount = skin.value;
            this.user.userData.balance += winAmount;
            this.user.userData.totalWins++;
            result = {
                win: true,
                amount: winAmount,
                skin: skin.name,
                betAmount: amount
            };
        } else {
            // For loss, we already deducted the bet amount at the start
            result = {
                win: false,
                amount: -amount, // Negative amount to indicate loss
                betAmount: amount
            };
        }

        // Add to history
        this.user.addBetToHistory({
            ...result,
            timestamp: new Date().toISOString()
        });

        // Update achievements
        this.checkAchievements(result);

        // Save user data
        this.user.saveUserData();

        return result;
    }

    showResult(result) {
        const resultText = document.getElementById('result-text');
        
        if (result.win) {
            resultText.innerHTML = `🎉 Поздравляем! Вы выиграли ${result.skin} (${result.amount} ₽)`;
            resultText.className = 'win';
        } else {
            resultText.innerHTML = `😢 К сожалению, вы проиграли ${result.betAmount} ₽`;
            resultText.className = 'lose';
        }
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
        if (result.amount >= 1000 && !achievements.find(a => a.id === 'big_bet').unlocked) {
            achievements.find(a => a.id === 'big_bet').unlocked = true;
        }

        // Rich achievement
        if (this.user.userData.balance >= 5000 && !achievements.find(a => a.id === 'rich').unlocked) {
            achievements.find(a => a.id === 'rich').unlocked = true;
        }

        this.user.saveUserData();
    }
} 