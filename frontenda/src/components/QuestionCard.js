import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, questionNumber, timeLimit, onTimeUp, isMyTurn, onPassTurn, onSkipQuestion, skipDisabled, actionLoading }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!isMyTurn || !timeLimit) return;

    if (timeRemaining <= 0) {
      // Notify parent that time is up (without auto-passing turn)
      onTimeUp?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, onTimeUp, isMyTurn, timeLimit]);

  if (!question) {
    return (
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>No question available</p>
          </div>
        </div>
      </div>
    );
  }

  const themeEmojis = {
    'dreams': '🌟',
    'values': '💎',
    'growth': '🌱',
    'quirks': '✨',
    'connections': '🤝',
    'curiosities': '🔮'
  };

  const themeNames = {
    'dreams': 'Dreams & Ambitions',
    'values': 'Values & Beliefs', 
    'growth': 'Growth & Challenges',
    'quirks': 'Quirks & Perspectives',
    'connections': 'Connection with others',
    'curiosities': 'Curiosities & Wonder'
  };

  const emoji = themeEmojis[question?.theme] || '💭';
  const themeName = themeNames[question?.theme] || question?.theme || '';

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 10 && timeRemaining > 0;
  const isTimeOut = timeRemaining === 0;
  const timerText = isTimeOut ? 'Time out!' : `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="relative">
      {/* Theme indicator and Timer - positioned at top corners */}
      <div className="flex justify-between items-start mb-8">
        {/* Theme pill - left side with special styling for Curiosities */}
        <div 
          className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm" 
          style={{ 
            backgroundColor: question?.theme === 'curiosities' ? '#FEF3C7' : '#FFFFFF',
            border: question?.theme === 'curiosities' ? '2px solid #F59E0B' : '1px solid rgba(237, 229, 221, 0.5)',
            background: question?.theme === 'curiosities' 
              ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
              : '#FFFFFF'
          }}
        >
          <span className="text-lg">{emoji}</span>
          <span 
            className="text-sm"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              color: question?.theme === 'curiosities' ? '#92400E' : '#6B7280',
              fontWeight: question?.theme === 'curiosities' ? '600' : '400'
            }}
          >
            {themeName}
          </span>
        </div>

        {/* Timer - right side */}
        {isMyTurn && timeLimit && (
          <div 
            className={`flex items-center px-4 py-2 rounded-full shadow-sm ${isLowTime ? 'animate-pulse' : ''}`} 
            style={{ 
              backgroundColor: isTimeOut ? '#FEE2E2' : '#FFFFFF',
              border: `1px solid ${isTimeOut || isLowTime ? 'rgba(239, 68, 68, 0.3)' : 'rgba(237, 229, 221, 0.5)'}`
            }}
          >
            {isTimeOut && (
              <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span 
              className={`font-mono font-semibold ${isTimeOut || isLowTime ? 'text-red-600' : 'text-gray-700'}`}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px'
              }}
            >
              {timerText}
            </span>
          </div>
        )}
      </div>

      {/* Question Content - Left aligned */}
      <div className="text-left mb-12">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl leading-relaxed"
          style={{ 
            fontFamily: 'Instrument Serif, serif',
            fontWeight: '400',
            fontStyle: 'italic',
            color: '#151B1E',
            lineHeight: '1.4'
          }}
        >
          {question.text}
        </h2>
        
        {question.followUp && (
          <p 
            className="text-lg mt-8"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              color: '#6B7280',
              fontStyle: 'italic'
            }}
          >
            {question.followUp}
          </p>
        )}
      </div>

      {/* Action buttons - right aligned inside the card */}
      {isMyTurn && (
        <div className="flex justify-end items-center space-x-4">
          <button
            onClick={onSkipQuestion}
            disabled={skipDisabled}
            className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#151B1E',
              border: '1px solid #EDE5DD',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px'
            }}
          >
            New Question
          </button>
          <button
            onClick={onPassTurn}
            disabled={actionLoading}
            className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#151B1E',
              color: 'white',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px'
            }}
          >
            Done! →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard; 