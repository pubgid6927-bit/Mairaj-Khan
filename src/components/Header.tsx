import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
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
  User,
  ChevronDown,
  Truck,
  Sparkles,
  ArrowRight,
  Package
} from 'lucide-react';
import { AccountModal } from './AccountModal';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Ticker announcement rotation
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerMessages = [
    'FREE EXPRESS SHIPPING ACROSS PAKISTAN ON ORDERS ABOVE RS. 15,000',
    '100% GENUINE CASIO TIMEPIECES WITH OFFICIAL 1-YEAR STAMPED WARRANTY',
    'VISIT OUR SADDAR KARACHI SHOWROOM · SHOP 141, PARADISE SHOPPING CENTRE',
    'EXPRESS CASH ON DELIVERY (COD) AVAILABLE NATIONWIDE · VERIFY BEFORE RECEIVING'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerMessages.length]);

  const { 
    cartItemsCount, 
    cartTotal, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen,
    searchQuery, 
    setSearchQuery,
    setActiveSeries,
    setSelectedProduct
  } = useCart();

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant Live Search Results (LifeStyle Collection Style)
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_PRODUCTS.filter((p) => 
      p.model.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.series.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleNavClick = (sectionId: string, seriesFilter?: string) => {
    if (seriesFilter) {
      setActiveSeries(seriesFilter);
    }
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsSearchFocused(false);
    setActiveDropdown(null);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 font-sans shadow-xs">
        {/* Top Scrolling Info / News Ticker Bar - LifeStyle Collection Exact Signature */}
        <div className="bg-[#111111] text-white text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-8 border-b border-white/10 tracking-[0.06em]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Center / Left: Rotating News Ticker */}
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
              <div className="overflow-hidden whitespace-nowrap">
                <span className="text-neutral-200 font-medium inline-block animate-in fade-in duration-500 key={tickerIndex}">
                  {tickerMessages[tickerIndex]}
                </span>
              </div>
            </div>

            {/* Right Quick Links */}
            <div className="hidden lg:flex items-center gap-5 text-neutral-300 shrink-0 text-[10px] pl-4">
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Package className="w-3 h-3 text-amber-400" />
                <span>Track Order</span>
              </button>
              <span className="text-neutral-700">|</span>
              <a
                href="#store-location"
                className="hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Saddar Store</span>
              </a>
              <span className="text-neutral-700">|</span>
              <a
                href="tel:+923213979883"
                className="hover:text-amber-300 transition-colors font-mono font-bold text-white flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span>+92 321 3979883</span>
              </a>
              <span className="text-neutral-700">|</span>
              <span className="font-mono text-amber-300 font-bold">PKR (Rs.)</span>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-22 flex items-center justify-between gap-2 sm:gap-6 w-full">
          {/* Left: Mobile Menu + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 text-neutral-900 hover:text-black active:scale-95 transition-transform shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center group min-w-0"
            >
              <span 
                className="text-sm sm:text-2xl lg:text-[26px] font-black tracking-tight text-neutral-950 group-hover:text-amber-800 transition-colors uppercase truncate font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                New Madina Electronics
              </span>
            </a>
          </div>

          {/* Center: Desktop Navigation Bar with LifeStyle Collection Mega Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] font-bold tracking-[0.12em] uppercase text-neutral-800 h-full">
            {/* 1. MEN */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('men')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio MTP')}
                className="hover:text-neutral-950 transition-colors flex items-center gap-1 py-2 cursor-pointer border-b-2 border-transparent hover:border-neutral-950"
              >
                <span>Men</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:rotate-180 transition-transform" />
              </button>

              {activeDropdown === 'men' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-neutral-200 shadow-xl rounded-b p-4 space-y-2 text-xs font-medium normal-case tracking-normal animate-in fade-in-50 duration-150 z-50">
                  <div className="font-bold text-[10px] tracking-widest uppercase text-neutral-400 pb-1 border-b border-neutral-100">
                    Men's Casio Timepieces
                  </div>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio MTP')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>Casio MTP Series (Dress Classics)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio Edifice')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>Edifice Chronographs (Motorsport)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio G-Shock')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>G-Shock Tough (200M Shockproof)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio ProTrek')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>ProTrek Solar (Outdoor Compass)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. WOMEN */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('women')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('catalog-section', 'Casio LTP')}
                className="hover:text-neutral-950 transition-colors flex items-center gap-1 py-2 cursor-pointer border-b-2 border-transparent hover:border-neutral-950"
              >
                <span>Women</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {activeDropdown === 'women' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-neutral-200 shadow-xl rounded-b p-4 space-y-2 text-xs font-medium normal-case tracking-normal animate-in fade-in-50 duration-150 z-50">
                  <div className="font-bold text-[10px] tracking-widest uppercase text-neutral-400 pb-1 border-b border-neutral-100">
                    Women's Casio Timepieces
                  </div>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio LTP')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>Casio LTP Elegance & Dress</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio Vintage')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>Vintage Rose Gold & Silver Mesh</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => handleNavClick('catalog-section', 'Casio LTP')}
                    className="w-full text-left p-1.5 hover:bg-neutral-50 hover:text-neutral-950 rounded flex justify-between"
                  >
                    <span>Leather Strap Petite Watches</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 3. BRANDS / COLLECTIONS */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('brands')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('catalog-section', 'All')}
                className="hover:text-neutral-950 transition-colors flex items-center gap-1 py-2 cursor-pointer border-b-2 border-transparent hover:border-neutral-950"
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {activeDropdown === 'brands' && (
                <div className="absolute top-full left-0 w-72 bg-white border border-neutral-200 shadow-xl rounded-b p-4 space-y-2 text-xs font-medium normal-case tracking-normal animate-in fade-in-50 duration-150 z-50">
                  <div className="font-bold text-[10px] tracking-widest uppercase text-neutral-400 pb-1 border-b border-neutral-100">
                    Featured Casio Lines
                  </div>
                  <button onClick={() => handleNavClick('catalog-section', 'Casio Edifice')} className="w-full text-left p-1.5 hover:bg-neutral-50 rounded flex justify-between">
                    <span>Edifice (Speed & Tech)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">100M WR</span>
                  </button>
                  <button onClick={() => handleNavClick('catalog-section', 'Casio G-Shock')} className="w-full text-left p-1.5 hover:bg-neutral-50 rounded flex justify-between">
                    <span>G-Shock (Absolute Toughness)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">200M WR</span>
                  </button>
                  <button onClick={() => handleNavClick('catalog-section', 'Casio Vintage')} className="w-full text-left p-1.5 hover:bg-neutral-50 rounded flex justify-between">
                    <span>Casio Vintage (1980s Retro Icons)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Digital</span>
                  </button>
                  <button onClick={() => handleNavClick('catalog-section', 'Casio MTP')} className="w-full text-left p-1.5 hover:bg-neutral-50 rounded flex justify-between">
                    <span>Casio MTP (Gentlemen Dress)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Quartz</span>
                  </button>
                  <button onClick={() => handleNavClick('catalog-section', 'Casio LTP')} className="w-full text-left p-1.5 hover:bg-neutral-50 rounded flex justify-between">
                    <span>Casio LTP (Ladies Fine Watch)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Dress</span>
                  </button>
                  <button onClick={() => handleNavClick('catalog-section', 'Casio ProTrek')} className="w-full text-left p-1.5 hover:bg-neutral-50 rounded flex justify-between">
                    <span>ProTrek (Triple Sensor Outdoor)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Solar</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. UNISEX */}
            <button 
              onClick={() => handleNavClick('catalog-section', 'Casio Vintage')}
              className="hover:text-neutral-950 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-neutral-950"
            >
              Unisex
            </button>

            {/* 5. BOUTIQUE SHOWROOM */}
            <button 
              onClick={() => handleNavClick('store-location')}
              className="hover:text-neutral-950 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-neutral-950"
            >
              Saddar Store
            </button>

            {/* 6. WARRANTY */}
            <button 
              onClick={() => handleNavClick('warranty-section')}
              className="hover:text-neutral-950 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-neutral-950"
            >
              Warranty
            </button>
          </nav>

          {/* Right: Search, Wishlist, Account, Shopping Bag */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Input Bar & Live Dropdown (Desktop) */}
            <div className="relative" ref={searchContainerRef}>
              <div className="hidden sm:flex items-center bg-neutral-100 hover:bg-neutral-100/90 border border-neutral-300 focus-within:border-neutral-900 focus-within:bg-white rounded px-3 py-2 w-44 md:w-56 lg:w-64 transition-all">
                <Search className="w-3.5 h-3.5 text-neutral-500 shrink-0 mr-2" />
                <input 
                  type="text"
                  placeholder="Search Casio model, series..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  className="w-full bg-transparent text-xs text-neutral-900 focus:outline-none placeholder:text-neutral-500 font-sans"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="text-neutral-400 hover:text-neutral-700 p-0.5 ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Desktop Live Search Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="hidden sm:block absolute top-full right-0 mt-2 w-80 md:w-96 bg-white shadow-2xl rounded border border-neutral-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-semibold uppercase tracking-wider">Results ({liveSearchResults.length})</span>
                    <button
                      onClick={() => setIsSearchFocused(false)}
                      className="text-neutral-400 hover:text-neutral-700 text-[10px] cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                    {liveSearchResults.slice(0, 6).map((item) => {
                      const brand = item.series.includes('Edifice')
                        ? 'CASIO EDIFICE'
                        : item.series.includes('G-Shock')
                        ? 'CASIO G-SHOCK'
                        : item.series.includes('Vintage')
                        ? 'CASIO VINTAGE'
                        : item.series.includes('ProTrek')
                        ? 'CASIO PROTREK'
                        : 'CASIO';

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedProduct(item);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
                        >
                          <div className="w-12 h-12 shrink-0 bg-transparent flex items-center justify-center overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.model} 
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                              style={{ mixBlendMode: 'multiply' }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                              {brand}
                            </p>
                            <p className="text-xs font-semibold text-neutral-900 truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.originalPricePKR && (
                                <span className="text-[10px] text-[#b91c1c] line-through">
                                  {formatPKR(item.originalPricePKR)}
                                </span>
                              )}
                              <span className="text-xs font-bold text-neutral-950">
                                {formatPKR(item.pricePKR)} <span className="text-[9px] font-normal text-neutral-400">inc. GST</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {liveSearchResults.length === 0 && (
                      <div className="p-6 text-center text-xs text-neutral-500">
                        No timepieces found matching "{searchQuery}"
                      </div>
                    )}
                  </div>

                  {liveSearchResults.length > 6 && (
                    <button
                      onClick={() => {
                        handleNavClick('catalog-section');
                        setIsSearchFocused(false);
                      }}
                      className="w-full py-2.5 px-4 bg-neutral-50 hover:bg-neutral-100 text-center text-xs font-semibold text-neutral-900 border-t border-neutral-100 transition-colors cursor-pointer block"
                    >
                      View all {liveSearchResults.length} timepieces →
                    </button>
                  )}
                </div>
              )}

              {/* Mobile Search Trigger */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="sm:hidden p-2 text-neutral-800 hover:text-neutral-950 active:scale-95 transition-transform"
                title="Search watches"
                aria-label="Search watches"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-neutral-800 hover:text-rose-600 active:scale-95 transition-transform cursor-pointer"
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

            {/* Account / Login Trigger */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="p-2 text-neutral-800 hover:text-neutral-950 active:scale-95 transition-transform cursor-pointer hidden sm:flex"
              title="Account / Track Order"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Cart Bag (LifeStyle Collection Style with Badge & Subtotal) */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-white font-medium rounded transition-all cursor-pointer shadow-sm"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-neutral-950 font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
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

        {/* Mobile Full-Width Search Input & Live Results */}
        {isSearchOpen && (
          <div className="sm:hidden px-3 py-2.5 bg-neutral-100 border-t border-neutral-200 animate-in slide-in-from-top-1 fade-in">
            <div className="flex items-center bg-white border border-neutral-300 rounded px-3 py-2 shadow-xs">
              <Search className="w-4 h-4 text-neutral-500 shrink-0 mr-2" />
              <input 
                type="text"
                placeholder="Search Casio model e.g. MTP-1302, GA-2100..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-xs text-neutral-900 focus:outline-none placeholder:text-neutral-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-neutral-700 p-1 mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-neutral-600 font-bold text-xs pl-2 border-l border-neutral-200"
              >
                Close
              </button>
            </div>

            {/* Mobile Live Results Dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-2 bg-white rounded border border-neutral-200 shadow-lg max-h-72 overflow-y-auto divide-y divide-neutral-100">
                {liveSearchResults.slice(0, 6).map((item) => {
                  const brand = item.series.includes('Edifice')
                    ? 'CASIO EDIFICE'
                    : item.series.includes('G-Shock')
                    ? 'CASIO G-SHOCK'
                    : item.series.includes('Vintage')
                    ? 'CASIO VINTAGE'
                    : item.series.includes('ProTrek')
                    ? 'CASIO PROTREK'
                    : 'CASIO';

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer"
                    >
                      <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.model} 
                          className="w-full h-full object-contain"
                          style={{ mixBlendMode: 'multiply' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                          {brand}
                        </p>
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.originalPricePKR && (
                            <span className="text-[10px] text-[#b91c1c] line-through">
                              {formatPKR(item.originalPricePKR)}
                            </span>
                          )}
                          <span className="text-xs font-bold text-neutral-950">
                            {formatPKR(item.pricePKR)} <span className="text-[9px] font-normal text-neutral-400">inc. GST</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {liveSearchResults.length === 0 && (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No timepieces found matching "{searchQuery}"
                  </div>
                )}

                {liveSearchResults.length > 6 && (
                  <button
                    onClick={() => {
                      handleNavClick('catalog-section');
                      setIsSearchOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-neutral-50 text-center text-xs font-semibold text-neutral-900 border-t border-neutral-100"
                  >
                    View all {liveSearchResults.length} timepieces →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Drawer - LifeStyle Collection Architecture */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Account Quick Bar on Mobile */}
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-700" />
                  <span className="text-xs font-bold text-neutral-900">Customer Account</span>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsAccountModalOpen(true); }}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  Track / Sign In
                </button>
              </div>

              {/* Collections Grid */}
              <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                Browse Timepieces
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {[
                  { name: 'All Watches', filter: 'All' },
                  { name: 'Men (MTP Series)', filter: 'Casio MTP' },
                  { name: 'Women (LTP Series)', filter: 'Casio LTP' },
                  { name: 'Edifice Motorsport', filter: 'Casio Edifice' },
                  { name: 'G-Shock 200M Tough', filter: 'Casio G-Shock' },
                  { name: 'Vintage 1980s Retro', filter: 'Casio Vintage' },
                  { name: 'ProTrek Solar Compass', filter: 'Casio ProTrek' }
                ].map((item) => (
                  <button
                    key={item.filter}
                    onClick={() => handleNavClick('catalog-section', item.filter)}
                    className="p-3 text-left bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-200 text-neutral-900"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Store & Direct Support Links */}
              <div className="pt-3 border-t border-neutral-200 space-y-2 text-xs">
                <button
                  onClick={() => handleNavClick('store-location')}
                  className="w-full flex items-center gap-2 p-2.5 rounded hover:bg-neutral-50 text-neutral-800 border border-neutral-100"
                >
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Shop 141, Paradise Shopping Centre, Saddar</span>
                </button>

                <button
                  onClick={() => handleNavClick('warranty-section')}
                  className="w-full flex items-center gap-2 p-2.5 rounded hover:bg-neutral-50 text-neutral-800 border border-neutral-100"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Year Stamped Official Warranty</span>
                </button>

                <a
                  href="https://wa.me/923213979883"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge (+92 321 3979883)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Account / Track Order Modal */}
      <AccountModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
      />
    </>
  );
};
