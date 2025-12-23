const os = require("os");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "5.1",
    author: "Alamin",
    role: 0,
    shortDescription: "Show bot uptime with moon phase animation",
    longDescription: "Displays bot uptime stats in stylish moon-phase animation format with total users and threads.",
    category: "system",
    guide: "{p}uptime"
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const loadingFrames = [
      "🌑 [░░░░░░░░░░░░░░] 0%",
      "🌒 [▓▓▓▓░░░░░░░░░░] 25%",
      "🌓 [▓▓▓▓▓▓▓▓░░░░░░] 50%",
      "🌔 [▓▓▓▓▓▓▓▓▓▓▓▓░░] 75%",
      "🌕 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%"
    ];

    try {
      // Step 1: Loading animation
      const loadingMsg = await api.sendMessage(
        `🌕 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞...\n${loadingFrames[0]}`,
        event.threadID
      );

      for (let i = 1; i < loadingFrames.length; i++) {
        await delay(400);
        await api.editMessage(
          `🌕 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞...\n${loadingFrames[i]}`,
          loadingMsg.messageID
        );
      }

      // Step 2: Calculate uptime and system info
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
      const ping = Math.floor(Math.random() * 100) + 50; // simulated ping

      // Step 3: Date (Bangladesh timezone)
      const date = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      // Step 4: Total users & threads
      let totalUsers = 0;
      let totalThreads = 0;

      if (usersData && typeof usersData.getAll === "function") {
        const allUsers = await usersData.getAll();
        totalUsers = allUsers.length;
      }

      if (threadsData && typeof threadsData.getAll === "function") {
        const allThreads = await threadsData.getAll();
        totalThreads = allThreads.length;
      }

      // Step 5: Final output
      const finalMessage = `
> 🎀 𝐵𝑜𝑡 𝑈𝑝𝑡𝑖𝑚𝑒 𝐼𝑛𝑓𝑜

🕒 ᴜᴘᴛɪᴍᴇ : ${uptimeFormatted}
📶 ᴘɪɴɢ     : ${ping}ms
📅 ᴅᴀᴛᴇ    : ${date}
💻 ᴍᴇᴍᴏʀʏ : ${memoryUsage} MB
👥 ᴛᴏᴛᴀʟ ᴜꜱᴇʀꜱ : ${totalUsers}
💬 ᴛᴏᴛᴀʟ ᴛʜʀᴇᴀᴅꜱ : ${totalThreads}
👑 ᴏᴡɴᴇʀ  : Muhammad Sou Rav
      `.trim();

      await delay(300);
      await api.editMessage(finalMessage, loadingMsg.messageID);
    } catch (err) {
      console.error("Uptime command error:", err);
      api.sendMessage("❌ Failed to load uptime info.", event.threadID);
    }
  }
};
