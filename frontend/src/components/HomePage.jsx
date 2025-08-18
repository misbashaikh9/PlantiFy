import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Header from './Header';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleExploreStore = () => {
    navigate('/store');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleMyProfile = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <div className="homepage-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="homepage-container">
      <Header />
      
      <main className="homepage-main">
        <div className="welcome-section">
          <h1>Welcome to Your Plant Paradise! 🌿</h1>
          <p>Discover, care for, and grow your plant collection with AI-powered assistance</p>
          
          <div className="quick-actions">
            <button className="action-btn primary" onClick={handleExploreStore}>
              Explore Store
            </button>
            <button className="action-btn secondary" onClick={handleViewOrders}>
              View Orders
            </button>
            <button className="action-btn secondary" onClick={handleMyProfile}>
              My Profile
            </button>
          </div>
        </div>

        {/* Magazine Box */}
        <div className="magazine-section">
          <h2>🌱 Plant Care Magazine</h2>
          <p>Click the box below to explore plant care tips and fertilizer guides</p>
          
          <div className="big-magazine-box" onClick={() => navigate('/magazine')}>
            <div className="box-content">
              <div className="magazine-icon">📚</div>
              <h3>Plant Care & Fertilizer Guide</h3>
              <p>Comprehensive tips, seasonal care, and fertilizer information</p>
              <div className="click-hint">Click to explore →</div>
            </div>
          </div>
        </div>

        {/* Share Your Thoughts Box */}
        <div className="magazine-section">
          <h2>💬 Community Corner</h2>
          <p>Share your thoughts and read other customers' experiences</p>
          
          <div
            className="big-suggestion-box"
            onClick={() => navigate('/suggestions')}
          >
            <div className="box-content">
              <div className="magazine-icon">🗨️</div>
              <h3>Share Your Thoughts</h3>
              <p>Post your tips, ask questions, and learn from fellow plant lovers</p>
              <div className="click-hint">Join the conversation →</div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Icon - Fixed Position Bottom Right */}
      <div className="ai-chat-icon">
        <div className="ai-icon-circle">
          🤖
        </div>
        <span className="ai-tooltip">Ask AI Assistant</span>
      </div>
    </div>
  );
};

export default HomePage;
