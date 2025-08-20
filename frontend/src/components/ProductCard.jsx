import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import Swal from 'sweetalert2';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    id, name, price, sale_price, image, category, stock_quantity, sku, care_level, plant_type, light_requirements, water_needs, description
  } = product;

  const inStock = stock_quantity > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    
    try {
      cartService.addToCart(product);
      Swal.fire({
        title: 'Added to Cart!',
        text: `${name} has been added to your cart.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add item to cart. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    
    try {
      cartService.addToCart(product);
      navigate('/checkout');
    } catch (error) {
      console.error('Error with buy now:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to process buy now. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {image.startsWith('/media/') ? (
          <img 
            src={`http://localhost:8000${image}`} 
            alt={name} 
            className="product-image"
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              e.target.src = 'http://localhost:8000/media/Indoor Plants/SnakePlant.jpeg';
            }}
          />
        ) : (
          <span className="plant-emoji">{image}</span>
        )}
        
        {sale_price && sale_price < price && (
          <div className="sale-badge">
            {Math.round(((price - sale_price) / price) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        
        <div className="product-details">
          <div className="product-meta">
            <span className="care-level">Care: {care_level}</span>
            <span className="plant-type">Type: {plant_type}</span>
          </div>
          <div className="stock-info">
            <span className="stock-quantity">Stock: {stock_quantity}</span>
            <span className="sku">SKU: {sku}</span>
          </div>
        </div>
        
        <div className="product-price">
          {sale_price ? (
            <>
              <span className="original-price">{formatPrice(price)}</span>
              <span className="sale-price">{formatPrice(sale_price)}</span>
            </>
          ) : (
            <span className="price">{formatPrice(price)}</span>
          )}
        </div>
        
        <div className="product-actions">
          <button
            className={`add-to-cart-btn ${!inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          <button
            className={`buy-now-btn ${!inStock ? 'disabled' : ''}`}
            onClick={handleBuyNow}
            disabled={!inStock}
          >
            {inStock ? 'Buy Now' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
