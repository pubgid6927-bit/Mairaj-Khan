import React, { useState } from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  ShieldCheck,
  MessageCircle,
  Clock,
  Compass
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { 
    cartItemsCount, 
    cartTotal, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen,
    searchQuery, 
    setSearchQuery,
    setActiveSeries
  } = useCart();

  const handleNavClick = (sectionId: string, seriesFilter?: string) => {
    if (seriesFilter) {
      setActiveSeries(seriesFilter);
    }
    setMobileMenuOpen(false);
    setIsSearchOpen(false);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Trust Notice Strip */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-100 truncate">
              Shop 141, Paradise Shopping Centre, Saddar, Karachi
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300 shrink-0 text-[10px]">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Original Japanese Movements
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              12:30 PM - 9:30 PM
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a 
              href="tel:+923213979883" 
              className="text-white hover:text-amber-400 transition-colors font-mono font-bold"
            >
              +92 321 3979883
            </a>
          </div>

          <div className="sm:hidden flex items-center gap-2 shrink-0">
            <a 
              href="tel:+923213979883" 
              className="text-amber-400 font-mono font-bold hover:underline"
            >
              0321-3979883
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Trigger + Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-1 text-slate-700 hover:text-slate-950 active:scale-95 transition-transform"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex flex-col group min-w-0"
          >
            <span 
              className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors uppercase truncate"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              New Madina Electronics
            </span>
            <span className="hidden sm:block text-[9px] font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
              Genuine Casio Timepieces · Saddar Karachi
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs lg:text-sm font-semibold text-slate-700">
          <button 
            onClick={() => handleNavClick('catalog-section', 'All')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            All Watches
          </button>
          <button 
            onClick={() => handleNavClick('catalog-section', 'Casio MTP')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Casio MTP
          </button>
          <button 
            onClick={() => handleNavClick('catalog-section', 'Casio LTP')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Casio LTP
          </button>
          <button 
            onClick={() => handleNavClick('catalog-section', 'Casio Edifice')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Edifice
          </button>
          <button 
            onClick={() => handleNavClick('catalog-section', 'Casio G-Shock')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            G-Shock
          </button>
          <button 
            onClick={() => handleNavClick('catalog-section', 'Casio Vintage')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Vintage
          </button>
          <button 
            onClick={() => handleNavClick('store-location')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Saddar Store
          </button>
          <button 
            onClick={() => handleNavClick('warranty-section')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Warranty
          </button>
        </nav>

        {/* Right: Primary Action Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Search Toggle / Input */}
          <div className="relative">
            {/* Desktop expanded input */}
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 w-44 md:w-56 lg:w-64 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
              <input 
                type="text"
                placeholder="Search Casio models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-700 p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Mobile search icon trigger */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-slate-700 hover:text-slate-950 active:scale-95 transition-transform rounded-md"
              title="Search watches"
              aria-label="Search watches"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Heart Button */}
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-slate-700 hover:text-rose-600 active:scale-95 transition-transform rounded-md cursor-pointer"
            title="Saved Watches (Wishlist)"
            aria-label="View Saved Watches"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-600 fill-rose-100' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-rose-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            aria-label="Open Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-mono text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="font-mono text-xs font-bold tracking-tight">
              {cartItemsCount === 0 ? 'Bag' : formatPKR(cartTotal)}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dedicated Full-Width Search Input (When Search Toggled) */}
      {isSearchOpen && (
        <div className="sm:hidden px-3 py-2 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-1 fade-in">
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
            <input 
              type="text"
              placeholder="Search by model e.g. MTP-1302, GA-2100, A168..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 p-1 mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="text-xs text-slate-600 font-semibold px-2 py-0.5 ml-1 border-l border-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 fade-in">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Browse Casio Collections
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button 
                onClick={() => handleNavClick('catalog-section', 'All')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-white flex items-center justify-between"
              >
                <span>All Watches</span>
              </button>
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio MTP')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                Casio MTP (Men)
              </button>
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio LTP')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                Casio LTP (Ladies)
              </button>
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio Edifice')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                Casio Edifice
              </button>
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio G-Shock')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                Casio G-Shock
              </button>
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio Vintage')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                Casio Vintage
              </button>
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio ProTrek')}
                className="text-left px-3 py-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                Casio ProTrek
              </button>
              <button 
                onClick={() => handleNavClick('warranty-section')}
                className="text-left px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1-Year Warranty</span>
              </button>
            </div>
          </div>

          {/* Quick Direct Actions */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
            <a 
              href="tel:+923213979883"
              className="p-2.5 rounded-lg bg-slate-100 text-slate-900 font-bold flex flex-col items-center gap-1 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-700" />
              <span>Call Store</span>
            </a>
            <a 
              href="https://wa.me/923213979883"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex flex-col items-center gap-1 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
            <a 
              href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-amber-50 text-amber-900 font-bold flex flex-col items-center gap-1 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>Directions</span>
            </a>
          </div>

          <div className="text-[11px] text-slate-500 text-center pt-1 font-medium">
            Shop 141, 1st Floor, Paradise Shopping Centre, Saddar, Karachi
          </div>
        </div>
      )}
    </header>
  );
};
