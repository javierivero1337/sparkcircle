# SparkCircle Frontend Development Plan 🎨

## Current Status
- ✅ Backend server running on port 3001
- ✅ Frontend React app running on port 3000
- ✅ Socket.io connection established
- ✅ Test page showing all connections work
- 🎯 **Ready to build the actual SparkCircle UI!**

## 🎯 Frontend Views to Build

### 1. **Landing Page** (`/`)
**Purpose:** Welcome screen and entry point
**Features:**
- Welcome message and SparkCircle branding
- "Create Room" button for hosts
- "Join Room" input field for participants
- Brief explanation of how SparkCircle works
- Modern, clean design with good UX

### 2. **Session Lobby** (`/room/:code`)
**Purpose:** Waiting room before session starts
**Features:**
- Display room code prominently
- Real-time participant list
- "Waiting for host to start" message for participants
- Session settings display (question themes, etc.)
- Host sees "Start Session" button
- Leave room functionality

### 3. **Active Session** (`/session/:code`)
**Purpose:** Main game experience
**Features:**
- Current question display

- Participant indicators (who's still active)
- Host controls (Next Question, End Session)
- Timer/progress indicators
- Real-time updates when participants pass

### 4. **Results/Summary** (`/session/:code/results`)
**Purpose:** Session completion
**Features:**
- Session completed message
- Basic stats (questions answered, passes used)
- "Start New Session" option
- Thank you message

## 🏗️ Components to Create

### Core Components

#### **QuestionCard.js**
- Display current question text
- Show question theme/category
- Clean, readable typography
- Responsive design

#### **ParticipantList.js**
- Show connected participants
- Real-time updates when people join/leave
- Visual indicators for active/passed participants
- Host badge for session creator

#### **HostControls.js**
- Next Question button
- End Session button
- Session settings
- Only visible to session host

#### **LoadingSpinner.js**
- Reusable loading component
- Use during API calls and transitions

### Page Components

#### **LandingPage.js**
- Main entry point
- Create/Join room options
- App introduction

#### **CreateRoom.js**
- Host name input
- Session settings (optional)
- Create room API call
- Redirect to lobby

#### **JoinRoom.js**
- Room code input
- Participant name input
- Join room API call
- Error handling for invalid codes

#### **SessionLobby.js**
- Waiting room interface
- Participant management
- Start session controls

#### **ActiveSession.js**
- Main game interface
- Question display
- Pass functionality
- Real-time updates

#### **SessionResults.js**
- End-of-session summary
- Navigation options

## 📁 Recommended File Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── QuestionCard.js
│   ├── ParticipantList.js
│   ├── HostControls.js
│   └── LoadingSpinner.js
├── pages/               # Main page components
│   ├── LandingPage.js
│   ├── CreateRoom.js
│   ├── JoinRoom.js
│   ├── SessionLobby.js
│   ├── ActiveSession.js
│   └── SessionResults.js
├── hooks/               # Custom React hooks
│   ├── useSocket.js     # Socket.io connection management
│   └── useSession.js    # Session state management
├── utils/               # Helper functions
│   └── api.js           # API call functions
├── App.js              # Main router component
└── index.js            # Entry point
```

## 🚀 Development Roadmap

### Phase 1: Foundation (Start Here)
1. **Set up React Router** - Navigation between pages
2. **Create Landing Page** - First user experience
3. **Build CreateRoom component** - Host functionality
4. **Build JoinRoom component** - Participant functionality

### Phase 2: Core Functionality
5. **Create SessionLobby** - Waiting room experience
6. **Build ParticipantList** - Real-time participant tracking
7. **Set up Socket.io hooks** - Real-time communication

### Phase 3: Main Experience
8. **Create ActiveSession** - Main game interface
9. **Build QuestionCard** - Question display
10. **Add HostControls** - Session management
11. **Implement pass functionality** - Core game mechanic

### Phase 4: Polish & Completion
12. **Create SessionResults** - End-of-session experience
13. **Add LoadingSpinner** - Better UX during transitions
14. **Error handling** - Graceful error states
15. **Mobile responsiveness** - Works on all devices

## 🔌 API Integration Points

### REST API Calls
- `POST /api/sessions/create` - Create new session
- `POST /api/sessions/join` - Join existing session
- `GET /api/sessions/:roomCode` - Get session details

### Socket.io Events

**Client → Server:**
- `join-room` - Join a session room
- `start-session` - Start the session (host only)
- `next-question` - Get next question

- `end-session` - End the session (host only)

**Server → Client:**
- `session-state` - Current session state
- `participant-joined` - New participant joined
- `participant-left` - Participant disconnected
- `session-started` - Session has started
- `new-question` - New question available

- `session-ended` - Session has ended
- `no-more-questions` - All questions exhausted
- `error` - Error occurred

## 🎨 Design Principles

### UI/UX Guidelines
- **Clean & Modern:** Use Tailwind CSS for consistent styling
- **Mobile-First:** Responsive design for all screen sizes
- **Real-Time:** Immediate feedback for all actions
- **Accessible:** Clear typography, good contrast, intuitive navigation
- **Error-Friendly:** Clear error messages and recovery options

### Color Scheme (Suggested)
- Primary: Blue/Indigo gradient (already in test page)
- Success: Green for connected states

- Error: Red for disconnections/errors
- Neutral: Gray for secondary text

## 🔧 Technical Requirements

### Dependencies Already Available
- ✅ React 19.1.0
- ✅ React Router DOM 7.6.3
- ✅ Socket.io Client 4.8.1
- ✅ Axios 1.10.0
- ✅ Tailwind CSS 3.4.17

### Custom Hooks Needed
- `useSocket()` - Manage Socket.io connection and events
- `useSession()` - Manage session state and participants
- `useLocalStorage()` - Persist user preferences

### Utility Functions Needed
- API wrapper functions
- Room code validation
- Error handling helpers
- Local storage helpers

## 🧪 Testing Strategy

### Component Testing
- Test each component in isolation
- Mock Socket.io connections
- Test error states and edge cases

### Integration Testing
- Test full user flows
- Test real-time functionality
- Test with multiple participants

### User Experience Testing
- Test on mobile devices
- Test with slow connections
- Test accessibility features

## 📋 Development Checklist

### Before Starting
- [ ] Understand current architecture
- [ ] Review API documentation
- [ ] Set up development environment
- [ ] Plan component hierarchy

### During Development
- [ ] Follow React best practices
- [ ] Use TypeScript for better code quality (optional)
- [ ] Implement proper error boundaries
- [ ] Add loading states for all async operations
- [ ] Test real-time functionality frequently

### Before Deployment
- [ ] Test all user flows
- [ ] Verify mobile responsiveness
- [ ] Check accessibility compliance
- [ ] Optimize bundle size
- [ ] Add proper error handling

---

**Next Step:** Start with setting up React Router and creating the Landing Page component! 