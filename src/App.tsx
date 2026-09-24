/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Link as LinkIcon,
  Send, 
  Save,
  X,
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  FileSpreadsheet,
  Plus,
  LayoutDashboard
} from 'lucide-react';
import { 
  SupportCollectionTask, 
  UserRole, 
  FinancialSupportNeededItem, 
  FinancialSupportReceivedItem, 
  CapacityBuildingSupportNeededItem, 
  CapacityBuildingSupportReceivedItem, 
  TechnologicalSupportNeededItem, 
  TechnologicalSupportReceivedItem, 
  Form4OpenEnded, 
  GeneralInformation,
  ReviewComment,
  AuditLogEntry,
  WorkflowStatus,
  CreateCollectionTaskPayload,
  FormTypeKey
} from './types';
import { 
  INITIAL_COLLECTION_TASKS, 
  INITIAL_SUPPORT_TASK, 
  AVAILABLE_SECTORS, 
  AVAILABLE_FORMS 
} from './data/initialData';
import { runAutomatedQC } from './utils/qcValidator';
import { exportSupportTaskToCSV, downloadCSV } from './utils/exportUtils';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Form1A_FinancialNeeded } from './components/Form1A_FinancialNeeded';
import { Form1B_FinancialReceived } from './components/Form1B_FinancialReceived';
import { Form2A_CapacityNeeded } from './components/Form2A_CapacityNeeded';
import { Form2B_CapacityReceived } from './components/Form2B_CapacityReceived';
import { Form3A_TechNeeded } from './components/Form3A_TechNeeded';
import { Form3B_TechReceived } from './components/Form3B_TechReceived';
import { Form4_OpenEnded } from './components/Form4_OpenEnded';
import { QCValidationPanel } from './components/QCValidationPanel';
import { SubmitModal } from './components/SubmitModal';
import { CommentsDrawer } from './components/CommentsDrawer';
import { AuditTrailModal } from './components/AuditTrailModal';
import { BTRSummaryReportModal } from './components/BTRSummaryReportModal';
import { RoleSwitchBar } from './components/RoleSwitchBar';
import { CCCDTaskManagementPage } from './components/CCCDTaskManagementPage';
import { CCCDDashboard } from './components/CCCDDashboard';
import { CreateCollectionTaskModal } from './components/CreateCollectionTaskModal';

