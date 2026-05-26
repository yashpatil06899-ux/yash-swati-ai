const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

let users = {};

if (fs.existsSync('./users.json')) {
    users = JSON.parse(fs.readFileSync('./users.json'));
}

bot.onText(/\/start/, (msg) => {

    const userId = msg.from.id;

    if (!users[userId]) {

        users[userId] = {
            id: userId,
            name: msg.from.first_name,
            balance: 0
        };

        fs.writeFileSync(
            './users.json',
            JSON.stringify(users, null, 2)
        );
    }

    bot.sendMessage(
        msg.chat.id,
        `🌸 Welcome to SwatiVerse AI 🌸

💖 Hello ${msg.from.first_name}

✨ Your intelligent rewards universe is ready.

Choose an option below 👇`,
        {
            reply_markup: {
                keyboard: [
                    ['💖 Profile', '🎯 Tasks'],
                    ['💰 Balance', '👥 Referral'],
                    ['🏧 Withdraw', '⚙️ Settings'],
                    ['❤️ Message Yash']
                ],
                resize_keyboard: true
            }
        }
    );
});

bot.on('message', (msg) => {

    const userId = msg.from.id;

    if (msg.text === '💖 Profile') {

        bot.sendMessage(
            msg.chat.id,
            `👤 Profile

🌸 Name: ${users[userId].name}
💰 Balance: ₹${users[userId].balance}

✨ More features coming soon 💖`
        );
    }

    if (msg.text === '🎯 Tasks') {

        bot.sendMessage(
            msg.chat.id,
            '📋 GrabPoints Tasks System Coming Soon 🌸'
        );
    }

    if (msg.text === '💰 Balance') {

        bot.sendMessage(
            msg.chat.id,
            `💰 Current Balance: ₹${users[userId].balance}`
        );
    }

    if (msg.text === '👥 Referral') {

        bot.sendMessage(
            msg.chat.id,
            `🔗 Invite Friends & Earn 💖

Your referral system is coming soon 🌸`
        );
    }

    if (msg.text === '🏧 Withdraw') {

        bot.sendMessage(
            msg.chat.id,
            '🏦 Withdrawal Center Coming Soon ✨'
        );
    }

    if (msg.text === '⚙️ Settings') {

        bot.sendMessage(
            msg.chat.id,
            '⚙️ Settings Panel Coming Soon 🌸'
        );
    }

    if (msg.text === '❤️ Message Yash') {

        bot.sendMessage(
            msg.chat.id,
            '💌 Message feature will be connected soon ❤️'
        );
    }

});

console.log('🌸 SwatiVerse AI Running...');
