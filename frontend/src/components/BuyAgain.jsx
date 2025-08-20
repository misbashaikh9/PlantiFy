import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BuyAgain.css';

const BuyAgain = () => {
  const navigate = useNavigate();
  const [buyAgainItems, setBuyAgainItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading buy again items
    setTimeout(() => {
      setBuyAgainItems([
        {
          id: 1,
          name: 'Monstera Deliciosa',
          image: '🌱',
          price: 1299,
          lastOrdered: '2 weeks ago',
          orderCount: 3,
          category: 'Indoor Plants'
        },
        {
          id: 2,
          name: 'Snake Plant',
          image: '🌿',
          price: 899,
          lastOrdered: '1 month ago',
          orderCount: 2,
          category: 'Indoor Plants'
        },
        {
          id: 3,
          name: 'Peace Lily',
          image: '🌸',
          price: 799,
          lastOrdered: '3 weeks ago',
          orderCount: 1,
          category: 'Indoor Plants'
        },
        {
          id: 4,
          name: 'Pothos Golden',
          image: '🍃',
          price: 599,
          lastOrdered: '2 months ago',
          orderCount: 2,
          category: 'Indoor Plants'
        },
        {
          id: 5,
          name: 'ZZ Plant',
          image: '🌱',
          price: 999,
          lastOrdered: '1 month ago',
          orderCount: 1,
          category: 'Indoor Plants'
        },
        {
          id: 6,
          name: 'Lavender Plant',
          image: '💜',
          price: 449,
          lastOrdered: '3 months ago',
          orderCount: 1,
          category: 'Herbs & Edibles'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = (item) => {
    // Add to cart functionality
    console.log(`Adding ${item.name} to cart`);
    // Show success message
    alert(`${item.name} added to cart!`);
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="buy-again-page">
        <div className="buy-again-container">
          <div className="loading-message">Loading your previous orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="buy-again-page">
      <div className="buy-again-container">
        <div className="buy-again-header">
          <h1>🔄 Buy Again</h1>
          <p>Quick re-order from your previous purchases</p>
        </div>

        <div className="buy-again-stats">
          <div className="stat-item">
            <span className="stat-number">{buyAgainItems.length}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{buyAgainItems.reduce((sum, item) => sum + item.orderCount, 0)}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{buyAgainItems.length > 0 ? '₹' + buyAgainItems.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN') : '₹0'}</span>
            <span className="stat-label">Total Value</span>
          </div>
        </div>

        <div className="buy-again-content">
          <div className="buy-again-items">
            {buyAgainItems.map((item) => (
              <div key={item.id} className="buy-again-item">
                <div className="item-image">
                  <span className="item-emoji">{item.image}</span>
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-meta">
                    <span className="last-ordered">Last ordered: {item.lastOrdered}</span>
                    <span className="order-count">Ordered {item.orderCount} time{item.orderCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="item-price">{formatPrice(item.price)}</div>
                </div>
                
                <div className="item-actions">
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => navigate(`/store`)}
                    className="view-product-btn"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="buy-again-footer">
          <button 
            onClick={handleViewOrders}
            className="view-orders-btn"
          >
            📋 View All Orders
          </button>
          <button 
            onClick={() => navigate('/store')}
            className="continue-shopping-btn"
          >
            🛍️ Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyAgain;


