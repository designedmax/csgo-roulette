document.addEventListener('DOMContentLoaded', () => {
    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Initialize user
    const user = new User();

    // Initialize game components
    const roulette = new Roulette(user);
    const achievements = new Achievements(user);
    const history = new History(user);

    // Initialize daily bonus timer
    updateBonusTimer();

    // Set up page navigation
    document.getElementById('profile-btn').addEventListener('click', () => {
        document.getElementById('main-page').classList.remove('active');
        document.getElementById('profile-page').classList.add('active');
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        document.getElementById('profile-page').classList.remove('active');
        document.getElementById('main-page').classList.add('active');
    });

    // Set up daily bonus button
    document.getElementById('daily-bonus-btn').addEventListener('click', () => {
        if (user.canGetDailyBonus()) {
            if (user.getDailyBonus()) {
                alert('Вы получили ежедневный бонус в размере 5000 ₽!');
                updateBonusTimer();
            }
        } else {
            alert('Вы уже получили бонус сегодня. Приходите завтра!');
        }
    });

    // Set up deposit modal
    const depositModal = document.getElementById('deposit-modal');
    const depositAmount = document.getElementById('deposit-amount');
    const confirmDeposit = document.getElementById('confirm-deposit');
    const cancelDeposit = document.getElementById('cancel-deposit');

    document.getElementById('deposit-btn').addEventListener('click', () => {
        depositModal.classList.remove('hidden');
        depositAmount.value = '';
    });

    confirmDeposit.addEventListener('click', () => {
        const amount = parseInt(depositAmount.value);
        if (amount && amount > 0) {
            user.updateBalance(amount);
            depositModal.classList.add('hidden');
            alert(`Баланс пополнен на ${amount} ₽`);
        } else {
            alert('Пожалуйста, введите корректную сумму');
        }
    });

    cancelDeposit.addEventListener('click', () => {
        depositModal.classList.add('hidden');
    });

    // Set up withdraw modal
    const withdrawModal = document.getElementById('withdraw-modal');
    const withdrawAmount = document.getElementById('withdraw-amount');
    const confirmWithdraw = document.getElementById('confirm-withdraw');
    const cancelWithdraw = document.getElementById('cancel-withdraw');

    document.getElementById('withdraw-btn').addEventListener('click', () => {
        withdrawModal.classList.remove('hidden');
        withdrawAmount.value = '';
    });

    confirmWithdraw.addEventListener('click', () => {
        const amount = parseInt(withdrawAmount.value);
        if (amount && amount > 0) {
            if (amount <= user.userData.balance) {
                user.updateBalance(-amount);
                withdrawModal.classList.add('hidden');
                alert(`Выведено ${amount} ₽`);
            } else {
                alert('Недостаточно средств на балансе');
            }
        } else {
            alert('Пожалуйста, введите корректную сумму');
        }
    });

    cancelWithdraw.addEventListener('click', () => {
        withdrawModal.classList.add('hidden');
    });

    // Function to update bonus timer
    function updateBonusTimer() {
        const bonusTimer = document.getElementById('bonus-timer');
        const lastBonusTime = user.userData.lastBonusTime;
        const now = Date.now();
        const timeLeft = CONFIG.BONUS_COOLDOWN - (now - lastBonusTime);

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            bonusTimer.textContent = `Следующий бонус через: ${hours}ч ${minutes}м`;
        } else {
            bonusTimer.textContent = 'Бонус доступен!';
        }
    }

    // Update bonus timer every minute
    setInterval(updateBonusTimer, 60000);

    // Unlock new player achievement
    achievements.checkAndUnlockAchievements();
}); 