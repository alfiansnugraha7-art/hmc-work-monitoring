// Analytics & Compliance Scoring Engine for HOLDING WORK MONITORING (HMC GROUP)

export const computeGlobalKPIs = (tasks) => {
  const total = tasks.length;
  if (total === 0) {
    return {
      total: 0, finished: 0, inProgress: 0, notStarted: 0,
      overdue: 0, pendingVerify: 0, revision: 0,
      completionRate: 0, onTimeRate: 0, lateRate: 0
    };
  }

  const finished = tasks.filter(t => t.status === 'SELESAI').length;
  const inProgress = tasks.filter(t => t.status === 'SEDANG DIKERJAKAN').length;
  const notStarted = tasks.filter(t => t.status === 'BELUM DIKERJAKAN').length;
  const overdue = tasks.filter(t => t.status === 'TERLAMBAT').length;
  const pendingVerify = tasks.filter(t => t.status === 'MENUNGGU VERIFIKASI').length;
  const revision = tasks.filter(t => t.status === 'REVISI').length;

  const onTimeFinished = tasks.filter(t => t.status === 'SELESAI' && (!t.escalations || t.escalations.length === 0)).length;

  const completionRate = Math.round((finished / total) * 100);
  const onTimeRate = finished > 0 ? Math.round((onTimeFinished / finished) * 100) : 0;
  const lateRate = Math.round((overdue / total) * 100);

  return {
    total,
    finished,
    inProgress,
    notStarted,
    overdue,
    pendingVerify,
    revision,
    completionRate,
    onTimeRate,
    lateRate
  };
};

export const getComplianceCategory = (score) => {
  if (score >= 90) return { label: 'Excellent', bg: 'bg-emerald-100', text: 'text-emerald-800', badgeColor: 'emerald' };
  if (score >= 80) return { label: 'Good', bg: 'bg-blue-100', text: 'text-blue-800', badgeColor: 'blue' };
  if (score >= 70) return { label: 'Fair', bg: 'bg-amber-100', text: 'text-amber-800', badgeColor: 'amber' };
  return { label: 'Need Attention', bg: 'bg-rose-100', text: 'text-rose-800', badgeColor: 'rose' };
};

export const computeBranchCompliance = (tasks, branches) => {
  return branches.map(branch => {
    const branchTasks = tasks.filter(t => t.branchId === branch.id);
    const total = branchTasks.length;

    if (total === 0) {
      return {
        ...branch,
        totalTasks: 0,
        finished: 0,
        pending: 0,
        late: 0,
        complianceScore: 100,
        category: getComplianceCategory(100),
        completionRate: 100,
        onTimeRate: 100
      };
    }

    const finished = branchTasks.filter(t => t.status === 'SELESAI').length;
    const late = branchTasks.filter(t => t.status === 'TERLAMBAT').length;
    const pending = total - finished - late;
    const onTimeFinished = branchTasks.filter(t => t.status === 'SELESAI' && (!t.escalations || t.escalations.length === 0)).length;

    const completionRate = (finished / total) * 100;
    const onTimeRate = finished > 0 ? (onTimeFinished / finished) * 100 : 0;
    const latePenalty = (late / total) * 35;

    let score = Math.round((completionRate * 0.5) + (onTimeRate * 0.5) - latePenalty);
    score = Math.max(0, Math.min(100, score));

    return {
      ...branch,
      totalTasks: total,
      finished,
      pending,
      late,
      complianceScore: score,
      category: getComplianceCategory(score),
      completionRate: Math.round(completionRate),
      onTimeRate: Math.round(onTimeRate)
    };
  }).sort((a, b) => b.complianceScore - a.complianceScore);
};

export const computePICCompliance = (tasks, employees) => {
  const pics = employees.filter(e => e.roleId === 'ROLE-PIC');

  return pics.map(pic => {
    const picTasks = tasks.filter(t => t.picId === pic.id);
    const total = picTasks.length;

    if (total === 0) {
      return {
        ...pic,
        totalTasks: 0,
        finished: 0,
        late: 0,
        pending: 0,
        complianceScore: 100,
        category: getComplianceCategory(100),
        onTimeRate: 100
      };
    }

    const finished = picTasks.filter(t => t.status === 'SELESAI').length;
    const late = picTasks.filter(t => t.status === 'TERLAMBAT').length;
    const pending = total - finished - late;
    const onTimeFinished = picTasks.filter(t => t.status === 'SELESAI' && (!t.escalations || t.escalations.length === 0)).length;

    const completionRate = (finished / total) * 100;
    const onTimeRate = finished > 0 ? (onTimeFinished / finished) * 100 : 0;
    const latePenalty = (late / total) * 30;

    let score = Math.round((completionRate * 0.5) + (onTimeRate * 0.5) - latePenalty);
    score = Math.max(0, Math.min(100, score));

    return {
      ...pic,
      totalTasks: total,
      finished,
      late,
      pending,
      complianceScore: score,
      category: getComplianceCategory(score),
      onTimeRate: Math.round(onTimeRate)
    };
  }).sort((a, b) => b.complianceScore - a.complianceScore);
};

