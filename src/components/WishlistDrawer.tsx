import React from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist, 
    addToCart, 
    setSelectedProduct,
    setIsCartOpen
  } = useCart();

  if (!isWishlistOpen) return null;

  const wishlistProducts = ALL_PRODUCTS.filter((product) =>
    wishlist.includes(product.id)
  );

  const handleProductClick = (product: typeof ALL_PRODUCTS[0]) => {
    setSelectedProduct(product);
    setIsWishlistOpen(false);
  };

  const handleMoveToCart = (product: typeof ALL_PRODUCTS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/70 backdrop-blur-xs transition-opacity font-sans">
      <div className="fixed inset-0" onClick={() => setIsWishlistOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between text-neutral-900 animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
              <h3 
                className="font-bold text-sm tracking-wider uppercase text-neutral-950 font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Saved Wishlist ({wishlist.length})
              </h3>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {wishlistProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                  Your Wishlist is Empty
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Click the heart icon on any Casio timepiece to save it for later comparison.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 bg-neutral-950 text-white font-bold tracking-wider uppercase rounded text-xs cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  Explore Watches
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="p-3.5 bg-white border border-neutral-200 rounded flex gap-3 relative group hover:border-neutral-950 transition-colors cursor-pointer"
                >
                  <div className="w-20 h-20 bg-[#fbfbfa] border border-neutral-100 rounded p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.model}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono text-xs font-bold text-neutral-950 truncate">
                          {product.model}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 truncate">
                        {product.name}
                      </p>
                      <p className="font-mono text-xs font-black text-neutral-950 mt-1">
                        {formatPKR(product.pricePKR)}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={(e) => handleMoveToCart(product, e)}
                        className="w-full py-1.5 px-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <ShoppingBag className="w-3 h-3 text-amber-300" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Callout */}
          <div className="p-4 border-t border-neutral-200 bg-[#fbfbfa] text-center text-[11px] text-neutral-500">
            <span>Official 1-Year Stamped Warranty on All Models · Saddar Karachi</span>
          </div>

        </div>
      </div>
    </div>
  );
};
