import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Clock, Filter, AlertTriangle, Eye, Check, Building2, Search, Award, ChevronRight, Calendar } from 'lucide-react';
import { computeBranchCompliance } from '../services/analyticsEngine';

export default function ReminderNotifikasiPage({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectTaskFromNotif,
  tasks,
  branches = [],
  regionals = [],
  onSelectBranchFilter
}) {
  const [activeSubTab, setActiveSubTab] = useState('notifications'); // 'notifications' or 'branch-done'
  const [filterType, setFilterType] = useState('ALL');
  const [branchSearch, setBranchSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');

  // Compute branch completion matrix for the Done / Completion table
  const branchData = computeBranchCompliance(tasks, branches);

  const filteredBranches = branchData.filter(b => {
    if (selectedRegionFilter !== 'ALL' && b.regionalId !== selectedRegionFilter) return false;
    if (branchSearch.trim()) {
      return b.name.toLowerCase().includes(branchSearch.toLowerCase()) || b.code.toLowerCase().includes(branchSearch.toLowerCase());
    }
    return true;
  });

  // Summary counts for Done branches
  const fullyDoneBranches = branchData.filter(b => b.finished > 0 && b.late === 0 && b.pending === 0);
  const highCompletionBranches = branchData.filter(b => b.completionRate >= 80);
  const totalFinishedTasks = tasks.filter(t => t.status === 'SELESAI').length;

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'UNREAD' && n.read) return false;
    if (filterType === 'ESCALATION' && n.type !== 'ESCALATION') return false;
    if (filterType === 'REMINDER' && n.type !== 'REMINDER') return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-sky-400" />
            Pusat Reminder, Notifikasi & Monitoring Status Done Cabang
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Peringatan deadline otomatis (H-3, H-1, Hari H, Overdue) & Rekapitulasi tanggal/waktu penyelesaian tugas seluruh unit cabang.
          </p>
        </div>

        {activeSubTab === 'notifications' && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Check className="w-4 h-4 text-emerald-400" /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Main Mode Toggle Tabs */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'notifications'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          Pusat Notifikasi & Alarm Reminder ({notifications.filter(n => !n.read).length} Unread)
        </button>

        <button
          onClick={() => setActiveSubTab('branch-done')}
          className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'branch-done'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          Tabel Monitoring Cabang SELESAI / DONE ({totalFinishedTasks} Task Selesai)
        </button>
      </div>

      {/* TAB 1: NOTIFICATIONS CENTER */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-4">
          
          {/* Sub Filter Tabs */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2 rounded-lg transition ${filterType === 'ALL' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              Semua Notifikasi ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('UNREAD')}
              className={`px-4 py-2 rounded-lg transition ${filterType === 'UNREAD' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              Belum Dibaca ({notifications.filter(n => !n.read).length})
            </button>
            <button
              onClick={() => setFilterType('ESCALATION')}
              className={`px-4 py-2 rounded-lg transition ${filterType === 'ESCALATION' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              Peringatan Eskalasi
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((n) => {
                const task = tasks.find(t => t.id === n.taskId);
                return (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                      !n.read
                        ? 'bg-slate-800/90 border-sky-600/80 shadow-lg shadow-sky-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl text-white ${
                        n.type === 'ESCALATION' ? 'bg-rose-600' : n.type === 'OVERDUE' ? 'bg-amber-600' : 'bg-sky-600'
                      }`}>
                        {n.type === 'ESCALATION' ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{n.title}</span>
                          {!n.read && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white uppercase">
                              Baru
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">
                          Waktu Notifikasi: {new Date(n.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {task && (
                        <button
                          onClick={() => onSelectTaskFromNotif(task)}
                          className="px-3 py-1.5 bg-sky-900/60 hover:bg-sky-600 text-sky-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Buka Pekerjaan
                        </button>
                      )}

                      {!n.read && (
                        <button
                          onClick={() => onMarkAsRead(n.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition"
                          title="Tandai Dibaca"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="font-bold">Tidak ada notifikasi dalam kategori ini.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: TABEL MONITORING CABANG DONE / SELESAI */}
      {activeSubTab === 'branch-done' && (
        <div className="space-y-6">
          
          {/* KPI Mini Cards for Done Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-emerald-950/40 border border-emerald-800 p-5 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Total Pekerjaan Finished (DONE)</span>
              <span className="text-3xl font-black text-emerald-100">{totalFinishedTasks}</span>
              <span className="text-[11px] text-emerald-400 block font-medium">Telah diverifikasi & disetujui Holding</span>
            </div>

            <div className="bg-sky-950/40 border border-sky-800 p-5 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Cabang High Completion (&gt;80%)</span>
              <span className="text-3xl font-black text-sky-100">{highCompletionBranches.length} / {branchData.length}</span>
              <span className="text-[11px] text-sky-400 block font-medium">Unit cabang performa sangat baik</span>
            </div>

            <div className="bg-amber-950/40 border border-amber-800 p-5 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Cabang Zero Overdue (100% On-Time)</span>
              <span className="text-3xl font-black text-amber-100">{branchData.filter(b => b.late === 0).length} Cabang</span>
              <span className="text-[11px] text-amber-400 block font-medium">Tanpa keterlambatan sama sekali</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rata-rata Completion Rate</span>
              <span className="text-3xl font-black text-white">
                {Math.round(branchData.reduce((acc, b) => acc + b.completionRate, 0) / (branchData.length || 1))}%
              </span>
              <span className="text-[11px] text-slate-400 block font-medium">Rata-rata penyelesaian seluruh unit</span>
            </div>

          </div>

          {/* Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Cabang..."
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 focus:outline-none"
              />
            </div>

            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2"
            >
              <option value="ALL">Semua Regional</option>
              {regionals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {/* DEDICATED DONE / COMPLETION TABLE FOR ALL BRANCHES WITH COMPLETION TIMESTAMP */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                  Tabel Status & Tanggal/Waktu Penyelesaian Tugas (DONE) Seluruh Cabang
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Total Cabang: {filteredBranches.length} Unit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-5">Nama Cabang</th>
                    <th className="py-3.5 px-5">Regional</th>
                    <th className="py-3.5 px-5 text-center">Total Task</th>
                    <th className="py-3.5 px-5 text-center">Task Finished (DONE 🟢)</th>
                    <th className="py-3.5 px-5 text-center">Task Terlambat (🔴)</th>
                    <th className="py-3.5 px-5 text-center">Task In Progress (🔵/🟡)</th>
                    <th className="py-3.5 px-5">Progress Rate (% DONE)</th>
                    <th className="py-3.5 px-5">Tanggal & Waktu Selesai Terakhir</th>
                    <th className="py-3.5 px-5 text-center">Status Compliance</th>
                    <th className="py-3.5 px-5 text-center">Lihat Task Cabang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredBranches.map((b) => {
                    const isFullyDone = b.finished > 0 && b.late === 0 && b.pending === 0;

                    // Calculate latest completed task date & time for this branch
                    const branchTasks = tasks.filter(t => t.branchId === b.id);
                    const finishedBranchTasks = branchTasks.filter(t => t.status === 'SELESAI');
                    const lastFinishedTask = finishedBranchTasks.length > 0
                      ? finishedBranchTasks[finishedBranchTasks.length - 1]
                      : null;

                    const lastDoneTimeStr = lastFinishedTask
                      ? (lastFinishedTask.submission?.submittedAt || '01 Sep 2026, 09:45 WIB')
                      : null;

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/50 transition">
                        <td className="py-4 px-5">
                          <span className="font-extrabold text-white text-sm block">{b.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">Kode: {b.code}</span>
                        </td>

                        <td className="py-4 px-5 font-semibold text-slate-300">
                          {b.regionalId}
                        </td>

                        <td className="py-4 px-5 text-center font-bold text-white text-sm">
                          {b.totalTasks}
                        </td>

                        <td className="py-4 px-5 text-center">
                          <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-black text-sm inline-block">
                            {b.finished} DONE
                          </span>
                        </td>

                        <td className="py-4 px-5 text-center font-bold text-rose-400">
                          {b.late}
                        </td>

                        <td className="py-4 px-5 text-center font-bold text-amber-400">
                          {b.pending}
                        </td>

                        {/* Visual Bar % DONE */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  b.completionRate >= 90 ? 'bg-emerald-500' : b.completionRate >= 75 ? 'bg-sky-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${b.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="font-black text-sm font-mono text-emerald-400 min-w-[45px]">
                              {b.completionRate}%
                            </span>
                          </div>
                        </td>

                        {/* NEW COLUMN: Tanggal & Waktu Pekerjaan Selesai Terakhir */}
                        <td className="py-4 px-5 font-mono text-xs">
                          {lastDoneTimeStr ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{lastDoneTimeStr}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Task: {lastFinishedTask?.id} • PIC: {lastFinishedTask?.picName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Belum Ada Selesai</span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-center">
                          {isFullyDone ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                              🟢 100% FULLY DONE
                            </span>
                          ) : b.completionRate >= 80 ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-sky-950 text-sky-300 border border-sky-800">
                              🔵 HIGH COMPLETION
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                              🟡 IN PROGRESS
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-center">
                          {onSelectBranchFilter && (
                            <button
                              onClick={() => onSelectBranchFilter(b.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                            >
                              Lihat Task <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
