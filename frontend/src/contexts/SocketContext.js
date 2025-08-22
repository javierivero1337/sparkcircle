import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

// Dynamic socket URL based on environment
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 
  (window.location.hostname === 'localhost' ? 
    'http://localhost:3001' : 
    window.location.origin.replace(/:\d+/, ':3001')); // Use same host with backend port

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Only create socket if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      // Connection event handlers
      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected:', socketRef.current.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Emit event to server
  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Listen to events from server
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  // Remove event listener
  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  // Get socket instance
  const getSocket = useCallback(() => socketRef.current, []);

  const value = {
    socket: socketRef.current,
    emit,
    on,
    off,
    getSocket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 