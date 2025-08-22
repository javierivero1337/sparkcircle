require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const mongoose = require('mongoose'); // No longer needed - using in-memory store

// Import routes and socket handlers (we'll create these next)
const sessionRoutes = require('./routes/sessions');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS - handle multiple origins for production
const allowedOrigins = process.env.CLIENT_URL ? 
  process.env.CLIENT_URL.split(',').map(url => url.trim()) : 
  ['http://localhost:3000'];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Using in-memory session store instead of MongoDB
const sessionStore = require('./services/sessionStore');
console.log('✅ In-memory session store initialized');

// Routes
app.use('/api/sessions', sessionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SparkCircle backend is running',
    timestamp: new Date().toISOString(),
    activeSessions: sessionStore.getSessionCount(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  socketHandler(io, socket);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 SparkCircle backend running on port ${PORT}`);
}); 