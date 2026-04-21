import { useState } from 'react';
import { useOrders, useAllOrders } from '../hooks/useOrders';
import { useAuth } from '../store/AuthContext';
import OrderCard from '../components/OrderCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { orders: activeOrders, loading, refetch } = useOrders({ interval: 3000 });
  const { orders: allOrders } = useAllOrders({ interval: 5000 });
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState('queue'); // queue | ready

  const pendingOrders = activeOrders.filter((o) => o.status === 'pending');
  const cookingOrders = activeOrders.filter((o) => o.status === 'cooking');
  const readyOrders = (allOrders || []).filter((o) => o.status === 'ready');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-teal-500"></span>
          <p className="mt-3 text-sm text-[#64748b] font-medium">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      {/* Tab switcher */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-[#e2e8f0]">
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === 'queue' ? '#0d9488' : 'transparent',
              color: tab === 'queue' ? 'white' : '#64748b',
            }}
            onClick={() => setTab('queue')}>
            🔥 Active Queue ({activeOrders.length})
          </button>
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === 'ready' ? '#10b981' : 'transparent',
              color: tab === 'ready' ? 'white' : '#64748b',
            }}
            onClick={() => setTab('ready')}>
            ✅ Ready for Pickup ({readyOrders.length})
          </button>
        </div>

        {/* Dynamic Metric Strip */}
        <div className="flex items-center gap-6 bg-white px-6 py-2.5 rounded-2xl shadow-sm border border-[#e2e8f0]">
            <div className="text-center px-4 border-r border-[#e2e8f0]">
                <p className="text-xl font-black text-[#1e293b]">{allOrders ? allOrders.length : 0}</p>
                <p className="text-[10px] uppercase font-bold text-[#64748b]">Total</p>
            </div>
            <div className="text-center px-4 border-r border-[#e2e8f0]">
                <p className="text-xl font-black text-teal-600">{cookingOrders.length}</p>
                <p className="text-[10px] uppercase font-bold text-[#64748b]">Active</p>
            </div>
            <div className="text-center px-4">
                <p className="text-xl font-black text-[#f59e0b]">
                   {(() => {
                    if (!allOrders) return '0m';
                    const prepped = allOrders.filter(o => o.startedAt && o.completedAt);
                    if (!prepped.length) return '0m';
                    const totalMs = prepped.reduce((sum, o) => sum + (new Date(o.completedAt) - new Date(o.startedAt)), 0);
                    const avgMin = Math.round((totalMs / prepped.length) / 60000);
                    return `${avgMin}m`;
                  })()}
                </p>
                <p className="text-[10px] uppercase font-bold text-[#64748b]">Avg Time</p>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {tab === 'queue' ? (
          <>
            {activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-[#e2e8f0]">
                <span className="text-6xl mb-4 opacity-40">👨‍🍳</span>
                <h3 className="text-xl font-bold text-[#1e293b] mb-1">Kitchen is clear!</h3>
                <p className="text-sm text-[#64748b]">Waiting for new orders from cashier...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Cooking orders first, then pending */}
                {[...cookingOrders, ...pendingOrders].map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    expanded={expandedId === order.id}
                    onToggle={() => toggleExpand(order.id)}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {readyOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-[#e2e8f0]">
                <span className="text-6xl mb-4 opacity-40">⏳</span>
                <h3 className="text-xl font-bold text-[#1e293b] mb-1">No Orders Ready</h3>
                <p className="text-sm text-[#64748b]">Complete some tickets to populate this view</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {readyOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    expanded={expandedId === order.id}
                    onToggle={() => toggleExpand(order.id)}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
