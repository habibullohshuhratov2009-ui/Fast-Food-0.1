import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils/formatCurrency';
import { Link } from 'react-router-dom';

const statusFilters = [
  { value: '', label: 'All', icon: '📋' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'cooking', label: 'Preparing', icon: '🔥' },
  { value: 'ready', label: 'Ready', icon: '✅' },
  { value: 'done', label: 'Completed', icon: '✓' },
];

const statusStyles = {
  pending: 'bg-orange-50 text-orange-700',
  cooking: 'bg-blue-50 text-blue-700',
  preparing: 'bg-blue-50 text-blue-700',
  ready: 'bg-green-50 text-green-700',
  done: 'bg-purple-50 text-purple-700',
  served: 'bg-gray-100 text-gray-600',
};

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('');
  const { orders, loading } = useOrders({ poll: true, status: statusFilter });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  const safeOrders = orders || [];

  return (
    <div className="flex flex-col h-full bg-white px-8 py-6 pb-20 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Orders</h2>
          <p className="text-sm text-[#64748b] mt-1">{safeOrders.length} orders found</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-[#64748b]">Live updates</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === f.value ? 'bg-teal-500 text-white shadow-sm' : 'bg-gray-100 text-[#64748b] hover:bg-gray-200'
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {safeOrders.length === 0 ? (
        <div className="text-center py-20 text-[#94a3b8]">
          <span className="text-5xl block mb-4">📋</span>
          <p className="font-bold text-lg">No orders found</p>
          <p className="text-sm mt-1">{statusFilter ? `No ${statusFilter} orders right now` : 'Create one from POS!'}</p>
          <Link to="/pos" className="inline-block mt-4 bg-teal-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-teal-600">Go to POS</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {safeOrders.map(order => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between bg-[#f8fafc] border border-gray-100 p-4 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center font-black text-sm text-[#1e293b]">
                  #{typeof order.id === 'number' ? order.id : String(order.id).slice(0,4).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1e293b]">{order.items?.length || 0} items • {formatCurrency(order.total)}</p>
                  <p className="text-xs text-[#64748b] font-medium mt-0.5">
                    🕐 {order.readableTime || new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
