// Управление балансом пользователя
let userBalance = parseInt(localStorage.getItem('userBalance')) || 1000;
let lastBonusDate = localStorage.getItem('lastBonusDate') || null;

// Инициализация баланса
export function initBalance() {
    document.getElementById('balance').textContent = userBalance;
}

// Обновление баланса
export function updateBalance(amount) {
    userBalance += amount;
    localStorage.setItem('userBalance', userBalance);
    document.getElementById('balance').textContent = userBalance;
    return userBalance;
}

// Получение ежедневного бонуса
export function claimDailyBonus() {
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

// Экспорт текущего баланса
export function getCurrentBalance() {
    return userBalance;
}