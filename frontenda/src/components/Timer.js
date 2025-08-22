import React, { useState, useEffect } from 'react';

const Timer = ({ timeLimit, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className="flex items-center justify-center">
      <div className={`
        px-6 py-3 rounded-full font-mono text-2xl font-bold
        ${isLowTime ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}
        transition-all duration-300
      `}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer; 