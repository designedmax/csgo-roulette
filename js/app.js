import { CONFIG } from './config.js';
import { User } from './user.js';
import { Roulette } from './roulette.js';
import { Achievements } from './achievements.js';
import { History } from './history.js';
import { database } from './firebase.js';

// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
console.log('Telegram WebApp:', tg);

if (!tg) {
    console.error('Telegram WebApp not found');
    alert('Ошибка: Telegram WebApp не найден');
} else {
    tg.ready();
    tg.expand();
    console.log('Telegram WebApp initialized');
}

// Log Telegram data
console.log('Telegram init data:', tg.initDataUnsafe);
console.log('Telegram user:', tg.initDataUnsafe?.user);

// Initialize application
async function initApp() {
    try {
        console.log('Starting application initialization...');
        
        if (!tg.initDataUnsafe?.user) {
            throw new Error('No user data from Telegram');
        }
        
        // Initialize user first
        const user = new User();
        await user.initUser();
        
        // Initialize other components
        const roulette = new Roulette(user);
        const achievements = new Achievements(user);
        const history = new History(user);

        // Initialize event listeners
        document.getElementById('profile-btn').addEventListener('click', () => {
            document.getElementById('main-page').classList.remove('active');
            document.getElementById('profile-page').classList.add('active');
            user.updateUI();
        });

        document.getElementById('history-btn').addEventListener('click', () => {
            document.getElementById('main-page').classList.remove('active');
            document.getElementById('history-page').classList.add('active');
        });

        document.querySelectorAll('#back-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById('main-page').classList.add('active');
            });
        });

        // Handle bet buttons
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.dataset.amount);
                roulette.handleBet(amount);
            });
        });

        // Handle daily bonus
        const dailyBonusBtn = document.getElementById('daily-bonus-btn');
        const bonusTimer = document.getElementById('bonus-timer');
        
        dailyBonusBtn.addEventListener('click', async () => {
            if (await user.canGetDailyBonus()) {
                await user.getDailyBonus();
                alert('Бонус получен!');
                updateBonusTimer();
            } else {
                alert('Бонус уже получен сегодня. Приходите завтра!');
            }
        });

        // Update bonus timer
        function updateBonusTimer() {
            const now = Date.now();
            const lastBonusTime = user.userData.lastBonusTime;
            const timeLeft = 24 * 60 * 60 * 1000 - (now - lastBonusTime);
            
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                bonusTimer.textContent = `Следующий бонус через: ${hours}ч ${minutes}м`;
            } else {
                bonusTimer.textContent = 'Бонус доступен!';
            }
        }

        // Update timer every minute
        setInterval(updateBonusTimer, 60000);
        updateBonusTimer();

        // Handle deposit/withdraw buttons
        document.getElementById('deposit-btn').addEventListener('click', () => {
            document.getElementById('deposit-modal').classList.remove('hidden');
        });

        document.getElementById('withdraw-btn').addEventListener('click', () => {
            document.getElementById('withdraw-modal').classList.remove('hidden');
        });

        // Handle modal buttons
        document.getElementById('confirm-deposit').addEventListener('click', async () => {
            const amount = parseInt(document.getElementById('deposit-amount').value);
            if (amount > 0) {
                await user.updateBalance(amount);
                document.getElementById('deposit-modal').classList.add('hidden');
            }
        });

        document.getElementById('confirm-withdraw').addEventListener('click', async () => {
            const amount = parseInt(document.getElementById('withdraw-amount').value);
            if (amount > 0 && amount <= user.userData.balance) {
                await user.updateBalance(-amount);
                document.getElementById('withdraw-modal').classList.add('hidden');
            }
        });

        // Close modals
        document.getElementById('cancel-deposit').addEventListener('click', () => {
            document.getElementById('deposit-modal').classList.add('hidden');
        });

        document.getElementById('cancel-withdraw').addEventListener('click', () => {
            document.getElementById('withdraw-modal').classList.add('hidden');
        });

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Произошла ошибка при инициализации приложения: ' + error.message);
    }
}

// Start application
initApp().catch(error => {
    console.error('Fatal error during initialization:', error);
    alert('Критическая ошибка: ' + error.message);
}); 