import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('user');
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('user');
      navigate('/signin');
    }
  };

  if (!user) {
    return null; // Don't show header if user is not logged in
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/home" className="logo">
            🌱 <span className="logo-text">PlantiFy</span>
          </Link>
          <nav className="nav-menu">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/store" className="nav-link">Store</Link>
            <Link to="/ai-care" className="nav-link">AI Care</Link>
            <Link to="/care-tips" className="nav-link">Care Tips</Link>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-menu">
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart
            </Link>
            <Link to="/profile" className="nav-link">
              👤 {user.username}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
