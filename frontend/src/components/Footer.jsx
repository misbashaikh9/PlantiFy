import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      // You can add actual newsletter subscription logic here later
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <div className="footer-logo">
              🌱 <span>PlantiFy</span>
            </div>
            <p className="footer-description">
              Growing together, one plant at a time. Your trusted partner for all things plants, 
              from AI-powered care advice to premium plant collections.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/store">Store</Link></li>
              <li><Link to="/ai-care">AI Care</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h3>Our Services</h3>
            <ul className="footer-links">
              <li>Indoor Plants</li>
              <li>Herbs & Edibles</li>
              <li>Seeds & Fertilizers</li>
              <li>AI Plant Care</li>
              <li>Expert Guidance</li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>support@plantify.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+91 9898104059</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Plant Street, Garden City, GC 12345</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <span>Mon-Fri: 9 AM - 6 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay Green with Us!</h3>
            <p>Subscribe to our newsletter for plant care tips, new arrivals, and exclusive offers.</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                className="newsletter-btn" 
                onClick={handleSubscribe}
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {isSubscribed && (
              <p style={{ color: '#4CAF50', marginTop: '15px', fontSize: '0.9rem' }}>
                🎉 Thank you for subscribing to our newsletter!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} PlantiFy. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/shipping">Shipping Info</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
