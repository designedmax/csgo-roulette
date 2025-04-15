let tg = window.Telegram.WebApp;
if (!tg) {
    tg = { expand: () => {}, showPopup: () => {}, initDataUnsafe: { user: {} } };
}

// Инициализация пользователя
const initUser = () => {
    const user = tg.initDataUnsafe.user || {};
    const userName = user.first_name || "Игрок";
    const userAvatar = user?.photo_url || "https://via.placeholder.com/50";
    
    const usernameElements = document.querySelectorAll('#username');
    const avatarElements = document.querySelectorAll('#user-avatar');
    
    usernameElements.forEach(el => el.textContent = userName);
    avatarElements.forEach(el => el.src = userAvatar);
};

document.addEventListener('DOMContentLoaded', initUser);
let userBalance = parseInt(localStorage.getItem('userBalance')) || 1000;
document.getElementById('balance').textContent = userBalance;
let achievements = ['new_player'];
let registrationDate = localStorage.getItem('registrationDate') || new Date().toISOString();
if (!localStorage.getItem('registrationDate')) {
    localStorage.setItem('registrationDate', registrationDate);
}
if (localStorage.getItem('achievements')) {
    const storedAchievements = JSON.parse(localStorage.getItem('achievements'));
    if (!storedAchievements.includes('new_player')) {
        storedAchievements.unshift('new_player');
    } else {
        storedAchievements = storedAchievements.filter(a => a !== 'new_player').concat('new_player');
    }
    achievements = storedAchievements;
}
let winCount = parseInt(localStorage.getItem('winCount')) || 0;
let loseCount = parseInt(localStorage.getItem('loseCount')) || 0;
let lastBonusDate = localStorage.getItem('lastBonusDate') || null;

tg.expand();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user || {};
let userName = user.first_name || "Игрок";

// Устанавливаем имя и аватар при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const user = tg.initDataUnsafe.user || {};
    const userName = user.first_name || "Игрок";
    document.getElementById('username').textContent = userName;
    document.getElementById('user-avatar').src = user?.photo_url || "https://via.placeholder.com/50";
});

// Отображаем имя и аватар
document.getElementById("username").textContent = userName;
document.getElementById("user-avatar").src = user?.photo_url || "https://via.placeholder.com/50";

// Загрузка скинов (заглушка)
const skins = [
    { name: "AK-47 | Красная линия", price: 500 },
    { name: "AWP | Фея", price: 1000 },
    { name: "M4A4 | Крушитель", price: 300 },
    { name: "Нож | Бабочка", price: 5000 },
    { name: "Вилка | В жопу", price: 300 },
    { name: "Фак | Нах", price: 100 },
];

// Крутим рулетку
// Инициализация функций баланса
function updateBalance(amount) {
    userBalance += amount;
    localStorage.setItem('userBalance', userBalance);
    document.getElementById('balance').textContent = userBalance;
}

const achievementsList = {
        'first_win': { title: 'Первая победа', description: 'Одержать первую победу', condition: 1 },
        'big_win': { title: 'Крупный выигрыш', description: 'Выиграть от 1000₽ за раз', condition: 1000 },
        'balance': { title: 'Богач', description: 'Накопить 5000₽ на балансе', condition: 5000 },
        'new_player': { title: 'Новый игрок', description: 'Начать играть', condition: 0 },
        'winner': { title: 'Победитель', description: '10 побед', condition: 10 },
        'loser': { title: 'Лошок', description: '30 проигрышей', condition: 30 }
    };

function checkAchievement(type, value) {
    if (!achievements.includes(type)) {
        if (type === 'winner') {
            const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
            const totalWins = history.filter(entry => entry.status === 'win').length;
            if (type === 'first_win' ? history.some(h => h.result === 'win') : totalWins >= achievementsList[type].condition) {
                achievements.push(type);
                localStorage.setItem('achievements', JSON.stringify(achievements));
                updateAchievementsUI();
            }
        } else if ((type === 'balance' && userBalance >= value) ||
            (type === 'big_win' && value >= achievementsList[type].condition)) {
            achievements.push(type);
            localStorage.setItem('achievements', JSON.stringify(achievements));
            updateAchievementsUI();
        }
    }

    if (!achievements.includes(type)) {
        if (type === 'winner') {
            const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
            const totalWins = history.filter(entry => entry.status === 'win').length;
            if (type === 'first_win' ? history.some(h => h.result === 'win') : totalWins >= achievementsList[type].condition) {
                achievements.push(type);
                localStorage.setItem('achievements', JSON.stringify(achievements));
                updateAchievementsUI();
            }
        } else if ((type === 'balance' && userBalance >= value) ||
            (type === 'big_win' && value >= achievementsList[type].condition)) {
            achievements.push(type);
            localStorage.setItem('achievements', JSON.stringify(achievements));
            updateAchievementsUI();
        }
    }
}

