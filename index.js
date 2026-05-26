const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
    polling: true
});

let broadcastMode = false;

let messageYashMode = {};

let users = {};

const tasks = require('./tasks.json');

const withdraws = require('./withdraws.json');

if (fs.existsSync('./users.json')) {

    users = JSON.parse(
        fs.readFileSync('./users.json')
    );
}
bot.onText(/\/start(?: (.+))?/, (msg, match) => {

    const userId = msg.from.id;

    const referrerId = match[1];

    if (!users[userId]) {

        users[userId] = {

            id: userId,

            name: msg.from.first_name,

            balance: 0,

            referrals: 0,

            completedTasks: [],

            history: [],

            level: 1,

            xp: 0,

            achievements: [],

            lastSpin: 0,

            lastDaily: 0,

            notifications: true,

            theme: 'romantic',

            referredBy: referrerId || null
        };

        if (
            referrerId &&
            users[referrerId] &&
            referrerId != userId
        ) {

            users[referrerId].referrals += 1;

            bot.sendMessage(
                referrerId,
                `🎉 New Referral Joined 💖

🌸 ${msg.from.first_name} joined using your invite link ✨`
            );
        }

        fs.writeFileSync(
            './users.json',
            JSON.stringify(users, null, 2)
        );
    }

    bot.sendMessage(
        msg.chat.id,
        `🌸 Welcome to Yash❤️Swati Universe 🌸

💖 Hello ${msg.from.first_name}

✨ Your intelligent rewards universe is ready.

Choose an option below 👇`,
        {
            reply_markup: {
                keyboard: [

                    ['💖 Profile', '🎯 Tasks'],

                    ['💰 Balance', '👥 Referral'],

                    ['🎁 Daily Reward'],

                    ['📊 Dashboard'],

                    ['📜 History'],

                    ['🏆 Achievements'],

                    ['🥇 Leaderboard'],

                    ['🎡 Lucky Spin'],

                    ['🏧 Withdraw'],

                    ['⚙️ Settings'],

                    ['🔔 Notifications'],

                    ['👑 Admin Panel'],

                    ['❤️ Message Yash']

                ],

                resize_keyboard: true
            }
        }
    );
});
bot.on('message', (msg) => {

    const userId = msg.from.id;

    // PROFILE

    if (msg.text === '💖 Profile') {

        bot.sendMessage(
            msg.chat.id,
            `👤 Profile 🌸

💖 Name: ${users[userId].name}

💰 Balance: ₹${users[userId].balance}

⭐ Level: ${users[userId].level}

✨ XP: ${users[userId].xp}`
        );
    }

    // TASKS

    if (msg.text === '🎯 Tasks') {

        let taskButtons = [];

        tasks.forEach(task => {

            taskButtons.push([
                {
                    text:
                        `🎯 ${task.title} (+₹${task.reward})`,
                    callback_data:
                        `task_${task.id}`
                }
            ]);
        });

        bot.sendMessage(
            msg.chat.id,
            '🌸 Available Tasks 💖',
            {
                reply_markup: {
                    inline_keyboard: taskButtons
                }
            }
        );
    }

    // BALANCE

    if (msg.text === '💰 Balance') {

        bot.sendMessage(
            msg.chat.id,
            `💰 Current Balance:
₹${users[userId].balance}`
        );
    }

    // REFERRAL

    if (msg.text === '👥 Referral') {

        const botUsername =
            'YS_ai_studio_bot';

        bot.sendMessage(
            msg.chat.id,
            `💖 Invite Friends & Earn 🌸

https://t.me/${botUsername}?start=${userId}

👥 Total Referrals:
${users[userId].referrals}`
        );
    }
    // DAILY REWARD

    if (msg.text === '🎁 Daily Reward') {

        const now = Date.now();

        const oneDay =
            24 * 60 * 60 * 1000;

        if (
            now -
            users[userId].lastDaily <
            oneDay
        ) {

            bot.sendMessage(
                msg.chat.id,
                '🌸 Already claimed today 💖'
            );

            return;
        }

        bot.sendMessage(
            msg.chat.id,
            `🎁 Processing daily reward 💖`
        );

        setTimeout(() => {

            users[userId].balance += 50;

            users[userId].history.push(
                '🎁 Daily Reward (+₹50)'
            );

            users[userId].lastDaily =
                now;

            fs.writeFileSync(
                './users.json',
                JSON.stringify(users, null, 2)
            );

            bot.sendMessage(
                msg.chat.id,
                `🎉 Daily reward claimed

💰 +₹50`
            );

        }, 3000);
    }

    // DASHBOARD

    if (msg.text === '📊 Dashboard') {

        const totalUsers =
            Object.keys(users).length;

        bot.sendMessage(
            msg.chat.id,
            `📊 Dashboard 🌸

👤 Total Users:
${totalUsers}

💰 Your Balance:
₹${users[userId].balance}

⭐ Level:
${users[userId].level}`
        );
    }

    // HISTORY

    if (msg.text === '📜 History') {

        const history =
            users[userId].history;

        if (history.length === 0) {

            bot.sendMessage(
                msg.chat.id,
                '🌸 No history yet 💖'
            );

            return;
        }

        let text =
            `📜 History 🌸\n\n`;

        history
            .slice(-10)
            .reverse()
            .forEach(item => {

                text += `${item}\n\n`;
            });

        bot.sendMessage(
            msg.chat.id,
            text
        );
    }
    // ACHIEVEMENTS

    if (msg.text === '🏆 Achievements') {

        const achievements =
            users[userId].achievements;

        if (achievements.length === 0) {

            bot.sendMessage(
                msg.chat.id,
                '🌸 No achievements yet 💖'
            );

            return;
        }

        let text =
            `🏆 Achievements 🌸\n\n`;

        achievements.forEach(a => {

            text += `✨ ${a}\n`;
        });

        bot.sendMessage(
            msg.chat.id,
            text
        );
    }

    // LEADERBOARD

    if (msg.text === '🥇 Leaderboard') {

        const sortedUsers =
            Object.values(users)
                .sort(
                    (a, b) =>
                        b.balance - a.balance
                )
                .slice(0, 10);

        let text =
            `🥇 Leaderboard 🌸\n\n`;

        sortedUsers.forEach(
            (user, index) => {

                text +=
`${index + 1}. ${user.name}
₹${user.balance}

`;
            }
        );

        bot.sendMessage(
            msg.chat.id,
            text
        );
    }
    // LUCKY SPIN

    if (msg.text === '🎡 Lucky Spin') {

        const rewards =
            [10, 20, 30, 50, 100];

        const reward =
            rewards[
                Math.floor(
                    Math.random() *
                    rewards.length
                )
            ];

        users[userId].balance += reward;

        users[userId].history.push(
            `🎡 Spin Reward (+₹${reward})`
        );

        fs.writeFileSync(
            './users.json',
            JSON.stringify(users, null, 2)
        );

        bot.sendMessage(
            msg.chat.id,
            `🎉 You won ₹${reward} 💖`
        );
    }

    // WITHDRAW

    if (msg.text === '🏧 Withdraw') {

        let text =
            `🏧 Withdraw Center 🌸\n\n`;

        withdraws.forEach(method => {

            text +=
`${method.name}
Minimum: ₹${method.minimum}

`;
        });

        bot.sendMessage(
            msg.chat.id,
            text
        );
    }

    // SETTINGS

    if (msg.text === '⚙️ Settings') {

        bot.sendMessage(
            msg.chat.id,
            '⚙️ Settings Panel 🌸'
        );
    }
    // NOTIFICATIONS

    if (msg.text === '🔔 Notifications') {

        users[userId].notifications =
            !users[userId].notifications;

        fs.writeFileSync(
            './users.json',
            JSON.stringify(users, null, 2)
        );

        bot.sendMessage(
            msg.chat.id,
            `🔔 Notifications updated 💖`
        );
    }

    // ADMIN PANEL

    if (msg.text === '👑 Admin Panel') {

        if (
            msg.from.id.toString() !==
            process.env.ADMIN_ID
        ) {

            bot.sendMessage(
                msg.chat.id,
                '❌ Access Denied'
            );

            return;
        }

        bot.sendMessage(
            msg.chat.id,
            `👑 Admin Panel 🌸

📢 /broadcast

✨ System Running`
        );
    }

    // MESSAGE YASH

    if (msg.text === '❤️ Message Yash') {

        messageYashMode[msg.from.id] =
            true;

        bot.sendMessage(
            msg.chat.id,
            '💌 Send your message ❤️'
        );

        return;
    }

    if (
        messageYashMode[msg.from.id] &&
        msg.text !== '❤️ Message Yash'
    ) {

        messageYashMode[msg.from.id] =
            false;

        bot.sendMessage(
            process.env.ADMIN_ID,
            `💌 Message From ${msg.from.first_name}

${msg.text}`
        );

        bot.sendMessage(
            msg.chat.id,
            '💖 Message delivered'
        );
    }
});

console.log(
    '🌸 Yash❤️Swati Universe Running...'
);
