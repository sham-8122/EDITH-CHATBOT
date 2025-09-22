const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Render a chat row
function addMessage(text, who = "bot") {
  const row = document.createElement("div");
  row.className = `row ${who}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Load last 50 messages from server
async function loadHistory() {
  try {
    const res = await fetch("/history");
    const items = await res.json();
    if (Array.isArray(items)) {
      for (const msg of items) {
        if (msg.user_message) addMessage(msg.user_message, "user");
        if (msg.bot_reply) addMessage(msg.bot_reply, "bot");
      }
    }
  } catch (e) {
    console.warn("Could not load history:", e);
  }
}

// Send a message
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (data && data.reply) addMessage(data.reply, "bot");
    else addMessage("Edith had trouble replying. Please try again.", "bot");
  } catch (err) {
    addMessage("Network error. Is the server running?", "bot");
  } finally {
    sendBtn.disabled = false;
  }
});

// Greeting
addMessage("Hi! I'm Edith 🤖💚 How can I help you today?", "bot");
// Then load history
loadHistory();
