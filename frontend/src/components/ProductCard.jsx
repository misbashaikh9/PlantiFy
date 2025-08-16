import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, image, description, inStock, rating } = product;

  const handleAddToCart = () => {
    if (inStock) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">{image}</span>
        {!inStock && <div className="out-of-stock">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        
        <div className="product-rating">
          <span className="stars">
            {'⭐'.repeat(Math.floor(rating))}
            {rating % 1 !== 0 && '⭐'}
          </span>
          <span className="rating-number">({rating})</span>
        </div>
        
        <div className="product-price">
          <span className="price">${price}</span>
        </div>
        
        <button
          className={`add-to-cart-btn ${!inStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          {inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
