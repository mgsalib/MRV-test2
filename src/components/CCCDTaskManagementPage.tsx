import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  Sliders, 
  ArrowUpRight, 
  UserCheck, 
  FileText, 
  Sparkles, 
  Eye, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  X,
  RefreshCw,
  TrendingUp,
  Award,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { 
  SupportCollectionTask, 
  WorkflowStatus, 
  FormTypeKey, 
  UserRole 
} from '../types';
import { 
  AVAILABLE_FORMS, 
  ALL_MINISTRIES_CATALOG,
  FormDefinition 
} from '../data/initialData';

interface CCCDTaskManagementPageProps {
  tasks: SupportCollectionTask[];
  activeTaskId: string;
  onSelectTask: (task: SupportCollectionTask) => void;
  onOpenCreateModal: () => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: SupportCollectionTask) => void;
  onUpdateTaskForms: (taskId: string, assignedForms: FormTypeKey[]) => void;
  onExportTaskCSV: (task: SupportCollectionTask) => void;
  onNavigateToFormsWorkspace: () => void;
  onNavigateToDashboard?: () => void;
}

export const CCCDTaskManagementPage: React.FC<CCCDTaskManagementPageProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onOpenCreateModal,
  onDeleteTask,
  onDuplicateTask,
  onUpdateTaskForms,
  onExportTaskCSV,
  onNavigateToFormsWorkspace,
  onNavigateToDashboard,
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('all');
  const [selectedFormFilter, setSelectedFormFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Edit forms modal state for an individual existing task
  const [editingTaskForForms, setEditingTaskForForms] = useState<SupportCollectionTask | null>(null);
  const [tempForms, setTempForms] = useState<FormTypeKey[]>([]);

  // Open edit modal
  const handleOpenEditForms = (t: SupportCollectionTask) => {
    setEditingTaskForForms(t);
    setTempForms(t.assignedForms || ['1A', '1B', '2A', '2B', '3A', '3B', '4']);
  };

  const handleSaveEditedForms = () => {
    if (editingTaskForForms) {
      if (tempForms.length === 0) {
        alert('Task must have at least 1 assigned form.');
        return;
      }
      onUpdateTaskForms(editingTaskForForms.id, tempForms);
      setEditingTaskForForms(null);
    }
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search query
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        t.taskCode.toLowerCase().includes(query) ||
        (t.taskTitle || '').toLowerCase().includes(query) ||
        t.generalInfo.ministryName.toLowerCase().includes(query) ||
        t.generalInfo.sector.toLowerCase().includes(query) ||
        t.generalInfo.compilerName.toLowerCase().includes(query);

      // Year filter
      const matchYear = selectedYear === 'all' || t.reportingYear.toString() === selectedYear;

      // Status filter
      const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;

      // Advisor filter
      const matchAdvisor =
        selectedAdvisor === 'all' ||
        t.generalInfo.assignedAdvisor.toLowerCase().includes(selectedAdvisor.toLowerCase());

      // Form filter
      const matchForm =
        selectedFormFilter === 'all' ||
        (t.assignedForms || ['1A', '1B', '2A', '2B', '3A', '3B', '4']).includes(
          selectedFormFilter as FormTypeKey
        );

      return matchSearch && matchYear && matchStatus && matchAdvisor && matchForm;
    });
  }, [tasks, searchQuery, selectedYear, selectedStatus, selectedAdvisor, selectedFormFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'Draft' || t.status === 'QC_Passed' || t.status === 'QC_Pending').length;
    const underReview = tasks.filter((t) => t.status === 'Submitted_To_Advisor' || t.status === 'Under_Advisor_Review' || t.status === 'Coordinator_Review').length;
    const approvedBTR = tasks.filter((t) => t.status === 'Approved_For_BTR').length;
    const uniqueMinistries = new Set(tasks.map((t) => t.generalInfo.ministryName)).size;

    const totalFinanceRequested = tasks.reduce(
      (acc, t) => acc + t.financialNeeded.reduce((fAcc, item) => fAcc + (item.amountRequestedUSD || 0), 0),
      0
    );

    const totalFinanceReceived = tasks.reduce(
      (acc, t) => acc + t.financialReceived.reduce((fAcc, item) => fAcc + (item.amountReceivedUSD || 0), 0),
      0
    );

    return {
      total,
      inProgress,
      underReview,
      approvedBTR,
      uniqueMinistries,
      totalFinanceRequested,
      totalFinanceReceived,
    };
  }, [tasks]);

  const getStatusBadge = (status: WorkflowStatus) => {
    switch (status) {
      case 'Approved_For_BTR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Submitted_To_Advisor':
      case 'Under_Advisor_Review':
      case 'Coordinator_Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'QC_Passed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Returned_For_Rework':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null;
    const target = new Date(deadline).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Primary Action */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#0F3825] text-emerald-300">
                CCCD National Coordinator Hub
              </span>
              <span className="text-xs font-semibold text-slate-500">• Egypt MRV Support Module</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Support N/R Collection Tasks Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Oversee, instantiate, and dispatch biennial data collection cycles across all Egyptian ministries. Tailor individual form obligations (Forms 1A to 4) for line ministries and monitor national BTR readiness.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onNavigateToDashboard && (
              <button
                id="btn-switch-to-cccd-dashboard"
                onClick={onNavigateToDashboard}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-300 shadow-2xs transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>CCCD Dashboard</span>
              </button>
            )}

            <button
              id="btn-create-collection-task"
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer ring-1 ring-[#0F3825] hover:ring-emerald-700"
            >
              <Plus className="w-4 h-4 text-emerald-300 stroke-[3]" />
              <span>Create New Collection Task</span>
            </button>
          </div>
        </div>

        {/* 4 Primary KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Total Collection Tasks</span>
              <Layers className="w-4 h-4 text-[#0F3825]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
              <span className="text-[11px] text-slate-500 ml-1.5 font-medium">({metrics.uniqueMinistries} Ministries)</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Under Advisor Review</span>
              <UserCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-amber-700">{metrics.underReview}</span>
              <span className="text-[11px] text-amber-800 ml-1.5 font-medium">MoF / MoPEDIC</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Approved for BTR</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-800">{metrics.approvedBTR}</span>
              <span className="text-[11px] text-emerald-700 ml-1.5 font-medium">UNFCCC Validated</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Finance Tracked (USD)</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ${((metrics.totalFinanceRequested + metrics.totalFinanceReceived) / 1e6).toFixed(1)}M
              </span>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                ${(metrics.totalFinanceRequested / 1e6).toFixed(0)}M req • ${(metrics.totalFinanceReceived / 1e6).toFixed(0)}M rec
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by task code, ministry, sector, compiler, or title..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
            >
              <option value="all">All Reporting Years</option>
              <option value="2026">2026 BTR-1</option>
              <option value="2025">2025 Cycle</option>
              <option value="2024">2024 Cycle</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
            >
              <option value="all">All Workflow Statuses</option>
              <option value="Draft">Draft</option>
              <option value="QC_Passed">QC Passed</option>
              <option value="Submitted_To_Advisor">Submitted to Advisor</option>
              <option value="Under_Advisor_Review">Under Advisor Review</option>
              <option value="Approved_For_BTR">Approved for BTR</option>
              <option value="Returned_For_Rework">Returned for Rework</option>
            </select>

            {/* Form Filter */}
            <select
              value={selectedFormFilter}
              onChange={(e) => setSelectedFormFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
            >
              <option value="all">All Assigned Forms</option>
              <option value="1A">Includes Form 1A (Fin Needed)</option>
              <option value="1B">Includes Form 1B (Fin Received)</option>
              <option value="2A">Includes Form 2A (Cap Needed)</option>
              <option value="2B">Includes Form 2B (Cap Received)</option>
              <option value="3A">Includes Form 3A (Tech Needed)</option>
              <option value="3B">Includes Form 3B (Tech Received)</option>
              <option value="4">Includes Form 4 (MRV / Assumptions)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters count indicator */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredTasks.length}</strong> of {tasks.length} collection tasks
          </span>
          {(searchQuery || selectedYear !== 'all' || selectedStatus !== 'all' || selectedFormFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedYear('all');
                setSelectedStatus('all');
                setSelectedAdvisor('all');
                setSelectedFormFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 01. LIST OF ALL COLLECTION TASKS CREATED BEFORE */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Task Code & Title</th>
                  <th className="py-3.5 px-4">Assigned Ministry / Sector</th>
                  <th className="py-3.5 px-4">Assigned Forms Matrix (Req #03)</th>
                  <th className="py-3.5 px-4">Cycle / Year</th>
                  <th className="py-3.5 px-4">Advisor Reviewer</th>
                  <th className="py-3.5 px-4">Workflow Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">No collection tasks found</p>
                      <p className="text-[11px] text-slate-400 mt-1">Try adjusting search query or filter options.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => {
                    const isActive = t.id === activeTaskId;
                    const assignedFormsList = t.assignedForms || ['1A', '1B', '2A', '2B', '3A', '3B', '4'];
                    const daysLeft = getDaysRemaining(t.generalInfo.deadlineDate);

                    return (
                      <tr
                        key={t.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isActive ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        {/* Task Code & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-900">{t.taskCode}</span>
                                {isActive && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-700 text-white">
                                    Active Task
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-slate-800 text-[11px] mt-0.5 line-clamp-1 max-w-xs">
                                {t.taskTitle || `${t.reportingYear} ${t.generalInfo.sector} Collection Task`}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>Compiler: {t.generalInfo.compilerName}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Ministry & Sector */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-900 line-clamp-1">
                                {t.generalInfo.ministryName}
                              </span>
                              <span className="text-[11px] text-slate-500 line-clamp-1">
                                {t.generalInfo.sector}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Forms Matrix */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            {assignedFormsList.map((fKey) => {
                              const formDef = AVAILABLE_FORMS.find((f) => f.key === fKey);
                              return (
                                <span
                                  key={fKey}
                                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                                    formDef?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                  title={formDef?.name}
                                >
                                  {formDef?.number.replace('Form ', '') || fKey}
                                </span>
                              );
                            })}
                            <button
                              onClick={() => handleOpenEditForms(t)}
                              className="text-[10px] text-emerald-800 hover:text-emerald-950 hover:underline font-semibold ml-1 cursor-pointer"
                              title="Edit Form Assignments for this ministry"
                            >
                              Edit ({assignedFormsList.length})
                            </button>
                          </div>
                        </td>

                        {/* Cycle / Year & Timeline */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800">{t.reportingYear}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Due: {t.generalInfo.deadlineDate}
                            {daysLeft !== null && (
                              <span className={`ml-1 font-semibold ${
                                daysLeft < 0 ? 'text-rose-600' : daysLeft < 30 ? 'text-amber-600' : 'text-emerald-700'
                              }`}>
                                ({daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`})
                              </span>
                            )}
                          </p>
                        </td>

                        {/* Assigned Advisor */}
                        <td className="py-3.5 px-4 max-w-[180px]">
                          <span className="text-[11px] font-medium text-slate-700 line-clamp-1">
                            {t.generalInfo.assignedAdvisor}
                          </span>
                        </td>

                        {/* Workflow Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(t.status)}`}>
                            {t.status === 'Approved_For_BTR' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : t.status === 'Submitted_To_Advisor' || t.status === 'Under_Advisor_Review' ? (
                              <Clock className="w-3 h-3 text-amber-600" />
                            ) : null}
                            {t.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                onSelectTask(t);
                                onNavigateToFormsWorkspace();
                              }}
                              className="px-3 py-1.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                              title="Open this task in 7-Form Workspace"
                            >
                              <span>Open Forms</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => onExportTaskCSV(t)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                              title="Export Task CSV"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onDuplicateTask(t)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                              title="Duplicate Task Configuration"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {tasks.length > 1 && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete task ${t.taskCode}?`)) {
                                    onDeleteTask(t.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((t) => {
            const isActive = t.id === activeTaskId;
            const assignedFormsList = t.assignedForms || ['1A', '1B', '2A', '2B', '3A', '3B', '4'];
            const daysLeft = getDaysRemaining(t.generalInfo.deadlineDate);

            return (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between transition-all ${
                  isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Identifier */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {t.taskCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(t.status)}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Title & Ministry */}
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {t.taskTitle || `${t.generalInfo.ministryName}`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {t.generalInfo.ministryName} • <span className="font-medium text-slate-700">{t.generalInfo.sector}</span>
                  </p>

                  {/* Forms Badges Matrix */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                      <span>Assigned Forms ({assignedFormsList.length}/7):</span>
                      <button
                        onClick={() => handleOpenEditForms(t)}
                        className="text-emerald-700 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {assignedFormsList.map((fKey) => {
                        const formDef = AVAILABLE_FORMS.find((f) => f.key === fKey);
                        return (
                          <span
                            key={fKey}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              formDef?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                            title={formDef?.name}
                          >
                            {formDef?.number || fKey}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Metadata */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Reporting Cycle:</span>
                      <span className="font-bold text-slate-800">{t.reportingYear}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Due Date:</span>
                      <span className="font-medium text-slate-700">{t.generalInfo.deadlineDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lead Advisor:</span>
                      <span className="font-medium text-slate-700 line-clamp-1 max-w-[180px]">{t.generalInfo.assignedAdvisor}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onExportTaskCSV(t)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Export CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateTask(t)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTask(t);
                      onNavigateToFormsWorkspace();
                    }}
                    className="px-3.5 py-1.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Open Forms</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT FORMS MODAL FOR AN INDIVIDUAL TASK */}
      {editingTaskForForms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#0F3825] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Form Allocation Editor
                </span>
                <h3 className="text-base font-bold text-white">
                  Adjust Assigned Forms for {editingTaskForForms.taskCode}
                </h3>
                <p className="text-xs text-emerald-200/80">
                  {editingTaskForForms.generalInfo.ministryName}
                </p>
              </div>
              <button
                onClick={() => setEditingTaskForForms(null)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Select which specific forms are active and required for this ministry in the national reporting cycle:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_FORMS.map((formDef) => {
                  const isChecked = tempForms.includes(formDef.key);

                  return (
                    <label
                      key={formDef.key}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setTempForms((prev) => prev.filter((k) => k !== formDef.key));
                          } else {
                            setTempForms((prev) => [...prev, formDef.key]);
                          }
                        }}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F3825] focus:ring-[#0F3825]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${formDef.badgeColor}`}>
                            {formDef.number}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{formDef.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{formDef.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-600">Quick Select:</span>
                <button
                  type="button"
                  onClick={() => setTempForms(['1A', '1B', '2A', '2B', '3A', '3B', '4'])}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  All 7 Forms
                </button>
                <button
                  type="button"
                  onClick={() => setTempForms(['1A', '2A', '3A', '4'])}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  Needs Only (1A, 2A, 3A, 4)
                </button>
                <button
                  type="button"
                  onClick={() => setTempForms(['1B', '2B', '3B', '4'])}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  Received Only (1B, 2B, 3B, 4)
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {tempForms.length} of 7 Forms Assigned
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingTaskForForms(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedForms}
                  className="px-5 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Form Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
