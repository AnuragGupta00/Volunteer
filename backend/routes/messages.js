const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

// @route   GET api/messages/conversations
// @desc    Get all conversations for the current user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        })
        .populate({
            path: 'participants',
            select: 'name email'
        })
        .populate({
            path: 'lastMessage',
            select: 'content createdAt sender'
        })
        .sort({ updatedAt: -1 });
        
        // Format conversations to include other participant info
        const formattedConversations = conversations.map(conv => {
            const otherParticipants = conv.participants.filter(
                p => p._id.toString() !== req.user.id
            );
            
            return {
                _id: conv._id,
                participants: conv.participants,
                otherParticipants,
                lastMessage: conv.lastMessage,
                unreadCount: conv.unreadCount.get(req.user.id) || 0,
                updatedAt: conv.updatedAt,
                createdAt: conv.createdAt
            };
        });
        
        res.json(formattedConversations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/messages/conversations/:conversationId
// @desc    Get a specific conversation
// @access  Private
router.get('/conversations/:conversationId', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId)
            .populate({
                path: 'participants',
                select: 'name email'
            });
            
        if (!conversation) {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        
        // Check if user is part of this conversation
        if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to view this conversation' });
        }
        
        res.json(conversation);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/messages/conversations
// @desc    Create a new conversation
// @access  Private
router.post('/conversations', auth, async (req, res) => {
    try {
        const { participantId, initialMessage } = req.body;
        
        if (!participantId) {
            return res.status(400).json({ msg: 'Participant ID is required' });
        }
        
        // Check if the participant exists
        const participant = await User.findById(participantId);
        if (!participant) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, participantId] }
        });
        
        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [req.user.id, participantId],
                unreadCount: new Map([[participantId, 0]])
            });
            await conversation.save();
        }
        
        // If there's an initial message, create it
        if (initialMessage) {
            const message = new Message({
                conversationId: conversation._id,
                sender: req.user.id,
                content: initialMessage
            });
            
            await message.save();
            
            // Update the conversation with the last message
            conversation.lastMessage = message._id;
            
            // Increment unread count for the recipient
            const unreadCount = conversation.unreadCount.get(participantId) || 0;
            conversation.unreadCount.set(participantId, unreadCount + 1);
            
            await conversation.save();
        }
        
        // Populate the participants
        await conversation.populate({
            path: 'participants',
            select: 'name email'
        });
        
        // Populate last message if it exists
        if (conversation.lastMessage) {
            await conversation.populate({
                path: 'lastMessage',
                select: 'content createdAt sender'
            });
        }
        
        res.json(conversation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/messages/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get('/:conversationId', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        // Check if conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        
        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to access this conversation' });
        }
        
        // Get messages
        const messages = await Message.find({ conversationId })
            .populate({
                path: 'sender',
                select: 'name email'
            })
            .sort({ createdAt: 1 });
            
        // Reset unread count for current user
        conversation.unreadCount.set(req.user.id, 0);
        await conversation.save();
        
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/messages/:conversationId
// @desc    Send a message in a conversation
// @access  Private
router.post('/:conversationId', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ msg: 'Message content is required' });
        }
        
        // Check if conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        
        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to send messages in this conversation' });
        }
        
        // Create new message
        const message = new Message({
            conversationId,
            sender: req.user.id,
            content
        });
        
        await message.save();
        
        // Update conversation last message and unread counts
        conversation.lastMessage = message._id;
        
        // Increment unread count for all participants except sender
        conversation.participants.forEach(participantId => {
            if (participantId.toString() !== req.user.id) {
                const unreadCount = conversation.unreadCount.get(participantId.toString()) || 0;
                conversation.unreadCount.set(participantId.toString(), unreadCount + 1);
            }
        });
        
        await conversation.save();
        
        // Populate sender info
        await message.populate({
            path: 'sender',
            select: 'name email'
        });
        
        res.json(message);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/messages/:messageId/read
// @desc    Mark a message as read
// @access  Private
router.patch('/:messageId/read', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
        
        if (!message) {
            return res.status(404).json({ msg: 'Message not found' });
        }
        
        // Check if user is part of the conversation
        const conversation = await Conversation.findById(message.conversationId);
        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to access this message' });
        }
        
        // Update read status
        message.isRead = true;
        await message.save();
        
        res.json(message);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Message not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 