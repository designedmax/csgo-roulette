// Импорт модулей
import { initTelegram, updateUserInfo } from './modules/telegram.js';
import { initBalance, updateBalance, claimDailyBonus } from './modules/balance.js';
import { spinRoulette, showResult } from './modules/roulette.js';
import { saveToHistory, clearHistory, updateHistoryUI } from './modules/history.js';
import { checkAchievement, updateAchievementsUI } from './modules/achievements.js';
import { updateProfileStats } from './modules/profile.js';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    initBalance();
    updateUserInfo();
    updateHistoryUI();
    updateAchievementsUI();
    updateProfileStats();
});

// Экспорт функций для использования в HTML
window.spinRoulette = spinRoulette;
window.claimDailyBonus = claimDailyBonus;
window.clearHistory = clearHistory;