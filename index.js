const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `🌸 Welcome to SwatiVerse AI 🌸

Choose an option below 👇`,
        {
            reply_markup: {
                keyboard: [
                    ['💖 Profile', '🎯 Tasks'],
                    ['💰 Balance', '👥 Referral'],
                    ['🏧 Withdraw', '⚙️ Settings']
                ],
                resize_keyboard: true
            }
        }
    );
});

bot.on('message', (msg) => {

    if (msg.text === '💖 Profile') {
        bot.sendMessage(msg.chat.id, '👤 Your Profile Coming Soon...');
    }

    if (msg.text === '🎯 Tasks') {
        bot.sendMessage(msg.chat.id, '📋 Daily Tasks Coming Soon...');
    }

    if (msg.text === '💰 Balance') {
        bot.sendMessage(msg.chat.id, '💵 Your Balance: ₹0');
    }

    if (msg.text === '👥 Referral') {
        bot.sendMessage(msg.chat.id, '🔗 Referral System Coming Soon...');
    }

    if (msg.text === '🏧 Withdraw') {
        bot.sendMessage(msg.chat.id, '🏦 Withdraw Feature Coming Soon...');
    }

    if (msg.text === '⚙️ Settings') {
        bot.sendMessage(msg.chat.id, '⚙️ Settings Panel Coming Soon...');
    }

});

console.log('SwatiVerse AI Running...');
