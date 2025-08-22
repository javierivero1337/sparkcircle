import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { sessionAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from '../logo.svg';

const SessionLobby = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { emit, on, off } = useSocket();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionInfo, setSessionInfo] = useState(null);
  const [starting, setStarting] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);

  useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add scroll listener for nav fade effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newNavOpacity = Math.max(0, 1 - scrollY / 50);
      setNavOpacity(newNavOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
    if (!sessionInfo) return; // TODO: remove this once we have a way to get the session info from the backend

    // Join the socket room
    emit('join-room', {
      roomCode: roomCode,
      participantId: sessionInfo.participantId,
    });

    // Socket event listeners
    const handleSessionState = (data) => {
      setSession(data);
      
      // If session has started, redirect to active session
      if (data.status === 'active') {
        navigate(`/session/${roomCode}`);
      }
    };

    const handleParticipantJoined = async (data) => {
      console.log('Participant joined:', data);
      // Reload session data to get updated participant list
      try {
        const updatedSession = await sessionAPI.getSession(roomCode);
        setSession(updatedSession);
      } catch (err) {
        console.error('Error updating session after participant joined:', err);
      }
    };

    const handleParticipantLeft = async (data) => {
      console.log('Participant left:', data);
      // Reload session data to get updated participant list
      try {
        const updatedSession = await sessionAPI.getSession(roomCode);
        setSession(updatedSession);
      } catch (err) {
        console.error('Error updating session after participant left:', err);
      }
    };

    const handleSessionStarted = () => {
      navigate(`/session/${roomCode}`);
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      setError(error.message || 'An error occurred');
    };

    // Register event listeners
    on('session-state', handleSessionState);
    on('participant-joined', handleParticipantJoined);
    on('participant-left', handleParticipantLeft);
    on('session-started', handleSessionStarted);
    on('error', handleError);

    // Cleanup
    return () => {
      off('session-state', handleSessionState);
      off('participant-joined', handleParticipantJoined);
      off('participant-left', handleParticipantLeft);
      off('session-started', handleSessionStarted);
      off('error', handleError);
    };
  }, [sessionInfo, roomCode, emit, on, off, navigate]);

  const loadSession = async () => {
    try {
      const data = await sessionAPI.getSession(roomCode);
      setSession(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session. Please try again.');
      setLoading(false);
    }
  };

  const handleStartSession = () => {
    if (!sessionInfo?.isHost) return;
    
    setStarting(true);
    emit('start-session', { 
      roomCode,
      hostId: sessionInfo.participantId 
    });
  };

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave this session?')) {
      localStorage.removeItem('sessionInfo');
      navigate('/');
    }
  };

  const copyRoomCode = () => {
    const roomUrl = `https://www.sparkcircle.cc/room/${roomCode}`;
    navigator.clipboard.writeText(roomUrl);
    // Could add a toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F3EF' }}>
        <LoadingSpinner size="lg" text="Loading session..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F9F3EF' }}>
        <div className="rounded-2xl sm:rounded-3xl p-8 max-w-md w-full text-center" 
          style={{
            background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)'
          }}>
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl mb-2" style={{ color: '#151B1E', fontFamily: 'Instrument Serif, serif', fontWeight: '400' }}>Error</h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 text-white font-medium py-3 px-8 rounded-full hover:bg-black transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F9F3EF' }}>
      {/* Navigation Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4 sm:py-6 transition-opacity duration-300"
        style={{ 
          opacity: window.innerWidth < 640 ? navOpacity : 1 
        }}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logo}
              alt="SparkCircle logo" 
              className="w-28 h-14 sm:w-40 sm:h-20"
            />
          </div>
          
          {/* Leave Room Button */}
          <button
            onClick={handleLeaveRoom}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Leave Room
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 sm:pt-32 pb-8 sm:pb-16">
        {/* Room Code Card with Peeking Mascot */}
        <div className="relative">
          {/* Peeking Mascot */}
          
          
          {/* Room Code Card */}
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative"
            style={{
              background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)'
            }}>
          <div className="flex items-center justify-between gap-4 sm:gap-8 md:gap-12">
            {/* Left Section - Room Code */}
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4" 
                style={{ 
                  color: '#151B1E', 
                  fontFamily: 'Instrument Serif, serif',
                  fontWeight: '400'
                }}>
                Room Code
              </h2>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold tracking-wider"
                  style={{ color: '#151B1E' }}>
                  {roomCode}
                </div>
                <button
                  onClick={copyRoomCode}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Copy room URL"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Right Section - Status/Actions */}
            <div className="text-right flex-shrink-0">
              {sessionInfo?.isHost ? (
                <>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {session?.participants?.length > 1
                      ? `${session.participants.length} participants ready`
                      : 'Waiting for participants to join...'}
                  </p>
                  <button
                    onClick={handleStartSession}
                    disabled={starting || session?.participants?.length < 2}
                    className="bg-gray-800 text-white font-medium py-2.5 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-full hover:bg-black transition-all text-xs sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {starting ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" text="" />
                        <span className="ml-2">Starting...</span>
                      </div>
                    ) : (
                      'Start Session →'
                    )}
                  </button>
                  {session?.participants?.length < 2 && (
                    <p className="mt-2 sm:mt-3 text-xs md:text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Need at least 2 participants
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-end">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-2 sm:mb-3"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#E5A866' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Waiting for host to start
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Participants Pills */}
        {session?.participants && session.participants.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Participants ({session.participants.length})
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {session.participants.map((participant) => (
                <div
                  key={participant._id}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                    participant._id === sessionInfo?.participantId
                      ? 'bg-gray-800 text-white'
                      : participant._id === session.hostId
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="font-medium">
                    {participant.name}
                    {participant._id === sessionInfo?.participantId && ' (You)'}
                    {participant._id === session.hostId && ' 👑'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="mt-8 rounded-2xl sm:rounded-3xl p-6"
          style={{
            backgroundColor: '#FFF8F0',
            border: '1px solid rgba(255, 231, 198, 0.5)'
          }}>
          <h3 className="text-lg sm:text-xl mb-4" 
            style={{ 
              color: '#151B1E', 
              fontFamily: 'Instrument Serif, serif',
              fontWeight: '400'
            }}>
            Session Details
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Host:</span>
              <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#151B1E' }}>
                {session?.hostName || (session?.participants?.find(p => p.id === session?.hostId)?.name || 'Host')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Time limit to answer:</span>
              <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#151B1E' }}>{session?.settings?.turnTimerSeconds || 60} seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Rounds:</span>
              <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#151B1E' }}>{session?.settings?.rounds || 5}</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          👋🏻 hello@moodhself.io
          </p>
          <p className="text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2025 SparkCircle. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SessionLobby; 