import React, { useState } from 'react';
import { History, Search, Clock, User, ShieldCheck, FileText } from 'lucide-react';

export default function AuditTrailPage({ auditLogs }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-sky-400" />
            Audit Trail Activity Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rekam jejak digital terenkripsi untuk seluruh aktivitas pembuatan perintah, pengerjaan, verifikasi, reminder, dan eskalasi.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari User, Aktivitas, Target Pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 focus:outline-none"
          />
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Total Log Aktivitas: {filteredLogs.length} Entri
        </span>
      </div>

      {/* Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5">ID Audit</th>
                <th className="py-3.5 px-5">Waktu Event</th>
                <th className="py-3.5 px-5">Pelaku / User</th>
                <th className="py-3.5 px-5">Jenis Aktivitas</th>
                <th className="py-3.5 px-5">Target Pekerjaan</th>
                <th className="py-3.5 px-5">Rincian Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{log.id}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="py-3.5 px-5 font-bold text-white">{log.user}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-amber-300 font-semibold">{log.target}</td>
                  <td className="py-3.5 px-5 text-slate-300 leading-relaxed">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
