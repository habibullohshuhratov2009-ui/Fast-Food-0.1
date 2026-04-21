const statusConfig = {
  pending:   { label: 'Pending',   bg: '#fffbeb', color: '#b45309', icon: '⏳' },
  preparing: { label: 'Preparing', bg: '#e8f4fd', color: '#0369a1', icon: '👨‍🍳' },
  cooking:   { label: 'Cooking',   bg: '#fff7ed', color: '#c2410c', icon: '🔥' },
  ready:     { label: 'Ready',     bg: '#f0fdf4', color: '#15803d', icon: '✅' },
  done:      { label: 'Done',      bg: '#f0fdf4', color: '#15803d', icon: '✓' },
  served:    { label: 'Served',    bg: '#f5f3ff', color: '#7c3aed', icon: '🍽️' },
};

export default function OrderStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: config.bg, color: config.color }}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
