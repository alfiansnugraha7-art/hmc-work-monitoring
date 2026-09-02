import React from 'react';
import { FileSpreadsheet, Download, FileText, Printer, CheckCircle2, TrendingUp } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../services/exportService';
import { computeGlobalKPIs, computeBranchCompliance } from '../services/analyticsEngine';

export default function ReportPage({ tasks, branches, regionals }) {
  const globalKPIs = computeGlobalKPIs(tasks);
  const branchCompliance = computeBranchCompliance(tasks, branches);

  const handleExportExcel = () => {
    exportToExcel(tasks, branchCompliance, globalKPIs);
  };

  const handleExportPDF = () => {
    exportToPDF(tasks, branchCompliance, globalKPIs);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Laporan Manajerial Bulanan
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            HOLDING WORK COMPLIANCE REPORT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Laporan resmi kepatuhan pengerjaan tugas & performa cabang periode Agustus - September 2026.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel (.xlsx)
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
          >
            <FileText className="w-4 h-4" /> Export PDF (.pdf)
          </button>
        </div>
      </div>

      {/* Report Document Preview Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-xs">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              HMC GROUP (HOLDING HASNA MEDIKA)
            </h2>
            <p className="text-sky-400 font-bold text-xs mt-0.5">
              DIVISI COMMAND & WORK MONITORING CENTER
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Menara HMC Group Lt. 15, Cirebon • Email: report@hmcgroup.co.id
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">No. Laporan</span>
            <span className="font-mono font-extrabold text-white text-sm">REP/HOLDING/2026/09-001</span>
            <span className="text-[10px] text-slate-500 block mt-1">Cetak: {new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-white uppercase text-xs tracking-wider border-l-4 border-sky-500 pl-3">
            I. Executive Summary & Ringkasan KPI
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Perintah Diterbitkan</span>
              <span className="text-xl font-black text-white">{globalKPIs.total} Task</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Selesai & Verified</span>
              <span className="text-xl font-black text-emerald-400">{globalKPIs.finished} Task</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Completion Rate (%)</span>
              <span className="text-xl font-black text-sky-400">{globalKPIs.completionRate}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Rata-rata On-Time Rate</span>
              <span className="text-xl font-black text-emerald-300">{globalKPIs.onTimeRate}%</span>
            </div>
          </div>
        </div>

        {/* Compliance Rankings */}
        <div className="space-y-3">
          <h3 className="font-bold text-white uppercase text-xs tracking-wider border-l-4 border-sky-500 pl-3">
            II. Matriks Kepatuhan Cabang (Compliance Rankings)
          </h3>

          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Peringkat</th>
                  <th className="py-2.5 px-4">Nama Cabang</th>
                  <th className="py-2.5 px-4">Regional</th>
                  <th className="py-2.5 px-4 text-center">Total Task</th>
                  <th className="py-2.5 px-4 text-center">Selesai</th>
                  <th className="py-2.5 px-4 text-center">Terlambat</th>
                  <th className="py-2.5 px-4 text-center">Compliance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {branchCompliance.slice(0, 8).map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-extrabold text-sky-400">#{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-white">{b.name}</td>
                    <td className="py-2.5 px-4">{b.regionalId}</td>
                    <td className="py-2.5 px-4 text-center">{b.totalTasks}</td>
                    <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">{b.finished}</td>
                    <td className="py-2.5 px-4 text-center text-rose-400 font-bold">{b.late}</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-white">{b.complianceScore} / 100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Issues & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-bold text-rose-400 text-xs uppercase">Top Issues & Kendala Keterlambatan</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc pl-4">
              <li>Laporan Rekonsiliasi Kas Cabang Subang mengalami kendala penyesuaian bukti statement bank.</li>
              <li>Staf PIC Cabang Majalengka kurang merespons reminder H-1 otomatis.</li>
              <li>Audit K3 Gudang Semarang membutuhkan kelengkapan foto APD terbaru.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-bold text-emerald-400 text-xs uppercase">Rekomendasi Tindak Lanjut Direksi</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc pl-4">
              <li>Instruksikan Regional Manager 1 untuk melakukan pembinaan langsung ke Cabang Subang.</li>
              <li>Terapkan poin reward compliance pada KPI semesteran seluruh Branch Manager.</li>
              <li>Lakukan otomatisasi push notification WhatsApp untuk reminder Hari H jam 08:00 WIB.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
