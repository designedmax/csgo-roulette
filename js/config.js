const CONFIG = {
    WIN_CHANCE: 0.4, // 40% chance to win
    DAILY_BONUS_AMOUNT: 5000,
    BONUS_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    BET_AMOUNTS: [100, 300, 500, 1000],
    SKINS: [
        { name: 'AK-47 | Красная линия', value: 2000 },
        { name: 'AWP | Фея', value: 3000 },
        { name: 'M4A4 | Крушитель', value: 1500 },
        { name: 'Нож | Бабочка', value: 5000 },
        { name: 'Вилка | В жопу', value: 1000 },
        { name: 'Фак | Нах', value: 800 },
        { name: 'UMP | Сосамба', value: 1200 }
    ],
    ACHIEVEMENTS: [
        {
            id: 'new_player',
            name: 'Салага',
            description: 'Добро пожаловать',
            unlocked: false
        },
        {
            id: 'first_win',
            name: 'Вкус победы',
            description: 'Первая победа',
            unlocked: false
        },
        {
            id: 'lucky',
            name: 'Умелый',
            description: '10 побед',
            unlocked: false
        },
        {
            id: 'pro',
            name: 'Игроман',
            description: '50 побед',
            unlocked: false
        },
        {
            id: 'sheep',
            name: 'Бывает',
            description: '10 поражений',
            unlocked: false
        },
        {
            id: 'loser',
            name: 'Невезучий',
            description: '30 поражений',
            unlocked: false
        },
        {
            id: 'big_bet',
            name: 'Рисковый',
            description: 'Ставка за 1К',
            unlocked: false
        },
        {
            id: 'rich',
            name: 'Буратино',
            description: 'На балансе 5К',
            unlocked: false
        }
    ]
}; 