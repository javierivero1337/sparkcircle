import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordWidth, setWordWidth] = useState(150); // Default width in pixels
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);
  const [heroOpacity, setHeroOpacity] = useState(1);
  
  const rotatingWords = ['meaningful', 'authentic', 'vulnerable', 'honest', 'genuine', 'deep'];

  useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    let intervalId = null;

    // Calculate word widths
    const calculateWordWidths = () => {
      const tempSpan = document.createElement('span');
      tempSpan.style.position = 'absolute';
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.fontFamily = 'Instrument Serif, serif';
      tempSpan.style.fontSize = window.innerWidth < 640 ? '2.5rem' : 
                               window.innerWidth < 768 ? '3rem' : 
                               window.innerWidth < 1024 ? '3.5rem' : '3.75rem';
      tempSpan.style.fontWeight = '400';
      document.body.appendChild(tempSpan);
      
      const widths = rotatingWords.map(word => {
        tempSpan.textContent = word;
        return tempSpan.offsetWidth;
      });
      
      document.body.removeChild(tempSpan);
      
      // Set initial width
      setWordWidth(widths[0]);
      
      // Clear existing interval if any
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Update width when word changes
      intervalId = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % rotatingWords.length;
          setWordWidth(widths[nextIndex]);
          return nextIndex;
        });
      }, 2000);
    };

    // Initial calculation
    calculateWordWidths();

    // Recalculate on resize
    const handleResize = () => {
      calculateWordWidths();
    };

    // Handle scroll for nav and hero fade
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newNavOpacity = Math.max(0, 1 - scrollY / 200);
      const newHeroOpacity = Math.max(0, 1 - scrollY / 300);
      setNavOpacity(newNavOpacity);
      setHeroOpacity(newHeroOpacity);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleCreateRoom = () => {
    navigate('/create');
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/join/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F9F3EF' }}>
      <style>
        {`
          @keyframes slotMachineSlide {
            0% {
              transform: translateY(-30px);
              opacity: 0;
            }
            50% {
              transform: translateY(2px);
              opacity: 0.7;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes fadeSlideIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .word-transition {
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hamburger-line {
            width: 20px;
            height: 2px;
            background-color: #374151;
            transition: all 0.3s ease;
            margin: 3px 0;
          }

          .hamburger-open .hamburger-line:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }

          .hamburger-open .hamburger-line:nth-child(2) {
            opacity: 0;
          }

          .hamburger-open .hamburger-line:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
          }
        `}
      </style>
      
      {/* Navigation Bar - Mobile Optimized */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-opacity duration-300"
        style={{ opacity: navOpacity }}
      >
        <div className="flex justify-between items-center">
          {/* Logo - Smaller on mobile */}
          <div className="flex items-center">
            <img 
              src={logo}
              alt="SparkCircle logo" 
              className="w-28 h-14 sm:w-40 sm:h-20"
            />
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className={`hamburger p-2 ${isNavOpen ? 'hamburger-open' : ''}`}
              aria-label="Toggle menu"
            >
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center space-x-6">
            <a 
              href="#manifesto" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Manifesto
            </a>
            <a 
              href="#contact" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isNavOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg mx-4 py-4">
            <a 
              href="#manifesto" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
              onClick={() => setIsNavOpen(false)}
            >
              Manifesto
            </a>
            <a 
              href="#contact" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
              onClick={() => setIsNavOpen(false)}
            >
              Contact
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section - Fixed on mobile, normal on desktop */}
      <div 
        className="fixed sm:relative top-0 left-0 right-0 flex items-center justify-center px-4 sm:px-6 pt-32 sm:pt-32 pb-32 sm:pb-32 transition-opacity duration-300" 
        style={{ 
          backgroundColor: '#F9F3EF',
          opacity: window.innerWidth < 640 ? heroOpacity : 1
        }}
      >
        <div className="text-center w-full">
          <h1 
            className="text-4xl sm:text-3xl md:text-5xl lg:text-6xl" 
            style={{ 
              color: '#151B1E', 
              fontFamily: 'Instrument Serif, serif',
              lineHeight: '1.1',
              fontWeight: '400',
              display: 'inline-flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <span className="inline-block">
              Spark
            </span>
            <span 
              className="inline-block overflow-hidden mx-1 sm:mx-2"
              style={{
                width: wordWidth,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center'
              }}
            >
              <span
                key={currentWordIndex}
                className="text-transparent inline-block"
                style={{
                  background: 'linear-gradient(45deg, #8B5CF6, #EC4899, #F97316, #10B981, #3B82F6, #8B5CF6)',
                  backgroundSize: '300% 300%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  animation: 'gradientMove 4s ease-in-out infinite, slotMachineSlide 0.6s ease-out forwards'
                }}
              >
                {rotatingWords[currentWordIndex]}
              </span>
            </span>
            <span className="inline-block">
              conversations
            </span>
          </h1>
        </div>
      </div>

      {/* Spacer for mobile fixed hero */}
      <div className="h-60 sm:h-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-16">

        {/* Main Action Cards - Improved Mobile Layout */}
        <div className="grid md:grid-cols-2 gap-12 sm:gap-8 mb-12 sm:mb-24 max-w-4xl mx-auto">
          
          {/* Host Card Container */}
          <div className="relative">
            {/* Mascot positioned at the top right */}
            <div className="absolute -top-10 sm:-top-10 right-2 sm:right-5 w-40 h-40 sm:w-40 sm:h-40 pointer-events-none z-10">
              <img 
                src="/images/host-mascot.png" 
                alt="Host mascot" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div 
              className="rounded-2xl sm:rounded-3xl overflow-hidden relative flex flex-col"
              style={{
                background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)',
                minHeight: '360px'
              }}
            >
              <div className="p-6 sm:p-8 pb-1 sm:pb-4">
                <h2 
                  className="sm:text-4xl md:text-5xl text-5xl mt-2" 
                  style={{ 
                    color: '#151B1E',
                    fontFamily: 'Instrument Serif, serif',
                    fontWeight: '400',
                    width: '65%'
                  }}
                >
                  Host a Circle
                </h2>
              </div>
              
              <div className="p-6 sm:p-8 pt-2 sm:pt-0 mt-auto">
                <p className="text-lg sm:text-base mb-6 sm:mb-6 pr-4 sm:pr-8" style={{
                  color: '#151B1E',
                  fontFamily: 'Inter, sans-serif',
                  opacity: 0.8,
                  lineHeight: '1.6'
                }}>
                  Create your space for authentic team conversations. We'll guide you through meaningful questions to spark connection.
                </p>
                
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-gray-800 text-white font-medium py-4 px-8 sm:py-4 sm:px-10 rounded-full hover:bg-black transition-all text-base"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Host →
                </button>
              </div>
            </div>
          </div>

          {/* Join Card Container */}
          <div className="relative">
            {/* Mascot positioned at the top right */}
            <div className="absolute -top-10 sm:-top-10 right-2 sm:right-5 w-40 h-40 sm:w-40 sm:h-40 pointer-events-none z-10">
              <img 
                src="/images/join-mascot.png" 
                alt="Join mascot" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div 
              className="rounded-2xl sm:rounded-3xl overflow-hidden relative flex flex-col"
              style={{
                background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)',
                minHeight: '360px'
              }}
            >
              <div className="p-6 sm:p-8 pb-1 sm:pb-4">
                <h2 
                  className="sm:text-4xl md:text-5xl text-5xl mt-2" 
                  style={{ 
                    color: '#151B1E',
                    fontFamily: 'Instrument Serif, serif',
                    fontWeight: '400',
                    width: '65%'
                  }}
                >
                  Join a Circle
                </h2>
              </div>
              
              <div className="p-6 sm:p-8 pt-2 sm:pt-0 mt-auto">
                <p className="text-lg sm:text-base mb-6 sm:mb-6" style={{
                  color: '#151B1E',
                  fontFamily: 'Inter, sans-serif',
                  opacity: 0.8
                }}>
                  Connect to your team's circle!
                </p>
                
                <form onSubmit={handleJoinRoom} className="space-y-3 sm:space-y-3">
                  <input
                    type="text"
                    placeholder="ENTER ROOM CODE"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-4 sm:px-4 sm:py-4 bg-white/70 backdrop-blur-sm rounded-full placeholder-gray-500 text-center text-base sm:text-base font-medium uppercase focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white/90 transition-all tracking-wider"
                    style={{ color: '#151B1E', fontFamily: 'Inter, sans-serif' }}
                    maxLength={6}
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-800 text-white font-medium py-4 px-8 sm:py-4 sm:px-10 rounded-full hover:bg-gray-700 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    disabled={!roomCode.trim()}
                  >
                    Join →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        
        {/* Features Section */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
            <div className="rounded-full px-4 py-2 sm:px-5 sm:py-2.5 flex items-center space-x-2 sm:space-x-2.5 transition-all hover:shadow-md" style={{ backgroundColor: '#FDF7F4', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <span className="text-sm sm:text-base">💬</span>
              <span className="text-gray-700 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>100+ Curated Questions</span>
            </div>
            
            <div className="rounded-full px-4 py-2 sm:px-5 sm:py-2.5 flex items-center space-x-2 sm:space-x-2.5 transition-all hover:shadow-md" style={{ backgroundColor: '#FDF7F4', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <span className="text-sm sm:text-base">🎯</span>
              <span className="text-gray-700 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>5 Meaningful Themes</span>
            </div>
            

            
            <div className="rounded-full px-4 py-2 sm:px-5 sm:py-2.5 flex items-center space-x-2 sm:space-x-2.5 transition-all hover:shadow-md" style={{ backgroundColor: '#FDF7F4', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <span className="text-sm sm:text-base">📱</span>
              <span className="text-gray-700 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>Beautiful on Any Device</span>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="mt-16 sm:mt-24 mb-16 sm:mb-24">
          <div className="max-w-2xl mx-auto">
            <div className="h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Manifesto Section */}
        <div id="manifesto" className="mb-16 sm:mb-24 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider" style={{ 
                fontFamily: 'Instrument Serif, serif',
                fontWeight: '400',
                color: '#151B1E',
                letterSpacing: '0.2em'
              }}>
                Our Manifesto
              </h2>
            </div>

            {/* Manifesto Content */}
            <div className="space-y-12 sm:space-y-16">
              {/* First Paragraph */}
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed" style={{
                  fontFamily: 'Instrument Serif, serif',
                  color: '#151B1E',
                  fontWeight: '400',
                  lineHeight: '1.6'
                }}>
                  <span className="italic text-4xl sm:text-5xl md:text-6xl" style={{ 
                    fontFamily: 'Instrument Serif, serif',
                    fontStyle: 'italic'
                  }}>In</span> a world where teams are scattered across screens, where colleagues become usernames, where meetings blur into endless calendars, we've forgotten how to truly see each other.
                </p>
              </div>

              {/* Second Paragraph */}
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed" style={{
                  fontFamily: 'Instrument Serif, serif',
                  color: '#151B1E',
                  fontWeight: '400',
                  lineHeight: '1.6'
                }}>
                  We've traded connection for productivity — stories for status updates, vulnerability for virtual backgrounds, and the magic of knowing each other for the metrics of working together.
                </p>
              </div>

              {/* Fourth Paragraph */}
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed" style={{
                  fontFamily: 'Instrument Serif, serif',
                  color: '#151B1E',
                  fontWeight: '400',
                  lineHeight: '1.6'
                }}>
                  Sparkcircle brings us back to what matters: the conversations that transform colleagues into collaborators, teams into communities, and work into something worth doing together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          👋🏻 hello@moodhself.io
          </p>
          <p className="text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2025 SparkCircle. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 