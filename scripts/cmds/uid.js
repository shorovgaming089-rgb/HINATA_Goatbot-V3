const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "uid",
    version: "0.0.1",
    author: "Sourav Ahmed",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get user's UID and Stylist Banner"
    },
    longDescription: {
      en: "Generates an advanced Stylist style banner with User ID and Avatar."
    },
    category: "info",
    guide: {
      en: "{pn} [mention | reply | leave blank]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const cachePath = path.join(__dirname, "cache", "uid_card.png");

    // 1. Find Target User ID
    let targetID = senderID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0) {
      // Check if argument is a number (UID)
      if (!isNaN(args[0])) {
        targetID = args[0];
      }
      // Note: UID from vanity URL requires extra API calls, skipping for basic stability
    }

    // Send processing message
    const processMsg = await api.sendMessage("-ˋˏ✄┈┈┈┈", threadID);

    try {
      // 2. Fetch User Data
      const userData = await usersData.get(targetID);
      const name = userData.name || "Unknown User";
      const username = name.toUpperCase();

      // 3. Setup Canvas (1200x500 - High Quality Banner)
      const width = 1200;
      const height = 500;
      const canvas = createCanvas(width, height);
