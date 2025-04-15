// Управление рулеткой
import { updateBalance } from './balance.js';
import { saveToHistory } from './history.js';
import { checkAchievement } from './achievements.js';

// Список доступных скинов
const skins = [
    { name: "AK-47 | Красная линия", price: 500 },
    { name: "AWP | Фея", price: 1000 },
    { name: "M4A4 | Крушитель", price: 300 },
    { name: "Нож | Бабочка", price: 5000 },
    { name: "Вилка | В жопу", price: 300 },
    { name: "Фак | Нах", price: 100 },
];

// Функция вращения рулетки
export function spinRoulette(price) {
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
                checkAchievement('first_win');
                if (price >= 500) checkAchievement('big_win', price);
                checkAchievement('winner');
            } else {
                checkAchievement('loser');
            }
            checkAchievement('balance', userBalance);
        }
    }, 100);
}

// Показ результата
export function showResult(isWin, betAmount) {
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