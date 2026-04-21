import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await ordersAPI.getById(id);
        setOrder(res.data);
      } catch {
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await ordersAPI.update(id, { status: newStatus });
      setOrder(res.data);
    } catch (err) {
      alert('Failed to update: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg" style={{ color: 'var(--pos-accent)' }}></span>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in">
      <button
        className="text-sm font-medium cursor-pointer"
        style={{ color: 'var(--pos-accent)', background: 'none', border: 'none' }}
        onClick={() => navigate('/orders')}
      >
        ← Back to Orders
      </button>

      {/* Header */}
      <div className="pos-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--pos-text)' }}>Order #{order.id}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--pos-text-secondary)' }}>{formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Items table */}
      <div className="pos-card p-6">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--pos-text)' }}>Order Items</h3>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pos-border)' }}>
              <th className="text-left py-2 font-medium" style={{ color: 'var(--pos-text-secondary)' }}>Product</th>
              <th className="text-center py-2 font-medium" style={{ color: 'var(--pos-text-secondary)' }}>Qty</th>
              <th className="text-right py-2 font-medium" style={{ color: 'var(--pos-text-secondary)' }}>Price</th>
              <th className="text-right py-2 font-medium" style={{ color: 'var(--pos-text-secondary)' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--pos-border)' }}>
                <td className="py-3 font-medium" style={{ color: 'var(--pos-text)' }}>{item.name || 'Item'}</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: 'var(--pos-bg)', color: 'var(--pos-text)' }}>
                    {item.qty || 0}
                  </span>
                </td>
                <td className="py-3 text-right" style={{ color: 'var(--pos-text-secondary)' }}>{formatCurrency(item.price || 0)}</td>
                <td className="py-3 text-right font-semibold" style={{ color: 'var(--pos-text)' }}>
                  {formatCurrency((item.price || 0) * (item.qty || 0))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="pt-4 text-right font-bold text-base" style={{ color: 'var(--pos-text)' }}>Total</td>
              <td className="pt-4 text-right font-bold text-base" style={{ color: 'var(--pos-accent)' }}>{formatCurrency(order.total || 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Status actions */}
      {order.status !== 'done' && (
        <div className="pos-card p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--pos-text)' }}>Update Status</h3>
          <div className="flex gap-3">
            {order.status === 'pending' && (
              <button
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                style={{ background: '#e8f4fd', color: '#0369a1', border: 'none' }}
                onClick={() => handleStatusUpdate('preparing')}
                disabled={updating}
              >
                {updating ? 'Updating...' : '👨‍🍳 Start Preparing'}
              </button>
            )}
            {(order.status === 'pending' || order.status === 'preparing') && (
              <button
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                style={{ background: '#f0fdf4', color: '#15803d', border: 'none' }}
                onClick={() => handleStatusUpdate('done')}
                disabled={updating}
              >
                {updating ? 'Updating...' : '✓ Mark as Done'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
