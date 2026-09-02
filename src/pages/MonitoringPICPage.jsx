import React, { useState } from 'react';
import { UserCheck, Search, Award, CheckCircle2, AlertTriangle, Eye, ChevronRight } from 'lucide-react';
import { computePICCompliance } from '../services/analyticsEngine';

export default function MonitoringPICPage({
  tasks,
  employees,
  branches,
  onSelectTask
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('ALL');
  const [selectedPic, setSelectedPic] = useState(null);

  const picMatrix = computePICCompliance(tasks, employees);

  const filteredPics = picMatrix.filter(p => {
    if (selectedBranchFilter !== 'ALL' && p.branchId !== selectedBranchFilter) return false;
    if (searchTerm.trim()) {
      return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const activeTasksForPic = selectedPic
    ? tasks.filter(t => t.picId === selectedPic.id)
    : [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-sky-400" />
            Monitoring Performa Individu PIC / Staff
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluasi akuntabilitas staf penanggung jawab pekerjaan, On-Time Rate, dan skor kepatuhan individual.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Nama PIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 focus:outline-none"
          />
        </div>

        <select
          value={selectedBranchFilter}
          onChange={(e) => setSelectedBranchFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2"
        >
          <option value="ALL">Semua Unit Cabang</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Main PIC Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">Nama PIC</th>
                <th className="py-3 px-5">Cabang & Kontak</th>
                <th className="py-3 px-5 text-center">Total Task</th>
                <th className="py-3 px-5 text-center">Selesai</th>
                <th className="py-3 px-5 text-center">Terlambat</th>
                <th className="py-3 px-5 text-center">Pending</th>
                <th className="py-3 px-5 text-center">On-Time Rate</th>
                <th className="py-3 px-5 text-center">Compliance Score</th>
                <th className="py-3 px-5 text-center">Detail Task</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredPics.map((p) => {
                const branchObj = branches.find(b => b.id === p.branchId);
                const cat = p.category;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-white block text-sm">{p.name}</span>
                      <span className="text-[10px] text-sky-400">PIC Operational</span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-slate-200 block">{branchObj?.name || p.branchId}</span>
                      <span className="text-[10px] text-slate-400">{p.phone}</span>
                    </td>

                    <td className="py-3.5 px-5 text-center font-bold text-white text-sm">
                      {p.totalTasks}
                    </td>

                    <td className="py-3.5 px-5 text-center font-bold text-emerald-400">
                      {p.finished}
                    </td>

                    <td className="py-3.5 px-5 text-center font-bold text-rose-400">
                      {p.late}
                    </td>

                    <td className="py-3.5 px-5 text-center font-bold text-amber-400">
                      {p.pending}
                    </td>

                    <td className="py-3.5 px-5 text-center font-mono font-bold text-sky-300">
                      {p.onTimeRate}%
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono border ${
                        p.complianceScore >= 90 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : p.complianceScore >= 80 ? 'bg-sky-950 text-sky-300 border-sky-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {p.complianceScore} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => setSelectedPic(p)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Lihat Active Task ({p.totalTasks})
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected PIC Task List Popup Drawer */}
      {selectedPic && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Daftar Pekerjaan Aktif PIC: <span className="text-sky-400">{selectedPic.name}</span></h3>
                <p className="text-[11px] text-slate-400">Unit Cabang: {branches.find(b => b.id === selectedPic.branchId)?.name}</p>
              </div>
              <button onClick={() => setSelectedPic(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
              {activeTasksForPic.length > 0 ? (
                activeTasksForPic.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedPic(null);
                      onSelectTask(t);
                    }}
                    className="p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-sky-400">{t.id}</span>
                      <h4 className="font-bold text-white text-xs mt-0.5">{t.title}</h4>
                      <span className="text-[10px] text-slate-400">Deadline: {new Date(t.deadline).toLocaleString('id-ID')}</span>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-200 border border-slate-700 block">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-center py-6">Tidak ada pekerjaan aktif untuk PIC ini.</p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