// =========================================================
// 🎯 NINE-BOX (9-BOX) PERFORMANCE & COMPLIANCE MATRIX ENGINE
// Criteria:
// X-Axis: Ketepatan Waktu Pekerjaan (On-Time Adherence Rate %)
// Y-Axis: Kelengkapan Dokumen / Bukti Upload (Document Completeness %)
// =========================================================
export const computeNineBoxMatrix = (tasks, employees) => {
  const pics = employees.filter(e => e.roleId === 'ROLE-PIC');

  // Define 9 Quadrants definitions
  const boxes = {
    'HIGH_HIGH': { id: 'HIGH_HIGH', title: '🟢 Star / Top Performer', desc: 'Ketepatan Waktu Tinggi & Dokumen Selalu Lengkap', color: 'bg-emerald-950/60 border-emerald-500 text-emerald-300', category: 'STAR' },
    'MED_HIGH': { id: 'MED_HIGH', title: '🟢 High Professional', desc: 'Dokumen Sangat Lengkap, Waktu Pengerjaan Baik', color: 'bg-emerald-950/40 border-emerald-600/80 text-emerald-300', category: 'HIGH' },
    'LOW_HIGH': { id: 'LOW_HIGH', title: '🟡 Quality Specialist', desc: 'Dokumen Sangat Rapi, Namun Sering Terlambat', color: 'bg-amber-950/50 border-amber-600/80 text-amber-300', category: 'SPECIALIST' },
    
    'HIGH_MED': { id: 'HIGH_MED', title: '🟢 Fast Executor', desc: 'Pengerjaan Sangat Cepat, Dokumen Standar', color: 'bg-sky-950/60 border-sky-600 text-sky-300', category: 'EXECUTOR' },
    'MED_MED': { id: 'MED_MED', title: '🔵 Core Performer', desc: 'Ketepatan Waktu & Dokumen Sesuai Standar', color: 'bg-slate-900 border-slate-700 text-slate-200', category: 'CORE' },
    'LOW_MED': { id: 'LOW_MED', title: '🟡 Diligence Risk', desc: 'Keterlambatan Cukup Tinggi, Dokumen Standar', color: 'bg-amber-950/40 border-amber-700 text-amber-300', category: 'RISK' },

    'HIGH_LOW': { id: 'HIGH_LOW', title: '🟡 Speed Operator', desc: 'Tepat Waktu Cepat, Sering Lupa Upload Dokumen', color: 'bg-amber-950/40 border-amber-700 text-amber-300', category: 'SPEED' },
    'MED_LOW': { id: 'MED_LOW', title: '🔴 Compliance Issue', desc: 'Dokumen Sering Kurang, Ketepatan Waktu Standar', color: 'bg-rose-950/40 border-rose-800 text-rose-300', category: 'ISSUE' },
    'LOW_LOW': { id: 'LOW_LOW', title: '🔴 Underperformer / Need Action', desc: 'Sering Terlambat & Dokumen Tidak Lengkap', color: 'bg-rose-950/80 border-rose-600 text-rose-200', category: 'ACTION' },
  };

  // Group employees into 9 boxes
  const evaluatedEmployees = pics.map(pic => {
    const picTasks = tasks.filter(t => t.picId === pic.id);
    const total = picTasks.length;

    if (total === 0) {
      return {
        ...pic,
        onTimeRate: 100,
        docCompletenessRate: 100,
        boxId: 'HIGH_HIGH',
        boxInfo: boxes['HIGH_HIGH']
      };
    }

    const finished = picTasks.filter(t => t.status === 'SELESAI').length;
    const onTimeFinished = picTasks.filter(t => t.status === 'SELESAI' && (!t.escalations || t.escalations.length === 0)).length;
    
    // 1. Ketepatan Waktu Score (X-Axis)
    const onTimeRate = Math.round((onTimeFinished / total) * 100);
    let xLevel = 'MED';
    if (onTimeRate >= 80) xLevel = 'HIGH';
    else if (onTimeRate < 60) xLevel = 'LOW';

    // 2. Kelengkapan Dokumen Score (Y-Axis)
    const tasksWithAttachments = picTasks.filter(t => t.submission && t.submission.attachments && t.submission.attachments.length > 0).length;
    const docCompletenessRate = Math.round((tasksWithAttachments / total) * 100);
    let yLevel = 'MED';
    if (docCompletenessRate >= 80) yLevel = 'HIGH';
    else if (docCompletenessRate < 60) yLevel = 'LOW';

    const boxId = `${xLevel}_${yLevel}`;

    return {
      ...pic,
      totalTasks: total,
      finishedTasks: finished,
      onTimeRate,
      docCompletenessRate,
      xLevel,
      yLevel,
      boxId,
      boxInfo: boxes[boxId] || boxes['MED_MED']
    };
  });

  return {
    boxes,
    employees: evaluatedEmployees
  };
};

