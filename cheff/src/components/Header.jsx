import { useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const title = 'Kitchen Dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] h-[80px] flex items-center justify-between px-8">
      {/* Dynamic Route Title */}
      <div className="w-[200px]">
        <h2 className="text-xl font-bold text-[#1e293b]">{title}</h2>
      </div>

      {/* Central Global Search Box */}
      <div className="flex-1 max-w-xl mx-4 opacity-0 pointer-events-none">
        {/* Hidden in Kitchen for now unless needed, kept for structural spacing parity */}
      </div>

      {/* Right User Actions */}
      <div className="w-[200px] flex items-center justify-end gap-6">
        <button className="relative text-gray-400 hover:text-teal-600 transition-colors">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-[#e2e8f0]">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
            {user?.name?.charAt(0) || 'C'}
          </div>
          <div className="hidden lg:block min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1e293b] truncate">
              {user?.name || 'Chef'}
            </p>
            <p className="text-[10px] text-[#64748b] uppercase tracking-wide font-semibold mt-0.5">
              Standby
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
