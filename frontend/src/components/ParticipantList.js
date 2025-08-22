import React from 'react';

const ParticipantList = ({ participants, currentUserId, hostId, turnOrder = [], currentPlayerId, currentRound, totalRounds }) => {
  // Create a map of participant order
  const orderMap = {};
  turnOrder.forEach((id, index) => {
    orderMap[id] = index + 1;
  });

  // Sort participants by turn order if available
  const sortedParticipants = turnOrder.length > 0
    ? [...participants].sort((a, b) => (orderMap[a.id] || 999) - (orderMap[b.id] || 999))
    : participants;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Turn Order {currentRound && totalRounds && `(Round ${currentRound}/${totalRounds})`}
      </h3>
      
      <div className="space-y-3">
        {sortedParticipants.map((participant) => {
          const isCurrentPlayer = participant.id === currentPlayerId;
          const turnNumber = orderMap[participant.id];
          
          return (
            <div
              key={participant.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCurrentPlayer
                  ? 'bg-green-50 border-2 border-green-400 shadow-md transform scale-105'
                  : participant.id === currentUserId
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                {/* Turn Number */}
                {turnNumber && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${
                    isCurrentPlayer ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {turnNumber}
                  </div>
                )}
                
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    participant.id === hostId
                      ? 'bg-indigo-600'
                      : 'bg-gray-500'
                  }`}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Name and badges */}
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className={`font-medium ${isCurrentPlayer ? 'text-green-800' : 'text-gray-800'}`}>
                      {participant.name}
                    </span>
                    {participant.id === currentUserId && (
                      <span className="ml-2 text-xs text-indigo-600 font-medium">
                        (You)
                      </span>
                    )}
                    {participant.id === hostId && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        Host
                      </span>
                    )}
                    {isCurrentPlayer && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                        Current Turn
                      </span>
                    )}
                  </div>
                  
                  {/* Status indicators */}
                  <div className="flex items-center mt-1">
                    {!participant.isConnected && (
                      <span className="text-xs text-red-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Connection status indicator */}
              <div
                className={`w-3 h-3 rounded-full ${
                  participant.isConnected !== false ? 'bg-green-500' : 'bg-gray-300'
                }`}
                title={participant.isConnected !== false ? 'Connected' : 'Disconnected'}
              />
            </div>
          );
        })}
      </div>
      
      {participants.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No participants yet. Share the room code to invite others!
        </p>
      )}
    </div>
  );
};

export default ParticipantList; 