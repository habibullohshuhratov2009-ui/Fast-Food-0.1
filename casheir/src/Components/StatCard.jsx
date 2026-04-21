export default function StatCard({ icon, label, value, trend, color = 'primary' }) {
  const colorMap = {
    primary: { bg: '#e8f4fd', accent: '#0071e3' },
    success: { bg: '#f0fdf4', accent: '#16a34a' },
    warning: { bg: '#fffbeb', accent: '#f59e0b' },
    error:   { bg: '#fff2f0', accent: '#ff3b30' },
    info:    { bg: '#f0f4ff', accent: '#6366f1' },
    secondary: { bg: '#faf5ff', accent: '#a855f7' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="pos-card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--pos-text-secondary)' }}>
            {label}
          </p>
          <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--pos-text)' }}>
            {value}
          </h3>
          {trend !== undefined && trend !== null && (
            <p className="text-xs mt-1 font-medium" style={{ color: trend > 0 ? '#16a34a' : '#ff3b30' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: c.bg }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
