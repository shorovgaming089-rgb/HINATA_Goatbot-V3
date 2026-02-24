const { getTime } = global.utils;

module.exports = {
  config: {
    name: "antispam",
    version: "3.0",
    author: "xalman",
    countDown: 5,
    role: 0,
    description: "autoban spammer, To unban: (PN) user unban (mention, reply,uid)",
    category: "system"
  },

  onChat: async ({ api, event, usersData, message }) => {
    const { senderID, threadID, body, mentions } = event;
    if (!body) return;

    const threadSetting = global.data.threadData.get(threadID) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    const botID = api.getCurrentUserID();

    const isCommand = body.startsWith(prefix);
    const isMentioned = mentions && Object.keys(mentions).includes(botID);

    if (!isCommand && !isMentioned) return;

    const userData = await usersData.get(senderID);
    if (userData.banned && userData.banned.status) return;

    if (!global.spamTracker) global.spamTracker = new Map();
    const now = Date.now();
    const tracker = global.spamTracker.get(senderID) || { count: 0, lastMsg: now };

    if (now - tracker.lastMsg < 3000) { 
      tracker.count++;
    } else {
      tracker.count = 1;
    }

    tracker.lastMsg = now;
    global.spamTracker.set(senderID, tracker);

    if (tracker.count >= 4) {
      const time = getTime("DD/MM/YYYY HH:mm:ss");
      
      await usersData.set(senderID, {
        banned: {
          status: true,
          reason: "Spamming Bot Mentions/Commands",
          date: time
        }
      });
      
      message.reply(`🛑 @${senderID}, বারবার বটকে কমান্ড দিয়ে বিরক্ত করার জন্য আপনাকে ban করা হয়েছে!\n» সময়: ${time}`);
      global.spamTracker.delete(senderID);
    }
  },

  onStart: async ({ message }) => {
    message.reply("Anti-Spam system is active for bot interactions.");
  }
};
