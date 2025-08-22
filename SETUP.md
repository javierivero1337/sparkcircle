# SparkCircle Development Setup Guide 🚀

This guide will help you set up and run the SparkCircle MVP on your local machine.

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SparkCircle MVP                           │
├─────────────────────────────┬───────────────────────────────────┤
│     Frontend (Port 3000)    │      Backend (Port 3001)          │
├─────────────────────────────┼───────────────────────────────────┤
│ • React.js                  │ • Node.js/Express                 │
│ • Socket.io Client          │ • Socket.io Server                │
│ • Tailwind CSS              │ • MongoDB (Mongoose)              │
│ • React Router              │ • JWT Authentication              │
│ • Axios                     │ • Rate Limiting & Security        │
└─────────────────────────────┴───────────────────────────────────┘
```

## Prerequisites

Before starting, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (optional but recommended)

## Quick Setup Steps

### 1. Install MongoDB (if not already installed)

**On macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows/Linux:**
Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

### 2. Clone or Download the Project

Navigate to your project folder:
```bash
cd /Users/javierrivero/Coding/sparkcircle
```

### 3. Set Up Environment Variables

Copy the environment example file:
```bash
cd backend
cp env.example .env
cd ..
```

The default `.env` settings:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sparkcircle
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

### 4. Install Dependencies

From the root directory (`sparkcircle`), run:
```bash
npm run setup
```

This will install dependencies for the root, backend, and frontend.

### 5. Start the Development Servers

From the root directory, run:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend React app on http://localhost:3000

## Project Structure

```
sparkcircle/
├── backend/                    # Node.js/Express backend
│   ├── .env                   # Environment variables (create from env.example)
│   ├── server.js              # Main Express server with Socket.io
│   ├── models/                # MongoDB schemas
│   │   └── Session.js         # Session model with participants, questions, settings
│   ├── routes/                # REST API endpoints
│   │   └── sessions.js        # Session CRUD operations
│   ├── socket/                # Real-time event handlers
│   │   └── socketHandler.js   # Socket.io event management
│   ├── data/                  # Static data
│   │   └── questions.js       # Question bank (25 questions across 5 themes)
│   └── package.json           # Backend dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.js            # Main React component (currently test page)
│   │   ├── App.css           # App-specific styles
│   │   └── index.css         # Tailwind CSS imports
│   ├── public/               # Static assets
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── postcss.config.js     # PostCSS configuration
│   └── package.json          # Frontend dependencies
│
├── package.json              # Root package with npm scripts
├── test-setup.js            # Setup verification script
├── SETUP.md                 # This file
└── readme.md                # Project vision and roadmap
```

## API Endpoints

### REST API (http://localhost:3001)

- `GET /api/health` - Health check endpoint
- `POST /api/sessions/create` - Create a new session
- `POST /api/sessions/join` - Join an existing session
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

## Features Implemented

### Backend
- ✅ Express server with CORS, Helmet, and rate limiting
- ✅ MongoDB integration with Mongoose
- ✅ Session management with unique room codes
- ✅ Real-time Socket.io communication
- ✅ Question bank with 5 themes (25 questions)
- ✅ Smart question selection (no repeats)
- ✅ Host controls for guided mode
- ✅ Auto-cleanup (sessions expire after 24 hours)

### Frontend
- ✅ React app with Tailwind CSS setup
- ✅ Socket.io client connection
- ✅ Test page showing connection status
- ✅ API integration ready

## Verifying Everything Works

1. **Check MongoDB is running:**
   ```bash
   mongosh --eval "db.version()"
   ```

2. **Check Backend is running:**
   - Visit http://localhost:3001/api/health
   - You should see: `{"status":"OK","message":"SparkCircle backend is running","timestamp":"..."}`

3. **Check Frontend is running:**
   - Visit http://localhost:3000
   - You should see the SparkCircle Development Test page with:
     - ✅ Backend API: Connected
     - ✅ Socket.io: Connected

4. **Test API - Create a session:**
   ```bash
   curl -X POST http://localhost:3001/api/sessions/create \
     -H "Content-Type: application/json" \
     -d '{"hostName": "Test Host"}'
   ```

## Common Issues & Solutions

### Issue: Tailwind CSS PostCSS error
**Solution:** Install the new PostCSS plugin:
```bash
cd frontend
npm install -D @tailwindcss/postcss
```

### Issue: MongoDB connection error
**Solution:** Make sure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Check if MongoDB is running
brew services list | grep mongodb
```

### Issue: Port already in use
**Solution:** Kill the process or change ports:
```bash
# Find process using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Issue: npm install fails
**Solution:** Clean install:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm run setup
```

## Development Commands

```bash
# From root directory:
npm run dev          # Start both servers concurrently
npm run server       # Start only backend
npm run client       # Start only frontend
npm run setup        # Install all dependencies

# Backend development:
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start normally

# Frontend development:
cd frontend
npm start           # Start React dev server
npm run build       # Build for production

# Utility:
node test-setup.js   # Verify setup is correct
```

## Next Steps

The MVP infrastructure is ready! Next components to build:

1. **Landing Page** (`/`)
   - Create room button
   - Join room input
   - Brief explanation

2. **Session Lobby** (`/room/:code`)
   - Participant list
   - Waiting for host to start
   - Settings display

3. **Active Session** (`/session/:code`)
   - Current question display
   
   - Participant indicators
   - Host controls (next question, end session)

4. **Components to Create:**
   - `CreateRoom.js` - Host creates session
   - `JoinRoom.js` - Participants join
   - `SessionLobby.js` - Waiting room
   - `ActiveSession.js` - Main game view
   - `QuestionCard.js` - Question display
   - `ParticipantList.js` - Show who's connected
   - `HostControls.js` - Admin controls

---

**Need help?** 
- Backend logs appear in the `[0]` prefixed lines
- Frontend logs appear in the `[1]` prefixed lines
- Check browser console for Socket.io connection logs
- MongoDB logs: `tail -f /opt/homebrew/var/log/mongodb/mongo.log` 