# Volunteer Connect Messaging System

This document provides an overview of the in-app messaging system implemented for the Volunteer Connect platform.

## Features

- **Real-time messaging** between volunteers and organizers
- **Conversation management** with unread message indicators
- **Typing indicators** to show when someone is composing a message
- **Read receipts** to confirm when messages have been seen
- **User presence** indicators
- **Mobile-responsive design** for messaging on any device

## Technical Implementation

### Backend

The messaging system is built with:

- **MongoDB** for storing conversations and messages
- **Express.js** for API routes
- **Socket.IO** for real-time communication

#### Models

1. **Conversation Model**
   - Tracks participants in a conversation
   - Stores the last message for preview
   - Maintains unread counts for each participant

2. **Message Model**
   - Stores message content
   - Tracks read status
   - Links to conversations and senders

#### API Routes

- `GET /api/messages/conversations` - Get all conversations for the current user
- `GET /api/messages/conversations/:conversationId` - Get a specific conversation
- `POST /api/messages/conversations` - Create a new conversation
- `GET /api/messages/:conversationId` - Get messages for a conversation
- `POST /api/messages/:conversationId` - Send a message in a conversation
- `PATCH /api/messages/:messageId/read` - Mark a message as read

### Frontend

The frontend is built with:

- **React** for the UI components
- **Context API** for state management
- **Socket.IO Client** for real-time updates

#### Components

1. **Messaging** - Main container component
2. **ConversationList** - Displays all conversations
3. **Chat** - Shows messages in a conversation
4. **NewConversationModal** - Interface for starting new conversations
5. **EmptyState** - Placeholder when no conversation is selected

## Getting Started

### Installation

1. Install backend dependencies:
   ```
   cd backend
   npm install socket.io
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install socket.io-client date-fns @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

### Usage

1. Navigate to the Messages section from the main navigation
2. Start a new conversation by clicking "New Chat"
3. Select a user to message
4. Type and send messages in real-time

## Future Enhancements

- Group messaging for team coordination
- File and image sharing
- Voice and video calls
- Message search functionality
- Message reactions and emoji support

## Troubleshooting

- If messages aren't sending, check your connection status
- If real-time updates aren't working, try refreshing the page
- For persistent issues, clear your browser cache and restart the application 