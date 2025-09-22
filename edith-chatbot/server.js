const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // your database setup
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// --- Simple chatbot logic ---
function getBotReply(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello! How can I help you today?";
  } else if (msg.includes("how are you")) {
    return "I'm good, thank you! How about you?";
  } else if (msg.includes("bye")) {
    return "Goodbye! Have a nice day!";
  } else {
    return "Sorry, I didn't understand that. Can you rephrase?";
  }
}

// Save a chat message and reply
app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body && req.body.message) || "";
    const botReply = getBotReply(userMessage);

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
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get recent messages (chat history)
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
