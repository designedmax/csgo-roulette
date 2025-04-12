// Функция для получения имени пользователя
async function getUserName() {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/getUpdates`);
  const data = await response.json();

  if (data.ok && data.result.length > 0) {
    const user = data.result[0].message.from;
    const userName = user.first_name; // Имя пользователя
    console.log("Имя пользователя: ", userName);
    return userName;
  } else {
    console.log("Нет обновлений");
    return "Привет, игрок!"; // Если данных нет, показываем стандартное сообщение
  }
}

// Вызовем функцию и покажем имя пользователя
getUserName().then(userName => {
  document.getElementById("userNameDisplay").innerText = `Привет, ${userName}!`; // Выводим имя на странице
});

// Логика рулетки
document.getElementById("roulette100").addEventListener("click", function() {
  spinRoulette(100);
});

document.getElementById("roulette300").addEventListener("click", function() {
  spinRoulette(300);
});

document.getElementById("roulette500").addEventListener("click", function() {
  spinRoulette(500);
});

document.getElementById("roulette1000").addEventListener("click", function() {
  spinRoulette(1000);
});

// Функция для выполнения спина рулетки
function spinRoulette(betAmount) {
  const winChance = 0.4; // 40% шанс
  const win = Math.random() < winChance;

  if (win) {
    alert(`Поздравляем! Вы выиграли скин на сумму ${betAmount} руб!`);
  } else {
    alert(`Увы, вы не выиграли. Попробуйте снова!`);
  }
}
