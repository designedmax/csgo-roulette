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
