import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/plant_store/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    return response.data;
  },

  // User logout
  logout: async () => {
    const response = await api.post('/logout/');
    return response.data;
  },
};

// Product API calls
export const productAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  // Get all products
  getProducts: async (filters = {}) => {
    const response = await api.get('/products/', { params: filters });
    return response.data;
  },

  // Get single product
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  },
};

// Cart API calls
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/cart/');
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await api.patch(`/cart/items/${itemId}/`, { quantity });
    return response.data;
  },
};

// Order API calls
export const orderAPI = {
  // Get user's orders
  getOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders/create/', orderData);
    return response.data;
  },

  // Get order details
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/`);
    return response.data;
  },
};

export default api;


