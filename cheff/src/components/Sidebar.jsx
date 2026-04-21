import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const mainNavItems = [
  { path: '/', label: 'Overview', icon: '📊' },
];

const bottomNavItems = [
  { path: '/settings', label: 'Settings', icon: '⚙️' },
  { path: '/help', label: 'Help', icon: '❓' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] flex flex-col z-50 bg-[#ffffff] border-r border-[#e2e8f0]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#e2e8f0]">
        <h1 className="text-xl font-black flex items-center gap-3 text-[#1e293b] tracking-tight">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white text-base shadow-sm">
            E
          </div>
          EstuaryPOS
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {mainNavItems.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-teal-50 text-teal-700 shadow-sm' 
                  : 'text-[#64748b] hover:bg-gray-50 hover:text-[#1e293b]'
              }`}
            >
              <span className="text-lg opacity-80">{icon}</span>
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 space-y-2 border-t border-[#e2e8f0]">
        {bottomNavItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[#64748b] hover:bg-gray-50 hover:text-[#1e293b] transition-all"
          >
            <span className="text-lg opacity-80">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
        >
          <span className="text-lg opacity-80">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
