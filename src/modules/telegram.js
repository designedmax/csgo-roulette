// Управление Telegram и профилем пользователя
let tg = window.Telegram.WebApp;
let registrationDate = localStorage.getItem('registrationDate') || new Date().toISOString();

// Инициализация Telegram
export function initTelegram() {
    tg.expand();
    if (!localStorage.getItem('registrationDate')) {
        localStorage.setItem('registrationDate', registrationDate);
    }
}

// Обновление информации пользователя
export function updateUserInfo() {
    const user = tg.initDataUnsafe.user;
    let userName = "Игрок";

    if (user && user.first_name) {
        userName = user.first_name;
    }

    document.getElementById("username").textContent = userName;
    document.getElementById("user-avatar").src = user?.photo_url || "https://via.placeholder.com/50";
}

// Обновление статистики профиля
export function updateProfileStats() {
    const { winCount, loseCount } = getStats();
    const totalGames = winCount + loseCount;
    const winRate = totalGames > 0 ? Math.round((winCount / totalGames) * 100) : 0;
    
    document.getElementById('registration-date').textContent = new Date(registrationDate).toLocaleDateString();
    document.getElementById('total-games').textContent = totalGames;
    document.getElementById('win-rate').textContent = `${winRate}%`;
}

// Навигация на страницу профиля
export function navigateToProfile() {
    window.location.href = 'profile.html';
}