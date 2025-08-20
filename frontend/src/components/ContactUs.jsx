import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('http://localhost:8000/plant_store/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        setSubmitStatus('error');
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          {/* Contact Information Section */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>support@plantify.com</p>
                  <span>We'll respond within 24 hours</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Phone</h3>
                  <p>+91 9898104059</p>
                  <span>Monday - Friday, 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Address</h3>
                  <p>123 Plant Street</p>
                  <span>Garden City, GC 12345</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="success-message">
                Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="error-message">
                ❌ There was an error sending your message. Please try again.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">NAME *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">SUBJECT *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={errors.subject ? 'error' : ''}
                >
                  <option value="">Select a subject</option>
                  <option value="order_inquiry">Order Inquiry</option>
                  <option value="product_support">Product Support</option>
                  <option value="plant_care">Plant Care Advice</option>
                  <option value="general">General Question</option>
                  <option value="complaint">Complaint</option>
                  <option value="partnership">Partnership Inquiry</option>
                </select>
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">MESSAGE *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Tell us how we can help you..."
                  rows="5"
                />
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <button
                  type="button"
                  className="back-btn"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How long does shipping take?</h3>
              <p>Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if my plant arrives damaged?</h3>
              <p>We offer a 100% satisfaction guarantee. If your plant arrives damaged, contact us within 48 hours for a replacement or refund.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you ship internationally?</h3>
              <p>Currently, we ship to the United States and Canada. International shipping will be available soon!</p>
            </div>
            
            <div className="faq-item">
              <h3>How do I care for my new plant?</h3>
              <p>Each plant comes with detailed care instructions. You can also find care tips on our website or contact us for personalized advice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
