const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
config: {
name: "texttovoice",
version: "1.1.1",
author: "Milon + updated by Sourav Ahmed",
countDown: 5, // সময় বাড়িয়ে ৫ সেকেন্ড করা হলো
role: 0,
shortDescription: "Ultra Fast Voice Reply",
longDescription: "Sends specific voice messages instantly using local cache",
category: "system"
},

onStart: async function () {},

onChat: async function ({ event, message }) {
if (!event.body) return;

const input = event.body.toLowerCase().trim();

// --- কি-ওয়ার্ড এবং লিংক ---
const voiceMap = {
"i love you": "https://files.catbox.moe/ir93iv.mp3",
"raihan": "https://files.catbox.moe/3a8u8i.mp3",
"bot": "https://files.catbox.moe/m9apy8.mp3",
"dirim": "https://files.catbox.moe/1rk48q.mp4",
"matha betha": "https://files.catbox.moe/w2ai07.mp3"
};

if (voiceMap[input]) {
const audioUrl = voiceMap[input];
const cacheDir = path.join(__dirname, "cache", "voices");
fs.ensureDirSync(cacheDir);

// ফাইলের নাম কি-ওয়ার্ড অনুযায়ী সেভ হবে যাতে বারবার ডাউনলোড না লাগে
const fileName = `${Buffer.from(input).toString('hex')}.mp3`;
const filePath = path.join(cacheDir, fileName);

try {
// যদি ফাইলটি আগে থেকেই ডাউনলোড করা থাকে, তবে সরাসরি পাঠিয়ে দিবে
if (fs.existsSync(filePath)) {
return await message.reply({ attachment: fs.createReadStream(filePath) });
}

// ফাইল না থাকলে ডাউনলোড করবে (শুধু প্রথমবার)
const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
fs.writeFileSync(filePath, Buffer.from(response.data));

await message.reply({ attachment: fs.createReadStream(filePath) });

} catch (error) {
console.error("Error sending voice:", error);
}
}
}
};