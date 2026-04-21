export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in">
      <span className="text-5xl mb-4 opacity-40">{icon}</span>
      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--pos-text)' }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs mb-6" style={{ color: 'var(--pos-text-secondary)' }}>
        {description}
      </p>
      {action}
    </div>
  );
}
