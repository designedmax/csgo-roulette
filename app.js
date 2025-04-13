// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
let userName = "Игрок"; // Значение по умолчанию

if (user) {
    if (user.first_name) userName = user.first_name;
    if (user.username) userName += ` (@${user.username})`;
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
function spinRoulette(price) {
    const winChance = 0.4; // 40% шанс
    const isWin = Math.random() < winChance;
    const resultElement = document.getElementById("skin-result");
    const resultContainer = document.getElementById("result");
    const rouletteButtons = document.querySelectorAll(".roulette-btn");

    // Блокируем кнопки на время анимации
    rouletteButtons.forEach(btn => btn.disabled = true);

    // Анимация вращения
    resultElement.innerHTML = `<div class="spinner">🎮</div>`;
    resultContainer.classList.remove("hidden");

    // Имитация вращения (3 секунды)
    let spinTime = 0;
    const spinInterval = setInterval(() => {
        spinTime += 100;
        const emojis = ["🔫", "💣", "🔪", "💰", "🎯"];
        resultElement.innerHTML = `<div class="spinner">${emojis[Math.floor(Math.random() * emojis.length)]}</div>`;

        if (spinTime >= 3000) {
            clearInterval(spinInterval);
            showResult(isWin, price);
            rouletteButtons.forEach(btn => btn.disabled = false);
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
}

// Обработчики кнопок
document.querySelectorAll(".roulette-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const price = parseInt(btn.dataset.price);
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

// Кнопка "Крутить снова"
document.getElementById("spin-again").addEventListener("click", () => {
    document.getElementById("result").classList.add("hidden");
});

// Загружаем историю при старте
updateHistoryUI();
