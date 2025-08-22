import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import './App.css';

// Page components (to be created)
import LandingPage from './pages/LandingPage';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import SessionLobby from './pages/SessionLobby';
import ActiveSession from './pages/ActiveSession';
import SessionResults from './pages/SessionResults';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
          {/* Landing page - main entry point */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Room creation and joining */}
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/join/:roomCode" element={<JoinRoom />} />
          
          {/* Session lobby - waiting room */}
          <Route path="/room/:roomCode" element={<SessionLobby />} />
          
          {/* Active session - main game */}
          <Route path="/session/:roomCode" element={<ActiveSession />} />
          
          {/* Session results */}
          <Route path="/session/:roomCode/results" element={<SessionResults />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </SocketProvider>
  );
}

export default App;
