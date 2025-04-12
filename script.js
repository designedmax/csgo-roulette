// Функция для получения имени пользователя
function getUserName() {
  // Проверка, доступен ли Telegram WebApp и данные о пользователе
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    const user = window.Telegram.WebApp.initDataUnsafe;
    return user && user.user && user.user.first_name ? user.user.first_name : "Игрок";
  }
  return "Игрок";  // если нет доступа к данным
}

// Функция для запуска рулетки
function playRoulette(amount) {
  const chance = Math.random();  // генерируем случайное число от 0 до 1
  const winChance = 0.4;  // шанс на победу 40%

  const resultText = (chance < winChance) 
    ? `Поздравляем! Вы выиграли скин за ${amount} руб!`
    : `Увы, не повезло! Попробуйте снова за ${amount} руб.`;

  document.getElementById("result").innerText = resultText;
}

// Обновляем приветствие с именем пользователя
window.onload = function() {
  const userName = getUserName();
  document.getElementById("greeting").innerText = `Привет, ${userName}!`;
}
