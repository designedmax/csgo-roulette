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

    // Set up deposit and withdraw buttons
    document.getElementById('deposit-btn').addEventListener('click', () => {
        alert('Функция пополнения баланса будет доступна в ближайшее время!');
    });

    document.getElementById('withdraw-btn').addEventListener('click', () => {
        alert('Функция вывода средств будет доступна в ближайшее время!');
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