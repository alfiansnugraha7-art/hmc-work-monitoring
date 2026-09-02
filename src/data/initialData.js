// Mock database with Hasna Medika Holding (HMC) & official HMC Branches

export const initialHolding = {
  id: 'HLD-001',
  name: 'HMC GROUP',
  code: 'HMC-GROUP',
  address: 'Menara HMC Group Lt. 15, Cirebon, Jawa Barat',
  phone: '(0231) 882299',
  email: 'command.center@hmcgroup.co.id'
};

export const initialRegionals = [
  { id: 'REG-01', name: 'Regional 1 (Jawa Barat & Banten)', code: 'REG-JABAR', leader: 'dr. Budi Santoso, Sp.JP' },
  { id: 'REG-02', name: 'Regional 2 (Jawa Timur)', code: 'REG-JATIM', leader: 'dr. Endang Rahayu, Sp.A' },
  { id: 'REG-03', name: 'Regional 3 (Bali & Nusa Tenggara)', code: 'REG-BALI', leader: 'dr. Agus Wijaya, Sp.B' },
];

export const initialBranches = [
  // Regional 1 - Jawa Barat & Banten
  { id: 'BR-01', name: 'HMC Cirebon', code: 'CRB', regionalId: 'REG-01', address: 'Jl. Pemuda No. 45, Cirebon' },
  { id: 'BR-02', name: 'HMC Kuningan', code: 'KNG', regionalId: 'REG-01', address: 'Jl. Siliwangi No. 12, Kuningan' },
  { id: 'BR-03', name: 'HMC Indramayu', code: 'IDM', regionalId: 'REG-01', address: 'Jl. Jend. Sudirman No. 88, Indramayu' },
  { id: 'BR-04', name: 'HMC Kedawung', code: 'KDW', regionalId: 'REG-01', address: 'Jl. Ir. H. Juanda No. 104, Kedawung' },
  { id: 'BR-05', name: 'HMC Majalengka', code: 'MJL', regionalId: 'REG-01', address: 'Jl. KH Abdul Halim No. 33, Majalengka' },
  { id: 'BR-07', name: 'HMC Subang', code: 'SBG', regionalId: 'REG-01', address: 'Jl. Otista No. 50, Subang' },
  { id: 'BR-08', name: 'HMC Cianjur', code: 'CJR', regionalId: 'REG-01', address: 'Jl. Raya Bandung No. 21, Cianjur' },
  { id: 'BR-09', name: 'HMC Bandung', code: 'BDG', regionalId: 'REG-01', address: 'Jl. Soekarno Hatta No. 120, Bandung' },
  { id: 'BR-10', name: 'HMC Garut', code: 'GRT', regionalId: 'REG-01', address: 'Jl. Cimanuk No. 88, Garut' },
  { id: 'BR-13', name: 'HMC Serang', code: 'SRG', regionalId: 'REG-01', address: 'Jl. Ahmad Yani No. 44, Serang' },

  // Regional 2 - Jawa Timur
  { id: 'BR-06', name: 'HMC Malang', code: 'MLG', regionalId: 'REG-02', address: 'Jl. Ijen No. 24, Malang' },
  { id: 'BR-11', name: 'HMC Pakisaji', code: 'PKS', regionalId: 'REG-02', address: 'Jl. Raya Pakisaji No. 15, Malang' },

  // Regional 3 - Bali & Nusa Tenggara
  { id: 'BR-12', name: 'HMC Karangasem', code: 'KRA', regionalId: 'REG-03', address: 'Jl. Veteran No. 99, Karangasem' }
];

export const initialDepartments = [
  { id: 'DEP-HR', name: 'Human Resource & GA', code: 'HRGA' },
  { id: 'DEP-FIN', name: 'Finance & Accounting', code: 'FIN' },
  { id: 'DEP-OPS', name: 'Pelayanan Medis & Operasional', code: 'OPS' },
  { id: 'DEP-IT', name: 'Information Technology & SIMRS', code: 'IT' },
  { id: 'DEP-AUD', name: 'Internal Audit & Kepatuhan', code: 'AUD' },
  { id: 'DEP-MKT', name: 'Humas & Marketing', code: 'MKT' }
];

