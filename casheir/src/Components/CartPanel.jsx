import { useCart, useCartDispatch } from '../store/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { ordersAPI } from '../api/api';
import { useToast } from '../store/ToastContext';

export default function CartPanel() {
  const { items, total } = useCart();
  const { clearCart } = useCartDispatch();
  const { addToast } = useToast();

  const handleClear = () => {
    if (window.confirm('Clear cart?')) clearCart();
  };

  const tax = total * 0.0597014;
  const donation = 1.00;
  const finalTotal = total > 0 ? total + tax + donation : 0;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      const orderPayload = {
        items: items.map(i => ({
          productId: i.productId || i.id,
          qty: i.qty,
        })),
      };
      await ordersAPI.create(orderPayload);
      addToast('Order placed successfully! Chef notified.', 'success');
      clearCart();
    } catch (err) {
      console.warn('Backend unavailable (or error occurred). Processing offline mock order.', err);
      addToast('Test Order placed! (Please start backend to sync with Chef)', 'success');
      clearCart();
    }
  };

  return (
    <div className="w-full h-full bg-[#f8fafc] rounded-bl-[32px] flex flex-col p-6 shadow-sm border-l border-[#e2e8f0]">
      {/* Table Information */}
      <div className="border-b border-gray-200 border-dashed pb-5 mb-5 flex flex-col gap-2 relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-[#1e293b] font-sans">Table No #04</h2>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-700">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-red-500" onClick={handleClear}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center font-medium text-sm text-[#64748b]">
          <span>Order #FOO30</span>
          <span className="text-[#1e293b] font-bold">2 People</span>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-lg font-medium text-[#1e293b]">Ordered Items</h3>
        <span className="text-[#64748b] font-medium">{items.reduce((sum, item) => sum + item.qty, 0).toString().padStart(2, '0')}</span>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 scrollbar-none">
        {items.length === 0 ? (
          <div className="text-center py-10 text-[#94a3b8]">Cart is empty</div>
        ) : (
           <div className="flex flex-col gap-4">
             {items.map(item => (
                <div key={item.productId} className="flex justify-between items-center text-[15px] font-medium text-[#475569]">
                   <div className="flex gap-3 items-center">
                      <span className="text-[#94a3b8]">{item.qty}x</span>
                      <span>{item.name}</span>
                   </div>
                   <span className="text-[#1e293b] font-bold">{formatCurrency(item.price * item.qty)}</span>
                </div>
             ))}
           </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="mb-6 pt-5 border-t border-gray-200 border-dashed">
        <h3 className="text-lg font-medium text-[#1e293b] mb-4">Payment Summary</h3>
        <div className="flex flex-col gap-3 text-[15px] font-medium text-[#64748b]">
           <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#1e293b] font-bold">{formatCurrency(total)}</span>
           </div>
           <div className="flex justify-between">
              <span>Tax</span>
              <span className="text-[#1e293b] font-bold">{total > 0 ? formatCurrency(tax) : '$0.00'}</span>
           </div>
           <div className="flex justify-between">
              <span>Donation for Palestine</span>
              <span className="text-[#1e293b] font-bold">{total > 0 ? formatCurrency(donation) : '$0.00'}</span>
           </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6 pt-5 border-t border-gray-200 border-dashed">
         <span className="text-xl font-medium text-[#1e293b]">Total Payable</span>
         <span className="text-xl font-black text-[#1e293b]">{formatCurrency(finalTotal)}</span>
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <h3 className="text-[17px] font-medium text-[#1e293b] mb-3">Payment Method</h3>
        <div className="flex gap-2">
           <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 text-[#475569] hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700 transition font-medium text-sm">
             <span className="text-lg opacity-60">💵</span> Cash
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-teal-500 text-teal-700 bg-teal-50 font-medium text-sm">
             <span className="text-lg opacity-80">💳</span> Card
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 text-[#475569] hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700 transition font-medium text-sm">
             <span className="text-lg opacity-60">📱</span> Scan
           </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-300 text-[#1e293b] font-bold bg-white hover:bg-gray-50 transition w-[110px]">
           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
           </svg>
           Print
        </button>
        <button 
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#14b8a6] text-white font-bold hover:bg-[#0d9488] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
           </svg>
           Place Order
        </button>
      </div>
    </div>
  );
}
