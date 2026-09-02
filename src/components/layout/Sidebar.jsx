import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  ClipboardCheck,
  Calendar,
  Bell,
  Building2,
  UserCheck,
  BarChart3,
  FileSpreadsheet,
  Database,
  History,
  ShieldCheck,
  Target,
  Trophy,
  Layers,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentRole,
  unreadNotifCount,
  isMobileOpen,
  onCloseMobile
}) {
  // 5 Categorized Menu Sections (No Overlap)
  const menuCategories = [
    {
      title: '📌 UTAMA & MONITORING',
      items: [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'reminder', label: 'Reminder & Notif', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : null, badgeColor: 'bg-rose-500', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
      ]
    },
    {
      title: '📋 MANAJEMEN PENUGASAN',
      items: [
        { id: 'perintah', label: 'Perintah Pekerjaan', icon: Megaphone, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'pengumpulan', label: 'Pengumpulan Data', icon: ClipboardCheck, badge: 'PIC', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'gantt', label: 'Gantt Chart Timeline', icon: Layers, badge: 'GANTT', badgeColor: 'bg-sky-600', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'kalender', label: 'Kalender Pekerjaan', icon: Calendar, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
      ]
    },
    {
      title: '🎯 EVALUASI & MATRIX PERFORMANCE',
      items: [
        { id: 'nine-box', label: 'Matrix 9-Box Kinerja', icon: Target, badge: '9-BOX', badgeColor: 'bg-indigo-600', roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'monitoring-cabang', label: 'Monitoring Cabang HMC', icon: Building2, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'monitoring-pic', label: 'Monitoring PIC Staf', icon: UserCheck, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'leaderboard', label: 'Leaderboard Apresiasi', icon: Trophy, badge: '🏆 JUARA', badgeColor: 'bg-amber-500', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
      ]
    },
    {
      title: '📊 ANALYTIC & LAPORAN',
      items: [
        { id: 'analytic', label: 'Analytic & Compliance', icon: BarChart3, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'report', label: 'Laporan Bulanan', icon: FileSpreadsheet, badge: 'PDF/XLS', roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
      ]
    },
    {
      title: '⚙️ PENGATURAN & AUDIT',
      items: [
        { id: 'master-data', label: 'Master Data HMC', icon: Database, badge: null, roles: ['HOLDING'] },
        { id: 'audit-trail', label: 'Audit Trail System', icon: History, badge: null, roles: ['HOLDING', 'REGIONAL'] },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-56 bg-white text-slate-700 border-r border-slate-200 flex flex-col flex-shrink-0 h-screen select-none shadow-xs transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* Brand Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-xs">
              HMC
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                HMC GROUP
              </h1>
              <p className="text-[9px] text-sky-600 font-extrabold tracking-wider uppercase">
                Work Monitoring
              </p>
            </div>
          </div>

          {/* Close Mobile Button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="mx-3 mt-2 px-2.5 py-1 rounded-lg bg-slate-200/80 border border-slate-300 flex items-center justify-between text-[10px]">
          <span className="text-slate-800 font-extrabold">Akses Role:</span>
          <span className="font-black text-sky-800 font-mono">
            {currentRole}
          </span>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-3.5 overflow-y-auto">
          {menuCategories.map((category, catIdx) => {
            const visibleItems = category.items.filter(item => item.roles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={catIdx} className="space-y-1">
                {/* Category Header */}
                <h3 className="px-2.5 py-0.5 text-[9px] font-black text-slate-800 uppercase tracking-wider bg-slate-100/90 rounded border-l-2 border-sky-600">
                  {category.title}
                </h3>

                {/* Category Menu Items */}
                <div className="space-y-0.5 pt-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition group ${
                          isActive
                            ? 'bg-sky-700 text-white shadow-md shadow-sky-700/30'
                            : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-sky-700'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                              item.badgeColor ? `${item.badgeColor} text-white shadow-xs` : isActive ? 'bg-sky-900 text-white' : 'bg-slate-200 text-sky-900 border border-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-100 text-[9px] text-slate-400 text-center bg-slate-50/50">
          <p className="font-semibold text-slate-600">HMC Command Center</p>
        </div>

      </aside>
    </>
  );
}
