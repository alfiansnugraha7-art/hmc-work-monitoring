import React from 'react';
import { BarChart3, TrendingUp, Award, AlertCircle, Percent, ShieldCheck, CheckCircle2, FileText, Upload, Users } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { computeGlobalKPIs, getComplianceCategory, computeSubmissionAnalytics } from '../services/analyticsEngine';

export default function AnalyticCompliancePage({ tasks, branches }) {
  const kpis = computeGlobalKPIs(tasks);
  const submissionAnalytics = computeSubmissionAnalytics(tasks);
  
  const avgComplianceScore = 88;
  const overallCategory = getComplianceCategory(avgComplianceScore);

  return (
    <div className="space-y-4 text-[11px] pb-12 text-slate-800">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-600" />
            Analytic & Compliance Scoring Matrix HMC
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Integrasi Real-time Data Pekerjaan, Form Submission, Berkas Upload, dan Scoring Kepatuhan Cabang HMC.
          </p>
        </div>
      </div>

      {/* Main 4 Metric Formulas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* 1. Completion Rate */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-sky-700 uppercase tracking-wider block">1. Completion Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">{kpis.completionRate}%</span>
            <span className="text-[10px] text-emerald-700 font-bold">↑ Selesai</span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100">
            Formula: (Selesai / Total Task) × 100%
          </p>
        </div>

        {/* 2. On-Time Rate */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">2. On-Time Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-700">{kpis.onTimeRate}%</span>
            <span className="text-[10px] text-emerald-700 font-bold">Tepat Waktu</span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100">
            Formula: (Selesai Tepat Waktu / Selesai) × 100%
          </p>
        </div>

        {/* 3. Document Attachment Rate */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider block">3. Document Upload Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-indigo-700">{submissionAnalytics.attachmentRate}%</span>
            <span className="text-[10px] text-indigo-600 font-bold">Bukti Terlampir</span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100">
            Formula: (Task Berdokumen / Total Submit) × 100%
          </p>
        </div>

        {/* 4. Weighted Compliance Score */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-sky-700 uppercase tracking-wider block">4. Compliance Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">{avgComplianceScore}</span>
            <span className="text-[10px] font-bold text-sky-600">/ 100</span>
          </div>
          <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded ${overallCategory.bg} ${overallCategory.text} border inline-block`}>
            {overallCategory.label}
          </span>
        </div>

      </div>

      {/* DEDICATED UPLOADED DATA ANALYTICS & CHARTS SECTION */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              📁 Analitik Data Upload Form & Dokumen Bukti (Terhubung Real-Time)
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[9px]">
            {submissionAnalytics.totalSubmitted} Laporan Terkumpul
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Attendance Analytics Donut Chart */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase">
              1. Rekapitulasi Presensi Nakes (Dari Form Upload)
            </h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={submissionAnalytics.attendancePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {submissionAnalytics.attendancePie.map((entry, index) => (
                      <Cell key={`cell-att-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Form Numerical Summary Cards */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 col-span-2">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase">
              2. Total Kumulatif Data Nakes / Staf Ter-input dari 13 Cabang HMC
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                <span className="text-[9px] text-slate-500 block font-semibold">Total Karyawan Terdata</span>
                <span className="text-lg font-black text-slate-900">{submissionAnalytics.attendanceSummary.totalEmployees} Orang</span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center shadow-xs">
                <span className="text-[9px] text-emerald-700 block font-semibold">🟢 Total Hadir Tepat Waktu</span>
                <span className="text-lg font-black text-emerald-800">{submissionAnalytics.attendanceSummary.present} Orang</span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center shadow-xs">
                <span className="text-[9px] text-amber-700 block font-semibold">🟡 Total Terlambat</span>
                <span className="text-lg font-black text-amber-800">{submissionAnalytics.attendanceSummary.late} Orang</span>
              </div>
              <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-center shadow-xs">
                <span className="text-[9px] text-sky-700 block font-semibold">🔵 Total Izin Resmi</span>
                <span className="text-lg font-black text-sky-800">{submissionAnalytics.attendanceSummary.permit} Orang</span>
              </div>
              <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-center shadow-xs">
                <span className="text-[9px] text-purple-700 block font-semibold">🟣 Total Sakit</span>
                <span className="text-lg font-black text-purple-800">{submissionAnalytics.attendanceSummary.sick} Orang</span>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-center shadow-xs">
                <span className="text-[9px] text-rose-700 block font-semibold">🔴 Total Alpa/Mangkir</span>
                <span className="text-lg font-black text-rose-800">{submissionAnalytics.attendanceSummary.absent} Orang</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Compliance Standard Scale */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Skala Kategori Compliance Score Holding HMC (0 – 100)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
            <span className="text-base font-black text-emerald-800 block">90 – 100</span>
            <span className="font-bold text-emerald-700 uppercase text-[10px] block">Excellent</span>
            <p className="text-slate-500 text-[10px]">Kepatuhan sempurna, selalu submit tepat waktu & dokumen lengkap.</p>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-0.5">
            <span className="text-base font-black text-sky-800 block">80 – 89</span>
            <span className="font-bold text-sky-700 uppercase text-[10px] block">Good</span>
            <p className="text-slate-500 text-[10px]">Kepatuhan tinggi, pengerjaan konsisten dengan penyelesaian baik.</p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-0.5">
            <span className="text-base font-black text-amber-800 block">70 – 79</span>
            <span className="font-bold text-amber-700 uppercase text-[10px] block">Fair</span>
            <p className="text-slate-500 text-[10px]">Kepatuhan cukup, terdapat sedikit keterlambatan minor.</p>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-0.5">
            <span className="text-base font-black text-rose-800 block">&lt; 70</span>
            <span className="font-bold text-rose-700 uppercase text-[10px] block">Need Attention</span>
            <p className="text-slate-500 text-[10px]">Perlu evaluasi & tindakan pembinaan khusus oleh Direksi.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
