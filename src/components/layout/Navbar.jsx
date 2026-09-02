import React, { useState } from 'react';
import { Search, Bell, ShieldCheck, ChevronDown, CheckCircle2, Menu } from 'lucide-react';

export default function Navbar({
  currentRole,
  setCurrentRole,
  searchQuery,
  setSearchQuery,
  notifications,
  onOpenNotifications,
  onSelectTaskFromSearch,
  tasks,
  onToggleMobileSidebar
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const roles = [
    { id: 'ROLE-HOLDING', label: 'Holding / Direksi', code: 'HOLDING' },
    { id: 'ROLE-REGIONAL', label: 'Regional Manager', code: 'REGIONAL' },
    { id: 'ROLE-MANAGER', label: 'Manager / Cabang', code: 'MANAGER' },
    { id: 'ROLE-PIC', label: 'PIC / Staff', code: 'PIC' }
  ];

  const activeRoleObj = roles.find(r => r.code === currentRole) || roles[0];

  const searchResults = searchQuery.trim().length > 1
    ? tasks.filter(t =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.picName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.status.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 shadow-xs h-11 flex items-center px-4">
      <div className="w-full flex items-center justify-between gap-3">
        
        {/* Left Section: Mobile Menu Button + Compact Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            title="Buka Navigasi Menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <div className="relative w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID, Judul, PIC, Cabang..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-[11px] rounded-lg pl-8 pr-3 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                {searchResults.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTaskFromSearch(t);
                      setShowSearchResults(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 transition flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-mono font-bold text-sky-600 mr-2">{t.id}</span>
                      <span className="font-semibold text-slate-800">{t.title}</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Compact Controls */}
        <div className="flex items-center gap-3">
          
          {/* Compact Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Ganti Mode Role User"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-bold text-slate-900 text-[11px]">{activeRoleObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                {roles.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => {
                      setCurrentRole(r.code);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[11px] flex items-center justify-between hover:bg-slate-50 transition ${
                      currentRole === r.code ? 'font-bold text-sky-700 bg-sky-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentRole === r.code && <CheckCircle2 className="w-3 h-3 text-sky-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compact Notif Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            title="Reminder & Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-3.5 h-3.5 px-1 text-[9px] font-bold text-white bg-rose-600 rounded-full flex items-center justify-center">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Profile View */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-[11px]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-sky-600 flex items-center justify-center text-white text-[10px] font-extrabold shadow-xs">
              HM
            </div>
            <span className="hidden md:inline font-bold text-slate-800">dr. Hendra Gunawan</span>
          </div>

        </div>

      </div>
    </header>
  );
}
