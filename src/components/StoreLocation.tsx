import React from 'react';
import { MapPin, MessageCircle, Clock, Navigation, ExternalLink, Check } from 'lucide-react';

export const StoreLocation: React.FC = () => {
  return (
    <section id="store-location" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Visit Our Physical Store In Saddar Karachi</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            New Madina Electronics Karachi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Visit us in person at Paradise Shopping Centre to inspect any Casio watch, verify serial numbers, and get instant wrist sizing.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address, Hours, Contact Actions */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            {/* Address Card */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Shop Address</h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    First Floor, Paradise Shopping Centre, Shop 141,<br />
                    Abdullah Haroon Rd, Artillery Maidan, Saddar,<br />
                    Karachi, Sindh 74400, Pakistan.
                  </p>
                  <p className="text-xs text-amber-800 font-medium mt-1">
                    Landmark: In the heart of Saddar Electronic & Watch Market, near Zainab Market.
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="pt-4 border-t border-slate-100 flex items-start gap-3.5">
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-slate-900 text-base">Store Timings</h3>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-700 py-1 border-b border-slate-100">
                      <span>Monday – Saturday:</span>
                      <span className="font-mono text-slate-900 font-bold">11:30 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between text-slate-500 py-1">
                      <span>Sunday:</span>
                      <span className="font-mono text-rose-600 font-medium">Closed / Appointments Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <a
                  href="https://wa.me/923213979883"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: +92 321 3979883</span>
                </a>
              </div>
            </div>

            {/* In-Store Benefits */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl grid grid-cols-2 gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free Bracelet Sizing On Spot</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Original Casio Hologram Card</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Genuine Battery Replacement</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash, Bank Transfer & Cards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Map Preview */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Storefront Visual Showcase */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white group">
              <img
                src="/src/assets/images/store_madina_boutique_1790538714988.jpg"
                alt="New Madina Electronics Boutique Vitrine Paradise Shopping Centre Saddar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/lifestyle_hero_edifice_1790539511747.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div>
                  <p className="font-bold text-white text-sm">Shop 141, Paradise Shopping Centre</p>
                  <p className="text-[11px] text-slate-200">First Floor, Abdullah Haroon Rd, Saddar, Karachi</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Embedded Interactive Map Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex-1 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-slate-700" />
                  Saddar Karachi Coordinates & Route
                </span>
                <span className="font-mono text-[11px] text-slate-500">Postal Code: 74400</span>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                <iframe
                  title="New Madina Electronics Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Paradise+Shopping+Centre+Saddar+Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
