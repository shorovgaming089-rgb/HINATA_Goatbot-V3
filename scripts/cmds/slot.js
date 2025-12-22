const DAILY_LIMIT = 20;
const MAX_BET = 6000000;

module.exports = {
  config: {
    name: "slots",
    aliases: ["slot"],
    version: "1.4",
    author: "xnil6x",
    countDown: 8,
    role: 0,
    description: "🎰 Ultra-stylish slot machine with balanced odds and limits",
    category: "game",
    guide: {
      en: "Use: {pn} [bet amount]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const bet = parseInt(args[0]);

    const formatMoney = (amount) => {
      if (isNaN(amount)) return "💲0";
      amount = Number(amount);
      const scales = [
        { value: 1e15, suffix: 'Q', color: '🌈' },
        { value: 1e12, suffix: 'T', color: '✨' },
        { value: 1e9, suffix: 'B', color: '💎' },
        { value: 1e6, suffix: 'M', color: '💰' },
        { value: 1e3, suffix: 'k', color: '💵' }
      ];
      const scale = scales.find(s => amount >= s.value);
      if (scale) {
        const scaledValue = amount / scale.value;
        return `${scale.color}${scaledValue.toFixed(2)}${scale.suffix}`;
      }
      return `💲${amount.toLocaleString()}`;
    };

    if (isNaN(bet) || bet <= 0)
      return message.reply("🔴 ERROR: Please enter a valid bet amount!");

    if (bet > MAX_BET)
      return message.reply(`🚫 MAX BET LIMIT: You can bet up to ${formatMoney(MAX_BET)} only.`);

    const user = await usersData.get(senderID);

    // ✅ Bangladesh date support
    const getBangladeshDate = () => {
      return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
    };

    const today = getBangladeshDate(); // e.g., 2025-07-21

    // Tracking daily play count
    const lastPlayDay = user.data?.slotsDay || "";
    const playCount = user.data?.slotsCount || 0;
    const isSameDay = today === lastPlayDay;
    const currentCount = isSameDay ? playCount : 0;

    if (currentCount >= DAILY_LIMIT) {
      return message.reply(`⏳ DAILY LIMIT: You can only play ${DAILY_LIMIT} times per day. Try again tomorrow (Bangladesh time)!`);
    }

    if (user.money < bet)
      return message.reply(`🔴 INSUFFICIENT FUNDS: You need ${formatMoney(bet - user.money)} more to play!`);

    const symbols = [
      { emoji: "🍒", weight: 30 },
      { emoji: "🍋", weight: 25 },
      { emoji: "🍇", weight: 20 },
      { emoji: "🍉", weight: 15 },
      { emoji: "⭐", weight: 7 },
      { emoji: "7️⃣", weight: 3 }
    ];

    const roll = () => {
      const totalWeight = symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
      let random = Math.random() * totalWeight;
      for (const symbol of symbols) {
        if (random < symbol.weight) return symbol.emoji;
        random -= symbol.weight;
      }
      return symbols[0].emoji;
    };

    const slot1 = roll();
    const slot2 = roll();
    const slot3 = roll();

    let winnings = 0;
    let outcome;
    let winType = "";
    let bonus = "";

    if (slot1 === "7️⃣" && slot2 === "7️⃣" && slot3 === "7️⃣") {
      winnings = bet * 10;
      outcome = "🔥 MEGA JACKPOT! TRIPLE 7️⃣!";
      winType = "💎 MAX WIN";
      bonus = "🎆 BONUS: +3% to your total balance!";
      await usersData.set(senderID, { money: user.money * 1.03 });
    } else if (slot1 === slot2 && slot2 === slot3) {
      winnings = bet * 5;
      outcome = "💰 JACKPOT! 3 matching symbols!";
      winType = "💫 BIG WIN";
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winnings = bet * 2;
      outcome = "✨ NICE! 2 matching symbols!";
      winType = "🌟 WIN";
    } else if (Math.random() < 0.5) {
      winnings = bet * 1.5;
      outcome = "🎯 LUCKY SPIN! Bonus win!";
      winType = "🍀 SMALL WIN";
    } else {
      winnings = -bet;
      outcome = "💸 BETTER LUCK NEXT TIME!";
      winType = "☠️ LOSS";
    }

    const newBalance = user.money + winnings;

    await usersData.set(senderID, {
      money: newBalance,
      "data.slotsDay": today,
      "data.slotsCount": currentCount + 1
    });

    const slotBox =
      "╔════════════════╗\n" +
      "║  🎰 SLOT MACHINE 🎰  \n" +
      "╠════════════════╣\n" +
      `║     [ ${slot1} | ${slot2} | ${slot3} ]     \n` +
      "╚════════════════╝";

    const resultColor = winnings >= 0 ? "🟢" : "🔴";
    const resultText = winnings >= 0
      ? `🏆 WON: ${formatMoney(winnings)}`
      : `💸 LOST: ${formatMoney(bet)}`;

    const messageContent =
      `${slotBox}\n\n` +
      `🎯 RESULT: ${outcome}\n` +
      `${winType ? `${winType}\n` : ""}` +
      `${bonus ? `${bonus}\n` : ""}` +
      `\n${resultColor} ${resultText}` +
      `\n💰 BALANCE: ${formatMoney(newBalance)}` +
      `\n🧮 SPINS USED TODAY: ${currentCount + 1}/${DAILY_LIMIT}` +
      `\n\n💡 TIP: Higher bets increase jackpot chances!`;

    return message.reply(messageContent);
  }
};
