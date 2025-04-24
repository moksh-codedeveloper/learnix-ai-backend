import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.WS_PORT || 5000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
    console.log("✅ Frontend connected to Node WebSocket");

    socket.on("message", (msg) => {
        console.log("📨 Received from client:", msg.toString());
        socket.send("🟢 Pong: " + msg.toString());
    });

    socket.on("close", () => {
        console.log("❌ Connection closed");
    });
});

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
