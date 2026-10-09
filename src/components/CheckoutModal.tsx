import React, { useState } from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { CustomerDetails, PaymentMethodType, Order } from '../types';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Wallet, 
  Banknote, 
  MessageCircle, 
  Check, 
  Copy 
} from 'lucide-react';
import { saveOrderInSupabase } from '../lib/supabase';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, cartTotal, clearCart, setCompletedOrder, addToast } = useCart();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Karachi',
    address: '',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = cartTotal >= 15000 ? 0 : 350;
  const grandTotal = cartTotal + deliveryFee;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied ${fieldName} to clipboard!`);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!customer.phone.trim()) {
      errors.phone = 'Mobile or WhatsApp number is required.';
    } else if (customer.phone.replace(/[^0-9]/g, '').length < 10) {
      errors.phone = 'Please enter a valid 11-digit mobile number.';
    }
    if (!customer.address.trim()) errors.address = 'Full street address is required for delivery.';
    if (!customer.city.trim()) errors.city = 'City is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const orderId = `NME-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      orderId,
      createdAt: new Date().toISOString(),
      items: [...cart],
      customer,
      paymentMethod,
      subtotal: cartTotal,
      deliveryFee,
      total: grandTotal,
      status: 'Pending Verification'
    };

    // Save order asynchronously to Supabase
    saveOrderInSupabase({
      orderNumber: orderId,
      customer,
      paymentMethod,
      totalPKR: grandTotal,
      items: cart.map((c) => ({
        productId: c.product.id,
        model: c.product.model,
        name: c.product.name,
        pricePKR: c.product.pricePKR,
        quantity: c.quantity
      }))
    }).catch((err) => console.warn('Supabase order save error:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      setCompletedOrder(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 my-6 text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Secure Checkout · New Madina Electronics
            </h3>
            <p className="text-xs text-slate-500">
              100% Genuine Casio Timepieces · 1-Year Official Warranty
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Order Summary Pill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Ordering: </span>
              <strong className="text-slate-900">{cart.length} Models ({cart.reduce((s, i) => s + i.quantity, 0)} Items)</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Grand Total: </span>
              <strong className="font-mono text-slate-900 text-sm tabular-nums font-bold">
                {formatPKR(grandTotal)}
              </strong>
            </div>
          </div>

          {/* Customer Shipping Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>1. Customer & Shipping Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Bilal"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 ${
                    formErrors.fullName ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0321 1234567"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 ${
                    formErrors.phone ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  City / Destination <span className="text-rose-500">*</span>
                </label>
                <select
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 cursor-pointer"
                >
                  <option value="Karachi">Karachi (Same-Day / Store Pickup Available)</option>
                  <option value="Lahore">Lahore (1-2 Days TCS Express)</option>
                  <option value="Islamabad">Islamabad (1-2 Days TCS Express)</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Multan">Multan</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Other City">Other City (All Pakistan)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 mb-1 font-semibold">
                  Complete Delivery Address (House / Office / Area) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flat 304, Al-Noor Heights, Block 7, Gulshan-e-Iqbal, Karachi (Near Disco Bakery)"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 text-xs ${
                    formErrors.address ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-rose-500 text-[11px] mt-0.5">{formErrors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-slate-700" />
              <span>2. Select Payment System</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Option 1: COD */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <Banknote className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-amber-400' : 'text-emerald-600'}`} />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-amber-500"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'cod' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Pay cash to TCS/Leopards rider upon delivery. Inspection allowed.
                </p>
              </label>

              {/* Option 2: Bank Transfer */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <CreditCard className={`w-4 h-4 ${paymentMethod === 'bank_transfer' ? 'text-amber-400' : 'text-sky-600'}`} />
                    <span>Direct Bank Transfer</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-amber-500"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'bank_transfer' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Meezan Bank / HBL instant transfer with screenshot receipt.
                </p>
              </label>

              {/* Option 3: JazzCash / EasyPaisa */}
              <label
                onClick={() => setPaymentMethod('jazzcash_easypaisa')}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'jazzcash_easypaisa'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <Wallet className={`w-4 h-4 ${paymentMethod === 'jazzcash_easypaisa' ? 'text-amber-400' : 'text-orange-600'}`} />
                    <span>JazzCash / EasyPaisa</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'jazzcash_easypaisa'}
                    onChange={() => setPaymentMethod('jazzcash_easypaisa')}
                    className="accent-amber-500"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'jazzcash_easypaisa' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Instant mobile wallet transfer to 0321-3979883.
                </p>
              </label>

              {/* Option 4: Direct WhatsApp Confirmation */}
              <label
                onClick={() => setPaymentMethod('whatsapp_order')}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'whatsapp_order'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <MessageCircle className={`w-4 h-4 ${paymentMethod === 'whatsapp_order' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span>WhatsApp Fast Dispatch</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'whatsapp_order'}
                    onChange={() => setPaymentMethod('whatsapp_order')}
                    className="accent-amber-500"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'whatsapp_order' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Confirm order immediately with our Saddar shopkeeper via WhatsApp.
                </p>
              </label>
            </div>

            {/* Dynamic Bank details */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-sky-900">Meezan Bank Account Details</strong>
                  <span className="text-[11px] text-sky-700">Saddar Karachi Branch</span>
                </div>
                <div className="font-mono bg-white p-2.5 rounded border border-sky-200 space-y-1 text-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account Title:</span>
                    <span className="text-slate-900 font-bold">New Madina Electronics</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">IBAN:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">PK55 MEZN 0014 0102 3891 01</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('PK55MEZN00140102389101', 'IBAN')}
                        className="text-sky-700 hover:text-sky-950 cursor-pointer"
                        title="Copy IBAN"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'jazzcash_easypaisa' && (
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl space-y-2 text-xs">
                <strong className="text-orange-950">JazzCash & EasyPaisa Account</strong>
                <div className="font-mono bg-white p-2.5 rounded border border-orange-200 space-y-1 text-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mobile Account:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold text-sm">0321-3979883</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('03213979883', 'Mobile Account')}
                        className="text-orange-700 hover:text-orange-950 cursor-pointer"
                        title="Copy Number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account Title:</span>
                    <span className="text-slate-900 font-bold">New Madina Electronics / Muhammad Tariq</span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-start gap-2 text-emerald-800">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  Cash on Delivery confirmed. You will receive an automated phone call or WhatsApp message for dispatch confirmation before rider pickup.
                </span>
              </div>
            )}
          </div>

          {/* Pricing Total Details */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Cart Subtotal</span>
              <span className="font-mono text-slate-900 font-semibold tabular-nums">{formatPKR(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Nationwide Courier Fee</span>
              <span className="font-mono text-slate-900 font-semibold tabular-nums">
                {formatPKR(deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total Payable (PKR)</span>
              <span className="font-mono text-slate-900 text-lg tabular-nums font-extrabold">
                {formatPKR(grandTotal)}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating Order Receipt...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Confirm Order · {formatPKR(grandTotal)}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              All watches come with 1-Year Official Warranty stamped by New Madina Electronics Saddar.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
