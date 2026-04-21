import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useOrders } from '../hooks/useOrders';
import { useCartDispatch } from '../store/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import ProductCard from '../components/ProductCard';
import CartPanel from '../components/CartPanel';

const statusColors = {
  pending: { bg: 'bg-[#fef3c7]', badge: 'bg-[#b45309]', label: 'Pending' },
  cooking: { bg: 'bg-[#ccfbf1]', badge: 'bg-[#115e59]', label: 'In Kitchen' },
  preparing: { bg: 'bg-[#ccfbf1]', badge: 'bg-[#115e59]', label: 'In Kitchen' },
  ready: { bg: 'bg-[#f3e8ff]', badge: 'bg-[#7e22ce]', label: 'Ready' },
};

export default function POS() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { orders } = useOrders({ poll: true });
  const { addItem } = useCartDispatch();
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredProducts = useMemo(() => {
    let filtered = (products || []).filter(p => p.available !== false);
    if (activeCategory) {
      filtered = filtered.filter((p) => p.categoryId === activeCategory);
    }
    return filtered;
  }, [products, activeCategory]);

  const categoryMap = useMemo(() => {
    const map = {};
    (categories || []).forEach(c => { map[c.id] = c; });
    return map;
  }, [categories]);

  // Live orders for status strip
  const activeOrders = (orders || []).filter(o => ['pending', 'cooking', 'preparing', 'ready'].includes(o.status)).slice(0, 6);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white px-2">
      <div className="flex gap-6 h-full min-h-0">
        
        {/* Left: Main POS Layout */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-8 pr-2">
          
          {/* Live Order Strip */}
          <div className="mb-6 shrink-0">
            <h2 className="text-2xl font-semibold text-[#1e293b] mb-4">Order Line</h2>

            {/* Live order status cards */}
            {activeOrders.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none mb-4">
                {activeOrders.map(o => {
                  const sc = statusColors[o.status] || statusColors.pending;
                  const itemCount = (o.items || []).reduce((s, i) => s + (i.qty || 0), 0);
                  return (
                    <div key={o.id} className={`min-w-[240px] ${sc.bg} p-4 rounded-[16px] flex flex-col justify-between shadow-sm`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#1e293b] font-bold text-sm">
                          Order #{typeof o.id === 'number' ? o.id : String(o.id).slice(0,4).toUpperCase()}
                        </span>
                        <span className="text-[#475569] text-xs font-medium">
                          {formatCurrency(o.total)}
                        </span>
                      </div>
                      <div className="text-lg font-black text-[#1e293b] mb-3">Items: {itemCount}x</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#475569] font-medium">
                          🕐 {o.readableTime || new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`px-3 py-1 ${sc.badge} text-white text-[10px] font-bold tracking-wide rounded-full`}>
                          {sc.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr className="border-[#e2e8f0] border-dashed mb-6 shrink-0" />

          {/* Menu Section */}
          <div className="mb-4 flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-semibold text-[#1e293b]">Foodies Menu</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none shrink-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center p-3 px-5 rounded-[12px] min-w-[140px] transition-all bg-white border shadow-sm ${
                activeCategory === null ? 'border-teal-500' : 'border-[#e2e8f0] hover:border-gray-300'
              }`}
            >
              <div className="w-10 h-10 bg-[#f8fafc] rounded-lg flex items-center justify-center mr-3 text-xl">🍲</div>
              <div className="text-left flex flex-col justify-center">
                <span className="text-sm font-bold text-[#1e293b] leading-tight">All Menu</span>
                <span className="text-[10px] font-medium text-[#94a3b8]">{(products || []).filter(p => p.available !== false).length} items</span>
              </div>
            </button>
            {(categories || []).map((cat) => {
              const itemCount = (products || []).filter(p => p.categoryId === cat.id && p.available !== false).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center p-3 px-5 rounded-[12px] min-w-[140px] transition-all bg-white border shadow-sm ${
                    isActive ? 'border-teal-500' : 'border-[#e2e8f0] hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 bg-[#f8fafc] rounded-lg flex items-center justify-center mr-3 text-xl">{cat.icon}</div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-sm font-bold text-[#1e293b] leading-tight line-clamp-1">{cat.name}</span>
                    <span className="text-[10px] font-medium text-[#94a3b8]">{itemCount} items</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-2 shrink-0">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categoryMap[product.categoryId]}
                onAdd={addItem}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#e2e8f0] mt-4 shadow-sm">
              <span className="text-5xl mb-4 opacity-40">🍽️</span>
              <p className="text-[#64748b] font-semibold text-lg">No products found</p>
            </div>
          )}
        </div>

        {/* Right: Cart Panel */}
        <div className="w-[380px] flex-shrink-0 h-full">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
