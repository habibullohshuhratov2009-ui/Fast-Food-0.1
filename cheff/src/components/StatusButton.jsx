import { ordersAPI } from '../api/api';
import { useState } from 'react';
import { useToast } from '../store/ToastContext';

const statusFlow = {
  pending: { next: 'cooking', label: '🔥 Start Cooking', bg: '#f59e0b', color: 'white' },
  cooking: { next: 'ready', label: '✅ Mark Ready', bg: '#22c55e', color: 'white' },
};

export default function StatusButton({ order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const flow = statusFlow[order.status];

  if (!flow) return null; // ready orders have no next action

  const handleClick = async () => {
    setLoading(true);
    try {
      await ordersAPI.update(order.id, { status: flow.next });
      if (flow.next === 'ready') {
        addToast(`Order #${order.id} marked as ready!`, 'success');
      } else {
        addToast(`Started cooking Order #${order.id}`, 'success');
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      addToast('Failed to update: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 rounded-xl font-bold text-base transition-all cursor-pointer"
      style={{
        background: loading ? '#d1d5db' : flow.bg,
        color: loading ? '#6b7280' : flow.color,
        border: 'none',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Updating...' : flow.label}
    </button>
  );
}
