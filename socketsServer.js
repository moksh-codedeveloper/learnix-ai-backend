import { WebSocketServer } from "ws";
import axios from "axios";

export const socketsServer = async () => {
  const sockets = new WebSocketServer({ port: 7000 });

  sockets.on("connection", (ws) => {
    console.log("🔌 WebSocket client connected");

    ws.send("👋 Hello from WebSocket server");

    ws.on("message", async (message) => {
      console.log("📨 Received:", message.toString());

      try {
        const response = await axios.post("http://localhost:8000/chat", { data: message.toString() });
        ws.send(JSON.stringify(response.data));
      } catch (error) {
        console.error("❌ Error talking to FastAPI:", error.message);
        ws.send(`Error connecting to FastAPI: ${error.message}`);
      }
    });

    ws.on("close", () => {
      console.log("❌ WebSocket client disconnected");
    });
  });
};
