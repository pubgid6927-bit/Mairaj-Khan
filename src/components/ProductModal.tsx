import React, { useState } from 'react';
import { WatchProduct } from '../types';
import { useCart, formatPKR } from '../context/CartContext';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  MessageCircle, 
  Heart,
  Plus, 
  Minus,
  Clock,
  Sparkles
} from 'lucide-react';
import { WatchDialRenderer } from './WatchDialRenderer';

interface ProductModalProps {
  product: WatchProduct;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum New Madina Electronics! I want to order this watch:\n\n*Model:* ${product.model}\n*Name:* ${product.name}\n*Price:* ${formatPKR(product.pricePKR)}\n*Quantity:* ${quantity}\n\nPlease confirm availability and delivery from Paradise Centre Saddar Karachi.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop dismissal */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card - Mobile Bottom Sheet to Desktop Modal */}
      <div className="relative bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-2xl max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden shadow-2xl z-10 flex flex-col text-slate-800 animate-in slide-in-from-bottom-4 duration-300">
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-slate-400 hover:text-slate-900 bg-white/90 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shadow-2xs cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Pure White Image Showcase */}
          <div className="bg-slate-50 p-4 sm:p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-square w-full max-w-[260px] sm:max-w-sm flex items-center justify-center">
              {!imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.model}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <WatchDialRenderer product={product} className="w-full h-full max-h-[220px] sm:max-h-[260px]" />
                </div>
              )}
            </div>

            {/* Authenticity Guarantee Callout */}
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl w-full flex items-center gap-2.5 sm:gap-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
              <div className="text-[11px] sm:text-xs">
                <p className="font-bold text-slate-900">100% Genuine Casio Timepiece</p>
                <p className="text-slate-500">Official 1-Year Warranty stamped by New Madina Electronics</p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Specifications */}
          <div className="p-4 sm:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Category & Series & Wishlist Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-800">
                  <span className="font-bold uppercase tracking-wider">{product.series}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 font-semibold">{product.gender}</span>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 sm:p-2.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-125 ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-2xs scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-white'
                  }`}
                  aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
                  title={isFavorited ? 'Saved in wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                </button>
              </div>

              {/* Title & Model */}
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h2>
                <p className="font-mono text-xs text-slate-700 font-bold tracking-wider mt-1">
                  Model Ref: <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">{product.model}</span>
                </p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                    {formatPKR(product.pricePKR)}
                  </div>
                  {product.originalPricePKR && (
                    <div className="font-mono text-xs text-slate-400 line-through tabular-nums">
                      {formatPKR(product.originalPricePKR)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="font-mono font-bold text-slate-900">{product.rating}</span>
                  <span className="text-slate-500 text-[11px]">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-slate-900">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Case Diameter</span>
                    <span className="text-slate-900 font-semibold">{product.specs.caseDiameter}</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Water Resistance</span>
                    <span className="text-emerald-700 font-semibold">{product.specs.waterResistance}</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Glass Type</span>
                    <span className="text-slate-900 font-semibold">{product.specs.glassType}</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Band Material</span>
                    <span className="text-slate-900 font-semibold">{product.specs.bandMaterial}</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                    <span className="text-slate-500 block text-[10px]">Movement & Module</span>
                    <span className="text-slate-900 font-semibold">{product.specs.movement}</span>
                  </div>
                </div>
              </div>

              {/* Quality & Dispatch Notes */}
              <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>100% Genuine Casio Module</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Saddar Karachi Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile & Desktop Action Bar */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-5 space-y-2 shrink-0 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg p-0.5 text-xs sm:text-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 cursor-pointer active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold px-2 sm:px-3 text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 cursor-pointer active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2.5 sm:py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Add to Bag · {formatPKR(product.pricePKR * quantity)}</span>
            </button>
          </div>

          {/* Direct WhatsApp Order Button */}
          <a
            href={`https://wa.me/923213979883?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="truncate">Instant Order via WhatsApp (+92 321 3979883)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
