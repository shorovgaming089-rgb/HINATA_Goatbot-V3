module.exports = {
  config: {
    name: "iftar",
    aliases: ["seheri", "roza"],
    role: 0,
    version: "3.1.0",
    author: "dipto",
    description: "Fixed Premium Ramadan Interface",
    category: "Islamic",
    guide: {
      en: "[city] --c [color]"
    },
  },
  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const dipto = "https://api.noobs-api.rf.gd/dipto";
    
    let city = args[0] || "Dhaka",
        color = args.includes("--c") ? args[args.indexOf("--c") + 1] : "white",
        url = `${dipto}/ifter?city=${encodeURIComponent(city)}${color ? `&color=${encodeURIComponent(color)}` : "white"}`;

    // শুধুমাত্র টেক্সট স্টাইল করার জন্য Boldserif ফন্ট ফাংশন
    const boldSerif = (text) => {
      const letters = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
        'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳'
      };
      return text.split('').map(char => letters[char] || char).join('');
    };

    try {
      let { data } = await axios.get(url);
      if (!data.today) return api.sendMessage("⚠️ Invalid city name!", event.threadID);

      let ramadanNumber = data.today.ramadan.replace(/\D/g, ""); 
      
      let msg = `🌙 ${boldSerif("Ramadan Kareem")}\n` +
                `◈━━━━━━━━━━━━━━━◈\n\n` +
                `📍 ${boldSerif("CITY")}: ${data.city.toUpperCase()}\n\n` +
                `｢ ${boldSerif("TODAY'S TIMING")} ｣\n` +
                `🌅 ${boldSerif("Sehri Ends")} : ${data.today.sehri}\n` +
                `🕌 ${boldSerif("Fajr Time")}  : ${data.today.fajr}\n` +
                `🌆 ${boldSerif("Iftar Time")} : ${data.today.iftar}\n\n` +
                `⏳ ${boldSerif("REMAINING TIME")}\n` +
                `◽ ${boldSerif("Sehri")}: ${data.sahriRemain}\n` +
                `◽ ${boldSerif("Iftar")}: ${data.iftarRemain}\n\n` +
                `📅 ${boldSerif("TOMORROW PLAN")}\n` +
                `» ${boldSerif("Sehri")}: ${data.tomorrow.sehri}\n` +
                `» ${boldSerif("Iftar")}: ${data.tomorrow.iftar}\n` +
                `» ${boldSerif("Date")}: ${data.tomorrowDate}\n\n` +
                `⏰ ${boldSerif("Current Time")}: ${data.currentTime}\n` +
                `◈━━━━━━━━━━━━━━━◈\n` +
                `🤲 ${boldSerif("DUA (IFTAR)")}\n` +
                `"Allahumma laka sumtu wa ala rizqika aftartu."`;

      api.sendMessage({ 
        body: msg, 
        attachment: (await axios.get(data.imgUrl, { responseType: "stream" })).data 
      }, event.threadID, event.messageID);

    } catch (e) {
      api.sendMessage("❌ Connection failed! Try again later.", event.threadID, event.messageID);
      console.log(e);
    }
  }
};
