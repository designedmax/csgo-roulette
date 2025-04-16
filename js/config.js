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
            id: "new_player",
            name: "Салага",
            description: "Добро пожаловать",
            emoji: "👋",
            unlocked: false
        },
        {
            id: "first_win",
            name: "Вкус победы",
            description: "Выиграть первую игру",
            emoji: "🎉",
            unlocked: false
        },
        {
            id: "rich",
            name: "Богач",
            description: "Накопить 10000 рублей",
            emoji: "💰",
            unlocked: false
        },
        {
            id: "gambler",
            name: "Азартный игрок",
            description: "Сыграть 100 игр",
            emoji: "🎲",
            unlocked: false
        },
        {
            id: "lucky",
            name: "Везунчик",
            description: "Выиграть 3 раза подряд",
            emoji: "🍀",
            unlocked: false
        },
        {
            id: "big_win",
            name: "Крупный выигрыш",
            description: "Выиграть 5000 рублей за одну игру",
            emoji: "💎",
            unlocked: false
        },
        {
            id: "veteran",
            name: "Ветеран",
            description: "Сыграть 500 игр",
            emoji: "🏆",
            unlocked: false
        },
        {
            id: "millionaire",
            name: "Миллионер",
            description: "Накопить 100000 рублей",
            emoji: "💵",
            unlocked: false
        }
    ]
};

export { CONFIG }; 