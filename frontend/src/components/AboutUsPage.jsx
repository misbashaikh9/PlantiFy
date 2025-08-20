import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-us-page">
      <Header />
      <main className="about-us-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>About PlantiFy</h1>
            <p className="hero-subtitle">Growing Together, One Plant at a Time</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Plant Varieties</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Story</h2>
              <div className="section-divider"></div>
            </div>
            <div className="story-content">
              <div className="story-text">
                <p>
                  PlantiFy was born from a simple yet powerful idea: everyone deserves to experience 
                  the joy and benefits of growing plants, regardless of their experience level.
                </p>
                <p>
                  Founded in 2024, we started as a small team of plant enthusiasts and tech innovators 
                  who believed that technology could make plant care accessible to everyone. What began 
                  as a passion project has grown into a thriving community of plant lovers.
                </p>
                <p>
                  Today, PlantiFy serves thousands of customers across India, helping them create 
                  beautiful, healthy indoor gardens with our AI-powered care system and premium plant collection.
                </p>
              </div>
              <div className="story-image">
                <div className="image-placeholder">
                  <i className="fas fa-seedling"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-card">
                <div className="card-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To democratize plant care by making it accessible, enjoyable, and successful 
                  for everyone through innovative technology and expert guidance.
                </p>
              </div>
              <div className="mission-card">
                <div className="card-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To become India's leading platform for plant care, fostering a community 
                  where every home can flourish with greenery and every plant lover can thrive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Core Values</h2>
              <div className="section-divider"></div>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h4>Sustainability</h4>
                <p>We promote eco-friendly practices and sustainable plant care methods.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h4>Community</h4>
                <p>Building a supportive network of plant enthusiasts who learn and grow together.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h4>Innovation</h4>
                <p>Leveraging AI technology to make plant care smarter and more accessible.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h4>Care</h4>
                <p>Every plant and customer receives our dedicated attention and support.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2>What We Do</h2>
              <div className="section-divider"></div>
            </div>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <h3>AI-Powered Plant Care</h3>
                <p>
                  Our intelligent system provides personalized care recommendations, 
                  disease diagnosis, and growth tracking for your plants.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <h3>Premium Plant Collection</h3>
                <p>
                  Curated selection of indoor plants, herbs, seeds, and organic 
                  fertilizers to help your garden thrive.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Expert Guidance</h3>
                <p>
                  Access to plant care tips, tutorials, and expert advice 
                  to ensure your gardening success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2>Meet Our Team</h2>
              <div className="section-divider"></div>
            </div>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <h4>Plant Experts</h4>
                <p>Horticulture specialists with years of experience in plant care and cultivation.</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-code"></i>
                </div>
                <h4>Tech Team</h4>
                <p>AI engineers and developers creating smart solutions for plant care.</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-headset"></i>
                </div>
                <h4>Support Team</h4>
                <p>Dedicated customer service professionals ready to help with any questions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="contact-cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Start Your Plant Journey?</h2>
              <p>Join thousands of happy plant parents and discover the joy of growing together.</p>
              <div className="cta-buttons">
                <button 
                  className="cta-btn primary"
                  onClick={() => navigate('/store')}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Shop Plants
                </button>
                                                 <button 
                  className="cta-btn secondary"
                  onClick={() => navigate('/contact')}
                >
                  <i className="fas fa-envelope"></i>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUsPage;
