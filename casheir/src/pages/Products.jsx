import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { productsAPI } from '../api/api';
import { formatCurrency } from '../utils/formatCurrency';
import { useToast } from '../store/ToastContext';

export default function Products() {
  const { products, loading, refetch } = useProducts();
  const { categories } = useCategories();
  const { addToast } = useToast();
  const [filter, setFilter] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', categoryId: '', image: '', description: '' });

  const catMap = {};
  (categories || []).forEach(c => { catMap[c.id] = c; });

  const filtered = filter
    ? (products || []).filter(p => p.categoryId === filter)
    : (products || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.create({
        name: form.name,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        image: form.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        description: form.description,
        available: true,
      });
      addToast('Product created!', 'success');
      setForm({ name: '', price: '', categoryId: '', image: '', description: '' });
      setShowForm(false);
      refetch();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const toggleAvailability = async (product) => {
    try {
      await productsAPI.update(product.id, { available: !product.available });
      addToast(`${product.name} ${!product.available ? 'enabled' : 'disabled'}`, 'success');
      refetch();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await productsAPI.delete(product.id);
      addToast('Product deleted', 'success');
      refetch();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white px-8 py-6 pb-20 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Products</h2>
          <p className="text-sm text-[#64748b] mt-1">{(products || []).length} items in inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all shadow-sm active:scale-95"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 mb-6 grid grid-cols-2 gap-4">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Product name" required className="px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400" />
          <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" type="number" step="0.01" required className="px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400" />
          <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required className="px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400">
            <option value="">Select category</option>
            {(categories || []).map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Image URL (optional)" className="px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400" />
          <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400" />
          <button type="submit" className="col-span-2 bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition-all">Create Product</button>
        </form>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter(null)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!filter ? 'bg-teal-500 text-white' : 'bg-gray-100 text-[#64748b] hover:bg-gray-200'}`}>All</button>
        {(categories || []).map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === c.id ? 'bg-teal-500 text-white' : 'bg-gray-100 text-[#64748b] hover:bg-gray-200'}`}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(product => (
          <div key={product.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${!product.available ? 'opacity-50' : ''}`}>
            <div className="h-40 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-[#1e293b] text-sm">{product.name}</h3>
                <span className="text-teal-600 font-black text-sm">{formatCurrency(product.price)}</span>
              </div>
              <p className="text-xs text-[#94a3b8] mb-3">{catMap[product.categoryId]?.name || 'Uncategorized'}</p>
              <div className="flex gap-2">
                <button onClick={() => toggleAvailability(product)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${product.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {product.available ? '✓ Available' : '✕ Unavailable'}
                </button>
                <button onClick={() => handleDelete(product)} className="px-3 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#94a3b8]">
          <span className="text-5xl block mb-4">🍽️</span>
          <p className="font-bold">No products found</p>
        </div>
      )}
    </div>
  );
}
