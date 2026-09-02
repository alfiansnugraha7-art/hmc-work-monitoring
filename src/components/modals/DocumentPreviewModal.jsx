import React from 'react';
import { X, Download, Printer, FileText, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

export default function DocumentPreviewModal({ attachment, task, onClose }) {
  if (!attachment) return null;

  const fileName = attachment.name || 'Dokumen_Bukti.pdf';
  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const isImage = fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.png') || fileName.toLowerCase().endsWith('.jpeg');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-sky-100 text-sky-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">{fileName}</h3>
              <p className="text-[10px] text-slate-500">Ukuran: {attachment.size || '1.4 MB'} • Pratinjau Dokumen Upload</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Simulasi Download Berkas: ${fileName}`)}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" /> Unduh
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Document Viewer Body */}
        <div className="p-6 bg-slate-100 flex-1 overflow-y-auto flex justify-center">
          
          {/* Paper Document Preview Simulation */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-md p-8 w-full max-w-2xl text-slate-900 space-y-6 min-h-[500px]">
            
            {/* Corporate Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black uppercase text-slate-900">HMC GROUP (HASNA MEDIKA)</h2>
                <p className="text-[10px] font-extrabold text-sky-700">LAMPIRAN BUKTI DOKUMEN LAPORAN RESMI</p>
                <p className="text-[9px] text-slate-500">Nomor Tugas: {task?.id || 'PRT-2026-001'} • Unit: {task?.branchName || 'HMC Cirebon'}</p>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                  VERIFIED ATTACHMENT
                </span>
                <p className="text-[9px] text-slate-400 mt-1">Status: Terverifikasi Sistem</p>
              </div>
            </div>

            {/* Document Content Simulation */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-semibold block">Nama File Lampiran:</span>
                <span className="font-bold text-slate-800 text-xs">{fileName}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Ringkasan Data Lampiran:</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="py-2 px-3">Parameter / Item</th>
                        <th className="py-2 px-3">Nilai / Hasil Verifikasi</th>
                        <th className="py-2 px-3">Status Kepatuhan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3">Presensi Nakes Shift Pagi</td>
                        <td className="py-2 px-3 font-bold text-slate-800">44 / 48 Terverifikasi Fingerprint</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">🟢 Lengkap</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Keterlambatan Nakes</td>
                        <td className="py-2 px-3 font-bold text-slate-800">2 Orang (Keterangan Terlampir)</td>
                        <td className="py-2 px-3 text-amber-700 font-bold">🟡 Izin Resmi</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Validasi Berkas Fisik</td>
                        <td className="py-2 px-3 font-bold text-slate-800">Dokumen Tanda Tangan Digital OK</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">🟢 Sesuai Standard</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mock Document Visual Graphic */}
              <div className="p-4 bg-sky-50/50 border border-dashed border-sky-300 rounded-xl space-y-2 text-center">
                <FileText className="w-10 h-10 mx-auto text-sky-600" />
                <p className="font-bold text-slate-800 text-xs">Visual Scan Pratinjau Dokumen Upload</p>
                <p className="text-[10px] text-slate-500">Dokumen ini telah di-scan dan disinkronkan langsung dari SIMRS Hasna Medika.</p>
              </div>

              {/* Digital Approval Sign Stamp */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block">Diupload Oleh PIC:</span>
                  <span className="font-bold text-slate-800">{task?.picName || 'Rina Marlina, S.Kep.'}</span>
                </div>

                <div className="text-center p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                  <span className="text-[9px] font-extrabold text-emerald-800 block">STAMP VERIFIKASI DIGITAL</span>
                  <span className="text-[8px] text-emerald-700 font-mono">HMC-DIGITAL-SIGN-OK</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
