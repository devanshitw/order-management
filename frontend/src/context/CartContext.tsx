import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Cart } from '../types';
import { cartApi } from '../api/cart.api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (menuItemId: string, quantity: number) => Promise<void>;
  updateItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = async (menuItemId: string, quantity: number) => {
    setLoading(true);
    try {
      const data = await cartApi.addItem({ menu_item_id: menuItemId, quantity });
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (cartItemId: string, quantity: number) => {
    setLoading(true);
    try {
      const data = await cartApi.updateItem(cartItemId, { quantity });
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: string) => {
    setLoading(true);
    try {
      const data = await cartApi.removeItem(cartItemId);
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const data = await cartApi.clearCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.item_count || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
