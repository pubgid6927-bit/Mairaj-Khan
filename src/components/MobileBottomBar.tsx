import React from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { Compass, SlidersHorizontal, MessageCircle, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { 
    cartItemsCount, 
    cartTotal, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen,
    activeSeries
  } = useCart();

  const handleScrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-2.5 font-sans"
      style={{ paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* 1. Explore / Catalog Tab */}
        <button
          onClick={handleScrollToCatalog}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-600 hover:text-neutral-950 active:scale-95 transition-transform cursor-pointer"
        >
          <Compass className="w-5 h-5 text-neutral-900" />
          <span className="text-[10px] font-semibold tracking-tight uppercase">Boutique</span>
        </button>

        {/* 2. Series / Filter Tab */}
        <button
          onClick={handleScrollToCatalog}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-600 hover:text-neutral-950 active:scale-95 transition-transform cursor-pointer"
        >
          <div className="relative">
            <SlidersHorizontal className="w-5 h-5 text-neutral-900" />
            {activeSeries !== 'All' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight uppercase truncate max-w-[60px]">
            {activeSeries === 'All' ? 'Series' : activeSeries.replace('Casio ', '')}
          </span>
        </button>

        {/* 3. WhatsApp Direct Chat Tab */}
        <a
          href="https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20New%20Madina%20Electronics!%20I%20am%20interested%20in%20genuine%20Casio%20watches."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1 text-emerald-600 hover:text-emerald-700 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-emerald-700">Chat</span>
        </a>

        {/* 4. Wishlist Saved Watches Tab */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-600 hover:text-neutral-950 active:scale-95 transition-transform cursor-pointer"
          aria-label="View saved watches"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-600 fill-rose-100' : 'text-neutral-800'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight uppercase">Saved</span>
        </button>

        {/* 5. Cart Shopping Bag Tab */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-900 active:scale-95 transition-transform cursor-pointer"
          aria-label="View shopping bag"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded bg-neutral-950 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
            </div>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-950 font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight font-mono">
            {cartItemsCount === 0 ? 'Bag' : formatPKR(cartTotal)}
          </span>
        </button>
      </div>
    </nav>
  );
};
