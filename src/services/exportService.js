import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (tasks, branchCompliance, globalKPIs) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary & KPIs
  const summaryData = [
    ['PT HASNA MEDIKA HOLDING - WORK COMPLIANCE EXECUTIVE REPORT'],
    ['Tanggal Cetak:', new Date().toLocaleString('id-ID')],
    [],
    ['METRIK UTAMA', 'NILAI'],
    ['Total Pekerjaan', globalKPIs.total],
    ['Pekerjaan Selesai', globalKPIs.finished],
    ['Sedang Dikerjakan', globalKPIs.inProgress],
    ['Belum Dikerjakan', globalKPIs.notStarted],
    ['Terlambat (Overdue)', globalKPIs.overdue],
    ['Menunggu Verifikasi', globalKPIs.pendingVerify],
    ['Perlu Revisi', globalKPIs.revision],
    ['Completion Rate (%)', `${globalKPIs.completionRate}%`],
    ['On-Time Rate (%)', `${globalKPIs.onTimeRate}%`],
    ['Late Rate (%)', `${globalKPIs.lateRate}%`]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary KPI');

  // Sheet 2: All Tasks
  const taskRows = tasks.map(t => ({
    'ID Pekerjaan': t.id,
    'Judul Pekerjaan': t.title,
    'Kategori': t.category,
    'Regional': t.regionalName,
    'Cabang HMC': t.branchName,
    'Departemen': t.departmentName,
    'PIC': t.picName,
    'Pemberi Perintah': t.issuer,
    'Periode': t.period,
    'Prioritas': t.priority,
    'Deadline': new Date(t.deadline).toLocaleString('id-ID'),
    'Status': t.status,
    'Verifikator': t.verifier
  }));

  const wsTasks = XLSX.utils.json_to_sheet(taskRows);
  XLSX.utils.book_append_sheet(wb, wsTasks, 'Perintah Pekerjaan');

  // Sheet 3: Branch Compliance
  const branchRows = branchCompliance.map(b => ({
    'Regional': b.regionalId,
    'Cabang HMC': b.name,
    'Kode': b.code,
    'Total Task': b.totalTasks,
    'Selesai': b.finished,
    'Pending': b.pending,
    'Terlambat': b.late,
    'Completion Rate (%)': `${b.completionRate}%`,
    'On-Time Rate (%)': `${b.onTimeRate}%`,
    'Compliance Score': b.complianceScore,
    'Kategori Kepatuhan': b.category.label
  }));

  const wsBranches = XLSX.utils.json_to_sheet(branchRows);
  XLSX.utils.book_append_sheet(wb, wsBranches, 'Kepatuhan Cabang HMC');

  // Trigger Excel File Download
  XLSX.writeFile(wb, `Hasna_Medika_Compliance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportToPDF = (tasks, branchCompliance, globalKPIs) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header Styling
  doc.setFillColor(15, 23, 42); // Navy slate-900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HASNA MEDIKA GROUP - WORK COMPLIANCE REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('PT HASNA MEDIKA HOLDING - COMMAND & WORK MONITORING CENTER', 14, 23);
  doc.text(`Cetak: ${new Date().toLocaleDateString('id-ID')}`, 150, 23);

  // Subheader & KPI Summary
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. EXECUTIVE KPI OVERVIEW', 14, 42);

  const kpiHeaders = [['Total Task', 'Selesai', 'Belum', 'Terlambat', 'Completion %', 'On-Time %']];
  const kpiData = [[
    globalKPIs.total,
    globalKPIs.finished,
    globalKPIs.notStarted + globalKPIs.inProgress,
    globalKPIs.overdue,
    `${globalKPIs.completionRate}%`,
    `${globalKPIs.onTimeRate}%`
  ]];

  doc.autoTable({
    startY: 46,
    head: kpiHeaders,
    body: kpiData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { halign: 'center', fontSize: 10 }
  });

  // Top 5 & Bottom 5 Branch Compliance
  let currentY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. RANKING KEPATUHAN CABANG (COMPLIANCE MATRIX)', 14, currentY);

  const branchHeaders = [['Cabang', 'Total Pekerjaan', 'Selesai', 'Terlambat', 'Compliance Score', 'Kategori']];
  const branchData = branchCompliance.map(b => [
    b.name,
    b.totalTasks,
    b.finished,
    b.late,
    `${b.complianceScore} / 100`,
    b.category.label
  ]);

  doc.autoTable({
    startY: currentY + 4,
    head: branchHeaders,
    body: branchData,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8.5 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      4: { halign: 'center', fontStyle: 'bold' },
      5: { halign: 'center' }
    }
  });

  // Critical Overdue Section
  currentY = doc.lastAutoTable.finalY + 10;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72); // Rose red
  doc.text('3. PEKERJAAN TERLAMBAT (NEED IMMEDIATE ESCALATION)', 14, currentY);

  const lateTasks = tasks.filter(t => t.status === 'TERLAMBAT').slice(0, 10);
  const lateHeaders = [['ID', 'Judul Pekerjaan', 'Cabang', 'PIC', 'Deadline', 'Eskalasi']];
  const lateData = lateTasks.map(t => [
    t.id,
    t.title.length > 30 ? t.title.substring(0, 27) + '...' : t.title,
    t.branchName,
    t.picName,
    new Date(t.deadline).toLocaleDateString('id-ID'),
    t.escalations && t.escalations.length > 0 ? `Level ${t.escalations[t.escalations.length - 1].level}` : 'Level 1'
  ]);

  doc.autoTable({
    startY: currentY + 4,
    head: lateHeaders,
    body: lateData,
    theme: 'grid',
    headStyles: { fillColor: [190, 18, 60], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8 }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Halaman ${i} dari ${pageCount}`, 100, 287, { align: 'center' });
    doc.text('Dokumen ini dihasilkan secara otomatis oleh sistem Holding Work Monitoring Center.', 14, 287);
  }

  doc.save(`Holding_Work_Compliance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
