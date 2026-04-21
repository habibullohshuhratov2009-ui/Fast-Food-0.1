import StatusBadge from './StatusBadge';
import StatusButton from './StatusButton';
import OrderItemsList from './OrderItemsList';

function timeAgo(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function OrderCard({ order, onUpdate, expanded, onToggle }) {
  if (!order) return null;

  const itemCount = (order.items || []).reduce((s, i) => s + (i.qty || 0), 0);
  const borderColor = order.status === 'cooking' ? '#0ea5e9' : order.status === 'ready' ? '#10b981' : 'transparent';

  return (
    <div
      className="bg-white rounded-[20px] shadow-sm border border-[#e2e8f0] overflow-hidden transition-all hover:shadow-md"
      style={{ borderLeft: borderColor !== 'transparent' ? `5px solid ${borderColor}` : undefined }}
    >
      {/* Header — always visible */}
      <div
        className="p-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-[#f8fafc] border border-gray-100 flex items-center justify-center font-black text-lg text-[#1e293b]">
              #{typeof order.id === 'number' ? order.id : String(order.id).slice(0, 4).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-[15px] text-[#1e293b] leading-tight">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[12px] font-medium text-[#64748b]">
                  {order.status === 'pending' && `Waiting: ${timeAgo(order.createdAt)}`}
                  {order.status === 'cooking' && order.startedAt && `Cooking: ${timeAgo(order.startedAt)}`}
                  {(order.status === 'ready' || order.status === 'served') && order.startedAt && order.completedAt && 
                    `Prepped in ${Math.round((new Date(order.completedAt) - new Date(order.startedAt)) / 60000) || '<1'}m`
                  }
                </p>
              </div>
            </div>
          </div>
          <StatusBadge status={order.status} size="lg" />
        </div>

        {/* Item preview chips */}
        <div className="flex gap-2 flex-wrap mt-2">
          {(order.items || []).map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-1 rounded-[8px] font-bold bg-[#f1f5f9] text-[#475569]"
            >
              <span className="opacity-60 mr-1">{item.qty || 0}x</span>{item.name || 'Item'}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="bg-[#f8fafc] border-t border-gray-100 animate-in slide-in-from-top-2">
          <div className="p-5 overflow-hidden">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 text-[#94a3b8]">
              Ticket Details
            </h4>
            <OrderItemsList items={order.items} />
          </div>

          {/* Action button */}
          <div className="p-5 pt-0">
            <StatusButton order={order} onUpdate={onUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}
