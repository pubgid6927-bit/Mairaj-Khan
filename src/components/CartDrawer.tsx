import React from 'react';
import { useCart, formatPKR } from '../context/CartContext';
import { UniqueLuxuryBagIcon } from './UniqueLuxuryBagIcon';
import { 
  X, 
  Trash2, 
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
    `\n\n*Cart Total:* ${formatPKR(cartTotal)}\n*Delivery Fee:* ${formatPKR(deliveryFee)}\n*Grand Total:* ${formatPKR(grandTotal)}\n\nPlease dispatch to my address.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/70 backdrop-blur-xs transition-opacity font-sans">
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between text-neutral-900 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UniqueLuxuryBagIcon className="w-5 h-5 text-neutral-950" />
                <h3 
                  className="font-bold text-neutral-950 text-sm tracking-wider uppercase font-serif"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Shopping Bag ({cartItemsCount})
                </h3>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <UniqueLuxuryBagIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                  Your Shopping Bag is Empty
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our authentic Casio collections and add your favourite timepieces to the bag.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-neutral-950 text-white font-bold tracking-wider uppercase rounded text-xs cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  Explore Watches
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  onClick={() => {
                    setSelectedProduct(item.product);
                    setIsCartOpen(false);
                  }}
                  className="p-3.5 bg-white border border-neutral-200 rounded flex gap-3 relative group hover:border-neutral-900 transition-colors cursor-pointer select-none"
                  title="Click to view watch details"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 bg-white border border-neutral-100 rounded p-1 shrink-0 flex items-center justify-center"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.model}
                      className="w-full h-full object-contain transition-transform group-hover:scale-105"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono text-xs font-bold text-neutral-950 truncate group-hover:text-amber-800 transition-colors">
                          {item.product.model}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.product.id);
                          }}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 truncate">
                        {item.product.name}
                      </p>
                    </div>

                    {/* Quantity Stepper & Item Price */}
                    <div 
                      className="flex items-center justify-between pt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center border border-neutral-200 rounded bg-neutral-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.product.id, item.quantity - 1);
                          }}
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold px-2.5 text-neutral-950 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.product.id, item.quantity + 1);
                          }}
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-extrabold text-neutral-950">
                        {formatPKR(item.product.pricePKR * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-[#fbfbfa] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Subtotal:</span>
                  <span className="font-mono font-bold text-neutral-950">{formatPKR(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Nationwide Courier:</span>
                  <span className="font-mono font-semibold text-neutral-950">
                    {formatPKR(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-neutral-950 font-serif">Estimated Total:</span>
                  <span className="font-mono text-base font-black text-neutral-950">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white font-bold tracking-wider uppercase rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <a
                  href={`https://wa.me/923213979883?text=${whatsappCartMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Quick WhatsApp Checkout</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Casio · Stamped Warranty · Saddar Karachi</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
