import { formatCurrency } from '../utils/formatCurrency';
import { useCartDispatch, useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';

export default function ProductCard({ product, category }) {
  const { id, name, price, imgUrl, emoji, available } = product;
  const { addItem, removeItem } = useCartDispatch();
  const { items } = useCart();
  const { user } = useAuth();
  
  const cartItem = items.find(item => item.productId === Number(id));
  const quantity = cartItem ? cartItem.qty : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!available) return;
    addItem(product);
  };
  
  const handleRemove = (e) => {
    e.stopPropagation();
    if (!available || quantity === 0) return;
    removeItem(Number(id));
  };

  return (
    <div
      className={`bg-white rounded-[16px] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-[#e2e8f0] flex flex-col pt-6 pb-4 px-4 ${
        !available ? 'opacity-40 pointer-events-none' : ''
      }`}
      onClick={handleAdd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
    >
      {/* 1) TOP: Image (Perfectly round plate style) */}
      <div className="w-full h-[120px] mb-4 flex items-center justify-center shrink-0">
        <div className="w-[110px] h-[110px] rounded-full overflow-hidden flex items-center justify-center bg-[#f8fafc] shadow-sm relative">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Fallback Emoji */}
          <div
            className="absolute inset-0 flex items-center justify-center text-[3.5rem]"
            style={{ display: imgUrl ? 'none' : 'flex' }}
          >
            {emoji}
          </div>
        </div>
      </div>

      {/* 2) Text & Info */}
      <div className="flex flex-col gap-1 mb-4 flex-1 justify-end">
        <span className="text-[#94a3b8] font-medium text-xs leading-none">
          {category ? category.name : 'General'}
        </span>
        <h3 className="text-[#1e293b] font-bold text-sm leading-snug line-clamp-2 min-h-[40px]">
          {name}
        </h3>
      </div>

      {/* 3) Pricing & Counter */}
      <div className="flex items-center justify-between border-t border-transparent pt-1">
        <span className="text-base font-black text-[#1e293b]">
          {formatCurrency(price)}
        </span>
        
        {available ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRemove}
              className={`w-6 h-6 flex items-center justify-center font-bold text-lg leading-none ${quantity > 0 ? 'text-[#1e293b]' : 'text-gray-300 pointer-events-none'}`}
            >
              −
            </button>
            <span className="text-sm font-bold w-2 text-center text-[#1e293b]">{quantity}</span>
            <button 
              onClick={handleAdd}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-teal-500 text-white font-bold text-lg leading-none shadow-sm hover:bg-teal-600 transition-colors"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500 uppercase tracking-wider">
            Out
          </span>
        )}
      </div>
    </div>
  );
}
