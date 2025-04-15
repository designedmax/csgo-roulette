class History {
    constructor(user) {
        this.user = user;
        this.initEventListeners();
        this.updateHistoryDisplay();
    }

    initEventListeners() {
        document.getElementById('clear-history').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить историю ставок?')) {
                this.user.clearBetHistory();
                this.updateHistoryDisplay();
            }
        });
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('bets-history');
        historyContainer.innerHTML = '';

        this.user.userData.betHistory.forEach(bet => {
            const historyItem = document.createElement('div');
            historyItem.className = `bet-history-item ${bet.win ? 'win' : 'lose'}`;
            
            const date = new Date(bet.timestamp);
            const formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            if (bet.win) {
                historyItem.innerHTML = `
                    <span>${formattedDate}</span>
                    <span>Выигрыш: ${bet.skin} (${bet.amount} ₽)</span>
                `;
            } else {
                historyItem.innerHTML = `
                    <span>${formattedDate}</span>
                    <span>Проигрыш: ${bet.amount} ₽</span>
                `;
            }

            historyContainer.appendChild(historyItem);
        });

        // Show message if history is empty
        if (this.user.userData.betHistory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'История ставок пуста';
            historyContainer.appendChild(emptyMessage);
        }
    }

    addBetToHistory(bet) {
        this.user.addBetToHistory(bet);
        this.updateHistoryDisplay();
    }
} 