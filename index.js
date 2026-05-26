const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🌸 Welcome to SwatiVerse AI 🌸

✨ Powerful GrabPoints Telegram System
💖 Made with love by Yash for Swati

✅ Surveys
✅ Rewards
✅ Tasks
✅ Withdrawals
✅ Notifications
✅ Romantic UI

Bot is now running successfully 🚀`
  );
});

console.log("Bot Started Successfully 🚀");
