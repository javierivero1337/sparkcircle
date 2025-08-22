const sessionStore = require('../services/sessionStore');
const { getQuestionsByThemes, getRandomQuestion } = require('../data/questions');

module.exports = (io, socket) => {
  // Join a room
  socket.on('join-room', async (data) => {
    const { roomCode, participantId } = data;
    
    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Join the socket room
      socket.join(roomCode);
      socket.participantId = participantId;
      socket.roomCode = roomCode;
      
      // Notify others in the room
      socket.to(roomCode).emit('participant-joined', {
        participant: session.participants.find(p => p.id === participantId)
      });
      
      // Send current session state to the joining participant
      socket.emit('session-state', {
        participants: session.participants,
        currentQuestion: session.currentQuestion,
        status: session.status,
        questionsAsked: session.usedQuestions || [],
        hostId: session.hostId,
        settings: session.settings,
        gameState: session.gameState
      });
      
      console.log(`Participant ${participantId} joined room ${roomCode}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });
  
  // Start session (host only)
  socket.on('start-session', async (data) => {
    const { roomCode, hostId } = data;
    
    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session || session.hostId !== hostId) {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }
      
      // Initialize turn order based on participants
      const turnOrder = session.participants.map(p => p.id);
      
      // Update session status and initialize game state
      session.status = 'active';
      session.gameState.turnOrder = turnOrder;
      session.gameState.currentTurnIndex = 0;
      session.gameState.currentRound = 1;
      await sessionStore.update(roomCode, session);
      
      // Notify all participants
      io.to(roomCode).emit('session-started', {
        status: 'active',
        gameState: session.gameState
      });
      
      // Start the first turn
      io.to(roomCode).emit('turn-started', {
        currentPlayerId: turnOrder[0],
        turnIndex: 0,
        round: 1,
        timeLimit: session.settings.turnTimerSeconds
      });
      
      console.log(`Session ${roomCode} started`);
    } catch (error) {
      console.error('Error starting session:', error);
      socket.emit('error', { message: 'Failed to start session' });
    }
  });
  
  // Select theme (current player only)
  socket.on('select-theme', async (data) => {
    const { roomCode, participantId, theme } = data;
    
    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Verify it's the current player's turn
      const currentPlayerId = session.gameState.turnOrder[session.gameState.currentTurnIndex];
      if (participantId !== currentPlayerId) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }
      
      // Get a random question from the selected theme
      const themeQuestions = getQuestionsByThemes([theme]);
      const availableQuestions = themeQuestions.filter(q => !session.usedQuestions.includes(q.id));
      
      if (availableQuestions.length === 0) {
        socket.emit('error', { message: 'No more questions available in this theme' });
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions[randomIndex];
      
      // Update session with new question
      session.currentQuestion = selectedQuestion;
      session.usedQuestions.push(selectedQuestion.id);
      session.gameState.currentPlayerThemeSelection = theme;
      session.gameState.turnStartedAt = new Date();
      await sessionStore.update(roomCode, session);
      
      // Broadcast the new question to all participants
      io.to(roomCode).emit('new-question', {
        question: selectedQuestion,
        currentPlayerId: currentPlayerId,
        theme: theme
      });
      
      console.log(`Player ${participantId} selected theme ${theme} in room ${roomCode}`);
    } catch (error) {
      console.error('Error selecting theme:', error);
      socket.emit('error', { message: 'Failed to select theme' });
    }
  });
  
  // Pass turn to next player
  socket.on('pass-turn', async (data) => {
    const { roomCode, participantId } = data;
    
    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Verify it's the current player passing their turn
      const currentPlayerId = session.gameState.turnOrder[session.gameState.currentTurnIndex];
      if (participantId !== currentPlayerId) {
        socket.emit('error', { message: 'Not your turn to pass' });
        return;
      }
      
      // Calculate next turn
      let nextTurnIndex = session.gameState.currentTurnIndex + 1;
      let nextRound = session.gameState.currentRound;
      
      // Check if we've completed a round
      if (nextTurnIndex >= session.gameState.turnOrder.length) {
        nextTurnIndex = 0;
        nextRound = session.gameState.currentRound + 1;
        
        // Check if game is complete
        if (nextRound > session.settings.rounds) {
          session.status = 'ended';
          await sessionStore.update(roomCode, session);
          
          io.to(roomCode).emit('session-ended', {
            finalRound: session.gameState.currentRound,
            questionsAsked: session.usedQuestions.length
          });
          
          console.log(`Session ${roomCode} ended after ${session.settings.rounds} rounds`);
          return;
        }
      }
      
      // Update game state
      session.gameState.currentTurnIndex = nextTurnIndex;
      session.gameState.currentRound = nextRound;
      session.gameState.currentPlayerThemeSelection = null;
      session.gameState.turnStartedAt = null;
      session.currentQuestion = null;
      await sessionStore.update(roomCode, session);
      
      // Notify all participants of the new turn
      const nextPlayerId = session.gameState.turnOrder[nextTurnIndex];
      io.to(roomCode).emit('turn-started', {
        currentPlayerId: nextPlayerId,
        turnIndex: nextTurnIndex,
        round: nextRound,
        timeLimit: session.settings.turnTimerSeconds
      });
      
      console.log(`Turn passed to player ${nextPlayerId} in room ${roomCode}`);
    } catch (error) {
      console.error('Error passing turn:', error);
      socket.emit('error', { message: 'Failed to pass turn' });
    }
  });
  
  // Force pass turn (host only)
  socket.on('force-pass-turn', async (data) => {
    const { roomCode, hostId } = data;

    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Verify host
      if (session.hostId !== hostId) {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      // Calculate next turn (reuse logic from pass-turn)
      let nextTurnIndex = session.gameState.currentTurnIndex + 1;
      let nextRound = session.gameState.currentRound;

      // Check if we've completed a round
      if (nextTurnIndex >= session.gameState.turnOrder.length) {
        nextTurnIndex = 0;
        nextRound = session.gameState.currentRound + 1;

        // Check if game is complete
        if (nextRound > session.settings.rounds) {
          session.status = 'ended';
          await sessionStore.update(roomCode, session);

          io.to(roomCode).emit('session-ended', {
            finalRound: session.gameState.currentRound,
            questionsAsked: session.usedQuestions.length
          });

          console.log(`Session ${roomCode} ended after ${session.settings.rounds} rounds (forced by host)`);
          return;
        }
      }

      // Update game state
      session.gameState.currentTurnIndex = nextTurnIndex;
      session.gameState.currentRound = nextRound;
      session.gameState.currentPlayerThemeSelection = null;
      session.gameState.turnStartedAt = null;
      session.currentQuestion = null;
      await sessionStore.update(roomCode, session);

      // Notify all participants of the new turn
      const nextPlayerId = session.gameState.turnOrder[nextTurnIndex];
      io.to(roomCode).emit('turn-started', {
        currentPlayerId: nextPlayerId,
        turnIndex: nextTurnIndex,
        round: nextRound,
        timeLimit: session.settings.turnTimerSeconds
      });

      console.log(`Host forced pass; turn moved to player ${nextPlayerId} in room ${roomCode}`);
    } catch (error) {
      console.error('Error forcing pass turn:', error);
      socket.emit('error', { message: 'Failed to force pass turn' });
    }
  });
  
  // Next question (host only in guided mode)
  socket.on('next-question', async (data) => {
    const { roomCode, hostId } = data;
    
    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Verify host in guided mode
      if (session.settings.mode === 'guided' && session.hostId !== hostId) {
        socket.emit('error', { message: 'Only host can control questions in guided mode' });
        return;
      }
      
      // Get available questions based on selected themes
      const availableQuestions = getQuestionsByThemes(session.settings.themes);
      const nextQuestion = getRandomQuestion(availableQuestions, session.usedQuestions);
      
      if (!nextQuestion) {
        io.to(roomCode).emit('no-more-questions');
        return;
      }
      
      // Update session with new question
      session.currentQuestion = nextQuestion;
      session.usedQuestions.push(nextQuestion.id);
      await sessionStore.update(roomCode, session);
      
      // Send new question to all participants
      io.to(roomCode).emit('new-question', {
        question: nextQuestion
      });
      
      console.log(`New question for room ${roomCode}:`, nextQuestion.text);
    } catch (error) {
      console.error('Error getting next question:', error);
      socket.emit('error', { message: 'Failed to get next question' });
    }
  });
  
  // End session (host only)
  socket.on('end-session', async (data) => {
    const { roomCode, hostId } = data;
    
    try {
      const session = await sessionStore.findByRoomCode(roomCode);
      if (!session || session.hostId !== hostId) {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }
      
      // Update session status
      session.status = 'ended';
      await sessionStore.update(roomCode, session);
      
      // Notify all participants
      io.to(roomCode).emit('session-ended');
      
      // Clean up - remove all sockets from room
      io.in(roomCode).socketsLeave(roomCode);
      
      console.log(`Session ${roomCode} ended`);
    } catch (error) {
      console.error('Error ending session:', error);
      socket.emit('error', { message: 'Failed to end session' });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', async () => {
    if (socket.roomCode && socket.participantId) {
      try {
        const session = await sessionStore.findByRoomCode(socket.roomCode);
        if (session) {
          // Notify others that someone left
          socket.to(socket.roomCode).emit('participant-left', {
            participantId: socket.participantId
          });
        }
        
        console.log(`Participant ${socket.participantId} disconnected from room ${socket.roomCode}`);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    }
  });
}; 