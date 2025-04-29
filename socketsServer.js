import { WebSocketServer } from "ws";
import api from "./lib/api.js";
// Set up WebSocket server
const wss = new WebSocketServer({ port: 3000 });

const AI_API_URL = 'http://localhost:8000/api/chat'; // FastAPI URL for AI requests

// Function to handle incoming WebSocket messages
const handleWebSocketMessage = (ws, message) => {
  try {
    const msgData = JSON.parse(message);

    // If it's a heartbeat message, just respond back
    if (msgData.type === 'heartbeat') {
      console.log('Heartbeat received');
      return ws.send(JSON.stringify({ type: 'heartbeat', status: 'ok' }));
    }

    // Process the message (calling AI server in Python)
    if (msgData.type === 'ai-process') {
      console.log('AI request received', msgData);

      // Call the FastAPI Python server for AI processing
      api.post(AI_API_URL, msgData)
        .then(response => {
          // Send AI response back to client
          ws.send(JSON.stringify({
            type: 'ai-response',
            result: response.data
          }));
        })
        .catch(error => {
          console.error('Error calling AI server:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process AI request'
          }));
        });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
  }
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Send initial connection message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket server' }));

  // Listen for incoming messages
  ws.on('message', (message) => {
    console.log('Received message:', message);
    handleWebSocketMessage(ws, message);
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Handle WebSocket close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

console.log('WebSocket server running on ws://localhost:3000');
