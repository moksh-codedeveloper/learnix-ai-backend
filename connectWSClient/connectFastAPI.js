import WebSocket from 'ws';

export const connectToFastAPI = () => {
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.on('open', () => {
        console.log('✅ Connected to FastAPI WebSocket');
        socket.send('Hello from Node.js 🚀');
    });

    socket.on('message', (data) => {
        console.log('📨 Message from FastAPI:', data.toString());
    });

    socket.on('close', () => {
        console.log('❌ Disconnected from FastAPI WebSocket');
        // Optional: Reconnect logic
    });

    socket.on('error', (err) => {
        console.error('⚠️ WebSocket error:', err.message);
    });
};
