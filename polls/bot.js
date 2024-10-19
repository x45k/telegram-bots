const TelegramBot = require('node-telegram-bot-api');

const token = 'your-token';
const bot = new TelegramBot(token, { polling: true });

const polls = {};

bot.onText(/\/createpoll (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1].split(';');

    if (input.length < 3) {
        bot.sendMessage(chatId, 'Please provide a question followed by at least two options, separated by semicolons (e.g., "Question; Option1; Option2")');
        return;
    }

    const question = input[0].trim(); 
    const options = input.slice(1).map(opt => opt.trim());

    if (!question) {
        bot.sendMessage(chatId, 'The question cannot be empty.');
        return;
    }

    for (const option of options) {
        if (!option) {
            bot.sendMessage(chatId, 'All options must be non-empty.');
            return;
        }
    }

    bot.sendPoll(chatId, question, options, { is_anonymous: false })
        .then((sentPoll) => {
            polls[sentPoll.poll.id] = { question, options };
            console.log(`Poll sent: ${question}`);
        })
        .catch(error => {
            console.error('Error sending poll:', error);
            bot.sendMessage(chatId, 'An error occurred while sending the poll. Please try again.');
        });
});

bot.on('poll_answer', (answer) => {
    const { poll_id, user } = answer;
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
    Available commands:
    /createpoll Question; Option1; Option2 - Create a new poll with the specified question and options.
    /help - List available commands.
    `;
    bot.sendMessage(chatId, helpMessage);
});
