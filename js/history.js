class History {
    constructor(user) {
        this.user = user;
        this.initEventListeners();
        this.updateHistoryDisplay();
    }

    initEventListeners() {
        document.getElementById('clear-history').addEventListener('click', async () => {
            if (confirm('Вы уверены, что хотите очистить историю ставок?')) {
                await this.user.clearBetHistory();
                this.updateHistoryDisplay();
            }
        });
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('bets-history');
        if (!historyContainer) return; // Если контейнер не найден, выходим
        
        historyContainer.innerHTML = '';

        // Используем текущую историю из userData
        const betHistory = this.user.userData.betHistory || [];
        
        if (betHistory.length > 0) {
            betHistory.forEach(bet => {
                const historyItem = document.createElement('div');
                historyItem.className = `bet-history-item ${bet.win ? 'win' : 'lose'}`;
                
                if (bet.win) {
                    historyItem.innerHTML = `
                        <span>Выигрыш: ${bet.skin} (${bet.amount} ₽)</span>
                    `;
                } else {
                    historyItem.innerHTML = `
                        <span>Проигрыш: ${Math.abs(bet.amount)} ₽</span>
                    `;
                }

                historyContainer.appendChild(historyItem);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'История ставок пуста';
            historyContainer.appendChild(emptyMessage);
        }
    }

    addBetToHistory(bet) {
        if (!this.user.userData.betHistory) {
            this.user.userData.betHistory = [];
        }
        this.user.userData.betHistory.unshift(bet);
        if (this.user.userData.betHistory.length > 50) {
            this.user.userData.betHistory.pop();
        }
        this.user.saveUserData();
        this.updateHistoryDisplay();
    }
} 