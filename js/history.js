class History {
    constructor(user) {
        this.user = user;
        this.historyContainer = document.getElementById('bets-history');
        this.initEventListeners();
        this.updateHistoryDisplay();
    }

    initEventListeners() {
        document.getElementById('clear-history').addEventListener('click', async () => {
            await this.user.clearBetHistory();
            this.updateHistoryDisplay();
        });
    }

    updateHistoryDisplay() {
        if (!this.historyContainer) return;

        this.historyContainer.innerHTML = '';
        const history = this.user.userData.betHistory || [];

        if (history.length === 0) {
            this.historyContainer.innerHTML = '<p>История ставок пуста</p>';
            return;
        }

        history.forEach(bet => {
            const betElement = document.createElement('div');
            betElement.className = `bet-item ${bet.result}`;
            
            betElement.innerHTML = `
                <div class="bet-amount">${bet.amount} ₽</div>
                <div class="bet-result">${bet.result === 'win' ? 'Выигрыш' : 'Проигрыш'}</div>
                <div class="bet-win-amount">${bet.result === 'win' ? `+${bet.winAmount} ₽` : ''}</div>
            `;
            
            this.historyContainer.appendChild(betElement);
        });
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

export { History }; 