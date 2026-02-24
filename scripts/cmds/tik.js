const axios = require("axios");

module.exports = {
  config: {
    name: "tik",
    version: "2.0",
    author: "SouRav Ahmed",
    countDown: 5,
    role: 0,
    shortDescription: "TikTok Pro Search",
    longDescription: "Auto region detect + trending + stats",
    category: "media",
    guide: "{pn} keyword"
  },

  onStart: async function ({ message, args }) {

    const query = args.join(" ");
    if (!query) return message.reply("Please provide a search keyword.");

    try {

      // 🌍 Auto Detect Region
      let region = "US";
      try {
        const geo = await axios.get("http://ip-api.com/json/");
        if (geo.data?.countryCode) {
          region = geo.data.countryCode;
        }
      } catch {}

      // 🔎 Search TikTok
      const api = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=10&cursor=0&region=${region}`;
      const res = await axios.get(api);

      if (!res.data?.data?.videos?.length) {
        return message.reply("No video found.");
      }

      // 🔥 Sort by like count (Trending style)
      const videos = res.data.data.videos.sort((a, b) => b.digg_count - a.digg_count);

      // 🎲 Random from top 5 trending
      const selected = videos[Math.floor(Math.random() * Math.min(5, videos.length))];

      const videoUrl = selected.play;
      const caption = selected.title || "No caption";
      const likes = selected.digg_count || 0;
      const comments = selected.comment_count || 0;
      const views = selected.play_count || 0;

      return message.reply({
        body:
`🌍 Region: ${region}

🎬 Search: ${query}

📝 Caption: ${caption}

❤️ Likes: ${likes}
💬 Comments: ${comments}
👀 Views: ${views}`,
        attachment: await global.utils.getStreamFromURL(videoUrl)
      });

    } catch (err) {
      console.error(err);
      return message.reply("TikTok Pro Error.");
    }
  }
};
