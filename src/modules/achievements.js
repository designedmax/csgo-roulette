// Управление достижениями
let achievements = ['new_player'];

// Инициализация достижений
if (localStorage.getItem('achievements')) {
    const storedAchievements = JSON.parse(localStorage.getItem('achievements'));
    if (!storedAchievements.includes('new_player')) {
        storedAchievements.push('new_player');
    }
    achievements = storedAchievements;
}

// Список всех достижений
const achievementsList = {
    'first_win': { title: 'Первая победа', condition: 1 },
    'big_win': { title: 'Крупный выигрыш', condition: 1000 },
    'balance': { title: 'Богач', condition: 5000 },
    'new_player': { title: 'Новый игрок', condition: 0 },
    'winner': { title: 'Победитель', condition: 10 },
    'loser': { title: 'Лошок', condition: 30 }
};

// Проверка достижений
export function checkAchievement(type, value) {
    if (!achievements.includes(type)) {
        if (type === 'winner') {
            const history = JSON.parse(localStorage.getItem('csgoRouletteHistory')) || [];
            const totalWins = history.filter(entry => entry.status === 'win').length;
            if (totalWins >= achievementsList[type].condition) {
                achievements.push(type);
                localStorage.setItem('achievements', JSON.stringify(achievements));
                updateAchievementsUI();
            }
        } else if ((type === 'balance' && value >= achievementsList[type].condition) ||
            (type === 'big_win' && value >= achievementsList[type].condition)) {
            achievements.push(type);
            localStorage.setItem('achievements', JSON.stringify(achievements));
            updateAchievementsUI();
        }
    }
}

// Обновление UI достижений
export function updateAchievementsUI() {
    const achievementsList = document.getElementById('achievements-list');
    const allAchievements = [
        { id: 'new_player', title: 'Новый игрок', description: 'Добро пожаловать в игру!' },
        { id: 'first_win', title: 'Первая победа', description: 'Выиграйте свой первый скин' },
        { id: 'big_win', title: 'Крупный выигрыш', description: 'Выиграйте ставку от 1000₽' },
        { id: 'balance', title: 'Богач', description: 'Накопите 5000₽ на балансе' },
        { id: 'winner', title: 'Победитель', description: 'Выиграйте 10 раз' },
        { id: 'loser', title: 'Лошок', description: 'Проиграйте 30 раз' }
    ];

    achievementsList.innerHTML = allAchievements.map(ach => `
        <div class="achievement-item ${achievements.includes(ach.id) ? 'unlocked' : ''}">
            <h4>${ach.title}</h4>
            <p>${ach.description}</p>
        </div>
    `).join('');
}