This repository is a port of [x45k/discord-bots](https://github.com/x45k/discord-bots) for Telegram, as I wanted to try making Telegram bots. 

## Contributing

- If you encounter any issues, please [create an issue](https://github.com/x45k/telegram-bots/issues).
- For any features you'd like to see added, feel free to [make an issue](https://github.com/x45k/telegram-botsz/issues).
- If you want to contribute, please submit a pull request (PR) and DM me on Discord to let me know, as I may not check GitHub regularly.
- If you find this repository useful, please consider giving it a star! ⭐

## Building Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/x45k/telegram-bots.git
   ```
2. CD into the bot, for example:
    ```bash
    cd ./telegram-bots/facts/
    ```
3. Change your token:
    ```js
    const token = 'your-token';
    ```
    (Replace 'your-token' with your telegram bot token)

4. Install the dependencies:
    ```bash
    npm install node-telegram-bot-api axios
    ```
    (Keep in mind axios may not be needed, it depends on the chosen bot)

5. Run the bot:
    ```bash
    node bot.js
    ```