import axios from 'axios';

// Get all conversations for the current user
export const getConversations = async () => {
    try {
        const res = await axios.get('/api/messages/conversations');
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Error fetching conversations:', err);
        return { 
            success: false, 
            error: err.response?.data?.msg || 'Failed to fetch conversations' 
        };
    }
};

// Get a specific conversation by ID
export const getConversation = async (conversationId) => {
    try {
        const res = await axios.get(`/api/messages/conversations/${conversationId}`);
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Error fetching conversation:', err);
        return { 
            success: false, 
            error: err.response?.data?.msg || 'Failed to fetch conversation' 
        };
    }
};

// Create a new conversation
export const createConversation = async (participantId, initialMessage) => {
    try {
        const res = await axios.post('/api/messages/conversations', {
            participantId,
            initialMessage
        });
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Error creating conversation:', err);
        return { 
            success: false, 
            error: err.response?.data?.msg || 'Failed to create conversation' 
        };
    }
};

// Get all messages for a conversation
export const getMessages = async (conversationId) => {
    try {
        const res = await axios.get(`/api/messages/${conversationId}`);
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Error fetching messages:', err);
        return { 
            success: false, 
            error: err.response?.data?.msg || 'Failed to fetch messages' 
        };
    }
};

// Send a message in a conversation
export const sendMessage = async (conversationId, content) => {
    try {
        const res = await axios.post(`/api/messages/${conversationId}`, { content });
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Error sending message:', err);
        return { 
            success: false, 
            error: err.response?.data?.msg || 'Failed to send message' 
        };
    }
};

// Mark a message as read
export const markMessageAsRead = async (messageId) => {
    try {
        const res = await axios.patch(`/api/messages/${messageId}/read`);
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Error marking message as read:', err);
        return { 
            success: false, 
            error: err.response?.data?.msg || 'Failed to mark message as read' 
        };
    }
}; 