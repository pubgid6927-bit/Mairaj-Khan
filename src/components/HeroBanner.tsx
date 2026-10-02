import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShieldCheck, MapPin, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Award, Truck } from 'lucide-react';

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
    brandTag: 'CASIO EDIFICE · SPEED & TECH',
    headline: 'High-Performance Chronographs & Precision Engineering',
    description: 'Motorsport-inspired timepieces featuring 100M water resistance, scratch-resistant crystal, and Tough Solar light energy.',
    image: '/images/lifestyle_hero_edifice.jpg',
    targetSeries: 'Casio Edifice'
  },
  {
    id: 'gshock',
    series: 'Casio G-Shock',
    brandTag: 'CASIO G-SHOCK · ABSOLUTE TOUGHNESS',
    headline: 'The Unbreakable Legend & CasiOak Carbon Collection',
    description: 'From iconic octagonal GA-2100 Carbon Core Guard to heritage 1983 squares and Mudmaster extreme outdoor editions.',
    image: '/images/lifestyle_banner_gshock.jpg',
    targetSeries: 'Casio G-Shock'
  },
  {
    id: 'vintage',
    series: 'Casio Vintage',
    brandTag: 'CASIO VINTAGE · TIMELESS ICONS',
    headline: 'Original 1980s Retro Aesthetics & Modern Precision',
    description: 'Classic A168 ElectroLuminescence, gold mirror faces, Marty McFly calculators, and Casio Royale world time watches.',
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
    }, 6000);
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
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Editorial Copy */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-700">
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{slide.brandTag}</span>
            </div>

            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {slide.headline}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal">
              {slide.description}
            </p>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg w-full sm:w-fit">
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 100% Genuine Casio
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-medium text-slate-700">1-Year Warranty</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 flex items-center gap-1">
                <Truck className="w-3 h-3 text-slate-500 shrink-0" /> Nationwide Dispatch
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={() => handleExplore(slide.targetSeries)}
                className="flex-1 sm:flex-none px-5 py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>View {slide.series}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20New%20Madina%20Electronics,%20I%20am%20interested%20in%20genuine%20Casio%20watches."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="truncate">WhatsApp Inquiry</span>
              </a>

              <a
                href="#store-location"
                className="hidden sm:flex px-4 py-2.5 sm:py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm transition-colors items-center gap-1.5 border border-slate-300"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Paradise Centre</span>
              </a>
            </div>
          </div>

          {/* Visual Showcase Stage */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-50 group">
              <img
                src={slide.image}
                alt={slide.headline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/lifestyle_hero_edifice.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 flex items-center justify-between text-xs text-white">
                <div>
                  <p className="font-bold text-white text-sm sm:text-base">{slide.series}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-200">New Madina Electronics · Saddar, Karachi</p>
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] bg-slate-900/80 px-2 py-0.5 rounded border border-white/20 text-white font-semibold">
                  Official Pakistan Stock
                </span>
              </div>
            </div>

            {/* Slider Switch Controls */}
            <div className="absolute -bottom-2.5 right-3 sm:right-4 flex items-center gap-1.5 bg-white border border-slate-200 rounded-full p-1 shadow-md">
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                className="p-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-1 px-1">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentSlideIndex ? 'w-5 bg-slate-900' : 'w-1.5 bg-slate-300'}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length)}
                className="p-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Series Fast Navigation Row */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
            {[
              { label: 'All Watches', query: 'All', note: 'Full Collection' },
              { label: 'Casio MTP', query: 'Casio MTP', note: 'Men Classics' },
              { label: 'Casio LTP', query: 'Casio LTP', note: 'Ladies Elegant' },
              { label: 'Casio Edifice', query: 'Casio Edifice', note: 'Chronographs' },
              { label: 'Casio G-Shock', query: 'Casio G-Shock', note: '200M Toughness' },
              { label: 'Casio Vintage', query: 'Casio Vintage', note: 'Retro Heritage' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleExplore(item.query)}
                className="shrink-0 sm:shrink min-w-[120px] sm:min-w-0 text-left p-2 sm:p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 hover:border-slate-400 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors truncate">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
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
