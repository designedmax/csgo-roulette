// api/sendMessage.js

const axios = require('axios');

module.exports = async (req, res) => {
  // Получаем API-ключ из переменных окружения Vercel
  const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
  const chatId = req.query.chatId; // Получаем chatId от клиента (например, из URL)
  const message = req.query.message || 'Привет, это твоя рулетка!';

  // Формируем URL для запроса
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`;

  try {
    // Отправляем сообщение через Telegram API
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
    });
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
