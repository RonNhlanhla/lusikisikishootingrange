'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the base cart item type
export interface BaseCartItem {
  id: string; // Unique identifier (registrationId for course, productId for product)
  name: string;
  price: number;
  description?: string;
  quantity: number; // Added quantity
}

// Define specific types extending the base
export interface CartCourseItem extends BaseCartItem {
  type: 'course';
  userIdentifier: string; // Specific metadata for courses
  date?: string; // ISO date string
}

export interface CartProductItem extends BaseCartItem {
  type: 'product';
  // Add any product-specific metadata here, e.g.:
  // vendor?: string;
}

// Union type for items in the cart
export type CartItem = CartCourseItem | CartProductItem;

// Define the cart context type
interface CartContextType {
  items: CartItem[]; // Use generic CartItem
  addItem: (item: CartItem) => void; // Use generic CartItem
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number; // Represents number of unique items, not total quantity
  itemCount: number; // Total count of items in the cart
}

// Create the cart context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => { },
  removeItem: () => { },
  updateQuantity: () => { },
  clearCart: () => { },
  getTotalPrice: () => 0,
  getItemCount: () => 0,
  itemCount: 0,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart items from localStorage if available
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          return [];
        }
      }
    }
    return [];
  });

  // Load cart from localStorage on component mount (backup for hydration mismatch)
  useEffect(() => {
    // This effect is still useful to sync if localStorage changes in another tab
    // or to handle hydration mismatches if necessary
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedItems: CartItem[] = JSON.parse(savedCart);
        // Only update if different to avoid loops, or trust the initial state
        // For now, we can leave this as a safety check or remove if initial state is enough
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add an item to the cart
  const addItem = (item: CartItem) => { // Use CartItem
    // Check if the item is already in the cart by id
    const itemExists = items.some((existingItem) => existingItem.id === item.id);

    if (!itemExists) {
      // Ensure quantity is at least 1 if not provided
      const newItem = { ...item, quantity: item.quantity || 1 };
      setItems((prevItems) => [...prevItems, newItem]);
    } else {
      // Optional: Implement quantity update logic here if needed
      console.log(`Item ${item.id} already in cart. Quantity not updated.`);
      // Example quantity update:
      // setItems(prevItems =>
      //   prevItems.map(existingItem =>
      //     existingItem.id === item.id
      //       ? { ...existingItem, quantity: existingItem.quantity + (item.quantity || 1) }
      //       : existingItem
      //   )
      // );
    }
  };

  // Remove an item from the cart
  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Update the quantity of an item; removes the item if quantity drops to 0
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  // Calculate the total price of items in the cart
  const getTotalPrice = () => {
    // Sum price * quantity for all items
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get the number of unique items in the cart
  const getItemCount = () => {
    return items.length;
    // Or, to get total quantity of all items:
    // return items.reduce((count, item) => count + item.quantity, 0);
  };

  // Calculate total items in cart (sum of quantities)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Provide the cart context to children components
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
