import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Megaphone,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import { getStatusBadgeColor, calculateTaskCountdown } from '../services/deadlineEngine';

export default function PerintahPekerjaanPage({
  tasks,
  branches,
  regionals,
  departments,
  employees,
  onCreateTask,
  onSelectTask,
  currentRole
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [assignmentTypeFilter, setAssignmentTypeFilter] = useState('ALL');

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Laporan Pelayanan Medis',
    issuer: 'dr. Hendra Gunawan, Sp.JP (Direktur Holding HMC)',
    regionalId: 'REG-01',
    branchId: 'BR-01',
    departmentId: 'DEP-HR',
    picId: 'EMP-021',
    priority: 'HIGH',
    period: 'Sekali',
    assignmentType: 'Unit',
    startDate: new Date().toISOString().slice(0, 10),
    deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    format: 'Form SIMRS & Upload File',
    isDocUploadRequired: true,
    requiredDocs: 'Rekap Presensi (.pdf), Foto Bukti Lapangan (.jpg)',
    verifier: 'Kepala Cabang HMC',
    notes: 'Harap dikerjakan sesuai instruksi Holding Hasna Medika.'
  });

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (periodFilter !== 'ALL' && t.period !== periodFilter) return false;
    if (assignmentTypeFilter !== 'ALL' && (t.assignmentType || 'Unit') !== assignmentTypeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.picName.toLowerCase().includes(q) ||
        t.branchName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Judul pekerjaan wajib diisi!');

    const selectedBranch = branches.find(b => b.id === formData.branchId) || branches[0];
    const selectedRegional = regionals.find(r => r.id === formData.regionalId) || regionals[0];
    const selectedDept = departments.find(d => d.id === formData.departmentId) || departments[0];
    const selectedPic = employees.find(e => e.id === formData.picId) || employees[0];

    const newTask = {
      id: `PRT-2026-${String(tasks.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      period: formData.period,
      priority: formData.priority,
      assignmentType: formData.assignmentType || 'Unit',
      issuer: formData.issuer,
      regionalId: selectedRegional.id,
      branchId: selectedBranch.id,
      departmentId: selectedDept.id,
      picId: selectedPic.id,
      picName: selectedPic.name,
      branchName: selectedBranch.name,
      regionalName: selectedRegional.name,
      departmentName: selectedDept.name,
      startDate: new Date(formData.startDate).toISOString(),
      deadline: new Date(formData.deadline).toISOString(),
      status: 'BELUM DIKERJAKAN',
      verifier: formData.verifier,
      format: formData.format,
      requiredDocs: formData.requiredDocs.split(',').map(s => s.trim()),
      notes: formData.notes,
      submission: null,
      timeline: [
        { timestamp: new Date().toLocaleString('id-ID'), user: formData.issuer, action: 'Membuat Perintah Pekerjaan Baru', status: 'BELUM DIKERJAKAN' }
      ],
      remindersSent: [],
      escalations: []
    };

    onCreateTask(newTask);
    setShowCreateModal(false);
    alert(`Perintah Pekerjaan Baru ${newTask.id} Berhasil Dibuat dan Dikirimkan ke PIC ${selectedBranch.name}!`);
  };

  return (
    <div className="space-y-3.5 text-[11px] pb-6">
      
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div>
          <h1 className="text-sm font-black text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-sky-400" />
            Perintah Pekerjaan HMC Group
          </h1>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Daftar seluruh instruksi, perintah, dan permintaan laporan dari Holding HMC Group kepada Cabang.
          </p>
        </div>

        {(currentRole === 'HOLDING' || currentRole === 'REGIONAL' || currentRole === 'MANAGER') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white rounded-lg font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-sky-600/30 transition"
          >
            <Plus className="w-3.5 h-3.5" /> + Buat Perintah Baru
          </button>
        )}
      </div>

      {/* Compact Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-2">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID, Judul, PIC, Cabang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-8 pr-3 py-1 text-[10px] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-[10px]"
          >
            <option value="ALL">Semua Status</option>
            <option value="SELESAI">🟢 Selesai</option>
            <option value="SEDANG DIKERJAKAN">🔵 In Progress</option>
            <option value="MENUNGGU VERIFIKASI">🟡 Menunggu Verifikasi</option>
            <option value="BELUM DIKERJAKAN">🟠 Belum Dikerjakan</option>
            <option value="TERLAMBAT">🔴 Terlambat</option>
            <option value="REVISI">🟣 Revisi</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-[10px]"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="HIGH">Tinggi / Critical</option>
            <option value="MEDIUM">Sedang / Normal</option>
            <option value="LOW">Rendah / Low</option>
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2 py-1 text-[10px]"
          >
            <option value="ALL">Semua Periode</option>
            <option value="Sekali">Sekali</option>
            <option value="Harian">Harian</option>
            <option value="Mingguan">Mingguan</option>
            <option value="Bulanan">Bulanan</option>
          </select>

          <select
            value={assignmentTypeFilter}
            onChange={(e) => setAssignmentTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2 py-1 text-[10px] font-bold text-sky-700"
          >
            <option value="ALL">Semua Target Penugasan</option>
            <option value="Pribadi">👤 Penugasan Pribadi</option>
            <option value="Tim">👥 Penugasan Tim</option>
            <option value="Divisi">🏢 Penugasan Divisi</option>
            <option value="Unit">🏥 Penugasan Unit</option>
          </select>
        </div>
      </div>

      {/* COMPACT TASK TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold uppercase text-[9px] tracking-wider">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Judul Pekerjaan</th>
                <th className="py-2.5 px-3">Target Penugasan</th>
                <th className="py-2.5 px-3">Cabang HMC</th>
                <th className="py-2.5 px-3">PIC Staf</th>
                <th className="py-2.5 px-3">Deadline & Countdown</th>
                <th className="py-2.5 px-3">Prioritas</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredTasks.map((t) => {
                const badge = getStatusBadgeColor(t.status);
                const countdown = calculateTaskCountdown(t.deadline, t.status);
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-2 px-3 font-mono font-bold text-sky-700">{t.id}</td>
                    <td className="py-2 px-3">
                      <span className="font-bold text-slate-900 block">{t.title}</span>
                      <span className="text-[9px] text-slate-500">Periode: {t.period} • {t.category}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                        t.assignmentType === 'Pribadi' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        t.assignmentType === 'Tim' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        t.assignmentType === 'Divisi' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {t.assignmentType === 'Pribadi' ? '👤 Pribadi' :
                         t.assignmentType === 'Tim' ? '👥 Tim' :
                         t.assignmentType === 'Divisi' ? '🏢 Divisi' :
                         '🏥 Unit'}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-200">{t.branchName}</td>
                    <td className="py-2 px-3 font-semibold text-slate-300">{t.picName}</td>
                    <td className="py-2 px-3 font-mono">
                      <span className="text-slate-300 block">{new Date(t.deadline).toLocaleString('id-ID')}</span>
                      <span className={`text-[9px] font-bold ${countdown.isOverdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {countdown.text}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        t.priority === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border inline-flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onSelectTask(t)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded text-[10px] font-semibold"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-[11px]">
            <div className="px-5 py-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" /> + Buat Perintah Pekerjaan HMC Baru
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Judul Pekerjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Presensi Nakes Harian"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Deskripsi Detail</label>
                <textarea
                  rows={2}
                  placeholder="Instruksi pengerjaan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Target Penugasan *</label>
                  <select
                    value={formData.assignmentType}
                    onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-lg px-2 py-1.5 focus:bg-white"
                  >
                    <option value="Pribadi">👤 Pribadi (Personal)</option>
                    <option value="Tim">👥 Tim (Team)</option>
                    <option value="Divisi">🏢 Divisi (Division)</option>
                    <option value="Unit">🏥 Unit (Branch/Unit)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Cabang HMC</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5"
                  >
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Periode</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5"
                  >
                    <option value="Sekali">Sekali</option>
                    <option value="Harian">Harian (Recurring)</option>
                    <option value="Mingguan">Mingguan (Recurring)</option>
                    <option value="Bulanan">Bulanan (Recurring)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5"
                  />
                </div>
              </div>

              {/* Mandatory Document Upload Requirement Configuration */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDocUploadRequired"
                    checked={formData.isDocUploadRequired}
                    onChange={(e) => setFormData({ ...formData, isDocUploadRequired: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="isDocUploadRequired" className="font-extrabold text-sky-400 text-[11px] cursor-pointer">
                    📌 DIWAJIBKAN UPLOAD DOKUMEN BUKTI (Penilaian 9-Box Matrix Kinerja)
                  </label>
                </div>

                {formData.isDocUploadRequired && (
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[10px]">Daftar Dokumen / Bukti Wajib Upload (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rekap Presensi Fingerprint (.pdf), Foto Bukti Lapangan (.jpg)"
                      value={formData.requiredDocs}
                      onChange={(e) => setFormData({ ...formData, requiredDocs: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-[10px]"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Terbitkan Perintah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
