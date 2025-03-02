import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getConversations } from '../../services/messageService';
import ConversationList from './ConversationList';
import Chat from './Chat';
import EmptyState from './EmptyState';
import './Messaging.css';

const Messaging = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const { socket, connected } = useSocket();
    
    useEffect(() => {
        // Only redirect if auth is not loading and user is not authenticated
        if (!authLoading && !isAuthenticated) {
            console.log('Not authenticated, redirecting to login');
            navigate('/login');
            return;
        }
        
        // Load conversations only if authenticated
        if (isAuthenticated) {
            const loadConversations = async () => {
                try {
                    setLoading(true);
                    const response = await getConversations();
                    if (response.success) {
                        setConversations(response.data);
                    } else {
                        setError('Failed to load conversations');
                    }
                } catch (err) {
                    setError('An error occurred while loading conversations');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            
            loadConversations();
        }
    }, [isAuthenticated, authLoading, navigate]);
    
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        
        // Reset unread count when selecting a conversation
        setConversations(prevConversations => {
            return prevConversations.map(conv => {
                if (conv._id === conversation._id) {
                    return {
                        ...conv,
                        unreadCount: 0
                    };
                }
                return conv;
            });
        });
    };
    
    const handleNewConversation = (newConversation) => {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
    };
    
    if (authLoading) {
        return <div className="messaging-container loading">Checking authentication...</div>;
    }
    
    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }
    
    return (
        <div className="messaging-container">
            <ConversationList 
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                loading={loading}
                currentUser={user}
            />
            
            {selectedConversation ? (
                <Chat 
                    conversation={selectedConversation}
                    currentUser={user}
                />
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

export default Messaging; 