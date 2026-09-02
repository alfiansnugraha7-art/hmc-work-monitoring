import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

import DashboardPage from './pages/DashboardPage';
import PerintahPekerjaanPage from './pages/PerintahPekerjaanPage';
import PengumpulanDataPage from './pages/PengumpulanDataPage';
import NineBoxMatrixPage from './pages/NineBoxMatrixPage';
import GanttChartPage from './pages/GanttChartPage';
import LeaderboardPage from './pages/LeaderboardPage';
import KalenderPage from './pages/KalenderPage';
import ReminderNotifikasiPage from './pages/ReminderNotifikasiPage';
import MonitoringCabangPage from './pages/MonitoringCabangPage';
import MonitoringPICPage from './pages/MonitoringPICPage';
import AnalyticCompliancePage from './pages/AnalyticCompliancePage';
import ReportPage from './pages/ReportPage';
import MasterDataPage from './pages/MasterDataPage';
import AuditTrailPage from './pages/AuditTrailPage';

import TaskDetailModal from './components/modals/TaskDetailModal';

import {
  initialHolding,
  initialRegionals,
  initialBranches,
  initialDepartments,
  initialEmployees,
  initialRoles,
  initialPriorities,
  generateInitialTasks,
  generateInitialNotifications,
  generateInitialAuditLogs
} from './data/initialData';

