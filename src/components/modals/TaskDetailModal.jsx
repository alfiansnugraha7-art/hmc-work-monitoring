import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Building,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  Send,
  CheckCircle2,
  XCircle,
  BellRing,
  ShieldAlert,
  History,
  MessageSquare,
  Paperclip,
  Check,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getStatusBadgeColor, calculateTaskCountdown } from '../../services/deadlineEngine';
import DocumentPreviewModal from './DocumentPreviewModal';

export default function TaskDetailModal({
  task,
  onClose,
  currentRole,
  onVerifyTask,
  onRejectTask,
  onSendReminder,
  onOpenSubmitForm
}) {
  const [activeTab, setActiveTab] = useState('detail');
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Hendra Gunawan (Holding)', text: 'Mohon pastikan laporan dilaporkan tepat waktu.', time: '2026-08-31 08:30' },
    { id: 2, user: task.picName, text: 'Baik Pak, data fingerprint sedang direkap oleh staf HR.', time: '2026-09-01 08:15' }
  ]);

  if (!task) return null;

  const badge = getStatusBadgeColor(task.status);
  const countdown = calculateTaskCountdown(task.deadline, task.status);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        user: `${currentRole} User`,
        text: newComment,
        time: new Date().toLocaleString('id-ID')
      }
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800 px-2.5 py-1 rounded-lg">
              {task.id}
            </span>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${badge.bg} ${badge.text} ${badge.border}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
              {badge.label}
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              task.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Prioritas {task.priority}
            </span>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              Target: {task.assignmentType === 'Pribadi' ? '👤 Pribadi' : task.assignmentType === 'Tim' ? '👥 Tim' : task.assignmentType === 'Divisi' ? '🏢 Divisi' : '🏥 Unit'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Title & Main Meta */}
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-extrabold text-white leading-snug">{task.title}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">PIC Penanggung Jawab</span>
              <span className="font-bold text-slate-200 mt-1 block">{task.picName}</span>
              <span className="text-[11px] text-sky-400">{task.branchName} • {task.departmentName}</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deadline Pekerjaan</span>
              <span className="font-bold text-slate-200 mt-1 block">
                {new Date(task.deadline).toLocaleString('id-ID')}
              </span>
              <span className={`text-[11px] font-bold ${countdown.isOverdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                ⏱ {countdown.text}
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pemberi Perintah</span>
              <span className="font-bold text-slate-200 mt-1 block">{task.issuer}</span>
              <span className="text-[11px] text-slate-400">Periode: {task.period}</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Verifikator</span>
              <span className="font-bold text-slate-200 mt-1 block">{task.verifier}</span>
              <span className="text-[11px] text-amber-400">Format: {task.format}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/50 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('detail')}
            className={`py-3 border-b-2 transition ${activeTab === 'detail' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Instruksi & Dokumen
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${activeTab === 'submission' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Laporan Submission {task.submission && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition ${activeTab === 'timeline' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Audit Trail & Timeline
          </button>

          <button
            onClick={() => setActiveTab('escalation')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${activeTab === 'escalation' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Reminder & Eskalasi {task.escalations && task.escalations.length > 0 && <span className="text-[10px] bg-rose-900 text-rose-300 px-1.5 py-0.5 rounded font-mono">!</span>}
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 border-b-2 transition ${activeTab === 'comments' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Komentar ({comments.length})
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 flex-1 overflow-y-auto text-xs space-y-4">
          
          {/* Tab 1: Instruction & Docs */}
          {activeTab === 'detail' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                <h4 className="font-bold text-slate-200 text-sm mb-2">Deskripsi / Instruksi Perintah</h4>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{task.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-200 mb-2">Dokumen / Bukti Wajib Upload</h4>
                  <ul className="space-y-1.5">
                    {task.requiredDocs && task.requiredDocs.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-200 mb-2">Catatan Verifikator</h4>
                  <p className="text-slate-400 italic">
                    {task.notes || 'Tidak ada catatan tambahan.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Submission Proof */}
          {activeTab === 'submission' && (
            <div className="space-y-4">
              {task.submission ? (
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Disubmit oleh</span>
                      <p className="font-bold text-white text-sm">{task.submission.submittedBy}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Waktu Submission</span>
                      <p className="font-mono text-slate-200">{task.submission.submittedAt}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Catatan PIC</span>
                    <p className="text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {task.submission.notes}
                    </p>
                  </div>

                  {/* Form Data Preview */}
                  {task.submission.formData && (
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-sky-400 block mb-2">Rincian Form Laporan Presensi:</span>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
                        <div className="bg-slate-800 p-2 rounded">
                          <span className="text-[9px] text-slate-400 block">Total Karyawan</span>
                          <span className="font-bold text-white text-sm">{task.submission.formData.totalEmployees}</span>
                        </div>
                        <div className="bg-emerald-950/60 border border-emerald-800 p-2 rounded">
                          <span className="text-[9px] text-emerald-400 block">Hadir</span>
                          <span className="font-bold text-emerald-200 text-sm">{task.submission.formData.present}</span>
                        </div>
                        <div className="bg-amber-950/60 border border-amber-800 p-2 rounded">
                          <span className="text-[9px] text-amber-400 block">Terlambat</span>
                          <span className="font-bold text-amber-200 text-sm">{task.submission.formData.late}</span>
                        </div>
                        <div className="bg-sky-950/60 border border-sky-800 p-2 rounded">
                          <span className="text-[9px] text-sky-400 block">Izin</span>
                          <span className="font-bold text-sky-200 text-sm">{task.submission.formData.permit}</span>
                        </div>
                        <div className="bg-purple-950/60 border border-purple-800 p-2 rounded">
                          <span className="text-[9px] text-purple-400 block">Sakit</span>
                          <span className="font-bold text-purple-200 text-sm">{task.submission.formData.sick}</span>
                        </div>
                        <div className="bg-rose-950/60 border border-rose-800 p-2 rounded">
                          <span className="text-[9px] text-rose-400 block">Alpa/Mangkir</span>
                          <span className="font-bold text-rose-200 text-sm">{task.submission.formData.absent}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Lampiran File Upload ({task.submission.attachments?.length || 0})</span>
                    <div className="space-y-2">
                      {task.submission.attachments && task.submission.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-sky-600" />
                            <span className="font-semibold text-slate-800 text-xs">{att.name}</span>
                            <span className="text-[10px] text-slate-400">({att.size})</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setPreviewAttachment(att)}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] flex items-center gap-1 font-bold shadow-xs transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> Lihat Dokumen
                            </button>
                            <button
                              onClick={() => alert(`Simulasi Download File: ${att.name}`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] flex items-center gap-1 font-semibold transition"
                            >
                              <Download className="w-3 h-3" /> Unduh
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejection / Revision comments */}
                  {task.verificationLog && (
                    <div className="p-3 bg-purple-950/40 border border-purple-800 rounded-xl">
                      <span className="font-bold text-purple-300 block mb-1">Catatan Revisi Verifikator:</span>
                      <p className="text-purple-200">{task.verificationLog.comments}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="font-semibold">Belum Ada Submission Laporan</p>
                  <p className="text-[11px] text-slate-500 mt-1">PIC belum mengirimkan berkas atau form bukti pengerjaan.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Timeline & Audit Trail */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {task.timeline && task.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-slate-800 border-2 border-sky-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    </div>
                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.action}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">Pelaku: <strong className="text-slate-300">{item.user}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Reminder & Escalation History */}
          {activeTab === 'escalation' && (
            <div className="space-y-4">
              
              {/* Reminders Log */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-sky-400" />
                  Riwayat Reminder Otomatis System
                </h4>
                <div className="space-y-2">
                  {task.remindersSent && task.remindersSent.length > 0 ? (
                    task.remindersSent.map((r, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sky-400">{r.type}</span>
                          <span className="text-slate-300">Pengingat dikirim via {r.channel}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{new Date(r.date).toLocaleDateString('id-ID')}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">Belum ada reminder dikirim.</p>
                  )}
                </div>
              </div>

              {/* Escalation Log */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Alur & Log Eskalasi Berjenjang
                </h4>
                <div className="space-y-2">
                  {task.escalations && task.escalations.length > 0 ? (
                    task.escalations.map((esc, idx) => (
                      <div key={idx} className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl space-y-1">
                        <div className="flex items-center justify-between font-bold text-rose-300">
                          <span>Eskalasi Level {esc.level} (+{esc.level === 1 ? '1' : esc.level === 2 ? '3' : '5'} Hari Terlambat)</span>
                          <span className="text-[10px] px-2 py-0.5 bg-rose-900 rounded text-rose-200">{esc.status}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">Diteruskan kepada: <strong>{esc.target}</strong></p>
                        <p className="text-[10px] text-slate-400 font-mono">Waktu Trigger: {new Date(esc.triggerDate).toLocaleString('id-ID')}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">Belum ada eskalasi (Pekerjaan tepat waktu atau belum jatuh tempo).</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Tab 5: Comments & Threaded Discussion */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[9px] flex items-center justify-center">
                          {c.user.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 text-xs">{c.user}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-slate-800 text-[11px] leading-relaxed">
                      {c.text.split(' ').map((word, wIdx) => 
                        word.startsWith('@') ? (
                          <span key={wIdx} className="font-bold text-sky-700 bg-sky-100 px-1 py-0.2 rounded font-mono mr-1">
                            {word}
                          </span>
                        ) : (
                          word + ' '
                        )
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Comment Input with @Mention Suggestion */}
              <div className="relative">
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="Tulis komentar... Gunakan @Nama untuk panggil staf (misal: @Rina)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim Utas
                  </button>
                </form>

                {/* Quick Mention Suggestions Helper */}
                <div className="flex items-center gap-1.5 mt-2 text-[9px]">
                  <span className="text-slate-400 font-semibold">Mention Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setNewComment(prev => prev + ' @Rina Marlina')}
                    className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono hover:bg-sky-100"
                  >
                    + @Rina Marlina
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewComment(prev => prev + ' @Apt. Budi')}
                    className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono hover:bg-sky-100"
                  >
                    + @Apt. Budi
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewComment(prev => prev + ' @Hendra Holding')}
                    className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono hover:bg-sky-100"
                  >
                    + @Hendra Holding
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSendReminder(task.id);
                alert(`Reminder pengingat berhasil dikirim kepada PIC ${task.picName}!`);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <BellRing className="w-3.5 h-3.5 text-sky-400" /> Kirim Manual Reminder
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* PIC Action */}
            {(currentRole === 'PIC' || currentRole === 'HOLDING') && (task.status === 'BELUM DIKERJAKAN' || task.status === 'SEDANG DIKERJAKAN' || task.status === 'REVISI') && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSubmitForm(task);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-600/30"
              >
                <FileText className="w-4 h-4" /> Isi & Submit Laporan PIC
              </button>
            )}

            {/* Manager / Regional / Holding Verification Actions */}
            {task.status === 'MENUNGGU VERIFIKASI' && (
              <>
                <button
                  onClick={() => {
                    onRejectTask(task.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Kembalikan (Revisi)
                </button>
                <button
                  onClick={() => {
                    onVerifyTask(task.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verifikasi & Approve
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Document Preview Viewer Modal */}
        {previewAttachment && (
          <DocumentPreviewModal
            attachment={previewAttachment}
            task={task}
            onClose={() => setPreviewAttachment(null)}
          />
        )}

      </div>
    </div>
  );
}
