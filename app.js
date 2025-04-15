let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user data
    const userAvatar = document.getElementById('user-avatar');
    const username = document.getElementById('username');
    
    // Set user data from Telegram
    if (tg.initDataUnsafe?.user?.photo_url) {
        userAvatar.src = tg.initDataUnsafe.user.photo_url;
    }
    if (tg.initDataUnsafe?.user?.username) {
        username.textContent = tg.initDataUnsafe.user.username;
    }

    // Roulette logic
    const rouletteButtons = document.querySelectorAll('.roulette-btn');
    const resultDiv = document.getElementById('result');
    const skinResult = document.getElementById('skin-result');
    const spinAgain = document.getElementById('spin-again');
    const historyList = document.getElementById('history-list');

    rouletteButtons.forEach(button => {
        button.addEventListener('click', () => handleSpin(button));
    });

    spinAgain.addEventListener('click', () => {
        resultDiv.classList.add('hidden');
    });

    function handleSpin(button) {
        const price = button.dataset.price;
        button.classList.add('loading');
        
        // Simulate spin delay
        setTimeout(() => {
            button.classList.remove('loading');
            showResult(price);
        }, 2000);
    }

    function showResult(price) {
        resultDiv.classList.remove('hidden');
        const won = Math.random() > 0.5;
        
        const result = {
            price: price,
            won: won,
            skin: won ? getRandomSkin() : 'No win'
        };

        updateHistory(result);
        displayResult(result);
    }

    function getRandomSkin() {
        const skins = {
            common: [
                { name: 'P250 | Песчаная дюна', chance: 0.5 },
                { name: 'MP7 | Лесной DDPAT', chance: 0.5 }
            ],
            rare: [
                { name: 'AK-47 | Азимов', chance: 0.2 },
                { name: 'M4A4 | Нео-Нуар', chance: 0.2 }
            ],
            legendary: [
                { name: 'AWP | Драконий лор', chance: 0.05 },
                { name: 'Нож-бабочка | Градиент', chance: 0.05 }
            ]
        };
    
        const roll = Math.random();
        let category;
        
        if (roll < 0.1) category = 'legendary';
        else if (roll < 0.3) category = 'rare';
        else category = 'common';
    
        const categoryItems = skins[category];
        return {
            item: categoryItems[Math.floor(Math.random() * categoryItems.length)].name,
            rarity: category
        };
    }

    function updateHistory(result) {
        const entry = document.createElement('div');
        entry.className = `history-entry ${result.won ? 'win' : 'lose'}`;
        entry.innerHTML = `
            <span>${result.price}₽ - ${result.won ? result.skin : 'Не выиграл'}</span>
            <span>${new Date().toLocaleTimeString()}</span>
        `;
        historyList.insertBefore(entry, historyList.firstChild);
    }

    function displayResult(result) {
        skinResult.innerHTML = result.won 
            ? `Поздравляем! Вы выиграли ${result.skin}!`
            : 'К сожалению, не повезло. Попробуйте еще раз!';
    }
    
    // Add new functions with Russian text
    function showDailyBonus() {
        const bonus = Math.floor(Math.random() * 500) + 100;
        tg.showPopup({
            title: 'Ежедневный бонус!',
            message: `Ваш ежедневный бонус: ${bonus}₽`,
            buttons: [{type: 'ok'}]
        });
        localStorage.setItem('lastBonusDate', new Date().toDateString());
    }
    
    function unlockAchievement(id) {
        const achievements = {
            firstWin: { title: 'Первая победа', description: 'Выиграйте свой первый скин' },
            bigSpender: { title: 'Большой игрок', description: 'Сделайте ставку в 1000₽' },
            luckyStreak: { title: 'Счастливая серия', description: 'Выиграйте 3 раза подряд' }
        };
    
        localStorage.setItem(`achievement_${id}`, 'true');
        tg.showPopup({
            title: '🏆 Достижение разблокировано!',
            message: `${achievements[id].title}\n${achievements[id].description}`
        });
    }
});