export const initialPositions = [
  { id: 'POS-DIR', name: 'Direksi Holding Hasna Medika', level: 'HOLDING' },
  { id: 'POS-REG-MGR', name: 'Head of Regional', level: 'REGIONAL' },
  { id: 'POS-BR-MGR', name: 'Branch Manager / Kepala Cabang', level: 'MANAGER' },
  { id: 'POS-DEP-HEAD', name: 'Department Head', level: 'MANAGER' },
  { id: 'POS-PIC', name: 'PIC / Staff Pelayanan', level: 'PIC' }
];

export const initialRoles = [
  { id: 'ROLE-HOLDING', name: 'Holding / Direksi HMC', code: 'HOLDING', permissions: ['ALL'] },
  { id: 'ROLE-REGIONAL', name: 'Regional Manager', code: 'REGIONAL', permissions: ['VIEW_REGION', 'FOLLOW_UP', 'VERIFY'] },
  { id: 'ROLE-MANAGER', name: 'Manager / Kepala Cabang', code: 'MANAGER', permissions: ['VIEW_BRANCH', 'ASSIGN', 'VERIFY'] },
  { id: 'ROLE-PIC', name: 'PIC / Staff', code: 'PIC', permissions: ['VIEW_ASSIGNED', 'SUBMIT', 'DRAFT'] }
];

export const initialPriorities = [
  { id: 'P-CRITICAL', name: 'Tinggi / Critical', code: 'HIGH', color: 'red' },
  { id: 'P-MEDIUM', name: 'Sedang / Normal', code: 'MEDIUM', color: 'yellow' },
  { id: 'P-LOW', name: 'Rendah / Low', color: 'slate' }
];