function claimDailyBonus() {
    const today = new Date().toDateString();
    if (lastBonusDate !== today) {
        updateBalance(5000);
        lastBonusDate = today;
        localStorage.setItem('lastBonusDate', lastBonusDate);
        alert('Получен ежедневный бонус: 5000 ₽!');
    } else {
        alert('Вы уже получили сегодняшний бонус!');
    }
}

function spinRoulette(price) {
    if (userBalance < price) {
        alert('Недостаточно средств!');
        return;
    }

    updateBalance(-price);
    const winChance = 0.4;
    const isWin = Math.random() < winChance;
    const resultElement = document.getElementById("skin-result");
    const resultContainer = document.getElementById("result");
    const rouletteButtons = document.querySelectorAll(".roulette-btn");

    rouletteButtons.forEach(btn => btn.disabled = true);
    resultElement.innerHTML = `<div class="spinner">🎮</div>`;
    resultContainer.classList.remove("hidden");

    let spinTime = 0;
    const spinInterval = setInterval(() => {
        spinTime += 100;
        const emojis = ["🔫", "💣", "🔪", "💰", "🎯"];
        resultElement.innerHTML = `<div class="spinner">${emojis[Math.floor(Math.random() * emojis.length)]}</div>`;

        if (spinTime >= 1000) {
            clearInterval(spinInterval);
            showResult(isWin, price);
            rouletteButtons.forEach(btn => btn.disabled = false);
            
            if (isWin) {
                updateBalance(price * 2);
                winCount++;
                localStorage.setItem('winCount', winCount);
                checkAchievement('first_win');
                if (price >= 500) checkAchievement('big_win', price);
                if (winCount >= 10) checkAchievement('winner');
            } else {
                loseCount++;
                localStorage.setItem('loseCount', loseCount);
                if (loseCount >= 30) checkAchievement('loser');
            }
            checkAchievement('balance', userBalance);
        }
    }, 100);
}

// Показываем результат
function showResult(isWin, betAmount) {
    const resultElement = document.getElementById("skin-result");
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];

    if (isWin) {
        resultElement.innerHTML = `
            <p>🎉 Поздравляем! Вы выиграли:</p>
            <h4>${randomSkin.name}</h4>
            <p>Цена: ${randomSkin.price} ₽</p>
        `;
        saveToHistory("win", randomSkin.name, randomSkin.price, betAmount);
    } else {
        resultElement.innerHTML = "<p>😢 К сожалению, вы ничего не выиграли.</p>";
        saveToHistory("lose", "Ничего", 0, betAmount);
    }
}

// Сохраняем ставку в историю
function saveToHistory(status, skinName, skinPrice, betAmount) {
    const history = JSON.parse(localStorage.getItem("csgoRouletteHistory")) || [];
    const newEntry = {
        date: new Date().toLocaleString(),
        bet: betAmount,
        status: status,
        skin: skinName,
        prize: status === "win" ? skinPrice : 0,
    };
    history.unshift(newEntry);
    localStorage.setItem("csgoRouletteHistory", JSON.stringify(history));
    updateHistoryUI();
}

// Обновляем историю на экране
function clearHistory() {
    localStorage.removeItem("csgoRouletteHistory");
    updateHistoryUI();
}

function updateProfileStats() {
    const totalGames = winCount + loseCount;
    document.getElementById('registration-date').textContent = new Date(registrationDate).toLocaleDateString();
    document.getElementById('total-games').textContent = winCount + loseCount;
    document.getElementById('win-count').textContent = winCount;
    document.getElementById('achievements-count').textContent = achievements.length;
}

