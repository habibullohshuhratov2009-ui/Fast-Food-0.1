import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/pos', label: 'POS', icon: '📝' },
  { path: '/orders', label: 'Orders', icon: '📋' },
  { path: '/products', label: 'Products', icon: '🍔' },
  { path: '/categories', label: 'Categories', icon: '🗂️' },
  { path: '/history', label: 'History', icon: '🕒' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col z-50 bg-[#ffffff] border-r border-[#e2e8f0]">
      {/* Logo */}
      <div className="px-6 py-8">
        <h1 className="text-xl font-bold flex items-center gap-2 text-[#1e293b] leading-tight">
          <div className="w-8 h-8 rounded-full flex items-stretch overflow-hidden">
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-teal-500 fill-current">
              <path d="M16 4 A12 12 0 0 0 4 16 L16 16 Z" opacity="0.6"/>
              <path d="M16 4 A12 12 0 0 1 28 16 L16 16 Z" />
              <path d="M28 16 A12 12 0 0 1 16 28 L16 16 Z" opacity="0.4"/>
            </svg>
          </div>
          <div>
            <div>Tasty</div>
            <div>Station</div>
          </div>
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        {mainNavItems.map(({ path, label, icon }) => {
          const isActive = location.pathname === path || (path === '/dashboard' && location.pathname === '/');
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-4 py-3.5 pr-8 relative ${
                isActive 
                  ? 'bg-gray-50 text-[#1e293b] font-bold' 
                  : 'text-[#64748b] hover:bg-gray-50 hover:text-[#1e293b] font-medium'
              }`}
              style={{
                borderLeft: isActive ? '4px solid #14b8a6' : '4px solid transparent',
                paddingLeft: '28px'
              }}
            >
              <span className={`text-[18px] opacity-90 ${isActive ? 'text-teal-500' : ''}`}>{icon}</span>
              <span className="text-sm">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="py-6 flex flex-col gap-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 py-3.5 pr-8 relative text-[#64748b] hover:bg-gray-50 hover:text-[#1e293b] transition-all cursor-pointer font-medium"
          style={{ paddingLeft: '32px' }}
        >
          <span className="text-[18px] opacity-90">🚪</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
