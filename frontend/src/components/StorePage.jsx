import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ProductCard from './ProductCard';
import '../styles/StorePage.css';

const StorePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  // Sample product data - in real app, this would come from API
  const sampleProducts = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      category: "indoor",
      price: 29.99,
      originalPrice: 39.99,
      image: "🌿",
      description: "Large, beautiful split-leaf philodendron perfect for indoor spaces",
      rating: 4.8,
      reviews: 127,
      inStock: true,
      tags: ["popular", "low-maintenance"]
    },
    {
      id: 2,
      name: "Snake Plant",
      category: "indoor",
      price: 19.99,
      originalPrice: 24.99,
      image: "🌱",
      description: "Hardy snake plant that purifies air and requires minimal care",
      rating: 4.6,
      reviews: 89,
      inStock: true,
      tags: ["air-purifying", "beginner-friendly"]
    },
    {
      id: 3,
      name: "Peace Lily",
      category: "indoor",
      price: 24.99,
      originalPrice: 29.99,
      image: "🌸",
      description: "Elegant peace lily with white flowers and air-purifying properties",
      rating: 4.7,
      reviews: 156,
      inStock: true,
      tags: ["flowering", "air-purifying"]
    },
    {
      id: 4,
      name: "Succulent Collection",
      category: "succulents",
      price: 34.99,
      originalPrice: 44.99,
      image: "🌵",
      description: "Beautiful collection of 6 different succulent varieties",
      rating: 4.5,
      reviews: 203,
      inStock: true,
      tags: ["collection", "drought-tolerant"]
    },
    {
      id: 5,
      name: "Fiddle Leaf Fig",
      category: "indoor",
      price: 49.99,
      originalPrice: 59.99,
      image: "🌳",
      description: "Stunning fiddle leaf fig tree for statement indoor decor",
      rating: 4.9,
      reviews: 78,
      inStock: false,
      tags: ["statement-piece", "trendy"]
    },
    {
      id: 6,
      name: "Herb Garden Kit",
      category: "herbs",
      price: 39.99,
      originalPrice: 49.99,
      image: "🌿",
      description: "Complete herb growing kit with basil, mint, and rosemary",
      rating: 4.4,
      reviews: 92,
      inStock: true,
      tags: ["edible", "kit", "beginner-friendly"]
    },
    {
      id: 7,
      name: "Orchid Phalaenopsis",
      category: "flowering",
      price: 44.99,
      originalPrice: 54.99,
      image: "🌺",
      description: "Elegant white orchid perfect for gifts or home decoration",
      rating: 4.6,
      reviews: 134,
      inStock: true,
      tags: ["gift", "elegant", "flowering"]
    },
    {
      id: 8,
      name: "Plant Care Essentials",
      category: "accessories",
      price: 19.99,
      originalPrice: 24.99,
      image: "🪴",
      description: "Essential plant care kit with fertilizer, mister, and pruning shears",
      rating: 4.7,
      reviews: 167,
      inStock: true,
      tags: ["care-kit", "essentials"]
    }
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const categories = [
    { value: 'all', label: 'All Plants' },
    { value: 'indoor', label: 'Indoor Plants' },
    { value: 'succulents', label: 'Succulents' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'flowering', label: 'Flowering Plants' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  if (isLoading) {
    return (
      <div className="storepage-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="storepage-container">
      <Header />
      
      <main className="store-main">
        <div className="store-header">
          <h1>🌿 PlantiFy Store</h1>
          <p>Discover beautiful plants and everything you need to help them thrive</p>
        </div>

        <div className="store-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-section">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No plants found matching your criteria. Try adjusting your search or filters!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StorePage;

