import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCargo = localStorage.getItem("nebula_forge_cart");
    return savedCargo ? JSON.parse(savedCargo) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    localStorage.setItem("nebula_forge_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
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

      return [...prevCart, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId, newAmount) {
    if (newAmount <= 0) return removeFromCart(productId);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: newAmount } : item,
      ),
    );
  }

  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const totalItemsCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value = {
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
