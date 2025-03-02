const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/messages', require('./routes/messages'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Join a conversation
    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
    });
    
    // Leave a conversation
    socket.on('leaveConversation', (conversationId) => {
        socket.leave(conversationId);
        console.log(`User left conversation: ${conversationId}`);
    });
    
    // Send a message
    socket.on('sendMessage', (message) => {
        io.to(message.conversationId).emit('newMessage', message);
    });
    
    // User is typing
    socket.on('typing', (data) => {
        socket.to(data.conversationId).emit('userTyping', data);
    });
    
    // User stops typing
    socket.on('stopTyping', (data) => {
        socket.to(data.conversationId).emit('userStoppedTyping', data);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));