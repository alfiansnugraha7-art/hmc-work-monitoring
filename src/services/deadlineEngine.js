// Deadline & Escalation Engine for HOLDING WORK MONITORING

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'SELESAI':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600', label: '🟢 Selesai' };
    case 'SEDANG DIKERJAKAN':
      return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-600', label: '🔵 In Progress' };
    case 'MENUNGGU VERIFIKASI':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-600', label: '🟡 Menunggu Verifikasi' };
    case 'BELUM DIKERJAKAN':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-600', label: '🟠 Belum Dikerjakan' };
    case 'TERLAMBAT':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-600', label: '🔴 Terlambat' };
    case 'REVISI':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-600', label: '🟣 Perlu Revisi' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500', label: '⚫ Unknown' };
  }
};

export const calculateTaskCountdown = (deadlineStr, status) => {
  if (status === 'SELESAI') return { text: 'Sudah Selesai', isOverdue: false, days: 0 };
  
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const diffMs = deadline.getTime() - now.getTime();
  
  if (diffMs < 0) {
    const overdueDays = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    return {
      text: `Terlambat ${overdueDays} Hari`,
      isOverdue: true,
      days: overdueDays
    };
  } else {
    const hoursTotal = Math.floor(diffMs / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursTotal / 24);
    const hoursLeft = hoursTotal % 24;
    const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (daysLeft > 0) {
      return { text: `${daysLeft} Hari ${hoursLeft} Jam Lagi`, isOverdue: false, days: daysLeft };
    } else {
      return { text: `${hoursLeft} Jam ${minsLeft} Menit Lagi`, isOverdue: false, days: 0 };
    }
  }
};

export const checkAndTriggerEscalation = (task) => {
  if (task.status === 'SELESAI') return null;

  const countdown = calculateTaskCountdown(task.deadline, task.status);

  if (countdown.isOverdue) {
    const daysLate = countdown.days;
    let escalationLevel = 0;
    let target = '';

    if (daysLate >= 5) {
      escalationLevel = 3;
      target = 'Direksi Holding (Level 3 - Urgent Escalation)';
    } else if (daysLate >= 3) {
      escalationLevel = 2;
      target = `${task.regionalName} Leader (Level 2 - Regional Escalation)`;
    } else if (daysLate >= 1) {
      escalationLevel = 1;
      target = `${task.verifier} (Level 1 - Manager Escalation)`;
    }

    if (escalationLevel > 0) {
      return {
        level: escalationLevel,
        daysLate,
        target,
        triggerDate: new Date().toISOString(),
        status: 'ESCALATED'
      };
    }
  }

  return null;
};

// Generate recurring instances when selecting Harian/Mingguan/Bulanan
export const createRecurringTasks = (baseTask) => {
  if (!baseTask.period || baseTask.period === 'Sekali') return [baseTask];

  const tasksGenerated = [baseTask];
  const count = baseTask.period === 'Harian' ? 7 : baseTask.period === 'Mingguan' ? 4 : 2;

  let currentDeadline = new Date(baseTask.deadline);

  for (let i = 1; i <= count; i++) {
    const nextDeadline = new Date(currentDeadline);
    if (baseTask.period === 'Harian') {
      nextDeadline.setDate(nextDeadline.getDate() + 1);
    } else if (baseTask.period === 'Mingguan') {
      nextDeadline.setDate(nextDeadline.getDate() + 7);
    } else if (baseTask.period === 'Bulanan') {
      nextDeadline.setMonth(nextDeadline.getMonth() + 1);
    }

    const newId = `${baseTask.id}-${i}`;
    tasksGenerated.push({
      ...baseTask,
      id: newId,
      title: `${baseTask.title} (Periode ${i + 1})`,
      deadline: nextDeadline.toISOString(),
      status: 'BELUM DIKERJAKAN',
      submission: null,
      timeline: [
        { timestamp: new Date().toISOString(), user: baseTask.issuer, action: 'Membuat Perintah Pekerjaan Otomatis Periode', status: 'BELUM DIKERJAKAN' }
      ]
    });

    currentDeadline = nextDeadline;
  }

  return tasksGenerated;
};
