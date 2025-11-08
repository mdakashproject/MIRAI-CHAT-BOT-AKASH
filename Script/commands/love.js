module.exports.config = {
 name: "love",
 version: "7.3.1",
 hasPermssion: 0,
 credits: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Get Pair From Mention",
 commandCategory: "img",
 usages: "[@mention]",
 cooldowns: 5,
 dependencies: {
 "axios": "",
 "fs-extra": "",
 "path": "",
 "jimp": ""
 }
};

module.exports.onLoad = async() => {
 const { resolve } = global.nodemodule["path"];
 const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
 const { downloadFile } = global.utils;
 const dirMaterial = __dirname + '/cache/canvas/';
 const path = resolve(__dirname, 'cache/canvas', 'arr2.png');
 if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
 if (!existsSync(path)) await downloadFile("https://i.imgur.com/iaOiAXe.jpeg", path);
}

async function makeImage({ one, two }) {
 const fs = global.nodemodule["fs-extra"];
 const path = global.nodemodule["path"];
 const axios = global.nodemodule["axios"];
 const jimp = global.nodemodule["jimp"];
 const __root = path.resolve(__dirname, "cache", "canvas");

 let batgiam_img = await jimp.read(__root + "/arr2.png"); 
 let pathImg = __root + `/batman${one}_${two}.png`; 
 let avatarOne = __root + `/avt_${one}.png`; 
 let avatarTwo = __root + `/avt_${two}.png`; 
 
 let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data; 
 fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8')); 
 
 let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data; 
 fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8')); 
 
 let circleOne = await jimp.read(await circle(avatarOne)); 
 let circleTwo = await jimp.read(await circle(avatarTwo)); 
 batgiam_img.composite(circleOne.resize(200, 200), 70, 110).composite(circleTwo.resize(200, 200), 465, 110); 
 
 let raw = await batgiam_img.getBufferAsync("image/png"); 
 
 fs.writeFileSync(pathImg, raw); 
 fs.unlinkSync(avatarOne); 
 fs.unlinkSync(avatarTwo); 
 
 return pathImg;
}

async function circle(image) {
 const jimp = require("jimp");
 image = await jimp.read(image);
 image.circle();
 return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
 const fs = global.nodemodule["fs-extra"];
 const { threadID, messageID, senderID } = event;
 const mention = Object.keys(event.mentions);
 
 
 const captions = [
 "💖 ⎯͢⎯⃝🩷😽 তুমি আমার চোখেতে সরলতার উপমা ⎯͢⎯⃝🩷🐰🍒",
 "💖 🥺❤️ প্রিয়.....! 😊\nকখনো কাঁদাও, কখনো হাসাও,\nআবার কখনো এমন ভালোবাসা দাও,\nযেন পৃথিবীর সব সুখ তোমার মাঝে খুঁজে পাই...! 💔❤️",
 " বিচ্ছেদের পরেও যোগাযোগ রাখার নামই হচ্ছে মায়া ____💖 💗🌺",
 " 𝐏𝐞𝐨𝐩𝐥𝐞'𝐬 𝐦𝐞𝐦𝐨𝐫𝐢𝐞𝐬 𝐚𝐫𝐞 𝐦𝐨𝐫𝐞 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥 𝐭𝐡𝐚𝐧 𝐩𝐞𝐨𝐩𝐥𝐞'𝐬...\nমানুষে'র থেকে মানুষে'র স্মৃতি বেশি আপন হয়,\nমানুষ ছেড়ে যায়, কিন্তু স্মৃতি নয়-!!",
 " ইচ্ছে 'গুলো শব্দহীন...!!\nভাবনা সে-তো প্রতি দিন..!\nকল্পনার রং যদিও ঘন,\nকিন্তু বাস্তবতা ভীষণ কঠিন....!! 🌸💔",
 " ভালোবাসা মানে কেবল প্রেম নয়,\nবরং এমন একজন — যার হাসিতেই সকাল শুরু হয়, আর কান্নায় রাত ফুরায়!💖 💌🩵",
 " যে সম্পর্ক চোখে দেখা যায় না,\nতবুও মন জুড়ে থাকে — সেটাই সবচেয়ে সত্য ভালোবাসা!💖 🌙🥺",
 " তুমি হয়তো দূরে আছো,\nকিন্তু আমার প্রতিটা অনুভূতির ঠিকানা এখনো তুমি!💖 💞🕊️",
 " চোখের ভাষা বোঝে যে, সে-ই প্রিয় মানুষ।\nকারণ ভালোবাসা কখনো শব্দে নয়, দৃষ্টিতে প্রকাশ পায়!💖 🌸✨",
 " তুমি কেবল মানুষ না,\nতুমি একটা মিষ্টি অভ্যাস — যাকে ছাড়াও বাঁচা যায় না!💖 🐻🌈"
 ];
 
 
 const randomCaption = captions[Math.floor(Math.random() * captions.length)];

 if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
 else {
 const one = senderID, two = mention[0];
 return makeImage({ one, two }).then(path => api.sendMessage({ 
 body: randomCaption, 
 attachment: fs.createReadStream(path) 
 }, threadID, () => fs.unlinkSync(path), messageID));
 }
}