import { useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white h-[80px] flex items-center justify-between px-8">
      {/* Search Box - Centered specifically */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-[450px]">
          <input
            type="text"
            placeholder="Search menu, orders and more"
            className="w-full pl-12 pr-6 py-2.5 rounded-full bg-white text-sm text-[#1e293b] outline-none border border-[#e2e8f0] focus:border-teal-500 transition-all placeholder-[#94a3b8]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center justify-end gap-6 w-[240px]">
        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center border border-[#e2e8f0] text-[#64748b] hover:text-teal-600 hover:border-teal-600 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User Block */}
        <div className="flex items-center gap-3">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim" 
            alt="Profile avatar" 
            className="w-10 h-10 rounded-full bg-gray-100 object-cover" 
          />
          <div className="hidden lg:block min-w-0 flex-1 leading-tight">
            <p className="text-sm font-bold text-[#1e293b] truncate">
              {user?.name || 'Ibrahim Kadri'}
            </p>
            <p className="text-[11px] text-[#64748b] font-medium mt-0.5">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
