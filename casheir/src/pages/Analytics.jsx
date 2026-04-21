import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/formatCurrency';

export default function Analytics() {
  const { orders, loading: ordersLoading } = useOrders({ poll: false });
  const { products, loading: productsLoading } = useProducts();

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  const safeOrders = orders || [];
  const doneOrders = safeOrders.filter(o => o.status === 'done' || o.status === 'served');
  const totalRevenue = doneOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalItemsSold = doneOrders.reduce((s, o) => s + (o.items || []).reduce((a, i) => a + (i.qty || 0), 0), 0);
  const avgOrderValue = doneOrders.length > 0 ? totalRevenue / doneOrders.length : 0;

  // Top selling products
  const productFreq = {};
  safeOrders.forEach(order => {
    (order.items || []).forEach(item => {
      const name = item.name || 'Unknown';
      productFreq[name] = (productFreq[name] || 0) + (item.qty || 0);
    });
  });
  const topProducts = Object.entries(productFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Orders by status
  const statusCounts = {
    pending: safeOrders.filter(o => o.status === 'pending').length,
    preparing: safeOrders.filter(o => o.status === 'cooking' || o.status === 'preparing').length,
    done: doneOrders.length,
  };

  // Revenue by hour (from done orders)
  const hourlyRevenue = {};
  doneOrders.forEach(o => {
    const hour = o.readableTime || new Date(o.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const h = hour.split(':')[0];
    hourlyRevenue[h] = (hourlyRevenue[h] || 0) + (o.total || 0);
  });

  return (
    <div className="flex flex-col h-full bg-white px-8 py-6 pb-20 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1e293b]">Analytics</h2>
        <p className="text-sm text-[#64748b] mt-1">Sales performance and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '💰', color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Total Orders', value: safeOrders.length, icon: '📦', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Items Sold', value: totalItemsSold, icon: '🍔', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">{stat.label}</p>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#1e293b] mb-4">🔥 Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map(([name, qty], idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-black">#{idx + 1}</span>
                  <span className="font-bold text-sm text-[#1e293b]">{name}</span>
                </div>
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-black">{qty} sold</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-center text-sm text-[#94a3b8] py-4">No data yet</p>}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#1e293b] mb-4">📋 Order Status Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Pending', count: statusCounts.pending, color: '#f59e0b', bg: 'bg-yellow-50' },
              { label: 'Preparing', count: statusCounts.preparing, color: '#3b82f6', bg: 'bg-blue-50' },
              { label: 'Completed', count: statusCounts.done, color: '#10b981', bg: 'bg-green-50' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-[#64748b]">{label}</span>
                  <span className="text-[#1e293b]">{count}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: color, width: `${safeOrders.length ? (count / safeOrders.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Revenue */}
          <h3 className="font-bold text-[#1e293b] mt-8 mb-4">⏰ Revenue by Hour</h3>
          <div className="space-y-2">
            {Object.entries(hourlyRevenue).sort().map(([hour, rev]) => (
              <div key={hour} className="flex items-center justify-between bg-white p-2 px-3 rounded-lg border border-gray-50 text-sm">
                <span className="font-bold text-[#64748b]">{hour}:00</span>
                <span className="font-black text-teal-600">{formatCurrency(rev)}</span>
              </div>
            ))}
            {Object.keys(hourlyRevenue).length === 0 && <p className="text-center text-sm text-[#94a3b8] py-4">No revenue data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
