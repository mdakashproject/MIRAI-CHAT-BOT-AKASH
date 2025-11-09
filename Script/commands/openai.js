const axios = require("axios");

module.exports.config = {
  name: "openai",
  version: "3.0.4",
  hasPermssion: 0,
  credits: "Rx Abdullah",
  description: "ChatGPT-3.5 power by rX",
  commandCategory: "box",
  cooldowns: 3,
  usePrefix: true
};

let activeAIReplies = new Set();

async function getBaseApiUrl() {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/rummmmna21/rx-api/refs/heads/main/baseApiUrl.json");
    if (!res.data.gpt) throw new Error("GPT API URL not found in GitHub content");
    return res.data.gpt.trim().replace(/\/+$/, ""); // remove trailing /
  } catch (e) {
    console.error("❌ Could not load API base from GitHub:", e.message);
    throw new Error("❌ API base URL not found on GitHub");
  }
}

async function showTypingFor(api, threadID, ms) {
  try {
    await api.sendTypingIndicatorV2(true, threadID);
    await new Promise(r => setTimeout(r, ms));
    await api.sendTypingIndicatorV2(false, threadID);
  } catch (err) {
    console.log("⚠️ Typing indicator error:", err.message);
  }
}

async function getAIReply(baseUrl, question, imageUrl) {
  let apiUrl = `${baseUrl}/mrx/gpt.php?ask=${encodeURIComponent(question)}`;
  if (imageUrl) apiUrl += `&img=${encodeURIComponent(imageUrl)}`;
  const res = await axios.get(apiUrl);
  return typeof res.data === "object" ? res.data.answer || JSON.stringify(res.data) : res.data || "⚠️ No response from API.";
}

async function processQuestion(api, event, question) {
  const baseUrl = await getBaseApiUrl();
  let imageUrl = event.messageReply?.attachments?.[0]?.type === "photo" ? event.messageReply.attachments[0].url : null;

  // Start typing for 3 seconds
  const typingPromise = showTypingFor(api, event.threadID, 4000);

  // Call API
  const replyPromise = getAIReply(baseUrl, question, imageUrl);

  // Wait for 3s typing
  await typingPromise;

  let reply;
  try {
    reply = await Promise.race([
      replyPromise,
      new Promise(resolve => setTimeout(() => resolve(null), 0)) // immediate fallback if not ready
    ]);

    if (!reply) {
      // API not yet returned after 3s: send "thinking" message and wait for API
      const thinkingMsg = await api.sendMessage("Thinking for a better answer...", event.threadID);
      reply = await replyPromise; // wait for real API
      await api.editMessage(reply, thinkingMsg.messageID);
      activeAIReplies.add(thinkingMsg.messageID);
      return;
    }

    // API returned within 3s: send directly
    const sentMsg = await api.sendMessage(reply, event.threadID);
    activeAIReplies.add(sentMsg.messageID);
  } catch (err) {
    console.error(err);
    await api.sendMessage("❌ Error contacting AI server.", event.threadID);
  }
}

module.exports.run = async ({ api, event, args }) => {
  const question = args.join(" ") || event.messageReply?.body;
  if (!question) return api.sendMessage("❌ Please provide a question or reply with !openai + text.", event.threadID, event.messageID);

  await processQuestion(api, event, question);
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.messageReply || !activeAIReplies.has(event.messageReply.messageID)) return;
  const question = event.body;
  if (!question) return;

  await processQuestion(api, event, question);
};
