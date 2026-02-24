module.exports = {
config: {
name: "dirim",
version: "1.0.0",
role: 0,
author: "Milon",
description: "কেউ dirim বললে ভয়েজ রিপ্লাই দিবে",
category: "funny",
guide: "{pn}",
countDown: 5
},

onStart: async function ({ message, event }) {
// সরাসরি কমান্ড দিলে যা হবে
const voiceUrl = "https://files.catbox.moe/t0l0cg.mp3";
return message.reply({
body: "এই নিন আপনার ভয়েজ!",
attachment: await global.utils.getStreamFromURL(voiceUrl)
});
},

onChat: async function ({ message, event }) {
// চ্যাটে কেউ 'dirim' শব্দটা লিখলে অটোমেটিক কাজ করবে
const { body } = event;
if (!body) return;

const triggerWord = "dirim";
const voiceUrl = "https://files.catbox.moe/w3y1b5.mp3";

if (body.toLowerCase().includes(triggerWord)) {
try {
return message.reply({
attachment: await global.utils.getStreamFromURL(voiceUrl)
});
} catch (err) {
console.error("Error sending voice in GoatBot:", err);
}
}
}
};
