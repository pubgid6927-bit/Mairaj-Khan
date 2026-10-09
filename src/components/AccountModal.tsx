import React, { useState } from 'react';
import { X, User, Phone, Package, ShieldCheck, MapPin, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useCart();
  const [activeTab, setActiveTab] = useState<'login' | 'track'>('login');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      addToast('Please enter your Order Number (e.g. NME-123456)', 'info');
      return;
    }
    setTrackResult(`Order ${orderNumber.trim().toUpperCase()} verified: Dispatched from Saddar Karachi store via Express Courier.`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      addToast('Please enter your phone number.', 'info');
      return;
    }
    addToast('Welcome! Logged in to your New Madina Electronics customer profile.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-200 border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-950 text-sm uppercase tracking-wider font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                Customer Account
              </h3>
              <p className="text-[10px] text-neutral-500">New Madina Electronics · Saddar Karachi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 text-xs">
          <button
            onClick={() => { setActiveTab('login'); setTrackResult(null); }}
            className={`flex-1 py-2 font-bold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Sign In / Register
          </button>
          <button
            onClick={() => { setActiveTab('track'); }}
            className={`flex-1 py-2 font-bold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
              activeTab === 'track'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Track Order
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Sign in with your mobile number to view past orders, track dispatch status, and manage saved Casio watch warranties.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Mobile Number (Pakistan) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">+92</span>
                <input
                  type="tel"
                  required
                  placeholder="321 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 border border-neutral-300 rounded font-mono text-xs focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Continue with Phone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Official Warranty</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Saddar Karachi</span>
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTrackOrder} className="space-y-3.5 text-xs">
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Enter the Order ID received upon checkout or in your WhatsApp receipt to track delivery.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NME-847291"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-xs uppercase focus:outline-none focus:border-neutral-950"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Delivery</span>
            </button>

            {trackResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order Status Verified</span>
                </div>
                <p className="leading-relaxed">{trackResult}</p>
                <a
                  href={`https://wa.me/923213979883?text=Assalam%20o%20Alaikum%20New%20Madina%20Electronics!%20Checking%20status%20for%20order%20${encodeURIComponent(orderNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-emerald-700 font-bold underline pt-1"
                >
                  Direct WhatsApp Inquiry (+92 321 3979883)
                </a>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
