import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { cartService } from '../services/cartService';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [cartCount, setCartCount] = useState(0);

  // Cart count update from database
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const count = await cartService.getCartCount();
        setCartCount(count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
        // Fallback to cache if API fails
        const count = cartService.getCartCountFromCache();
        setCartCount(count);
      }
    };

    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all authentication data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
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
        <Link to="/about-us" className="nav-link">About Us</Link>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-menu">
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart
              {cartCount > 0 && (
                <span className="notification-badge">
                  {cartCount}
                </span>
              )}
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
