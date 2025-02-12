import { useState, useEffect } from 'react';

// Create a custom event for wishlist updates
const WISHLIST_UPDATE = 'wishlist-update';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const items = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistItems(items);
      } catch (error) {
        console.error('Failed to parse wishlist:', error);
      }
    };

    // Listen for wishlist updates from other components
    window.addEventListener(WISHLIST_UPDATE, handleStorageChange);
    return () => window.removeEventListener(WISHLIST_UPDATE, handleStorageChange);
  }, []);

  const updateWishlist = (newItems) => {
    localStorage.setItem('wishlist', JSON.stringify(newItems));
    setWishlistItems(newItems);
    // Notify other components about the update
    window.dispatchEvent(new Event(WISHLIST_UPDATE));
  };

  const addToWishlist = (product) => {
    const updatedWishlist = [...wishlistItems, product];
    updateWishlist(updatedWishlist);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter((item) => item._id !== productId);
    updateWishlist(updatedWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
