import React from 'react';

const CountdownOverlay = ({ seconds }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#F9F3EF' }}>
      <div className="relative z-10 text-center">
        <div
          className="rounded-2xl sm:rounded-3xl p-8 sm:p-12 min-w-[250px] flex flex-col justify-center items-center"
          style={{ backgroundColor: '#FFF8F0', border: '1px solid #EDE5DD' }}
        >
          <h2
            className="text-6xl sm:text-7xl lg:text-8xl font-semibold"
            style={{ fontFamily: 'Instrument Serif, serif', fontWeight: '400', color: '#151B1E' }}
          >
            {seconds > 0 ? seconds : 'Go!'}
          </h2>
          {seconds > 0 && (
            <p
              className="mt-4 text-lg sm:text-xl text-gray-600"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Get ready...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownOverlay; 