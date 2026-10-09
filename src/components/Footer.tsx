import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ExternalLink, 
  Mail, 
  Check, 
  CreditCard, 
  Truck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast, setActiveSeries } = useCart();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubscribed(true);
    addToast('Thank you! You are now subscribed to New Madina Electronics boutique updates.');
    setEmailInput('');
  };

  const handleSeriesClick = (series: string) => {
    setActiveSeries(series);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0f1115] border-t border-neutral-800 text-neutral-400 text-xs font-sans">
      
      {/* 1. Newsletter Signup Strip - LifeStyle Collection Exact Replica */}
      <div className="border-b border-neutral-800/80 bg-[#14161d] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left max-w-lg">
            <h3 
              className="text-base sm:text-xl font-bold tracking-[0.14em] uppercase text-white font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Subscribe to Our Boutique Journal
            </h3>
            <p className="text-neutral-400 text-xs">
              Be the first to discover new Casio Edifice, G-Shock, and Vintage arrivals with official stamped warranty in Pakistan.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="w-full md:w-auto flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 pl-10 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white hover:bg-neutral-200 text-neutral-950 font-bold tracking-wider uppercase rounded text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              {isSubscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <h4 
              className="text-base font-bold text-white tracking-widest uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              New Madina Electronics
            </h4>
            <p className="text-neutral-400 leading-relaxed text-xs">
              Premier retailer of 100% Genuine Casio Timepieces in Karachi, Pakistan. Sourced through authorized channels with official 1-year stamped warranty cards.
            </p>
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Official 1-Year Stamped Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Express TCS / Leopards Courier All Pakistan</span>
            </div>
          </div>

          {/* Column 2: Casio Collections */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
              Casio Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Casio Edifice (Motorsport)', filter: 'Casio Edifice' },
                { name: 'Casio G-Shock (200M Tough)', filter: 'Casio G-Shock' },
                { name: 'Casio Vintage (1980s Retro)', filter: 'Casio Vintage' },
                { name: 'Casio MTP (Men Classics)', filter: 'Casio MTP' },
                { name: 'Casio LTP (Ladies Dress)', filter: 'Casio LTP' },
                { name: 'Casio ProTrek (Solar Outdoor)', filter: 'Casio ProTrek' }
              ].map((c) => (
                <li key={c.filter}>
                  <button
                    onClick={() => handleSeriesClick(c.filter)}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-neutral-600" />
                    <span>{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care & Warranty */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
              Customer Care & Service
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#warranty-section" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-neutral-600" />
                  <span>1-Year Stamped Official Warranty</span>
                </a>
              </li>
              <li>
                <a href="#warranty-section" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-neutral-600" />
                  <span>3-Point Authenticity Verification Test</span>
                </a>
              </li>
              <li>
                <a href="#store-location" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-neutral-600" />
                  <span>Complimentary Wrist Sizing at Store</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20New%20Madina%20Electronics!%20I%20have%20an%20order%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-neutral-600" />
                  <span>Instant WhatsApp Order Assistance</span>
                </a>
              </li>
              <li>
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-neutral-600" />
                  <span>Nationwide Cash on Delivery (COD)</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Saddar Boutique & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
              Saddar Showroom
            </h4>
            <p className="text-neutral-300 leading-relaxed text-xs">
              First Floor, Paradise Shopping Centre, Shop 141,<br />
              Abdullah Haroon Rd, Artillery Maidan, Saddar,<br />
              Karachi, Sindh 74400, Pakistan.
            </p>
            
            <div className="pt-1 space-y-1 text-xs">
              <div className="flex justify-between py-0.5 border-b border-neutral-800">
                <span className="text-neutral-400">Mon – Sat:</span>
                <span className="font-mono text-white">11:30 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-neutral-400">Sunday:</span>
                <span className="text-neutral-500">Closed / Appointments</span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5 font-mono text-xs">
              <a 
                href="tel:+923213979883" 
                className="flex items-center gap-2 text-neutral-200 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+92 321 3979883</span>
              </a>
              <a 
                href="https://wa.me/923213979883" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Line: 0321-3979883</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Payment Method Badges & Authenticity Verification Banner */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] mr-2">Payment Methods:</span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 font-mono text-[11px]">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 font-mono text-[11px]">
              Meezan Bank Direct
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 font-mono text-[11px]">
              HBL Transfer
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 font-mono text-[11px]">
              JazzCash
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 font-mono text-[11px]">
              EasyPaisa
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>100% Genuine Casio Guarantee</span>
            </span>
            <span className="text-neutral-700">|</span>
            <a
              href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white flex items-center gap-1 underline"
            >
              <span>Saddar Store Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 4. Bottom Quiet Copyright Bar */}
        <div className="pt-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} New Madina Electronics. All Rights Reserved. Authorized Casio Watch Boutique, Saddar Karachi, Pakistan.</p>
          <div className="flex items-center gap-4">
            <span>Genuine Casio Guarantee</span>
            <span>·</span>
            <span>1-Year Official Warranty</span>
            <span>·</span>
            <span className="text-neutral-400">Shop 141 Paradise Centre</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
