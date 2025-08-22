# SparkCircle Architecture Documentation 🏗️

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Core Technologies](#core-technologies)
4. [Data Flow](#data-flow)
5. [Key Components](#key-components)
6. [Real-Time Communication](#real-time-communication)
7. [State Management](#state-management)
8. [Security & Authentication](#security--authentication)
9. [Database Schema](#database-schema)
10. [API Endpoints](#api-endpoints)
11. [Socket Events](#socket-events)
12. [User Journey](#user-journey)
13. [Error Handling](#error-handling)
14. [Performance Considerations](#performance-considerations)
15. [Deployment Considerations](#deployment-considerations)

## Overview

SparkCircle is a real-time web application that facilitates team-building through meaningful conversations. It follows a session-based architecture where participants join rooms and answer curated questions together.

### Core Principles
- **Real-time synchronization**: All participants see the same state instantly
- **Session-based**: Temporary rooms that auto-expire after 24 hours
- **Host-controlled**: Guided mode with host managing the flow
- **Privacy-focused**: No persistent storage of conversation content
- **Mobile-first**: Responsive design that works on any device

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  React SPA (Port 3000)                                                  │
│  ├── React Router (Navigation)                                          │
│  ├── Socket.io Client (Real-time)                                       │
│  ├── Axios (HTTP Requests)                                              │
│  └── Tailwind CSS (Styling)                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                           COMMUNICATION LAYER                            │
├─────────────────────────────────────────────────────────────────────────┤
│  HTTP (REST API)              │  WebSocket (Socket.io)                  │
│  ├── Session CRUD             │  ├── Real-time events                  │
│  └── Health checks            │  └── Bi-directional communication      │
├─────────────────────────────────────────────────────────────────────────┤
│                              SERVER LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  Node.js + Express (Port 3001)                                          │
│  ├── REST API Routes                                                    │
│  ├── Socket.io Server                                                   │
│  ├── Middleware (CORS, Helmet, Rate Limiting)                          │
│  └── Business Logic                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                              DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  MongoDB (Port 27017)                                                   │
│  └── Mongoose ODM                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Core Technologies

### Frontend Stack
- **React 19.1.0**: Component-based UI framework
- **React Router 7.6.3**: Client-side routing
- **Socket.io Client 4.8.1**: WebSocket connection management
- **Axios 1.10.0**: HTTP client for API calls
- **Tailwind CSS 3.4.17**: Utility-first CSS framework

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express 4.18.2**: Web application framework
- **Socket.io 4.6.1**: Real-time bidirectional communication
- **MongoDB/Mongoose 7.0.3**: NoSQL database and ODM
- **Helmet 7.0.0**: Security headers middleware
- **CORS 2.8.5**: Cross-origin resource sharing
- **Express Rate Limit 6.7.0**: API rate limiting
- **Nanoid 3.3.6**: Unique ID generation

## Data Flow

### 1. Session Creation Flow
```
User → Landing Page → Create Room → Backend API → MongoDB → Return Room Code → Session Lobby
```

### 2. Join Session Flow
```
User → Enter Room Code → Backend API → Validate Session → Add Participant → Socket Connection → Session Lobby
```

### 3. Active Session Flow
```
Host Controls → Socket Event → Backend Handler → Update MongoDB → Broadcast to All → Update UI
```

## Key Components

### Frontend Components

#### Pages (`/frontend/src/pages/`)
1. **LandingPage.js**
   - Entry point for users
   - Options to create or join rooms
   - Feature showcase

2. **CreateRoom.js**
   - Host name input
   - Session creation logic
   - Stores session info in localStorage

3. **JoinRoom.js**
   - Room code validation
   - Participant name input
   - Session joining logic

4. **SessionLobby.js**
   - Waiting room for participants
   - Shows room code and participants
   - Host can start session
   - Real-time participant updates

5. **ActiveSession.js**
   - Main game interface
   - Question display
   - Host controls (guided mode)
   - Real-time synchronization

6. **SessionResults.js**
   - Post-session summary
   - Session statistics
   - Option to create new session

#### Reusable Components (`/frontend/src/components/`)
1. **QuestionCard.js**
   - Themed question display
   - Dynamic styling based on theme
   - Question number tracking

2. **ParticipantList.js**
   - Real-time participant status
   - Visual host indicator
   - Connection status

3. **HostControls.js**
   - Next question button
   - End session button
   - Only visible to host

4. **LoadingSpinner.js**
   - Consistent loading states
   - Customizable size and text

### Backend Components

#### Models (`/backend/models/`)
**Session.js** - MongoDB schema defining:
- Room code (unique, uppercase)
- Host ID
- Participants array
- Settings (themes, mode, max participants)
- Current question
- Used questions tracking
- Session status
- Auto-expiry after 24 hours

#### Routes (`/backend/routes/`)
**sessions.js** - REST API endpoints:
- POST `/api/sessions/create` - Create new session
- POST `/api/sessions/join` - Join existing session
- GET `/api/sessions/:roomCode` - Get session details

#### Socket Handlers (`/backend/socket/`)
**socketHandler.js** - Real-time event handling:
- Room management
- Question flow control
- Session state broadcasting

#### Data (`/backend/data/`)
**questions.js** - Question bank:
- 5 themes with 5 questions each
- Helper functions for question selection
- Smart filtering to avoid repeats

## Real-Time Communication

### Socket.io Architecture

#### Connection Flow
1. Client connects to server on component mount
2. Joins specific room using room code
3. Receives current session state
4. Listens for real-time updates

#### Event Flow
```
Client Action → emit() → Server Handler → Database Update → Broadcast → All Clients Update
```

### Context Implementation (`/frontend/src/contexts/SocketContext.js`)
- Singleton socket instance
- Provides emit, on, off methods
- Automatic connection management
- Clean disconnection on unmount

## State Management

### Frontend State

#### Local State (Component Level)
- UI states (loading, errors)
- Form inputs
- Temporary data

#### Session Storage (localStorage)
```javascript
{
  roomCode: "ABC123",
  participantId: "unique-id",
  isHost: true/false,
  hostName: "John Doe"
}
```

#### Server State (Socket.io)
- Real-time session data
- Participant list
- Current question
- Session status

### Backend State

#### In-Memory (Socket.io)
- Active socket connections
- Room memberships

#### Persistent (MongoDB)
- Session documents
- Participant data
- Question history
- Session settings

## Security & Authentication

### Current Implementation
1. **Rate Limiting**: Prevents API abuse
2. **CORS**: Restricts origins
3. **Helmet**: Security headers
4. **Input Validation**: Sanitizes user input
5. **Room Codes**: Hard to guess 6-character codes

### Session Security
- Participant IDs act as lightweight authentication
- Host privileges tied to participant ID
- No sensitive data stored
- Sessions auto-expire

## Database Schema

### Session Model
```javascript
{
  roomCode: String (unique, uppercase),
  hostId: String,
  participants: [{
    id: String,
    name: String,
    joinedAt: Date
  }],
  settings: {
    themes: [String],
    mode: String ('guided' | 'free-flow'),
    maxParticipants: Number
  },
  currentQuestion: {
    id: String,
    text: String,
    theme: String
  },
  usedQuestions: [String],
  status: String ('waiting' | 'active' | 'ended'),
  createdAt: Date (with TTL index)
}
```

## API Endpoints

### REST API

#### POST `/api/sessions/create`
**Request:**
```json
{
  "hostName": "John Doe",
  "settings": {
    "themes": ["dreams", "values"],
    "mode": "guided",
    "maxParticipants": 20
  }
}
```

**Response:**
```json
{
  "success": true,
  "roomCode": "ABC123",
  "participantId": "host-id",
  "hostId": "host-id",
  "sessionId": "mongo-id"
}
```

#### POST `/api/sessions/join`
**Request:**
```json
{
  "roomCode": "ABC123",
  "participantName": "Jane Smith"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "mongo-id",
  "roomCode": "ABC123",
  "participantId": "participant-id",
  "settings": {},
  "status": "waiting"
}
```

#### GET `/api/sessions/:roomCode`
**Response:**
```json
{
  "success": true,
  "roomCode": "ABC123",
  "hostId": "host-id",
  "hostName": "John Doe",
  "participants": [],
  "settings": {},
  "status": "waiting",
  "currentQuestion": null,
  "questionsAsked": []
}
```

## Socket Events

### Client → Server Events

#### `join-room`
```javascript
{
  roomCode: "ABC123",
  participantId: "unique-id"
}
```

#### `start-session`
```javascript
{
  roomCode: "ABC123",
  hostId: "host-id"
}
```

#### `next-question`
```javascript
{
  roomCode: "ABC123",
  hostId: "host-id"
}
```



#### `end-session`
```javascript
{
  roomCode: "ABC123",
  hostId: "host-id"
}
```

### Server → Client Events

#### `session-state`
Complete session state update

#### `participant-joined`
New participant notification

#### `participant-left`
Participant disconnection

#### `session-started`
Session status change

#### `new-question`
Next question data



#### `session-ended`
Session termination

#### `no-more-questions`
All questions exhausted

#### `error`
Error messages

## User Journey

### Host Flow
1. **Landing Page** → Click "Create Room"
2. **Create Room** → Enter name → Submit
3. **Session Lobby** → Share room code → Wait for participants
4. **Start Session** → Click "Start Session" (min 2 participants)
5. **Active Session** → Control questions → Monitor participants
6. **End Session** → View results or end early

### Participant Flow
1. **Landing Page** → Enter room code → Click "Join Room"
2. **Join Room** → Enter name → Submit
3. **Session Lobby** → Wait for host to start
4. **Active Session** → View questions
5. **Session End** → View results or leave

## Error Handling

### Frontend Error Handling
- Try-catch blocks around API calls
- User-friendly error messages
- Loading states during async operations
- Fallback UI for error states

### Backend Error Handling
- Centralized error responses
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Socket error events

### Common Error Scenarios
1. **Invalid Room Code**: 404 response
2. **Session Full**: 400 response
3. **Network Issues**: Connection retry
4. **Expired Session**: Redirect to home
5. **Lost Connection**: Reconnection attempt

## Performance Considerations

### Frontend Optimizations
- Lazy loading of routes
- Memoized components where needed
- Efficient re-renders with proper dependencies
- Debounced user inputs

### Backend Optimizations
- Indexed database queries (roomCode)
- Efficient broadcast strategies
- Connection pooling
- TTL indexes for auto-cleanup

### Real-Time Optimizations
- WebSocket transport only
- Minimal data in events
- Room-based broadcasting
- Connection state management

## Deployment Considerations

### Environment Variables
```env
# Backend
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://...
JWT_SECRET=secure-secret
CLIENT_URL=https://app.sparkcircle.com

# Frontend
REACT_APP_API_URL=https://api.sparkcircle.com
REACT_APP_SOCKET_URL=https://api.sparkcircle.com
```

### Production Checklist
- [ ] SSL/TLS certificates
- [ ] Environment variables secured
- [ ] MongoDB connection string updated
- [ ] CORS origins configured
- [ ] Rate limiting adjusted
- [ ] Error logging setup
- [ ] Monitoring configured
- [ ] Backup strategy defined

### Scaling Considerations
1. **Horizontal Scaling**: Multiple server instances
2. **Load Balancing**: Sticky sessions for Socket.io
3. **Database Scaling**: MongoDB replica sets
4. **CDN**: Static asset delivery
5. **Redis**: Session state sharing (future)

## Best Practices for Extension

### Adding New Features
1. **New Question Themes**
   - Add to `/backend/data/questions.js`
   - Update theme colors in `QuestionCard.js`
   - Add to default themes in session creation

2. **New Socket Events**
   - Define event in `socketHandler.js`
   - Add client listener in component
   - Update session state accordingly

3. **New Pages**
   - Create component in `/pages`
   - Add route in `App.js`
   - Update navigation logic

4. **New API Endpoints**
   - Add route in `/backend/routes`
   - Define controller logic
   - Update frontend API utils

### Code Organization
- Keep components small and focused
- Use custom hooks for complex logic
- Maintain consistent error handling
- Document socket events clearly
- Test real-time features thoroughly

## Conclusion

SparkCircle's architecture prioritizes real-time synchronization, user experience, and maintainability. The separation of concerns between REST API (CRUD operations) and Socket.io (real-time updates) provides a clean, scalable foundation for building collaborative features.

The session-based model with automatic expiry ensures privacy while the host-controlled flow maintains order in group settings. This architecture can easily be extended for additional features like breakout rooms, anonymous responses, or integration with third-party services. 