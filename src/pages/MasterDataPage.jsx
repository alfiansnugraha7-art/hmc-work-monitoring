import React, { useState } from 'react';
import { Database, Plus, Search, Building2, MapPin, Users, Shield, Tag, FileText, Trash2, Edit2 } from 'lucide-react';

export default function MasterDataPage({
  holding,
  regionals,
  branches,
  departments,
  employees,
  roles,
  priorities,
  onAddBranch,
  onAddDepartment,
  onAddEmployee
}) {
  const [activeTab, setActiveTab] = useState('cabang');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for Quick Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchRegion, setNewBranchRegion] = useState('REG-01');

  const handleAddBranchSubmit = (e) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchCode.trim()) return alert('Isi nama dan kode cabang!');
    const newB = {
      id: `BR-${String(branches.length + 1).padStart(2, '0')}`,
      name: newBranchName,
      code: newBranchCode.toUpperCase(),
      regionalId: newBranchRegion,
      address: `Jl. Utama No. ${branches.length + 10}, ${newBranchName}`
    };
    onAddBranch(newB);
    setShowAddModal(false);
    setNewBranchName('');
    setNewBranchCode('');
    alert(`Cabang Baru ${newB.name} (${newB.code}) Berhasil Ditambahkan ke Master Data!`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-sky-400" />
            Manajemen Master Data System
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan entitas master Holding, Regional, Cabang, Departemen, Karyawan, User Role, dan Parameter.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition"
        >
          <Plus className="w-4 h-4" /> + Tambah Data Master Baru
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('cabang')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'cabang' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Building2 className="w-4 h-4" /> Cabang ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('regional')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'regional' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <MapPin className="w-4 h-4" /> Regional ({regionals.length})
        </button>
        <button
          onClick={() => setActiveTab('departemen')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'departemen' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Tag className="w-4 h-4" /> Departemen ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('karyawan')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'karyawan' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Users className="w-4 h-4" /> Karyawan & User ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'roles' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Shield className="w-4 h-4" /> Roles & Hak Akses
        </button>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {activeTab === 'cabang' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">ID Cabang</th>
                <th className="py-3 px-5">Nama Cabang</th>
                <th className="py-3 px-5">Kode Singkatan</th>
                <th className="py-3 px-5">Regional</th>
                <th className="py-3 px-5">Alamat Unit</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{b.id}</td>
                  <td className="py-3.5 px-5 font-bold text-white text-sm">{b.name}</td>
                  <td className="py-3.5 px-5 font-mono text-amber-400 font-bold">{b.code}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-300">{b.regionalId}</td>
                  <td className="py-3.5 px-5 text-slate-400">{b.address}</td>
                  <td className="py-3.5 px-5 text-center">
                    <button className="p-1.5 text-slate-400 hover:text-sky-400"><Edit2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'regional' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">ID Regional</th>
                <th className="py-3 px-5">Nama Regional</th>
                <th className="py-3 px-5">Kode Wilayah</th>
                <th className="py-3 px-5">Head of Regional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {regionals.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{r.id}</td>
                  <td className="py-3.5 px-5 font-bold text-white text-sm">{r.name}</td>
                  <td className="py-3.5 px-5 font-mono text-emerald-400 font-bold">{r.code}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-200">{r.leader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'departemen' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">ID Departemen</th>
                <th className="py-3 px-5">Nama Departemen</th>
                <th className="py-3 px-5">Kode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{d.id}</td>
                  <td className="py-3.5 px-5 font-bold text-white text-sm">{d.name}</td>
                  <td className="py-3.5 px-5 font-mono text-sky-300 font-bold">{d.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'karyawan' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">ID Staf</th>
                <th className="py-3 px-5">Nama Lengkap</th>
                <th className="py-3 px-5">Email Corporate</th>
                <th className="py-3 px-5">Role Akses</th>
                <th className="py-3 px-5">Cabang</th>
                <th className="py-3 px-5">No. HP / WA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {employees.slice(0, 15).map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{e.id}</td>
                  <td className="py-3.5 px-5 font-bold text-white">{e.name}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-400">{e.email}</td>
                  <td className="py-3.5 px-5 font-bold text-amber-400">{e.roleId}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-300">{e.branchId}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-400">{e.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'roles' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">ID Role</th>
                <th className="py-3 px-5">Nama Level Akses</th>
                <th className="py-3 px-5">Kode Role</th>
                <th className="py-3 px-5">Hak Akses Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {roles.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{r.id}</td>
                  <td className="py-3.5 px-5 font-bold text-white text-sm">{r.name}</td>
                  <td className="py-3.5 px-5 font-mono text-sky-300 font-bold">{r.code}</td>
                  <td className="py-3.5 px-5 text-slate-400">{r.permissions.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" /> Tambah Master Cabang Baru
            </h3>

            <form onSubmit={handleAddBranchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Nama Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tasikmalaya"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Kode Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TSM"
                  value={newBranchCode}
                  onChange={(e) => setNewBranchCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Pilih Regional</label>
                <select
                  value={newBranchRegion}
                  onChange={(e) => setNewBranchRegion(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                >
                  {regionals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold"
                >
                  Simpan Master Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
