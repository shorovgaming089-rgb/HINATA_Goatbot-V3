const a = require("axios");
const b = require("fs");
const c = require("path");
const d = require("yt-search");

async function getStream(url) {
  const res = await a({ url, responseType: "stream" });
  return res.data;
}

module.exports = {
  config: {
    name: "song",
    aliases: ["sing"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: "Sing tomake chai",
    longDescription: "Search and download music from YouTube",
    category: "MUSIC",
    guide: "/play <song name or YouTube URL>"
  },

  onStart: async function ({ api: e, event: f, args: g, commandName: cmd }) {
    if (!g.length) return e.sendMessage("❌ Provide a song name or YouTube URL.", f.threadID, f.messageID);

    const aryan = g;
    const query = aryan.join(" ");
    if (query.startsWith("http")) return downloadSong(query, e, f);

    try {
      const res = await d(query);
      const results = res.videos.slice(0, 6);
      if (!results.length) return e.sendMessage("❌ No results found.", f.threadID, f.messageID);

      let msg = "";
      results.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n⏱ ${v.timestamp} | 👀 ${v.views}\n\n`;
      });

      const thumbs = await Promise.all(results.map(v => getStream(v.thumbnail)));

      e.sendMessage(
        { body: msg + "Reply with number (1-6) to download song", attachment: thumbs },
        f.threadID,
        (err, info) => {
          if (err) return console.error(err);
          global.GoatBot.onReply.set(info.messageID, {
            results,
            messageID: info.messageID,
            author: f.senderID,
            commandName: cmd
          });
        },
        f.messageID
      );
    } catch (err) {
      console.error(err);
      e.sendMessage("❌ Failed to search YouTube.", f.threadID, f.messageID);
    }
  },

  onReply: async function ({ api: e, event: f, Reply: g }) {
    const results = g.results;
    const choice = parseInt(f.body);

    if (isNaN(choice) || choice < 1 || choice > results.length) {
      return e.sendMessage("❌ Invalid selection.", f.threadID, f.messageID);
    }

    const selected = results[choice - 1];
    await e.unsendMessage(g.messageID);

    downloadSong(selected.url, e, f, selected.title);
  }
};

async function downloadSong(url, api, event, title = null) {
  try {
    const apiUrl = `http://65.109.80.126:20409/aryan/play?url=${encodeURIComponent(url)}`;
    const res = await a.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.downloadUrl) throw new Error("API failed to return download URL.");

    const songTitle = title || data.title;
    const fileName = `${songTitle}.mp3`.replace(/[\\/:"*?<>|]/g, "");
    const filePath = c.join(__dirname, fileName);

    const songData = await a.get(data.downloadUrl, { responseType: "arraybuffer" });
    b.writeFileSync(filePath, songData.data);

    await api.sendMessage(
      { body: `• ${songTitle}`, attachment: b.createReadStream(filePath) },
      event.threadID,
      () => b.unlinkSync(filePath),
      event.messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage(`❌ Failed to download song: ${err.message}`, event.threadID, event.messageID);
  }
}
