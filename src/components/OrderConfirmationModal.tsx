import React from 'react';
import { Order } from '../types';
import { formatPKR } from '../context/CartContext';
import { 
  CheckCircle, 
  MessageCircle, 
  Printer, 
  X, 
  Truck
} from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const whatsappReceiptMessage = encodeURIComponent(
    `*NEW MADINA ELECTRONICS - ORDER CONFIRMATION*\n\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Date:* ${new Date(order.createdAt).toLocaleDateString('en-GB')}\n` +
    `*Customer:* ${order.customer.fullName}\n` +
    `*Phone:* ${order.customer.phone}\n` +
    `*City:* ${order.customer.city}\n` +
    `*Address:* ${order.customer.address}\n` +
    `*Payment Method:* ${order.paymentMethod.toUpperCase()}\n\n` +
    `*Items Ordered:*\n` +
    order.items.map((i, idx) => `${idx + 1}. ${i.product.model} - ${i.product.name} (Qty: ${i.quantity}) = ${formatPKR(i.product.pricePKR * i.quantity)}`).join('\n') +
    `\n\n*Subtotal:* ${formatPKR(order.subtotal)}\n` +
    `*Delivery:* ${formatPKR(order.deliveryFee)}\n` +
    `*Grand Total:* ${formatPKR(order.total)}\n\n` +
    `Please confirm order dispatch from Paradise Shopping Centre Saddar, Karachi.`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 my-6 text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-600 font-mono">Invoice #{order.orderId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
            aria-label="Close invoice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Success Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <p className="text-xs sm:text-sm font-bold text-emerald-900">
              Shukriya {order.customer.fullName}! Your order has been placed successfully.
            </p>
            <p className="text-xs text-emerald-700">
              Our team at Paradise Shopping Centre, Saddar, Karachi will prepare your genuine Casio timepiece with stamped 1-year warranty card.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Delivery To:</span>
              <p className="text-slate-900 font-bold">{order.customer.fullName}</p>
              <p className="text-slate-700">{order.customer.phone}</p>
              <p className="text-slate-600 mt-1">{order.customer.address}, {order.customer.city}</p>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Order Summary:</span>
              <p className="text-slate-900 font-mono">Status: <span className="text-emerald-700 font-bold">{order.status}</span></p>
              <p className="text-slate-700 capitalize">Payment: {order.paymentMethod.replace('_', ' ')}</p>
              <p className="text-slate-600 mt-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimated: 24h Karachi / 2-3 Days Nationwide</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Purchased Timepieces
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded p-1 shrink-0 flex items-center justify-center border border-slate-100">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.model}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-slate-900">{item.product.model}</div>
                      <div className="text-slate-600 text-[11px] line-clamp-1">{item.product.name}</div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>

                  <div className="font-mono text-slate-900 text-right tabular-nums font-bold">
                    {formatPKR(item.product.pricePKR * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-semibold tabular-nums">{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-mono text-slate-900 font-semibold tabular-nums">
                {formatPKR(order.deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="font-mono text-slate-900 text-base font-extrabold tabular-nums">
                {formatPKR(order.total)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 print:hidden">
            <a
              href={`https://wa.me/923213979883?text=${whatsappReceiptMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Order Copy to WhatsApp (+92 321 3979883)</span>
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-300 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
