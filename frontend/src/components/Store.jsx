import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import '../styles/Store.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Sample product data (replace with API call later)
  useEffect(() => {
    const sampleProducts = [
      {
        id: 1,
        name: "Monstera Deliciosa",
        category: "indoor",
        price: 29.99,
        image: "🌿",
        description: "Beautiful Swiss cheese plant with distinctive leaf holes",
        inStock: true,
        rating: 4.8
      },
      {
        id: 2,
        name: "Snake Plant",
        category: "indoor",
        price: 24.99,
        image: "🌱",
        description: "Low-maintenance plant perfect for beginners",
        inStock: true,
        rating: 4.6
      },
      {
        id: 3,
        name: "Succulent Collection",
        category: "succulents",
        price: 19.99,
        image: "🌵",
        description: "Set of 5 beautiful succulents in ceramic pots",
        inStock: true,
        rating: 4.9
      },
      {
        id: 4,
        name: "Peace Lily",
        category: "indoor",
        price: 34.99,
        image: "🌸",
        description: "Elegant flowering plant that purifies air",
        inStock: true,
        rating: 4.7
      },
      {
        id: 5,
        name: "Garden Tools Set",
        category: "accessories",
        price: 49.99,
        image: "🛠️",
        description: "Complete set of essential gardening tools",
        inStock: true,
        rating: 4.5
      },
      {
        id: 6,
        name: "Organic Fertilizer",
        category: "accessories",
        price: 14.99,
        image: "🌾",
        description: "Natural plant food for healthy growth",
        inStock: true,
        rating: 4.4
      }
    ];

    const sampleCategories = [
      { id: 'all', name: 'All Products', count: sampleProducts.length },
      { id: 'indoor', name: 'Indoor Plants', count: sampleProducts.filter(p => p.category === 'indoor').length },
      { id: 'succulents', name: 'Succulents', count: sampleProducts.filter(p => p.category === 'succulents').length },
      { id: 'accessories', name: 'Accessories', count: sampleProducts.filter(p => p.category === 'accessories').length }
    ];

    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
    setCategories(sampleCategories);
    setIsLoading(false);
  }, []);

  // Filter products by category and search
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', product);
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="store-container">
        <div className="loading">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="store-container">
      <Header />
      
      <main className="store-main">
        <div className="store-header">
          <h1>🌿 Plant Store</h1>
          <p>Discover beautiful plants and gardening essentials</p>
        </div>

        {/* Search and Filters */}
        <div className="store-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search plants, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </main>
    </div>
  );
};

export default Store;

