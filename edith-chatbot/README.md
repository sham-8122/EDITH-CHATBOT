# Edith — Beginner AI Chatbot (HTML/CSS/JS + Node.js + MySQL)

A simple student project that builds a friendly chatbot named **Edith** with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (Express)
- **Database**: MySQL (stores chat history)

## 1) MySQL Setup
Run this in your MySQL client:
```sql
CREATE DATABASE IF NOT EXISTS edith_chatbot;
USE edith_chatbot;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_message TEXT,
  bot_reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2) Install & Run
```bash
npm install
node server.js
```
Open: http://localhost:3000

## 3) Files
- `public/index.html` — UI
- `public/style.css` — Styles
- `public/script.js` — Client logic
- `server.js` — Express server & routes
- `db.js` — MySQL connection
- `package.json` — Dependencies

## 4) Notes
- Update MySQL credentials in `db.js` if needed.
- Chat history (last 50 messages) loads automatically when the page opens.
