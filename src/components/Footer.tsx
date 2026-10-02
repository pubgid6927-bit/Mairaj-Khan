import React from 'react';
import { ShieldCheck, MapPin, Phone, MessageCircle, Clock, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 
              className="text-base font-bold text-white tracking-wider uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              New Madina Electronics
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs">
              Retailer of 100% Genuine Casio Timepieces in Karachi, Pakistan. Official 1-Year Warranty on Casio MTP, LTP, Edifice, G-Shock, Vintage, and ProTrek collections.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Official 1-Year Stamped Warranty</span>
            </div>
          </div>

          {/* Shop Physical Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Saddar Store Address
            </h4>
            <p className="text-slate-300 leading-relaxed">
              First Floor, Paradise Shopping Centre, Shop 141,<br />
              Abdullah Haroon Rd, Artillery Maidan, Saddar,<br />
              Karachi, Sindh 74400, Pakistan.
            </p>
            <a
              href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors pt-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View On Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Store Hours & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Store Timings & Orders
            </h4>
            <div className="space-y-1">
              <p className="flex justify-between">
                <span>Mon – Sat:</span>
                <span className="font-mono text-white">11:30 AM – 10:00 PM</span>
              </p>
              <p className="flex justify-between text-slate-500">
                <span>Sunday:</span>
                <span>Closed / Appointments</span>
              </p>
            </div>
            <div className="pt-2 space-y-1 font-mono">
              <a 
                href="tel:+923213979883" 
                className="flex items-center gap-2 hover:text-white transition-colors"
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
                <span>WhatsApp Order Line</span>
              </a>
            </div>
          </div>

          {/* Nationwide Dispatch */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Delivery & Payments
            </h4>
            <p className="leading-relaxed">
              Nationwide express courier dispatch via TCS, Leopards, and Trax. Fast same-day delivery across Karachi.
            </p>
            <div className="pt-2 space-y-1 text-slate-300">
              <p>• Cash on Delivery (COD) All Pakistan</p>
              <p>• Meezan Bank / HBL Direct Transfer</p>
              <p>• JazzCash & EasyPaisa Wallets</p>
            </div>
          </div>
        </div>

        {/* Bottom Quiet Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} New Madina Electronics. Genuine Casio Timepieces, Karachi, Pakistan. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Genuine Casio Guarantee</span>
            <span>·</span>
            <span>1-Year Official Warranty</span>
            <span>·</span>
            <a href="https://maps.app.goo.gl/mtfksLzuMSzJgqvq8" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">
              Saddar Store
            </a>
            {onOpenAdmin && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-400 text-slate-400 transition-colors inline-flex items-center gap-1 cursor-pointer font-mono"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
