const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "hey",
    version: "1.0",
    author: "Rakib",
    shortDescription: "Hey command with voice",
    longDescription: "Replies with a hey message and voice",
    category: "fun",
    guide: {
      en: "Type: 🙂"
    },
    usePrefix: true,
    onChat: true
  },

  onStart: async ({ message }) => {
    await sendHey(message);
  },

  onChat: async ({ event, message }) => {
    const text = event.body?.toLowerCase().trim();
    if (text === "🙂") {
      await sendHey(message);
    }
  }
};

async function sendHey(message) {
  const voiceUrl = "https://files.catbox.moe/twcmtu.mp3";
  const cacheDir = path.join(__dirname, "cache");
  const voicePath = path.join(cacheDir, "hey.mp3");

  try {
    // Ensure cache folder exists
    await fs.ensureDir(cacheDir);

    // Download audio
    const res = await axios({
      method: "GET",
      url: voiceUrl,
      responseType: "stream"
    });

    const writer = res.data.pipe(fs.createWriteStream(voicePath));

    writer.on("finish", async () => {
      await message.reply({
        body: `
👋 HEY THERE!

I'm here and ready to chat 😄
Just say the word!

— E'wr Hina
        `,
        attachment: fs.createReadStream(voicePath)
      });

      // Delete audio after sending
      fs.unlinkSync(voicePath);
    });

    writer.on("error", (err) => {
      console.error("Audio write error:", err);
      message.reply("❌ Failed to load voice.");
    });

  } catch (err) {
    console.error("Audio download error:", err);
    message.reply("❌ Something went wrong.");
  }
  }
