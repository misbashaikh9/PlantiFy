import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Fetch real orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your orders');
          setIsLoading(false);
          return;
        }

        console.log('Fetching orders from API...');
        console.log('Token:', token ? 'Present' : 'Missing');
        
        const response = await fetch('http://localhost:8000/plant_store/api/orders/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response status:', response.status);
        console.log('API Response headers:', response.headers);
        
        // Test if the API endpoint is accessible
        if (response.status === 404) {
          console.error('API endpoint not found. Check if the backend is running and the URL is correct.');
        } else if (response.status === 401) {
          console.error('Unauthorized. Check if the token is valid.');
        } else if (response.status === 500) {
          console.error('Server error. Check backend logs.');
        }

        if (response.ok) {
          const data = await response.json();
          console.log('Raw API Response:', data);
          
          // Ensure data is an array, if not, check for common response structures
          let ordersData = [];
          if (Array.isArray(data)) {
            ordersData = data;
          } else if (data.results && Array.isArray(data.results)) {
            // Handle paginated response
            ordersData = data.results;
          } else if (data.orders && Array.isArray(data.orders)) {
            // Handle nested orders structure
            ordersData = data.orders;
          } else if (data.data && Array.isArray(data.data)) {
            // Handle data wrapper
            ordersData = data.data;
          } else {
            console.log('API Response structure:', data);
            setOrders([]);
            setError('Invalid orders data format received');
            return;
          }
          
          console.log('Processed orders data:', ordersData);
          
          // Check if ordersData is empty or has unexpected structure
          if (ordersData.length === 0) {
            console.log('No orders found in the response');
          } else {
            console.log('First order structure:', ordersData[0]);
            console.log('First order status:', ordersData[0].status);
            console.log('First order status type:', typeof ordersData[0].status);
            if (ordersData[0].items) {
              console.log('First order items:', ordersData[0].items);
            }
          }
          
          setOrders(ordersData);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error Response:', errorData);
          setError(`Failed to load orders: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error loading orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'shipped':
        return '#2196F3';
      case 'processing':
        return '#FF9800';
      case 'pending':
        return '#9E9E9E';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'processing':
        return '⚙️';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  // Calculate estimated delivery date from order date (for order receipt)
  const calculateDeliveryDate = (orderDate) => {
    const orderCreatedDate = new Date(orderDate);
    
    // Add 4 business days from ORDER date (excluding weekends)
    let businessDays = 0;
    let currentDate = new Date(orderCreatedDate);
    
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

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowReceiptModal(true);
  };

  // Function to get product image path based on name and category
  const getProductImage = (productName, categoryName) => {
    // Map product names to image filenames based on actual folder structure
    const imageMap = {
      // Indoor Plants
      'Monstera Deliciosa': 'http://localhost:8000/media/Indoor Plants/MonsteraDeliciosa.jpeg',
      'Snake Plant': 'http://localhost:8000/media/Indoor Plants/SnakePlant.jpeg',
      'Peace Lily': 'http://localhost:8000/media/Indoor Plants/PeaceLily.jpeg',
      'ZZ Plant': 'http://localhost:8000/media/Indoor Plants/ZZPlant.jpeg',
      'Pothos Golden': 'http://localhost:8000/media/Indoor Plants/PothosGolden.png',
      'Philodendron Brasil': 'http://localhost:8000/media/Indoor Plants/PhilodendronBrasil.jpg',
      'Chinese Evergreen': 'http://localhost:8000/media/Indoor Plants/ChineseEvergreen.jpg',
      'Dracaena Marginata': 'http://localhost:8000/media/Indoor Plants/DracaenaMarginata.jpg',
      'Spider Plant': 'http://localhost:8000/media/Indoor Plants/SpiderPlant.jpg',
      
      // Herbs & Edibles
      'Fresh Herb Garden Kit': 'http://localhost:8000/media/Herbs&Edibles/FreshHerbGardenKit.jpeg',
      'Dwarf Tomato Plant': 'http://localhost:8000/media/Herbs&Edibles/DwarfTomatoPlant.jpg',
      'Basil Plant': 'http://localhost:8000/media/Herbs&Edibles/BasilPlant.jpeg',
      'Mint Plant': 'http://localhost:8000/media/Herbs&Edibles/MintPlant.jpg',
      'Rosemary Plant': 'http://localhost:8000/media/Herbs&Edibles/RosemaryPlant.jpg',
      'Lavender Plant': 'http://localhost:8000/media/Herbs&Edibles/LavenderPlant.jpg',
      
      // Seeds
      'Carrot Seeds': 'http://localhost:8000/media/Seeds/Carrot Seeds.jpg',
      'Bell Pepper Seeds': 'http://localhost:8000/media/Seeds/BellPapperSeed.jpg',
      'Cucumber Seeds': 'http://localhost:8000/media/Seeds/CucumberSeeds.jpg',
      'Spinach Seeds': 'http://localhost:8000/media/Seeds/Spinach Seeds',
      'Radish Seeds': 'http://localhost:8000/media/Seeds/RadishSeeds.jpg',
      'Green Bean Seeds': 'http://localhost:8000/media/Seeds/GreenBeanSeeds.jpg',
      
      // Fertilizers
      'NPK Balanced Fertilizer': 'http://localhost:8000/media/Fertilizers/NPKBalancedFertilizer.jpeg',
      'Organic Fish Emulsion': 'http://localhost:8000/media/Fertilizers/OrganicFishEmulsion.jpg',
      'Liquid Seaweed Extract': 'http://localhost:8000/media/Fertilizers/LiquidSeaweedExtract.jpeg',
      'Slow-Release Granules': 'http://localhost:8000/media/Fertilizers/Slow-ReleaseGranules.jpeg',
      'Micronutrient Mix': 'http://localhost:8000/media/Fertilizers/Micronutrient Mix.jpeg',
      'Compost Tea Concentrate': 'http://localhost:8000/media/Fertilizers/CompostTeaConcentrate.jpeg'
    };
    
    // Try to find exact match first
    if (imageMap[productName]) {
      return imageMap[productName];
    }
    
    // Try to find partial matches
    const partialMatch = Object.keys(imageMap).find(key => 
      productName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(productName.toLowerCase())
    );
    
    if (partialMatch) {
      return imageMap[partialMatch];
    }
    
    // Return default image
    return 'http://localhost:8000/media/Indoor Plants/default-plant.jpg';
  };

  if (isLoading) {
    return (
      <div className="orders-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <Header />
        <div className="error-container">
          <h2>❌ Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Header />
      
      <div className="orders-container">
        <div className="orders-header">
          <h1>📋 My Orders</h1>
          <p>Track your plant orders and their delivery status</p>
        </div>

        {!Array.isArray(orders) || orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">🌱</div>
            <h2>No Orders Yet</h2>
            <p>Start shopping to see your orders here!</p>
            {!Array.isArray(orders) && (
              <div className="orders-error">
                <p>⚠️ There was an issue loading your orders. Please try again.</p>
                <button onClick={() => window.location.reload()} className="btn btn-secondary">
                  Refresh Page
                </button>
              </div>
            )}
            <button onClick={handleContinueShopping} className="btn btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, orderIndex) => {
              console.log(`Order ${orderIndex}:`, order);
              return (
                <div key={order.id || orderIndex} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.order_number || order.id || 'N/A'}</h3>
                      <p className="order-date">{formatDate(order.created_at || order.order_date || new Date())}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status || 'pending') }}
                      >
                        {getStatusIcon(order.status || 'pending')} {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {Array.isArray(order.items) ? order.items.map((item, index) => {
                      console.log(`Item ${index}:`, item);
                      return (
                                                                          <div key={index} className="order-item">
                           <div className="item-image">
                             <img 
                               src={item.image || item.product_image || getProductImage(item.name || item.product_name, item.category || 'Indoor Plants')} 
                               alt={item.name || item.product_name || 'Product'} 
                               onError={(e) => {
                                 console.log('Image failed to load:', e.target.src);
                                 e.target.src = 'http://localhost:8000/media/Indoor Plants/default-plant.jpg';
                                 e.target.onerror = null;
                               }}
                               onLoad={() => {
                                 console.log('Image loaded successfully:', item.name || item.product_name);
                               }}
                             />
                           </div>
                           <div className="item-details">
                             <span className="item-name">{item.name || item.product_name || 'Unknown Product'}</span>
                             <span className="item-quantity">x{item.quantity || 1}</span>
                             <span className="item-price">₹{item.price || item.unit_price || 'N/A'}</span>
                           </div>
                         </div>
                      );
                    }) : (
                                               <div className="order-item">
                           <div className="item-image">
                             <img src="http://localhost:8000/media/Indoor Plants/default-plant.jpg" alt="Default Product" />
                           </div>
                        <div className="item-details">
                          <span className="item-name">Order details not available</span>
                          <span className="item-quantity">x1</span>
                          <span className="item-price">₹N/A</span>
                        </div>
                      </div>
                    )}
                  </div>

                                                        <div className="order-footer">
                     <div className="order-actions">
                       <button 
                         onClick={() => handleOrderDetails(order)}
                         className="btn btn-outline"
                       >
                         View Details
                       </button>
                     </div>
                     
                     <div className="order-total">
                       <span className="total-label">Total:</span>
                       <span className="total-amount">₹{order.total_amount || order.total || 'N/A'}</span>
                     </div>
                   </div>

                  <div className="order-shipping">
                    <p><strong>Shipping to:</strong> {order.shipping_address || order.address || 'Address not available'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="orders-footer">
          <button onClick={handleContinueShopping} className="btn btn-secondary">
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedOrder && (
        <div className="receipt-modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <h2>📋 Order Receipt</h2>
              <button 
                className="close-btn"
                onClick={() => setShowReceiptModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="receipt-content">
              {/* Company Header */}
              <div className="company-header">
                <h1>🌱 PlantiFy</h1>
                <p>Your Green Companion</p>
                <p>www.plantify.com</p>
              </div>

              {/* Order Information */}
              <div className="order-info-section">
                <div className="order-details">
                  <div className="detail-row">
                    <span className="label">Order Number:</span>
                    <span className="value">#{selectedOrder.order_number || selectedOrder.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Order Date:</span>
                    <span className="value">{formatDate(selectedOrder.created_at || selectedOrder.order_date || new Date())}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value status-value">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedOrder.status || 'pending') }}
                      >
                        {getStatusIcon(selectedOrder.status || 'pending')} {(selectedOrder.status || 'pending').charAt(0).toUpperCase() + (selectedOrder.status || 'pending').slice(1)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="customer-section">
                <h3>Customer Information</h3>
                <div className="customer-details">
                  <p><strong>Shipping Address:</strong></p>
                  <p>{selectedOrder.shipping_address || selectedOrder.address || 'Address not available'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="items-section">
                <h3>Order Items</h3>
                <div className="items-table">
                  <div className="table-header">
                    <span className="item-col">Item</span>
                    <span className="qty-col">Qty</span>
                    <span className="price-col">Price</span>
                    <span className="total-col">Total</span>
                  </div>
                  {Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item, index) => (
                    <div key={index} className="table-row">
                      <div className="item-col">
                        <div className="item-info">
                          <img 
                            src={item.image || item.product_image || getProductImage(item.name || item.product_name, item.category || 'Indoor Plants')} 
                            alt={item.name || item.product_name || 'Product'}
                            className="item-thumbnail"
                          />
                          <span className="item-name">{item.name || item.product_name || 'Unknown Product'}</span>
                        </div>
                      </div>
                      <span className="qty-col">{item.quantity || 1}</span>
                      <span className="price-col">₹{item.price || item.unit_price || 'N/A'}</span>
                      <span className="total-col">₹{((item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  )) : (
                    <div className="table-row">
                      <div className="item-col">
                        <span className="item-name">Order details not available</span>
                      </div>
                      <span className="qty-col">1</span>
                      <span className="price-col">₹N/A</span>
                      <span className="total-col">₹N/A</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="summary-section">
                <div className="summary-row">
                  <span className="label">Subtotal:</span>
                  <span className="value">₹{selectedOrder.total_amount || selectedOrder.total || 'N/A'}</span>
                </div>
                <div className="summary-row">
                  <span className="label">GST (8%):</span>
                  <span className="value">₹{((selectedOrder.total_amount || selectedOrder.total || 0) * 0.08).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Shipping:</span>
                  <span className="value">₹0.00</span>
                </div>
                <div className="summary-row total-row">
                  <span className="label">Total Amount:</span>
                  <span className="value">₹{((selectedOrder.total_amount || selectedOrder.total || 0) * 1.08).toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="delivery-section">
                <h3>Delivery Information</h3>
                <div className="delivery-details">
                  <div className="delivery-row">
                    <span className="label">Order Date:</span>
                    <span className="value">{formatDate(selectedOrder.created_at || selectedOrder.order_date || new Date())}</span>
                  </div>
                  <div className="delivery-row">
                    <span className="label">Estimated Delivery:</span>
                    <span className="value delivery-date-highlight">{calculateDeliveryDate(selectedOrder.created_at || selectedOrder.order_date || new Date())}</span>
                  </div>
                  <div className="delivery-row">
                    <span className="label">Delivery Time:</span>
                    <span className="value">3-5 business days (excluding weekends)</span>
                  </div>
                  <div className="delivery-row">
                    <span className="label">Current Status:</span>
                    <span className="value">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedOrder.status || 'pending') }}
                      >
                        {getStatusIcon(selectedOrder.status || 'pending')} {(selectedOrder.status || 'pending').charAt(0).toUpperCase() + (selectedOrder.status || 'pending').slice(1)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="payment-section">
                <h3>Payment Information</h3>
                <div className="payment-details">
                  <p><strong>Payment Method:</strong> {selectedOrder.payment_method || 'Cash on Delivery'}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className="payment-status">Paid</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="receipt-footer">
                <p>Thank you for choosing PlantiFy! 🌱</p>
                <p>For any questions, contact us at support@plantify.com</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="receipt-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowReceiptModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

