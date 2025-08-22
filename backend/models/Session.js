const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  hostId: {
    type: String,
    required: true
  },
  participants: [{
    id: String,
    name: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    themes: {
      type: [String],
      default: ['dreams', 'values', 'growth', 'quirks', 'connections', 'curiosities']
    },
    mode: {
      type: String,
      enum: ['guided', 'free-flow'],
      default: 'guided'
    },
    maxParticipants: {
      type: Number,
      default: 20
    },
    rounds: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    },
    turnTimerSeconds: {
      type: Number,
      default: 60,
      min: 30,
      max: 300
    }
  },
  gameState: {
    currentRound: {
      type: Number,
      default: 1
    },
    currentTurnIndex: {
      type: Number,
      default: 0
    },
    turnOrder: [{
      type: String // participant IDs in turn order
    }],
    currentPlayerThemeSelection: {
      type: String,
      enum: ['dreams', 'values', 'growth', 'quirks', 'connections', 'curiosities', null],
      default: null
    },
    turnStartedAt: {
      type: Date,
      default: null
    }
  },
  currentQuestion: {
    id: String,
    text: String,
    theme: String
  },
  usedQuestions: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['waiting', 'active', 'ended'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

module.exports = mongoose.model('Session', sessionSchema); 