function updateHistoryUI() {
    const historyList = document.getElementById("history-list");
    const history = JSON.parse(localStorage.getItem("csgoRouletteHistory")) || [];
    
    historyList.innerHTML = history.length === 0 
        ? "<p>Ставок пока нет.</p>"
        : history.map(entry => `
            <div class="history-entry ${entry.status}">
                <span>${entry.date}</span>
                <span>Ставка: ${entry.bet} ₽</span>
                <span>${entry.status === "win" ? "🏆 " + entry.skin : "❌ Проигрыш"}</span>
            </div>
        `).join("");
    
    updateProfileStats();
}

// Инициализация для страницы профиля
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('registration-date')) {
        const userData = JSON.parse(localStorage.getItem('csgoRouletteUser')) || {};
        document.getElementById('username').textContent = userData.name || 'Игрок';
        document.getElementById('user-avatar').src = userData.avatar || 'default-avatar.jpg';
        updateProfileStats();
        updateHistoryUI();
        updateAchievementsUI();
    }
});

// Функция для навигации на страницу профиля
function navigateToProfile() {
    window.location.href = 'profile.html';
}

// Функция для возврата на главную страницу
function navigateToMain() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем имя пользователя и баланс
    document.getElementById('username').textContent = userName;
    const balanceElement = document.getElementById('balance');
    if (balanceElement) balanceElement.textContent = userBalance;

    // Устанавливаем аватар пользователя
    const avatarElement = document.getElementById('user-avatar');
    if (user && user.photo_url) {
        avatarElement.src = user.photo_url;
    } else {
        avatarElement.src = 'https://via.placeholder.com/60';
    }

    // Обработчик для кнопки профиля
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) profileBtn.addEventListener('click', navigateToProfile);

    // Обработчик для кнопки возврата на главную
    const backBtn = document.getElementById('back-to-main');
    if (backBtn) backBtn.addEventListener('click', navigateToMain);

    // Обработчики для кнопок рулетки
    document.querySelectorAll('.roulette-btn').forEach(button => {
        button.addEventListener('click', () => {
            const price = parseInt(button.dataset.price);
            tg.showPopup({
                title: "Подтверждение ставки",
                message: `Вы уверены, что хотите поставить ${price} ₽?`,
                buttons: [
                    { id: "confirm", type: "ok", text: "Да" },
                    { id: "cancel", type: "cancel", text: "Нет" },
                ],
            }, (buttonId) => {
                if (buttonId === "confirm") spinRoulette(price);
            });
        });
    });

    // Обработчик для кнопки "Крутить снова"
    document.getElementById('spin-again').addEventListener('click', () => {
        document.getElementById('result').classList.add('hidden');
        document.querySelectorAll('.roulette-btn').forEach(btn => btn.disabled = false);
    });

    // Обработчики для кнопок баланса
    document.getElementById('deposit').addEventListener('click', () => {
        const amount = parseInt(prompt('Введите сумму пополнения:'));
        if (amount && amount > 0) {
            updateBalance(amount);
        }
    });

    document.getElementById('withdraw').addEventListener('click', () => {
        const amount = parseInt(prompt('Введите сумму вывода:'));
        if (amount && amount > 0 && amount <= userBalance) {
            updateBalance(-amount);
        } else {
            alert('Недостаточно средств или некорректная сумма!');
        }
    });

    // Обработчик для ежедневного бонуса
    document.getElementById('claim-bonus').addEventListener('click', claimDailyBonus);

    // Загружаем историю и обновляем достижения
    updateHistoryUI();
    updateAchievementsUI();

    // Обработчик для кнопки очистки истории
    document.getElementById('clear-history').addEventListener('click', () => {
        tg.showPopup({
            title: "Подтверждение",
            message: "Вы уверены, что хотите очистить всю историю ставок?",
            buttons: [
                { id: "confirm", type: "destructive", text: "Да, очистить" },
                { id: "cancel", type: "cancel", text: "Отмена" },
            ],
        }, (buttonId) => {
            if (buttonId === "confirm") clearHistory();
        });
    });
});

function updateAchievementsUI() {
    const achievementsContainer = document.getElementById('achievements-list');
    const savedAchievements = JSON.parse(localStorage.getItem('achievements')) || [];
    
    achievementsList.innerHTML = savedAchievements.length === 0 
        ? "<p>Достижений пока нет.</p>"
        : savedAchievements.map(ach => {
            const achievementData = achievementsList[ach] || { title: ach, condition: 0 };
            return `
                <div class="achievement-item">
                    <h4>${achievementData.title}</h4>
                    <p>Условие: ${achievementData.condition}</p>
                </div>`;
        }).join('');
}