// Generate employees for HMC
export const initialEmployees = [
  // Holding Directors & HQ Staff
  { id: 'EMP-001', name: 'dr. Hendra Gunawan, Sp.JP', email: 'hendra.g@hasnamedika.com', roleId: 'ROLE-HOLDING', positionId: 'POS-DIR', branchId: 'BR-01', departmentId: 'DEP-OPS', phone: '081122334401' },
  { id: 'EMP-002', name: 'Siti Nurhaliza, S.E., M.M.', email: 'siti.n@hasnamedika.com', roleId: 'ROLE-HOLDING', positionId: 'POS-DIR', branchId: 'BR-01', departmentId: 'DEP-FIN', phone: '081122334402' },
  { id: 'EMP-003', name: 'Rahmat Hidayat, S.Kom.', email: 'rahmat.h@hasnamedika.com', roleId: 'ROLE-HOLDING', positionId: 'POS-DIR', branchId: 'BR-01', departmentId: 'DEP-IT', phone: '081122334403' },

  // Regional Leaders
  { id: 'EMP-004', name: 'dr. Budi Santoso, Sp.JP', email: 'budi.s@hasnamedika.com', roleId: 'ROLE-REGIONAL', positionId: 'POS-REG-MGR', branchId: 'BR-01', departmentId: 'DEP-OPS', phone: '081122334404' },
  { id: 'EMP-005', name: 'dr. Endang Rahayu, Sp.A', email: 'endang.r@hasnamedika.com', roleId: 'ROLE-REGIONAL', positionId: 'POS-REG-MGR', branchId: 'BR-06', departmentId: 'DEP-OPS', phone: '081122334405' },
  { id: 'EMP-006', name: 'dr. Agus Wijaya, Sp.B', email: 'agus.w@hasnamedika.com', roleId: 'ROLE-REGIONAL', positionId: 'POS-REG-MGR', branchId: 'BR-12', departmentId: 'DEP-OPS', phone: '081122334406' },

  // Branch Managers (13 HMC branches)
  { id: 'EMP-007', name: 'dr. Asep Saepullah', email: 'asep.s@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-01', departmentId: 'DEP-OPS', phone: '081234567801' },
  { id: 'EMP-008', name: 'dr. Dedi Kurniawan', email: 'dedi.k@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-02', departmentId: 'DEP-OPS', phone: '081234567802' },
  { id: 'EMP-009', name: 'dr. Eka Kurnia', email: 'eka.k@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-03', departmentId: 'DEP-OPS', phone: '081234567803' },
  { id: 'EMP-010', name: 'dr. Fajar Nugraha', email: 'fajar.n@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-04', departmentId: 'DEP-OPS', phone: '081234567804' },
  { id: 'EMP-011', name: 'dr. Giri Wibowo', email: 'giri.w@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-05', departmentId: 'DEP-OPS', phone: '081234567805' },
  { id: 'EMP-012', name: 'dr. Hadi Prasetyo', email: 'hadi.p@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-06', departmentId: 'DEP-OPS', phone: '081234567806' },
  { id: 'EMP-013', name: 'dr. Irfan Bachdim', email: 'irfan.b@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-07', departmentId: 'DEP-OPS', phone: '081234567807' },
  { id: 'EMP-014', name: 'dr. Joko Susilo', email: 'joko.s@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-08', departmentId: 'DEP-OPS', phone: '081234567808' },
  { id: 'EMP-015', name: 'dr. Kartika Putri', email: 'kartika.p@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-09', departmentId: 'DEP-OPS', phone: '081234567809' },
  { id: 'EMP-016', name: 'dr. Lukman Hakim', email: 'lukman.h@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-10', departmentId: 'DEP-OPS', phone: '081234567810' },
  { id: 'EMP-017', name: 'dr. Maya Indah', email: 'maya.i@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-11', departmentId: 'DEP-OPS', phone: '081234567811' },
  { id: 'EMP-018', name: 'dr. Nanda Pratama', email: 'nanda.p@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-12', departmentId: 'DEP-OPS', phone: '081234567812' },
  { id: 'EMP-019', name: 'dr. Oki Setiana', email: 'oki.s@hasnamedika.com', roleId: 'ROLE-MANAGER', positionId: 'POS-BR-MGR', branchId: 'BR-13', departmentId: 'DEP-OPS', phone: '081234567813' },

  // PICs / Staff per HMC Branch
  { id: 'EMP-021', name: 'Rina Marlina, S.Kep.', email: 'rina.cirebon@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-01', departmentId: 'DEP-HR', phone: '089100000001' },
  { id: 'EMP-022', name: 'Sujono, Amd.PK', email: 'sujono.cirebon@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-01', departmentId: 'DEP-FIN', phone: '089100000002' },
  { id: 'EMP-023', name: 'Tati Suryati, S.Tr.Kes', email: 'tati.cirebon@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-01', departmentId: 'DEP-OPS', phone: '089100000003' },
  { id: 'EMP-024', name: 'Ujang Suherman', email: 'ujang.kuningan@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-02', departmentId: 'DEP-HR', phone: '089100000004' },
  { id: 'EMP-025', name: 'Vina Panduwinata', email: 'vina.indramayu@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-03', departmentId: 'DEP-FIN', phone: '089100000005' },
  { id: 'EMP-026', name: 'Wahyu Ramadhan', email: 'wahyu.kedawung@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-04', departmentId: 'DEP-HR', phone: '089100000006' },
  { id: 'EMP-027', name: 'Xena Princess', email: 'xena.majalengka@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-05', departmentId: 'DEP-OPS', phone: '089100000007' },
  { id: 'EMP-028', name: 'Yayan Ruhian', email: 'yayan.malang@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-06', departmentId: 'DEP-HR', phone: '089100000008' },
  { id: 'EMP-029', name: 'Zaskia Sungkar', email: 'zaskia.subang@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-07', departmentId: 'DEP-FIN', phone: '089100000009' },
  { id: 'EMP-030', name: 'Agus Kuncoro', email: 'agus.cianjur@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-08', departmentId: 'DEP-HR', phone: '089100000010' },
  { id: 'EMP-031', name: 'Bela Safira', email: 'bela.bandung@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-09', departmentId: 'DEP-FIN', phone: '089100000011' },
  { id: 'EMP-032', name: 'Chandra Liow', email: 'chandra.garut@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-10', departmentId: 'DEP-HR', phone: '089100000012' },
  { id: 'EMP-033', name: 'Dewi Sandra', email: 'dewi.pakisaji@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-11', departmentId: 'DEP-OPS', phone: '089100000013' },
  { id: 'EMP-034', name: 'Eko Patrio', email: 'eko.karangasem@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-12', departmentId: 'DEP-HR', phone: '089100000014' },
  { id: 'EMP-035', name: 'Fitri Carlina', email: 'fitri.serang@hasnamedika.com', roleId: 'ROLE-PIC', positionId: 'POS-PIC', branchId: 'BR-13', departmentId: 'DEP-FIN', phone: '089100000015' }
];

