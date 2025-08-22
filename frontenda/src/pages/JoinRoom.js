import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from '../logo.svg';

const JoinRoom = () => {
  const navigate = useNavigate();
  const { roomCode: urlRoomCode } = useParams();
  const [roomCode, setRoomCode] = useState(urlRoomCode || '');
  const [participantName, setParticipantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    
    // If room code is in URL, focus on name input
    if (urlRoomCode) {
      setRoomCode(urlRoomCode.toUpperCase());
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [urlRoomCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim() || !participantName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await sessionAPI.joinSession(
        roomCode.trim().toUpperCase(),
        participantName.trim()
      );
      
      // Store session info in localStorage
      localStorage.setItem('sessionInfo', JSON.stringify({
        roomCode: response.roomCode,
        participantId: response.participantId,
        isHost: false,
        participantName: participantName.trim(),
      }));

      // Navigate to the session lobby
      navigate(`/room/${response.roomCode}`);
    } catch (err) {
      console.error('Error joining room:', err);
      if (err.error === 'Session not found') {
        setError('Room code not found. Please check and try again.');
      } else if (err.error === 'Session has already started') {
        setError('This session has already started. You cannot join now.');
      } else if (err.error === 'Session has ended') {
        setError('This session has ended.');
      } else {
        setError(err.message || 'Failed to join room. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F9F3EF' }}>
      {/* Navigation Bar with Logo */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4 sm:py-6 transition-opacity duration-300"
        style={{ 
          opacity: window.innerWidth < 640 ? navOpacity : 1 
        }}
      >
        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logo}
              alt="SparkCircle logo" 
              className="w-28 h-14 sm:w-40 sm:h-20"
            />
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 sm:px-6 pt-32 sm:pt-32 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto w-full">
          {/* Join Room Card */}
          <div className="max-w-md mx-auto">
            <div 
              className="rounded-2xl sm:rounded-3xl relative flex flex-col p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)',
                minHeight: '380px'
              }}
            >
              <div className="text-center mb-6 sm:mb-8">
                {/* Mascot centered in the card */}
                <div className="inline-block w-64 h-64 sm:w-64 sm:h-64 -mt-24 sm:-mt-24 mb-2 sm:mb-4 ">
                  <img 
                    src="/images/join-start.png" 
                    alt="Join mascot" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h1 
                  className="text-4xl sm:text-4xl md:text-5xl mb-4 sm:mb-6" 
                  style={{ 
                    color: '#151B1E', 
                    fontFamily: 'Instrument Serif, serif',
                    fontWeight: '400',
                    lineHeight: '1.1'
                  }}
                >
                  Join a Circle
                </h1>
                
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label 
                    htmlFor="roomCode" 
                    className="block text-sm sm:text-base font-medium mb-2 sm:mb-3"
                    style={{ color: '#151B1E', fontFamily: 'Inter, sans-serif' }}
                  >
                    Room Code
                  </label>
                  <input
                    type="text"
                    id="roomCode"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-white/70 backdrop-blur-sm rounded-full placeholder-gray-500 text-center text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white/90 transition-all font-mono uppercase"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    maxLength={6}
                    disabled={loading || urlRoomCode}
                    autoFocus={!urlRoomCode}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="participantName" 
                    className="block text-sm sm:text-base font-medium mb-2 sm:mb-3"
                    style={{ color: '#151B1E', fontFamily: 'Inter, sans-serif' }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="participantName"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-white/70 backdrop-blur-sm rounded-full placeholder-gray-500 text-center text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white/90 transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    maxLength={50}
                    disabled={loading}
                    autoFocus={urlRoomCode}
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                    <p className="text-red-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!roomCode.trim() || !participantName.trim() || loading}
                  className="w-full bg-gray-800 text-white font-medium py-3 px-8 sm:py-4 sm:px-10 rounded-full hover:bg-black transition-all text-sm md:text-base sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" text="" />
                      <span className="ml-2">Joining Circle...</span>
                    </div>
                  ) : (
                    'Join Circle →'
                  )}
                </button>
              </form>
            </div>

            {/* Help section - separate complementary card */}
            <div className="mt-6 sm:mt-8">
              <div 
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8"
                style={{
                  backgroundColor: '#FFF8F0',
                  border: '1px solid rgba(255, 231, 198, 0.5)'
                }}
              >
                <h3 
                  className="text-lg sm:text-xl mb-4 sm:mb-5" 
                  style={{ 
                    color: '#151B1E', 
                    fontFamily: 'Instrument Serif, serif',
                    fontWeight: '400'
                  }}
                >
                  Don't have a room code?
                </h3>
                
                {/* Subtle help options */}
                <div className="space-y-2 mb-4 sm:mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5A866' }}></div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Ask your session host for the 6-digit code
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5A866' }}></div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Check your email or messaging app for the code
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Separated create option */}
                <div className="pt-4 border-t" style={{ borderColor: 'rgba(255, 231, 198, 0.5)' }}>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Need to start your own session?
                  </p>
                  <button
                    onClick={() => navigate('/create')}
                    className="w-full text-gray-800 font-medium py-3 px-6 rounded-full transition-all text-sm hover:opacity-90"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#FFE7C6'
                    }}
                  >
                    Create Your Own Circle →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              👋🏻 hello@sparkcircle.com
            </p>
            <p className="text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              © 2025 SparkCircle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom; 