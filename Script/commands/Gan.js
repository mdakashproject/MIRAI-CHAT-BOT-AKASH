const fs = require("fs");
const request = require("request");

let lastPlayed = -1;

module.exports.config = {
 name: "gan",
 version: "1.0.0",
 hasPermission: 0,
 credits: "𝐀𝐊𝐀𝐒𝐇",
 description: "Play random song with prefix command",
 commandCategory: "music",
 usages: "[prefix]gan",
 cooldowns: 5
};

const songLinks = [
"https://drive.google.com/uc?export=download&id=1O6QyM8DWiI7nUuxFqGTPLmPb0InfBIaV",
"https://drive.google.com/uc?export=download&id=1x72FcjgSbSYnxkmm-hxNEPsoBPv9oS5a",
"https://drive.google.com/uc?export=download&id=1ojdAjHPIFO83FrddFcTEL0UbfMKbUSCX",
"https://drive.google.com/uc?export=download&id=1mTJk7eaSJhOvR7M3EoE6gS9kCpIxqUC7",
"https://drive.google.com/uc?export=download&id=1RxI3YUo9IhXr4YzVRcAZCpfzOTWN3EUj",
"https://drive.google.com/uc?export=download&id=11cuSHsHooeXg-amKcsdxLBBrbFLS-VTN",
"https://drive.google.com/uc?export=download&id=1hZR8uXhqWE6QqVtwAAXtjI4u4vbm3TVh",
"https://drive.google.com/uc?export=download&id=1Yud0fl8FQc1je-eqB9cyMH2bn1iVQgv-",
"https://drive.google.com/uc?export=download&id=1mtfIAxj5mXjh0Q9yDl0f_1PoRRN9TKdl",
"https://drive.google.com/uc?export=download&id=1LVApSdA4Rzde-1pRbaPpkXhiSGeoOHdO",
"https://drive.google.com/uc?export=download&id=1LVApSdA4Rzde-1pRbaPpkXhiSGeoOHdO",
"https://drive.google.com/uc?export=download&id=1HMO1Fjz0aAMUh_AFaVF3psXIUfO1Uadr",
"https://drive.google.com/uc?export=download&id=1I7Xr0PHs8sm41M525ZdPBC6CQ3bWjN2u"
];

module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID } = event;

 if (songLinks.length === 0) {
 return api.sendMessage("❌ No songs available in the list!", threadID, messageID);
 }

 // Set reaction to indicate processing
 api.setMessageReaction("⌛", messageID, () => {}, true);

 // Select a random song (different from last played)
 let index;
 do {
 index = Math.floor(Math.random() * songLinks.length);
 } while (index === lastPlayed && songLinks.length > 1);

 lastPlayed = index;
 const url = songLinks[index];
 const filePath = `${__dirname}/cache/mysong_${index}.mp3`;

 // Download and send the song
 request(encodeURI(url))
 .pipe(fs.createWriteStream(filePath))
 .on("close", () => {
 api.sendMessage({
 body: "🎶 Here's your requested song:",
 attachment: fs.createReadStream(filePath)
 }, threadID, () => {
 // Delete the file after sending
 try {
 fs.unlinkSync(filePath);
 } catch (err) {
 console.error("Error deleting file:", err);
 }
 }, messageID);
 })
 .on("error", (err) => {
 console.error("Download error:", err);
 api.sendMessage("❌ Failed to download the song. Please try again later.", threadID, messageID);
 });
};
