const mysql = require("mysql2");

// Update these credentials if needed
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // your MySQL username
  password: "Shravi@2004",     // your MySQL password (if any)
  database: "edith_chatbot"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected!");
});

module.exports = db;
