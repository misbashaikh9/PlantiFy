import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { cartService } from '../services/cartService';
import Swal from 'sweetalert2';
import '../styles/Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      // Load cart data from database
      await cartService.loadCartFromDatabase();
      const summary = cartService.getCartSummary();
      
      console.log('Cart summary:', summary); // Debug log
      console.log('Cart items:', summary.items); // Debug log
      
      setCartItems(summary.items);
      
      // Calculate total from items if summary.total is not available
      const calculatedTotal = summary.total || summary.items?.reduce((total, item) => total + (item.total_price || 0), 0) || 0;
      setCartTotal(calculatedTotal);
      
      console.log('Calculated total:', calculatedTotal); // Debug log
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart data:', error);
      setLoading(false);
    }
  };



  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      const result = await cartService.updateQuantity(productId, newQuantity);
      if (result.success) {
        loadCartData();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    }
  };

  const removeFromCart = async (productId) => {
    const result = await cartService.removeFromCart(productId);
    if (result.success) {
      loadCartData();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Show success notification with same style as Add to Cart
      Swal.fire({
        title: '🗑️ Item Removed!',
        text: 'Product has been removed from your cart',
        icon: 'success',
        background: '#f8f9fa',
        color: '#2c3e50',
        confirmButtonText: 'Continue Shopping',
        confirmButtonColor: '#4CAF50',
        showCancelButton: true,
        cancelButtonText: 'View Cart',
        cancelButtonColor: '#6c757d',
        timer: 4000,
        timerProgressBar: true,
        toast: false,
        position: 'center',
        customClass: {
          popup: 'cart-notification-popup',
          title: 'cart-notification-title',
          confirmButton: 'cart-notification-btn'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Continue shopping - do nothing
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Stay on cart page - do nothing
        }
      });
    }
  };

  const clearCart = async () => {
    const result = await Swal.fire({
      title: '🧹 Clear Cart?',
      text: 'Are you sure you want to remove all items?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Clear All',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    });
    
    if (result.isConfirmed) {
      const clearResult = await cartService.clearCart();
      if (clearResult.success) {
        loadCartData();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        Swal.fire({
          title: '✅ Cart Cleared!',
          text: 'All items removed from cart',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  const checkout = async () => {
    if (cartItems.length === 0) {
      Swal.fire({
        title: '🛒 Empty Cart',
        text: 'Add some products before checkout',
        icon: 'info'
      });
      return;
    }

    const result = await cartService.checkout();
    if (result.success) {
      loadCartData();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      Swal.fire({
        title: '🎉 Order Placed!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Continue Shopping',
        confirmButtonColor: '#4CAF50'
      }).then(() => {
        window.location.href = '/store';
      });
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate estimated delivery date from today (for cart preview)
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
    console.log('🔍 Looking for image for:', productName, 'in category:', categoryName);
    
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
      'Bell Pepper Seeds': '/media/Seeds/BellPapperSeed.jpg',
      'Carrot Seeds': '/media/Seeds/Carrot Seeds.jpg',
      'Cucumber Seeds': '/media/Seeds/CucumberSeeds.jpg',
      'Green Bean Seeds': '/media/Seeds/GreenBeanSeeds.jpg',
      'Radish Seeds': '/media/Seeds/RadishSeeds.jpg',
      'Spinach Seeds': '/media/Seeds/Spinach Seeds',
      
      // Fertilizers
      'NPK Balanced Fertilizer': '/media/Fertilizers/NPKBalancedFertilizer.jpeg',
      'Organic Fish Emulsion': '/media/Fertilizers/OrganicFishEmulsion.jpg',
      'Compost Tea Concentrate': '/media/Fertilizers/CompostTeaConcentrate.jpeg',
      'Liquid Seaweed Extract': '/media/Fertilizers/LiquidSeaweedExtract.jpeg',
      'Micronutrient Mix': '/media/Fertilizers/Micronutrient Mix.jpeg',
      'Slow-Release Granules': '/media/Fertilizers/Slow-ReleaseGranules.jpeg'
    };
    
    const result = imageMap[productName];
    console.log('🎯 Image mapping result:', result);
    return result;
  };



  if (loading) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-main">
          <div className="loading-message">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-main">
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any plants yet!</p>
              <button 
                onClick={() => window.location.href = '/store'}
                className="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-content">
                <div className="cart-items">
                  {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        {console.log('Item product data:', item.product)} {/* Debug log */}
                        {(() => {
                          const productName = item.product?.name || item.product_name;
                          const mappedImage = getProductImage(productName);
                          console.log('Product name:', productName, 'Mapped image:', mappedImage);
                          
                          if (mappedImage) {
                            return (
                              <img 
                                src={`http://localhost:8000${mappedImage}`} 
                                alt={productName || 'Plant'} 
                                className="item-img"
                                onError={(e) => {
                                  console.log('Image failed to load:', e.target.src);
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline';
                                }}
                              />
                            );
                          }
                          return null;
                        })()}
                        <span className="item-emoji" style={{display: getProductImage(item.product?.name || item.product_name) ? 'none' : 'inline'}}>🌱</span>
                      </div>
                      
                      <div className="item-details">
                        <h3 className="item-name">{item.product_name || item.product?.name || 'Plant'}</h3>
                        <p className="item-category">{item.product?.category?.name || 'Plant'}</p>
                        <div className="item-price">
                          <span className="price">{formatPrice(item.product?.price || 0)}</span>
                        </div>
                      </div>
                      
                      <div className="item-quantity">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="item-total">
                        {formatPrice(item.total_price || 0)}
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  )) : (
                    <div className="empty-cart-message">
                      <p>No items in cart</p>
                    </div>
                  )}
                </div>
                
                <div className="cart-summary">
                  <h3>Order Summary</h3>
                  

                  
                  {/* Individual Items List */}
                  <div className="summary-items">
                    {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
                      <div key={item.id} className="summary-item">
                        <div className="summary-item-info">
                          <span className="summary-item-name">{item.product_name || item.product?.name || 'Plant'}</span>
                          <span className="summary-item-quantity">×{item.quantity}</span>
                        </div>
                        <span className="summary-item-price">
                          {formatPrice(item.total_price || 0)}
                        </span>
                      </div>
                    )) : (
                      <div className="summary-item">
                        <span>No items</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="summary-row">
                    <span>Items ({cartItems.length}):</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row gst-row">
                    <span>GST (8%):</span>
                    <span className="gst-amount">{formatPrice(cartTotal * 0.08)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatPrice(cartTotal * 1.08)}</span>
                  </div>
                  
                  {/* Delivery Date Estimate */}
                  <div className="delivery-estimate">
                    <div className="delivery-icon">📅</div>
                    <div className="delivery-info">
                      <span className="delivery-label">Estimated Delivery:</span>
                      <span className="delivery-date">{calculateDeliveryDate()}</span>
                    </div>
                  </div>
                  
                  <div className="cart-actions">
                    <button 
                      onClick={clearCart}
                      className="clear-cart-btn"
                    >
                      Clear Cart
                    </button>
                    <button 
                      onClick={() => navigate('/checkout')}
                      className="checkout-btn"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                  
                  <div className="cart-info">
                    <p>🌱 Free shipping on orders above ₹999</p>
                    <p>💰 8% GST will be added to your order</p>
                    <p>🧾 GST invoice will be provided with your order</p>
                    <p>🔒 Secure checkout with SSL encryption</p>
                    <p>📦 Fast delivery within 3-5 business days</p>
                  </div>
                </div>
              </div>
              
              <Footer />

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
