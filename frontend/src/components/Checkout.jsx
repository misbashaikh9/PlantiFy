import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { cartService } from '../services/cartService';
import Swal from 'sweetalert2';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('address'); // address, payment, confirmation

  // Load cart data when component mounts
  useEffect(() => {
    const loadCartData = async () => {
      try {
        await cartService.loadCartFromDatabase();
        const summary = cartService.getCartSummary();
        setCartItems(summary.items || []);
        setCartTotal(summary.total || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error loading cart data:', error);
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '', cardHolder: '', expiryDate: '', cvv: '', upiId: '', email: '', confirmEmail: ''
  });
  const [errors, setErrors] = useState({});

  // Form state for new address
  const [newAddress, setNewAddress] = useState({
    address_type: 'home',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India'
  });

  // Indian states and cities data
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const indianCities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
    'Delhi': ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore'],
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Gorakhpur'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Almora', 'Mussoorie'],
    'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Kullu', 'Dharamshala', 'Manali'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Mormugao'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul', 'Senapati'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia', 'Khowai'],
    'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Singtam', 'Rangpo'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Bomdila', 'Tawang', 'Ziro']
  };

  // Calculate estimated delivery date from today (for checkout preview)
  const calculateDeliveryDate = () => {
    const today = new Date();
    
    // Add 4 business days (excluding weekends)
    let businessDays = 0;
    let currentDate = new Date(today);
    
    while (businessDays < 4) { // 4 business days for average delivery
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        businessDays++;
      }
    }
    
    return currentDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get product image path based on name and category
  const getProductImage = (productName, categoryName) => {
    // Map product names to image filenames based on actual folder structure
    const imageMap = {
      // Indoor Plants
      'Monstera Deliciosa': '/media/Indoor Plants/MonsteraDeliciosa.jpeg',
      'Snake Plant': '/media/Indoor Plants/SnakePlant.jpeg',
      'Peace Lily': '/media/Indoor Plants/PeaceLily.jpeg',
      'ZZ Plant': '/media/Indoor Plants/ZZPlant.jpeg',
      'Pothos Golden': '/media/Indoor Plants/PothosGolden.png',
      'Philodendron Brasil': '/media/Indoor Plants/PhilodendronBrasil.jpg',
      'Chinese Evergreen': '/media/Indoor Plants/ChineseEvergreen.jpg',
      'Dracaena Marginata': '/media/Indoor Plants/DracaenaMarginata.jpg',
      'Spider Plant': '/media/Indoor Plants/SpiderPlant.jpg',
      
      // Herbs & Edibles
      'Fresh Herb Garden Kit': '/media/Herbs&Edibles/FreshHerbGardenKit.jpeg',
      'Dwarf Tomato Plant': '/media/Herbs&Edibles/DwarfTomatoPlant.jpg',
      'Basil Plant': '/media/Herbs&Edibles/BasilPlant.jpeg',
      'Mint Plant': '/media/Herbs&Edibles/MintPlant.jpg',
      'Rosemary Plant': '/media/Herbs&Edibles/RosemaryPlant.jpg',
      'Lavender Plant': '/media/Herbs&Edibles/LavenderPlant.jpg',
      
      // Seeds
      'Carrot Seeds': '/media/Seeds/Carrot Seeds.jpg',
      'Bell Pepper Seeds': '/media/Seeds/BellPapperSeed.jpg',
      'Cucumber Seeds': '/media/Seeds/CucumberSeeds.jpg',
      'Spinach Seeds': '/media/Seeds/Spinach Seeds',
      'Radish Seeds': '/media/Seeds/RadishSeeds.jpg',
      'Green Bean Seeds': '/media/Seeds/GreenBeanSeeds.jpg',
      
      // Fertilizers
      'NPK Balanced Fertilizer': '/media/Fertilizers/NPKBalancedFertilizer.jpeg',
      'Organic Fish Emulsion': '/media/Fertilizers/OrganicFishEmulsion.jpg',
      'Liquid Seaweed Extract': '/media/Fertilizers/LiquidSeaweedExtract.jpeg',
      'Slow-Release Granules': '/media/Fertilizers/Slow-ReleaseGranules.jpeg',
      'Micronutrient Mix': '/media/Fertilizers/Micronutrient Mix.jpeg',
      'Compost Tea Concentrate': '/media/Fertilizers/CompostTeaConcentrate.jpeg'
    };
    
    return imageMap[productName] || '/media/Indoor Plants/SnakePlant.jpeg';
  };

  useEffect(() => {
    initializeCheckout();
  }, []);

  const initializeCheckout = async () => {
    try {
      // Load cart data from database
      await cartService.loadCartFromDatabase();
      const summary = cartService.getCartSummary();
      
      console.log('🔍 Checkout - Cart summary:', summary);
      console.log('🔍 Checkout - Cart items:', summary.items);
      console.log('🔍 Checkout - Cart total:', summary.total);
      
      if (!summary.items || summary.items.length === 0) {
        Swal.fire({
          title: '🛒 Empty Cart',
          text: 'Your cart is empty. Please add some products first.',
          icon: 'warning',
          confirmButtonText: 'Go to Store',
          confirmButtonColor: '#4CAF50'
        }).then(() => {
          navigate('/store');
        });
        return;
      }

      setCartItems(summary.items);
      setCartTotal(summary.total);

      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      setUser(currentUser);

      // Auto-fill email from user profile
      if (currentUser.email) {
        setPaymentDetails(prev => ({
          ...prev,
          email: currentUser.email
        }));
      }

      // Check if user has addresses
      await checkUserAddresses(currentUser.id);
      
    } catch (error) {
      console.error('Checkout initialization error:', error);
      setLoading(false);
    }
  };

  const checkUserAddresses = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/plant_store/api/addresses/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const addresses = await response.json();
        setUserAddresses(addresses);
        
        if (addresses.length === 0) {
          // No addresses - force profile completion
          setStep('profile-setup');
        } else {
          // Has addresses - show selection
          setStep('address');
          setSelectedAddress(addresses.find(addr => addr.is_default) || addresses[0]);
        }
      } else {
        // No addresses found - force profile completion
        setStep('profile-setup');
      }
    } catch (error) {
      console.error('Error checking addresses:', error);
      setStep('profile-setup');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting address data:', newAddress);
    console.log('Auth token:', localStorage.getItem('token'));
    
    try {
      const response = await fetch('http://localhost:8000/plant_store/api/addresses/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAddress)
      });

      if (response.ok) {
        const savedAddress = await response.json();
        setUserAddresses([...userAddresses, savedAddress]);
        setSelectedAddress(savedAddress);
        setShowAddressForm(false);
        setStep('address');
        
        Swal.fire({
          title: 'Address Saved!',
          text: 'Your address has been saved successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to save address: ${response.status} - ${errorData.detail || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save address. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setErrors({}); // Clear errors when payment method changes
    
    // Reset payment details for the new method
    setPaymentDetails({
      cardNumber: '', 
      cardHolder: '', 
      expiryDate: '', 
      cvv: '', 
      upiId: '', 
      email: '', 
      confirmEmail: ''
    });
  };

  // Real-time validation functions
  const validateCardNumber = (value) => {
    if (!value) return 'Card number is required';
    if (value.replace(/\s/g, '').length < 16) return 'Card number must be at least 16 digits';
    return null;
  };

  const validateCardHolder = (value) => {
    if (!value) return 'Cardholder name is required';
    return null;
  };

  const validateExpiryDate = (value) => {
    if (!value) return 'Expiry date is required';
    
    const [month, year] = value.split('/');
    if (!month || !year || isNaN(month) || isNaN(year)) {
      return 'Invalid format (MM/YY)';
    }
    
    if (month < 1 || month > 12) {
      return 'Invalid month (01-12)';
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card has expired';
    }
    
    return null;
  };

  const validateCVV = (value) => {
    if (!value) return 'CVV is required';
    if (value.length < 3) return 'Please enter a valid CVV';
    return null;
  };

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  };

  const validateConfirmEmail = (value) => {
    // Email confirmation is no longer required since emails are optional
    if (value && value !== paymentDetails.email) return 'Emails do not match';
    return null;
  };

  const validateUPI = (value) => {
    if (!value) return 'UPI ID is required';
    return null;
  };

  // Handle input changes with real-time validation
  const handleCardNumberChange = (value) => {
    const formattedValue = formatCardNumber(value);
    setPaymentDetails({...paymentDetails, cardNumber: formattedValue});
    
    const error = validateCardNumber(formattedValue);
    setErrors(prev => ({...prev, cardNumber: error}));
  };

  const handleCardHolderChange = (value) => {
    setPaymentDetails({...paymentDetails, cardHolder: value});
    
    const error = validateCardHolder(value);
    setErrors(prev => ({...prev, cardHolder: error}));
  };

  const handleExpiryDateChange = (value) => {
    const formattedValue = formatExpiryDate(value);
    setPaymentDetails({...paymentDetails, expiryDate: formattedValue});
    
    const error = validateExpiryDate(formattedValue);
    setErrors(prev => ({...prev, expiryDate: error}));
  };

  const handleCVVChange = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    setPaymentDetails({...paymentDetails, cvv: cleanValue});
    
    const error = validateCVV(cleanValue);
    setErrors(prev => ({...prev, cvv: error}));
  };

  const handleEmailChange = (value) => {
    setPaymentDetails({...paymentDetails, email: value});
    setErrors(prev => ({...prev, email: validateEmail(value)}));
    
    // Clear confirm email error if main email changes
    if (paymentDetails.confirmEmail) {
      setErrors(prev => ({...prev, confirmEmail: validateConfirmEmail(paymentDetails.confirmEmail)}));
    }
  };

  const handleConfirmEmailChange = (value) => {
    setPaymentDetails({...paymentDetails, confirmEmail: value});
    
    // Only validate if a value is provided
    if (value) {
      setErrors(prev => ({...prev, confirmEmail: validateConfirmEmail(value)}));
    } else {
      // Clear confirm email error if field is empty
      setErrors(prev => ({...prev, confirmEmail: undefined}));
    }
  };

  const handleUPIChange = (value) => {
    setPaymentDetails({...paymentDetails, upiId: value});
    
    const error = validateUPI(value);
    setErrors(prev => ({...prev, upiId: error}));
  };

  const validatePaymentDetails = () => {
    const newErrors = {};
    
    if (selectedPaymentMethod === 'card') {
      newErrors.cardNumber = validateCardNumber(paymentDetails.cardNumber);
      newErrors.cardHolder = validateCardHolder(paymentDetails.cardHolder);
      newErrors.expiryDate = validateExpiryDate(paymentDetails.expiryDate);
      newErrors.cvv = validateCVV(paymentDetails.cvv);
      
      // Email validation for card payments (optional)
      if (paymentDetails.email) {
        newErrors.email = validateEmail(paymentDetails.email);
      }
    } else if (selectedPaymentMethod === 'upi') {
      newErrors.upiId = validateUPI(paymentDetails.upiId);
      
      // Email validation for UPI payments (optional)
      if (paymentDetails.email) {
        newErrors.email = validateEmail(paymentDetails.email);
      }
    }
    // For COD, no validation required - all fields are optional
    
    // Remove null errors and undefined errors
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key] === null || newErrors[key] === undefined) {
        delete newErrors[key];
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? null : 'Please fix the errors above';
  };

  const handleCheckout = async () => {
    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
      Swal.fire({
        title: '🛒 Empty Cart',
        text: 'Your cart is empty. Please add some products before checkout.',
        icon: 'warning',
        confirmButtonText: 'Go to Store',
        confirmButtonColor: '#4CAF50'
      }).then(() => {
        navigate('/store');
      });
      return;
    }

    if (!selectedAddress) {
      Swal.fire({
        title: 'Address Required',
        text: 'Please select or add a shipping address.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!selectedPaymentMethod) {
      Swal.fire({
        title: 'Payment Method Required',
        text: 'Please select a payment method.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    console.log('🔍 About to validate payment details...');
    const paymentValidationError = validatePaymentDetails();
    console.log('🔍 Payment validation result:', paymentValidationError);
    
    if (paymentValidationError) {
      console.log('🔍 Payment validation failed, showing error...');
      Swal.fire({
        title: 'Payment Details Required',
        text: paymentValidationError,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      // Cart is already synced with backend, no need to sync again
      console.log('Cart items ready for checkout:', cartItems);

      // Create order
      const orderData = {
        shipping_address: selectedAddress.address_line1,
        shipping_city: selectedAddress.city,
        shipping_state: selectedAddress.state,
        shipping_zip: selectedAddress.zip_code,
        shipping_country: selectedAddress.country,
        contact_phone: selectedAddress.phone,
        payment_method: selectedPaymentMethod,
        customer_email: paymentDetails.email || user.email,
        total_amount: cartTotal  // Send the frontend cart total
      };

      const response = await fetch('http://localhost:8000/plant_store/api/orders/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        
        // Clear cart from database
        await cartService.clearCart();
        
        // Prepare order data for success page
        const orderData = {
          order_number: order.order_number,
          total_amount: cartTotal * 1.08, // Include tax
          payment_method: selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : 
                         selectedPaymentMethod === 'card' ? 'Credit/Debit Card' : 
                         selectedPaymentMethod === 'upi' ? 'UPI' : 'N/A',
          items: cartItems,
          shipping_address: selectedAddress
        };
        
        // Store in localStorage as backup
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Navigate to success page with order data
        navigate('/order-success', { state: { orderData } });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        title: 'Order Failed',
        text: error.message || 'Failed to create order. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="loading-message">Loading checkout...</div>
      </div>
    );
  }

  if (step === 'profile-setup') {
    return (
      <div className="checkout-page">
        <Header />
        <div className="profile-setup">
                     <h2>Complete Your Profile</h2>
          <p>Please add your shipping address to continue with checkout.</p>
          
          <form onSubmit={handleAddressSubmit} className="address-form">
            <div className="form-row">
              <div className="form-group">
                <label>Address Type</label>
                <select 
                  value={newAddress.address_type} 
                  onChange={(e) => setNewAddress({...newAddress, address_type: e.target.value})}
                  required
                >
                  <option value="">Select Address Type</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="shipping">Shipping</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  value={newAddress.full_name}
                  onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                placeholder="Enter your phone number (e.g., 9876543210)"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address Line 1 *</label>
              <input 
                type="text" 
                placeholder="Enter street address, apartment, suite, etc."
                value={newAddress.address_line1}
                onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input 
                type="text" 
                placeholder="Enter additional address details (optional)"
                value={newAddress.address_line2}
                onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State *</label>
                <select 
                  value={newAddress.state} 
                  onChange={(e) => {
                    setNewAddress({
                      ...newAddress, 
                      state: e.target.value,
                      city: '' // Reset city when state changes
                    });
                  }}
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>City *</label>
                <select 
                  value={newAddress.city} 
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  required
                  disabled={!newAddress.state}
                >
                  <option value="">{newAddress.state ? 'Select City' : 'Select State First'}</option>
                  {newAddress.state && indianCities[newAddress.state]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code *</label>
                <input 
                  type="text" 
                  placeholder="Enter ZIP/PIN code (e.g., 400001)"
                  value={newAddress.zip_code}
                  onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  placeholder="Enter country name"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="save-address-btn">
              Save Address & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />
      
      <div className="checkout-container">
        <div className="checkout-content">
          <h1 className="checkout-title">Checkout</h1>
          
          {/* Address Selection */}
          <div className="checkout-section">
            <h2>
              <span className="material-icons section-icon">location_on</span>
              Shipping Address
            </h2>
            
            {userAddresses.length > 0 && (
              <div className="existing-addresses">
                <h3>Choose an Address:</h3>
                {userAddresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={`address-option ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="address-info">
                      <div className="address-type">{address.address_type}</div>
                      <div className="address-details">
                        <strong>{address.full_name}</strong>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>{address.city}, {address.state} {address.zip_code}</p>
                        <p>{address.country}</p>
                                                 <p>Phone: {address.phone}</p>
                      </div>
                    </div>
                    {address.is_default && <span className="default-badge">Default</span>}
                  </div>
                ))}
              </div>
            )}
            
            <button 
              className="add-new-address-btn"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              <span className="material-icons">
                {showAddressForm ? 'close' : 'add_location'}
              </span>
              {showAddressForm ? 'Cancel' : 'Add New Address'}
            </button>
            
            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Address Type</label>
                    <select 
                      value={newAddress.address_type} 
                      onChange={(e) => setNewAddress({...newAddress, address_type: e.target.value})}
                      required
                    >
                      <option value="">Select Address Type</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="shipping">Shipping</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      value={newAddress.full_name}
                      onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number (e.g., 9876543210)"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address Line 1 *</label>
                  <input 
                    type="text" 
                    placeholder="Enter street address, apartment, suite, etc."
                    value={newAddress.address_line1}
                    onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address Line 2</label>
                  <input 
                    type="text" 
                    placeholder="Enter additional address details (optional)"
                    value={newAddress.address_line2}
                    onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State *</label>
                    <select 
                      value={newAddress.state} 
                      onChange={(e) => {
                        setNewAddress({
                          ...newAddress, 
                          state: e.target.value,
                          city: '' // Reset city when state changes
                        });
                      }}
                      required
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>City *</label>
                    <select 
                      value={newAddress.city} 
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      required
                      disabled={!newAddress.state}
                    >
                      <option value="">{newAddress.state ? 'Select City' : 'Select State First'}</option>
                      {newAddress.state && indianCities[newAddress.state]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input 
                      type="text" 
                      placeholder="Enter ZIP/PIN code (e.g., 400001)"
                      value={newAddress.zip_code}
                      onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Country</label>
                    <input 
                      type="text" 
                      placeholder="Enter country name"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="save-address-btn">
                  <span className="material-icons">save</span>
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="checkout-section">
            <h2>
              <span className="material-icons section-icon">payment</span>
              Payment Method
            </h2>
            
            <div className="payment-methods">
              <div className="payment-method-option">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => handlePaymentMethodChange('card')}
                />
                <label htmlFor="card" className="payment-method-label">
                  <span className="payment-icon">
                    <span className="material-icons">credit_card</span>
                  </span>
                  <div className="payment-method-info">
                    <span className="payment-method-name">Credit/Debit Card</span>
                    <span className="payment-method-description">Visa, MasterCard, RuPay, American Express</span>
                  </div>
                </label>
              </div>

              <div className="payment-method-option">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={() => handlePaymentMethodChange('upi')}
                />
                <label htmlFor="upi" className="payment-method-label">
                  <span className="payment-icon">
                    <span className="material-icons">smartphone</span>
                  </span>
                  <div className="payment-method-info">
                    <span className="payment-method-name">UPI</span>
                    <span className="payment-method-description">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </label>
              </div>

              <div className="payment-method-option">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedPaymentMethod === 'cod'}
                  onChange={() => handlePaymentMethodChange('cod')}
                />
                <label htmlFor="cod" className="payment-method-label">
                  <span className="payment-icon">
                    <span className="material-icons">payments</span>
                  </span>
                  <div className="payment-method-info">
                    <span className="payment-method-name">Cash on Delivery</span>
                    <span className="payment-method-description">Pay when you receive your order</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Details Forms */}
            {selectedPaymentMethod === 'card' && (
              <div className="payment-details-form">
                <h3>Card Details</h3>
                <div className="form-group">
                  <label>Card Number *</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    maxLength="19"
                    className={errors.cardNumber ? 'error' : (paymentDetails.cardNumber && !errors.cardNumber ? 'valid' : '')}
                  />
                  {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                </div>
                
                <div className="form-group">
                  <label>Cardholder Name *</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={paymentDetails.cardHolder}
                    onChange={(e) => handleCardHolderChange(e.target.value)}
                    className={errors.cardHolder ? 'error' : (paymentDetails.cardHolder && !errors.cardHolder ? 'valid' : '')}
                  />
                  {errors.cardHolder && <p className="error-message">{errors.cardHolder}</p>}
                </div>
                
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => handleExpiryDateChange(e.target.value)}
                    maxLength="5"
                    className={errors.expiryDate ? 'error' : (paymentDetails.expiryDate && !errors.expiryDate ? 'valid' : '')}
                  />
                  {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                </div>
                
                <div className="form-group">
                  <label>CVV *</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => handleCVVChange(e.target.value)}
                    maxLength="4"
                    className={errors.cvv ? 'error' : (paymentDetails.cvv && !errors.cvv ? 'valid' : '')}
                  />
                  {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                </div>

                <div className="form-group">
                  <label>Email for Receipt</label>
                  <input 
                    type="email" 
                    placeholder={user?.email || "Loading..."}
                    value={user?.email || ""}
                    disabled
                    className="disabled-field"
                  />
                  <small className="form-help">Order confirmation will be sent to your registered email: {user?.email}</small>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'upi' && (
              <div className="payment-details-form">
                <h3><span className="material-icons">smartphone</span>UPI Details</h3>
                <div className="form-group">
                  <label>UPI ID *</label>
                  <input 
                    type="text" 
                    placeholder="username@upi"
                    value={paymentDetails.upiId}
                    onChange={(e) => handleUPIChange(e.target.value)}
                    className={errors.upiId ? 'error' : (paymentDetails.upiId && !errors.upiId ? 'valid' : '')}
                  />
                  <small className="form-help">Example: john@okicici or john@paytm</small>
                  {errors.upiId && <p className="error-message">{errors.upiId}</p>}
                </div>
                <div className="form-group">
                  <label>Email for Receipt</label>
                  <input 
                    type="email" 
                    placeholder={user?.email || "Loading..."}
                    value={user?.email || ""}
                    disabled
                    className="disabled-field"
                  />
                  <small className="form-help">Order confirmation will be sent to your registered email: {user?.email}</small>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'cod' && (
              <div className="payment-details-form">
                <h3>Cash on Delivery</h3>
                <div className="cod-info">
                  <p>
                    <span className="material-icons cod-icon">payments</span>
                    You'll pay ₹{(cartTotal * 1.08).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} when you receive your order.
                  </p>
                  <p>
                    <span className="material-icons cod-icon">lightbulb</span>
                    Keep exact change ready for a smooth delivery experience.
                  </p>
                </div>
                
                <div className="form-group">
                  <label>Email for Updates</label>
                  <input 
                    type="email" 
                    placeholder={user?.email || "Loading..."}
                    value={user?.email || ""}
                    disabled
                    className="disabled-field"
                  />
                  <small className="form-help">Order updates will be sent to your registered email: {user?.email}</small>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <h2>
              <span className="material-icons section-icon">receipt</span>
              Order Summary
            </h2>
            <div className="order-summary">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img 
                      src={`http://localhost:8000${getProductImage(item.product?.name || item.name, item.product?.category?.name || item.category)}`}
                      alt={item.product?.name || item.name}
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.src = 'http://localhost:8000/media/Indoor Plants/SnakePlant.jpeg';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-category">{item.category}</span>
                    </div>
                    <div className="item-meta">
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-unit-price">₹{(item.product?.price || 0).toLocaleString('en-IN')} each</span>
                    </div>
                  </div>
                  <div className="item-total">
                    <span className="item-price">₹{(item.total_price || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
              
              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-item">
                  <span>GST (8%):</span>
                  <span>₹{(cartTotal * 0.08).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="breakdown-item gst-rate">
                  <span>GST Rate:</span>
                  <span style={{color: '#4CAF50', fontWeight: '600'}}>8%</span>
                </div>
                <div className="breakdown-item total">
                  <span>Total:</span>
                  <span>₹{(cartTotal * 1.08).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              {/* Delivery Estimate */}
              <div className="delivery-estimate-checkout">
                <div className="delivery-icon">📅</div>
                <div className="delivery-info">
                  <span className="delivery-label">Estimated Delivery Date:</span>
                  <span className="delivery-date">{calculateDeliveryDate()}</span>
                  <span className="delivery-note">(3-5 business days, excluding weekends)</span>
                </div>
              </div>
              
              {/* GST Information */}
              <div className="gst-info">
                <div className="gst-header">
                  <span className="material-icons gst-icon">receipt_long</span>
                  <span>GST Information</span>
                </div>
                <div className="gst-details">
                  <p>• <strong>GST Rate:</strong> 8% (as per Indian tax regulations)</p>
                  <p>• <strong>GST Number:</strong> Your business GSTIN will be displayed on invoice</p>
                  <p>• <strong>Tax Invoice:</strong> Detailed tax breakdown will be provided</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="checkout-actions">
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={!selectedAddress || !selectedPaymentMethod}
            >
              <span className="material-icons">shopping_cart_checkout</span>
              {selectedPaymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Place Order'}
            </button>
            
            <button 
              className="back-to-cart-btn"
              onClick={() => navigate('/cart')}
            >
              <span className="material-icons">arrow_back</span>
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
