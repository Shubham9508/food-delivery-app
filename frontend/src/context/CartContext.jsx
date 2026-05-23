import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load cart: either from database (if authenticated) or local storage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (user) {
        try {
          const res = await API.get('/cart');
          setCart(res.data.data.items);
        } catch (err) {
          console.error('Failed to load cart from DB, loading from localStorage', err);
          loadLocalCart();
        }
      } else {
        loadLocalCart();
      }
      setLoading(false);
    };

    loadCart();
  }, [user]);

  const loadLocalCart = () => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      try {
        setCart(JSON.parse(localCart));
      } catch (err) {
        console.error('Invalid cart format in localStorage');
        setCart([]);
      }
    } else {
      setCart([]);
    }
  };

  // Sync cart to local storage (only if user is not logged in)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (food, quantity = 1) => {
    if (user) {
      try {
        const res = await API.post('/cart/add', { foodId: food._id, quantity });
        setCart(res.data.data.items);
        toast.success(`${food.name} added to cart!`);
      } catch (err) {
        console.error('Cart add error:', err);
        toast.error(err.response?.data?.message || 'Failed to add item to cart.');
      }
    } else {
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex((item) => item.food._id === food._id);
        const updatedCart = [...prevCart];
        if (itemIndex > -1) {
          updatedCart[itemIndex].quantity += quantity;
        } else {
          updatedCart.push({ food, quantity });
        }
        return updatedCart;
      });
      toast.success(`${food.name} added to cart!`);
    }
  };

  const removeFromCart = async (foodId, removeAll = false) => {
    const targetItem = cart.find((item) => item.food._id === foodId);
    if (!targetItem) return;

    if (user) {
      try {
        const res = await API.post('/cart/remove', { foodId, removeAll });
        setCart(res.data.data.items);
        if (removeAll || targetItem.quantity <= 1) {
          toast.success(`${targetItem.food.name} removed from cart.`);
        } else {
          toast.success(`Decremented ${targetItem.food.name} quantity.`);
        }
      } catch (err) {
        console.error('Cart remove error:', err);
        toast.error(err.response?.data?.message || 'Failed to remove item.');
      }
    } else {
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex((item) => item.food._id === foodId);
        if (itemIndex === -1) return prevCart;

        const updatedCart = [...prevCart];
        if (removeAll || updatedCart[itemIndex].quantity <= 1) {
          updatedCart.splice(itemIndex, 1);
          toast.success(`${targetItem.food.name} removed from cart.`);
        } else {
          updatedCart[itemIndex].quantity -= 1;
          toast.success(`Decremented ${targetItem.food.name} quantity.`);
        }
        return updatedCart;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const res = await API.post('/cart/clear');
        setCart(res.data.data.items);
      } catch (err) {
        toast.error('Failed to clear cart.');
      }
    } else {
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + (item.food ? item.food.price * item.quantity : 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
