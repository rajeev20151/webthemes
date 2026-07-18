import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id || "guest";
  const cartKey = `cart_${userId}`;

  const [cart, setCart] = useState([]);

  //  Jab bhi userId change ho (login/logout/switch), uss user ka cart load karo
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(cartKey) || "[]");
      setCart(stored);
    } catch {
      setCart([]);
    }
  }, [cartKey]);

  //  Cart change hone pe sahi user ke key me save karo
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  const addToCart = (item) => {
    setCart((prev) => {
      if (prev.find((i) => i._id === item._id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setCart([]);
  const isInCart = (id) => cart.some((i) => i._id === id);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);