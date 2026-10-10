import React, { useState, useRef, MouseEvent, useEffect, useMemo } from 'react';
import { WatchProduct } from '../types';
import { useCart, formatPKR } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Star
} from 'lucide-react';
import { WatchDialRenderer } from './WatchDialRenderer';

interface ProductModalProps {
  product: WatchProduct;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen, setSelectedProduct } = useCart();
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Accordion state (Clean LifeStyle Collection accordion)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    details: true,
    warranty: false,
    reviews: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modal Scroll Container Ref & Carousel Ref
  const modalContentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reset scroll and view when a related watch is clicked
  useEffect(() => {
    setActiveImageIndex(0);
    setImageError(false);
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product.id]);

  // Lens Zoom State
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const isFavorited = isInWishlist(product.id);

  // Gallery images (main + alternate views)
  const galleryImages = [
    product.imageUrl,
    product.alternateImageUrl || product.imageUrl,
    product.imageUrl
  ];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsCartOpen(true);
    onClose();
  };

  // Dynamic Related Watches (4 to 8 similar watches from the same Collection/Series)
  const relatedWatches = useMemo(() => {
    let matched = ALL_PRODUCTS.filter((p) => p.series === product.series && p.id !== product.id);
    if (matched.length < 8) {
      const complementary = ALL_PRODUCTS.filter(
        (p) => p.gender === product.gender && p.id !== product.id && p.series !== product.series
      );
      matched = [...matched, ...complementary];
    }
    return matched.slice(0, 8);
  }, [product.id, product.series, product.gender]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const brandDisplayName = product.series.includes('Edifice')
    ? 'CASIO EDIFICE'
    : product.series.includes('G-Shock')
    ? 'CASIO G-SHOCK'
    : product.series.includes('Vintage')
    ? 'CASIO VINTAGE'
    : product.series.includes('ProTrek')
    ? 'CASIO PROTREK'
    : 'CASIO';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        ref={modalContentRef}
        className="relative bg-white rounded-none sm:rounded-md max-w-4xl w-full max-h-[96vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl z-10 flex flex-col text-neutral-900 border-0 animate-in zoom-in-95 duration-200"
      >
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-neutral-400 hover:text-neutral-900 bg-white/80 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close Product View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Product Detail Split Area */}
        <div className="p-5 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 border-b border-neutral-100">
          
          {/* Left Column: Pure Floating Watch Image & Thumbnails */}
          <div className="space-y-4">
            <div 
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-square w-full bg-white flex items-center justify-center p-2 sm:p-4 cursor-crosshair overflow-hidden"
              style={{ background: '#FFFFFF', border: 'none', boxShadow: 'none' }}
            >
              {!imageError ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={galleryImages[activeImageIndex]}
                    alt={`${product.model} - ${product.name}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZooming ? 'scale(2.2)' : 'scale(1.18)',
                      mixBlendMode: 'multiply'
                    }}
                    className="w-full h-full object-contain transition-transform duration-150 ease-out"
                  />
                  {!isZooming && (
                    <div className="hidden sm:block absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-neutral-400 pointer-events-none">
                      Hover to zoom
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-0" style={{ transform: 'scale(1.18)' }}>
                  <WatchDialRenderer product={product} className="w-full h-full max-h-[260px]" />
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-2.5 justify-center pt-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 p-1 bg-white rounded-none border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-neutral-900 opacity-100'
                      : 'border-neutral-200 hover:border-neutral-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Clean De-Cluttered Info matching LifeStyle Collection */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Brand & Wishlist */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
                  {brandDisplayName}
                </p>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {/* Title & Model Code */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Model: {product.model}
                </p>
              </div>

              {/* Clean Typography Price (No Heavy Container Box) */}
              <div className="py-2 flex items-baseline gap-3 border-t border-b border-neutral-100">
                {product.originalPricePKR && (
                  <span className="text-sm sm:text-base text-[#b91c1c] line-through font-normal">
                    {formatPKR(product.originalPricePKR)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-bold text-neutral-950">
                  {formatPKR(product.pricePKR)}
                </span>
                <span className="text-xs text-neutral-500 font-normal">inc. GST</span>
              </div>

              {/* Clean Full-Width Black ADD TO CART Button */}
              <div className="pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 sm:py-4 px-6 bg-neutral-950 hover:bg-neutral-800 active:scale-[0.99] text-white font-semibold tracking-widest uppercase text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 rounded-none shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Authenticity Guarantee Note */}
            <div className="pt-4 flex items-center gap-2 text-xs text-neutral-500 border-t border-neutral-100">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>100% Genuine Casio · 1-Year Stamped Official Warranty</span>
            </div>
          </div>
        </div>

        {/* Accordion Section: DESCRIPTION, DETAILS, WARRANTY, REVIEWS */}
        <div className="p-5 sm:p-10 divide-y divide-neutral-200">
          
          {/* 1. DESCRIPTION Accordion */}
          <div className="py-4">
            <button
              onClick={() => toggleAccordion('description')}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black">
                Description
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  openAccordions.description ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openAccordions.description && (
              <div className="pt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-3 animate-in fade-in duration-200">
                <p>{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="pt-2">
                    <p className="font-semibold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">Key Highlights:</p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
                      {product.features.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. DETAILS & SPECIFICATIONS Accordion */}
          <div className="py-4">
            <button
              onClick={() => toggleAccordion('details')}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black">
                Details & Specifications
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  openAccordions.details ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openAccordions.details && (
              <div className="pt-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Model Reference</span>
                    <span className="font-mono font-bold text-neutral-900">{product.model}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Collection</span>
                    <span className="font-semibold text-neutral-900">{product.series}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Gender</span>
                    <span className="text-neutral-900">{product.gender}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Case Diameter</span>
                    <span className="text-neutral-900">{product.specs.caseDiameter}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Case Thickness</span>
                    <span className="text-neutral-900">{product.specs.caseThickness}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Water Resistance</span>
                    <span className="font-semibold text-neutral-900">{product.specs.waterResistance}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Glass</span>
                    <span className="text-neutral-900">{product.specs.glassType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Band Material</span>
                    <span className="text-neutral-900">{product.specs.bandMaterial}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Movement</span>
                    <span className="text-neutral-900">{product.specs.movement}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Battery Life</span>
                    <span className="text-neutral-900">{product.specs.batteryLife}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100 sm:col-span-2">
                    <span className="text-neutral-500">Warranty</span>
                    <span className="font-bold text-neutral-900">{product.specs.warranty}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. WARRANTY Accordion */}
          <div className="py-4">
            <button
              onClick={() => toggleAccordion('warranty')}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black">
                1-Year Official Warranty
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  openAccordions.warranty ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openAccordions.warranty && (
              <div className="pt-4 text-xs text-neutral-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                <p>
                  Every timepiece purchased from New Madina Electronics includes an official 1-year stamped warranty card issued by our Saddar, Karachi showroom.
                </p>
                <p>
                  Covers internal Japanese quartz movement and electronic oscillator mechanics. Valid across authorized repair centers.
                </p>
              </div>
            )}
          </div>

          {/* 4. REVIEWS Accordion */}
          <div className="py-4">
            <button
              onClick={() => toggleAccordion('reviews')}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black">
                Reviews ({product.reviewsCount})
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  openAccordions.reviews ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openAccordions.reviews && (
              <div className="pt-4 space-y-3 animate-in fade-in duration-200">
                {[
                  { author: 'Bilal Farooq', city: 'Karachi', date: '2 weeks ago', text: '100% original Casio. Checked the 3-button test and serial code on the box. Outstanding service from Saddar shop.' },
                  { author: 'Salman Riaz', city: 'Lahore', date: 'Last month', text: 'Delivered to Lahore via TCS in 2 days. Pristine packaging with stamped warranty card. Highly recommended!' }
                ].map((r, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 border-0 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-950">{r.author} ({r.city})</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-600">"{r.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Related Watches / "YOU MAY ALSO LIKE" Section */}
        {relatedWatches.length > 0 && (
          <div className="p-5 sm:p-10 border-t border-neutral-100 bg-white">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-950 tracking-widest uppercase">
                  You May Also Like
                </h3>
              </div>

              {/* Carousel Scroll Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-7 h-7 rounded-full border border-neutral-300 bg-white hover:bg-neutral-950 hover:text-white flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-7 h-7 rounded-full border border-neutral-300 bg-white hover:bg-neutral-950 hover:text-white flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pure Floating Cards without Borders, Boxes, or Badges */}
            <div 
              ref={carouselRef}
              className="flex md:grid md:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 scroll-smooth no-scrollbar"
            >
              {relatedWatches.map((rel) => {
                const relBrandName = rel.series.includes('Edifice')
                  ? 'CASIO EDIFICE'
                  : rel.series.includes('G-Shock')
                  ? 'CASIO G-SHOCK'
                  : rel.series.includes('Vintage')
                  ? 'CASIO VINTAGE'
                  : rel.series.includes('ProTrek')
                  ? 'CASIO PROTREK'
                  : 'CASIO';

                return (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProduct(rel);
                    }}
                    className="min-w-[160px] sm:min-w-[190px] md:min-w-0 snap-start bg-white border-0 outline-none shadow-none p-0 cursor-pointer group transition-all duration-300 flex flex-col justify-between relative select-none"
                    style={{ border: 'none', boxShadow: 'none', background: '#FFFFFF' }}
                  >
                    {/* Centered Pure Floating Watch Image with scale(1.18) */}
                    <div className="relative aspect-square w-full bg-white flex items-center justify-center p-0 mb-2 overflow-hidden">
                      <img 
                        src={rel.imageUrl} 
                        alt={`${rel.model} - ${rel.name}`} 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-0 transition-transform duration-300 group-hover:scale-125" 
                        style={{ 
                          background: 'transparent', 
                          mixBlendMode: 'multiply',
                          transform: 'scale(1.18)'
                        }}
                      />
                    </div>

                    {/* Clean Text Lines */}
                    <div className="pt-1 space-y-1 text-center w-full">
                      <p className="text-[11px] sm:text-[12px] font-bold text-neutral-950 uppercase tracking-wider">
                        {relBrandName}
                      </p>
                      <h4 className="text-[11px] text-neutral-500 font-normal line-clamp-2 px-1">
                        {rel.name}
                      </h4>
                      <div className="pt-1 flex flex-col items-center justify-center font-sans">
                        {rel.originalPricePKR && (
                          <span className="text-[10px] text-[#b91c1c] line-through font-medium">
                            {formatPKR(rel.originalPricePKR)}
                          </span>
                        )}
                        <span className="text-xs sm:text-[13px] font-bold text-neutral-950">
                          {formatPKR(rel.pricePKR)} <span className="text-[9px] font-normal text-neutral-500">inc. GST</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