export default function App() {
  // Collection Tasks Registry state (persisted in localStorage)
  const [tasks, setTasks] = useState<SupportCollectionTask[]>(() => {
    const saved = localStorage.getItem('mrv_collection_tasks_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse collection tasks from storage', e);
      }
    }
    return INITIAL_COLLECTION_TASKS;
  });

  // Active Task ID
  const [activeTaskId, setActiveTaskId] = useState<string>(() => {
    const savedActive = localStorage.getItem('mrv_active_task_id_v2');
    return savedActive || INITIAL_COLLECTION_TASKS[0].id;
  });

  // Active View Section: 'cccd_dashboard' | 'collection_tasks' | 'forms_workspace'
  const [currentSection, setCurrentSection] = useState<string>('cccd_dashboard');

  // Active Form Tab inside Workspace
  const [activeTab, setActiveTab] = useState<string>('1A');
  const [activeRole, setActiveRole] = useState<UserRole>('Entity_Senior');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isQCPanelOpen, setIsQCPanelOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isBTRModalOpen, setIsBTRModalOpen] = useState(false);

  // Current active task object
  const currentTask = useMemo(() => {
    return tasks.find((t) => t.id === activeTaskId) || tasks[0] || INITIAL_SUPPORT_TASK;
  }, [tasks, activeTaskId]);

  // Persist tasks and activeTaskId to localStorage
  useEffect(() => {
    localStorage.setItem('mrv_collection_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('mrv_active_task_id_v2', activeTaskId);
  }, [activeTaskId]);

  // Automated QC Check for the active task
  const qcResults = useMemo(() => runAutomatedQC(currentTask), [currentTask]);

  // Helper to update the currently active task in tasks array
  const updateCurrentTask = (updater: (prevTask: SupportCollectionTask) => SupportCollectionTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === currentTask.id ? updater(t) : t))
    );
  };

  // Add audit log helper
  const addAuditLog = (action: string, details: string, newStatus?: WorkflowStatus, prevStatus?: WorkflowStatus) => {
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      actorName: currentTask.generalInfo.compilerName,
      actorRole: activeRole,
      details,
      previousStatus: prevStatus || currentTask.status,
      newStatus: newStatus || currentTask.status,
    };
    updateCurrentTask((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs],
    }));
  };

  // CREATE NEW COLLECTION TASKS (Req #02 & #03)
  const handleCreateCollectionTasks = (payload: CreateCollectionTaskPayload) => {
    const newTasksList: SupportCollectionTask[] = payload.assignedMinistries.map((assignedMin, idx) => {
      const taskCode = `${payload.taskCodePrefix}-${assignedMin.ministryCode}`;
      const uniqueId = `TASK-${payload.reportingYear}-${assignedMin.ministryCode}-${Date.now().toString().slice(-4)}${idx}`;

      const nowStr = new Date().toISOString().slice(0, 10);
      const genInfo: GeneralInformation = {
        collectionTaskId: `CT-${payload.reportingYear}-${assignedMin.ministryCode}`,
        ministryName: assignedMin.ministryName,
        sector: assignedMin.sector,
        compilerName: assignedMin.focalPointName || 'Designated Focal Point',
        compilerEmail: assignedMin.focalPointEmail || `${assignedMin.ministryCode.toLowerCase()}@mrv.gov.eg`,
        compilerPhone: assignedMin.focalPointPhone || '+20 (2) 2525-6452',
        compilerContact: assignedMin.focalPointEmail || '+20 (2) 2525-6452',
        compilerTitle: assignedMin.focalPointTitle || 'Focal Point Officer',
        compilationDate: nowStr,
        entityName: assignedMin.ministryName,
        reportingPeriodStart: payload.startDate,
        reportingPeriodEnd: payload.deadlineDate,
        submissionDate: '',
        startDate: payload.startDate,
        assignedAdvisor: assignedMin.assignedAdvisor || payload.defaultAdvisor,
        currencyCode: 'USD',
        dataCollectionStartDate: payload.startDate,
        deadlineDate: assignedMin.customDueDate || payload.deadlineDate,
        priority: payload.priority,
        reportingYear: payload.reportingYear,
      };

      const auditLog: AuditLogEntry = {
        id: `AUD-INIT-${Date.now().toString().slice(-4)}${idx}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        action: 'Collection Task Created & Dispatched',
        actorName: 'CCCD National Coordinator (EEAA)',
        actorRole: 'System_Coordinator',
        details: `Task instantiated for ${assignedMin.ministryName} with ${assignedMin.assignedForms.length} assigned forms: [${assignedMin.assignedForms.join(', ')}]. Cycle: ${payload.cycleTitle}.`,
        newStatus: 'Draft',
      };

      return {
        id: uniqueId,
        taskCode,
        taskTitle: `${payload.reportingYear} ${assignedMin.sector} Support Data Collection`,
        cycleId: `CYCLE-${payload.reportingYear}-BTR1`,
        cycleTitle: payload.cycleTitle,
        reportingYear: payload.reportingYear,
        status: 'Draft',
        activeRole: 'Entity_Senior' as UserRole,
        reportingDirection: payload.reportingDirection,
        assignedForms: assignedMin.assignedForms,
        priority: payload.priority,
        instructions: payload.instructions,
        generalInfo: genInfo,
        financialNeeded: [],
        financialReceived: [],
        capacityNeeded: [],
        capacityReceived: [],
        techNeeded: [],
        techReceived: [],
        form4: {
          hasAssumptions: 'Yes',
          assumptionsDescription: `Data compiled according to UNFCCC 18/CMA.1 ETF guidelines for ${assignedMin.sector}.`,
          mainBarriers: 'Co-financing availability and currency exchange fluctuations.',
          notesOnMRVSystems: `National MRV Climate Team coordination unit at ${assignedMin.ministryName}.`,
        },
        comments: [],
        auditLogs: [auditLog],
      };
    });

    setTasks((prev) => [...newTasksList, ...prev]);
    if (newTasksList.length > 0) {
      setActiveTaskId(newTasksList[0].id);
      // Select the first assigned form for the newly created task
      if (newTasksList[0].assignedForms.length > 0) {
        setActiveTab(newTasksList[0].assignedForms[0]);
      }
    }
  };

  // Update form assignment for an individual existing task
  const handleUpdateTaskForms = (taskId: string, assignedForms: FormTypeKey[]) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newLog: AuditLogEntry = {
          id: `AUD-FORM-UPD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          action: 'Assigned Forms Matrix Updated',
          actorName: 'CCCD Coordinator',
          actorRole: activeRole,
          details: `Updated form allocations to: [${assignedForms.join(', ')}].`,
          newStatus: t.status,
        };
        return {
          ...t,
          assignedForms,
          auditLogs: [newLog, ...t.auditLogs],
        };
      })
    );
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => {
      const remaining = prev.filter((t) => t.id !== taskId);
      if (activeTaskId === taskId && remaining.length > 0) {
        setActiveTaskId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Duplicate task
  const handleDuplicateTask = (targetTask: SupportCollectionTask) => {
    const copy: SupportCollectionTask = {
      ...JSON.parse(JSON.stringify(targetTask)),
      id: `TASK-COPY-${Date.now().toString().slice(-5)}`,
      taskCode: `${targetTask.taskCode}-COPY`,
      taskTitle: `${targetTask.taskTitle || targetTask.generalInfo.ministryName} (Copy)`,
      status: 'Draft',
      auditLogs: [
        {
          id: `AUD-DUP-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          action: 'Task Duplicated',
          actorName: 'CCCD Coordinator',
          actorRole: activeRole,
          details: `Duplicated from ${targetTask.taskCode}.`,
          newStatus: 'Draft',
        },
      ],
    };
    setTasks((prev) => [copy, ...prev]);
    setActiveTaskId(copy.id);
  };

  // Switch Active Task
  const handleSelectTask = (selectedTask: SupportCollectionTask) => {
    setActiveTaskId(selectedTask.id);
    if (selectedTask.assignedForms && selectedTask.assignedForms.length > 0) {
      if (!selectedTask.assignedForms.includes(activeTab as FormTypeKey)) {
        setActiveTab(selectedTask.assignedForms[0]);
      }
    }
  };

  // Form 1A handlers
  const handleAddFinNeeded = (item: FinancialSupportNeededItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      financialNeeded: [...prev.financialNeeded, item],
    }));
    addAuditLog('Financial Request Added', `Added Form 1A item: "${item.title}" for $${item.amountRequestedUSD?.toLocaleString()} USD.`);
  };

  const handleUpdateFinNeeded = (item: FinancialSupportNeededItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      financialNeeded: prev.financialNeeded.map((i) => (i.id === item.id ? item : i)),
    }));
    addAuditLog('Financial Request Updated', `Updated Form 1A item: "${item.title}".`);
  };

  const handleDeleteFinNeeded = (id: string) => {
    const target = currentTask.financialNeeded.find((i) => i.id === id);
    updateCurrentTask((prev) => ({
      ...prev,
      financialNeeded: prev.financialNeeded.filter((i) => i.id !== id),
    }));
    if (target) {
      addAuditLog('Financial Request Deleted', `Removed Form 1A item: "${target.title}".`);
    }
  };

  // Form 1B handlers
  const handleAddFinReceived = (item: FinancialSupportReceivedItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      financialReceived: [...prev.financialReceived, item],
    }));
    addAuditLog('Support Received Added', `Recorded Form 1B received grant/loan: "${item.title}".`);
  };

  const handleUpdateFinReceived = (item: FinancialSupportReceivedItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      financialReceived: prev.financialReceived.map((i) => (i.id === item.id ? item : i)),
    }));
    addAuditLog('Support Received Updated', `Updated Form 1B received item: "${item.title}".`);
  };

  const handleDeleteFinReceived = (id: string) => {
    updateCurrentTask((prev) => ({
      ...prev,
      financialReceived: prev.financialReceived.filter((i) => i.id !== id),
    }));
    addAuditLog('Support Received Deleted', `Removed Form 1B item.`);
  };

  // Form 2A handlers
  const handleAddCapNeeded = (item: CapacityBuildingSupportNeededItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      capacityNeeded: [...prev.capacityNeeded, item],
    }));
    addAuditLog('Capacity Request Added', `Added Form 2A item: "${item.activityTitle}".`);
  };

  const handleUpdateCapNeeded = (item: CapacityBuildingSupportNeededItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      capacityNeeded: prev.capacityNeeded.map((i) => (i.id === item.id ? item : i)),
    }));
    addAuditLog('Capacity Request Updated', `Updated Form 2A item: "${item.activityTitle}".`);
  };

  const handleDeleteCapNeeded = (id: string) => {
    updateCurrentTask((prev) => ({
      ...prev,
      capacityNeeded: prev.capacityNeeded.filter((i) => i.id !== id),
    }));
    addAuditLog('Capacity Request Deleted', `Removed Form 2A item.`);
  };

  // Form 2B handlers
  const handleAddCapReceived = (item: CapacityBuildingSupportReceivedItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      capacityReceived: [...prev.capacityReceived, item],
    }));
    addAuditLog('Capacity Received Added', `Recorded Form 2B training: "${item.trainingTopic}".`);
  };

  const handleUpdateCapReceived = (item: CapacityBuildingSupportReceivedItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      capacityReceived: prev.capacityReceived.map((i) => (i.id === item.id ? item : i)),
    }));
    addAuditLog('Capacity Received Updated', `Updated Form 2B training: "${item.trainingTopic}".`);
  };

  const handleDeleteCapReceived = (id: string) => {
    updateCurrentTask((prev) => ({
      ...prev,
      capacityReceived: prev.capacityReceived.filter((i) => i.id !== id),
    }));
    addAuditLog('Capacity Received Deleted', `Removed Form 2B training.`);
  };

  // Form 3A handlers
  const handleAddTechNeeded = (item: TechnologicalSupportNeededItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      techNeeded: [...prev.techNeeded, item],
    }));
    addAuditLog('Tech Request Added', `Added Form 3A item: "${item.technologyType}".`);
  };

  const handleUpdateTechNeeded = (item: TechnologicalSupportNeededItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      techNeeded: prev.techNeeded.map((i) => (i.id === item.id ? item : i)),
    }));
    addAuditLog('Tech Request Updated', `Updated Form 3A item: "${item.technologyType}".`);
  };

  const handleDeleteTechNeeded = (id: string) => {
    updateCurrentTask((prev) => ({
      ...prev,
      techNeeded: prev.techNeeded.filter((i) => i.id !== id),
    }));
    addAuditLog('Tech Request Deleted', `Removed Form 3A item.`);
  };

  // Form 3B handlers
  const handleAddTechReceived = (item: TechnologicalSupportReceivedItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      techReceived: [...prev.techReceived, item],
    }));
    addAuditLog('Tech Received Added', `Recorded Form 3B transfer: "${item.technologyType}".`);
  };

  const handleUpdateTechReceived = (item: TechnologicalSupportReceivedItem) => {
    updateCurrentTask((prev) => ({
      ...prev,
      techReceived: prev.techReceived.map((i) => (i.id === item.id ? item : i)),
    }));
    addAuditLog('Tech Received Updated', `Updated Form 3B transfer: "${item.technologyType}".`);
  };

  const handleDeleteTechReceived = (id: string) => {
    updateCurrentTask((prev) => ({
      ...prev,
      techReceived: prev.techReceived.filter((i) => i.id !== id),
    }));
    addAuditLog('Tech Received Deleted', `Removed Form 3B item.`);
  };

  // Form 4 handler
  const handleForm4Change = (form4: Form4OpenEnded) => {
    updateCurrentTask((prev) => ({
      ...prev,
      form4,
    }));
  };

  // Comments handlers
  const handleAddComment = (commentData: Omit<ReviewComment, 'id' | 'timestamp'>) => {
    const newComment: ReviewComment = {
      ...commentData,
      id: `COM-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    updateCurrentTask((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
    }));
    addAuditLog('Review Comment Added', `Comment added on ${commentData.formSection} by ${commentData.authorName}.`);
  };

  const handleToggleResolveComment = (commentId: string) => {
    updateCurrentTask((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === commentId ? { ...c, isResolved: !c.isResolved } : c
      ),
    }));
  };

  // Task Submission (Senior Entity Submits to Support Advisor)
  const handleSubmitTask = (submissionData: {
    signoffName: string;
    signoffTitle: string;
    submissionNotes: string;
  }) => {
    const prevStatus = currentTask.status;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    updateCurrentTask((prev) => ({
      ...prev,
      status: 'Submitted_To_Advisor',
      submissionDate: now,
      submittedBy: `${submissionData.signoffName} (${submissionData.signoffTitle})`,
    }));

    addAuditLog(
      'Support N/R Task Formally Submitted',
      `Entity Senior ${submissionData.signoffName} submitted the Support N/R package to Support Advisor (${currentTask.generalInfo.assignedAdvisor}). Notes: ${submissionData.submissionNotes || 'None'}.`,
      'Submitted_To_Advisor',
      prevStatus
    );
  };

  // Support Advisor Decision
  const handleAdvisorDecision = (approved: boolean, comment?: string) => {
    const prevStatus = currentTask.status;
    if (approved) {
      updateCurrentTask((prev) => ({
        ...prev,
        status: 'Advisor_Approved',
      }));
      addAuditLog(
        'Support Advisor Approval',
        'Support Advisor (Ministry of Finance / MoPEDIC) approved the Support Needed requests for BTR integration.',
        'Advisor_Approved',
        prevStatus
      );
    } else {
      updateCurrentTask((prev) => ({
        ...prev,
        status: 'Returned_For_Rework',
      }));
      if (comment) {
        handleAddComment({
          authorName: 'Ahmed El-Gohary',
          authorRole: 'Support_Advisor',
          entity: currentTask.generalInfo.assignedAdvisor,
          formSection: 'General Review',
          content: comment,
          isResolved: false,
        });
      }
      addAuditLog(
        'Task Returned for Rework',
        `Support Advisor returned task with revision requests: "${comment || 'Revisions required'}".`,
        'Returned_For_Rework',
        prevStatus
      );
    }
  };

  // System Coordinator Decision
  const handleCoordinatorDecision = (
    approved: boolean, 
    reportingDirection: 'Internationally (UNFCCC BTR)' | 'Confidential (C) Nationally' = 'Internationally (UNFCCC BTR)'
  ) => {
    const prevStatus = currentTask.status;
    if (approved) {
      updateCurrentTask((prev) => ({
        ...prev,
        status: 'Approved_For_BTR',
        reportingDirection,
      }));
      addAuditLog(
        'CCCD Final Verification Approved',
        `System Coordinator (CCCD) finalized the Support N/R package for ${reportingDirection}.`,
        'Approved_For_BTR',
        prevStatus
      );
    } else {
      updateCurrentTask((prev) => ({
        ...prev,
        status: 'Returned_For_Rework',
      }));
      addAuditLog(
        'CCCD Returned Task',
        'System Coordinator (CCCD) returned submission to Senior Entity for reconciliation.',
        'Returned_For_Rework',
        prevStatus
      );
    }
  };

  // Export CSV for any task
  const handleExportCSV = (taskToExport: SupportCollectionTask = currentTask) => {
    const csvContent = exportSupportTaskToCSV(taskToExport);
    const fileName = `MRV_Support_Form_${taskToExport.generalInfo.ministryName.replace(/[^a-zA-Z0-9]/g, '_')}_${taskToExport.reportingYear}.csv`;
    downloadCSV(fileName, csvContent);
    addAuditLog('CSV Exported', `Downloaded official data collection form CSV (${fileName}).`);
  };

  // Reset all tasks
  const handleResetTasks = () => {
    if (window.confirm('Reset all collection tasks back to official national default registry?')) {
      setTasks(INITIAL_COLLECTION_TASKS);
      setActiveTaskId(INITIAL_COLLECTION_TASKS[0].id);
      localStorage.removeItem('mrv_collection_tasks_v2');
      localStorage.removeItem('mrv_active_task_id_v2');
    }
  };

  const isReadOnly = activeRole !== 'Entity_Senior';

  // 7 Tab Cards definition
  const tabCards = [
    { id: '1A', top: 'Financial', bottom: 'Needed' },
    { id: '1B', top: 'Financial', bottom: 'Received' },
    { id: '2A', top: 'Capacity', bottom: 'Needed' },
    { id: '2B', top: 'Capacity', bottom: 'Received' },
    { id: '3A', top: 'Technological', bottom: 'Needed' },
    { id: '3B', top: 'Technological', bottom: 'Received' },
    { id: '4', top: 'Barriers &', bottom: 'Assumptions' },
  ];

  // Forms assigned to current task
  const assignedFormsForCurrentTask = currentTask.assignedForms || ['1A', '1B', '2A', '2B', '3A', '3B', '4'];

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-900 flex font-sans antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeSection={currentSection}
        onSelectSection={(sectionId) => {
          if (sectionId === 'cccd_dashboard' || sectionId === 'collection_tasks' || sectionId === 'forms_workspace') {
            setCurrentSection(sectionId);
          } else {
            setCurrentSection('cccd_dashboard');
          }
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        totalTasksCount={tasks.length}
      />

      {/* Main Content Area (Offset by 256px / 64 tailwind units on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          task={currentTask}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onOpenQC={() => setIsQCPanelOpen(true)}
          onSubmitClick={() => setIsSubmitModalOpen(true)}
          onExportCSV={() => handleExportCSV(currentTask)}
          onOpenAudit={() => setIsAuditModalOpen(true)}
          onOpenBTR={() => setIsBTRModalOpen(true)}
          onOpenComments={() => setIsCommentsOpen(true)}
          qcErrorCount={qcResults.errors.length}
          qcWarningCount={qcResults.warnings.length}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Section Navigation Tabs Switcher */}
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-7 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentSection('cccd_dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentSection === 'cccd_dashboard'
                  ? 'bg-[#0F3825] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>CCCD National Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentSection('collection_tasks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentSection === 'collection_tasks'
                  ? 'bg-[#0F3825] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Collection Tasks Registry ({tasks.length})</span>
            </button>

            <button
              onClick={() => setCurrentSection('forms_workspace')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentSection === 'forms_workspace'
                  ? 'bg-[#0F3825] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>
                Forms Workspace ({currentTask.taskCode})
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>New Task Cycle</span>
            </button>
          </div>
        </div>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-4 max-w-[1600px] w-full mx-auto">
          {/* SECTION 1: CCCD NATIONAL DASHBOARD */}
          {currentSection === 'cccd_dashboard' && (
            <CCCDDashboard
              tasks={tasks}
              onSelectTask={handleSelectTask}
              onNavigateToWorkspace={(taskId, formKey) => {
                if (taskId) {
                  const target = tasks.find((t) => t.id === taskId);
                  if (target) setActiveTaskId(target.id);
                }
                if (formKey) setActiveTab(formKey);
                setCurrentSection('forms_workspace');
              }}
              onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
              onOpenBTRModal={() => setIsBTRModalOpen(true)}
            />
          )}

          {/* SECTION 2: CCCD COLLECTION TASKS REGISTRY PAGE */}
          {currentSection === 'collection_tasks' && (
            <CCCDTaskManagementPage
              tasks={tasks}
              activeTaskId={activeTaskId}
              onSelectTask={handleSelectTask}
              onOpenCreateModal={() => setIsCreateTaskModalOpen(true)}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onUpdateTaskForms={handleUpdateTaskForms}
              onExportTaskCSV={handleExportCSV}
              onNavigateToFormsWorkspace={() => setCurrentSection('forms_workspace')}
              onNavigateToDashboard={() => setCurrentSection('cccd_dashboard')}
            />
          )}

          {/* SECTION 3: 7 FORMS WORKSPACE */}
          {currentSection === 'forms_workspace' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Action Header Bar (as in mockup) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-transparent">
                {/* Task Identifier Pill & Ministry Context */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentSection('collection_tasks')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <span>← All Tasks</span>
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono tracking-tight font-bold">{currentTask.taskCode}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-800 font-bold">{currentTask.generalInfo.ministryName}</span>
                  </div>

                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    currentTask.status === 'Draft'
                      ? 'bg-slate-200 text-slate-700'
                      : currentTask.status === 'Submitted_To_Advisor' || currentTask.status === 'Under_Advisor_Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentTask.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {activeRole === 'Entity_Senior' && currentTask.status === 'Draft' && (
                    <button
                      id="btn-top-submit-task"
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Submit Collection Task</span>
                    </button>
                  )}

                  <button
                    id="btn-top-save-draft"
                    onClick={() => {
                      localStorage.setItem('mrv_collection_tasks_v2', JSON.stringify(tasks));
                      addAuditLog('Draft Saved', 'Manual draft snapshot saved to national registry.');
                      alert('Collection task draft saved successfully!');
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-emerald-50/50 border border-[#0F3825] text-[#0F3825] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5 text-[#0F3825]" />
                    <span>Save As Draft Task</span>
                  </button>

                  <button
                    id="btn-top-cancel"
                    onClick={() => {
                      setCurrentSection('collection_tasks');
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                    <span>Back to Tasks</span>
                  </button>
                </div>
              </div>

              {/* 7 Tab Cards Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
                {tabCards.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isAssigned = assignedFormsForCurrentTask.includes(tab.id as FormTypeKey);

                  return (
                    <button
                      key={tab.id}
                      id={`tab-card-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-3 sm:py-3.5 sm:px-4 rounded-xl text-left transition-all duration-150 flex flex-col justify-center cursor-pointer relative ${
                        isActive
                          ? 'bg-[#0F3825] text-white shadow-xs ring-1 ring-[#0F3825]'
                          : isAssigned
                          ? 'bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 shadow-2xs'
                          : 'bg-slate-100/80 border border-slate-200 text-slate-400 hover:bg-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] leading-none mb-1 ${
                          isActive ? 'text-emerald-300 font-medium' : isAssigned ? 'text-slate-500 font-medium' : 'text-slate-400'
                        }`}>
                          {tab.top}
                        </span>
                        {!isAssigned && (
                          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-200 text-slate-500">
                            Optional
                          </span>
                        )}
                      </div>
                      <span className={`text-sm sm:text-base font-bold leading-tight tracking-tight ${
                        isActive ? 'text-white' : isAssigned ? 'text-slate-900' : 'text-slate-500'
                      }`}>
                        {tab.bottom}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form Content Area */}
              <div className="transition-opacity duration-200">
                {activeTab === '1A' && (
                  <Form1A_FinancialNeeded
                    items={currentTask.financialNeeded}
                    sectorName={currentTask.generalInfo.sector}
                    onAddItem={handleAddFinNeeded}
                    onUpdateItem={handleUpdateFinNeeded}
                    onDeleteItem={handleDeleteFinNeeded}
                    isReadOnly={isReadOnly}
                  />
                )}

                {activeTab === '1B' && (
                  <Form1B_FinancialReceived
                    items={currentTask.financialReceived}
                    sectorName={currentTask.generalInfo.sector}
                    onAddItem={handleAddFinReceived}
                    onUpdateItem={handleUpdateFinReceived}
                    onDeleteItem={handleDeleteFinReceived}
                    isReadOnly={activeRole !== 'Support_Advisor' && activeRole !== 'Entity_Senior'}
                  />
                )}

                {activeTab === '2A' && (
                  <Form2A_CapacityNeeded
                    items={currentTask.capacityNeeded}
                    sectorName={currentTask.generalInfo.sector}
                    onAddItem={handleAddCapNeeded}
                    onUpdateItem={handleUpdateCapNeeded}
                    onDeleteItem={handleDeleteCapNeeded}
                    isReadOnly={isReadOnly}
                  />
                )}

                {activeTab === '2B' && (
                  <Form2B_CapacityReceived
                    items={currentTask.capacityReceived}
                    sectorName={currentTask.generalInfo.sector}
                    onAddItem={handleAddCapReceived}
                    onUpdateItem={handleUpdateCapReceived}
                    onDeleteItem={handleDeleteCapReceived}
                    isReadOnly={activeRole !== 'Support_Advisor' && activeRole !== 'Entity_Senior'}
                  />
                )}

                {activeTab === '3A' && (
                  <Form3A_TechNeeded
                    items={currentTask.techNeeded}
                    sectorName={currentTask.generalInfo.sector}
                    onAddItem={handleAddTechNeeded}
                    onUpdateItem={handleUpdateTechNeeded}
                    onDeleteItem={handleDeleteTechNeeded}
                    isReadOnly={isReadOnly}
                  />
                )}

                {activeTab === '3B' && (
                  <Form3B_TechReceived
                    items={currentTask.techReceived}
                    sectorName={currentTask.generalInfo.sector}
                    onAddItem={handleAddTechReceived}
                    onUpdateItem={handleUpdateTechReceived}
                    onDeleteItem={handleDeleteTechReceived}
                    isReadOnly={activeRole !== 'Support_Advisor' && activeRole !== 'Entity_Senior'}
                  />
                )}

                {activeTab === '4' && (
                  <Form4_OpenEnded
                    form4={currentTask.form4}
                    sectorName={currentTask.generalInfo.sector}
                    onChange={handleForm4Change}
                    isReadOnly={isReadOnly}
                  />
                )}
              </div>

              {/* Ministry Task Switcher & Footer Metadata */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span className="font-semibold text-slate-800">{currentTask.generalInfo.ministryName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Sector: {currentTask.generalInfo.sector}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Cycle: {currentTask.reportingYear}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Switch Active Task:</span>
                  <select
                    value={currentTask.id}
                    onChange={(e) => {
                      const found = tasks.find((t) => t.id === e.target.value);
                      if (found) handleSelectTask(found);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.taskCode} - {t.generalInfo.ministryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Role Switcher & Workflow Control Bar */}
        <RoleSwitchBar
          activeRole={activeRole}
          workflowStatus={currentTask.status}
          onRoleChange={setActiveRole}
          onAdvisorDecision={handleAdvisorDecision}
          onCoordinatorDecision={handleCoordinatorDecision}
          onResetTask={handleResetTasks}
        />
      </div>

      {/* CREATE NEW COLLECTION TASK MODAL (Req #02 & #03) */}
      <CreateCollectionTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTasks={handleCreateCollectionTasks}
      />

      {/* QC Validation Modal */}
      <QCValidationPanel
        isOpen={isQCPanelOpen}
        onClose={() => setIsQCPanelOpen(false)}
        issues={qcResults}
        onNavigateToForm={(tabKey) => {
          setCurrentSection('forms_workspace');
          setActiveTab(tabKey);
        }}
      />

      {/* Submit Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        task={currentTask}
        qcResult={qcResults}
        onSubmitSuccess={handleSubmitTask}
      />

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={currentTask.comments}
        activeRole={activeRole}
        currentUserName={currentTask.generalInfo.compilerName}
        currentUserEntity={currentTask.generalInfo.entityName}
        onAddComment={handleAddComment}
        onToggleResolve={handleToggleResolveComment}
      />

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={currentTask.auditLogs}
        taskCode={currentTask.taskCode}
      />

      {/* BTR Summary Report Modal */}
      <BTRSummaryReportModal
        isOpen={isBTRModalOpen}
        onClose={() => setIsBTRModalOpen(false)}
        task={currentTask}
      />
    </div>
  );
}
