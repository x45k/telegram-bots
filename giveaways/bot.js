const TelegramBot = require('node-telegram-bot-api');

const token = 'your-token';
const bot = new TelegramBot(token, { polling: true });

let participants = [];
let giveawayPrize = '';
let giveawayDuration = 30000; 

function parseDuration(durationString) {
    const unitMultipliers = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24, 
        w: 1000 * 60 * 60 * 24 * 7 
    };

    const regex = /(\d+)([smhdw])/g;
    let totalMilliseconds = 0;
    let match;

    while ((match = regex.exec(durationString)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        totalMilliseconds += value * unitMultipliers[unit];
    }

    return totalMilliseconds;
}

bot.onText(/\/start_giveaway (.+) ([\dsmhdw]+)/, (msg, match) => {
    const chatId = msg.chat.id;
    giveawayPrize = match[1];
    giveawayDuration = parseDuration(match[2]); 
    participants = [];

    const giveawayMessage = `Giveaway started for: *${giveawayPrize}*\nDuration: ${match[2]}\nClick the button below to participate!`;
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Join Giveaway',
                        callback_data: 'join_giveaway'
                    }
                ]
            ]
        },
        parse_mode: 'Markdown'
    };

    bot.sendMessage(chatId, giveawayMessage, options);

    setTimeout(() => {
        pickWinner(chatId);
    }, giveawayDuration);
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const userName = callbackQuery.from.username || callbackQuery.from.first_name;

    if (callbackQuery.data === 'join_giveaway') {
        const isParticipant = participants.some(participant => participant.id === userId);

        if (isParticipant) {
            participants = participants.filter(participant => participant.id !== userId);
            bot.answerCallbackQuery(callbackQuery.id, { text: 'You have left the giveaway!' });
        } else {
            participants.push({ id: userId, name: userName });
            bot.answerCallbackQuery(callbackQuery.id, { text: 'You have entered the giveaway!' });
        }
    }
});

function pickWinner(chatId) {
    if (participants.length === 0) {
        bot.sendMessage(chatId, 'No participants in the giveaway.');
        return;
    }
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];
    const winnerMention = `<a href="tg://user?id=${winner.id}">${winner.name || winner.id}</a>`;

    bot.sendMessage(chatId, `Congratulations! The winner of *${giveawayPrize}* is: ${winnerMention}`, { parse_mode: 'HTML' });
    participants = [];
    giveawayPrize = '';
}

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Available commands:\n/start_giveaway [prize] [duration] - Start a new giveaway with a specified prize and duration (e.g., 30s, 1m, 2h, 3d, 3w)');
});