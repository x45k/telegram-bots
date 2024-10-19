const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'your-token';
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/fact/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const fact = response.data;

        const message = `
        *Fact:* ${fact.text}
        *Source:* [${fact.source}](${fact.source_url})
        *Language:* ${fact.language}
        *More Info:* [Here](${fact.permalink})
        `;

        bot.sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Error fetching fact:', error);
        bot.sendMessage(chatId, 'Sorry, I could not fetch a fact at this time.');
    }
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});