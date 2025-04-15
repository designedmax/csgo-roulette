// Управление историей ставок
let winCount = parseInt(localStorage.getItem('winCount')) || 0;
let loseCount = parseInt(localStorage.getItem('loseCount')) || 0;

// Сохранение ставки в историю
export function saveToHistory(status, skinName, skinPrice, betAmount) {
    const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
    const newEntry = {
        date: new Date().toLocaleString(),
        bet: betAmount,
        status: status,
        skin: skinName,
        prize: status === 'win' ? skinPrice : 0,
    };
    history.unshift(newEntry);
    localStorage.setItem('csgoRouletteHistory', JSON.stringify(history));

    // Обновление счетчиков
    if (status === 'win') {
        winCount++;
        localStorage.setItem('winCount', winCount);
    } else {
        loseCount++;
        localStorage.setItem('loseCount', loseCount);
    }

    updateHistoryUI();
}

// Очистка истории
export function clearHistory() {
    localStorage.removeItem('csgoRouletteHistory');
    updateHistoryUI();
}

// Обновление UI истории
export function updateHistoryUI() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
    
    historyList.innerHTML = history.length === 0 
        ? '<p>Ставок пока нет.</p>'
        : history.map(entry => `
            <div class="history-entry ${entry.status}">
                <span>${entry.date}</span>
                <span>Ставка: ${entry.bet} ₽</span>
                <span>${entry.status === 'win' ? '🏆 ' + entry.skin : '❌ Проигрыш'}</span>
            </div>
        `).join('');
}

// Получение статистики
export function getStats() {
    return {
        winCount,
        loseCount
    };
}