import { createRecurringTasks } from './services/deadlineEngine';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('HOLDING'); // HOLDING, REGIONAL, MANAGER, PIC
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Master & Transactional Data State
  const [holding] = useState(initialHolding);
  const [regionals] = useState(initialRegionals);
  const [branches, setBranches] = useState(initialBranches);
  const [departments, setDepartments] = useState(initialDepartments);
  const [employees, setEmployees] = useState(initialEmployees);
  const [roles] = useState(initialRoles);
  const [priorities] = useState(initialPriorities);

  const [tasks, setTasks] = useState(() => generateInitialTasks());
  const [notifications, setNotifications] = useState(() => generateInitialNotifications(tasks));
  const [auditLogs, setAuditLogs] = useState(() => generateInitialAuditLogs());

  // Modal State
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);

  // Global Dynamic Filter State for Dashboard & Perintah
  const [filterState, setFilterState] = useState({
    period: 'ALL',
    regionalId: 'ALL',
    branchId: 'ALL',
    departmentId: 'ALL',
    picId: 'ALL',
    priority: 'ALL',
    status: 'ALL'
  });

  const handleResetFilters = () => {
    setFilterState({
      period: 'ALL',
      regionalId: 'ALL',
      branchId: 'ALL',
      departmentId: 'ALL',
      picId: 'ALL',
      priority: 'ALL',
      status: 'ALL'
    });
  };

  // Quick alert click handler from dashboard
  const handleQuickFilterAlert = (alertType) => {
    setActiveTab('perintah');
    if (alertType === 'TERLAMBAT') {
      setFilterState({ ...filterState, status: 'TERLAMBAT' });
    } else if (alertType === 'MENUNGGU VERIFIKASI') {
      setFilterState({ ...filterState, status: 'MENUNGGU VERIFIKASI' });
    } else if (alertType === 'TODAY') {
      setFilterState({ ...filterState, status: 'ALL' });
    } else if (alertType === 'LOW_COMPLIANCE') {
      setActiveTab('monitoring-cabang');
    }
  };

  // Add new task with automatic period recurring logic
  const handleCreateTask = (newTask) => {
    const generatedTasks = createRecurringTasks(newTask);
    setTasks([ ...generatedTasks, ...tasks ]);

    // Log to Audit Trail
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      user: `${newTask.issuer}`,
      action: 'CREATE_COMMAND',
      target: newTask.id,
      details: `Membuat Perintah Pekerjaan: ${newTask.title} (Target: ${newTask.branchName})`
    };
    setAuditLogs([ newLog, ...auditLogs ]);
  };

  // Submit report from PIC
  const handleSubmitReport = (taskId, submissionData) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'MENUNGGU VERIFIKASI',
          submission: {
            submittedAt: new Date().toLocaleString('id-ID'),
            submittedBy: submissionData.submittedBy,
            notes: submissionData.notes,
            formData: submissionData.formData,
            attachments: submissionData.attachments
          },
          timeline: [
            ...t.timeline,
            { timestamp: new Date().toLocaleString('id-ID'), user: submissionData.submittedBy, action: 'Submit Laporan PIC', status: 'MENUNGGU VERIFIKASI' }
          ]
        };
      }
      return t;
    }));

    // Notification for manager
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: '📋 Laporan Baru Menunggu Verifikasi',
      message: `Pekerjaan ${taskId} telah disubmit oleh PIC. Mohon dilakukan verifikasi.`,
      timestamp: new Date().toISOString(),
      type: 'VERIFICATION',
      read: false,
      taskId: taskId,
      level: 'INFO'
    };
    setNotifications([ newNotif, ...notifications ]);

    // Audit log
    setAuditLogs([
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('id-ID'),
        user: submissionData.submittedBy,
        action: 'SUBMIT_REPORT',
        target: taskId,
        details: 'PIC melakukan submit pengumpulan laporan pengerjaan.'
      },
      ...auditLogs
    ]);
  };

  // Save Draft from PIC
  const handleSaveDraft = (taskId, draftData) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'SEDANG DIKERJAKAN',
          submission: {
            submittedAt: 'Draft',
            submittedBy: t.picName,
            notes: draftData.notes,
            formData: draftData.formData,
            attachments: draftData.attachments
          }
        };
      }
      return t;
    }));

    setAuditLogs([
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('id-ID'),
        user: 'PIC User',
        action: 'SAVE_DRAFT',
        target: taskId,
        details: 'PIC menyimpan draft pengerjaan laporan.'
      },
      ...auditLogs
    ]);
  };

  // Approve / Verify Task
  const handleVerifyTask = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'SELESAI',
          timeline: [
            ...t.timeline,
            { timestamp: new Date().toLocaleString('id-ID'), user: 'Manager / Verifikator', action: 'Verifikasi & Approval Laporan', status: 'SELESAI' }
          ]
        };
      }
      return t;
    }));

    setAuditLogs([
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('id-ID'),
        user: 'Branch Manager',
        action: 'APPROVE_REPORT',
        target: taskId,
        details: 'Verifikasi diterima dan status diubah menjadi SELESAI.'
      },
      ...auditLogs
    ]);

    alert(`Pekerjaan ${taskId} BERHASIL DIVERIFIKASI! Status berubah menjadi SELESAI.`);
  };

  // Reject / Request Revision
  const handleRejectTask = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'REVISI',
          verificationLog: {
            verifiedAt: new Date().toLocaleString('id-ID'),
            verifierName: 'Branch Manager',
            result: 'REJECTED',
            comments: 'Mohon perbaiki data dan kelengkapan lampiran dokumen.'
          },
          timeline: [
            ...t.timeline,
            { timestamp: new Date().toLocaleString('id-ID'), user: 'Manager / Verifikator', action: 'Mengembalikan Laporan (Revisi)', status: 'REVISI' }
          ]
        };
      }
      return t;
    }));

    setAuditLogs([
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('id-ID'),
        user: 'Branch Manager',
        action: 'REJECT_REPORT',
        target: taskId,
        details: 'Laporan dikembalikan ke PIC untuk revisi.'
      },
      ...auditLogs
    ]);

    alert(`Pekerjaan ${taskId} dikembalikan ke PIC untuk PERBAIKAN / REVISI.`);
  };

  // Send manual reminder
  const handleSendReminder = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          remindersSent: [
            ...(t.remindersSent || []),
            { date: new Date().toISOString(), type: 'Manual Reminder', channel: 'In-App & Email' }
          ]
        };
      }
      return t;
    }));

    setAuditLogs([
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('id-ID'),
        user: `${currentRole} User`,
        action: 'SEND_REMINDER',
        target: taskId,
        details: 'Mengirimkan pengingat manual via notifikasi.'
      },
      ...auditLogs
    ]);
  };

  // Notification actions
  const handleMarkAsRead = (notifId) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Add Master Data items
  const handleAddBranch = (newB) => {
    setBranches([ ...branches, newB ]);
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 overflow-x-hidden">
      
      {/* Sidebar Navigation (Categorized & Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        unreadNotifCount={notifications.filter(n => !n.read).length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <Navbar
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onOpenNotifications={() => setActiveTab('reminder')}
          onSelectTaskFromSearch={(task) => setSelectedTaskForModal(task)}
          tasks={tasks}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              tasks={tasks}
              branches={branches}
              regionals={regionals}
              departments={departments}
              employees={employees}
              filterState={filterState}
              setFilterState={setFilterState}
              onResetFilters={handleResetFilters}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
              onQuickFilterAlert={handleQuickFilterAlert}
            />
          )}

          {activeTab === 'perintah' && (
            <PerintahPekerjaanPage
              tasks={tasks}
              branches={branches}
              regionals={regionals}
              departments={departments}
              employees={employees}
              onCreateTask={handleCreateTask}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'pengumpulan' && (
            <PengumpulanDataPage
              tasks={tasks}
              onSubmitReport={handleSubmitReport}
              onSaveDraft={handleSaveDraft}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'nine-box' && (
            <NineBoxMatrixPage
              tasks={tasks}
              employees={employees}
              branches={branches}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
            />
          )}

          {activeTab === 'gantt' && (
            <GanttChartPage
              tasks={tasks}
              branches={branches}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardPage
              tasks={tasks}
              branches={branches}
              employees={employees}
            />
          )}

          {activeTab === 'kalender' && (
            <KalenderPage
              tasks={tasks}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
            />
          )}

          {activeTab === 'reminder' && (
            <ReminderNotifikasiPage
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onSelectTaskFromNotif={(task) => setSelectedTaskForModal(task)}
              tasks={tasks}
              branches={branches}
              regionals={regionals}
              onSelectBranchFilter={(branchId) => {
                setFilterState({ ...filterState, branchId });
                setActiveTab('perintah');
              }}
            />
          )}

          {activeTab === 'monitoring-cabang' && (
            <MonitoringCabangPage
              tasks={tasks}
              branches={branches}
              regionals={regionals}
              onSelectBranchFilter={(branchId) => {
                setFilterState({ ...filterState, branchId });
                setActiveTab('perintah');
              }}
            />
          )}

          {activeTab === 'monitoring-pic' && (
            <MonitoringPICPage
              tasks={tasks}
              employees={employees}
              branches={branches}
              onSelectTask={(task) => setSelectedTaskForModal(task)}
            />
          )}

          {activeTab === 'analytic' && (
            <AnalyticCompliancePage
              tasks={tasks}
              branches={branches}
            />
          )}

          {activeTab === 'report' && (
            <ReportPage
              tasks={tasks}
              branches={branches}
              regionals={regionals}
            />
          )}

          {activeTab === 'master-data' && (
            <MasterDataPage
              holding={holding}
              regionals={regionals}
              branches={branches}
              departments={departments}
              employees={employees}
              roles={roles}
              priorities={priorities}
              onAddBranch={handleAddBranch}
            />
          )}

          {activeTab === 'audit-trail' && (
            <AuditTrailPage
              auditLogs={auditLogs}
            />
          )}
        </main>

      </div>

      {/* Task Detail Modal */}
      {selectedTaskForModal && (
        <TaskDetailModal
          task={selectedTaskForModal}
          onClose={() => setSelectedTaskForModal(null)}
          currentRole={currentRole}
          onVerifyTask={handleVerifyTask}
          onRejectTask={handleRejectTask}
          onSendReminder={handleSendReminder}
          onOpenSubmitForm={(task) => {
            setSelectedTaskForModal(null);
            setActiveTab('pengumpulan');
          }}
        />
      )}

    </div>
  );
}
