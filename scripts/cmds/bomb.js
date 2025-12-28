const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database", "coin.json");

// in-memory game store
const bombGame = {};

// DB load
function loadDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}");
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

// DB save
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "bomb",
    version: "1.0",
    author: "Tsukiyo",
    role: 0,
    category: "game",
    guide: { en: "!bomb" }
  },

  // game start
  onStart: async function ({ api, event }) {
    const msg =
`💣 BOMB GAME (2 BOMBS)

Choose a box (1 - 5)

📦 1   📦 2   📦 3   📦 4   📦 5

✅ Safe  → +40 coin
💥 Bomb → -80 coin

Reply with a number`;

    api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) return;

      // random bombs
      const boxes = [1, 2, 3, 4, 5];
      boxes.sort(() => Math.random() - 0.5);
      const bombs = boxes.slice(0, 2);

      bombGame[info.messageID] = {
        author: event.senderID,
        bombs
      };
    });
  },

  // reply handler
  onChat: async function ({ api, event }) {
    if (event.type !== "message_reply") return;

    const replyID = event.messageReply.messageID;
    const game = bombGame[replyID];
    if (!game) return;

    if (event.senderID !== game.author) {
      return api.sendMessage("❌ This is not your game", event.threadID);
    }

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > 5) {
      return api.sendMessage("❌ Reply only with a number (1-5)", event.threadID);
    }

    const db = loadDB();
    if (!db[event.senderID]) db[event.senderID] = { coin: 0 };

    let resultMsg = "";
    if (game.bombs.includes(choice)) {
      db[event.senderID].coin -= 80;
      resultMsg =
`💥 BOOM!
You chose box ${choice}

❌ -80 coin
💰 Balance: ${db[event.senderID].coin}`;
    } else {
      db[event.senderID].coin += 40;
      resultMsg =
`✅ SAFE!
You chose box ${choice}

➕ +40 coin
💰 Balance: ${db[event.senderID].coin}`;
    }

    saveDB(db);
    delete bombGame[replyID];

    api.sendMessage(resultMsg, event.threadID);
  }
};
