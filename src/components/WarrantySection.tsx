import React from 'react';
import { ShieldCheck, Award, CheckCircle, FileText, Check, Sparkles } from 'lucide-react';

export const WarrantySection: React.FC = () => {
  return (
    <section id="warranty-section" className="py-14 sm:py-20 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Guaranteed Authenticity & Official Coverage</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            100% Genuine Casio Timepieces · 1-Year Official Warranty
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Every single watch sold by New Madina Electronics is sourced through verified official distribution channels. We strictly reject replicas, master copies, and unverified refurbishments.
          </p>
        </div>

        {/* 3 Pillars of Authenticity - Clean White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-slate-400 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1-Year Official Warranty</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Covers watch movement mechanics, quartz oscillator frequency, and manufacturing defects. Comes with an officially stamped New Madina Electronics warranty card from our Saddar Karachi store.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free battery replacement in year 1</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct service at Paradise Centre Saddar</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-slate-400 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3-Point Authenticity Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every digital Casio supports the hidden 3-button test which spells out <strong>"CASIO"</strong> on the LCD. All casebacks feature micro-laser etched serial numbers matching the barcode on the original Japanese packaging.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>LCD 3-Button diagnostic test verified</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Matching module and serial engravings</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-slate-400 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Complete Original Packaging</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Delivered in the original Casio presentation box (Hexagonal metal tin for G-Shock, premium presentation box for Edifice, classic vintage packaging) with manual and warranty booklet.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>G-Shock Hexagonal metal collector tins</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Casio user manual included</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Walk-in Reassurance Banner */}
        <div className="p-6 bg-gradient-to-r from-amber-50 to-slate-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Doubt about an online watch? Walk into our shop!</span>
            </h4>
            <p className="text-xs text-slate-600">
              Shop 141, First Floor, Paradise Shopping Centre, Saddar, Karachi. Inspect before you buy.
            </p>
          </div>

          <a
            href="https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20I%20have%20a%20question%20regarding%20Casio%20watch%20warranty%20and%20authenticity."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors whitespace-nowrap shadow-xs"
          >
            Ask Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
