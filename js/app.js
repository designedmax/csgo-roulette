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

class App {
    constructor() {
        this.user = new User();
        this.roulette = new Roulette(this.user);
        this.achievements = new Achievements(this.user);
        this.history = new History(this.user);
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Navigation
        document.getElementById('profile-btn').addEventListener('click', () => this.showPage('profile-page'));
        document.getElementById('history-btn').addEventListener('click', () => this.showPage('history-page'));
        document.getElementById('profile-back-btn').addEventListener('click', () => this.showPage('main-page'));
        document.getElementById('history-back-btn').addEventListener('click', () => this.showPage('main-page'));

        // Deposit/Withdraw
        document.getElementById('deposit-btn').addEventListener('click', () => this.showModal('deposit-modal'));
        document.getElementById('withdraw-btn').addEventListener('click', () => this.showModal('withdraw-modal'));
        
        document.getElementById('confirm-deposit').addEventListener('click', () => this.handleDeposit());
        document.getElementById('confirm-withdraw').addEventListener('click', () => this.handleWithdraw());
        
        document.getElementById('cancel-deposit').addEventListener('click', () => this.hideModal('deposit-modal'));
        document.getElementById('cancel-withdraw').addEventListener('click', () => this.hideModal('withdraw-modal'));
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    handleDeposit() {
        const amount = parseInt(document.getElementById('deposit-amount').value);
        if (amount > 0) {
            this.user.addBalance(amount);
            this.hideModal('deposit-modal');
            document.getElementById('deposit-amount').value = '';
        }
    }

    handleWithdraw() {
        const amount = parseInt(document.getElementById('withdraw-amount').value);
        if (amount > 0 && amount <= this.user.getBalance()) {
            this.user.subtractBalance(amount);
            this.hideModal('withdraw-modal');
            document.getElementById('withdraw-amount').value = '';
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

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
            console.log('Profile button clicked');
            document.getElementById('main-page').classList.remove('active');
            document.getElementById('profile-page').classList.add('active');
            user.updateUI();
        });

        document.getElementById('history-btn').addEventListener('click', () => {
            console.log('History button clicked');
            document.getElementById('main-page').classList.remove('active');
            document.getElementById('history-page').classList.add('active');
        });

        document.querySelectorAll('#back-btn').forEach(button => {
            button.addEventListener('click', () => {
                console.log('Back button clicked');
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
                console.log('Bet button clicked:', amount);
                roulette.handleBet(amount);
            });
        });

        // Handle daily bonus
        const dailyBonusBtn = document.getElementById('daily-bonus-btn');
        const bonusTimer = document.getElementById('bonus-timer');
        
        dailyBonusBtn.addEventListener('click', async () => {
            console.log('Daily bonus button clicked');
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