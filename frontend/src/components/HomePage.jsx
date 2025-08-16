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
    // TODO: Navigate to orders page when built
    alert('Orders page coming soon! 📋');
  };

  const handleMyProfile = () => {
    // TODO: Navigate to profile page when built
    alert('Profile page coming soon! 👤');
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
