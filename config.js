export const CONFIG = {
    achievements: {
        firstWin: {
            id: 'firstWin',
            title: 'Первая победа',
            description: 'Выиграйте свой первый скин',
            icon: '🏆'
        },
        bigSpender: {
            id: 'bigSpender',
            title: 'Большой игрок',
            description: 'Сделайте ставку в 1000₽',
            icon: '💰'
        },
        luckyStreak: {
            id: 'luckyStreak',
            title: 'Счастливая серия',
            description: 'Выиграйте 3 раза подряд',
            icon: '🔥'
        }
    },
    skins: {
        common: [
            { name: 'P250 | Песчаная дюна', price: 100 },
            { name: 'MP7 | Лесной DDPAT', price: 150 }
        ],
        rare: [
            { name: 'AK-47 | Азимов', price: 500 },
            { name: 'M4A4 | Нео-Нуар', price: 600 }
        ],
        legendary: [
            { name: 'AWP | Драконий лор', price: 2000 },
            { name: 'Нож-бабочка | Градиент', price: 2500 }
        ]
    }
};