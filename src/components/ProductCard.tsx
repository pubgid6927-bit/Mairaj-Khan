import React, { useState } from 'react';
import { WatchProduct } from '../types';
import { useCart, formatPKR } from '../context/CartContext';
import { Heart } from 'lucide-react';
import { WatchDialRenderer } from './WatchDialRenderer';

interface ProductCardProps {
  product: WatchProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist, setSelectedProduct } = useCart();
  const [imageError, setImageError] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Category display e.g. "CASIO EDIFICE", "CASIO GENERAL", "CASIO G-SHOCK"
  const categoryTag = product.series.includes('MTP') || product.series.includes('LTP') 
    ? 'CASIO GENERAL' 
    : product.series.toUpperCase();

  const discountPercent = product.originalPricePKR && product.originalPricePKR > product.pricePKR
    ? Math.round(((product.originalPricePKR - product.pricePKR) / product.originalPricePKR) * 100)
    : null;

  return (
    <article
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col justify-between h-full bg-white border border-neutral-200/80 hover:border-neutral-900 p-3 sm:p-5 transition-all duration-300 rounded-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] cursor-pointer select-none"
    >
      {/* Top Action / Discount Indicators */}
      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
        {discountPercent && (
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded-2xs">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Subtle Wishlist Heart Icon (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer z-10 ${
          isFavorited
            ? 'text-rose-600'
            : 'text-neutral-300 hover:text-neutral-900 opacity-0 group-hover:opacity-100'
        }`}
        title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
        aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isFavorited ? 'fill-rose-600 text-rose-600 scale-110 opacity-100' : ''}`} />
      </button>

      {/* 1. Pure White Centered Watch Image Stage with Equal Transparent Padding */}
      <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2 sm:p-5 mb-3 overflow-hidden">
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={`${product.model} - ${product.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.04)] group-hover:drop-shadow-[0_12px_20px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <WatchDialRenderer product={product} className="w-full h-full max-h-[180px]" />
          </div>
        )}
      </div>

      {/* 2. Clean 3-Line Luxury Hierarchy */}
      <div className="pt-2 border-t border-neutral-100 space-y-1 text-left">
        {/* Line 1: Soft gray text for sub-brand / category in uppercase */}
        <p className="text-[10px] sm:text-[11px] text-neutral-400 font-semibold tracking-[0.2em] uppercase truncate">
          {categoryTag}
        </p>

        {/* Line 2: Clear bold text for model code & name */}
        <h3 className="text-xs sm:text-sm text-neutral-900 font-bold group-hover:text-amber-900 transition-colors truncate">
          <span>{product.model}</span>
          <span className="text-neutral-300 font-light mx-1.5">·</span>
          <span className="text-neutral-700 font-medium">{product.name}</span>
        </h3>

        {/* Line 3: Clear bold price tag (Sale price + Original strikethrough) */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono font-bold text-neutral-950 text-xs sm:text-sm">
            {formatPKR(product.pricePKR)}
          </span>
          {product.originalPricePKR && (
            <span className="font-mono text-neutral-400 line-through text-[11px] sm:text-xs">
              {formatPKR(product.originalPricePKR)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
