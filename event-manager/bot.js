const TelegramBot = require('node-telegram-bot-api');

const token = 'your-token';
const bot = new TelegramBot(token, { polling: true });

const helpText = `
Available commands:
- /announce <event title> <date> <time> <location> <description>: Announce an event.
  - <event title>: Name of the event (can be multiple words)
  - <date>: Date of the event (YYYY-MM-DD)
  - <time>: Time of the event (HH:MM)
  - <location>: Location of the event
  - <description>: Description of the event
  - Example: /announce "Team Meeting" 2024-10-20 15:00 "Conference Room" "Discuss project updates"
- /help: Show this help message
`;

bot.onText(/\/announce (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const argsString = match[1].trim();

    const args = argsString.match(/(?:[^\s"]+|"[^"]*")+/g).map(arg => arg.replace(/(^"|"$)/g, ''));

    if (args.length < 5) {
        bot.sendMessage(chatId, 'Please provide all required arguments: <event title> <date> <time> <location> <description>');
        return;
    }

    const eventTitle = args.slice(0, -4).join(' ');
    const date = args[args.length - 4];
    const time = args[args.length - 3];
    const location = args[args.length - 2];
    const description = args[args.length - 1];

    const announcement = `📢 Event Announcement:\n\nEvent: ${eventTitle}\nDate: ${date}\nTime: ${time}\nLocation: ${location}\nDescription: ${description}`;
    bot.sendMessage(chatId, announcement);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, helpText);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text.toString().toLowerCase() === 'hi') {
        bot.sendMessage(chatId, 'Hello! Use /help to see available commands.');
    }
});