const OpenAI = require("openai");
const mongoose = require("mongoose");
const config = require("../../config.json");

// ⚠️ MongoDB এখানে connect করা লাগবে না যদি main file এ already connect থাকে

const groqSchema = new mongoose.Schema({
  userId: String,
  question: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});

const GROQ =
  mongoose.models.GROQ_Chat ||
  mongoose.model("GROQ_Chat", groqSchema);

// ✅ Groq Setup
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

module.exports = {
  config: {
    name: "groq",
    version: "1.0",
    author: "SouRav Ahmed",
    countDown: 5,
    role: 0,
    shortDescription: "Chat with Groq AI",
    longDescription: "Groq AI chat system with MongoDB save",
    category: "ai",
    guide: "{pn} your question"
  },

  onStart: async function ({ message, args, event }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("Please provide a question.");

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // ✅ Stable model
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      });

      const reply = response.choices[0].message.content;

      // ✅ Save to MongoDB
      await GROQ.create({
        userId: event.senderID,
        question: prompt,
        response: reply
      });

      return message.reply(reply);

    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err.message);

      return message.reply(
        "Error: " +
        (err.response?.data?.error?.message || err.message)
      );
    }
  }
};
