import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertTriangle, Eye, X } from 'lucide-react';
import { getStatusBadgeColor } from '../services/deadlineEngine';

export default function KalenderPage({ tasks, onSelectTask }) {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-09-01'));
  const [selectedDayTasks, setSelectedDayTasks] = useState(null);
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Calculate days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Map tasks to dates
  const getTasksForDate = (dayNumber) => {
    const dateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    return tasks.filter(t => t.deadline.startsWith(dateFormatted));
  };

  const handleDateClick = (dayNumber, dateTasks) => {
    if (dateTasks.length === 0) return;
    const dateFormatted = `${dayNumber} ${monthNames[month]} ${year}`;
    setSelectedDateStr(dateFormatted);
    setSelectedDayTasks(dateTasks);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-sky-400" />
            Kalender Pekerjaan & Deadline Holding
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi kalender bulanan dengan pemetaan deadline seluruh perintah pekerjaan.
          </p>
        </div>

        {/* Month Switcher Controls */}
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-1.5 rounded-xl">
          <button onClick={prevMonth} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-white px-3 min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Indicators */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px]">Indikator Warna Deadline:</span>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-300">🟢 Selesai</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-300">🟡 Akan Jatuh Tempo</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span><span className="text-slate-300">🔴 Terlambat / Overdue</span></div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4">
        
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="py-2 text-rose-400">Minggu</div>
          <div className="py-2">Senin</div>
          <div className="py-2">Selasa</div>
          <div className="py-2">Rabu</div>
          <div className="py-2">Kamis</div>
          <div className="py-2">Jumat</div>
          <div className="py-2 text-sky-400">Sabtu</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 gap-2">
          
          {/* Blank padding for first week */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`blank-${i}`} className="h-28 bg-slate-900/40 rounded-xl border border-slate-800/40 opacity-40"></div>
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateTasks = getTasksForDate(dayNum);
            const isToday = dayNum === 1 && month === 8 && year === 2026; // 1 Sep 2026

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => handleDateClick(dayNum, dateTasks)}
                className={`h-28 p-2 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                  isToday
                    ? 'bg-sky-950/50 border-sky-500 shadow-md shadow-sky-500/20'
                    : dateTasks.length > 0
                    ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                    : 'bg-slate-800/20 border-slate-800/60 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-black text-xs px-2 py-0.5 rounded ${
                    isToday ? 'bg-sky-600 text-white' : 'text-slate-200'
                  }`}>
                    {dayNum}
                  </span>
                  {dateTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-sky-400 font-mono">
                      {dateTasks.length} Task
                    </span>
                  )}
                </div>

                {/* Day Tasks Badges Preview */}
                <div className="space-y-1 overflow-hidden">
                  {dateTasks.slice(0, 2).map((t) => {
                    const badge = getStatusBadgeColor(t.status);
                    return (
                      <div
                        key={t.id}
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {t.title}
                      </div>
                    );
                  })}
                  {dateTasks.length > 2 && (
                    <div className="text-[9px] font-bold text-slate-400 text-center">
                      +{dateTasks.length - 2} lainnya
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Date Task Popup Modal */}
      {selectedDayTasks && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-sky-400" />
                Pekerjaan Jatuh Tempo: <span className="text-sky-400">{selectedDateStr}</span>
              </h3>
              <button onClick={() => setSelectedDayTasks(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
              {selectedDayTasks.map((t) => {
                const badge = getStatusBadgeColor(t.status);
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedDayTasks(null);
                      onSelectTask(t);
                    }}
                    className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{t.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">{t.branchName} • PIC: {t.picName}</p>
                    </div>

                    <button className="px-3 py-1.5 bg-sky-900/60 text-sky-300 rounded-lg text-xs font-semibold group-hover:bg-sky-600 group-hover:text-white transition">
                      Lihat Detail
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
