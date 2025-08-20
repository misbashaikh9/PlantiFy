import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    plant_experience: 'beginner',
    preferred_plant_types: [],
    newsletter_subscription: true
  });

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [saveStatus, setSaveStatus] = useState(''); // Save status message
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordStatus, setPasswordStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [isEditingPreferences, setIsEditingPreferences] = useState(false); // Edit mode for preferences

  // Manual save function for profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Debug: Log what's being sent
    console.log('🚀 Sending profile data to backend:', profileData);
    console.log('📊 Data fields count:', Object.keys(profileData).length);
    console.log('🔍 All fields:', Object.keys(profileData));
    
    try {
      const response = await fetch(`http://localhost:8000/plant_store/api/profile/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Backend response:', responseData);
        
        // Update local storage
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSaveStatus('✅ Profile saved successfully!');
        setIsEditing(false); // Exit edit mode after successful save
        
        // Clear status after 3 seconds
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ Backend error:', errorData);
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('❌ Failed to save profile. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Manual save function for plant preferences
  const handleSavePreferences = async () => {
    // Debug: Log what's being sent
    console.log('🚀 Sending preferences data to backend:', profileData);
    console.log('📊 Preferences fields count:', Object.keys(profileData).length);
    console.log('🔍 All preference fields:', Object.keys(profileData));
    
    try {
      const response = await fetch(`http://localhost:8000/plant_store/api/profile/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Backend response for preferences:', responseData);
        
        // Update local storage
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSaveStatus('✅ Preferences saved successfully!');
        setIsEditingPreferences(false); // Exit edit mode after successful save
        
        // Clear status after 3 seconds
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ Backend error for preferences:', errorData);
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('❌ Failed to save preferences. Please try again.');
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        date_of_birth: user.profile?.date_of_birth || '',
        plant_experience: user.profile?.plant_experience || 'beginner',
        preferred_plant_types: user.profile?.preferred_plant_types || [],
        newsletter_subscription: user.profile?.newsletter_subscription !== false
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle preferences edit mode toggle
  const handlePreferencesEditToggle = () => {
    if (isEditingPreferences) {
      // Cancel editing - reset to original values
      setProfileData({
        ...profileData,
        plant_experience: user.profile?.plant_experience || 'beginner',
        preferred_plant_types: user.profile?.preferred_plant_types || []
      });
    }
    setIsEditingPreferences(!isEditingPreferences);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      // Don't set profileData here - wait for backend data
      setLoading(true);
      fetchUserData(userObj.id);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      // Fetch current profile data from backend FIRST
      const profileResponse = await fetch(`http://localhost:8000/plant_store/api/profile/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (profileResponse.ok) {
        const profileDataFromBackend = await profileResponse.json();
        console.log('📥 Current profile data from backend:', profileDataFromBackend);
        console.log('📊 Backend fields count:', Object.keys(profileDataFromBackend).length);
        console.log('🔍 Backend fields:', Object.keys(profileDataFromBackend));
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        const userObj = userData ? JSON.parse(userData) : {};
        
        // Set profileData with backend data, fallback to localStorage data
        setProfileData({
          first_name: profileDataFromBackend.first_name || userObj.first_name || '',
          last_name: profileDataFromBackend.last_name || userObj.last_name || '',
          email: profileDataFromBackend.email || userObj.email || '',
          phone: profileDataFromBackend.phone || userObj.profile?.phone || '',
          date_of_birth: profileDataFromBackend.date_of_birth || userObj.profile?.date_of_birth || '',
          plant_experience: profileDataFromBackend.plant_experience || userObj.profile?.plant_experience || 'beginner',
          preferred_plant_types: profileDataFromBackend.preferred_plant_types || userObj.profile?.preferred_plant_types || [],
          newsletter_subscription: profileDataFromBackend.newsletter_subscription !== false
        });
        
        // Update user state with backend profile data
        setUser(prevUser => ({
          ...prevUser,
          profile: {
            ...prevUser.profile,
            ...profileDataFromBackend
          }
        }));
      }

      // Fetch addresses
      const addressesResponse = await fetch(`http://localhost:8000/plant_store/api/addresses/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (addressesResponse.ok) {
        const addressesData = await addressesResponse.json();
        setAddresses(addressesData);
      }

      // Fetch recent orders
      const ordersResponse = await fetch(`http://localhost:8000/plant_store/api/orders/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (ordersResponse.ok) {
        try {
          const ordersData = await ordersResponse.json();
          // Handle paginated response structure
          if (ordersData.results && Array.isArray(ordersData.results)) {
            setOrders(ordersData.results.slice(0, 5)); // Show last 5 orders
          } else if (Array.isArray(ordersData)) {
            setOrders(ordersData.slice(0, 5)); // Direct array response
          } else {
            console.log('⚠️ Orders data structure:', ordersData);
            setOrders([]);
          }
        } catch (error) {
          console.error('❌ Error parsing orders JSON:', error);
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedData = {
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    };
    
    setProfileData(updatedData);
    
    // Trigger auto-save with updated data
    // debouncedAutoSave(updatedData); // Removed auto-save
  };

  const handlePlantTypeToggle = (plantType) => {
    const updatedData = {
      ...profileData,
      preferred_plant_types: profileData.preferred_plant_types.includes(plantType)
        ? profileData.preferred_plant_types.filter(type => type !== plantType)
        : [...profileData.preferred_plant_types, plantType]
    };
    
    setProfileData(updatedData);
    
    // Trigger auto-save with updated data
    // debouncedAutoSave(updatedData); // Removed auto-save
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordStatus('❌ New passwords do not match');
      setTimeout(() => setPasswordStatus(''), 5000);
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordStatus('❌ New password must be at least 8 characters long');
      setTimeout(() => setPasswordStatus(''), 5000);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/plant_store/api/profile/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });

      if (response.ok) {
        setPasswordStatus('✅ Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setShowPasswordForm(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setPasswordStatus(''), 3000);
      } else {
        const errorData = await response.json();
        setPasswordStatus(`❌ ${errorData.error || 'Failed to change password'}`);
        setTimeout(() => setPasswordStatus(''), 5000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordStatus('❌ An error occurred. Please try again.');
      setTimeout(() => setPasswordStatus(''), 5000);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const plantExperienceOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to plant care' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience with plants' },
    { value: 'expert', label: 'Expert', description: 'Advanced plant care knowledge' }
  ];

  const plantTypeOptions = [
    'Indoor Plants', 'Succulents', 'Tropical Plants', 'Herbs', 'Flowering Plants',
    'Cacti', 'Ferns', 'Bonsai', 'Orchids', 'Palms', 'Vines', 'Aroids'
  ];

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="loading-message">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <Header />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            <h1>{user.first_name} {user.last_name}</h1>
            <p className="user-email">{user.email}</p>
            <p className="member-since">Member since {new Date(user.date_joined).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <nav className="profile-nav">
              <button 
                className={`nav-tab ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button 
                className={`nav-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Plant Preferences
              </button>
              <button 
                className={`nav-tab ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                Addresses
              </button>
              <button 
                className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Order History
              </button>
              <button 
                className={`nav-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button 
                className={`nav-tab ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                Contact Us
              </button>
            </nav>
          </div>

          <div className="profile-main">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <div className="header-actions">
                    {isSaving && (
                      <span className="auto-save-status saving">Saving...</span>
                    )}
                    {saveStatus && !isSaving && (
                      <span className="auto-save-status">{saveStatus}</span>
                    )}
                    {!isEditing ? (
                      <button 
                        className="edit-btn"
                        onClick={handleEditToggle}
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button 
                          className="edit-btn cancel"
                          onClick={handleEditToggle}
                        >
                          Cancel
                        </button>
                        <button 
                          className="edit-btn save"
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save Now'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={profileData.date_of_birth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="newsletter_subscription"
                        checked={profileData.newsletter_subscription}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      Subscribe to our newsletter for plant care tips and updates
                    </label>
                  </div>
                  
                </div>
              </div>
            )}

            {/* Plant Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Plant Preferences</h2>
                  {!isEditingPreferences ? (
                    <button 
                      className="edit-btn"
                      onClick={handlePreferencesEditToggle}
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button 
                        className="edit-btn cancel"
                        onClick={handlePreferencesEditToggle}
                      >
                        Cancel
                      </button>
                      <button 
                        className="edit-btn save"
                        onClick={handleSavePreferences}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </>
                  )}
                </div>
                
                <div className="preferences-content">
                  <div className="experience-section">
                    <h3>Plant Care Experience Level</h3>
                    <div className="experience-options">
                      {plantExperienceOptions.map(option => (
                        <label key={option.value} className="experience-option">
                          <input
                            type="radio"
                            name="plant_experience"
                            value={option.value}
                            checked={profileData.plant_experience === option.value}
                            onChange={handleInputChange}
                            disabled={!isEditingPreferences}
                          />
                          <div className="option-content">
                            <div className="option-text">
                              <strong>{option.label}</strong>
                              <span>{option.description}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="plant-types-section">
                    <h3>Preferred Plant Types</h3>
                    <p>Select the types of plants you're most interested in:</p>
                    <div className="plant-types-grid">
                      {plantTypeOptions.map(plantType => (
                        <label key={plantType} className="plant-type-option">
                          <input
                            type="checkbox"
                            checked={profileData.preferred_plant_types.includes(plantType)}
                            onChange={() => handlePlantTypeToggle(plantType)}
                            disabled={!isEditingPreferences}
                          />
                          <span className="plant-type-label">{plantType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>My Addresses</h2>
                  <button className="add-btn" onClick={() => navigate('/checkout')}>
                    Add New Address
                  </button>
                </div>
                
                <div className="addresses-list">
                  {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                      <div key={index} className="address-card">
                        <div className="address-header">
                          <span className="address-type">{address.address_type}</span>
                          {address.is_default && <span className="default-badge">Default</span>}
                        </div>
                        <div className="address-details">
                          <p><strong>{address.full_name}</strong></p>
                          <p>{address.address_line1}</p>
                          {address.address_line2 && <p>{address.address_line2}</p>}
                          <p>{address.city}, {address.state} {address.zip_code}</p>
                          <p>{address.country}</p>
                          <p>Phone: {address.phone}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No addresses saved yet.</p>
                      <button className="add-btn" onClick={() => navigate('/checkout')}>
                        Add Your First Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Recent Orders</h2>
                  <button className="view-all-btn" onClick={() => navigate('/orders')}>
                    View All Orders
                  </button>
                </div>
                
                <div className="orders-list">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div key={index} className="order-card">
                        <div className="order-header">
                          <span className="order-number">#{order.order_number}</span>
                          <span className={`order-status ${order.status}`}>{order.status}</span>
                        </div>
                        <div className="order-details">
                          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                          <p>Total: ₹{order.total_amount}</p>
                          <p>Items: {order.items?.length || 0} products</p>
                        </div>
                        <button className="view-order-btn" onClick={() => navigate('/orders')}>
                          View Details
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No orders yet.</p>
                      <button className="shop-btn" onClick={() => navigate('/store')}>
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                </div>
                
                <div className="security-content">
                  <div className="security-option">
                    <div className="security-info">
                      <h3>Change Password</h3>
                      <p>Update your account password for enhanced security</p>
                    </div>
                    <button 
                      className="security-btn" 
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  
                  {showPasswordForm && (
                    <div className="password-change-form">
                      {passwordStatus && (
                        <div className={`password-status ${passwordStatus.includes('✅') ? 'success' : 'error'}`}>
                          {passwordStatus}
                        </div>
                      )}
                      <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                          <label>Current Password</label>
                          <input
                            type="password"
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordInputChange}
                            required
                            placeholder="Enter your current password"
                          />
                        </div>
                        <div className="form-group">
                          <label>New Password</label>
                          <input
                            type="password"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordInputChange}
                            required
                            placeholder="Enter new password (min 8 characters)"
                          />
                        </div>
                        <div className="form-group">
                          <label>Confirm New Password</label>
                          <input
                            type="password"
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordInputChange}
                            required
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="save-btn">
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <div className="security-option">
                    <div className="security-info">
                      <h3>Plant Care Tips</h3>
                      <p>Get personalized plant care advice based on your experience level</p>
                    </div>
                    <button className="security-btn">Get Tips</button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Us Tab */}
            {activeTab === 'contact' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Contact Us</h2>
                  <p>Get in touch with our support team for any questions or assistance</p>
                </div>
                
                <div className="contact-content">
                  <div className="contact-methods">
                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="contact-info">
                        <h3>Email Support</h3>
                        <p>support@plantify.com</p>
                        <p className="response-time">Response within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="contact-info">
                        <h3>Phone Support</h3>
                        <p>+91 98765 43210</p>
                        <p className="response-time">Mon-Fri: 9 AM - 6 PM IST</p>
                      </div>
                    </div>
                    
                    <div className="contact-method">
                      <div className="contact-icon">
                        <i className="fas fa-comments"></i>
                      </div>
                      <div className="contact-info">
                        <h3>Live Chat</h3>
                        <p>Available on website</p>
                        <p className="response-time">Instant response</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="contact-actions">
                    <button 
                      className="contact-btn primary"
                      onClick={() => navigate('/contact')}
                    >
                      <i className="fas fa-envelope"></i>
                      Send Message
                    </button>
                    <button 
                      className="contact-btn secondary"
                      onClick={() => navigate('/suggestions')}
                    >
                      <i className="fas fa-lightbulb"></i>
                      Share Feedback
                    </button>
                  </div>
                  
                  <div className="contact-faq">
                    <h3>Frequently Asked Questions</h3>
                    <div className="faq-item">
                      <h4>How do I track my order?</h4>
                      <p>You can track your order in the "Order History" tab above or contact our support team.</p>
                    </div>
                    <div className="faq-item">
                      <h4>What's your return policy?</h4>
                      <p>We offer a 7-day return policy for plants in good condition. Contact us for details.</p>
                    </div>
                    <div className="faq-item">
                      <h4>How do I use the AI Care feature?</h4>
                      <p>Visit the AI Care page from the header to get personalized plant care recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
