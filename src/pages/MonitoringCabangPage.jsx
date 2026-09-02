import React, { useState } from 'react';
import { Building2, Search, TrendingUp, ChevronRight, CheckCircle2, AlertTriangle, Filter, Clock } from 'lucide-react';
import { computeBranchCompliance } from '../services/analyticsEngine';

export default function MonitoringCabangPage({
  tasks,
  branches,
  regionals,
  onSelectBranchFilter
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');

  const branchCompliance = computeBranchCompliance(tasks, branches);

  const filteredBranches = branchCompliance.filter(b => {
    if (selectedRegionFilter !== 'ALL' && b.regionalId !== selectedRegionFilter) return false;
    if (searchTerm.trim()) {
      return b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.code.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-400" />
            Monitoring Kepatuhan & Progress Seluruh Cabang
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Matriks kepatuhan 14 unit cabang holding, persentase penyelesaian perintah, dan tanggal/waktu pengerjaan selesai terakhir.
          </p>
        </div>
      </div>

      {/* Search & Region Filter */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Nama Cabang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Main Branch Compliance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">Nama Cabang</th>
                <th className="py-3 px-5">Regional</th>
                <th className="py-3 px-5 text-center">Total Task</th>
                <th className="py-3 px-5 text-center">Selesai (DONE)</th>
                <th className="py-3 px-5 text-center">Pending</th>
                <th className="py-3 px-5 text-center">Terlambat</th>
                <th className="py-3 px-5">Visual Progress Compliance Score</th>
                <th className="py-3 px-5">Tanggal & Waktu Selesai Terakhir</th>
                <th className="py-3 px-5 text-center">Kategori</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredBranches.map((b) => {
                const cat = b.category;

                // Find latest finished task timestamp
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
                      <span className="text-[10px] font-mono text-slate-400">KODE: {b.code}</span>
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-300">
                      {b.regionalId}
                    </td>

                    <td className="py-4 px-5 text-center font-bold text-white text-sm">
                      {b.totalTasks}
                    </td>

                    <td className="py-4 px-5 text-center font-bold text-emerald-400">
                      {b.finished}
                    </td>

                    <td className="py-4 px-5 text-center font-bold text-amber-400">
                      {b.pending}
                    </td>

                    <td className="py-4 px-5 text-center font-bold text-rose-400">
                      {b.late}
                    </td>

                    {/* Progress bar visual */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              b.complianceScore >= 90 ? 'bg-emerald-500' : b.complianceScore >= 80 ? 'bg-sky-500' : b.complianceScore >= 70 ? 'bg-amber-500' : 'bg-rose-600'
                            }`}
                            style={{ width: `${b.complianceScore}%` }}
                          ></div>
                        </div>
                        <span className="font-black text-sm font-mono text-white min-w-[45px]">
                          {b.complianceScore}%
                        </span>
                      </div>
                    </td>

                    {/* Tanggal & Waktu Selesai Terakhir */}
                    <td className="py-4 px-5 font-mono text-xs">
                      {lastDoneTimeStr ? (
                        <div>
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lastDoneTimeStr}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Task: {lastFinishedTask?.id}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Belum Ada Selesai</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${cat.bg} ${cat.text}`}>
                        {cat.label}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => onSelectBranchFilter(b.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 mx-auto"
                      >
                        Lihat Pekerjaan <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
