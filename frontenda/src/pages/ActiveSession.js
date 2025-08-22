import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { sessionAPI } from '../utils/api';
import QuestionCard from '../components/QuestionCard';
import ParticipantList from '../components/ParticipantList';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeSelector from '../components/ThemeSelector';
import Timer from '../components/Timer';
import logo from '../logo.svg';
import CountdownOverlay from '../components/CountdownOverlay';
import HostControls from '../components/HostControls';
// We will reuse select-theme to fetch another question for skip.

const ActiveSession = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { emit, on, off } = useSocket();
  
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionInfo, setSessionInfo] = useState(null);
  // Countdown state
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  // Skip state
  const [skipUsed, setSkipUsed] = useState(false);
  
  // Turn-based state
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [turnTimeLimit, setTurnTimeLimit] = useState(60);
  const [sessionStartedViaSocket, setSessionStartedViaSocket] = useState(false);

  // Handle 3-second countdown timer
  useEffect(() => {
    if (!showCountdown) return;

    if (countdown <= 0) {
      const timeout = setTimeout(() => setShowCountdown(false), 500); // brief "Go!" display
      return () => clearTimeout(timeout);
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showCountdown, countdown]);

  useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add 3D flip animation styles
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      @keyframes orbit-dance-1 {
        0% {
          transform: translate(0, 0) scale(1) rotate(0deg);
        }
        25% {
          transform: translate(120px, -80px) scale(1.3) rotate(90deg);
        }
        50% {
          transform: translate(-100px, -120px) scale(0.9) rotate(180deg);
        }
        75% {
          transform: translate(-120px, 80px) scale(1.2) rotate(270deg);
        }
        100% {
          transform: translate(0, 0) scale(1) rotate(360deg);
        }
      }
      
      @keyframes orbit-dance-2 {
        0% {
          transform: translate(0, 0) scale(1) rotate(0deg);
        }
        20% {
          transform: translate(-100px, 60px) scale(0.8) rotate(-72deg);
        }
        40% {
          transform: translate(80px, 100px) scale(1.4) rotate(-144deg);
        }
        60% {
          transform: translate(100px, -60px) scale(1.1) rotate(-216deg);
        }
        80% {
          transform: translate(-80px, -100px) scale(0.9) rotate(-288deg);
        }
        100% {
          transform: translate(0, 0) scale(1) rotate(-360deg);
        }
      }
    `;
    document.head.appendChild(style);

    // Get session info from localStorage
    const storedInfo = localStorage.getItem('sessionInfo');
    if (storedInfo) {
      setSessionInfo(JSON.parse(storedInfo));
    } else {
      // If no session info, redirect to join page
      navigate(`/join/${roomCode}`);
      return;
    }

    // Load session data
    loadSession();
  }, [roomCode, navigate]);

  useEffect(() => {
    if (!sessionInfo) return;

    // Join the socket room
    emit('join-room', {
      roomCode: roomCode,
      participantId: sessionInfo.participantId,
    });

    // Socket event listeners
    const handleSessionState = (data) => {
      // Ensure questionsAsked exists
      const sessionData = {
        ...data,
        questionsAsked: data.questionsAsked || []
      };
      setSession(sessionData);
      
      // Update turn state if game is active
      if (data.gameState && data.status === 'active') {
        const currentPlayer = data.gameState.turnOrder[data.gameState.currentTurnIndex];
        setCurrentPlayerId(currentPlayer);
        setCurrentRound(data.gameState.currentRound);
        const isCurrentPlayerTurn = currentPlayer === sessionInfo.participantId;
        setIsMyTurn(isCurrentPlayerTurn);
        
        // Only show the question to the current player
        if (data.currentQuestion && data.currentQuestion.text) {
          if (isCurrentPlayerTurn) {
            setCurrentQuestion(data.currentQuestion);
            setShowThemeSelector(false);
          } else {
            setCurrentQuestion(null);
            setShowThemeSelector(false);
          }
        } else {
          // No valid current question, so show theme selector if it's the player's turn
          setCurrentQuestion(null);
          setShowThemeSelector(isCurrentPlayerTurn);
        }
      }
      
      // If session has ended, redirect to results
      if (data.status === 'ended') {
        navigate(`/session/${roomCode}/results`);
      }
    };

    const handleTurnStarted = (data) => {
      setCurrentPlayerId(data.currentPlayerId);
      setCurrentRound(data.round);
      const isCurrentPlayerTurn = data.currentPlayerId === sessionInfo.participantId;
      setIsMyTurn(isCurrentPlayerTurn);
      setShowThemeSelector(isCurrentPlayerTurn);
      setTurnTimeLimit(data.timeLimit || 60);
      setCurrentQuestion(null);
      setSkipUsed(false);
      setActionLoading(false);
    };

    const handleNewQuestion = (data) => {
      // Only show the question to the player whose turn it is
      if (data.currentPlayerId === sessionInfo.participantId) {
        setCurrentQuestion(data.question);
      } else {
        setCurrentQuestion(null);
      }
      setShowThemeSelector(false);
      setActionLoading(false);
      // Upon receiving a new question because of a skip, keep skipUsed as is
    };



    const handleThemeSelectionRequired = () => {
      setShowThemeSelector(true);
      setCurrentQuestion(null);
    };

    const handleSessionEnded = () => {
      navigate(`/session/${roomCode}/results`);
    };

    const handleSessionStarted = (data) => {
      setSessionStartedViaSocket(true);
      // Update session status when transitioning from lobby
      setSession(prevSession => ({
        ...prevSession,
        status: 'active',
        gameState: data.gameState
      }));
      // Trigger countdown at the very beginning of the session
      setCountdown(3);
      setShowCountdown(true);
    };

    const handleNoMoreQuestions = () => {
      setError('All questions have been answered! Time to wrap up the session.');
      setActionLoading(false);
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      setError(error.message || 'An error occurred');
      setActionLoading(false);
    };

    // Register event listeners
    on('session-state', handleSessionState);
    on('session-started', handleSessionStarted);
    on('turn-started', handleTurnStarted);
    on('new-question', handleNewQuestion);
    on('theme-selection-required', handleThemeSelectionRequired);
    on('session-ended', handleSessionEnded);
    on('no-more-questions', handleNoMoreQuestions);
    on('error', handleError);

    // Cleanup
    return () => {
      off('session-state', handleSessionState);
      off('session-started', handleSessionStarted);
      off('turn-started', handleTurnStarted);
      off('new-question', handleNewQuestion);
      off('theme-selection-required', handleThemeSelectionRequired);
      off('session-ended', handleSessionEnded);
      off('no-more-questions', handleNoMoreQuestions);
      off('error', handleError);
    };
  }, [sessionInfo, roomCode, emit, on, off, navigate]);

  const loadSession = async () => {
    try {
      const data = await sessionAPI.getSession(roomCode);
      // Ensure questionsAsked exists
      const sessionData = {
        ...data,
        questionsAsked: data.questionsAsked || []
      };
      setSession(sessionData);
      // Show countdown only for very first question
      if (sessionData.status === 'active' && (sessionData.questionsAsked.length === 0)) {
        setCountdown(3);
        setShowCountdown(true);
      }
      
      // Update turn state if game is active
      if (data.gameState && data.status === 'active') {
        const currentPlayer = data.gameState.turnOrder[data.gameState.currentTurnIndex];
        setCurrentPlayerId(currentPlayer);
        setCurrentRound(data.gameState.currentRound);
        const isCurrentPlayerTurn = currentPlayer === sessionInfo.participantId;
        setIsMyTurn(isCurrentPlayerTurn);
        setTurnTimeLimit(data.settings.turnTimerSeconds || 60);
        
        // Only show the question to the current player
        if (data.currentQuestion && data.currentQuestion.text) {
          if (isCurrentPlayerTurn) {
            setCurrentQuestion(data.currentQuestion);
            setShowThemeSelector(false);
          } else {
            setCurrentQuestion(null);
            setShowThemeSelector(false);
          }
        } else {
          // No valid current question, so show theme selector if it's the player's turn
          setCurrentQuestion(null);
          setShowThemeSelector(isCurrentPlayerTurn);
        }
        
        console.log('LoadSession - Turn state:', {
          currentPlayer,
          isMyTurn: isCurrentPlayerTurn,
          hasQuestion: !!data.currentQuestion,
          showThemeSelector: isCurrentPlayerTurn && !data.currentQuestion
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session. Please try again.');
      setLoading(false);
    }
  };

  const handleSelectTheme = (theme) => {
    if (!isMyTurn) return;
    
    setActionLoading(true);
    setError('');
    emit('select-theme', {
      roomCode,
      participantId: sessionInfo.participantId,
      theme
    });
    // When selecting theme (initial or skip) we will disable further skips after first use inside handleSkip
  };

  const handleSkipQuestion = () => {
    if (!isMyTurn || skipUsed || !currentQuestion) return;

    setActionLoading(true);
    setError('');
    setSkipUsed(true);
    // Request new question with the same theme as current
    emit('select-theme', {
      roomCode,
      participantId: sessionInfo.participantId,
      theme: currentQuestion.theme
    });
  };

  const handlePassTurn = () => {
    if (!isMyTurn) return;
    
    setActionLoading(true);
    setError('');
    emit('pass-turn', {
      roomCode,
      participantId: sessionInfo.participantId
    });
  };

  const handleForcePassTurn = () => {
    if (!sessionInfo?.isHost) return;

    setActionLoading(true);
    emit('force-pass-turn', {
      roomCode,
      hostId: sessionInfo.participantId
    });
  };

  const handleTimeUp = () => {
    // Timer expired – player must manually click "Done!" to pass the turn.
    // No automatic pass here.
  };



  const handleEndSession = () => {
    if (!sessionInfo?.isHost) return;
    
    if (window.confirm('Are you sure you want to end this session? This cannot be undone.')) {
      setActionLoading(true);
      emit('end-session', { 
        roomCode,
        hostId: sessionInfo.participantId 
      });
    }
  };

  const handleLeaveSession = () => {
    if (window.confirm('Are you sure you want to leave this session?')) {
      localStorage.removeItem('sessionInfo');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F3EF' }}>
        <LoadingSpinner size="lg" text="Loading session..." />
      </div>
    );
  }

  if (!session || (session.status !== 'active' && !sessionStartedViaSocket)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F9F3EF' }}>
        <div 
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full text-center"
          style={{ backgroundColor: '#FFF8F0', border: '1px solid rgba(255, 231, 198, 0.5)' }}
        >
          <h2 
            className="text-2xl sm:text-3xl mb-4" 
            style={{ 
              color: '#151B1E',
              fontFamily: 'Instrument Serif, serif',
              fontWeight: '400'
            }}
          >
            Session Not Active
          </h2>
          <p 
            className="text-gray-600 mb-6" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            This session is not currently active.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-800 text-white font-medium py-3 px-8 rounded-full hover:bg-black transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F3EF' }}>
      {showCountdown && <CountdownOverlay seconds={countdown} />}
      {/* Navigation Bar - Subtle and Centered */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-2 transition-opacity duration-300">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logo}
              alt="SparkCircle logo" 
              className="w-24 h-12 sm:w-32 sm:h-16"
            />
          </div>
          
          {/* Centered Session Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span 
              className="text-gray-500 text-xs sm:text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Room code: {roomCode}
            </span>
            <span 
              className="text-gray-400 text-xs"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              •
            </span>
            <span 
              className="text-gray-500 text-xs sm:text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Round {currentRound}/{session?.settings?.rounds || 5}
            </span>
          </div>
          
          {/* Leave Session Button */}
          <button
            onClick={handleLeaveSession}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center text-xs sm:text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-2xl border" style={{ backgroundColor: '#FFE7C6', borderColor: 'rgba(255, 231, 198, 0.5)' }}>
            <p 
              className="text-yellow-800" 
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {error}
            </p>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {/* Main Content Area */}
          <div className="space-y-6 sm:space-y-8">
            {/* Main Card - Large and Prominent */}
            <div 
              className="rounded-2xl sm:rounded-3xl p-8 sm:p-12 min-h-96 flex flex-col justify-center relative overflow-hidden"
              style={{ backgroundColor: '#FFF8F0', border: '1px solid #EDE5DD' }}
            >
              {/* Dancing Radial Gradients - More visible when waiting */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                {/* Purple gradient - larger and more visible */}
                <div 
                  className="absolute w-96 h-96 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, #EBDBFE 0%, transparent 60%)',
                    opacity: currentQuestion ? '0.5' : '0.8',
                    animation: 'orbit-dance-1 12s ease-in-out infinite',
                    filter: 'blur(40px)',
                    transformOrigin: 'center'
                  }}
                />
                {/* Blue gradient - larger and more visible */}
                <div 
                  className="absolute w-80 h-80 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, #8EC4FE 0%, transparent 60%)',
                    opacity: currentQuestion ? '0.4' : '0.7',
                    animation: 'orbit-dance-2 10s ease-in-out infinite',
                    filter: 'blur(35px)',
                    transformOrigin: 'center'
                  }}
                />
                {/* Additional pink gradient for more movement */}
                <div 
                  className="absolute w-72 h-72 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, #FFB3D9 0%, transparent 65%)',
                    opacity: currentQuestion ? '0.4' : '0.7',
                    animation: 'orbit-dance-1 15s ease-in-out infinite reverse',
                    filter: 'blur(30px)',
                    transformOrigin: 'center'
                  }}
                />
              </div>



              {/* Central Content */}
              <div className="relative z-10 text-center">

                {showThemeSelector && isMyTurn ? (
                  <div>
                    <div className="flex flex-col items-center justify-center mb-8">
                      <h2 
                        className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-2"
                        style={{ 
                          color: '#151B1E',
                          fontFamily: 'Instrument Serif, serif',
                          fontWeight: '400'
                        }}
                      >
                        It's your turn!
                      </h2>
                      {currentQuestion && (
                        <div className="mt-4">
                          <Timer 
                            timeLimit={turnTimeLimit} 
                            onTimeUp={handleTimeUp}
                          />
                        </div>
                      )}
                    </div>
                    
                    <ThemeSelector 
                      onSelectTheme={handleSelectTheme}
                      disabled={actionLoading}
                      compact={true}
                    />
                  </div>
                ) : currentQuestion && currentQuestion.text ? (
                  <div>
                    <QuestionCard 
                      question={currentQuestion}
                      questionNumber={session?.questionsAsked?.length || 1}
                      timeLimit={turnTimeLimit}
                      onTimeUp={handleTimeUp}
                      isMyTurn={isMyTurn}
                      onPassTurn={handlePassTurn}
                      onSkipQuestion={handleSkipQuestion}
                      skipDisabled={skipUsed || actionLoading}
                      actionLoading={actionLoading}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <h2 
                      className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-4"
                      style={{ 
                        color: '#151B1E',
                        fontFamily: 'Instrument Serif, serif',
                        fontWeight: '400'
                      }}
                    >
                      It's {session?.participants?.find(p => p.id === currentPlayerId)?.name || 'Someone'}'s turn
                    </h2>
                    <p 
                      className="text-lg sm:text-xl text-gray-600"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Wait for them to finish their answer and get ready!
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          

                        

          {/* Host Controls Component */}
          {sessionInfo?.isHost && (
            <div className="mt-6 sm:mt-8 max-w-md mx-auto w-full">
              <HostControls
                onEndSession={handleEndSession}
                onForcePassTurn={handleForcePassTurn}
                loading={actionLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActiveSession; 