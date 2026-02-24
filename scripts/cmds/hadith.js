const axios = require("axios");

module.exports = {
  config: {
    name: "hadith",
    aliases: ["হাদিস"],
    version: "1.0",
    author: "Saim",
    countDown: 3,
    role: 0,
    shortDescription: "হাদিস দেখুন",
    longDescription: "রাসুল (সাঃ) এর হাদিস বাংলা ও আরবিতে দেখুন",
    category: "ইসলামিক",
    guide: "{pn} অথবা {pn} নম্বর"
  },

  onStart: async function ({ message, args }) {
    const hadithSource = "https://raw.githubusercontent.com/asgptbyadnan-cloud/Washiq-chat-bot/refs/heads/main/hadith.json";
    
    try {
      const waitMsg = await message.reply("একটু অপেক্ষা করুন... হাদিস আনা হচ্ছে 🕋");
      const response = await axios.get(hadithSource);
      const hadithList = response.data;
      await message.unsend(waitMsg.messageID);
      
      if (args[0] && !isNaN(args[0])) {
        let num = parseInt(args[0]) - 1;
        if (num < 0 || num >= hadithList.length) {
          return message.reply(`${hadithList.length} টি হাদিস আছে। ১ থেকে ${hadithList.length} এর মধ্যে লিখুন।`);
        }
        let h = hadithList[num];
        let output = `🕋 হাদিস নং: ${h.id}\n\n📖 আরবি:\n${h.arabic}\n\n📝 বাংলা:\n${h.bangla}\n\n📚 সূত্র: ${h.reference}\n\n${h.emoji}`;
        return message.reply(output);
      }
      
      let random = Math.floor(Math.random() * hadithList.length);
      let h = hadithList[random];
      let output = `🕋 হাদিস নং: ${h.id}\n\n📖 আরবি:\n${h.arabic}\n\n📝 বাংলা:\n${h.bangla}\n\n📚 সূত্র: ${h.reference}\n\n${h.emoji}\n\n🔍 নির্দিষ্ট হাদিস দেখতে /hadith ৫ (যেকোনো নম্বর দিন)`;
      return message.reply(output);
      
    } catch (error) {
      console.log(error);
      return message.reply("হাদিস লোড করতে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।");
    }
  }
};
