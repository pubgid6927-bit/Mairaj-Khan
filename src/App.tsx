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
import { SeriesFilter } from './components/SeriesFilter';
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
import { MobileBottomBar } from './components/MobileBottomBar';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Search, Sparkles, CheckCircle2, RotateCcw, ChevronDown, Sliders } from 'lucide-react';

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
  const [selectedBand, setSelectedBand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedMovement, setSelectedMovement] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

      // 2. Search Query (matches model, name, series, features)
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

      // 3. Band Material
      if (selectedBand !== 'All' && product.specs.bandMaterial !== selectedBand) {
        return false;
      }

      // 4. Movement
      if (selectedMovement !== 'All' && product.specs.movement !== selectedMovement) {
        return false;
      }

      // 5. Price Range
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
  }, [activeSeries, searchQuery, selectedBand, selectedPriceRange, selectedMovement, sortBy]);

  const hasActiveFilters =
    activeSeries !== 'All' ||
    selectedBand !== 'All' ||
    selectedPriceRange !== 'All' ||
    selectedMovement !== 'All' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured';

  const resetAllFilters = () => {
    setActiveSeries('All');
    setSelectedBand('All');
    setSelectedPriceRange('All');
    setSelectedMovement('All');
    setSearchQuery('');
    setSortBy('featured');
    setVisibleCount(PAGE_SIZE);
  };

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#111827] pb-16 md:pb-0 flex flex-col justify-between selection:bg-amber-600/15 selection:text-amber-900">
      {/* Top Navigation - Lifestyle Collection Style */}
      <Header />

      <main className="flex-1 pb-16 md:pb-0">
        {/* Hero Showcase Banner */}
        <HeroBanner />

        {/* Main Product Catalog Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-16 space-y-5 sm:space-y-6">
          {/* Section Title */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Casio Watch Collection · Official 1-Year Warranty</span>
              </div>
              <h2
                className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {activeSeries === 'All' ? 'Casio Official Watch Catalog' : activeSeries}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Authentic Casio timepieces available in Karachi with official stamped warranty.
              </p>
            </div>

            {/* Quick Keyword Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search model, color..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 shadow-2xs"
              />
            </div>
          </div>

          {/* Filter Bar with Segmented Buttons and Dropdowns */}
          <SeriesFilter
            activeSeries={activeSeries}
            onSelectSeries={(series) => {
              setActiveSeries(series);
              setVisibleCount(PAGE_SIZE);
            }}
            seriesCounts={seriesCounts}
            totalCount={allProducts.length}
            selectedBand={selectedBand}
            onSelectBand={(band) => {
              setSelectedBand(band);
              setVisibleCount(PAGE_SIZE);
            }}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={(range) => {
              setSelectedPriceRange(range);
              setVisibleCount(PAGE_SIZE);
            }}
            selectedMovement={selectedMovement}
            onSelectMovement={(movement) => {
              setSelectedMovement(movement);
              setVisibleCount(PAGE_SIZE);
            }}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            onResetFilters={resetAllFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Products Grid - 2 Columns on Mobile, 4 Columns on Desktop */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 pt-1 sm:pt-2">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Casio watches match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search terms, price filter, or series selection to explore other models.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Load More Pagination Button */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-8 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 hover:border-slate-800 text-slate-900 font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Load More Watches</span>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </section>

        {/* 1-Year Official Warranty & Authenticity Section */}
        <WarrantySection />

        {/* Physical Store in Saddar Karachi & Map */}
        <StoreLocation />

        {/* Customer Reviews for Social Proof */}
        <CustomerReviews />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Discreet Store Admin Control Button */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-16 md:bottom-5 right-3 md:right-5 z-35 bg-slate-900/90 hover:bg-slate-950 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        title="Open Store Admin Control Panel"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Admin Panel</span>
      </button>

      {/* Admin Control Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={allProducts}
        onProductsUpdated={handleProductsUpdated}
      />

      {/* Mobile Bottom Thumb Bar */}
      <MobileBottomBar />

      {/* Interactive Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Slide-over Wishlist Saved Watches Drawer */}
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

      {/* Prominent Center-Top Notification Toasts with Instant Feedback */}
      <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-60 flex flex-col gap-2 w-[92%] max-w-md pointer-events-none">
        {toasts.map((toast) => {
          const isWishlistToast = toast.message.toLowerCase().includes('wishlist') || toast.message.toLowerCase().includes('saved');
          const isCartToast = toast.message.toLowerCase().includes('cart') || toast.message.toLowerCase().includes('bag');

          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isWishlistToast ? (
                  <span className="text-base shrink-0">❤️</span>
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span className="font-medium text-slate-100 truncate">{toast.message}</span>
              </div>

              {isWishlistToast ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                    setIsWishlistOpen(true);
                  }}
                  className="shrink-0 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-md transition-colors cursor-pointer"
                >
                  View
                </button>
              ) : isCartToast ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                    setIsCartOpen(true);
                  }}
                  className="shrink-0 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-md transition-colors cursor-pointer"
                >
                  View Bag
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