export const initialCategories = [
  'Laporan Kehadiran Karyawan',
  'Laporan Keuangan & Kasir',
  'Laporan Pelayanan Medis',
  'Audit SIMRS & IT',
  'Maintenance Alat Kesehatan (Alkes)',
  'Stok Obat & Farmasi',
  'Legal & Kepatuhan Medis',
  'Laporan Operasional Klinik'
];

// Helper date generator for relative testing (2026-09-01 current)
const now = new Date('2026-09-01T10:00:00+07:00');
const addDays = (d, days) => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result.toISOString();
};
const subDays = (d, days) => {
  const result = new Date(d);
  result.setDate(result.getDate() - days);
  return result.toISOString();
};

// Generates 100+ tasks spanning all 13 HMC branches
export const generateInitialTasks = () => {
  const tasks = [];
  let taskCounter = 1;

  // Specific Example 1: Daily Employee Attendance Report at HMC Cirebon
  tasks.push({
    id: `PRT-2026-${String(taskCounter++).padStart(3, '0')}`,
    title: 'Laporan Kehadiran Karyawan & Nakes Harian - HMC Cirebon',
    description: 'Pengumpulan data presensi seluruh nakes dan staf mencakup karyawan hadir, terlambat, izin, sakit, dan mangkir.',
    category: 'Laporan Kehadiran Karyawan',
    period: 'Harian',
    priority: 'HIGH',
    issuer: 'dr. Hendra Gunawan, Sp.JP (Direktur Holding HMC)',
    regionalId: 'REG-01',
    branchId: 'BR-01', // HMC Cirebon
    departmentId: 'DEP-HR',
    picId: 'EMP-021', // Rina Marlina
    picName: 'Rina Marlina, S.Kep.',
    branchName: 'HMC Cirebon',
    regionalName: 'Regional 1 (Jawa Barat & Banten)',
    departmentName: 'Human Resource & GA',
    startDate: subDays(now, 1),
    deadline: '2026-09-01T10:00:00+07:00',
    status: 'MENUNGGU VERIFIKASI',
    verifier: 'dr. Asep Saepullah (Kepala Cabang HMC Cirebon)',
    verifierId: 'EMP-007',
    format: 'Form Digital Attendance SIMRS',
    requiredDocs: ['Rekap Presensi Fingerprint (.pdf)', 'Surat Izin/Sakit (.jpg/.pdf)'],
    notes: 'Mohon diupload tepat pukul 10:00 WIB setiap harinya.',
    submission: {
      submittedAt: '2026-09-01T09:45:12+07:00',
      submittedBy: 'Rina Marlina, S.Kep.',
      notes: 'Laporan presensi nakes shift pagi HMC Cirebon telah lengkap.',
      formData: {
        totalEmployees: 48,
        present: 44,
        late: 2,
        permit: 1,
        sick: 1,
        absent: 0
      },
      attachments: [
        { name: 'presensi_hmc_cirebon_01sep2026.pdf', size: '1.4 MB', url: '#' }
      ]
    },
    timeline: [
      { timestamp: subDays(now, 1), user: 'dr. Hendra Gunawan', action: 'Membuat Perintah Pekerjaan', status: 'BELUM DIKERJAKAN' },
      { timestamp: '2026-09-01T08:15:00+07:00', user: 'Rina Marlina', action: 'Menyimpan Draft Presensi', status: 'SEDANG DIKERJAKAN' },
      { timestamp: '2026-09-01T09:45:12+07:00', user: 'Rina Marlina', action: 'Submit Laporan Kehadiran', status: 'MENUNGGU VERIFIKASI' }
    ],
    remindersSent: [
      { date: subDays(now, 1), type: 'H-1', channel: 'In-App & Email' },
      { date: '2026-09-01T08:00:00+07:00', type: 'Hari H', channel: 'WhatsApp Alert' }
    ],
    escalations: []
  });

  // Example 2: Late task with Escalation history at HMC Subang
  tasks.push({
    id: `PRT-2026-${String(taskCounter++).padStart(3, '0')}`,
    title: 'Laporan Rekonsiliasi Kasir & Farmasi - HMC Subang',
    description: 'Rekonsiliasi transaksi layanan kasir & farmasi HMC Subang periode bulan Agustus 2026.',
    category: 'Laporan Keuangan & Kasir',
    period: 'Bulanan',
    priority: 'HIGH',
    issuer: 'Siti Nurhaliza, S.E. (Direktur Keuangan Holding)',
    regionalId: 'REG-01',
    branchId: 'BR-07', // HMC Subang
    departmentId: 'DEP-FIN',
    picId: 'EMP-029', // Zaskia Sungkar
    picName: 'Zaskia Sungkar',
    branchName: 'HMC Subang',
    regionalName: 'Regional 1 (Jawa Barat & Banten)',
    departmentName: 'Finance & Accounting',
    startDate: subDays(now, 10),
    deadline: subDays(now, 3), // Overdue by 3 days!
    status: 'TERLAMBAT',
    verifier: 'dr. Irfan Bachdim (Kepala Cabang HMC Subang)',
    verifierId: 'EMP-013',
    format: 'File Excel Template SIMRS',
    requiredDocs: ['Bank Statement (.pdf)', 'Jurnal Penyesuaian (.xlsx)'],
    notes: 'Segera selesaikan sebelum audit keuangan holding masuk.',
    submission: null,
    timeline: [
      { timestamp: subDays(now, 10), user: 'Siti Nurhaliza', action: 'Membuat Perintah Pekerjaan', status: 'BELUM DIKERJAKAN' },
      { timestamp: subDays(now, 3), user: 'SYSTEM', action: 'Deadline terlampaui. Status otomatis diubah.', status: 'TERLAMBAT' },
      { timestamp: subDays(now, 2), user: 'SYSTEM', action: 'Eskalasi Level 1 (+1 Hari): Notifikasi ke Kepala Cabang HMC Subang', status: 'TERLAMBAT' },
      { timestamp: now, user: 'SYSTEM', action: 'Eskalasi Level 2 (+3 Hari): Eskalasi ke Head of Regional 1', status: 'TERLAMBAT' }
    ],
    remindersSent: [
      { date: subDays(now, 6), type: 'H-3', channel: 'In-App' },
      { date: subDays(now, 4), type: 'H-1', channel: 'In-App & Email' },
      { date: subDays(now, 3), type: 'Hari H', channel: 'WhatsApp Alert' }
    ],
    escalations: [
      { level: 1, triggerDate: subDays(now, 2), target: 'dr. Irfan Bachdim (Kepala Cabang HMC Subang)', status: 'SENT' },
      { level: 2, triggerDate: now, target: 'dr. Budi Santoso (Regional 1 Leader)', status: 'ESCALATED' }
    ]
  });

  // Generate tasks across all 13 HMC branches
  const hmcBranches = initialBranches;
  const titlesByDept = {
    'DEP-HR': ['Laporan Presensi Karyawan & Nakes', 'Evaluasi Kinerja Staf Perawat', 'Laporan Klaim BPJS Kesehatan'],
    'DEP-FIN': ['Laporan Kas Kecil Klinik', 'Rekapitulasi Omset & Billing SIMRS', 'Laporan Stock Opname Farmasi'],
    'DEP-OPS': ['Checklist Maintenance Alkes & ECG', 'Laporan Delivery Layanan Medis', 'Audit Kebersihan & K3 Klinik'],
    'DEP-IT': ['Checklist Backup SIMRS & Server', 'Audit Keamanan Akun User Medis', 'Update Patch Antivirus SIMRS'],
    'DEP-AUD': ['Audit Prosedur Kasir & Rekam Medis', 'Laporan Kepatuhan Standard Akreditasi'],
    'DEP-MKT': ['Laporan Realisasi Program Promosi Kesehatan', 'Survei Kepuasan Pasien HMC']
  };

  const priorities = ['HIGH', 'MEDIUM', 'LOW'];
  const periods = ['Sekali', 'Harian', 'Mingguan', 'Bulanan'];

  for (let i = 0; i < 104; i++) {
    const branch = hmcBranches[i % hmcBranches.length];
    const regional = initialRegionals.find(r => r.id === branch.regionalId) || initialRegionals[0];
    const pic = initialEmployees.find(e => e.branchId === branch.id && e.roleId === 'ROLE-PIC') || initialEmployees[6];
    const dept = initialDepartments.find(d => d.id === pic.departmentId) || initialDepartments[0];

    const deptTitles = titlesByDept[dept.id] || titlesByDept['DEP-HR'];
    const titleBase = deptTitles[i % deptTitles.length];
    const period = periods[i % periods.length];
    const priority = priorities[i % priorities.length];

    let status = 'SELESAI';
    if (i % 9 === 1 || i % 9 === 6) status = 'SEDANG DIKERJAKAN';
    else if (i % 9 === 2 || i % 9 === 7) status = 'BELUM DIKERJAKAN';
    else if (i % 9 === 3 || i % 9 === 8) status = 'TERLAMBAT';
    else if (i % 9 === 4) status = 'MENUNGGU VERIFIKASI';
    else if (i % 9 === 5) status = 'REVISI';

    let deadlineDate;
    if (status === 'SELESAI') {
      deadlineDate = subDays(now, (i % 12) + 1);
    } else if (status === 'TERLAMBAT') {
      deadlineDate = subDays(now, (i % 4) + 1);
    } else {
      deadlineDate = addDays(now, (i % 6) + 1);
    }

    const taskId = `PRT-2026-${String(taskCounter++).padStart(3, '0')}`;

    tasks.push({
      id: taskId,
      title: `${titleBase} - ${branch.name}`,
      description: `Instruksi pengerjaan perintah ${titleBase} untuk unit cabang ${branch.name}. Harap dilaporkan ke Holding Hasna Medika.`,
      category: dept.name,
      period: period,
      priority: priority,
      issuer: 'dr. Hendra Gunawan, Sp.JP (Direktur Holding)',
      regionalId: regional.id,
      branchId: branch.id,
      departmentId: dept.id,
      picId: pic.id,
      picName: pic.name,
      branchName: branch.name,
      regionalName: regional.name,
      departmentName: dept.name,
      startDate: subDays(new Date(deadlineDate), 5),
      deadline: deadlineDate,
      status: status,
      verifier: `Kepala Cabang ${branch.name}`,
      format: 'SIMRS / Form Digital',
      requiredDocs: ['Dokumen Pendukung Medis (.pdf)'],
      notes: 'Perintah resmi dari Direksi Holding Hasna Medika.',
      submission: (status === 'SELESAI' || status === 'MENUNGGU VERIFIKASI' || status === 'REVISI') ? {
        submittedAt: `01 Sep 2026, 0${(i % 5) + 8}:30 WIB`,
        submittedBy: pic.name,
        notes: `Laporan ${titleBase} telah disubmit oleh ${pic.name}.`,
        attachments: [{ name: `laporan_${branch.code}_${i}.pdf`, size: '1.2 MB', url: '#' }]
      } : null,
      timeline: [
        { timestamp: subDays(new Date(deadlineDate), 5), user: 'dr. Hendra Gunawan', action: 'Membuat Perintah Pekerjaan', status: 'BELUM DIKERJAKAN' }
      ],
      remindersSent: [
        { date: subDays(new Date(deadlineDate), 3), type: 'H-3', channel: 'In-App' }
      ],
      escalations: (status === 'TERLAMBAT') ? [
        { level: 1, triggerDate: subDays(now, 1), target: `Kepala Cabang ${branch.name}`, status: 'ESCALATED' }
      ] : []
    });
  }

  return tasks;
};

