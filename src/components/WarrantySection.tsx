import React from 'react';
import { ShieldCheck, Award, CheckCircle, FileText, Check, Sparkles } from 'lucide-react';

export const WarrantySection: React.FC = () => {
  return (
    <section id="warranty-section" className="py-16 sm:py-24 bg-white border-t border-neutral-200 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-bold tracking-[0.2em] uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Guaranteed Authenticity & Official Protection</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            100% Genuine Casio Timepieces · 1-Year Official Warranty
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Every timepiece at New Madina Electronics is directly sourced through authorized distribution channels. We uphold a strict zero-tolerance policy against replicas, master copies, and unverified refurbishments.
          </p>
        </div>

        {/* 3 Pillars of Authenticity - Lifestyle Collection Boutique Framing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="p-7 bg-[#fbfbfa] border border-neutral-200/90 rounded-lg space-y-4 hover:border-neutral-900 transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded bg-neutral-900 text-amber-300 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-950 text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
              1-Year Official Warranty
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Complete coverage for Japanese internal movement mechanics, quartz oscillator frequency, and manufacturing integrity. Accompanied by our store's officially stamped physical warranty card from Saddar Karachi.
            </p>
            <ul className="text-xs text-neutral-700 space-y-2 pt-3 border-t border-neutral-200/80">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complimentary battery replacement in year 1</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct boutique service at Paradise Centre Saddar</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-7 bg-[#fbfbfa] border border-neutral-200/90 rounded-lg space-y-4 hover:border-neutral-900 transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded bg-neutral-900 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-950 text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
              3-Point Authenticity Verification
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every digital timepiece responds to the official 3-button diagnostic test displaying <strong>"CASIO"</strong> across the LCD matrix. Casebacks feature crisp micro-laser etched serials matching the genuine box packaging.
            </p>
            <ul className="text-xs text-neutral-700 space-y-2 pt-3 border-t border-neutral-200/80">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Original Casio factory box & Japanese manual</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verification welcome before payment at store</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-7 bg-[#fbfbfa] border border-neutral-200/90 rounded-lg space-y-4 hover:border-neutral-900 transition-colors shadow-2xs">
            <div className="w-12 h-12 rounded bg-neutral-900 text-amber-300 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-950 text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
              Karachi Store & Nationwide COD
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Visit our physical watch showroom at Paradise Shopping Centre, Saddar Karachi for personalized sizing and live inspection, or order online with express nationwide Cash on Delivery across Pakistan.
            </p>
            <ul className="text-xs text-neutral-700 space-y-2 pt-3 border-t border-neutral-200/80">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Express courier dispatch via TCS & Leopards</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Same-day store collection in Saddar Karachi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
