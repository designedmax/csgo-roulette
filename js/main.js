import { database } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Firebase
    try {
        const connectedRef = database.ref('.info/connected');
        connectedRef.on('value', (snap) => {
            if (snap.val() === false) {
                console.error('Firebase connection failed');
            } else {
                console.log('Firebase connected successfully');
            }
        });
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }

    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Initialize user
    const user = new User();
    await user.initUser();

    // Initialize game components
    const roulette = new Roulette(user);
    const achievements = new Achievements(user);
    const history = new History(user);

    // Initialize achievements
    await achievements.initializeAchievements();
    achievements.updateAchievementsDisplay();

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
    document.getElementById('daily-bonus-btn').addEventListener('click', async () => {
        if (await user.canGetDailyBonus()) {
            if (await user.getDailyBonus()) {
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

    confirmDeposit.addEventListener('click', async () => {
        const amount = parseInt(depositAmount.value);
        if (amount && amount > 0) {
            await user.updateBalance(amount);
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

    confirmWithdraw.addEventListener('click', async () => {
        const amount = parseInt(withdrawAmount.value);
        if (amount && amount > 0) {
            if (amount <= user.userData.balance) {
                await user.updateBalance(-amount);
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
    await achievements.checkAndUnlockAchievements();

    // View all users data
    try {
        const snapshot = await database.ref('users').once('value');
        const data = snapshot.val();
        console.log('Users data:', data);
        
        if (!data) {
            console.log('No data found in database');
        } else {
            console.log('Found users:', Object.keys(data).length);
            Object.entries(data).forEach(([userId, userData]) => {
                console.log(`User ${userId}:`, userData);
            });
        }
    } catch (error) {
        console.error('Error fetching users data:', error);
    }
}); 