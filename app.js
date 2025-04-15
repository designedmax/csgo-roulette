let tg = window.Telegram.WebApp;
let userBalance = parseInt(localStorage.getItem('userBalance')) || 1000;
let achievements = ['new_player'];
let registrationDate = localStorage.getItem('registrationDate') || new Date().toISOString();
if (!localStorage.getItem('registrationDate')) {
    localStorage.setItem('registrationDate', registrationDate);
}
if (localStorage.getItem('achievements')) {
    const storedAchievements = JSON.parse(localStorage.getItem('achievements'));
    if (!storedAchievements.includes('new_player')) {
        storedAchievements.push('new_player');
    }
    achievements = storedAchievements;
}
let winCount = parseInt(localStorage.getItem('winCount')) || 0;
let loseCount = parseInt(localStorage.getItem('loseCount')) || 0;
let lastBonusDate = localStorage.getItem('lastBonusDate') || null;

tg.expand();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
let userName = "Игрок";

if (user) {
    if (user.first_name) userName = user.first_name;
}

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

function checkAchievement(type, value) {
    const achievementsList = {
        'first_win': { title: 'Первая победа', condition: 1 },
        'big_win': { title: 'Крупный выигрыш', condition: 1000 },
        'balance': { title: 'Богач', condition: 5000 },
        'new_player': { title: 'Новый игрок', condition: 0 },
        'winner': { title: 'Победитель', condition: 10 },
        'loser': { title: 'Лошок', condition: 30 }
    };

    if (!achievements.includes(type)) {
        if (type === 'winner') {
            const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
            const totalWins = history.filter(entry => entry.status === 'win').length;
            if (totalWins >= achievementsList[type].condition) {
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

        if (spinTime >= 3000) {
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
    const winRate = totalGames > 0 ? Math.round((winCount / totalGames) * 100) : 0;
    
    document.getElementById('registration-date').textContent = new Date(registrationDate).toLocaleDateString();
    document.getElementById('total-games').textContent = totalGames;
    document.getElementById('win-rate').textContent = `${winRate}%`;
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

// Инициализация после загрузки страницы
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
    const achievementsList = document.getElementById('achievements-list');
    const allAchievements = [
        { id: 'new_player', title: 'Новый игрок', description: 'Добро пожаловать в игру!' },
        { id: 'first_win', title: 'Первая победа', description: 'Выиграйте свой первый скин' },
        { id: 'big_win', title: 'Крупный выигрыш', description: 'Выиграйте ставку от 1000₽' },
        { id: 'balance', title: 'Богач', description: 'Накопите 5000₽ на балансе' },
        { id: 'winner', title: 'Победитель', description: 'Выиграйте 10 раз' },
        { id: 'loser', title: 'Лошок', description: 'Проиграйте 30 раз' }
    ];

    achievementsList.innerHTML = allAchievements.map(ach => `
        <div class="achievement-item ${achievements.includes(ach.id) ? 'unlocked' : ''}">
            <h4>${ach.title}</h4>
            <p>${ach.description}</p>
        </div>
    `).join('');
}
