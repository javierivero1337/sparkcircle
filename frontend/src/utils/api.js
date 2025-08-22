import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const sessionAPI = {
  // Create a new session
  createSession: async (hostName, settings = {}) => {
    try {
      const response = await api.post('/api/sessions/create', { hostName, settings });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Join an existing session
  joinSession: async (roomCode, participantName) => {
    try {
      const response = await api.post('/api/sessions/join', {
        roomCode,
        participantName,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get session details
  getSession: async (roomCode) => {
    try {
      const response = await api.get(`/api/sessions/${roomCode}`);
      // The backend returns the session data directly at the root level
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default api; 