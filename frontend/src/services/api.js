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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh the token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch('http://localhost:8000/plant_store/api/token/refresh/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken })
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('token', refreshData.access_token);
            
            // Retry the original request with new token
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${refreshData.access_token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
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

// Suggestions API calls
export const suggestionAPI = {
  list: async () => {
    const response = await api.get('/suggestions/');
    return response.data;
  },
  create: async (content) => {
    const response = await api.post('/suggestions/', { content });
    return response.data;
  }
};

export default api;


