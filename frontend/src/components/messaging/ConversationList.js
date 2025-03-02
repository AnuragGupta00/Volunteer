import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import NewConversationModal from './NewConversationModal';
import './Messaging.css';

const ConversationList = ({ 
    conversations, 
    selectedConversation, 
    onSelectConversation, 
    onNewConversation,
    loading,
    currentUser
}) => {
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch (error) {
            return '';
        }
    };
    
    const handleNewConversation = (conversation) => {
        setShowNewConversationModal(false);
        onNewConversation(conversation);
    };
    
    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h2>Messages</h2>
                <button 
                    className="new-conversation-btn"
                    onClick={() => setShowNewConversationModal(true)}
                >
                    New Chat
                </button>
            </div>
            
            {loading ? (
                <div className="loading-state">Loading conversations...</div>
            ) : conversations.length === 0 ? (
                <div className="empty-conversations">
                    <p>No conversations yet</p>
                    <p>Start a new conversation to connect with other volunteers</p>
                </div>
            ) : (
                conversations.map(conversation => {
                    // Find the other participant(s) in the conversation
                    const otherParticipants = conversation.otherParticipants || 
                        conversation.participants?.filter(p => p._id !== currentUser?._id) || [];
                    
                    const otherParticipant = otherParticipants[0] || {};
                    const name = otherParticipant.name || 'Unknown User';
                    
                    return (
                        <div 
                            key={conversation._id}
                            className={`conversation-item ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="conversation-avatar">
                                {getInitials(name)}
                            </div>
                            <div className="conversation-details">
                                <div className="conversation-name">{name}</div>
                                <div className="conversation-last-message">
                                    {conversation.lastMessage?.content || 'No messages yet'}
                                </div>
                            </div>
                            <div className="conversation-meta">
                                <div className="conversation-time">
                                    {formatTime(conversation.updatedAt)}
                                </div>
                                {conversation.unreadCount > 0 && (
                                    <div className="conversation-unread">
                                        {conversation.unreadCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            
            {showNewConversationModal && (
                <NewConversationModal 
                    onClose={() => setShowNewConversationModal(false)}
                    onCreateConversation={handleNewConversation}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default ConversationList; 