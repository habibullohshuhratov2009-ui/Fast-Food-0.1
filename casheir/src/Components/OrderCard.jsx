import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { timeAgo } from '../utils/formatDate';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order }) {
  if (!order) return null;

  return (
    <Link to={`/orders/${order.id}`} className="block no-underline">
      <div className="pos-card pos-card-interactive p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: 'var(--pos-bg)', color: 'var(--pos-text)' }}
            >
              #{order.id}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--pos-text)' }}>
                {(order.items?.length || 0)} item{(order.items?.length || 0) !== 1 ? 's' : ''}
              </p>
              <p className="text-xs" style={{ color: 'var(--pos-text-secondary)' }}>
                {timeAgo(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm font-bold" style={{ color: 'var(--pos-text)' }}>
              {formatCurrency(order.total || 0)}
            </span>
          </div>
        </div>

        {/* Item preview */}
        {order.items?.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {order.items.slice(0, 4).map((item, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: 'var(--pos-bg)', color: 'var(--pos-text-secondary)' }}
              >
                {item.name || 'Item'} ×{item.qty || 0}
              </span>
            ))}
            {order.items.length > 4 && (
              <span
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: 'var(--pos-bg)', color: 'var(--pos-text-secondary)' }}
              >
                +{order.items.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
