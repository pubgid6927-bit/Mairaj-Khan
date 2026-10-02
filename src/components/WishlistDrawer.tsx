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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="fixed inset-0" onClick={() => setIsWishlistOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-800">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <Heart className="w-4 h-4 fill-rose-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Your Saved Watches</h3>
              <span className="font-mono text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-semibold">
                {wishlist.length} {wishlist.length === 1 ? 'watch' : 'watches'}
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Wishlisted Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-900 text-base">Your wishlist is empty</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Click the heart icon on any Casio watch to save it here for later.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-3 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Casio Watches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group flex gap-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {/* Product Thumbnail */}
                  <div className="w-20 h-20 shrink-0 bg-white border border-slate-100 rounded-lg p-1.5 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {product.model}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          aria-label={`Remove ${product.model}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 truncate mt-0.5 font-medium">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium text-slate-700">{product.series}</span>
                        <span>·</span>
                        <span>{product.specs.bandMaterial}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {formatPKR(product.pricePKR)}
                      </span>

                      <button
                        onClick={(e) => handleMoveToCart(product, e)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3 text-amber-400" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 1-Year Official Warranty Included
                </span>
              </div>
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => addToCart(p, 1));
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add All Saved Watches to Bag ({wishlistProducts.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
