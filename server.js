import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
// import {connectDB} from "./dbConfig/db.js"
// Routes and DB
import connectDB from "./dbConfig/db.js";
import authRoutes from "./routes/user.routes.js";

// Init
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("🔌 Client connected via WebSocket");

    ws.on("message", (message) => {
        console.log("📨 Message from client:", message.toString());
        ws.send(`👋 Pong: Received "${message}"`);
    });

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("🌐 Learnix Node API Running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server + WebSocket running on http://localhost:${PORT}`));
