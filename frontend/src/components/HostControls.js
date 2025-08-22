import React from 'react';

const HostControls = ({ onEndSession, onForcePassTurn, loading }) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(211, 178, 131, 0.5)' }}>
      <h3 className="text-lg sm:text-xl mb-4 flex items-center" style={{ color: '#151B1E', fontFamily: 'Instrument Serif, serif', fontWeight: '400' }}>
        
        Host Controls
      </h3>
      
      <div className="space-y-4">
        {/* Control buttons row */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Pass to Next Turn */}
          <button
            onClick={onForcePassTurn}
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8" />
            </svg>
            Pass to Next Turn
          </button>

          {/* End Session Button */}
          <button
            onClick={onEndSession}
            disabled={loading}
            className="flex-1 bg-red-100 text-red-700 font-medium py-3 px-4 rounded-full hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Session
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-4 p-3 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-600">
            <strong>Tip:</strong> Wait for everyone to finish discussing before moving to the next question.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostControls; 