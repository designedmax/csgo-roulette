// Инициализация Telegram Web App
window.Telegram.WebApp.onEvent('ready', function() {
  // Получаем данные о пользователе
  const user = window.Telegram.WebApp.initDataUnsafe;

  if (user && user.first_name) {
    const userName = user.first_name;
    document.getElementById("greeting").innerText = `Привет, ${userName}!`;
  } else {
    document.getElementById("greeting").innerText = "Привет, Игрок!";
  }
});

// Логика рулетки
const rouletteButtons = document.querySelectorAll('.roulette-btn');
const resultDiv = document.getElementById('result');

rouletteButtons.forEach(button => {
  button.addEventListener('click', function() {
    const betAmount = this.innerText; // Получаем ставку
    spinRoulette(betAmount);
  });
});

function spinRoulette(betAmount) {
  // Генерация случайного числа для шанса выпадения скина
  const chance = Math.random();

  // Проверка шанса: 40% шанс на скин
  if (chance <= 0.4) {
    // Скин выпал
    resultDiv.innerHTML = `Вы выиграли скин за ${betAmount}!`;
  } else {
    // Скин не выпал
    resultDiv.innerHTML = `Увы, в этот раз не повезло. Попробуйте снова!`;
  }
}
