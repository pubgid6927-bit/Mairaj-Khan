import React, { useState, useRef, MouseEvent, useEffect, useMemo } from 'react';
import { WatchProduct } from '../types';
import { useCart, formatPKR } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Star, 
  Minus, 
  Plus, 
  MessageCircle, 
  Check, 
  Truck, 
  RotateCcw, 
  Award, 
  Info,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { WatchDialRenderer } from './WatchDialRenderer';

interface ProductModalProps {
  product: WatchProduct;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen, setIsCheckoutOpen, setSelectedProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'warranty' | 'reviews'>('desc');
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modal Scroll Container Ref & Carousel Ref
  const modalContentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Smooth scroll back to top when a related watch is clicked
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
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
    addToCart(product, quantity);
    setIsCartOpen(true);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum New Madina Electronics! I would like to purchase this watch:\n\n*Brand:* CASIO ${product.series}\n*Model:* ${product.model}\n*Name:* ${product.name}\n*Price:* ${formatPKR(product.pricePKR)}\n*Quantity:* ${quantity}\n\nPlease confirm availability at your Saddar Karachi showroom.`
  );

  const discountAmount = product.originalPricePKR ? product.originalPricePKR - product.pricePKR : 0;
  const discountPercent = product.originalPricePKR 
    ? Math.round((discountAmount / product.originalPricePKR) * 100)
    : 15;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        ref={modalContentRef}
        className="relative bg-white rounded-none sm:rounded-lg max-w-5xl w-full max-h-[96vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl z-10 flex flex-col text-neutral-900 border border-neutral-300 animate-in zoom-in-95 duration-200"
      >
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-neutral-500 hover:text-black bg-white/90 hover:bg-neutral-100 rounded-full border border-neutral-200 shadow-sm transition-colors cursor-pointer"
          aria-label="Close Product View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Product Split Area */}
        <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-b border-neutral-200">
          
          {/* Left Column: Interactive Image Gallery with Lens Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div 
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-square w-full bg-[#fbfbfa] border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center p-6 sm:p-8 cursor-crosshair group"
            >
              {/* Top Tag */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-wider uppercase bg-[#8C1D40] text-white px-2.5 py-1 rounded-xs shadow-xs">
                  -{discountPercent}% OFF
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white border border-neutral-200 text-neutral-800 px-2 py-1 rounded-xs shadow-2xs">
                  100% GENUINE
                </span>
              </div>

              {/* Main Image with Zoom Simulation */}
              {!imageError ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={galleryImages[activeImageIndex]}
                    alt={product.model}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZooming ? 'scale(2)' : 'scale(1)',
                    }}
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-transform duration-150 ease-out"
                  />
                  {/* Hover prompt */}
                  {!isZooming && (
                    <div className="hidden sm:block absolute bottom-2 right-2 text-[10px] font-mono text-neutral-400 bg-white/80 px-2 py-0.5 rounded border border-neutral-200 pointer-events-none">
                      Hover to Zoom
                    </div>
                  )}
                </div>
              ) : (
                <WatchDialRenderer product={product} className="w-full h-full max-h-[260px]" />
              )}
            </div>

            {/* Clickable Image Gallery Thumbnails */}
            <div className="flex items-center gap-3 justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 p-1.5 bg-[#fbfbfa] rounded border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-neutral-950 ring-1 ring-neutral-950 scale-105'
                      : 'border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* In-Store Guarantee Note */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-3 text-xs text-neutral-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-neutral-950">Official 1-Year Stamped Warranty</p>
                <p className="text-[11px] text-neutral-500">Includes original Casio box, manual, & stamped warranty card from Saddar Karachi store.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Title, SKU, Price, Actions */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Brand & Series Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-neutral-500">
                  <span className="text-amber-800">CASIO {product.series.replace('Casio ', '')}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-600">{product.gender}</span>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-neutral-200 text-neutral-400 hover:text-rose-600'
                  }`}
                  title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Title & Model SKU */}
              <div>
                <h1 
                  className="text-xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-snug font-serif"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-xs text-neutral-600 font-mono mt-1.5 flex items-center gap-2">
                  <span className="text-neutral-400">SKU / Model Ref:</span>
                  <span className="font-black text-neutral-950 bg-neutral-100 px-2.5 py-0.5 rounded font-mono">
                    {product.model}
                  </span>
                </p>
              </div>

              {/* Rating & In-Stock Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-700">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-neutral-950">{product.rating}</span>
                  <span className="text-neutral-400 text-[11px]">({product.reviewsCount} customer reviews)</span>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>In Stock · Available for Same-Day Dispatch</span>
                </span>
              </div>

              {/* Price Section */}
              <div className="p-4 bg-[#fbfbfa] border border-neutral-200 rounded flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-neutral-950">
                    {formatPKR(product.pricePKR)}
                  </div>
                  {product.originalPricePKR && (
                    <div className="flex items-center gap-2 text-xs font-mono mt-1">
                      <span className="text-neutral-400 line-through">
                        {formatPKR(product.originalPricePKR)}
                      </span>
                      <span className="text-[#8C1D40] font-bold">
                        Save {formatPKR(discountAmount)} ({discountPercent}% OFF)
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right text-[11px] text-neutral-500 font-medium">
                  <span>Price includes GST</span>
                  <span className="block text-emerald-700 font-bold">Free Courier Over Rs. 15,000</span>
                </div>
              </div>

              {/* Strap & Material Specs Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-400 block uppercase">Strap Material</span>
                  <span className="font-bold text-neutral-900">{product.specs.bandMaterial}</span>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-400 block uppercase">Water Resistance</span>
                  <span className="font-bold text-emerald-800">{product.specs.waterResistance}</span>
                </div>
              </div>

              {/* Quantity Stepper & Add to Bag Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-300 rounded bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-neutral-600 hover:text-black cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold px-3 text-neutral-950 text-xs">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="p-2 text-neutral-600 hover:text-black cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-5 bg-white hover:bg-neutral-100 border-2 border-neutral-950 text-neutral-950 font-bold tracking-wider uppercase rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  {/* Buy Now (Direct Checkout) */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3 px-5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* WhatsApp Order Button */}
                <a
                  href={`https://wa.me/923213979883?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wider uppercase rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp (+92 321 3979883)</span>
                </a>
              </div>
            </div>

            {/* Delivery & Store Dispatch Promise */}
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3 text-[11px] text-neutral-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Express TCS / Leopards Dispatch across Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Original Japanese Module Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Additional Info, Warranty, Reviews */}
        <div className="p-4 sm:p-8 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-200 overflow-x-auto no-scrollbar text-xs font-bold tracking-wider uppercase">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'specs', label: 'Additional Information & Specs' },
              { id: 'warranty', label: '1-Year Official Warranty' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-5 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === t.id
                    ? 'border-neutral-950 text-neutral-950'
                    : 'border-transparent text-neutral-400 hover:text-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-xs text-neutral-700 leading-relaxed font-normal">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p className="text-sm text-neutral-800">{product.description}</p>
                <div className="pt-2 space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-neutral-950">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                    <li>Original factory case and laser-engraved caseback serial number</li>
                    <li>Sourced for official retail in Pakistan by New Madina Electronics Saddar</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <table className="w-full text-left text-xs border border-neutral-200">
                  <tbody className="divide-y divide-neutral-200">
                    <tr className="bg-neutral-50"><td className="p-2.5 font-bold text-neutral-950 w-1/3">Model Reference</td><td className="p-2.5 font-mono">{product.model}</td></tr>
                    <tr><td className="p-2.5 font-bold text-neutral-950">Collection Series</td><td className="p-2.5">{product.series}</td></tr>
                    <tr className="bg-neutral-50"><td className="p-2.5 font-bold text-neutral-950">Gender</td><td className="p-2.5">{product.gender}</td></tr>
                    <tr><td className="p-2.5 font-bold text-neutral-950">Case Diameter</td><td className="p-2.5">{product.specs.caseDiameter}</td></tr>
                    <tr className="bg-neutral-50"><td className="p-2.5 font-bold text-neutral-950">Case Thickness</td><td className="p-2.5">{product.specs.caseThickness}</td></tr>
                    <tr><td className="p-2.5 font-bold text-neutral-950">Water Resistance</td><td className="p-2.5 font-semibold text-emerald-800">{product.specs.waterResistance}</td></tr>
                    <tr className="bg-neutral-50"><td className="p-2.5 font-bold text-neutral-950">Crystal Glass Type</td><td className="p-2.5">{product.specs.glassType}</td></tr>
                    <tr><td className="p-2.5 font-bold text-neutral-950">Band / Strap Material</td><td className="p-2.5">{product.specs.bandMaterial}</td></tr>
                    <tr className="bg-neutral-50"><td className="p-2.5 font-bold text-neutral-950">Movement Type</td><td className="p-2.5">{product.specs.movement}</td></tr>
                    <tr><td className="p-2.5 font-bold text-neutral-950">Battery Life</td><td className="p-2.5">{product.specs.batteryLife}</td></tr>
                    <tr className="bg-neutral-50"><td className="p-2.5 font-bold text-neutral-950">Official Warranty</td><td className="p-2.5 font-bold text-neutral-950">{product.specs.warranty}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="space-y-4 max-w-3xl bg-neutral-50 p-5 rounded border border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-950 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>1-Year Official Warranty Coverage Details</span>
                </div>
                <p>
                  Every timepiece purchased from New Madina Electronics comes with an official physically stamped 1-year warranty card issued by our showroom at Shop 141, 1st Floor, Paradise Shopping Centre, Saddar, Karachi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white border border-neutral-200 rounded">
                    <span className="font-bold text-neutral-900 block mb-1">What Is Covered:</span>
                    <p className="text-neutral-600">Internal Japanese quartz movement mechanics, electronic circuit oscillator frequency, and manufacturing assembly defects.</p>
                  </div>
                  <div className="p-3 bg-white border border-neutral-200 rounded">
                    <span className="font-bold text-neutral-900 block mb-1">Service & Battery:</span>
                    <p className="text-neutral-600">Complimentary battery replacement within 1st year and direct in-store warranty claims support in Saddar Karachi.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-lg font-black text-neutral-950 font-mono">{product.rating} out of 5</span>
                    <span className="text-neutral-500 block text-xs">Based on {product.reviewsCount} customer reviews</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { author: 'Bilal Farooq', city: 'Karachi', date: '2 weeks ago', text: '100% original Casio. Checked the 3-button test and serial code on the box. Outstanding service from Saddar shop.' },
                    { author: 'Salman Riaz', city: 'Lahore', date: 'Last month', text: 'Delivered to Lahore via TCS in 2 days. Pristine packaging with stamped warranty card. Highly recommended!' }
                  ].map((r, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-950">{r.author} ({r.city})</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700 text-xs">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Related Watches / "YOU MAY ALSO LIKE" Section (LifeStyle Collection Signature) */}
        {relatedWatches.length > 0 && (
          <div className="p-4 sm:p-8 border-t border-neutral-200 bg-neutral-50/60">
            {/* Header with Title and Mobile Navigation Arrows */}
            <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
              <div>
                <h3 
                  className="text-base sm:text-lg font-bold text-neutral-950 tracking-[0.2em] uppercase font-serif"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  YOU MAY ALSO LIKE
                </h3>
                <p className="text-[11px] text-neutral-400 uppercase tracking-[0.14em] font-sans mt-0.5">
                  Curated similar timepieces from the {product.series} collection
                </p>
              </div>

              {/* Carousel Scroll Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:border-neutral-950 hover:bg-neutral-950 hover:text-white flex items-center justify-center text-neutral-700 transition-colors cursor-pointer shadow-2xs"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:border-neutral-950 hover:bg-neutral-950 hover:text-white flex items-center justify-center text-neutral-700 transition-colors cursor-pointer shadow-2xs"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Carousel on Mobile & Neat 4-Column Grid on Desktop */}
            <div 
              ref={carouselRef}
              className="flex md:grid md:grid-cols-4 gap-3.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-3 md:pb-0 scroll-smooth no-scrollbar"
            >
              {relatedWatches.map((rel) => {
                const relDiscountPercent = rel.originalPricePKR && rel.originalPricePKR > rel.pricePKR
                  ? Math.round(((rel.originalPricePKR - rel.pricePKR) / rel.originalPricePKR) * 100)
                  : null;

                return (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProduct(rel);
                    }}
                    className="min-w-[170px] sm:min-w-[200px] md:min-w-0 snap-start bg-transparent border-none outline-none shadow-none p-2 sm:p-3 cursor-pointer group transition-all duration-300 flex flex-col justify-between relative select-none"
                    style={{ border: 'none', boxShadow: 'none' }}
                  >
                    {/* Discount badge */}
                    {relDiscountPercent && (
                      <span className="absolute top-1 left-1 z-10 text-[9px] font-bold tracking-wider text-rose-700 bg-rose-50/90 px-1.5 py-0.5 rounded-2xs">
                        -{relDiscountPercent}%
                      </span>
                    )}

                    {/* Centered Pure Floating Watch Image */}
                    <div className="relative aspect-square w-full bg-transparent flex items-center justify-center p-2 sm:p-3 mb-2 overflow-hidden">
                      <img 
                        src={rel.imageUrl} 
                        alt={`${rel.model} - ${rel.name}`} 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    {/* 3 Clean Text Lines (No divider lines, No box container) */}
                    <div className="pt-1 space-y-1 text-left">
                      <p className="text-[10px] text-neutral-400 font-semibold tracking-[0.18em] uppercase truncate">
                        {rel.series.toUpperCase()}
                      </p>
                      <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 group-hover:text-amber-900 transition-colors truncate">
                        <span>{rel.model}</span>
                        <span className="text-neutral-300 font-light mx-1">·</span>
                        <span className="text-neutral-600 font-normal">{rel.name}</span>
                      </h4>
                      <div className="flex items-baseline gap-2 pt-0.5 font-mono">
                        <span className="text-xs sm:text-sm font-bold text-neutral-950">
                          {formatPKR(rel.pricePKR)}
                        </span>
                        {rel.originalPricePKR && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            {formatPKR(rel.originalPricePKR)}
                          </span>
                        )}
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
