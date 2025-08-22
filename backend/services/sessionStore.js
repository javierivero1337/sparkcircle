const { nanoid } = require('nanoid');

class SessionStore {
  constructor() {
    this.sessions = new Map();
    this.roomCodes = new Set();
    
    // Clean up expired sessions every hour
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000);
  }

  // Generate a unique room code
  generateRoomCode() {
    let roomCode;
    do {
      // Generate a 6-character uppercase code, replacing confusing characters
      roomCode = nanoid(6).toUpperCase().replace(/[0O1Il]/g, 'X');
    } while (this.roomCodes.has(roomCode));
    
    return roomCode;
  }

  // Create a new session
  async create(sessionData) {
    const roomCode = this.generateRoomCode();
    const hostParticipantId = nanoid();
    
    const session = {
      _id: nanoid(),
      roomCode,
      hostId: hostParticipantId,
      participants: [{
        id: hostParticipantId,
        name: sessionData.hostName || 'Host',
        joinedAt: new Date()
      }],
      settings: {
        themes: sessionData.settings?.themes || ['dreams', 'values', 'growth', 'quirks', 'connections', 'curiosities'],
        mode: sessionData.settings?.mode || 'guided',
        maxParticipants: sessionData.settings?.maxParticipants || 20,
        rounds: sessionData.settings?.rounds || 5,
        turnTimerSeconds: sessionData.settings?.turnTimerSeconds || 60
      },
      gameState: {
        currentRound: 1,
        currentTurnIndex: 0,
        turnOrder: [],
        currentPlayerThemeSelection: null,
        turnStartedAt: null
      },
      currentQuestion: null,
      usedQuestions: [],
      status: 'waiting',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
    
    this.sessions.set(roomCode, session);
    this.roomCodes.add(roomCode);
    
    return { session, hostParticipantId };
  }

  // Find a session by room code
  async findByRoomCode(roomCode) {
    const session = this.sessions.get(roomCode?.toUpperCase());
    
    // Check if session exists and hasn't expired
    if (session && new Date() < session.expiresAt) {
      return session;
    }
    
    // Clean up expired session if found
    if (session) {
      this.sessions.delete(roomCode);
      this.roomCodes.delete(roomCode);
    }
    
    return null;
  }

  // Find a session by ID
  async findById(sessionId) {
    for (const [_, session] of this.sessions) {
      if (session._id === sessionId) {
        if (new Date() < session.expiresAt) {
          return session;
        }
        // Clean up expired session
        this.sessions.delete(session.roomCode);
        this.roomCodes.delete(session.roomCode);
        return null;
      }
    }
    return null;
  }

  // Update a session
  async update(roomCode, updates) {
    const session = await this.findByRoomCode(roomCode);
    if (!session) return null;
    
    // Deep merge updates
    Object.assign(session, updates);
    this.sessions.set(roomCode.toUpperCase(), session);
    
    return session;
  }

  // Update session by ID
  async findByIdAndUpdate(sessionId, updates) {
    for (const [roomCode, session] of this.sessions) {
      if (session._id === sessionId) {
        Object.assign(session, updates);
        this.sessions.set(roomCode, session);
        return session;
      }
    }
    return null;
  }

  // Delete a session
  async delete(roomCode) {
    const upperCode = roomCode?.toUpperCase();
    const session = this.sessions.get(upperCode);
    
    if (session) {
      this.sessions.delete(upperCode);
      this.roomCodes.delete(upperCode);
      return true;
    }
    
    return false;
  }

  // Clean up expired sessions
  cleanupExpiredSessions() {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [roomCode, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(roomCode);
        this.roomCodes.delete(roomCode);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  // Get all active sessions (for debugging/monitoring)
  getAllSessions() {
    return Array.from(this.sessions.values()).filter(
      session => new Date() < session.expiresAt
    );
  }

  // Get session count
  getSessionCount() {
    return this.sessions.size;
  }
}

// Export singleton instance
module.exports = new SessionStore();
