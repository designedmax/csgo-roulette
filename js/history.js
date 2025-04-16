class History {
    constructor(user) {
        this.user = user;
        this.historyList = document.getElementById('history-list');
        this.setupEventListeners();
        this.updateHistory();
    }

    setupEventListeners() {
        document.getElementById('clear-history').addEventListener('click', async () => {
            if (confirm('Вы уверены, что хотите очистить историю?')) {
                await this.user.clearBetHistory();
                this.updateHistory();
            }
        });

        // Listen for user data updates
        this.user.onDataUpdate = () => this.updateHistory();
    }

    updateHistory() {
        this.historyList.innerHTML = '';
        
        if (this.user.userData.betHistory.length === 0) {
            this.historyList.innerHTML = '<p class="empty-history">История ставок пуста</p>';
            return;
        }

        this.user.userData.betHistory.forEach(bet => {
            const betElement = this.createBetElement(bet);
            this.historyList.appendChild(betElement);
        });
    }

    createBetElement(bet) {
        const element = document.createElement('div');
        element.className = `history-item ${bet.won ? 'win' : 'lose'}`;
        
        const date = new Date(bet.timestamp);
        const timeString = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        element.innerHTML = `
            <div class="history-time">${timeString}</div>
            <div class="history-amount">${bet.amount} ₽</div>
            <div class="history-result">
                ${bet.won ? 'Выигрыш' : 'Проигрыш'}
                ${bet.won ? `+${bet.amount * 2} ₽` : `-${bet.amount} ₽`}
            </div>
        `;

        return element;
    }
}

export { History }; 