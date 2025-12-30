const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
 
module.exports = {
  config: {
    name: 'sanda',
    version: '2.0',
    author: 'NAFIJ PRO Ã— Eren',
    role: 0,
    category: 'fun',
    shortDescription: 'Turn someone into sanda meme',
    longDescription: 'Put user avatar on sanda character',
    guide: '{pn} @mention'
  },
 
  onStart: async function ({ event, api, message, usersData }) {
    try {
      // Get target user
      const targetID = event.mentions && Object.keys(event.mentions).length > 0 
        ? Object.keys(event.mentions)[0]
        : event.messageReply?.senderID;
 
      if (!targetID) 
        return message.reply('ðŸ”¹ Mention or reply to someone!');
      if (targetID === event.senderID) 
        return message.reply('ðŸ˜‚ Don\'t sanda yourself, bro!');
 
      await message.reply('âŒ› processing...');
 
      // Fetch avatar
      const fetchAvatar = async (uid) => {
        try {
          const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
          const finalUrl = avatarUrl.includes('?') 
            ? `${avatarUrl}&t=${Date.now()}`
            : `${avatarUrl}?t=${Date.now()}`;
          const response = await axios.get(finalUrl, { responseType: 'arraybuffer', timeout: 10000 });
          if (!response.data || response.data.length < 1024) throw new Error('Invalid image data');
          return Buffer.from(response.data);
        } catch (error) {
          // Fallback to usersData
          try {
            const fallbackUrl = await usersData.getAvatarUrl(uid);
            if (fallbackUrl) {
              const fallbackRes = await axios.get(fallbackUrl, { responseType: 'arraybuffer' });
              return Buffer.from(fallbackRes.data);
            }
          } catch { }
          throw new Error('Could not fetch profile picture');
        }
      };
 
      const cacheDir = path.join(__dirname, 'cache', 'sanda');
      await fs.ensureDir(cacheDir);
      const bgPath = path.join(cacheDir, 'sanda_bg.jpg');
      let bgImage;
      if (fs.existsSync(bgPath)) {
        const bgBuffer = await fs.readFile(bgPath);
        bgImage = await loadImage(bgBuffer);
      } else {
        const imgUrl = "https://raw.githubusercontent.com/alkama844/res/main/image/sanda.jpg";
        const bgResponse = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 20000 });
        await fs.writeFile(bgPath, Buffer.from(bgResponse.data));
        bgImage = await loadImage(Buffer.from(bgResponse.data));
      }
 
      const avatarBuffer = await fetchAvatar(targetID);
      const avatarImage = await loadImage(avatarBuffer);
 
      const canvas = createCanvas(bgImage.width, bgImage.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bgImage, 0, 0);
 
      // Set avatar size to 155 as requested
      const avatarSize = 155; // Changed to exactly 155
      const centerX = (bgImage.width - avatarSize) / 2;
      const faceY = 150;
 
      // Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX + avatarSize / 2, faceY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.drawImage(avatarImage, centerX, faceY, avatarSize, avatarSize);
      ctx.restore();
 
      ctx.beginPath();
      ctx.arc(centerX + avatarSize / 2, faceY + avatarSize / 2, avatarSize / 2 + 1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
 
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'right';
      ctx.fillText('Sanda Meme', bgImage.width - 20, bgImage.height - 20);
 
      const outputPath = path.join(cacheDir, `${targetID}_${Date.now()}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(outputPath, buffer);
 
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || 'Someone';
 
      // Send result
      await message.reply({
        body: `ðŸ˜‚ ${userName} à¦à¦–à¦¨ à¦à¦•à¦¦à¦® à¦†à¦¸à¦² à¦¸à¦¾à¦¨à§à¦¦à¦¾ à¦¹à¦‡à¦›à§‡!\nðŸ¦¥âœ¨!"`,
        mentions: [{ tag: userName, id: targetID }],
        attachment: fs.createReadStream(outputPath)
      });
 
      // Cleanup output file after sending
      setTimeout(() => {
        fs.unlink(outputPath).catch(() => {});
      }, 5000);
 
    } catch (error) {
      console.error(error);
      await message.reply('âŒ Error creating meme. Try another person.');
    }
  }
};
