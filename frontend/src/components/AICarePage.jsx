import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import GuidedAIChat from './GuidedAIChat';
import { aiService } from '../services/aiService';
import Swal from 'sweetalert2';
import '../styles/AICarePage.css';

const AICarePage = () => {
  const navigate = useNavigate();
  const [availablePlants, setAvailablePlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [soilType, setSoilType] = useState('well-draining');
  const [plantCareResult, setPlantCareResult] = useState('');
  const [fertilizerResult, setFertilizerResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiHealthStatus, setAiHealthStatus] = useState('checking');
  const [isGuidedChatOpen, setIsGuidedChatOpen] = useState(false);

  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const soilTypes = ['well-draining', 'moisture-retaining', 'sandy', 'loamy', 'clay'];

  useEffect(() => {
    checkAIHealth();
    loadAvailablePlants();
    console.log('AICarePage loaded successfully!');
  }, []); // Keep empty dependency array

  const checkAIHealth = async () => {
    try {
      console.log('🔄 Checking AI health...');
      const response = await aiService.checkAIHealth();
      console.log('📡 Health API response:', response);
      
      if (response.success) {
        console.log('✅ AI health check passed');
        setAiHealthStatus('healthy');
      } else {
        console.log('❌ AI health check failed:', response.error);
        setAiHealthStatus('unhealthy');
      }
    } catch (error) {
      console.log('❌ AI health check error:', error);
      setAiHealthStatus('unhealthy');
    }
  };

  const loadAvailablePlants = async () => {
    try {
      console.log('🔄 Loading available plants...');
      const response = await aiService.getAvailablePlants();
      console.log('📡 Plants API response:', response);
      
      if (response.success) {
        console.log('✅ Plants loaded successfully:', response.data.plants);
        setAvailablePlants(response.data.plants || []);
      } else {
        console.log('❌ Plants API failed:', response.error);
      }
    } catch (error) {
      console.error('❌ Failed to load plants:', error);
    }
  };

  const handlePlantCareRequest = async () => {
    if (!selectedPlant) {
      Swal.fire({
        icon: 'warning',
        title: 'Plant Selection Required',
        text: 'Please select a plant to get care advice.',
        confirmButtonColor: '#4CAF50'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.getPlantCare(selectedPlant, '', 'friendly');
      if (response.success) {
        setPlantCareResult(response.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'Failed to get plant care advice.',
          confirmButtonColor: '#4CAF50'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to get plant care advice. Please try again.',
        confirmButtonColor: '#4CAF50'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFertilizerRequest = async () => {
    if (!selectedPlant) {
      Swal.fire({
        icon: 'warning',
        title: 'Plant Selection Required',
        text: 'Please select a plant to get fertilizer recommendations.',
        confirmButtonColor: '#4CAF50'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.getFertilizerRecommendation(soilType, selectedPlant, selectedSeason);
      if (response.success) {
        setFertilizerResult(response.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'Failed to get fertilizer recommendations.',
          confirmButtonColor: '#4CAF50'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to get fertilizer recommendations. Please try again.',
        confirmButtonColor: '#4CAF50'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openGuidedChat = () => {
    setIsGuidedChatOpen(true);
  };

  const closeGuidedChat = () => {
    setIsGuidedChatOpen(false);
  };

  // Debug logging
  console.log('🔍 Current availablePlants state:', availablePlants);
  console.log('🔍 Current aiHealthStatus state:', aiHealthStatus);
  
  return (
    <div className="ai-care-page">
      <Header />
      
      <main className="ai-care-main">
        <div className="ai-care-header">
          <h1>🤖 AI Plant Care Assistant</h1>
          <p>Get personalized plant care advice and fertilizer recommendations powered by AI</p>
          
          {/* AI Status and Style Selector */}
          <div className="ai-controls">
            {/* AI Status Indicator */}
            <div className={`ai-status ${aiHealthStatus}`}>
              <span className="status-icon">
                {aiHealthStatus === 'healthy' ? '✅' : '❌'}
              </span>
              <span className="status-text">
                AI Services: {aiHealthStatus === 'healthy' ? 'Online' : 'Offline'}
              </span>
            </div>
            

          </div>
        </div>

        {/* Main AI Features Grid */}
        <div className="ai-features-grid">
          {/* Plant Care Section */}
          <div className="ai-feature-card">
            <div className="feature-header">
              <span className="feature-icon">🌿</span>
              <h2>Plant Care Advice</h2>
            </div>
            
            <div className="feature-content">
              <div className="input-group">
                <label htmlFor="plant-select">Select Plant:</label>
                <select
                  id="plant-select"
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  className="plant-select"
                >
                  <option value="">Choose a plant...</option>
                  {availablePlants.map((plant, index) => (
                    <option key={index} value={plant}>
                      {plant}
                    </option>
                  ))}
                </select>
              </div>
              
                              <button
                  onClick={handlePlantCareRequest}
                  disabled={!selectedPlant || isLoading}
                  className="ai-action-btn primary"
                >
                  {isLoading ? '⏳ Getting Advice...' : '🌱 Get Care Advice'}
                </button>
              
              {plantCareResult && (
                <div className="result-display">
                  <h4>Care Advice:</h4>
                  <div className="result-content">
                    {plantCareResult.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fertilizer Section */}
          <div className="ai-feature-card">
            <div className="feature-header">
              <span className="feature-icon">🌱</span>
              <h2>Fertilizer Recommendations</h2>
            </div>
            
            <div className="feature-content">
              <div className="input-group">
                <label htmlFor="fertilizer-plant">Plant Type:</label>
                <select
                  id="fertilizer-plant"
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  className="plant-select"
                >
                  <option value="">Choose a plant...</option>
                  {availablePlants.map((plant, index) => (
                    <option key={index} value={plant}>
                      {plant}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="soil-type">Soil Type:</label>
                <select
                  id="soil-type"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="soil-select"
                >
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="season">Season:</label>
                <select
                  id="season"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="season-select"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
                              <button
                  onClick={handleFertilizerRequest}
                  disabled={!selectedPlant || isLoading}
                  className="ai-action-btn secondary"
                >
                  {isLoading ? '⏳ Getting Recommendations...' : '🌿 Get Fertilizer Advice'}
                </button>
              
              {fertilizerResult && (
                <div className="result-display">
                  <h4>Fertilizer Recommendation:</h4>
                  <div className="result-content">
                    {fertilizerResult.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guided AI Chat Section */}
          <div className="ai-feature-card">
            <div className="feature-header">
              <span className="feature-icon">🎯</span>
              <h2>Guided AI Chat Assistant</h2>
            </div>
            
            <div className="feature-content">
              <p>Get step-by-step guidance from our AI plant care expert!</p>
              
              <div className="chat-buttons">
                <button
                  onClick={openGuidedChat}
                  className="ai-action-btn guided"
                >
                  🎯 Start Guided AI Chat
                </button>
              </div>
              
              <div className="chat-features">
                <h4>Your AI Plant Care Experience:</h4>
                <div className="chat-types">
                  <div className="chat-type">
                    <strong>🎯 Guided AI Chat:</strong> Step-by-step expert guidance
                    <ul>
                      <li>• Choose from 4 main categories</li>
                      <li>• Answer specific questions</li>
                      <li>• Get detailed, personalized advice</li>
                      <li>• ML-powered recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="quick-tips-section">
          <h2>💡 Quick Plant Care Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">💧</span>
              <h3>Watering</h3>
              <p>Water when the top 1-2 inches of soil feels dry. Overwatering is the #1 killer of houseplants.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">☀️</span>
              <h3>Light</h3>
              <p>Most plants prefer bright, indirect light. Avoid direct sunlight which can scorch leaves.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🌡️</span>
              <h3>Temperature</h3>
              <p>Keep plants away from drafts and maintain room temperature between 65-75°F (18-24°C).</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🌱</span>
              <h3>Fertilizing</h3>
              <p>Fertilize during growing season (spring/summer) and reduce in fall/winter.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Guided AI Chat Modal */}
      <GuidedAIChat isOpen={isGuidedChatOpen} onClose={closeGuidedChat} />
    </div>
  );
};

export default AICarePage;
