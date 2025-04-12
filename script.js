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
  // Получаем данные о пользователе через initDataUnsafe
  const user = window.Telegram.WebApp.initDataUnsafe;

  // Проверяем, есть ли имя пользователя
  if (user && user.first_name) {
    const userName = user.first_name;
    // Обновляем приветствие с именем пользователя
    document.getElementById("greeting").innerText = `Привет, ${userName}!`;
  } else {
    // Если имя не получено, показываем стандартное приветствие
    document.getElementById("greeting").innerText = "Привет, Игрок!";
  }
});