// =========================================================
// 📁 UPLOADED SUBMISSION & DATA ANALYTICS ENGINE
// Connects uploaded PIC form data & attachments directly to Dashboard & Analytics
// =========================================================
export const computeSubmissionAnalytics = (tasks) => {
  const submittedTasks = tasks.filter(t => t.submission);
  const totalSubmitted = submittedTasks.length;

  if (totalSubmitted === 0) {
    return {
      totalSubmitted: 0,
      withAttachments: 0,
      attachmentRate: 0,
      attendanceSummary: { totalEmployees: 0, present: 0, late: 0, permit: 0, sick: 0, absent: 0 },
      chartData: []
    };
  }

  const withAttachments = submittedTasks.filter(t => t.submission.attachments && t.submission.attachments.length > 0).length;
  const attachmentRate = Math.round((withAttachments / totalSubmitted) * 100);

  // Aggregate form numerical data from uploaded submissions
  let totalEmployees = 0;
  let present = 0;
  let late = 0;
  let permit = 0;
  let sick = 0;
  let absent = 0;

  submittedTasks.forEach(t => {
    if (t.submission.formData) {
      totalEmployees += (t.submission.formData.totalEmployees || 0);
      present += (t.submission.formData.present || 0);
      late += (t.submission.formData.late || 0);
      permit += (t.submission.formData.permit || 0);
      sick += (t.submission.formData.sick || 0);
      absent += (t.submission.formData.absent || 0);
    }
  });

  const attendancePie = [
    { name: '🟢 Hadir Tepat Waktu', value: present, color: '#10b981' },
    { name: '🟡 Terlambat', value: late, color: '#f59e0b' },
    { name: '🔵 Izin Resmi', value: permit, color: '#0284c7' },
    { name: '🟣 Sakit', value: sick, color: '#9333ea' },
    { name: '🔴 Alpa / Mangkir', value: absent, color: '#e11d48' },
  ];

  return {
    totalSubmitted,
    withAttachments,
    attachmentRate,
    attendanceSummary: { totalEmployees, present, late, permit, sick, absent },
    attendancePie
  };
};

export const getChartData = (tasks, branchCompliance) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];
  const monthlyCompletion = months.map((month, idx) => ({
    month,
    Selesai: 25 + Math.floor(Math.sin(idx) * 10) + idx * 3,
    Terlambat: Math.max(2, 8 - Math.floor(idx * 0.5)),
    Target: 35 + idx * 2
  }));

  const statusPieData = [
    { name: '🟢 Selesai', value: tasks.filter(t => t.status === 'SELESAI').length, color: '#10b981' },
    { name: '🔵 Sedang Dikerjakan', value: tasks.filter(t => t.status === 'SEDANG DIKERJAKAN').length, color: '#0284c7' },
    { name: '🟡 Menunggu Verifikasi', value: tasks.filter(t => t.status === 'MENUNGGU VERIFIKASI').length, color: '#f59e0b' },
    { name: '🟠 Belum Dikerjakan', value: tasks.filter(t => t.status === 'BELUM DIKERJAKAN').length, color: '#f97316' },
    { name: '🔴 Terlambat', value: tasks.filter(t => t.status === 'TERLAMBAT').length, color: '#e11d48' },
    { name: '🟣 Revisi', value: tasks.filter(t => t.status === 'REVISI').length, color: '#9333ea' },
  ];

  const branchBarData = branchCompliance.slice(0, 10).map(b => ({
    name: b.name,
    Compliance: b.complianceScore,
    Selesai: b.finished,
    Terlambat: b.late
  }));

  const priorityData = [
    { name: 'Tinggi / Critical', value: tasks.filter(t => t.priority === 'HIGH').length, color: '#e11d48' },
    { name: 'Sedang / Normal', value: tasks.filter(t => t.priority === 'MEDIUM').length, color: '#f59e0b' },
    { name: 'Rendah / Low', value: tasks.filter(t => t.priority === 'LOW').length, color: '#64748b' }
  ];

  const top5Branches = branchCompliance.slice(0, 5);
  const bottom5Branches = [...branchCompliance].reverse().slice(0, 5);

  return {
    monthlyCompletion,
    statusPieData,
    branchBarData,
    priorityData,
    top5Branches,
    bottom5Branches
  };
};
