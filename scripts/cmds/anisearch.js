const axios = require("axios");

async function getStreamFromURL(url) {
  const response = await axios.get(url, { 
    responseType: "stream",
    timeout: 10000, 
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    }
  });
  return response.data;
}

async function fetchAnime(query) {
  try {
    const endpoint = query
      ? `https://toshiro-aniserarch.vercel.app/tiktok/search?query=${encodeURIComponent(query)}`
      : `https://toshiro-aniserarch.vercel.app/tiktok/random`;

    const res = await axios.get(endpoint);

    if (query) return res.data?.list || [];
    return res.data ? [res.data] : [];
  } catch (e) {
    console.error("API Fetch Error:", e.message);
    return [];
  }
}

module.exports = {
  config: {
    name: "anisearch",
    aliases: ["ani", "anisrc"],
    author: "Toshiro Editz ❄️",
    version: "2.5",
    shortDescription: { en: "Anime edit search or random" },
    longDescription: { en: "Send random anime edit or search by keyword" },
    category: "anime",
    guide: { en: "{p}{n} [anime name]" },
  },

  onStart: async function ({ api, event, args }) {
    api.setMessageReaction("🔍", event.messageID, event.threadID, () => {}, true);

    const query = args.join(" ");
    const videos = await fetchAnime(query);

    if (!videos.length) {
      return api.sendMessage("No anime edits were found for your request.", event.threadID, event.messageID);
    }

    const v = videos[Math.floor(Math.random() * videos.length)];

    let authorName = "Unknown Creator";
    if (v.author) {
      authorName = typeof v.author === 'object' ? (v.author.nickname || v.author.unique_id) : v.author;
    }

    // --- FIX: REMOVE HASHTAGS FROM TITLE ---
    const rawTitle = v.title || "No Title Provided";
    const title = rawTitle.replace(/#\w+/g, '').trim();

    const videoUrl = v.video || v.play;

    if (!videoUrl) {
      return api.sendMessage("Source URL is missing.", event.threadID, event.messageID);
    }

    try {
      const stream = await getStreamFromURL(videoUrl);

      const msgBody = 
        `❄️ 𝗧𝗶𝘁𝗹𝗲: ${title}\n` +
        `👤 𝗔𝘂𝘁𝗵𝗼𝗿: ${authorName}\n` +
        `🎐 𝗠𝗼𝗱𝗲: ${query ? "Search" : "Random"}\n\n` +
        `𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗧𝗼𝘀𝗵𝗶𝗿𝗼 𝗘𝗱𝗶𝘁𝘇❄️`;

      await api.sendMessage(
        {
          body: msgBody,
          attachment: stream,
        },
        event.threadID,
        event.messageID
      );

      api.setMessageReaction("✅", event.messageID, event.threadID, () => {}, true);

    } catch (err) {
      console.error("Download Error:", err.message);
      api.sendMessage("⚠️ Unable to stream this video. Try again.", event.threadID, event.messageID);
    }
  },
};
