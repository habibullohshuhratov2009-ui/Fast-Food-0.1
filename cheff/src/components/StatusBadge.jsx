const statusConfig = {
  pending: { label: 'NEW', bg: '#f3f4f6', color: '#4b5563', border: '#d1d5db' },
  cooking: { label: 'COOKING', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  ready:   { label: 'READY', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.pending;
  const sizeClass = size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full ${sizeClass}`}
      style={{ background: config.bg, color: config.color, border: `2px solid ${config.border}` }}
    >
      {status === 'cooking' && <span className="mr-1">🔥</span>}
      {status === 'ready' && <span className="mr-1">✅</span>}
      {config.label}
    </span>
  );
}
