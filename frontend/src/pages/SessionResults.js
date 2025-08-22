import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from '../logo.svg';

const SessionResults = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    loadSession();
  }, [roomCode]);

  const loadSession = async () => {
    try {
      const data = await sessionAPI.getSession(roomCode);
      setSession(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session results.');
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    localStorage.removeItem('sessionInfo');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F3EF' }}>
        <LoadingSpinner size="lg" text="Loading results..." />
      </div>
    );
  }

  if (error || !session) {
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
            Error
          </h2>
          <p 
            className="text-gray-600 mb-6" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {error || 'Session not found'}
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
          
          
          
          {/* Back to Home Button */}
          <button
            onClick={handleNewSession}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center text-xs sm:text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Main Card - Large and Prominent like CreateRoom.js */}
          <div 
            className="rounded-2xl sm:rounded-3xl relative flex flex-col p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)',
              minHeight: '380px'
            }}
          >
            {/* Central Content */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-80 h-80 -mt-36 mb-6">
                <img 
                  src="/images/end.png" 
                  alt="Session complete mascot" 
                  className="w-full h-full object-contain"
                  style={{ 
                    imageOrientation: 'from-image',
                    transform: 'rotate(0deg)'
                  }}
                />
              </div>
              <h2 
                className="text-4xl sm:text-4xl md:text-5xl mb-4 sm:mb-6"
                style={{ 
                  color: '#151B1E',
                  fontFamily: 'Instrument Serif, serif',
                  fontWeight: '400',
                  lineHeight: '1.1'
                }}
              >
                Session Complete!
              </h2>
              <p 
                className="text-lg sm:text-xl text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Great job team! You've now completed your sparkcircle!
              </p>
            </div>
          </div>

          {/* Keep the Conversation Going - Subtle Card like CreateRoom.js */}
          <div className="mt-6 sm:mt-8">
            <div 
              className="rounded-2xl sm:rounded-3xl p-6 sm:p-8"
              style={{
                backgroundColor: '#FFF8F0',
                border: '1px solid rgba(255, 231, 198, 0.5)'
              }}
            >
            <h3 
              className="text-lg sm:text-xl mb-4 sm:mb-6" 
              style={{ 
                color: '#151B1E', 
                fontFamily: 'Instrument Serif, serif',
                fontWeight: '400'
              }}
            >
              Keep the Conversation Going
            </h3>
            <p 
              className="text-gray-600 mb-4 text-xs sm:text-sm" 
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              The best teams continue building on what they've learned. Here are some ways to keep growing together:
            </p>
            <div className="space-y-2 sm:space-y-3">
              {/* Step 1 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5A866' }}></div>
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Schedule regular SparkCircle sessions to maintain connection
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5A866' }}></div>
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Follow up on interesting stories or insights shared today
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5A866' }}></div>
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Create a team channel to share wins and support challenges
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5A866' }}></div>
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Use what you learned to collaborate more effectively
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-600 text-white font-medium py-3 px-8 sm:py-4 sm:px-10 rounded-full hover:bg-gray-700 transition-all text-sm md:text-base sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Close Game
            </button>
            <button
              onClick={handleNewSession}
              className="flex-1 bg-gray-800 text-white font-medium py-3 px-8 sm:py-4 sm:px-10 rounded-full hover:bg-black transition-all text-sm md:text-base sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Create new Circle
            </button>
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
      </main>
    </div>
  );
};

export default SessionResults; 