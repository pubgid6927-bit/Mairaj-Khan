import React, { useState } from 'react';
import { WatchProduct } from '../types';
import { useCart, formatPKR } from '../context/CartContext';
import { Heart, ShoppingBag, ShieldCheck, Check, Star, Eye } from 'lucide-react';
import { WatchDialRenderer } from './WatchDialRenderer';

interface ProductCardProps {
  product: WatchProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInWishlist, toggleWishlist, setSelectedProduct, setIsCartOpen } = useCart();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const discountAmount = product.originalPricePKR ? product.originalPricePKR - product.pricePKR : 0;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white border border-slate-200 hover:border-slate-400 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-md"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2 sm:p-4 overflow-hidden border-b border-slate-100">
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={product.model}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <WatchDialRenderer product={product} className="w-full h-full max-h-[160px] sm:max-h-[190px]" />
          </div>
        )}

        {/* Top Left: Series Tag */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 pointer-events-none">
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-slate-900/90 text-white px-1.5 sm:px-2 py-0.5 rounded shadow-2xs">
            {product.series.replace('Casio ', '')}
          </span>
        </div>

        {/* Top Right: Wishlist Heart with Touch Target */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-2 min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer active:scale-125 z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 border border-rose-300 shadow-2xs scale-105'
              : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-200 shadow-2xs'
          }`}
          title={isFavorited ? 'Saved in wishlist' : 'Save to wishlist'}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isFavorited ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="hidden md:flex absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-white hover:bg-slate-900 text-slate-900 hover:text-white text-xs font-semibold rounded shadow-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-all items-center gap-1.5"
        >
          <Eye className="w-3 h-3 text-amber-600" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2.5 bg-white">
        <div className="space-y-1">
          {/* Model Ref + Warranty Tag */}
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
              {product.model}
            </span>
            <span className="hidden sm:flex text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 items-center gap-0.5 shrink-0">
              <ShieldCheck className="w-2.5 h-2.5" /> 1-Yr
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-medium text-slate-700 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Clean Specs Typography */}
          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate font-normal">
            <span>{product.specs.bandMaterial}</span>
            <span aria-hidden="true" className="mx-1 text-slate-300">·</span>
            <span>{product.specs.waterResistance.split(' ')[0]}</span>
          </div>

          {/* Star Rating on Desktop */}
          <div className="hidden sm:flex items-center gap-1 text-xs pt-0.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <span className="font-mono text-slate-800 font-bold text-[11px]">{product.rating}</span>
            <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div className="font-mono text-xs sm:text-base font-extrabold text-slate-900 tabular-nums truncate">
              {formatPKR(product.pricePKR)}
            </div>
            {product.originalPricePKR && (
              <div className="flex items-center gap-1 truncate">
                <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 line-through tabular-nums truncate">
                  {formatPKR(product.originalPricePKR)}
                </span>
                {discountAmount > 0 && (
                  <span className="hidden sm:inline text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                    Save {formatPKR(discountAmount)}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95 shadow-2xs ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            aria-label={`Add ${product.model} to shopping bag`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
