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

  // Brand Name in bold uppercase centered font (LifeStyle Collection style)
  const brandName = product.series.includes('Edifice')
    ? 'CASIO EDIFICE'
    : product.series.includes('G-Shock')
    ? 'CASIO G-SHOCK'
    : product.series.includes('Vintage')
    ? 'CASIO VINTAGE'
    : product.series.includes('ProTrek')
    ? 'CASIO PROTREK'
    : 'CASIO';

  const discountPercent = product.originalPricePKR && product.originalPricePKR > product.pricePKR
    ? Math.round(((product.originalPricePKR - product.pricePKR) / product.originalPricePKR) * 100)
    : null;

  return (
    <article
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col justify-between h-full bg-white border-0 outline-none p-0 cursor-pointer select-none transition-transform duration-300"
      style={{
        background: 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none'
      }}
    >
      {/* Top Floating Discount Tag (Tiny clean floating tag on top-left of image without heavy box) */}
      {discountPercent && (
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-rose-700 bg-rose-50/90 px-1.5 py-0.5 rounded-none">
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

      {/* 1. Pure Floating Watch Image: 100% width, zero padding, zero card border, zero grey frame */}
      <div 
        className="relative w-full aspect-square flex items-center justify-center overflow-hidden"
        style={{
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0
        }}
      >
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={`${product.model} - ${product.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-0 transition-transform duration-500 ease-out group-hover:scale-105"
            style={{
              background: 'transparent',
              mixBlendMode: 'multiply'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-0 bg-transparent">
            <WatchDialRenderer product={product} className="w-full h-full max-h-[220px]" />
          </div>
        )}
      </div>

      {/* 2. Exact LifeStyle Collection Typography & Centered Pricing (Zero Divider Lines, Zero Boxes) */}
      <div className="pt-3 pb-1 space-y-1 text-center w-full">
        {/* Brand Name: Bold dark font, uppercase, centered */}
        <p className="text-[12px] sm:text-[13px] font-bold text-neutral-950 uppercase tracking-wider">
          {brandName}
        </p>

        {/* Product Title: Muted grey text directly under brand name, max 2 lines */}
        <h3 className="text-[11px] sm:text-xs text-neutral-500 font-normal line-clamp-2 px-1 leading-relaxed">
          {product.name}
        </h3>

        {/* Price Layout: Strikethrough reddish-brown price + Final Price in bold black below it */}
        <div className="pt-1.5 flex flex-col items-center justify-center font-sans">
          {product.originalPricePKR && (
            <span className="text-[11px] sm:text-xs text-[#b91c1c] line-through font-medium">
              {formatPKR(product.originalPricePKR)}
            </span>
          )}
          <span className="text-xs sm:text-[14px] font-bold text-neutral-950">
            {formatPKR(product.pricePKR)} <span className="text-[10px] font-normal text-neutral-500">inc. GST</span>
          </span>
        </div>
      </div>
    </article>
  );
};
