import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCargo = localStorage.getItem("nebula_forge_cart");
      return savedCargo ? JSON.parse(savedCargo) : [];
    } catch {
      localStorage.removeItem("nebula_forge_cart");
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("nebula_forge_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevCart;

        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      if (product.stock <= 0) return prevCart;

      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId, newAmount) => {
    setCart((prevCart) => {
      if (newAmount <= 0) {
        return prevCart.filter((item) => item._id !== productId);
      }

      return prevCart.map((item) => {
        if (item._id !== productId) return item;

        const cappedAmount = Math.min(newAmount, item.stock ?? newAmount);

        return {
          ...item,
          quantity: cappedAmount,
        };
      });
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItemsCount,
      cartSubtotal,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItemsCount,
      cartSubtotal,
      isCartOpen,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}