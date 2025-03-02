import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { isAuthenticated } = useAuth();
    
    useEffect(() => {
        let socketInstance;
        
        if (isAuthenticated) {
            // Connect to the socket server
            socketInstance = io(process.env.REACT_APP_API_URL || 'http://localhost:3001');
            
            socketInstance.on('connect', () => {
                console.log('Socket connected');
                setConnected(true);
            });
            
            socketInstance.on('disconnect', () => {
                console.log('Socket disconnected');
                setConnected(false);
            });
            
            setSocket(socketInstance);
        }
        
        // Cleanup on unmount
        return () => {
            if (socketInstance) {
                console.log('Cleaning up socket');
                socketInstance.disconnect();
            }
        };
    }, [isAuthenticated]);
    
    // Join a conversation room
    const joinConversation = (conversationId) => {
        if (socket && conversationId) {
            socket.emit('joinConversation', conversationId);
        }
    };
    
    // Leave a conversation room
    const leaveConversation = (conversationId) => {
        if (socket && conversationId) {
            socket.emit('leaveConversation', conversationId);
        }
    };
    
    // Send a message
    const sendMessage = (message) => {
        if (socket && message) {
            socket.emit('sendMessage', message);
        }
    };
    
    // Signal that the user is typing
    const emitTyping = (data) => {
        if (socket && data) {
            socket.emit('typing', data);
        }
    };
    
    // Signal that the user stopped typing
    const emitStopTyping = (data) => {
        if (socket && data) {
            socket.emit('stopTyping', data);
        }
    };
    
    const value = {
        socket,
        connected,
        joinConversation,
        leaveConversation,
        sendMessage,
        emitTyping,
        emitStopTyping
    };
    
    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext; 