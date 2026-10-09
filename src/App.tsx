/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { ALL_PRODUCTS } from './data/products';
import { WatchProduct } from './types';
import { isSupabaseConfigured, fetchProductsFromSupabase } from './lib/supabase';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { SidebarFilter } from './components/SidebarFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { StoreLocation } from './components/StoreLocation';
import { WarrantySection } from './components/WarrantySection';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { 
  Search, 
  RotateCcw, 
  ChevronDown, 
  SlidersHorizontal,
  X,
  CheckCircle2
} from 'lucide-react';

const PAGE_SIZE = 24;

const MainContent: React.FC = () => {
  const {
    activeSeries,
    setActiveSeries,
    searchQuery,
    setSearchQuery,
    selectedProduct,
    setSelectedProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    completedOrder,
    setCompletedOrder,
    toasts,
    removeToast
  } = useCart();

  // Dynamic products list (Supabase live DB with local fallback)
  const [allProducts, setAllProducts] = useState<WatchProduct[]>(() => {
    const saved = localStorage.getItem('nme_custom_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ALL_PRODUCTS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedBand, setSelectedBand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedMovement, setSelectedMovement] = useState('All');
  const [selectedWaterResistance, setSelectedWaterResistance] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filter drawer controls (collapsible sidebar)
  const [isFilterSidebarVisible, setIsFilterSidebarVisible] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Direct URL route listener for Admin panel (/admin, #admin, or ?admin)
  useEffect(() => {
    const checkAdminRoute = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        pathname === '/admin' || 
        pathname.endsWith('/admin') || 
        pathname.includes('/admin') ||
        hash === '#admin' || 
        search.includes('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const pathname = window.location.pathname;
    if (pathname.includes('/admin') || window.location.hash === '#admin' || window.location.search.includes('admin')) {
      const cleanPath = pathname.replace(/\/admin\/?$/, '') || '/';
      window.history.pushState(null, '', cleanPath);
    }
  };

  // Sync from Supabase on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchProductsFromSupabase().then((data) => {
        if (data && data.length > 0) {
          setAllProducts(data);
        }
      });
    }
  }, []);

  const handleProductsUpdated = (updatedList: WatchProduct[]) => {
    setAllProducts(updatedList);
    try {
      localStorage.setItem('nme_custom_products', JSON.stringify(updatedList));
    } catch (e) {}
  };

  // Compute counts per series
  const seriesCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.series] = (counts[p.series] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Series Filter
      if (activeSeries !== 'All' && product.series !== activeSeries) {
        return false;
      }

      // 2. Gender Filter
      if (selectedGender !== 'All' && product.gender !== selectedGender) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesModel = product.model.toLowerCase().includes(q);
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSeries = product.series.toLowerCase().includes(q);
        const matchesFeatures = product.features.some((f) => f.toLowerCase().includes(q));
        if (!matchesModel && !matchesName && !matchesSeries && !matchesFeatures) {
          return false;
        }
      }

      // 4. Band Material
      if (selectedBand !== 'All' && product.specs.bandMaterial !== selectedBand) {
        return false;
      }

      // 5. Movement
      if (selectedMovement !== 'All' && product.specs.movement !== selectedMovement) {
        return false;
      }

      // 6. Water Resistance
      if (selectedWaterResistance !== 'All' && !product.specs.waterResistance.includes(selectedWaterResistance)) {
        return false;
      }

      // 7. Price Range
      if (selectedPriceRange !== 'All') {
        const price = product.pricePKR;
        if (selectedPriceRange === 'under15k' && price >= 15000) return false;
        if (selectedPriceRange === '15k-30k' && (price < 15000 || price > 30000)) return false;
        if (selectedPriceRange === '30k-60k' && (price < 30000 || price > 60000)) return false;
        if (selectedPriceRange === '60k-100k' && (price < 60000 || price > 100000)) return false;
        if (selectedPriceRange === 'above100k' && price < 100000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
      if (sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'model') return a.model.localeCompare(b.model);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    allProducts, 
    activeSeries, 
    selectedGender, 
    searchQuery, 
    selectedBand, 
    selectedMovement, 
    selectedWaterResistance, 
    selectedPriceRange, 
    sortBy
  ]);

  const hasActiveFilters =
    activeSeries !== 'All' ||
    selectedGender !== 'All' ||
    selectedBand !== 'All' ||
    selectedPriceRange !== 'All' ||
    selectedMovement !== 'All' ||
    selectedWaterResistance !== 'All' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured';

  const resetAllFilters = () => {
    setActiveSeries('All');
    setSelectedGender('All');
    setSelectedBand('All');
    setSelectedPriceRange('All');
    setSelectedMovement('All');
    setSelectedWaterResistance('All');
    setSearchQuery('');
    setSortBy('featured');
    setVisibleCount(PAGE_SIZE);
  };

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white font-sans antialiased">
      {/* Top Header - LifeStyle Collection Exact Structure */}
      <Header />

      <main className="flex-1">
        {/* Editorial Showcase Hero Banner */}
        <HeroBanner />

        {/* Catalog Main Layout (Clean, Spacious, Minimalist) */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10 sm:space-y-14">
          
          {/* 1. Clean, Elegant Serif Heading & Watch Category Filters */}
          <div className="text-center space-y-4 pb-6 sm:pb-8 border-b border-neutral-100">
            <h2 
              className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.25em] text-neutral-950 uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              NEW ARRIVALS — FEATURED PRODUCTS
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 tracking-[0.16em] uppercase font-sans">
              100% Genuine Casio Timepieces · Official 1-Year Stamped Warranty · Saddar Karachi
            </p>

            {/* Watch Category Sub-Filters (ALL, MEN, WOMEN, EDIFICE, G-SHOCK, VINTAGE, PROTREK) */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-[11px] sm:text-xs tracking-[0.18em] uppercase text-neutral-500 font-medium">
              <button
                onClick={() => { setActiveSeries('All'); setSelectedGender('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  activeSeries === 'All' && selectedGender === 'All'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                ALL
              </button>

              <span className="text-neutral-200 select-none">|</span>

              <button
                onClick={() => { setSelectedGender('Men'); setActiveSeries('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  selectedGender === 'Men' && activeSeries === 'All'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                MEN
              </button>

              <span className="text-neutral-200 select-none">|</span>

              <button
                onClick={() => { setSelectedGender('Ladies'); setActiveSeries('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  selectedGender === 'Ladies' && activeSeries === 'All'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                WOMEN
              </button>

              <span className="text-neutral-200 select-none">|</span>

              <button
                onClick={() => { setActiveSeries('Casio Edifice'); setSelectedGender('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  activeSeries === 'Casio Edifice'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                EDIFICE
              </button>

              <span className="text-neutral-200 select-none">|</span>

              <button
                onClick={() => { setActiveSeries('Casio G-Shock'); setSelectedGender('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  activeSeries === 'Casio G-Shock'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                G-SHOCK
              </button>

              <span className="text-neutral-200 select-none">|</span>

              <button
                onClick={() => { setActiveSeries('Casio Vintage'); setSelectedGender('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  activeSeries === 'Casio Vintage'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                VINTAGE
              </button>

              <span className="text-neutral-200 select-none">|</span>

              <button
                onClick={() => { setActiveSeries('Casio ProTrek'); setSelectedGender('All'); setVisibleCount(PAGE_SIZE); }}
                className={`pb-1 transition-colors cursor-pointer border-b ${
                  activeSeries === 'Casio ProTrek'
                    ? 'text-neutral-950 border-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-900 border-transparent'
                }`}
              >
                PROTREK
              </button>
            </div>
          </div>

          {/* 2. Top Minimalist Control Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600 pb-2">
            {/* Left: Filter Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    setIsFilterSidebarVisible(!isFilterSidebarVisible);
                  } else {
                    setIsMobileFilterOpen(true);
                  }
                }}
                className="flex items-center gap-2 py-1.5 px-3 border border-neutral-200 hover:border-neutral-950 rounded text-neutral-900 font-semibold tracking-wider uppercase text-[11px] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isFilterSidebarVisible ? 'Hide Filters' : 'Filter & Refine'}</span>
                {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>
            </div>

            {/* Right: Clean Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium hidden sm:inline">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-neutral-300 py-1 text-xs text-neutral-900 font-medium focus:outline-none focus:border-neutral-950 cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="model">Model Reference (A – Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips (if any applied) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Active:</span>

              {activeSeries !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800 text-[11px]">
                  <span>{activeSeries}</span>
                  <X className="w-3 h-3 hover:text-black cursor-pointer" onClick={() => setActiveSeries('All')} />
                </span>
              )}

              {selectedGender !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800 text-[11px]">
                  <span>Gender: {selectedGender}</span>
                  <X className="w-3 h-3 hover:text-black cursor-pointer" onClick={() => setSelectedGender('All')} />
                </span>
              )}

              {selectedBand !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800 text-[11px]">
                  <span>Strap: {selectedBand}</span>
                  <X className="w-3 h-3 hover:text-black cursor-pointer" onClick={() => setSelectedBand('All')} />
                </span>
              )}

              {selectedPriceRange !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800 text-[11px]">
                  <span>Price Range</span>
                  <X className="w-3 h-3 hover:text-black cursor-pointer" onClick={() => setSelectedPriceRange('All')} />
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800 text-[11px]">
                  <span>"{searchQuery}"</span>
                  <X className="w-3 h-3 hover:text-black cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-neutral-900 hover:underline ml-2 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* 3. Main Product Grid Layout with Increased Vertical & Horizontal Breathing Room */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Collapsible Left Filter Sidebar (Desktop) */}
            {isFilterSidebarVisible && (
              <SidebarFilter
                activeSeries={activeSeries}
                onSelectSeries={(s) => { setActiveSeries(s); setVisibleCount(PAGE_SIZE); }}
                seriesCounts={seriesCounts}
                totalCount={allProducts.length}
                selectedGender={selectedGender}
                onSelectGender={(g) => { setSelectedGender(g); setVisibleCount(PAGE_SIZE); }}
                selectedBand={selectedBand}
                onSelectBand={(b) => { setSelectedBand(b); setVisibleCount(PAGE_SIZE); }}
                selectedPriceRange={selectedPriceRange}
                onSelectPriceRange={(pr) => { setSelectedPriceRange(pr); setVisibleCount(PAGE_SIZE); }}
                selectedMovement={selectedMovement}
                onSelectMovement={(m) => { setSelectedMovement(m); setVisibleCount(PAGE_SIZE); }}
                selectedWaterResistance={selectedWaterResistance}
                onSelectWaterResistance={(wr) => { setSelectedWaterResistance(wr); setVisibleCount(PAGE_SIZE); }}
                onResetFilters={resetAllFilters}
                hasActiveFilters={hasActiveFilters}
                isMobileDrawerOpen={false}
                onCloseMobileDrawer={() => {}}
              />
            )}

            {/* Mobile Drawer Filter */}
            <SidebarFilter
              activeSeries={activeSeries}
              onSelectSeries={(s) => { setActiveSeries(s); setVisibleCount(PAGE_SIZE); }}
              seriesCounts={seriesCounts}
              totalCount={allProducts.length}
              selectedGender={selectedGender}
              onSelectGender={(g) => { setSelectedGender(g); setVisibleCount(PAGE_SIZE); }}
              selectedBand={selectedBand}
              onSelectBand={(b) => { setSelectedBand(b); setVisibleCount(PAGE_SIZE); }}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={(pr) => { setSelectedPriceRange(pr); setVisibleCount(PAGE_SIZE); }}
              selectedMovement={selectedMovement}
              onSelectMovement={(m) => { setSelectedMovement(m); setVisibleCount(PAGE_SIZE); }}
              selectedWaterResistance={selectedWaterResistance}
              onSelectWaterResistance={(wr) => { setSelectedWaterResistance(wr); setVisibleCount(PAGE_SIZE); }}
              onResetFilters={resetAllFilters}
              hasActiveFilters={hasActiveFilters}
              isMobileDrawerOpen={isMobileFilterOpen}
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />

            {/* Product Cards Grid: Large Uncluttered Watches on Pure White with Generous Spacing */}
            <div className="flex-1 min-w-0 w-full">
              {paginatedProducts.length > 0 ? (
                <div 
                  className={`grid grid-cols-2 ${
                    isFilterSidebarVisible 
                      ? 'sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-7' 
                      : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8'
                  }`}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="py-24 text-center space-y-4 bg-neutral-50 rounded p-8">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto text-neutral-400 border border-neutral-200">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 font-serif">No Casio timepieces match your criteria</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try adjusting your filter selection or search keyword to view other timepieces in our Saddar Karachi showroom.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 bg-neutral-950 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Load More Pagination Button */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center pt-16 sm:pt-20">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-12 py-3.5 bg-transparent hover:bg-neutral-950 border border-neutral-900 text-neutral-950 hover:text-white font-medium text-xs tracking-[0.2em] uppercase rounded transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Load More Timepieces</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 1-Year Official Warranty & Authenticity Section */}
        <WarrantySection />

        {/* Physical Store in Saddar Karachi & Map */}
        <StoreLocation />

        {/* Customer Reviews for Social Proof */}
        <CustomerReviews />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Control Panel Modal (Accessible only via /admin direct URL route) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        products={allProducts}
        onProductsUpdated={handleProductsUpdated}
      />

      {/* Single Product Detail Modal / Page View (Split View with Lens Zoom) */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Slide-over Mini-Cart Drawer */}
      <CartDrawer />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}

      {/* Order Confirmation Receipt Modal */}
      {completedOrder && (
        <OrderConfirmationModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

      {/* Center-Top Notification Feedback Toasts */}
      <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-60 flex flex-col gap-2 w-[92%] max-w-md pointer-events-none">
        {toasts.map((toast) => {
          const isWishlistToast = toast.message.toLowerCase().includes('wishlist') || toast.message.toLowerCase().includes('saved');

          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className="pointer-events-auto bg-neutral-950/95 backdrop-blur-md border border-neutral-700 text-white text-xs px-4 py-3 rounded shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isWishlistToast ? (
                  <span className="text-base shrink-0">❤️</span>
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span className="font-medium text-neutral-100 truncate">{toast.message}</span>
              </div>

              {isWishlistToast && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                    setIsWishlistOpen(true);
                  }}
                  className="shrink-0 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded transition-colors cursor-pointer"
                >
                  View
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
};

export default App;
