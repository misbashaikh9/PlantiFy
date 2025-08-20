import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import Footer from './Footer';
import { cartService } from '../services/cartService';
import Swal from 'sweetalert2';
import '../styles/Store.css';
import { useNavigate } from 'react-router-dom'; // Added for navigation

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch products from Django API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/plant_store/api/products/');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Transform the data to match our frontend structure
        const transformedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category.name, // Fix: API returns product.category.name, not product.category_name
          price: product.price,
          sale_price: product.sale_price,
          image: getProductImage(product.name, product.category.name), // Fix: Use product.category.name
          description: product.description,
          inStock: product.stock_quantity > 0,
          rating: 4.5, // Default rating for now
          stock_quantity: product.stock_quantity,
          plant_type: product.plant_type,
          care_level: product.care_level,
          light_requirements: product.light_requirements,
          water_needs: product.water_needs,
          sku: product.sku
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
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
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

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
    
    return imageMap[productName] || '/media/Indoor Plants/default-plant.jpg';
  };

  // Generate search suggestions
  const generateSearchSuggestions = (query) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = new Set();
    const lowerQuery = query.toLowerCase();

    // Add category suggestions
    const categories = ['Indoor Plants', 'Herbs & Edibles', 'Seeds', 'Fertilizers'];
    categories.forEach(category => {
      if (category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(category);
      }
    });

    // Add product name suggestions
    products.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.name);
      }
    });

    // Add common search terms
    const commonTerms = ['easy care', 'low light', 'bright light', 'tropical', 'succulent', 'organic', 'indoor', 'outdoor', 'beginner', 'advanced'];
    commonTerms.forEach(term => {
      if (term.toLowerCase().includes(lowerQuery)) {
        suggestions.add(term);
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 8)); // Limit to 8 suggestions
    setShowSuggestions(true);
  };

  // Simple cart handler with SweetAlert
  const handleAddToCart = (product) => {
    console.log('Store: handleAddToCart called with:', product); // Debug log
    
    const result = cartService.addToCart(product);
    console.log('Store: cartService result:', result); // Debug log
    
    if (result.success) {
      // Show success notification with new style
      Swal.fire({
        title: '🌱 Plant Added!',
        text: `${product.name} has been added to your cart`,
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
          // Navigate to cart
          window.location.href = '/cart';
        }
      });
      
      // Force cart count update in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Debug cart status
      cartService.debugCart();
    } else {
      // Show error notification with new style
      Swal.fire({
        title: '❌ Oops!',
        text: result.message,
        icon: 'error',
        background: '#fff5f5',
        color: '#dc3545',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#dc3545',
        timer: 3000,
        timerProgressBar: true,
        toast: false,
        position: 'center'
      });
    }
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
            <div className="hero-actions">
              <button 
                className="hero-btn orders-btn"
                onClick={() => navigate('/orders')}
              >
                <span>📋 My Orders</span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="filter-section">
          <div className="filter-container">
                <div className="search-bar">
                  <input 
                    type="text" 
                    placeholder="Search plants..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      generateSearchSuggestions(e.target.value);
                    }}
                    onFocus={() => {
                      if (searchQuery.trim()) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking on them
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                  />
                  <span className="search-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 5.806 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="search-suggestions">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

            <div className="category-filters">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <div className="category-icon">
                  <img src="http://localhost:8000/media/Indoor Plants/MonsteraDeliciosa.jpeg" alt="All Products" />
                </div>
                <span className="category-label">All</span>
              </button>
              
              <button
                className={`category-btn ${selectedCategory === 'Indoor Plants' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Indoor Plants')}
              >
                <div className="category-icon">
                  <img src="http://localhost:8000/media/Indoor Plants/SnakePlant.jpeg" alt="Indoor Plants" />
                </div>
                <span className="category-label">Indoor</span>
              </button>
              
              <button
                className={`category-btn ${selectedCategory === 'Herbs & Edibles' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Herbs & Edibles')}
              >
                <div className="category-icon">
                  <img src="http://localhost:8000/media/Herbs&Edibles/MintPlant.jpg" alt="Herbs & Edibles" />
                </div>
                <span className="category-label">Herbs</span>
              </button>
              
              <button
                className={`category-btn ${selectedCategory === 'Seeds' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Seeds')}
              >
                <div className="category-icon">
                  <img src="http://localhost:8000/media/Seeds/BellPapperSeed.jpg" alt="Seeds" />
                </div>
                <span className="category-label">Seeds</span>
              </button>
              
              <button
                className={`category-btn ${selectedCategory === 'Fertilizers' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Fertilizers')}
              >
                <div className="category-icon">
                  <img src="http://localhost:8000/media/Fertilizers/OrganicFishEmulsion.jpg" alt="Fertilizers" />
                </div>
                <span className="category-label">Fertilizers</span>
              </button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="products-section">
          <div className="products-container">
            {loading ? (
              <div className="loading-message">Loading products...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : filteredProducts.length > 0 ? (
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
        <Footer />
      </main>
    </div>
  );
};

export default Store;

