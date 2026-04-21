import { useAuth } from '../store/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white px-8 py-6 pb-20 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1e293b]">Settings</h2>
        <p className="text-sm text-[#64748b] mt-1">Manage your cashier profile and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-black">
          {user?.name?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="text-lg font-black text-[#1e293b]">{user?.name || 'Cashier'}</h3>
          <p className="text-sm text-[#64748b]">@{user?.username || 'cashier'}</p>
          <span className="inline-block mt-1 px-3 py-0.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-wider">
            {user?.role || 'cashier'}
          </span>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <span>🖥️</span> Display
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b] font-medium">Theme</span>
              <span className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b]">Light</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b] font-medium">Language</span>
              <span className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b]">English</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <span>🔔</span> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b] font-medium">Order alerts</span>
              <div className="w-10 h-6 bg-teal-500 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b] font-medium">Sound effects</span>
              <div className="w-10 h-6 bg-teal-500 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <span>🖨️</span> Printer
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b] font-medium">Receipt printer</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b] font-medium">Auto-print receipts</span>
              <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <span>ℹ️</span> About
          </h3>
          <div className="space-y-2 text-sm text-[#64748b]">
            <div className="flex justify-between"><span>Version</span><span className="font-bold text-[#1e293b]">2.0.0</span></div>
            <div className="flex justify-between"><span>Build</span><span className="font-bold text-[#1e293b]">2026.04.20</span></div>
            <div className="flex justify-between"><span>API</span><span className="font-bold text-[#1e293b]">localhost:5050</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
