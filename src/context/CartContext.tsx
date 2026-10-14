import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WatchProduct, CartItem, Order } from '../types';
import { fetchProductsFromSupabase } from '../lib/supabase';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface CartContextType {
  // Live Supabase Products Catalog (Exclusively from Supabase 'products' table)
  products: WatchProduct[];
  setProducts: React.Dispatch<React.SetStateAction<WatchProduct[]>>;
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<WatchProduct[]>;

  // Cart
  cart: CartItem[];
  addToCart: (product: WatchProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Modals & Navigation
  selectedProduct: WatchProduct | null;
  setSelectedProduct: (product: WatchProduct | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  completedOrder: Order | null;
  setCompletedOrder: (order: Order | null) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSeries: string;
  setActiveSeries: (series: string) => void;

  // Notification Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'new_madina_electronics_cart_v1';
const WISHLIST_STORAGE_KEY = 'new_madina_electronics_wishlist_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live products exclusively fetched from Supabase (Zero mock fallbacks)
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeries, setActiveSeries] = useState('All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Refresh products from Supabase
  const refreshProducts = useCallback(async (): Promise<WatchProduct[]> => {
    setIsLoadingProducts(true);
    try {
      const liveData = await fetchProductsFromSupabase();
      setProducts(liveData);
      return liveData;
    } catch (err) {
      console.error('Failed to fetch live products from Supabase:', err);
      setProducts([]);
      return [];
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: WatchProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast(`Added ${product.model} to your shopping cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from shopping cart.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast('Item removed from your wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Saved to your wishlist! Click heart icon to view saved watches.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.pricePKR * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        products,
        setProducts,
        isLoadingProducts,
        refreshProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        completedOrder,
        setCompletedOrder,
        searchQuery,
        setSearchQuery,
        activeSeries,
        setActiveSeries,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const formatPKR = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
};
