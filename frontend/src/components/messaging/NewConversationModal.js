import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createConversation } from '../../services/messageService';
import './Messaging.css';

const NewConversationModal = ({ onClose, onCreateConversation, currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/auth/users');
                // Filter out current user
                const filteredUsers = response.data.filter(user => 
                    user._id !== currentUser?._id
                );
                setUsers(filteredUsers);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, [currentUser]);
    
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedUser) {
            setError('Please select a user to message');
            return;
        }
        
        try {
            const response = await createConversation(selectedUser._id, message);
            
            if (response.success) {
                onCreateConversation(response.data);
            } else {
                setError(response.error);
            }
        } catch (err) {
            console.error('Error creating conversation:', err);
            setError('Failed to create conversation');
        }
    };
    
    return (
        <div className="new-conversation-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>New Conversation</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="modal-body">
                    {loading ? (
                        <div className="loading-state">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="empty-state">No users available</div>
                    ) : (
                        <>
                            <div className="user-selection">
                                <h3>Select a user to message:</h3>
                                <div className="user-list">
                                    {users.map(user => (
                                        <div 
                                            key={user._id}
                                            className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            <div className="user-avatar">
                                                {getInitials(user.name)}
                                            </div>
                                            <div className="user-name">{user.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {selectedUser && (
                                <form className="message-form" onSubmit={handleSubmit}>
                                    <h3>Send a message to {selectedUser.name}:</h3>
                                    <textarea
                                        className="message-input"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        rows={4}
                                    />
                                    <button 
                                        type="submit" 
                                        className="submit-button"
                                        disabled={!message.trim()}
                                    >
                                        Start Conversation
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewConversationModal;