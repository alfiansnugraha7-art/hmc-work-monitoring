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
  // 5 Sequential Operational Phases (Numbered Workflow Standard)
  const menuCategories = [
    {
      phase: 'FASE 1',
      title: '📌 MONITORING UTAMA',
      items: [
        { id: 'dashboard', label: '1.1 Dashboard Center', icon: LayoutDashboard, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'reminder', label: '1.2 Live Reminder & Alert', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : null, badgeColor: 'bg-rose-600', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
      ]
    },
    {
      phase: 'FASE 2',
      title: '📋 EKSEKUSI PENUGASAN',
      items: [
        { id: 'perintah', label: '2.1 Perintah Pekerjaan', icon: Megaphone, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'pengumpulan', label: '2.2 Portal Pengumpulan Data', icon: ClipboardCheck, badge: 'PIC', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'gantt', label: '2.3 Timeline & Gantt Chart', icon: Layers, badge: 'GANTT', badgeColor: 'bg-sky-700', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
        { id: 'kalender', label: '2.4 Kalender Penugasan', icon: Calendar, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
      ]
    },
    {
      phase: 'FASE 3',
      title: '🎯 EVALUASI KINERJA',
      items: [
        { id: 'nine-box', label: '3.1 Matrix 9-Box Kinerja', icon: Target, badge: '9-BOX', badgeColor: 'bg-indigo-700', roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'monitoring-cabang', label: '3.2 Monitoring 13 Cabang', icon: Building2, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'monitoring-pic', label: '3.3 Monitoring PIC Staf', icon: UserCheck, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'leaderboard', label: '3.4 Leaderboard Apresiasi', icon: Trophy, badge: '🏆 JUARA', badgeColor: 'bg-amber-600', roles: ['HOLDING', 'REGIONAL', 'MANAGER', 'PIC'] },
      ]
    },
    {
      phase: 'FASE 4',
      title: '📊 ANALITIK & LAPORAN',
      items: [
        { id: 'analytic', label: '4.1 Analytic Compliance', icon: BarChart3, badge: null, roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
        { id: 'report', label: '4.2 Laporan Bulanan', icon: FileSpreadsheet, badge: 'PDF/XLS', roles: ['HOLDING', 'REGIONAL', 'MANAGER'] },
      ]
    },
    {
      phase: 'FASE 5',
      title: '⚙️ TATA KELOLA & AUDIT',
      items: [
        { id: 'master-data', label: '5.1 Master Data HMC', icon: Database, badge: null, roles: ['HOLDING'] },
        { id: 'audit-trail', label: '5.2 Audit Trail Log', icon: History, badge: null, roles: ['HOLDING', 'REGIONAL'] },
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
        className={`fixed md:static inset-y-0 left-0 z-50 w-56 bg-white text-slate-900 border-r border-slate-300 flex flex-col flex-shrink-0 h-screen select-none shadow-sm transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* Brand Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-xs">
              HMC
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wider text-slate-950 uppercase leading-tight">
                HMC GROUP
              </h1>
              <p className="text-[9px] text-sky-800 font-black tracking-wider uppercase">
                Work Monitoring
              </p>
            </div>
          </div>

          {/* Close Mobile Button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-500 hover:text-slate-900 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="mx-3 mt-2.5 px-2.5 py-1 rounded-lg bg-slate-200/90 border border-slate-300 flex items-center justify-between text-[10px]">
          <span className="text-slate-900 font-extrabold">Akses Role:</span>
          <span className="font-black text-sky-900 font-mono">
            {currentRole}
          </span>
        </div>

        {/* Categorized Sequential Navigation */}
        <nav className="flex-1 px-2 py-2.5 space-y-3.5 overflow-y-auto">
          {menuCategories.map((category, catIdx) => {
            const visibleItems = category.items.filter(item => item.roles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={catIdx} className="space-y-1">
                {/* Category Header */}
                <div className="px-2 py-0.5 bg-slate-100 border-l-3 border-sky-700 rounded flex items-center justify-between">
                  <h3 className="text-[9px] font-black text-slate-950 uppercase tracking-wider">
                    {category.title}
                  </h3>
                  <span className="text-[8px] font-black text-sky-800 bg-sky-100 px-1 rounded">
                    {category.phase}
                  </span>
                </div>

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
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold transition group ${
                          isActive
                            ? 'bg-sky-700 text-white shadow-md shadow-sky-700/30'
                            : 'text-slate-900 hover:text-slate-950 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-sky-700'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                              item.badgeColor ? `${item.badgeColor} text-white shadow-xs` : isActive ? 'bg-sky-950 text-white' : 'bg-slate-200 text-sky-950 border border-slate-300'
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
        <div className="px-3 py-2 border-t border-slate-200 text-[9px] text-slate-600 text-center bg-slate-100/60 font-semibold">
          <p className="font-bold text-slate-900">HMC Command Center</p>
        </div>

      </aside>
    </>
  );
}
