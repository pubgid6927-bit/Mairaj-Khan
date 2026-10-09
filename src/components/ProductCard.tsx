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
      className="group relative flex flex-col justify-between h-full bg-transparent border-none outline-none shadow-none p-2 sm:p-3 cursor-pointer select-none transition-transform duration-300"
      style={{ border: 'none', boxShadow: 'none' }}
    >
      {/* Top Floating Discount Tag (Tiny, Clean, Borderless) */}
      {discountPercent && (
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-rose-700 bg-rose-50/90 px-1.5 py-0.5 rounded-xs">
            -{discountPercent}%
          </span>
        </div>
      )}

      {/* Floating Wishlist Heart Icon (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-1 right-1 sm:top-2 sm:right-2 w-8 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer z-10 ${
          isFavorited
            ? 'text-rose-600 opacity-100'
            : 'text-neutral-400 hover:text-neutral-900 opacity-0 group-hover:opacity-100'
        }`}
        title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
        aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-rose-600 text-rose-600 scale-110' : ''}`} />
      </button>

      {/* 1. Pure Floating Watch Image on Transparent Background (Zero Card Border, Zero Gray Frame) */}
      <div className="relative aspect-square w-full bg-transparent flex items-center justify-center p-2 sm:p-4 mb-2 overflow-hidden">
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={`${product.model} - ${product.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <WatchDialRenderer product={product} className="w-full h-full max-h-[190px]" />
          </div>
        )}
      </div>

      {/* 2. Clean Minimalist Typography Below Image (No Divider Lines, No Gray Box Containers) */}
      <div className="pt-1 space-y-1 text-center sm:text-left">
        {/* Line 1: Brand / Category in small gray uppercase text */}
        <p className="text-[10px] sm:text-[11px] text-neutral-400 font-semibold tracking-[0.2em] uppercase truncate">
          {categoryTag}
        </p>

        {/* Line 2: Product Name & Model Code in clean dark font */}
        <h3 className="text-xs sm:text-[13px] text-neutral-900 font-bold group-hover:text-amber-900 transition-colors truncate leading-snug">
          <span>{product.model}</span>
          <span className="text-neutral-300 font-light mx-1">·</span>
          <span className="text-neutral-600 font-normal">{product.name}</span>
        </h3>

        {/* Line 3: Clean Price Tag (Active Price + Struck-through Original Price) */}
        <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-0.5 font-mono">
          <span className="font-bold text-neutral-950 text-xs sm:text-sm">
            {formatPKR(product.pricePKR)}
          </span>
          {product.originalPricePKR && (
            <span className="text-neutral-400 line-through text-[11px] sm:text-xs">
              {formatPKR(product.originalPricePKR)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
