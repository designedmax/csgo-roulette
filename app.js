// Глобальные переменные
let allSkins = [];
let currentBet = 0;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Загрузка данных пользователя
    loadUserData();

    // Загрузка скинов
    loadSkins();

    // Инициализация страницы
    if (document.getElementById('slider-track')) {
        initRoulettePage();
    }

    // Инициализация профиля
    if (document.getElementById('profile-name')) {
        initProfilePage();
    }

    // Навигация
    setupNavigation();
});

// Загрузка данных пользователя из Telegram
function loadUserData() {
    const tg = window.Telegram.WebApp;
    if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        const avatarElements = document.querySelectorAll('#user-avatar, #profile-avatar');
        const nameElements = document.querySelectorAll('#profile-name');
        
        avatarElements.forEach(el => {
            el.src = user.photo_url || 'assets/default-avatar.jpg';
        });
        
        if (nameElements.length > 0) {
            const userName = user.first_name || 'Игрок';
            nameElements[0].textContent = user.username ? `${userName} (@${user.username})` : userName;
        }
    }
}

// Загрузка скинов из CSGO Backpack API
async function loadSkins() {
    try {
        const response = await fetch('https://csgobackpack.net/api/GetItemsList/v2/');
        const data = await response.json();
        allSkins = Object.values(data.items_list)
            .filter(skin => skin.icon_url && skin.icon_url.includes('steamcdn'))
            .sort(() => 0.5 - Math.random())
            .slice(0, 100); // Берем 100 случайных скинов
    } catch (error) {
        console.error("Ошибка загрузки скинов:", error);
        // Запасные скины
        allSkins = [
            { 
                name: "AK-47 | Красная линия", 
                icon_url: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_asiimov_light_large.091fce6d0a96b8a876f25252d147c537ed72e315.png"
            },
            // ... другие скины
        ];
    }
}

// Инициализация страницы рулетки
function initRoulettePage() {
    const urlParams = new URLSearchParams(window.location.search);
    currentBet = parseInt(document.getElementById('spin-btn')?.dataset.price) || 100;
    
    // Заполняем слайдер
    const sliderTrack = document.getElementById('slider-track');
    if (sliderTrack && allSkins.length > 0) {
        // Берем 20 случайных скинов для демонстрации
        const randomSkins = [...allSkins].sort(() => 0.5 - Math.random()).slice(0, 20);
        
        randomSkins.forEach(skin => {
            const img = document.createElement('img');
            img.src = skin.icon_url;
            img.alt = skin.name;
            img.title = skin.name;
            sliderTrack.appendChild(img);
        });
    }

    // Обработчик кнопки "Крутить"
    document.getElementById('spin-btn')?.addEventListener('click', startSpin);
}

// Анимация вращения рулетки
function startSpin() {
    const spinBtn = document.getElementById('spin-btn');
    const sliderTrack = document.getElementById('slider-track');
    
    if (!spinBtn || !sliderTrack) return;

    spinBtn.disabled = true;
    let spinCount = 0;
    const maxSpin = 50; // Количество прокруток
    const spinSpeed = 50; // Интервал в ms
    
    // Сброс позиции
    sliderTrack.style.transition = 'none';
    sliderTrack.style.transform = 'translateX(0)';
    
    // Запуск анимации
    const spinInterval = setInterval(() => {
        spinCount++;
        const currentTransform = parseInt(sliderTrack.style.transform?.replace('translateX(', '').replace('px)', '') || 0;
        const newTransform = currentTransform - 100;
        sliderTrack.style.transform = `translateX(${newTransform}px)`;
        
        // Завершение анимации
        if (spinCount >= maxSpin) {
            clearInterval(spinInterval);
            setTimeout(() => {
                showResult();
                spinBtn.disabled = false;
            }, 500);
        }
    }, spinSpeed);
}

// Показать результат вращения
function showResult() {
    const winChances = {
        100: 0.4,
        300: 0.3,
        500: 0.25,
        1000: 0.15
    };
    
    const isWin = Math.random() < winChances[currentBet];
    const randomSkin = allSkins[Math.floor(Math.random() * allSkins.length)];
    
    // Сохраняем результат
    saveToHistory(
        isWin ? 'win' : 'lose',
        isWin ? randomSkin.name : 'Ничего',
        isWin ? Math.floor(currentBet * 2) : 0,
        currentBet,
        window.location.pathname.split('/').pop()
    );
    
    // Показываем уведомление
    alert(isWin ? 
        `🎉 Вы выиграли ${randomSkin.name}!` : 
        '😢 Вы проиграли'
    );
}

// Сохранить результат в историю
function saveToHistory(status, skin, prize, bet, section) {
    const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
    history.unshift({
        date: new Date().toLocaleString(),
        status,
        skin,
        prize,
        bet,
        section: section.replace('.html', '')
    });
    localStorage.setItem('csgoRouletteHistory', JSON.stringify(history));
    updateHistoryUI();
}

// Обновить историю на странице
function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
    
    // Обновляем историю на странице рулетки
    const historyList = document.getElementById('history-list');
    if (historyList) {
        const currentPage = window.location.pathname.split('/').pop();
        const filteredHistory = history.filter(item => item.section === currentPage.replace('.html', ''));
        
        historyList.innerHTML = filteredHistory.length > 0 
            ? filteredHistory.map(item => `
                <div class="history-entry ${item.status}">
                    <span>${item.date}</span>
                    <span>${item.status === 'win' ? '🏆 ' + item.skin : '❌ Проигрыш'}</span>
                </div>
            `).join('')
            : '<p>История пуста</p>';
    }
    
    // Обновляем полную историю в профиле
    const fullHistoryList = document.getElementById('full-history-list');
    if (fullHistoryList) {
        fullHistoryList.innerHTML = history.length > 0
            ? history.map(item => `
                <div class="history-entry ${item.status}">
                    <span>${item.date}</span>
                    <span>${item.section}₽</span>
                    <span>${item.status === 'win' ? '🏆 ' + item.skin : '❌ Проигрыш'}</span>
                </div>
            `).join('')
            : '<p>История пуста</p>';
    }
    
    // Обновляем статистику в профиле
    const winsCount = document.getElementById('wins-count');
    const losesCount = document.getElementById('loses-count');
    if (winsCount && losesCount) {
        winsCount.textContent = history.filter(item => item.status === 'win').length;
        losesCount.textContent = history.filter(item => item.status === 'lose').length;
    }
}

// Инициализация страницы профиля
function initProfilePage() {
    updateHistoryUI();
}

// Настройка навигации
function setupNavigation() {
    // Кнопка "Профиль"
    document.getElementById('profile-btn')?.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
    
    // Кнопка "Назад" в профиле
    document.getElementById('back-btn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
