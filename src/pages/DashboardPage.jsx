import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  TrendingUp,
  Award,
  Building2,
  UserCheck,
  Filter,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
  CalendarDays
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { computeGlobalKPIs, getChartData } from '../services/analyticsEngine';

export default function DashboardPage({
  tasks,
  branches,
  regionals,
  departments,
  employees,
  filterState,
  setFilterState,
  onResetFilters,
  onSelectTask,
  onQuickFilterAlert
}) {
  const filteredTasks = tasks.filter(t => {
    if (filterState.period && filterState.period !== 'ALL' && t.period !== filterState.period) return false;
    if (filterState.regionalId && filterState.regionalId !== 'ALL' && t.regionalId !== filterState.regionalId) return false;
    if (filterState.branchId && filterState.branchId !== 'ALL' && t.branchId !== filterState.branchId) return false;
    if (filterState.departmentId && filterState.departmentId !== 'ALL' && t.departmentId !== filterState.departmentId) return false;
    if (filterState.picId && filterState.picId !== 'ALL' && t.picId !== filterState.picId) return false;
    if (filterState.priority && filterState.priority !== 'ALL' && t.priority !== filterState.priority) return false;
    if (filterState.status && filterState.status !== 'ALL' && t.status !== filterState.status) return false;
    return true;
  });

  const filteredBranches = filterState.regionalId && filterState.regionalId !== 'ALL'
    ? branches.filter(b => b.regionalId === filterState.regionalId)
    : branches;

  const kpis = computeGlobalKPIs(filteredTasks);
  const chartData = getChartData(filteredTasks, []);

  const branchScores = filteredBranches.map(b => {
    const bTasks = filteredTasks.filter(t => t.branchId === b.id);
    const total = bTasks.length;
    if (total === 0) return { ...b, score: 100, finished: 0, late: 0 };
    const finished = bTasks.filter(t => t.status === 'SELESAI').length;
    const late = bTasks.filter(t => t.status === 'TERLAMBAT').length;
    const score = Math.max(0, Math.round((finished / total) * 100 - (late / total) * 30));
    return { ...b, score, finished, late, total };
  }).sort((a, b) => b.score - a.score);

  const top5Branches = branchScores.slice(0, 5);
  const bottom5Branches = [...branchScores].reverse().slice(0, 5);

  const overdueCount = filteredTasks.filter(t => t.status === 'TERLAMBAT').length;
  const pendingVerifyCount = filteredTasks.filter(t => t.status === 'MENUNGGU VERIFIKASI').length;
  const dueTodayCount = filteredTasks.filter(t => {
    const today = new Date().toISOString().slice(0, 10);
    return t.deadline.slice(0, 10) === today && t.status !== 'SELESAI';
  }).length;
  const lowComplianceBranchCount = branchScores.filter(b => b.score < 80).length;

  return (
    <div className="space-y-3.5 text-[11px] pb-6 text-slate-800">
      
      {/* White Clean Header Banner */}
      <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-900 font-black text-sm shadow-xs">
            HQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-950 leading-tight">HMC GROUP</h1>
              <span className="px-2 py-0.2 rounded bg-sky-100 text-sky-900 border border-sky-300 text-[9px] font-black uppercase tracking-wider">
                Command Center
              </span>
            </div>
            <p className="text-[10px] text-slate-700 font-semibold mt-0.5">Monitoring 13 Unit Cabang HMC • Cirebon, Kuningan, Indramayu, Kedawung, Majalengka, Malang, Subang, Cianjur, Bandung, Garut, Pakisaji, Karangasem, Serang</p>
          </div>
        </div>

        <button
          onClick={onResetFilters}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition shadow-xs"
        >
          <RefreshCw className="w-3 h-3 text-sky-700" /> Reset Filter
        </button>
      </div>

      {/* 🔄 OPERATIONAL WORKFLOW GUIDE DIAGRAM */}
      <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-950 font-black text-[9px] uppercase border border-sky-300">
              STANDAR DIAGRAM ALUR KERJA (FLOW)
            </span>
            <h2 className="text-xs font-black text-slate-950">Alur Operasional Pengawasan & Penugasan HMC GROUP</h2>
          </div>
          <span className="text-[9px] text-slate-600 font-bold">5 Fase Terstruktur</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-sky-800 font-black">
              <span>1. Penerbitan Perintah</span>
              <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-950 flex items-center justify-center text-[9px]">1</span>
            </div>
            <p className="text-slate-700 text-[9.5px] font-semibold">Direksi Holding/Manager menerbitkan tugas ke <strong>Pribadi, Tim, Divisi, atau Unit Cabang</strong>.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-indigo-800 font-black">
              <span>2. Submission & Upload Bukti</span>
              <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-950 flex items-center justify-center text-[9px]">2</span>
            </div>
            <p className="text-slate-700 text-[9.5px] font-semibold">PIC Lapangan mengerjakan tugas, mengisikan angka laporan & <strong>wajib upload dokumen</strong>.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-amber-800 font-black">
              <span>3. Verifikasi & Matrix 9-Box</span>
              <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-[9px]">3</span>
            </div>
            <p className="text-slate-700 text-[9.5px] font-semibold">Kepala Cabang memverifikasi bukti. Sistem memetakan SDM ke dalam <strong>Matrix 9-Box Kinerja</strong>.</p>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-emerald-800 font-black">
              <span>4. Pelaporan & Leaderboard</span>
              <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-950 flex items-center justify-center text-[9px]">4</span>
            </div>
            <p className="text-slate-700 text-[9.5px] font-semibold">Analitik otomatis terkompilasi ke <strong>Leaderboard Cabang & Ekspor Laporan Bulanan</strong>.</p>
          </div>
        </div>
      </div>

      {/* 🔴 LIVE REPORT FEED STREAM: TUGAS BARU SELESAI / SUBMITTED */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-white border border-emerald-300/80 rounded-xl p-2.5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <h3 className="font-extrabold text-emerald-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span>LIVE REPORT FEED: STREAM TUGAS BARU SELESAI & DISUBMIT</span>
            </h3>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
            REALTIME UPDATE LIVE
          </span>
        </div>

        {/* Horizontal Ticker List of Recently Finished Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {tasks.filter(t => t.status === 'SELESAI' || t.status === 'MENUNGGU VERIFIKASI').slice(0, 3).map((task) => (
            <div key={task.id} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-xs">
              <div className="truncate pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sky-700 text-[10px]">{task.id}</span>
                  <span className="font-bold text-slate-900 truncate text-[11px]">{task.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{task.branchName}</span>
                  <span>•</span>
                  <span>{task.picName}</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-700 font-bold">⏱ 01 Sep 2026, 09:45 WIB</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTask(task)}
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[9px] font-extrabold flex-shrink-0"
              >
                Detail
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COMPACT DYNAMIC FILTER BAR */}
      <div className="bg-white border border-slate-200/90 p-2.5 rounded-xl space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Filter className="w-3 h-3 text-sky-600" />
            <span>Filter Presisi</span>
          </div>
          <span className="text-sky-700 font-mono font-bold">
            {filteredTasks.length} / {tasks.length} Pekerjaan
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1.5 text-[10px]">
          <div>
            <select
              value={filterState.period || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, period: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua Periode</option>
              <option value="Sekali">Sekali</option>
              <option value="Harian">Harian</option>
              <option value="Mingguan">Mingguan</option>
              <option value="Bulanan">Bulanan</option>
            </select>
          </div>

          <div>
            <select
              value={filterState.regionalId || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, regionalId: e.target.value, branchId: 'ALL' })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua Regional</option>
              {regionals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <select
              value={filterState.branchId || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, branchId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua Cabang HMC</option>
              {filteredBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <select
              value={filterState.departmentId || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, departmentId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua Dept</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <select
              value={filterState.priority || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, priority: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="HIGH">Tinggi / Critical</option>
              <option value="MEDIUM">Sedang / Normal</option>
              <option value="LOW">Rendah / Low</option>
            </select>
          </div>

          <div>
            <select
              value={filterState.status || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, status: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="SELESAI">🟢 Selesai</option>
              <option value="SEDANG DIKERJAKAN">🔵 In Progress</option>
              <option value="MENUNGGU VERIFIKASI">🟡 Menunggu Verifikasi</option>
              <option value="BELUM DIKERJAKAN">🟠 Belum Dikerjakan</option>
              <option value="TERLAMBAT">🔴 Terlambat</option>
              <option value="REVISI">🟣 Revisi</option>
            </select>
          </div>

          <div>
            <select
              value={filterState.picId || 'ALL'}
              onChange={(e) => setFilterState({ ...filterState, picId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md px-2 py-1 focus:outline-none focus:bg-white"
            >
              <option value="ALL">Semua PIC</option>
              {employees.filter(e => e.roleId === 'ROLE-PIC').map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* COMPACT ⚠️ NEED MANAGEMENT ATTENTION ALERT BAR */}
      <div className="bg-gradient-to-r from-rose-50/70 via-amber-50/60 to-white border border-rose-200 rounded-xl p-2.5 shadow-xs">
        <div className="flex items-center gap-1.5 text-rose-700 font-extrabold text-[10px] uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-rose-600" />
          <span>⚠️ Management Attention Alerts</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => onQuickFilterAlert('TERLAMBAT')}
            className="p-2 bg-white hover:bg-rose-50/50 border border-rose-200 rounded-lg text-left transition flex items-center justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] text-rose-700 font-bold uppercase block">Pekerjaan Terlambat</span>
              <span className="text-base font-black text-rose-900">{overdueCount} Task</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-rose-600" />
          </button>

          <button
            onClick={() => onQuickFilterAlert('MENUNGGU VERIFIKASI')}
            className="p-2 bg-white hover:bg-amber-50/50 border border-amber-200 rounded-lg text-left transition flex items-center justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] text-amber-700 font-bold uppercase block">Menunggu Verifikasi</span>
              <span className="text-base font-black text-amber-900">{pendingVerifyCount} Task</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
          </button>

          <button
            onClick={() => onQuickFilterAlert('TODAY')}
            className="p-2 bg-white hover:bg-sky-50/50 border border-sky-200 rounded-lg text-left transition flex items-center justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] text-sky-700 font-bold uppercase block">Jatuh Tempo Hari Ini</span>
              <span className="text-base font-black text-sky-900">{dueTodayCount} Task</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
          </button>

          <button
            onClick={() => onQuickFilterAlert('LOW_COMPLIANCE')}
            className="p-2 bg-white hover:bg-purple-50/50 border border-purple-200 rounded-lg text-left transition flex items-center justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] text-purple-700 font-bold uppercase block">Compliance &lt; 80%</span>
              <span className="text-base font-black text-purple-900">{lowComplianceBranchCount} Cabang</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* HIGH DENSITY KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Task</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{kpis.total}</span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">🟢 Selesai</span>
          <span className="text-xl font-black text-emerald-900 mt-0.5 block">{kpis.finished}</span>
        </div>

        <div className="bg-sky-50/60 border border-sky-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-sky-700 uppercase tracking-wider block">🔵 In Progress</span>
          <span className="text-xl font-black text-sky-900 mt-0.5 block">{kpis.inProgress}</span>
        </div>

        <div className="bg-orange-50/60 border border-orange-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-orange-700 uppercase tracking-wider block">🟠 Belum</span>
          <span className="text-xl font-black text-orange-900 mt-0.5 block">{kpis.notStarted}</span>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">🟡 Verifikasi</span>
          <span className="text-xl font-black text-amber-900 mt-0.5 block">{kpis.pendingVerify}</span>
        </div>

        <div className="bg-rose-50/60 border border-rose-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">🔴 Terlambat</span>
          <span className="text-xl font-black text-rose-900 mt-0.5 block">{kpis.overdue}</span>
        </div>

        <div className="bg-purple-50/60 border border-purple-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider block">🟣 Revisi</span>
          <span className="text-xl font-black text-purple-900 mt-0.5 block">{kpis.revision}</span>
        </div>

        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-sky-700 uppercase tracking-wider block">Completion</span>
          <span className="text-xl font-black text-sky-700 mt-0.5 block">{kpis.completionRate}%</span>
        </div>

        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">On-Time Rate</span>
          <span className="text-xl font-black text-emerald-700 mt-0.5 block">{kpis.onTimeRate}%</span>
        </div>
      </div>

      {/* COMPACT DAILY & WEEKLY CONTROL WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
              <span>Daily Control (TODAY)</span>
            </div>
            <span className="text-slate-500 font-mono">01 Sep 2026</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Jatuh Tempo</span>
              <span className="font-black text-sky-700 text-sm">{dueTodayCount}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Belum Dimulai</span>
              <span className="font-black text-orange-700 text-sm">{kpis.notStarted}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Verifikasi</span>
              <span className="font-black text-amber-700 text-sm">{kpis.pendingVerify}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Selesai Today</span>
              <span className="font-black text-emerald-700 text-sm">14</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Weekly Management Summary</span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Minggu ke-35
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Top Branch</span>
              <span className="font-bold text-emerald-700 block truncate">{top5Branches[0]?.name || 'HMC Cirebon'} (98%)</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Lowest Branch</span>
              <span className="font-bold text-rose-700 block truncate">{bottom5Branches[0]?.name || 'HMC Subang'} (65%)</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Eskalasi Sent</span>
              <span className="font-bold text-amber-700 block font-mono text-xs">8 Alert</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT RECHARTS GRID (OPTIMIZED LIGHT THEME) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Chart 1: Monthly Trend */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <h3 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
            1. Trend Completion per Bulan
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyCompletion} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '10px', color: '#0f172a' }} />
                <Bar dataKey="Selesai" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Terlambat" fill="#e11d48" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Donut */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <h3 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
            2. Distribusi Status Pekerjaan
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '10px', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Priority */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <h3 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
            3. Prioritas Pekerjaan
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.priorityData.map((entry, index) => (
                    <Cell key={`cell-p-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '10px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TOP 5 & BOTTOM 5 CABANG COMPLIANCE TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Top 5 Cabang */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <h3 className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
              🏆 Top 5 Cabang HMC Compliance Terbaik
            </h3>
          </div>

          <div className="space-y-1 text-[10px]">
            {top5Branches.map((b, idx) => (
              <div key={b.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[9px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{b.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{b.total} Task</span>
                  <span className="font-black text-emerald-700 font-mono text-xs">{b.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 Cabang */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <h3 className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
              ⚠️ Bottom 5 Cabang HMC Compliance Terendah
            </h3>
          </div>

          <div className="space-y-1 text-[10px]">
            {bottom5Branches.map((b, idx) => (
              <div key={b.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-rose-100 text-rose-800 font-extrabold text-[9px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{b.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Terlambat: {b.late}</span>
                  <span className="font-black text-rose-700 font-mono text-xs">{b.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
