import React, { useState } from 'react';
import { Award, Trophy, Medal, Star, Flame, CheckCircle2, ShieldCheck, Download, Printer, X } from 'lucide-react';
import { computeBranchCompliance, computePICCompliance } from '../services/analyticsEngine';

export default function LeaderboardPage({ tasks, branches, employees }) {
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedBranchCert, setSelectedBranchCert] = useState(null);

  const branchCompliance = computeBranchCompliance(tasks, branches);
  const picCompliance = computePICCompliance(tasks, employees);

  const top3Branches = branchCompliance.slice(0, 3);
  const restBranches = branchCompliance.slice(3);

  const top3PICs = picCompliance.slice(0, 5);

  const handleOpenCertificate = (branch) => {
    setSelectedBranchCert(branch);
    setShowCertModal(true);
  };

  return (
    <div className="space-y-4 text-[11px] pb-12 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold uppercase tracking-widest">
              Program Apresiasi Holding HMC
            </span>
          </div>
          <h1 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Monthly Branch Compliance Leaderboard & Gamification
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Papan Peringkat Bulanan Kepatuhan & Performa Cabang HMC & PIC Terbaik Periode September 2026.
          </p>
        </div>

        <button
          onClick={() => handleOpenCertificate(top3Branches[0])}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
        >
          <Award className="w-4 h-4" /> Cetak Sertifikat Juara 1
        </button>
      </div>

      {/* TOP 3 PODIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* 🥈 2nd Place: SILVER */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between order-2 md:order-1">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-slate-600 text-sm shadow-xs">
              2
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-extrabold text-[9px] uppercase">
              🥈 SILVER CHAMPION
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900">{top3Branches[1]?.name || 'HMC Kuningan'}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Regional: {top3Branches[1]?.regionalId || 'Regional 1'}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 font-semibold">Skor Compliance:</span>
              <span className="font-mono font-black text-slate-800 text-sm">{top3Branches[1]?.complianceScore || 95}%</span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-500">Task Selesai:</span>
              <span className="font-bold text-emerald-700">{top3Branches[1]?.finished || 12} Task</span>
            </div>
          </div>
        </div>

        {/* 🥇 1st Place: GOLD (CENTER HIGHLIGHT) */}
        <div className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-400 p-5 rounded-2xl shadow-md space-y-3 flex flex-col justify-between order-1 md:order-2 transform md:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center font-black text-base shadow-md">
              1
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-white font-black text-[9px] uppercase shadow-xs">
              🥇 GOLD CHAMPION (JUARA 1)
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>{top3Branches[0]?.name || 'HMC Cirebon'}</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            </h3>
            <p className="text-[10px] text-amber-800 font-bold mt-0.5">Cabang HMC Paling Patuh & Tepat Waktu</p>
          </div>

          <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1 shadow-xs">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-600 font-semibold">Skor Compliance:</span>
              <span className="font-mono font-black text-amber-600 text-base">{top3Branches[0]?.complianceScore || 98}%</span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-500">Tepat Waktu:</span>
              <span className="font-bold text-emerald-700">100% Sempurna</span>
            </div>
          </div>

          <button
            onClick={() => handleOpenCertificate(top3Branches[0])}
            className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] shadow-xs"
          >
            📜 Lihat Sertifikat Penghargaan
          </button>
        </div>

        {/* 🥉 3rd Place: BRONZE */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between order-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-amber-900/10 border border-amber-700/30 flex items-center justify-center font-black text-amber-800 text-sm shadow-xs">
              3
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[9px] uppercase">
              🥉 BRONZE CHAMPION
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900">{top3Branches[2]?.name || 'HMC Indramayu'}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Regional: {top3Branches[2]?.regionalId || 'Regional 1'}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 font-semibold">Skor Compliance:</span>
              <span className="font-mono font-black text-slate-800 text-sm">{top3Branches[2]?.complianceScore || 92}%</span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-500">Task Selesai:</span>
              <span className="font-bold text-emerald-700">{top3Branches[2]?.finished || 10} Task</span>
            </div>
          </div>
        </div>

      </div>

      {/* PIC LEADERBOARD & ACHIEVEMENT BADGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Top 5 Staff / PIC */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              Top 5 PIC Staf Terbaik Periode Ini
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">Diperbarui Live</span>
          </div>

          <div className="space-y-1.5">
            {top3PICs.map((pic, idx) => (
              <div key={pic.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{pic.name}</h4>
                    <span className="text-[9px] text-slate-500">Total {pic.totalTasks} Task • {pic.email}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-emerald-700 text-xs">{pic.complianceScore}%</span>
                  <span className="block text-[8px] text-slate-400 uppercase font-bold">On-Time {pic.onTimeRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Achievements Grid */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Medal className="w-4 h-4 text-sky-600" />
            Lencana Apresiasi Gamifikasi HMC
          </h3>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Zero Overdue Star</span>
              </div>
              <p className="text-slate-600 text-[9px]">Diberikan kepada Cabang HMC tanpa riwayat keterlambatan.</p>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Speed Demon Award</span>
              </div>
              <p className="text-slate-600 text-[9px]">Penyelesaian tugas dalam waktu kurang dari 2 jam.</p>
            </div>

            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-800 font-extrabold">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>100% Doc Completeness</span>
              </div>
              <p className="text-slate-600 text-[9px]">Upload dokumen bukti secara sempurna & lengkap.</p>
            </div>

            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-sky-800 font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Top Evaluator Badge</span>
              </div>
              <p className="text-slate-600 text-[9px]">Verifikasi cepat oleh Kepala Cabang HMC.</p>
            </div>
          </div>
        </div>

      </div>

      {/* APPRECIATION CERTIFICATE MODAL SIMULATION */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-xs">Sertifikat Apresiasi Resmi HMC GROUP</h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Paper Layout */}
            <div className="p-8 border-4 border-double border-amber-400 bg-amber-50/30 rounded-xl text-center space-y-4 shadow-inner">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
              
              <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">SERTIFIKAT PENGHARGAAN</h2>
                <p className="text-[10px] text-amber-800 font-extrabold">HMC GROUP WORK COMPLIANCE CHAMPION</p>
              </div>

              <p className="text-xs text-slate-600">Diberikan secara hormat kepada unit cabang:</p>
              
              <h1 className="text-xl font-black text-slate-900 border-b-2 border-amber-400 inline-block px-6 py-1">
                {selectedBranchCert?.name || 'HMC CIREBON'}
              </h1>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Atas dedikasi dan kepatuhan luar biasa sebagai <strong>JUARA 1 (GOLD CHAMPION)</strong> dengan pencapaian skor kepatuhan <strong>{selectedBranchCert?.complianceScore || 98}%</strong> pada periode September 2026.
              </p>

              <div className="pt-6 flex items-center justify-around text-[10px] border-t border-amber-200">
                <div>
                  <span className="font-bold text-slate-800 block">dr. Hendra Gunawan, Sp.JP</span>
                  <span className="text-slate-500 block">Direktur Utama HMC GROUP</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-400 text-white font-black text-[9px] flex items-center justify-center uppercase shadow-md">
                  STAMP RESMI
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => alert('Simulasi Cetak Sertifikat PDF')}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
