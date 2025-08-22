const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const sessionStore = require('../services/sessionStore');

// Create a new session
router.post('/create', async (req, res) => {
  try {
    const { hostName, settings = {} } = req.body;
    
    // Create new session using in-memory store
    const { session, hostParticipantId } = await sessionStore.create({
      hostName,
      settings
    });
    
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
    const session = await sessionStore.findByRoomCode(roomCode);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }
    
    if (session.status === 'ended') {
      return res.status(400).json({ 
        success: false, 
        error: 'This session has ended' 
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
      name: participantName || 'Guest',
      joinedAt: new Date()
    });
    
    // Update session in store
    await sessionStore.update(roomCode, session);
    
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
    const session = await sessionStore.findByRoomCode(req.params.roomCode);
    
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

// Update session settings (host only)
router.put('/:roomCode/settings', async (req, res) => {
  try {
    const { settings, hostId } = req.body;
    
    const session = await sessionStore.findByRoomCode(req.params.roomCode);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }
    
    // Verify host
    if (session.hostId !== hostId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only the host can update settings' 
      });
    }
    
    // Update settings
    session.settings = { ...session.settings, ...settings };
    await sessionStore.update(req.params.roomCode, session);
    
    res.json({
      success: true,
      settings: session.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update settings' 
    });
  }
});

module.exports = router;