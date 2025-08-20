import axios from 'axios';

// Create axios instance for AI services
const aiAPI = axios.create({
  baseURL: 'http://localhost:8000/plant_ai/api/ai',
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Service for all AI-related functionality
export const aiService = {
  // Guided AI methods
  startGuidedConversation: async (userId) => {
    try {
      const response = await aiAPI.post('/guided/start/', { user_id: userId });
      return response.data;
    } catch (error) {
      console.error('Guided AI start error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to start guided conversation' 
      };
    }
  },

  selectGuidedCategory: async (userId, categoryId) => {
    try {
      const response = await aiAPI.post('/guided/chat/', { 
        user_id: userId, 
        action: 'select_category', 
        category: categoryId 
      });
      return response.data;
    } catch (error) {
      console.error('Guided AI category selection error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to select category' 
      };
    }
  },

  sendGuidedMessage: async (userId, message) => {
    try {
      const response = await aiAPI.post('/guided/chat/', { 
        user_id: userId, 
        message: message 
      });
      return response.data;
    } catch (error) {
      console.error('Guided AI message error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send message' 
      };
    }
  },

  resetGuidedConversation: async (userId) => {
    try {
      const response = await aiAPI.post('/guided/reset/', { user_id: userId });
      return response.data;
    } catch (error) {
      console.error('Guided AI reset error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to reset conversation' 
      };
    }
  },

  // Main AI chat endpoint
  chatWithAI: async (message, style = 'friendly', userId = null) => {
    try {
      const response = await aiAPI.post('/chat/', { 
        message, 
        style, 
        user_id: userId 
      });
      return response.data;
    } catch (error) {
      console.error('AI Chat error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get AI response' 
      };
    }
  },

  // Get plant care recommendations
  getPlantCare: async (plantName, condition = '', style = 'friendly') => {
    try {
      const response = await aiAPI.post('/plant-care/', { 
        plant_name: plantName, 
        condition,
        style
      });
      return response.data;
    } catch (error) {
      console.error('Plant Care error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get plant care advice' 
      };
    }
  },

  // Get fertilizer recommendations
  getFertilizerRecommendation: async (soilType, plantType, season) => {
    try {
      const response = await aiAPI.post('/fertilizer/', { 
        soil_type: soilType, 
        plant_type: plantType, 
        season 
      });
      return response.data;
    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get fertilizer advice' 
      };
    }
  },

  // Get available plants for recommendations
  getAvailablePlants: async () => {
    try {
      const response = await aiAPI.get('/plants/');
      return response.data;
    } catch (error) {
      console.error('Available plants error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get available plants' 
      };
    }
  },

  // Health check for AI services
  checkAIHealth: async () => {
    try {
      const response = await aiAPI.get('/health/');
      return response.data;
    } catch (error) {
      console.error('AI Health check error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'AI services unavailable' 
      };
    }
  }
};

export default aiService;

