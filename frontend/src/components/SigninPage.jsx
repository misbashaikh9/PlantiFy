import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authAPI } from '../services/api';
import '../styles/SigninPage.css';

const SigninPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form',
        confirmButtonColor: '#4CAF50'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for backend (Django expects username, password)
      const credentials = {
        username: formData.username, // Django expects username field
        password: formData.password
      };

      // Call backend API
      const response = await authAPI.login(credentials);
      
      // Store user data in localStorage (you might want to use a more secure method)
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: response.message || 'Welcome back to PlantiFy!',
        confirmButtonColor: '#4CAF50'
      });

      // Log the response data
      console.log('Login successful:', response);

      // Redirect to dashboard or home page
      navigate('/home'); // You can change this to your desired route
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data) {
        const backendErrors = error.response.data;
        
        // Handle Django backend validation errors
        if (typeof backendErrors === 'object') {
          if (backendErrors.error) {
            errorMessage = backendErrors.error;
          } else {
            const firstError = Object.values(backendErrors)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else {
              errorMessage = firstError;
            }
          }
        } else {
          errorMessage = backendErrors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonColor: '#4CAF50'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-modal">
        {/* Left Panel - Green */}
        <div className="left-panel">
          <div className="decorative-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
          
          <div className="left-content">
            <h1 className="signin-title">Sign in</h1>
            <p className="signin-subtitle">Welcome back to PlantiFy</p>
            
            <div className="logo-icon">
              <div className="icon-ring outer"></div>
              <div className="icon-ring inner"></div>
              <div className="icon-segment red"></div>
              <div className="icon-segment yellow"></div>
              <div className="icon-segment green"></div>
              <div className="icon-segment blue"></div>
              <div className="icon-check">✓</div>
            </div>
          </div>
        </div>

        {/* Right Panel - White Form */}
        <div className="right-panel">
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="password-input">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                />
                {formData.password && <span className="validation-check">✓</span>}
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="signin-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              <span className="or-text">or</span>
              <a href="/signup" className="signup-link">Create Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;

