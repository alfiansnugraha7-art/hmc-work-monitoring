import React, { useState } from 'react';
import { Target, Search, Users, Award, AlertTriangle, FileText, CheckCircle2, ChevronRight, X, Clock, Filter } from 'lucide-react';
import { computeNineBoxMatrix } from '../services/analyticsEngine';

export default function NineBoxMatrixPage({ tasks, employees, branches, onSelectTask }) {
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBoxModal, setActiveBoxModal] = useState(null);

  const nineBoxData = computeNineBoxMatrix(tasks, employees);

  const filteredEmployees = nineBoxData.employees.filter(emp => {
    if (selectedBranch !== 'ALL' && emp.branchId !== selectedBranch) return false;
    if (searchTerm.trim()) {
      return emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getBoxEmployees = (boxId) => {
    return filteredEmployees.filter(emp => emp.boxId === boxId);
  };

  // Matrix Layout & Light Theme Colors for the 9 Boxes
  const boxesLightTheme = {
    'HIGH_HIGH': { title: '🟢 Star / Top Performer', desc: 'Ketepatan Waktu Tinggi & Dokumen Selalu Lengkap', color: 'bg-emerald-50 border-emerald-300 text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
    'MED_HIGH': { title: '🟢 High Professional', desc: 'Dokumen Sangat Lengkap, Waktu Pengerjaan Baik', color: 'bg-emerald-50/70 border-emerald-200 text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
    'LOW_HIGH': { title: '🟡 Quality Specialist', desc: 'Dokumen Sangat Rapi, Namun Sering Terlambat', color: 'bg-amber-50/70 border-amber-200 text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    
    'HIGH_MED': { title: '🟢 Fast Executor', desc: 'Pengerjaan Sangat Cepat, Dokumen Standar', color: 'bg-sky-50 border-sky-200 text-sky-900', badge: 'bg-sky-100 text-sky-800' },
    'MED_MED': { title: '🔵 Core Performer', desc: 'Ketepatan Waktu & Dokumen Sesuai Standar', color: 'bg-slate-50 border-slate-200 text-slate-900', badge: 'bg-slate-200 text-slate-800' },
    'LOW_MED': { title: '🟡 Diligence Risk', desc: 'Keterlambatan Cukup Tinggi, Dokumen Standar', color: 'bg-amber-50/70 border-amber-200 text-amber-900', badge: 'bg-amber-100 text-amber-800' },

    'HIGH_LOW': { title: '🟡 Speed Operator', desc: 'Tepat Waktu Cepat, Sering Lupa Upload Dokumen', color: 'bg-amber-50/70 border-amber-200 text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    'MED_LOW': { title: '🔴 Compliance Issue', desc: 'Dokumen Sering Kurang, Ketepatan Waktu Standar', color: 'bg-rose-50/70 border-rose-200 text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    'LOW_LOW': { title: '🔴 Underperformer / Need Action', desc: 'Sering Terlambat & Dokumen Tidak Lengkap', color: 'bg-rose-100 border-rose-300 text-rose-900', badge: 'bg-rose-200 text-rose-900' },
  };

  const matrixLayout = [
    ['LOW_HIGH', 'MED_HIGH', 'HIGH_HIGH'],
    ['LOW_MED', 'MED_MED', 'HIGH_MED'],
    ['LOW_LOW', 'MED_LOW', 'HIGH_LOW']
  ];

  return (
    <div className="space-y-4 text-[11px] pb-12 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-extrabold uppercase tracking-widest">
              Matrix Evaluasi SDM HMC
            </span>
          </div>
          <h1 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-600" />
            Pengelompokan Karyawan Matrix 9-Box (Nine-Box Grid)
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Evaluasi 2 Kriteria Utama: <strong>Ketepatan Waktu Pekerjaan (X-Axis)</strong> vs <strong>Kelengkapan Dokumen Bukti (Y-Axis)</strong>.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Staf / PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg pl-8 pr-3 py-1 text-[10px] focus:outline-none focus:bg-white"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-1 text-[10px]"
          >
            <option value="ALL">Semua Unit Cabang HMC</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* Axis Information Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
          <span className="text-slate-600 font-bold">X-Axis (Ketepatan Waktu):</span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Low (&lt;60%)</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Med (60-79%)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">High (≥80%)</span>
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
          <span className="text-slate-600 font-bold">Y-Axis (Kelengkapan Dokumen):</span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Low (&lt;60%)</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Med (60-79%)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">High (≥80%)</span>
          </div>
        </div>
      </div>

      {/* 3x3 MATRIX GRID CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        
        <div className="text-center font-bold text-sky-700 text-xs uppercase tracking-wider">
          ▲ Y-AXIS: KELENGKAPAN DOKUMEN & BUKTI UPLOAD
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {matrixLayout.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              {row.map((boxId) => {
                const boxEmps = getBoxEmployees(boxId);
                const info = boxesLightTheme[boxId];
                return (
                  <div
                    key={boxId}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition shadow-xs ${info.color}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{info.title}</h4>
                        <p className="text-[9px] text-slate-600 mt-0.5">{info.desc}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono font-black text-xs border ${info.badge}`}>
                        {boxEmps.length} PIC
                      </span>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200/80">
                      {boxEmps.slice(0, 3).map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-200 text-[10px] shadow-xs">
                          <span className="font-bold text-slate-900 truncate max-w-[110px]">{emp.name}</span>
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <span className="text-sky-700 font-mono">⏱{emp.onTimeRate}%</span>
                            <span className="text-emerald-700 font-mono">📁{emp.docCompletenessRate}%</span>
                          </div>
                        </div>
                      ))}

                      {boxEmps.length > 3 && (
                        <button
                          onClick={() => setActiveBoxModal({ boxId, info, boxEmps })}
                          className="w-full py-1 text-center text-[10px] font-bold text-sky-700 hover:underline"
                        >
                          + Liat {boxEmps.length - 3} Staf Lainnya
                        </button>
                      )}

                      {boxEmps.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic text-center py-2">Tidak ada staf di kuadran ini.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center font-bold text-emerald-700 text-xs uppercase tracking-wider pt-2">
          ► X-AXIS: KETEPATAN WAKTU PEKERJAAN (ON-TIME ADHERENCE)
        </div>

      </div>

      {/* POPUP MODAL FOR FULL LIST */}
      {activeBoxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                Kuadran Kinerja: <span className="text-sky-700">{activeBoxModal.info.title}</span>
              </h3>
              <button onClick={() => setActiveBoxModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto text-[11px]">
              {activeBoxModal.boxEmps.map((emp) => (
                <div key={emp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{emp.name}</h4>
                    <span className="text-[10px] text-slate-500">{emp.email} • Cabang: {branches.find(b => b.id === emp.branchId)?.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">Ketepatan Waktu</span>
                      <span className="font-mono font-bold text-sky-700">{emp.onTimeRate}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">Kelengkapan Dokumen</span>
                      <span className="font-mono font-bold text-emerald-700">{emp.docCompletenessRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
