exports.config = {
  name: "fork",
  version: "5.0",
  author: "MOHAMMAD AKASH",
  countDown: 0,
  role: 0,
  shortDescription: "Fork Link",
  longDescription: "Responds with GitHub repo link when 'fork' or 'repository' is mentioned. Cooldown: 10 seconds.",
  category: "system",
  guide: {
    en: "Type 'fork' or 'repository'"
  }
};

const last = {};
const cool = 10000;

exports.onStart = async function(){};

exports.onChat = async function({event: z, api: y}){
  const t = z.threadID;
  const n = Date.now();
  if(last[t] && n - last[t] < cool) return;
  const m = (z.body || "").toLowerCase().trim();
  if(!m) return;
  const fork = m.includes("fork") || m.includes("repository");
  if(fork){
    y.sendMessage("📗 My GitHub Repo:\nhttps://github.com/shorovgaming089-rgb/HINATA_Goatbot-V3.git", t, z.messageID);
    last[t] = n;
  }
};
