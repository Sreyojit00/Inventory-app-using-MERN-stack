import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useShoppingCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

        // Update product quantity
      updateQuantity: (productId, quantityChange) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item._id === productId
              ? { ...item, quantity: Math.max(quantityChange, 1) } // Ensure quantity is not below 1
              : item
          );

          // Save the updated cart to localStorage
          const userId = localStorage.getItem("userId");
          if (userId) {
            localStorage.setItem(`shopping-cart-${userId}`, JSON.stringify(updatedCart));
          }
          return { cart: updatedCart };
        });
      },

      // Remove product from cart
      removeFromCart: (productId) =>{
        set((state) => {
          const updatedCart = state.cart.filter((item) => item._id !== productId);
          
          // Save the updated cart to localStorage
          const userId = localStorage.getItem("userId");
          if (userId) {
            localStorage.setItem(`shopping-cart-${userId}`, JSON.stringify(updatedCart));
          }
          return { cart: updatedCart };
        });
      },

      initializeCart: (userId) => {
        // Attempt to fetch the cart from localStorage or API
        const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        set({ cart: storedCart });
      },
      addToCart: (product, userId) => {
        set((state) => {
          const updatedCart = [...state.cart, { ...product, quantity: 1}];
          localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart)); // Save to localStorage
          return { cart: updatedCart };
        });
      },

      // Clear cart (to be called on user sign-out)
      clearCart: () => {
        set(() => ({
          cart: [],
        }));
        const userId = localStorage.getItem("userId");
        if (userId) {
          localStorage.removeItem(`shopping-cart-${userId}`); // Remove cart data for specific user
        }
      },
    }),
    {
      name: "shopping-cart", // This will still handle the persistence middleware logic
      getStorage: () => localStorage, // Using localStorage to persist
    }
  )
);
