import React from 'react';
import './Messaging.css';

const EmptyState = () => {
    return (
        <div className="chat-container">
            <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <div className="empty-state-text">Welcome to the Volunteer Messaging System</div>
                <div className="empty-state-subtext">
                    Select a conversation to start chatting or create a new conversation.
                </div>
            </div>
        </div>
    );
};

export default EmptyState; 