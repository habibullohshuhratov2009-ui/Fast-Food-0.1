import { formatCurrency } from '../utils/formatCurrency';

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  const name = item?.name || 'Item';
  const price = item?.price || 0;
  const qty = item?.qty || 0;
  const emoji = item?.image || '🍽️';

  return (
    <div
      className="flex items-center gap-3 py-3 transition-colors"
      style={{ borderBottom: '1px solid var(--pos-border)' }}
    >
      {/* Emoji/image */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
        style={{ background: 'var(--pos-bg)' }}
      >
        {emoji}
      </div>

      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--pos-text)' }}>
          {name}
        </p>
        <p className="text-xs" style={{ color: 'var(--pos-text-secondary)' }}>
          {formatCurrency(price)}
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1">
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          style={{
            background: 'var(--pos-bg)',
            color: 'var(--pos-text-secondary)',
            border: '1px solid var(--pos-border)',
          }}
          onClick={(e) => { e.stopPropagation(); onDecrement(); }}
        >
          −
        </button>
        <span
          className="w-7 text-center text-sm font-semibold"
          style={{ color: 'var(--pos-text)' }}
        >
          {qty}
        </span>
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          style={{
            background: 'var(--pos-accent)',
            color: 'white',
            border: 'none',
          }}
          onClick={(e) => { e.stopPropagation(); onIncrement(); }}
        >
          +
        </button>
      </div>

      {/* Line total */}
      <span
        className="text-sm font-semibold min-w-[56px] text-right"
        style={{ color: 'var(--pos-text)' }}
      >
        {formatCurrency(price * qty)}
      </span>

      {/* Remove */}
      <button
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer"
        style={{ color: 'var(--pos-text-secondary)', background: 'transparent' }}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fff2f0';
          e.currentTarget.style.color = 'var(--pos-error)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--pos-text-secondary)';
        }}
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}
