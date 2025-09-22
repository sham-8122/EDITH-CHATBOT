const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// --- Google Gemini setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Save a chat message and reply (using Gemini)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body && req.body.message) || "";

    // Call Gemini API
    const result = await model.generateContent(userMessage);
    const botReply = result.response.text();

    // Save to DB
    db.query(
      "INSERT INTO messages (user_message, bot_reply) VALUES (?, ?)",
      [userMessage, botReply],
      (err) => {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ reply: botReply });
      }
    );
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "AI response failed" });
  }
});

// Get recent messages (for loading chat history)
app.get("/history", (req, res) => {
  db.query(
    "SELECT id, user_message, bot_reply, created_at FROM messages ORDER BY id DESC LIMIT 50",
    (err, results) => {
      if (err) {
        console.error("DB fetch error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results.reverse()); // chronological order
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);