// Initial Notifications
export const generateInitialNotifications = (tasks) => {
  return [
    {
      id: 'NOTIF-001',
      title: '⚠️ Peringatan Eskalasi Level 2',
      message: 'Perintah PRT-2026-002 (Laporan Rekonsiliasi Kas HMC Subang) telah terlambat 3 hari dan dieskalasi ke Regional 1.',
      timestamp: '2026-09-01T09:30:00+07:00',
      type: 'ESCALATION',
      read: false,
      taskId: 'PRT-2026-002',
      level: 'CRITICAL'
    },
    {
      id: 'NOTIF-002',
      title: '📋 Laporan Menunggu Verifikasi',
      message: 'Rina Marlina (HMC Cirebon) telah mengirimkan Laporan Kehadiran Karyawan & Nakes Harian (PRT-2026-001).',
      timestamp: '2026-09-01T09:45:12+07:00',
      type: 'VERIFICATION',
      read: false,
      taskId: 'PRT-2026-001',
      level: 'INFO'
    },
    {
      id: 'NOTIF-003',
      title: '⏰ Reminder Deadline Hari H',
      message: 'Hari ini terdapat 10 pekerjaan cabang HMC yang jatuh tempo jam 17:00 WIB.',
      timestamp: '2026-09-01T08:00:00+07:00',
      type: 'REMINDER',
      read: true,
      taskId: null,
      level: 'WARNING'
    }
  ];
};

