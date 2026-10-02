import React from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Truck,
  Plus,
  Minus
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal,
    cartItemsCount,
    setIsCheckoutOpen,
    setSelectedProduct
  } = useCart();

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal === 0 ? 0 : 350;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const whatsappCartMessage = encodeURIComponent(
    `Assalam o Alaikum New Madina Electronics! I want to order the following watches from my cart:\n\n` +
    cart.map((item, idx) => `${idx + 1}. *${item.product.model}* (${item.product.name})\n   Qty: ${item.quantity} x ${formatPKR(item.product.pricePKR)} = ${formatPKR(item.product.pricePKR * item.quantity)}`).join('\n\n') +
    `\n\n*Cart Total:* ${formatPKR(cartTotal)}\n*Delivery:* Courier Dispatch (${formatPKR(deliveryFee)})\n*Grand Total:* ${formatPKR(grandTotal)}\n\nPlease dispatch to my address.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-800">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h3 className="font-bold text-base text-slate-900">Your Shopping Bag</h3>
              <span className="font-mono text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">
                {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Itemized List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-900 text-base">Your shopping bag is empty</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Browse authentic Casio timepieces with official 1-year warranty and Saddar Karachi store pickup.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Explore Casio Watches
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsCartOpen(false);
                  }}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all cursor-pointer group"
                  title="Click to view full watch details"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-slate-300">
                    <img
                      src={product.imageUrl}
                      alt={product.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                          {product.model}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(product.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          aria-label={`Remove ${product.model}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 truncate mt-0.5 font-medium group-hover:text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {product.specs.waterResistance.split(' ')[0]} · {product.specs.bandMaterial}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center bg-white border border-slate-200 rounded-md"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, quantity - 1);
                          }}
                          className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-semibold px-2 text-slate-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, quantity + 1);
                          }}
                          className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {formatPKR(product.pricePKR * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Trust Badge */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 1-Year Official Warranty
                </span>
                <span>TCS / Leopards Courier</span>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 font-semibold tabular-nums">{formatPKR(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery Charges (Pakistan)</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {formatPKR(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-slate-900 text-base font-extrabold tabular-nums">
                    {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick WhatsApp Order */}
              <a
                href={`https://wa.me/923213979883?text=${whatsappCartMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp (+92 321 3979883)</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
