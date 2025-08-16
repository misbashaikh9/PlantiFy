import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import '../styles/Store.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample product data
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
      },
      {
        id: 7,
        name: "Fiddle Leaf Fig",
        category: "indoor",
        price: 39.99,
        image: "🌳",
        description: "Stunning large-leaf plant for statement decor",
        inStock: true,
        rating: 4.9
      },
      {
        id: 8,
        name: "Cactus Mix",
        category: "succulents",
        price: 22.99,
        image: "🌵",
        description: "Collection of 3 unique cactus varieties",
        inStock: true,
        rating: 4.7
      },
      {
        id: 9,
        name: "Pothos Golden",
        category: "indoor",
        price: 18.99,
        image: "🌿",
        description: "Trailing vine plant perfect for hanging baskets",
        inStock: true,
        rating: 4.6
      },
      {
        id: 10,
        name: "Aloe Vera",
        category: "succulents",
        price: 16.99,
        image: "🌱",
        description: "Medicinal plant with soothing gel properties",
        inStock: true,
        rating: 4.8
      },
      {
        id: 11,
        name: "ZZ Plant",
        category: "indoor",
        price: 32.99,
        image: "🌿",
        description: "Ultra-low maintenance plant for any space",
        inStock: true,
        rating: 4.7
      },
      {
        id: 12,
        name: "Plant Mister",
        category: "accessories",
        price: 12.99,
        image: "💧",
        description: "Fine mist sprayer for tropical plants",
        inStock: true,
        rating: 4.5
      }
    ];

    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  // Filter products
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
    console.log('Added to cart:', product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="store-page">
      <Header />
      
      <main className="store-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>🌿 Plant Store</h1>
            <p>Discover beautiful plants and gardening essentials for your home</p>
            <div style={{ marginTop: '20px', fontSize: '1rem', opacity: 0.8 }}>
              Scroll Position: {scrollPosition}px
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
              style={{ 
                marginTop: '15px', 
                padding: '10px 20px', 
                background: 'white', 
                color: '#4CAF50', 
                border: 'none', 
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Test Scroll Down
            </button>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="filter-section">
          <div className="filter-container">
            <div className="search-container">
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
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </button>
              <button
                className={`category-btn ${selectedCategory === 'indoor' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('indoor')}
              >
                Indoor Plants
              </button>
              <button
                className={`category-btn ${selectedCategory === 'succulents' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('succulents')}
              >
                Succulents
              </button>
              <button
                className={`category-btn ${selectedCategory === 'accessories' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('accessories')}
              >
                Accessories
              </button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="products-section">
          <div className="products-container">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
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
        </section>

        {/* Footer */}
        <footer className="store-footer">
          <div className="footer-content">
            <p>&copy; 2024 PlantiFy. All rights reserved.</p>
            <p>Showing {filteredProducts.length} of {products.length} products</p>
          </div>
        </footer>

        {/* Test section to force scrolling */}
        <div className="scroll-test">
          <div>Scroll Test Section</div>
        </div>
      </main>
    </div>
  );
};

export default Store;

