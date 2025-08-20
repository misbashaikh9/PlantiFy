import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart data on mount
  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = () => {
    const summary = cartService.getCartSummary();
    setCartItems(summary.items);
    setCartCount(summary.count);
    setCartTotal(summary.total);
  };

  const addToCart = async (product) => {
    setIsLoading(true);
    try {
      const result = cartService.addToCart(product);
      if (result.success) {
        loadCartData();
        return result;
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to add to cart.' };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setIsLoading(true);
    try {
      const result = cartService.removeFromCart(productId);
      if (result.success) {
        loadCartData();
        return result;
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to remove from cart.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setIsLoading(true);
    try {
      const result = cartService.updateQuantity(productId, quantity);
      if (result.success) {
        loadCartData();
        return result;
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to update quantity.' };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const result = cartService.clearCart();
      if (result.success) {
        loadCartData();
        return result;
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to clear cart.' };
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = async () => {
    setIsLoading(true);
    try {
      const result = await cartService.checkout();
      if (result.success) {
        loadCartData();
        return result;
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Checkout failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    isEmpty: cartItems.length === 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
