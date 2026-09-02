import React, { useState } from 'react';
import {
  ClipboardCheck,
  Clock,
  FileText,
  Upload,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  File,
  X,
  Eye
} from 'lucide-react';
import { calculateTaskCountdown } from '../services/deadlineEngine';
import DocumentPreviewModal from '../components/modals/DocumentPreviewModal';

export default function PengumpulanDataPage({
  tasks,
  onSubmitReport,
  onSaveDraft,
  onSelectTask,
  currentRole
}) {
  // Filter active tasks for PIC submission
  const picTasks = tasks.filter(t =>
    t.status === 'BELUM DIKERJAKAN' ||
    t.status === 'SEDANG DIKERJAKAN' ||
    t.status === 'REVISI' ||
    t.status === 'MENUNGGU VERIFIKASI'
  );

  const [selectedTask, setSelectedTask] = useState(picTasks[0] || null);
  const [previewAttachment, setPreviewAttachment] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    totalEmployees: 45,
    present: 41,
    late: 2,
    permit: 1,
    sick: 1,
    absent: 0
  });

  const [notes, setNotes] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([
    { name: 'presensi_fingerprint_harian.pdf', size: '1.2 MB' }
  ]);

  const handleFileUploadSim = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFiles([
        ...attachedFiles,
        { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }
      ]);
    }
  };

  const handleSaveDraftAction = () => {
    if (!selectedTask) return;
    onSaveDraft(selectedTask.id, { formData, notes, attachments: attachedFiles });
    alert(`Draft Laporan untuk ${selectedTask.id} Berhasil Disimpan! Status = SEDANG DIKERJAKAN.`);
  };

  const handleSubmitAction = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    onSubmitReport(selectedTask.id, {
      formData,
      notes,
      attachments: attachedFiles,
      submittedBy: selectedTask.picName
    });

    alert(`Laporan ${selectedTask.id} BERHASIL DISUBMIT! Status berubah menjadi MENUNGGU VERIFIKASI.`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold uppercase tracking-wider">
              Portal Pengumpulan Data PIC
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-sky-400" />
            Form Pengumpulan Laporan & Proof
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Portal pengisian laporan pengerjaan tugas, upload bukti fisik, countdown deadline, dan submit ke verifikator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Task Selector List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider px-2">
            Pekerjaan Aktif PIC ({picTasks.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {picTasks.map((t) => {
              const countdown = calculateTaskCountdown(t.deadline, t.status);
              const isSelected = selectedTask?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTask(t);
                    if (t.submission && t.submission.formData) {
                      setFormData(t.submission.formData);
                      setNotes(t.submission.notes || '');
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-600 text-white shadow-md'
                      : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">{t.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.priority === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <span className="font-bold text-xs line-clamp-1">{t.title}</span>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                    <span>Deadline: {new Date(t.deadline).toLocaleDateString('id-ID')}</span>
                    <span className={`font-bold ${countdown.isOverdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ⏱ {countdown.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Form Pengerjaan */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTask ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Selected Task Overview */}
              <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400">{selectedTask.id}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Status: {selectedTask.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedTask.title}</h2>
                <p className="text-xs text-slate-300">{selectedTask.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-700/60 text-slate-400">
                  <div>Cabang: <strong className="text-slate-200">{selectedTask.branchName}</strong></div>
                  <div>Verifikator: <strong className="text-slate-200">{selectedTask.verifier}</strong></div>
                  <div>Countdown: <strong className="text-emerald-400">{calculateTaskCountdown(selectedTask.deadline, selectedTask.status).text}</strong></div>
                </div>
              </div>

              {/* Form Laporan Kehadiran Example */}
              <form onSubmit={handleSubmitAction} className="space-y-4 text-xs">
                
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sky-400 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Form Isian Data (Contoh: Laporan Kehadiran Karyawan)
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Total Karyawan Unit</label>
                      <input
                        type="number"
                        value={formData.totalEmployees}
                        onChange={(e) => setFormData({ ...formData, totalEmployees: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-emerald-400 uppercase font-semibold block mb-1">Hadir Tepat Waktu</label>
                      <input
                        type="number"
                        value={formData.present}
                        onChange={(e) => setFormData({ ...formData, present: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-amber-400 uppercase font-semibold block mb-1">Terlambat</label>
                      <input
                        type="number"
                        value={formData.late}
                        onChange={(e) => setFormData({ ...formData, late: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-sky-400 uppercase font-semibold block mb-1">Izin Resmi</label>
                      <input
                        type="number"
                        value={formData.permit}
                        onChange={(e) => setFormData({ ...formData, permit: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-purple-400 uppercase font-semibold block mb-1">Sakit (Surat Dokter)</label>
                      <input
                        type="number"
                        value={formData.sick}
                        onChange={(e) => setFormData({ ...formData, sick: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-rose-400 uppercase font-semibold block mb-1">Alpa / Mangkir</label>
                      <input
                        type="number"
                        value={formData.absent}
                        onChange={(e) => setFormData({ ...formData, absent: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sky-400 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Dokumen & Bukti Pendukung
                  </h3>

                  <div className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-4 text-center cursor-pointer transition">
                    <input type="file" onChange={handleFileUploadSim} className="hidden" id="file-upload-input" />
                    <label htmlFor="file-upload-input" className="cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-sky-400" />
                      <span className="font-bold text-slate-200 block">Klik untuk Upload File Laporan / Bukti</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Format didukung: PDF, XLSX, DOCX, JPG, PNG (Maks 10MB)</span>
                    </label>
                  </div>

                  {/* Attached Files List */}
                  <div className="space-y-2">
                    {attachedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-sky-600" />
                          <span className="font-semibold text-slate-800 text-xs">{file.name}</span>
                          <span className="text-[10px] text-slate-400">({file.size})</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(file)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-xs transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat Dokumen
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                            className="text-rose-600 hover:text-rose-800 p-1"
                            title="Hapus File"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan / Text Area */}
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Catatan / Keterangan PIC</label>
                  <textarea
                    rows={3}
                    placeholder="Berikan penjelasan atau catatan tambahan terkait laporan..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveDraftAction}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-semibold flex items-center gap-2 transition"
                  >
                    <Save className="w-4 h-4 text-amber-400" /> Simpan Draft
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-sky-600/30 transition"
                  >
                    <Send className="w-4 h-4" /> Submit Laporan Ke Verifikator
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-bold text-white">Pilih Pekerjaan untuk Mengisi Laporan</p>
            </div>
          )}
        </div>

      </div>

      {/* Document Preview Modal */}
      {previewAttachment && (
        <DocumentPreviewModal
          attachment={previewAttachment}
          task={selectedTask}
          onClose={() => setPreviewAttachment(null)}
        />
      )}

    </div>
  );
}
