import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils/formatCurrency';
import { ordersAPI } from '../api/api';
import { useToast } from '../store/ToastContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { orders, loading, refetch } = useOrders({ poll: true });
  const { addToast } = useToast();

  const handleComplete = async (id) => {
    try {
      await ordersAPI.update(id, { status: 'done' });
      addToast('Order completed', 'success');
      refetch();
    } catch { addToast('Failed to complete', 'error'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  const safeOrders = orders || [];
  const pending = safeOrders.filter(o => o.status === 'pending');
  const preparing = safeOrders.filter(o => o.status === 'cooking' || o.status === 'preparing');
  const ready = safeOrders.filter(o => o.status === 'ready');
  const done = safeOrders.filter(o => o.status === 'done' || o.status === 'served');

  return (
    <div className="flex flex-col h-full bg-white px-6 py-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Live Status Board</h2>
          <p className="text-sm text-[#64748b] mt-0.5">Real-time order tracking • {safeOrders.length} total orders</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-green-700">Live</span>
          </div>
          <Link to="/pos" className="bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-600 transition-all active:scale-95">
            + New Order
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Pending', count: pending.length, icon: '⏳', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Preparing', count: preparing.length, icon: '🔥', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Ready', count: ready.length, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completed', count: done.length, icon: '📦', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#f8fafc] border border-gray-100 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#94a3b8]">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Three-column board */}
      <div className="flex-1 grid grid-cols-3 gap-5 min-h-0 overflow-hidden">
        {/* PENDING */}
        <div className="flex flex-col bg-[#f8fafc] rounded-2xl border border-gray-100 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm text-[#1e293b] flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs">⏳</span>
              New Orders
            </h3>
            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-black text-[#475569] border border-gray-200">{pending.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {pending.map(o => (
              <OrderCard key={o.id} order={o} variant="pending" />
            ))}
            {pending.length === 0 && <EmptyCol text="No pending orders" />}
          </div>
        </div>

        {/* PREPARING */}
        <div className="flex flex-col bg-[#f8fafc] rounded-2xl border border-gray-100 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm text-[#1e293b] flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">🔥</span>
              Preparing
            </h3>
            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-black text-[#475569] border border-gray-200">{preparing.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {preparing.map(o => (
              <OrderCard key={o.id} order={o} variant="preparing" />
            ))}
            {preparing.length === 0 && <EmptyCol text="Kitchen idle" />}
          </div>
        </div>

        {/* READY */}
        <div className="flex flex-col bg-[#f8fafc] rounded-2xl border border-gray-100 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm text-[#1e293b] flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-xs">✅</span>
              Ready
            </h3>
            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-black text-[#475569] border border-gray-200">{ready.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {ready.map(o => (
              <div key={o.id}>
                <OrderCard order={o} variant="ready" />
                <button
                  onClick={() => handleComplete(o.id)}
                  className="w-full mt-2 bg-teal-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-teal-600 active:scale-95 transition-all"
                >
                  ✓ Mark Complete
                </button>
              </div>
            ))}
            {ready.length === 0 && <EmptyCol text="Nothing ready" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, variant }) {
  const o = order;
  const borderMap = { pending: 'border-orange-200', preparing: 'border-blue-200', ready: 'border-green-200' };
  const bgMap = { pending: 'bg-white', preparing: 'bg-white', ready: 'bg-green-50' };

  return (
    <div className={`p-3 rounded-xl border ${borderMap[variant] || 'border-gray-100'} ${bgMap[variant] || 'bg-white'} shadow-sm`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-black text-sm text-[#1e293b]">#{typeof o.id === 'number' ? o.id : String(o.id).slice(0,6).toUpperCase()}</span>
        <span className="text-xs font-bold text-[#64748b]">
          🕐 {o.readableTime || new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p className="text-xs text-[#94a3b8] font-medium mb-2">{o.items?.length || 0} items • {formatCurrency(o.total)}</p>
      <div className="flex gap-1 flex-wrap">
        {(o.items || []).slice(0, 3).map((it, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#64748b] font-medium">{it.qty}x {it.name}</span>
        ))}
        {(o.items || []).length > 3 && <span className="text-[10px] text-gray-400">+{o.items.length - 3}</span>}
      </div>
    </div>
  );
}

function EmptyCol({ text }) {
  return <p className="text-center py-8 text-[10px] font-bold text-[#cbd5e1] uppercase tracking-widest">{text}</p>;
}
