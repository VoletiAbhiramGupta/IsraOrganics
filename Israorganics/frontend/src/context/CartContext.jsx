import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) { setCartItems([]); return; }
    try {
      const { data } = await api.get('/cart');
      setCartItems(data);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { product_id: productId, quantity });
    await fetchCart();
  };

  const updateItem = async (itemId, quantity) => {
    await api.put(`/cart/${itemId}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateItem, removeItem, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
