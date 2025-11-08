const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
    name: 'weather',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Mohammad Akash',
    description: 'Get weather info for any major Bangladesh city using /weather <city>',
    commandCategory: 'utility',
    usages: '/weather <city>',
    cooldowns: 3
};

// Supported cities
const cities = [
    "dhaka", "chittagong", "rajshahi", "khulna", "sylhet",
    "barisal", "rangpur", "mymensingh", "coxsbazar", "comilla",
    "netrokona", "bogra", "jamalpur", "faridpur"
];

// Random advice lines
const tips = [
    "☔ বাইরে গেলে ছাতা নাও!",
    "💧 পানি বেশি পান করো।",
    "🌸 আজ একটু হাসো তো!",
    "😎 কাজের মাঝে ছোট ব্রেক নাও।",
    "🧘‍♂️ হালকা stretch করো।",
    "💡 সময়মত খাবার খাও।",
    "🌞 সকালটা fresh শুরু করো!"
];

async function getWeather(city) {
    try {
        const res = await axios.get(`https://wttr.in/${city}?format=%C+%t`);
        return res.data; // যেমন: 🌤️ 31°C
    } catch {
        return "🌧️ তথ্য আনা যায়নি";
    }
}

module.exports.run = async ({ api, event, args }) => {
    const cityInput = args[0];
    if (!cityInput) return api.sendMessage("❌ দয়া করে শহরের নাম লিখো। উদাহরণ: /weather dhaka", event.threadID);

    const city = cityInput.toLowerCase();
    if (!cities.includes(city)) return api.sendMessage(`❌ দুঃখিত, '${cityInput}' শহরের তথ্য পাওয়া যায়নি।`, event.threadID);

    const weather = await getWeather(city);
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const now = moment().tz('Asia/Dhaka');
    const dateStr = now.format('DD MMM YYYY');
    const timeStr = now.format('hh:mm A');

    const message =
`╭─────────────────────────╮
🌤️ এই মুহূর্তে জানানো হচ্ছে ${city.charAt(0).toUpperCase() + city.slice(1)}
╰─────────────────────────╯
🌡️ ${weather}

━━━━━━━━━━━━━━━━
📅 তারিখ: ${dateStr}
🕒 সময়: ${timeStr}
💡 পরামর্শ: ${tip}
━━━━━━━━━━━━━━━━`;

    api.sendMessage(message, event.threadID);
};
