import React, { useState } from 'react';
import { Calendar, Filter, ChevronRight, CheckCircle2, Clock, AlertTriangle, Layers, ArrowRight, Building2 } from 'lucide-react';
import { getStatusBadgeColor } from '../services/deadlineEngine';

export default function GanttChartPage({ tasks, branches, onSelectTask }) {
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');

  const filteredTasks = tasks.filter(t => {
    if (selectedBranch !== 'ALL' && t.branchId !== selectedBranch) return false;
    if (selectedPeriod !== 'ALL' && t.period !== selectedPeriod) return false;
    return true;
  });

  // Timeline Days (1 Sep - 10 Sep 2026)
  const timelineDays = [
    { date: '01 Sep', day: 'Sel' },
    { date: '02 Sep', day: 'Rab' },
    { date: '03 Sep', day: 'Kam' },
    { date: '04 Sep', day: 'Jum' },
    { date: '05 Sep', day: 'Sab' },
    { date: '06 Sep', day: 'Min' },
    { date: '07 Sep', day: 'Sen' },
    { date: '08 Sep', day: 'Sel' },
    { date: '09 Sep', day: 'Rab' },
    { date: '10 Sep', day: 'Kam' },
  ];

  // Helper to calculate start & span column for Gantt bar
  const getGanttPosition = (startDateStr, deadlineStr) => {
    const startDay = new Date(startDateStr).getDate() || 1;
    const endDay = new Date(deadlineStr).getDate() || 2;
    const colStart = Math.max(1, Math.min(10, startDay));
    const colSpan = Math.max(1, Math.min(10 - colStart + 1, endDay - colStart + 1));
    return { colStart, colSpan };
  };

  return (
    <div className="space-y-4 text-[11px] pb-12 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-extrabold uppercase tracking-widest">
              Visualisasi Portfolio HMC
            </span>
          </div>
          <h1 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            Interactive Gantt Chart & Dependency Tracker
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Pemantauan timeline durasi pengerjaan & keterkaitan antar-tugas (*Task Dependencies*) Holding HMC.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-1 text-[10px]"
          >
            <option value="ALL">Semua Unit Cabang HMC</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-1 text-[10px]"
          >
            <option value="ALL">Semua Periode</option>
            <option value="Harian">Harian</option>
            <option value="Mingguan">Mingguan</option>
            <option value="Bulanan">Bulanan</option>
          </select>
        </div>
      </div>

      {/* GANTT CHART CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            
            {/* Table Header: Task Info + Timeline Grid */}
            <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wider divide-x divide-slate-200">
              <div className="col-span-4 p-3">Rincian Perintah Pekerjaan</div>
              <div className="col-span-8 grid grid-cols-10 text-center">
                {timelineDays.map((d, i) => (
                  <div key={i} className="py-2 px-1 border-r border-slate-200/60 last:border-r-0">
                    <span className="block text-slate-800 font-extrabold">{d.date}</span>
                    <span className="block text-[8px] text-slate-400 font-normal">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Rows & Gantt Bars */}
            <div className="divide-y divide-slate-100 text-[11px]">
              {filteredTasks.map((t, idx) => {
                const badge = getStatusBadgeColor(t.status);
                const pos = getGanttPosition(t.startDate, t.deadline);
                const parentTask = idx > 0 && idx % 2 === 1 ? filteredTasks[idx - 1] : null;

                return (
                  <div key={t.id} className="grid grid-cols-12 hover:bg-slate-50/80 transition items-center divide-x divide-slate-100">
                    
                    {/* Task Info Column */}
                    <div className="col-span-4 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sky-700">{t.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{t.title}</h4>
                      
                      <div className="flex items-center gap-2 text-[9px] text-slate-500">
                        <span className="font-semibold text-slate-700">{t.branchName}</span>
                        <span>•</span>
                        <span>{t.picName}</span>
                      </div>

                      {/* Task Dependency Indicator */}
                      {parentTask && (
                        <div className="pt-1 flex items-center gap-1 text-[8px] text-amber-700 font-bold">
                          <Layers className="w-3 h-3 text-amber-600" />
                          <span>Dependent: Butuh {parentTask.id} Selesai</span>
                        </div>
                      )}
                    </div>

                    {/* Timeline Grid & Progress Bar Column */}
                    <div className="col-span-8 p-3 relative grid grid-cols-10 items-center h-full">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 grid grid-cols-10 divide-x divide-slate-100 pointer-events-none">
                        {timelineDays.map((_, i) => (
                          <div key={i} className="h-full"></div>
                        ))}
                      </div>

                      {/* Gantt Timeline Bar */}
                      <div
                        className={`relative z-10 h-7 rounded-lg shadow-xs border p-1 flex items-center justify-between text-white font-bold text-[9px] transition cursor-pointer ${
                          t.status === 'SELESAI' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400' :
                          t.status === 'TERLAMBAT' ? 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400' :
                          t.status === 'SEDANG DIKERJAKAN' ? 'bg-gradient-to-r from-sky-500 to-sky-600 border-sky-400' :
                          'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400'
                        }`}
                        style={{
                          gridColumnStart: pos.colStart,
                          gridColumnEnd: `span ${pos.colSpan}`
                        }}
                        onClick={() => onSelectTask(t)}
                        title={`Klik untuk detail ${t.id}`}
                      >
                        <span className="truncate pl-1">{t.title}</span>
                        <span className="px-1.5 py-0.2 rounded bg-black/20 text-[8px] font-mono">
                          {t.status === 'SELESAI' ? '100%' : t.status === 'SEDANG DIKERJAKAN' ? '60%' : '0%'}
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
