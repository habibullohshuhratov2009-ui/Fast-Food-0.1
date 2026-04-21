import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { categoriesAPI } from '../api/api';
import { useToast } from '../store/ToastContext';

export default function Categories() {
  const { categories, loading, refetch } = useCategories();
  const { products } = useProducts();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.create({ name: form.name, icon: form.icon || '📁' });
      addToast('Category created!', 'success');
      setForm({ name: '', icon: '' });
      setShowForm(false);
      refetch();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try {
      await categoriesAPI.delete(cat.id);
      addToast('Category deleted', 'success');
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
          <h2 className="text-2xl font-bold text-[#1e293b]">Categories</h2>
          <p className="text-sm text-[#64748b] mt-1">{(categories || []).length} categories configured</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all shadow-sm active:scale-95"
        >
          {showForm ? '✕ Cancel' : '+ New Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#64748b] mb-1">Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Burgers" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400" />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-[#64748b] mb-1">Icon (emoji)</label>
            <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🍔" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400 text-center" />
          </div>
          <button type="submit" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all">Create</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {(categories || []).map(cat => {
          const productCount = (products || []).filter(p => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 flex items-center gap-4 hover:border-teal-300 hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#1e293b]">{cat.name}</h3>
                <p className="text-xs font-bold text-[#94a3b8]">{productCount} products</p>
              </div>
              <button
                onClick={() => handleDelete(cat)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all text-xs"
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>

      {(categories || []).length === 0 && (
        <div className="text-center py-20 text-[#94a3b8]">
          <span className="text-5xl block mb-4">🗂️</span>
          <p className="font-bold">No categories yet</p>
          <p className="text-sm mt-1">Create your first category to organize the menu</p>
        </div>
      )}
    </div>
  );
}
