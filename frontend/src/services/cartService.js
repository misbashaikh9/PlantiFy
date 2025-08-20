// Cart Service - Handle all cart-related operations with database only
class CartService {
  constructor() {
    this.cart = [];
    this.loadCartFromDatabase();
  }

  // Load cart from database
  async loadCartFromDatabase() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, cannot load cart');
        return;
      }

      const response = await fetch('http://localhost:8000/plant_store/api/cart/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        console.log('Cart data from database:', cartData); // Debug log
        console.log('Cart items:', cartData.items); // Debug log
        console.log('Cart ID:', cartData.id); // Debug log
        this.cart = cartData.items || [];
        // Notify other components about cart change
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        console.error('Failed to load cart from database');
        this.cart = [];
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
      this.cart = [];
    }
  }

  // Add product to cart
  async addToCart(product) {
    try {
      console.log('Adding product to cart:', product); // Debug log
      
      // Add to backend database first
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Please login to add items to cart' };
      }

      const response = await fetch('http://localhost:8000/plant_store/api/cart/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      });

      if (response.ok) {
        // Reload cart from database
        await this.loadCartFromDatabase();
        console.log('Product added to cart successfully');
        return { success: true, message: `${product.name} added to cart!` };
      } else {
        console.error('Failed to add product to cart');
        return { success: false, message: 'Failed to add to cart. Please try again.' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add to cart. Please try again.' };
    }
  }

  // Remove product from cart
  async removeFromCart(productId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Please login to manage cart' };
      }

      // Remove from backend database
      const response = await fetch(`http://localhost:8000/plant_store/api/cart/items/${productId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Reload cart from database
        await this.loadCartFromDatabase();
        return { success: true, message: 'Product removed from cart!' };
      } else {
        console.error('Failed to remove product from cart');
        return { success: false, message: 'Failed to remove from cart.' };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove from cart.' };
    }
  }

  // Update product quantity
  async updateQuantity(productId, quantity) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Please login to manage cart' };
      }

      if (quantity <= 0) {
        return await this.removeFromCart(productId);
      }

      // Update quantity in backend database
      const response = await fetch(`http://localhost:8000/plant_store/api/cart/items/${productId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: quantity })
      });

      if (response.ok) {
        // Reload cart from database
        await this.loadCartFromDatabase();
        return { success: true };
      } else {
        console.error('Failed to update quantity');
        return { success: false, message: 'Failed to update quantity.' };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: 'Failed to update quantity.' };
    }
  }

  // Get cart items
  getCartItems() {
    return this.cart;
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce((total, item) => {
      // Use total_price from database if available, otherwise calculate from product price
      if (item.total_price) {
        return total + item.total_price;
      } else if (item.product?.price) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  }

  // Get cart count from database
  async getCartCount() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return 0;
      }

      const response = await fetch('http://localhost:8000/plant_store/api/cart/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        return cartData.items ? cartData.items.reduce((count, item) => count + item.quantity, 0) : 0;
      } else {
        console.error('Failed to get cart count from database');
        return 0;
      }
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  // Get cart count from local cache (for immediate UI updates)
  getCartCountFromCache() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  async clearCart() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Please login to manage cart' };
      }

      // Clear cart in backend database
      const response = await fetch('http://localhost:8000/plant_store/api/cart/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.cart = [];
        // Notify other components about cart change
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true, message: 'Cart cleared successfully!' };
      } else {
        console.error('Failed to clear cart in database');
        return { success: false, message: 'Failed to clear cart.' };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Failed to clear cart.' };
    }
  }

  // Checkout process (placeholder for future implementation)
  async checkout() {
    try {
      // Here you can add:
      // - Payment processing
      // - Order creation
      // - Inventory updates
      // - Email confirmations
      
      // For now, just clear the cart
      const result = this.clearCart();
      if (result.success) {
        return { success: true, message: 'Order placed successfully! Check your email for confirmation.' };
      }
      return result;
    } catch (error) {
      console.error('Error during checkout:', error);
      return { success: false, message: 'Checkout failed. Please try again.' };
    }
  }

  // Get cart summary for display
  getCartSummary() {
    return {
      items: this.cart,
      count: this.getCartCount(),
      total: this.getCartTotal(),
      isEmpty: this.cart.length === 0
    };
  }

  // Sync existing cart with backend database
  async syncExistingCart() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping existing cart sync');
        return;
      }

      // Only sync if there are items in localStorage
      if (this.cart.length > 0) {
        console.log('Syncing existing cart items with backend...');
        await this.syncCartWithBackend();
      }
    } catch (error) {
      console.error('Error syncing existing cart:', error);
    }
  }

  // Sync cart with backend database
  async syncCartWithBackend() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping backend sync');
        return;
      }

      const response = await fetch('http://localhost:8000/plant_store/api/cart/sync/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_items: this.cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        console.log('Cart synced with backend successfully');
      } else {
        console.error('Failed to sync cart with backend');
      }
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  }

  // Debug method to check cart status
  debugCart() {
    console.log('=== CART DEBUG INFO ===');
    console.log('Cart items:', this.cart);
    console.log('Cart count:', this.getCartCount());
    console.log('Cart total:', this.getCartTotal());
    console.log('LocalStorage cart:', localStorage.getItem('plantify-cart'));
    console.log('========================');
  }
}

// Export singleton instance
export const cartService = new CartService();

// Export individual methods for convenience
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartItems,
  getCartTotal,
  getCartCount,
  clearCart,
  checkout,
  getCartSummary
} = cartService;
