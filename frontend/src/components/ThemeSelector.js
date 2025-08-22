import React, { useState } from 'react';

const themes = [
  {
    id: 'dreams',
    name: 'Dreams & Ambitions',
    emoji: '🌟',
    explanation: 'Explore your deepest aspirations and the goals that motivate you to move forward in life and work.'
  },
  {
    id: 'values',
    name: 'Values & Beliefs',
    emoji: '💎',
    explanation: 'Share the core principles and beliefs that guide your decisions and shape your worldview.'
  },
  {
    id: 'growth',
    name: 'Growth & Challenges',
    emoji: '🌱',
    explanation: 'Discuss the obstacles you\'ve faced and how they\'ve helped you grow and develop as a person.'
  },
  {
    id: 'quirks',
    name: 'Quirks & Perspectives',
    emoji: '✨',
    explanation: 'What makes you, truly you. Reveal the unique traits, quirks, and perspectives that make you distinctly yourself.'
  },
  {
    id: 'connections',
    name: 'Connection with others',
    emoji: '🤝',
    explanation: 'Explore how you build relationships and connect with the people around you.'
  },
  {
    id: 'curiosities',
    name: 'Curiosities & Wonder',
    emoji: '🔮',
    explanation: 'Wildcard questions that spark imagination, playful scenarios, and hypothetical adventures.',
    isWildcard: true
  }
];

const ThemeSelector = ({ onSelectTheme, disabled = false, compact = false }) => {
  const [hoveredTheme, setHoveredTheme] = useState(null);

  const handleMouseEnter = (themeId) => {
    setHoveredTheme(themeId);
  };

  const handleMouseLeave = () => {
    setHoveredTheme(null);
  };

  if (compact) {
    return (
      <div className="w-full">
        
        <div className="flex flex-wrap gap-3 justify-center">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              disabled={disabled}
              onMouseEnter={() => handleMouseEnter(theme.id)}
              onMouseLeave={handleMouseLeave}
              className={`inline-flex items-center rounded-full px-4 py-2.5 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                hoveredTheme === theme.id ? 'scale-105 shadow-md' : 'shadow-sm hover:shadow'
              }`}
              style={{
                backgroundColor: theme.isWildcard ? '#FEF3C7' : '#FFFFFF',
                border: theme.isWildcard ? '2px solid #F59E0B' : '1px solid rgba(237, 229, 221, 0.5)',
                background: theme.isWildcard 
                  ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
                  : '#FFFFFF'
              }}
            >
              {/* Emoji on the left */}
              <span className="text-xl mr-2">{theme.emoji}</span>
              
              {/* Theme name */}
              <h3 
                className="font-medium text-base whitespace-nowrap" 
                style={{ 
                  fontFamily: 'Instrument Serif, serif',
                  fontWeight: '400',
                  fontStyle: 'italic',
                  color: theme.isWildcard ? '#92400E' : '#151B1E'
                }}
              >
                {theme.name}
              </h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            disabled={disabled}
            onMouseEnter={() => handleMouseEnter(theme.id)}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-2xl p-8 text-left transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              hoveredTheme === theme.id ? 'scale-105 shadow-xl' : 'shadow-md hover:shadow-lg'
            }`}
            style={{
              backgroundColor: theme.isWildcard ? '#FEF3C7' : '#FFFFFF',
              border: theme.isWildcard ? '2px solid #F59E0B' : '1px solid rgba(237, 229, 221, 0.5)',
              background: theme.isWildcard 
                ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
                : '#FFFFFF'
            }}
          >
            {/* Emoji */}
            <div className="text-4xl mb-4">{theme.emoji}</div>
            
            {/* Theme name */}
            <h3 
              className="font-medium text-xl leading-tight mb-3" 
              style={{ 
                fontFamily: 'Instrument Serif, serif',
                fontWeight: '400',
                color: theme.isWildcard ? '#92400E' : '#151B1E'
              }}
            >
              {theme.name}
            </h3>
            
            {/* Explanation */}
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: theme.isWildcard ? '#B45309' : '#6B7280',
                lineHeight: '1.5'
              }}
            >
              {theme.explanation}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 