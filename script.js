document.querySelectorAll('.roulette-option').forEach(option => {
  option.addEventListener('click', () => {
    const chance = Math.random();
    const result = document.getElementById('result');

    if (chance < 0.4) {
      result.innerHTML = "Выигрыш! Скин из CS:GO!";
    } else {
      result.innerHTML = "Увы, не повезло! Попробуй снова.";
    }
  });
});


// Инициализация Telegram Web App
window.Telegram.WebApp.onEvent('ready', function() {
  const user = window.Telegram.WebApp.initDataUnsafe;

  // Проверка на наличие данных
  if (user && user.first_name) {
    // Извлекаем имя пользователя и обновляем приветствие
    const userName = user.first_name;
    document.getElementById("greeting").innerText = `Привет, ${userName}!`;
  } else {
    // Если данных нет, выводим стандартное приветствие
    document.getElementById("greeting").innerText = "Привет, Игрок!";
  }
});

