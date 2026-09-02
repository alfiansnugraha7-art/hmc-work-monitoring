-- ====================================================================
-- HMC GROUP - WORK MONITORING CENTER
-- Production PostgreSQL Seed Data DML Script
-- Populates Master Data, 13 HMC Branches, Roles, Employees & Tasks
-- ====================================================================

-- 1. SEED HOLDINGS
INSERT INTO holdings (id, name, code, address, phone, email) VALUES
('HLD-001', 'HMC GROUP', 'HMC-GROUP', 'Menara HMC Group Lt. 15, Cirebon, Jawa Barat', '(0231) 882299', 'command.center@hmcgroup.co.id')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED REGIONALS
INSERT INTO regionals (id, holding_id, name, code, head_quarter) VALUES
('REG-01', 'HLD-001', 'Regional 1 (Jawa Barat & Banten)', 'REG-JABAR-BANTEN', 'Cirebon'),
('REG-02', 'HLD-001', 'Regional 2 (Jawa Timur)', 'REG-JATIM', 'Malang'),
('REG-03', 'HLD-001', 'Regional 3 (Bali & Nusa Tenggara)', 'REG-BALI-NUSA', 'Karangasem')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED 13 HMC BRANCHES
INSERT INTO branches (id, regional_id, name, code, city, compliance_score) VALUES
('BR-01', 'REG-01', 'HMC Cirebon', 'CRB', 'Cirebon', 98),
('BR-02', 'REG-01', 'HMC Kuningan', 'KNG', 'Kuningan', 95),
('BR-03', 'REG-01', 'HMC Indramayu', 'IDM', 'Indramayu', 92),
('BR-04', 'REG-01', 'HMC Kedawung', 'KDW', 'Cirebon', 90),
('BR-05', 'REG-01', 'HMC Majalengka', 'MJL', 'Majalengka', 88),
('BR-06', 'REG-02', 'HMC Malang', 'MLG', 'Malang', 87),
('BR-07', 'REG-01', 'HMC Subang', 'SBG', 'Subang', 65),
('BR-08', 'REG-01', 'HMC Cianjur', 'CJR', 'Cianjur', 85),
('BR-09', 'REG-01', 'HMC Bandung', 'BDG', 'Bandung', 91),
('BR-10', 'REG-01', 'HMC Garut', 'GRT', 'Garut', 86),
('BR-11', 'REG-02', 'HMC Pakisaji', 'PKS', 'Malang', 84),
('BR-12', 'REG-03', 'HMC Karangasem', 'KRA', 'Karangasem', 89),
('BR-13', 'REG-01', 'HMC Serang', 'SRG', 'Serang', 83)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED DEPARTMENTS
INSERT INTO departments (id, name, code, description) VALUES
('DEP-HR', 'SDM & HRD', 'HRD', 'Pengelolaan SDM, Nakes, Presensi & Kepegawaian'),
('DEP-MED', 'Pelayanan Medis & Keperawatan', 'MED', 'Pelayanan Pasien, Mutu Klinis & Keselamatan Pasien'),
('DEP-FAR', 'Farmasi & Logistik Medis', 'FAR', 'Pengelolaan Stok Obat, BMHP & Alat Kesehatan'),
('DEP-FIN', 'Keuangan & Akuntansi', 'FIN', 'Pengelolaan Anggaran, Pendapatan & Laporan Keuangan'),
('DEP-IT', 'SIMRS & IT Infrastructure', 'IT', 'Sistem Informasi Manajemen Rumah Sakit & Jaringan'),
('DEP-K3', 'K3RS & Fasilitas Sarpras', 'K3', 'Keselamatan Kerja, Pemeliharaan Alkes & Gedung')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED ROLES
INSERT INTO roles (id, name, code, permissions) VALUES
('ROLE-HOLDING', 'Holding / Direksi HMC', 'HOLDING', '["ALL"]'::jsonb),
('ROLE-REGIONAL', 'Regional Manager', 'REGIONAL', '["VIEW_REGION", "FOLLOW_UP", "VERIFY"]'::jsonb),
('ROLE-MANAGER', 'Manager / Kepala Cabang', 'MANAGER', '["VIEW_BRANCH", "ASSIGN", "VERIFY"]'::jsonb),
('ROLE-PIC', 'PIC / Staff', 'PIC', '["VIEW_ASSIGNED", "SUBMIT", "DRAFT"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED EMPLOYEES
INSERT INTO employees (id, name, email, role_id, branch_id, department_id, position) VALUES
('EMP-001', 'dr. Hendra Gunawan, Sp.JP', 'hendra.gunawan@hmcgroup.co.id', 'ROLE-HOLDING', 'BR-01', 'DEP-MED', 'Direktur Utama HMC Group'),
('EMP-002', 'Drs. H. Mulyadi, M.M.', 'mulyadi@hmcgroup.co.id', 'ROLE-HOLDING', 'BR-01', 'DEP-FIN', 'Direktur Keuangan Holding'),
('EMP-010', 'Bambang Sukoco, S.T.', 'bambang.regional1@hmcgroup.co.id', 'ROLE-REGIONAL', 'BR-01', 'DEP-HR', 'Regional Manager 1 Jabar'),
('EMP-020', 'dr. Ahmad Fauzi, MARS', 'ahmad.fauzi@hmcgroup.co.id', 'ROLE-MANAGER', 'BR-01', 'DEP-MED', 'Kepala Cabang HMC Cirebon'),
('EMP-021', 'Rina Marlina, S.Kep.', 'rina.marlina@hmcgroup.co.id', 'ROLE-PIC', 'BR-01', 'DEP-HR', 'PIC HRD HMC Cirebon'),
('EMP-022', 'Apt. Budi Santoso, S.Farm.', 'budi.santoso@hmcgroup.co.id', 'ROLE-PIC', 'BR-01', 'DEP-FAR', 'Kepala Inst. Farmasi HMC Cirebon')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED INITIAL TASKS
INSERT INTO tasks (id, title, description, category, period, priority, assignment_type, issuer_name, regional_id, branch_id, department_id, pic_id, start_date, deadline, status, is_doc_upload_required, required_docs) VALUES
('PRT-2026-001', 'Laporan Presensi Nakes Shift Pagi & Malam', 'Pengumpulan data presensi nakes harian seluruh unit layanan HMC Cirebon.', 'Laporan Pelayanan Medis', 'Harian', 'HIGH', 'Unit', 'dr. Hendra Gunawan, Sp.JP (Direktur Holding HMC)', 'REG-01', 'BR-01', 'DEP-HR', 'EMP-021', CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP + INTERVAL '5 hours', 'SELESAI', TRUE, '["Rekap Presensi Fingerprint (.pdf)", "Foto Bukti Lapangan (.jpg)"]'::jsonb),
('PRT-2026-002', 'Laporan Stok Obat & BMHP Farmasi Bulanan', 'Inventarisasi obat kedaluwarsa dan sisa stok bahan medis habis pakai.', 'Laporan Keuangan & Stok', 'Bulanan', 'HIGH', 'Divisi', 'Direktur Operasional Holding HMC', 'REG-01', 'BR-01', 'DEP-FAR', 'EMP-022', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'TERLAMBAT', TRUE, '["Laporan Stok Farmasi (.xlsx)"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED TASK SUBMISSION
INSERT INTO task_submissions (task_id, submitted_by, notes, attachments, form_data) VALUES
('PRT-2026-001', 'Rina Marlina, S.Kep.', 'Data presensi 48 nakes HMC Cirebon telah lengkap di-scan.', '[{"name": "presensi_hmc_cirebon_01sep2026.pdf", "size": "1.4 MB"}, {"name": "bukti_foto_shift_pagi.jpg", "size": "2.1 MB"}]'::jsonb, '{"totalEmployees": 48, "present": 44, "late": 2, "permit": 1, "sick": 1, "absent": 0}'::jsonb)
ON CONFLICT (task_id) DO NOTHING;
