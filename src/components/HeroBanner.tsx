import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShieldCheck, MapPin, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Award, Truck, Sparkles } from 'lucide-react';

interface BannerSlide {
  id: string;
  series: string;
  brandTag: string;
  headline: string;
  description: string;
  image: string;
  targetSeries: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 'edifice',
    series: 'Casio Edifice',
    brandTag: 'CASIO EDIFICE · SPEED & PRECISION ENGINEERING',
    headline: 'High-Performance Chronographs & Motorsport Excellence',
    description: 'Advanced Japanese quartz movements with 100M water resistance, solid stainless steel craftsmanship, and Tough Solar light energy technology.',
    image: '/images/lifestyle_hero_edifice.jpg',
    targetSeries: 'Casio Edifice'
  },
  {
    id: 'gshock',
    series: 'Casio G-Shock',
    brandTag: 'CASIO G-SHOCK · ABSOLUTE UNBREAKABLE TOUGHNESS',
    headline: 'The Legendary CasiOak & Carbon Core Guard Collection',
    description: 'Iconic octagonal GA-2100 series, heritage 1983 square shock resistance, 200M diving capability, and legendary Japanese indestructible durability.',
    image: '/images/lifestyle_banner_gshock.jpg',
    targetSeries: 'Casio G-Shock'
  },
  {
    id: 'vintage',
    series: 'Casio Vintage',
    brandTag: 'CASIO VINTAGE · TIMELESS RETRO ICONS',
    headline: 'Authentic 1980s Retro Aesthetics & Digital Craftsmanship',
    description: 'Electroluminescent A168 backlight, gold mirror digital dials, Marty McFly calculator classics, and world time Casio Royale timepieces.',
    image: '/images/lifestyle_banner_vintage.jpg',
    targetSeries: 'Casio Vintage'
  }
];

export const HeroBanner: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { setActiveSeries } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlideIndex];

  const handleExplore = (seriesName: string) => {
    setActiveSeries(seriesName);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0e1015] text-white border-b border-neutral-800">
      {/* Subtle luxury ambient backlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Editorial Copy - Lifestyle Collection Pakistan Boutique Format */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-sm border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{slide.brandTag}</span>
            </div>

            <h1 
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {slide.headline}
            </h1>

            <p className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal">
              {slide.description}
            </p>

            {/* Boutique Trust Pillars */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-neutral-300 bg-neutral-900/80 border border-neutral-800 px-4 py-2.5 rounded w-full sm:w-fit backdrop-blur-sm">
              <span className="text-amber-300 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" /> 100% Genuine Casio
              </span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span className="font-medium text-white">Official 1-Year Warranty</span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> Express COD Dispatch
              </span>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleExplore(slide.targetSeries)}
                className="flex-1 sm:flex-none px-6 py-3.5 bg-white hover:bg-neutral-100 active:scale-95 text-neutral-950 font-bold tracking-wider uppercase rounded text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Discover {slide.series}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20New%20Madina%20Electronics,%20I%20am%20interested%20in%20genuine%20Casio%20watches."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="truncate">WhatsApp Boutique Inquiry</span>
              </a>

              <a
                href="#store-location"
                className="hidden sm:flex px-4 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 rounded text-xs transition-colors items-center gap-2 border border-neutral-700"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Paradise Centre Saddar</span>
              </a>
            </div>
          </div>

          {/* Visual Showcase Stage - Boutique Vitrine Display */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-neutral-700 bg-neutral-900 group">
              <img
                src={slide.image}
                alt={slide.headline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/lifestyle_hero_edifice.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex items-center justify-between text-xs text-white">
                <div>
                  <p className="font-bold text-white text-base sm:text-lg font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                    {slide.series}
                  </p>
                  <p className="text-[11px] text-neutral-300">New Madina Electronics · Saddar Karachi</p>
                </div>
                <span className="font-mono text-[10px] bg-neutral-900/90 px-2.5 py-1 rounded border border-white/20 text-amber-300 font-semibold tracking-wider uppercase">
                  Official Stock
                </span>
              </div>
            </div>

            {/* Slider Switch Controls */}
            <div className="absolute -bottom-3 right-4 sm:right-6 flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-full p-1.5 shadow-xl">
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5 px-1.5">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentSlideIndex ? 'w-6 bg-amber-400' : 'w-2 bg-neutral-600'}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length)}
                className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Collection Showcase Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
            {[
              { label: 'All Watches', query: 'All', note: 'Full Boutique Catalog' },
              { label: 'Casio Edifice', query: 'Casio Edifice', note: 'Motorsport Speed' },
              { label: 'Casio G-Shock', query: 'Casio G-Shock', note: 'Unbreakable 200M' },
              { label: 'Casio Vintage', query: 'Casio Vintage', note: 'Original 1980s Retro' },
              { label: 'Casio MTP', query: 'Casio MTP', note: 'Gentlemen Classics' },
              { label: 'Casio LTP', query: 'Casio LTP', note: 'Ladies Fine Dress' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleExplore(item.query)}
                className="shrink-0 sm:shrink min-w-[130px] sm:min-w-0 text-left p-3 rounded bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/40 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-neutral-200 group-hover:text-amber-300 transition-colors truncate tracking-wide">
                  {item.label}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
                  {item.note}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
