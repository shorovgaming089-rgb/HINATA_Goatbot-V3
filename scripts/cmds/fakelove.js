module.exports = {
  config: {
    name: "fakelove",
    version: "2.0",
    author: "Sourav Ahmed",
    countDown: 5,
    role: 0,
    shortDescription: "All in one fake love system",
    longDescription: "",
    category: "fun",
    guide: "{pn} [love | breakup | marriage | crush | help] @mention"
  },

  onStart: async function ({ message, event, api, args }) {

    if (!args[0] || args[0] === "help") {
      return message.reply(
`💘 FAKE LOVE CALCULATOR HELP 💘

Usage:

fakelove love @mention
fakelove breakup @mention
fakelove marriage @mention
fakelove crush @mention

Example:
fakelove love @Rahim

***_Powered by Sourav Ahmed ⚡_***`
      );
    }

    const type = args[0].toLowerCase();
    const mention = Object.keys(event.mentions);

    if (!mention.length) {
      return message.reply("😒 কাউরে mention কর আগে!");
    }

    const user1 = event.senderID;
    const user2 = mention[0];

    const name1 = (await api.getUserInfo(user1))[user1].name;
    const name2 = event.mentions[user2];

    const percent = Math.floor(Math.random() * 101);

    let response;

    if (type === "love") {

      response = 
`💘 LOVE RESULT 💘

${name1} ❤️ ${name2}
Love: ${percent}%

${percent < 30 ? "💀 Enemy vibe!" :
percent < 60 ? "🙂 Friendzone loading..." :
percent < 85 ? "😍 Strong crush energy!" :
"🔥 Soulmate detected! বিয়ের তারিখ ঠিক কর 😈💍"}`;

    }

    else if (type === "breakup") {

      response = 
`💔 BREAKUP SCAN 💔

${name1} 💔 ${name2}
Breakup Chance: ${percent}%

${percent < 40 ? "😍 Relationship stable!" :
percent < 70 ? "😬 Danger zone!" :
"💀 Very toxic! Save yourself 🤡"}`;

    }

    else if (type === "marriage") {

      response = 
`💍 MARRIAGE PREDICTION 💍

${name1} ❤️ ${name2}
Marriage Probability: ${percent}%

${percent < 50 ? "😅 Biye korte aro 10 bochor lagbo!" :
percent < 80 ? "🙂 Family meeting soon..." :
"🔥 Wedding card print kore fel 😈"}`;

    }

    else if (type === "crush") {

      response = 
`😈 SECRET CRUSH DETECTOR 😈

${name2} secretly loves ${name1} ?

Chance: ${percent}%

${percent < 40 ? "🤡 Nope, imagination only!" :
percent < 75 ? "😉 Suspicious vibes..." :
"🔥 100% crush confirmed!"}`;

    }

    else {
      return message.reply("❌ Invalid option! Type fakelove help");
    }

    return message.reply(
`${response}

`
    );
  }
};
