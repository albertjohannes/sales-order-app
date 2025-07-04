import { CartItem, Item } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@warung_order_app_cart';

export const saveCartData = async (cart: CartItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart data:', error);
  }
};

export const getCartData = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cart data:', error);
    return [];
  }
};

export const clearCartData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart data:', error);
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await getCartData();
      setCart(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const addToCart = (item: Item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      let newCart: CartItem[];
      
      if (existingItem) {
        newCart = prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prevCart, { 
          ...item, 
          quantity: 1,
          imageUrl: item.imageUrl
        }];
      }
      
      saveCartData(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== itemId);
      saveCartData(newCart);
      return newCart;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(prevCart => {
      let newCart: CartItem[];
      
      if (quantity <= 0) {
        newCart = prevCart.filter(item => item.id !== itemId);
      } else {
        newCart = prevCart.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
      }
      
      saveCartData(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    clearCartData();
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (!isLoaded) {
    return (
      <CartContext.Provider value={{
        cart: [],
        addToCart: () => {},
        removeFromCart: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        getTotal: () => 0,
        getItemCount: () => 0,
      }}>
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}; 