document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const resultText = document.getElementById('resultText');
    let isSpinning = false;

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        resultText.textContent = 'Крутим...';

        // Случайный угол поворота (минимум 2 полных оборота)
        const spinDegrees = 720 + Math.floor(Math.random() * 360);
        
        // Анимация вращения
        wheel.style.transform = `rotate(${spinDegrees}deg)`;

        // Определяем результат после завершения анимации
        setTimeout(() => {
            const result = determineResult(spinDegrees);
            resultText.textContent = result;
            isSpinning = false;
            spinButton.disabled = false;
        }, 3000);
    });

    function determineResult(degrees) {
        // Нормализуем угол (0-360)
        const normalizedDegrees = degrees % 360;
        
        // Определяем сектор (каждый сектор 60 градусов)
        const sector = Math.floor(normalizedDegrees / 60);
        
        // Четные сектора - Win, нечетные - Lose
        return sector % 2 === 0 ? 'Поздравляем! Вы выиграли!' : 'К сожалению, вы проиграли';
    }
}); 