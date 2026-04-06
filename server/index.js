require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { handleUserConnection, saveUserSession } = require('./controllers/userController');

const app = express();
app.use(cors());

// Database Connect karein
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let players = {};

// IMPORTANT: Callback ko 'async' banaya hai taaki DB await ho sake
io.on('connection', async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    try {
        // 1. Controller se user fetch/create karein
        const userData = await handleUserConnection(socket.id);

        // 2. Memory (players object) ko MongoDB data se sync karein
        players[socket.id] = {
            id: socket.id,
            x: userData.position.x || 400,
            y: userData.position.y || 300,
            name: userData.username
        };

        // 3. Frontend request par players ki list bhejein
        socket.on('requestPlayers', () => {
            socket.emit('currentPlayers', players);
            socket.broadcast.emit('newPlayer', players[socket.id]);
        });

        // 4. Movement Sync
        socket.on('move', (moveData) => {
            if (players[socket.id]) {
                players[socket.id].x = moveData.x;
                players[socket.id].y = moveData.y;
                socket.broadcast.emit('playerMoved', players[socket.id]);
            }
        });

        // 5. Chat Messaging Logic
        socket.on('send_message', (data) => {
            const messageData = {
                senderId: socket.id,
                text: data.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            // Specific target user ko message bhejo
            io.to(data.targetId).emit('receive_message', messageData);
        });

        // 6. Disconnect & Auto-Save to MongoDB
        socket.on('disconnect', async () => {
            console.log(`User Disconnected: ${socket.id}`);

            if (players[socket.id]) {
                // Controller use karke final position save karein
                await saveUserSession(socket.id, {
                    x: players[socket.id].x,
                    y: players[socket.id].y
                });

                delete players[socket.id];
            }
            io.emit('playerDisconnected', socket.id);
        });

    } catch (error) {
        console.error("Error in socket connection:", error);
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Cosmos Server running on http://localhost:3001`);
});