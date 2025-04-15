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
        { id: 'new_player', name: 'Новый игрок', description: 'Зарегистрировался в игре', unlocked: false },
        { id: 'first_win', name: 'Первая победа', description: 'Выиграл хотя бы один раз', unlocked: false },
        { id: 'lucky', name: 'Везучий', description: 'Выиграл минимум 10 раз', unlocked: false },
        { id: 'pro', name: 'Профи', description: 'Выиграл 50 раз минимум', unlocked: false },
        { id: 'sheep', name: 'Баран', description: 'Проиграл 10 раз минимум', unlocked: false },
        { id: 'loser', name: 'Лошок', description: 'Проиграл 30 раз минимум', unlocked: false },
        { id: 'big_bet', name: 'Крупняк', description: 'Сделал ставку за 1000 р', unlocked: false },
        { id: 'rich', name: 'Богач', description: 'На счете 5000 р или больше', unlocked: false }
    ]
}; 