// Initial System Audit Logs
export const generateInitialAuditLogs = () => {
  return [
    { id: 'AUD-101', timestamp: '2026-09-01T09:45:12+07:00', user: 'Rina Marlina (PIC HMC Cirebon)', action: 'SUBMIT_REPORT', target: 'PRT-2026-001', details: 'Mengirimkan Laporan Kehadiran Karyawan & Nakes Harian HMC Cirebon' },
    { id: 'AUD-102', timestamp: '2026-09-01T09:30:00+07:00', user: 'SYSTEM AUTOMATION', action: 'TRIGGER_ESCALATION', target: 'PRT-2026-002', details: 'Eskalasi Level 2 (+3 Hari Terlambat HMC Subang) ke Regional 1 Leader' },
    { id: 'AUD-103', timestamp: '2026-09-01T08:15:00+07:00', user: 'Rina Marlina (PIC HMC Cirebon)', action: 'SAVE_DRAFT', target: 'PRT-2026-001', details: 'Menyimpan draft presensi nakes' },
    { id: 'AUD-104', timestamp: '2026-08-31T08:00:00+07:00', user: 'dr. Hendra Gunawan (Direktur Holding HMC)', action: 'CREATE_COMMAND', target: 'PRT-2026-001', details: 'Membuat perintah Laporan Kehadiran Karyawan Harian HMC' }
  ];
};
