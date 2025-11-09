const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "MOHAMMAD AKASH",
  description: "Auto detects all commands and groups by category in styled format",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const commandDir = __dirname;
    const files = fs.readdirSync(commandDir).filter(f => f.endsWith(".js"));

    let commands = [];
    for (let file of files) {
      try {
        const cmd = require(path.join(commandDir, file));
        if (!cmd.config) continue;
        commands.push({
          name: cmd.config.name || file.replace(".js", ""),
          category: cmd.config.commandCategory || "Other",
          description: cmd.config.description || "No description available.",
          author: cmd.config.credits || "Unknown",
          version: cmd.config.version || "N/A",
          usages: cmd.config.usages || "No usage info",
        });
      } catch (e) {}
    }

    // Fancy font function
    const fontMap = {
      A:"𝙰", B:"𝙱", C:"𝙲", D:"𝙳", E:"𝙴", F:"𝙵", G:"𝙶", H:"𝙷", I:"𝙸", J:"𝙹",
      K:"𝙺", L:"𝙻", M:"𝙼", N:"𝙽", O:"𝙾", P:"𝙿", Q:"𝚀", R:"𝚁", S:"𝚂",
      T:"𝚃", U:"𝚄", V:"𝚅", W:"𝚆", X:"𝚇", Y:"𝚈", Z:"𝚉",
      a:"𝚊", b:"𝚋", c:"𝚌", d:"𝚍", e:"𝚎", f:"𝚏", g:"𝚐", h:"𝚑", i:"𝚒", j:"𝚓",
      k:"𝚔", l:"𝚕", m:"𝚖", n:"𝚗", o:"𝚘", p:"𝚙", q:"𝚚", r:"𝚛", s:"𝚜",
      t:"𝚝", u:"𝚞", v:"𝚟", w:"𝚠", x:"𝚡", y:"𝚢", z:"𝚣"
    };
    const fancy = str => str.replace(/[A-Za-z]/g, c => fontMap[c] || c);

    // Group commands by category
    const categories = {};
    for (let cmd of commands) {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd.name);
    }

    // if user uses !help [command]
    if (args[0]) {
      const name = args[0].toLowerCase();
      const cmd = commands.find(c => c.name.toLowerCase() === name);
      if (!cmd) return api.sendMessage(`❌ Command "${name}" not found.`, event.threadID, event.messageID);

      let msg = `╭──❏ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟 ❏──╮\n`;
      msg += `│ ✧ Name: ${fancy(cmd.name)}\n`;
      msg += `│ ✧ Category: ${fancy(cmd.category)}\n`;
      msg += `│ ✧ Version: ${fancy(cmd.version)}\n`;
      msg += `│ ✧ Author: ${fancy(cmd.author)}\n`;
      msg += `╰─────────────────────⭓\n`;
      msg += `📘 Description: ${fancy(cmd.description)}\n`;
      msg += `📗 Usage: ${global.config.PREFIX || "/"}${cmd.name} ${cmd.usages}`;

      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    // Build menu message
    let msg = `✨ 𝙼𝙸𝚁𝙰𝙸 𝙼𝙴𝙽𝚄 ✨\n`;
    msg += "━━━━━━━━━━━━━━━━━━━\n\n";

    // Define emoji per category
    const emojiMap = {
      "system":"⚙️", "fun":"🎯", "owner":"👑", "image":"🖼️",
      "admin":"🛡️", "tools":"🧰", "utility":"🔧", "ai":"🤖",
      "music":"🎵", "game":"🎮", "media":"🎬", "info":"ℹ️", "other":"📁"
    };

    const sortedCategories = Object.keys(categories).sort();
    for (const cat of sortedCategories) {
      const emoji = emojiMap[cat.toLowerCase()] || "📁";
      msg += `${emoji} 𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝚈: ${fancy(cat.toUpperCase())}\n`;
      msg += categories[cat].map(c => `🔹 ${fancy(c)}`).join("\n") + "\n\n";
    }

    msg += "━━━━━━━━━━━━━━━━━━━\n";
    msg += `💡 𝚃𝙸𝙿: 𝚄𝚂𝙴 "${global.config.PREFIX || "/"}help [command]" 𝚃𝙾 𝙶𝙴𝚃 𝙵𝚄𝙻𝙻 𝙳𝙴𝚃𝙰𝙸𝙻𝚂.\n`;
    msg += "🪄 𝙱𝙾𝚃 𝙱𝚈: 𝙼𝙾𝙷𝙰𝙼𝙼𝙰𝙳 𝙰𝙺𝙰𝚂𝙷 ✨";

    api.sendMessage(msg, event.threadID, event.messageID);

  } catch (err) {
    api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
  }
};
