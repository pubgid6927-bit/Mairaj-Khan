import React from 'react';
import { MapPin, MessageCircle, Clock, Navigation, ExternalLink, Check, Phone } from 'lucide-react';

export const StoreLocation: React.FC = () => {
  return (
    <section id="store-location" className="py-16 sm:py-24 bg-[#fbfbfa] border-t border-neutral-200 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Saddar Karachi Boutique Destination</span>
          </div>
          <h2 
            className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            New Madina Electronics Boutique
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Visit our physical timepiece gallery at Paradise Shopping Centre, Saddar to inspect any Casio watch in person, verify caseback serial numbers, and receive complimentary strap adjustments.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address, Hours, Contact Actions */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            {/* Address Card */}
            <div className="p-6 sm:p-8 bg-white border border-neutral-200/90 rounded-lg space-y-5 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-900 text-amber-300 rounded shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-950 text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                    Boutique Address
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 mt-1 leading-relaxed">
                    First Floor, Paradise Shopping Centre, Shop 141,<br />
                    Abdullah Haroon Rd, Artillery Maidan, Saddar,<br />
                    Karachi, Sindh 74400, Pakistan.
                  </p>
                  <p className="text-xs text-amber-900 font-medium mt-1.5">
                    Landmark: In the heart of Saddar Electronic & Watch Market, near Zainab Market.
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="pt-4 border-t border-neutral-100 flex items-start gap-4">
                <div className="p-3 bg-neutral-900 text-amber-300 rounded shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-neutral-950 text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                    Showroom Hours
                  </h3>
                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-700 py-1 border-b border-neutral-100">
                      <span>Monday – Saturday:</span>
                      <span className="font-mono text-neutral-950 font-bold">11:30 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between text-neutral-500 py-1">
                      <span>Sunday:</span>
                      <span className="font-mono text-neutral-500 font-medium">Closed / Appointments Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>

                <a
                  href="https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20New%20Madina%20Electronics!%20I%20am%20planning%20to%20visit%20your%20Paradise%20Centre%20Saddar%20shop."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wider uppercase rounded transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* In-Store Benefits Strip */}
            <div className="p-4 bg-white border border-neutral-200/90 rounded-lg flex flex-wrap items-center justify-around gap-3 text-xs text-neutral-700">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Live Serial Verification</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Complimentary Wrist Sizing</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Immediate In-Store Collection</span>
              </span>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Map Preview */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Storefront Visual Showcase */}
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-neutral-200 shadow-lg bg-neutral-900 group">
              <img
                src="/images/store_madina_boutique.jpg"
                alt="New Madina Electronics Boutique Vitrine Paradise Shopping Centre Saddar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/lifestyle_hero_edifice.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-white">
                <div>
                  <p className="font-bold text-white text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                    Shop 141, Paradise Shopping Centre
                  </p>
                  <p className="text-[11px] text-neutral-300">First Floor, Abdullah Haroon Rd, Saddar, Karachi</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider text-[11px]"
                >
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Direct Phone / Contact Bar */}
            <div className="p-4 bg-neutral-950 text-white rounded-lg border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Direct Phone Order Line</p>
                  <p className="text-[11px] text-neutral-400">Call during boutique hours (11:30 AM – 10:00 PM)</p>
                </div>
              </div>

              <a
                href="tel:+923213979883"
                className="font-mono text-sm font-bold text-amber-300 hover:text-white px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded transition-colors"
              >
                +92 321 3979883
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
