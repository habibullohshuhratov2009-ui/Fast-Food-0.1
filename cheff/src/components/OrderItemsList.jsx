export default function OrderItemsList({ items }) {
  if (!items || items.length === 0) return <p className="text-[#64748b]">No items</p>;

  return (
    <div className="space-y-1">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-[12px] shadow-sm"
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#f8fafc] border border-gray-100 flex items-center justify-center text-xs">
                🍽️
             </div>
             <p className="text-[13px] font-bold text-[#1e293b]">
               {item.name || 'Unknown Item'}
             </p>
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 pb-1.5 rounded-full font-black text-sm">
            ×{item.qty || 0}
          </div>
        </div>
      ))}
    </div>
  );
}
