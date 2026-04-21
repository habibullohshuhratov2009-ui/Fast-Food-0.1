export default function CategoryBadge({ category, isActive, onClick }) {
  return (
    <button
      className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2"
      style={{
        background: isActive ? 'var(--pos-accent)' : 'var(--pos-card)',
        color: isActive ? 'white' : 'var(--pos-text-secondary)',
        border: isActive ? 'none' : '1px solid var(--pos-border)',
        boxShadow: isActive ? '0 2px 8px rgba(0,113,227,0.25)' : 'var(--pos-shadow)',
      }}
      onClick={onClick}
    >
      <span>{category?.icon || '📁'}</span>
      <span>{category?.name || 'Category'}</span>
    </button>
  );
}
