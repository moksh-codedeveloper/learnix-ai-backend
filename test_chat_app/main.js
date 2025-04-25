// node-server/app.js
import WebSocket from "ws";

// Connect to the correct WebSocket endpoint: /ws/chat
const socket = new WebSocket("ws://localhost:8000/ws/chat");

socket.on("open", () => {
  console.log("✅ Connected to FastAPI WebSocket");

  // Send test message
  socket.send("Hello AI, what is your purpose?");
});

socket.on("message", (data) => {
  console.log("🤖 AI Response:", data.toString());
});
