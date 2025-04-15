import { WebApp } from '@twa-dev/sdk';
import axios from 'axios';

// Инициализация Telegram WebApp
const tg = WebApp;
tg.ready();

// Получение данных пользователя
const user = tg.initDataUnsafe?.user;
const userAvatar = document.getElementById('userAvatar');
const userGreeting = document.getElementById('userGreeting');
const userBalance = document.getElementById('userBalance');

// Установка данных пользователя
if (user) {
    userAvatar.src = user.photo_url || 'https://telegram.org/img/t_logo.png';
    userGreeting.textContent = `Привет, ${user.first_name}!`;
}

// Инициализация модального окна рулетки
const modal = document.getElementById('rouletteModal');
const rouletteItems = document.querySelector('.roulette-items');
const resultMessage = document.querySelector('.result-message');

// Получение скинов из API CS:GO Market
async function getSkins() {
    try {
        const response = await axios.get('https://market.csgo.com/ru/api/content/start');
        return response.data.items || [];
    } catch (error) {
        console.error('Ошибка при получении скинов:', error);
        return [];
    }
}

// Функция для создания элементов рулетки
function createRouletteItems(skins) {
    rouletteItems.innerHTML = '';
    const items = [];
    
    for (let i = 0; i < 20; i++) {
        const skin = skins[Math.floor(Math.random() * skins.length)];
        const div = document.createElement('div');
        div.className = 'roulette-item';
        div.innerHTML = `
            <img src="${skin.image}" alt="${skin.name}">
            <div>${skin.name}</div>
        `;
        items.push(div);
        rouletteItems.appendChild(div);
    }
    
    return items;
}

// Функция запуска рулетки
async function spinRoulette(price) {
    const skins = await getSkins();
    if (!skins.length) {
        alert('Не удалось загрузить скины');
        return;
    }

    const items = createRouletteItems(skins);
    modal.style.display = 'block';

    // Определение выигрыша (40% шанс)
    const isWin = Math.random() < 0.4;
    const winIndex = isWin ? Math.floor(Math.random() * items.length) : -1;

    // Анимация вращения
    setTimeout(() => {
        const offset = isWin ? 
            -(winIndex * 160 + 80) + (modal.offsetWidth / 2) :
            -(items.length * 160);

        rouletteItems.style.transform = `translateX(${offset}px)`;

        // Показ результата
        setTimeout(() => {
            resultMessage.textContent = isWin ?
                `Поздравляем! Вы выиграли ${items[winIndex].querySelector('div').textContent}!` :
                'К сожалению, в этот раз не повезло. Попробуйте еще раз!';
        }, 5000);
    }, 100);
}

// Обработчики кнопок
document.querySelectorAll('.spin-button').forEach(button => {
    button.addEventListener('click', () => {
        const price = button.parentElement.dataset.price;
        spinRoulette(parseInt(price));
    });
});

// Закрытие модального окна по клику вне контента
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        rouletteItems.style.transform = 'translateX(0)';
        resultMessage.textContent = '';
    }
});