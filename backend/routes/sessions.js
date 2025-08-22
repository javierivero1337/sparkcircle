const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Session = require('../models/Session');

// Generate a unique room code
const generateRoomCode = () => {
  // Generate a 6-character uppercase code
  return nanoid(6).toUpperCase().replace(/[0O1Il]/g, 'X'); // Replace confusing characters
};

// Create a new session
router.post('/create', async (req, res) => {
  try {
    const { hostName, settings = {} } = req.body;
    
    // Generate unique room code
    let roomCode;
    let isUnique = false;
    
    while (!isUnique) {
      roomCode = generateRoomCode();
      const existing = await Session.findOne({ roomCode });
      if (!existing) isUnique = true;
    }
    
    // Create new session
    const hostParticipantId = nanoid();
    const session = new Session({
      roomCode,
      hostId: hostParticipantId, // Host ID is same as their participant ID
      participants: [{
        id: hostParticipantId,
        name: hostName || 'Host'
      }],
      settings: {
        themes: settings.themes || ['dreams', 'values', 'growth', 'quirks', 'connections', 'curiosities'],
        mode: settings.mode || 'guided',
        maxParticipants: settings.maxParticipants || 20,
        rounds: settings.rounds || 5,
        turnTimerSeconds: settings.turnTimerSeconds || 60
      }
    });
    
    await session.save();
    
    res.json({
      success: true,
      roomCode: session.roomCode,
      participantId: hostParticipantId,
      hostId: session.hostId,
      sessionId: session._id
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create session' 
    });
  }
});

// Join a session
router.post('/join', async (req, res) => {
  try {
    const { roomCode, participantName } = req.body;
    
    // Find session
    const session = await Session.findOne({ 
      roomCode: roomCode.toUpperCase(),
      status: { $ne: 'ended' }
    });
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found or has ended' 
      });
    }
    
    // Check if session is full
    if (session.participants.length >= session.settings.maxParticipants) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session is full' 
      });
    }
    
    // Add participant
    const participantId = nanoid();
    session.participants.push({
      id: participantId,
      name: participantName || 'Guest'
    });
    
    await session.save();
    
    res.json({
      success: true,
      sessionId: session._id,
      roomCode: session.roomCode,
      participantId,
      settings: session.settings,
      status: session.status
    });
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to join session' 
    });
  }
});

// Get session details
router.get('/:roomCode', async (req, res) => {
  try {
    const session = await Session.findOne({ 
      roomCode: req.params.roomCode.toUpperCase() 
    });
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }
    
    res.json({
      success: true,
      roomCode: session.roomCode,
      hostId: session.hostId,
      hostName: session.participants.find(p => p.id === session.hostId)?.name || 'Host',
      participants: session.participants,
      settings: session.settings,
      status: session.status,
      currentQuestion: session.currentQuestion,
      questionsAsked: session.questionsAsked || [],
      startedAt: session.startedAt,
      endedAt: session.endedAt
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch session' 
    });
  }
});

module.exports = router; 