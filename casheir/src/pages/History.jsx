import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils/formatCurrency';

export default function History() {
  const { orders, loading } = useOrders({ poll: false });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  const safeOrders = orders || [];
  const completedOrders = safeOrders.filter(o => o.status === 'done' || o.status === 'served');
  const totalRevenue = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalItems = completedOrders.reduce((s, o) => s + (o.items || []).reduce((a, i) => a + (i.qty || 0), 0), 0);

  return (
    <div className="flex flex-col h-full bg-white px-8 py-6 pb-20 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1e293b]">Order History</h2>
        <p className="text-sm text-[#64748b] mt-1">Completed and served orders archive</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-5">
          <p className="text-[10px] font-bold uppercase text-[#94a3b8]">Completed Orders</p>
          <p className="text-2xl font-black text-[#1e293b] mt-1">{completedOrders.length}</p>
        </div>
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-5">
          <p className="text-[10px] font-bold uppercase text-[#94a3b8]">Total Revenue</p>
          <p className="text-2xl font-black text-teal-600 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-5">
          <p className="text-[10px] font-bold uppercase text-[#94a3b8]">Items Sold</p>
          <p className="text-2xl font-black text-[#1e293b] mt-1">{totalItems}</p>
        </div>
      </div>

      {/* Orders */}
      {completedOrders.length === 0 ? (
        <div className="text-center py-20 text-[#94a3b8]">
          <span className="text-5xl block mb-4">📜</span>
          <p className="font-bold">No completed orders yet</p>
          <p className="text-sm mt-1">Served orders will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {completedOrders.map(o => (
            <div key={o.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:border-teal-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-sm text-[#1e293b]">
                  #{typeof o.id === 'number' ? o.id : String(o.id).slice(0,6).toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full">{o.status}</span>
              </div>
              <div className="space-y-1 mb-3">
                {(o.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-[#64748b]">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-[#94a3b8] font-medium">
                  🕐 {o.readableTime || new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-black text-[#1e293b]">{formatCurrency(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
