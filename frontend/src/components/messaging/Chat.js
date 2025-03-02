import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { getMessages, sendMessage, markMessageAsRead } from '../../services/messageService';
import './Messaging.css';

const Chat = ({ conversation, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    const { socket, joinConversation, leaveConversation, sendMessage: emitMessage, emitTyping, emitStopTyping } = useSocket();
    
    // Get the other participant in the conversation
    const otherParticipants = conversation.otherParticipants || 
        conversation.participants?.filter(p => p._id !== currentUser?._id) || [];
    const otherParticipant = otherParticipants[0] || {};
    
    useEffect(() => {
        // Load messages when conversation changes
        const loadMessages = async () => {
            try {
                setLoading(true);
                const response = await getMessages(conversation._id);
                if (response.success) {
                    setMessages(response.data);
                    
                    // Mark unread messages as read
                    response.data.forEach(msg => {
                        if (!msg.isRead && msg.sender._id !== currentUser?._id) {
                            markMessageAsRead(msg._id);
                        }
                    });
                } else {
                    setError('Failed to load messages');
                }
            } catch (err) {
                console.error('Error loading messages:', err);
                setError('An error occurred while loading messages');
            } finally {
                setLoading(false);
            }
        };
        
        if (conversation?._id) {
            loadMessages();
            
            // Join the conversation room
            joinConversation(conversation._id);
        }
        
        // Cleanup: leave the conversation room
        return () => {
            if (conversation?._id) {
                leaveConversation(conversation._id);
            }
        };
    }, [conversation?._id, currentUser?._id, joinConversation, leaveConversation]);
    
    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        // Listen for new messages via socket
        if (socket) {
            const handleNewMessage = (message) => {
                if (message.conversationId === conversation._id) {
                    setMessages(prevMessages => [...prevMessages, message]);
                    
                    // Mark the message as read if it's not from the current user
                    if (message.sender._id !== currentUser?._id) {
                        markMessageAsRead(message._id);
                    }
                }
            };
            
            const handleTyping = (data) => {
                if (data.conversationId === conversation._id && data.userId !== currentUser?._id) {
                    setIsTyping(true);
                }
            };
            
            const handleStopTyping = (data) => {
                if (data.conversationId === conversation._id && data.userId !== currentUser?._id) {
                    setIsTyping(false);
                }
            };
            
            socket.on('newMessage', handleNewMessage);
            socket.on('userTyping', handleTyping);
            socket.on('userStoppedTyping', handleStopTyping);
            
            return () => {
                socket.off('newMessage', handleNewMessage);
                socket.off('userTyping', handleTyping);
                socket.off('userStoppedTyping', handleStopTyping);
            };
        }
    }, [socket, conversation._id, currentUser?._id]);
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim()) return;
        
        try {
            const response = await sendMessage(conversation._id, newMessage);
            
            if (response.success) {
                // Clear the input
                setNewMessage('');
                
                // Emit the message via socket
                emitMessage(response.data);
                
                // Stop typing indicator
                handleStopTyping();
            } else {
                setError(response.error);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        }
    };
    
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        
        // Emit typing indicator
        if (e.target.value.trim() && conversation?._id) {
            emitTyping({
                conversationId: conversation._id,
                userId: currentUser?._id
            });
            
            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Set new timeout to stop typing indicator after 2 seconds
            const timeout = setTimeout(() => {
                handleStopTyping();
            }, 2000);
            
            setTypingTimeout(timeout);
        } else if (!e.target.value.trim()) {
            handleStopTyping();
        }
    };
    
    const handleStopTyping = () => {
        if (conversation?._id) {
            emitStopTyping({
                conversationId: conversation._id,
                userId: currentUser?._id
            });
        }
    };
    
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            return format(new Date(timestamp), 'h:mm a');
        } catch (error) {
            return '';
        }
    };
    
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-avatar">
                    {getInitials(otherParticipant.name)}
                </div>
                <div>
                    <div className="chat-name">{otherParticipant.name || 'Unknown User'}</div>
                    <div className="chat-status">
                        {isTyping ? 'Typing...' : 'Online'}
                    </div>
                </div>
            </div>
            
            <div className="chat-body">
                {loading ? (
                    <div className="loading-state">Loading messages...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : messages.length === 0 ? (
                    <div className="empty-messages">
                        <p>No messages yet</p>
                        <p>Send a message to start the conversation</p>
                    </div>
                ) : (
                    <div className="message-list">
                        {messages.map(message => {
                            const isOutgoing = message.sender._id === currentUser?._id;
                            
                            return (
                                <div 
                                    key={message._id}
                                    className={`message-item ${isOutgoing ? 'message-outgoing' : 'message-incoming'}`}
                                >
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                    <div className="message-meta">
                                        <span className="message-time">
                                            {formatMessageTime(message.createdAt)}
                                        </span>
                                        {isOutgoing && (
                                            <span className={`message-status ${message.isRead ? 'read' : ''}`}>
                                                {message.isRead ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                        
                        {isTyping && (
                            <div className="typing-indicator">
                                {otherParticipant.name} is typing...
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <form className="chat-input-container" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="chat-input"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    className="send-button"
                    disabled={!newMessage.trim() || loading}
                >
                    →
                </button>
            </form>
        </div>
    );
};

export default Chat; 