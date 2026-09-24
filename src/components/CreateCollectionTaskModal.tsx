import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Shield, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock,
  Send,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { 
  CreateCollectionTaskPayload, 
  AssignedMinistryFormConfig, 
  FormTypeKey, 
  UrgencyLevel 
} from '../types';
import { 
  ALL_MINISTRIES_CATALOG, 
  AVAILABLE_FORMS, 
  FormDefinition, 
  MinistryCatalogItem 
} from '../data/initialData';

interface CreateCollectionTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTasks: (payload: CreateCollectionTaskPayload) => void;
}

export const CreateCollectionTaskModal: React.FC<CreateCollectionTaskModalProps> = ({
  isOpen,
  onClose,
  onCreateTasks,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Cycle Metadata
  const [cycleTitle, setCycleTitle] = useState('2026 National Support Needs & Received Data Collection (BTR-1)');
  const [reportingYear, setReportingYear] = useState<number>(2026);
  const [taskCodePrefix, setTaskCodePrefix] = useState('SUP-EGY-2026');
  const [startDate, setStartDate] = useState('2026-01-15');
  const [deadlineDate, setDeadlineDate] = useState('2026-09-30');
  const [reportingDirection, setReportingDirection] = useState<'Internationally (UNFCCC BTR)' | 'Confidential (C) Nationally'>('Internationally (UNFCCC BTR)');
  const [priority, setPriority] = useState<UrgencyLevel>('High');
  const [defaultAdvisor, setDefaultAdvisor] = useState('Ministry of Finance (MoF) / Climate Finance Unit');
  const [instructions, setInstructions] = useState(
    'Please record all climate finance, capacity-building, and technology transfer needs and received inflows for the 2024-2026 reporting window in accordance with UNFCCC ETF Decision 18/CMA.1.'
  );

  // Step 2: Assigned Ministries and Form Allocations (Req #03)
  const [assignedMinistries, setAssignedMinistries] = useState<AssignedMinistryFormConfig[]>(() => {
    // Default select first 4 core ministries with their default forms
    return ALL_MINISTRIES_CATALOG.slice(0, 4).map((m) => ({
      ministryCode: m.code,
      ministryName: m.name,
      sector: m.sector,
      assignedAdvisor: m.defaultAdvisor,
      assignedForms: [...m.defaultForms],
      focalPointName: m.defaultFocalPoint.name,
      focalPointEmail: m.defaultFocalPoint.email,
      focalPointPhone: m.defaultFocalPoint.phone,
      focalPointTitle: m.defaultFocalPoint.title,
      customDueDate: '',
      notes: '',
    }));
  });

  const [searchMinistry, setSearchMinistry] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  if (!isOpen) return null;

  // Helpers for Ministry toggling
  const isMinistrySelected = (code: string) => {
    return assignedMinistries.some((m) => m.ministryCode === code);
  };

  const handleToggleMinistry = (catalogItem: MinistryCatalogItem) => {
    if (isMinistrySelected(catalogItem.code)) {
      setAssignedMinistries((prev) => prev.filter((m) => m.ministryCode !== catalogItem.code));
    } else {
      const newConfig: AssignedMinistryFormConfig = {
        ministryCode: catalogItem.code,
        ministryName: catalogItem.name,
        sector: catalogItem.sector,
        assignedAdvisor: catalogItem.defaultAdvisor,
        assignedForms: [...catalogItem.defaultForms],
        focalPointName: catalogItem.defaultFocalPoint.name,
        focalPointEmail: catalogItem.defaultFocalPoint.email,
        focalPointPhone: catalogItem.defaultFocalPoint.phone,
        focalPointTitle: catalogItem.defaultFocalPoint.title,
        customDueDate: '',
        notes: '',
      };
      setAssignedMinistries((prev) => [...prev, newConfig]);
    }
  };

  const handleToggleAllMinistries = () => {
    if (assignedMinistries.length === ALL_MINISTRIES_CATALOG.length) {
      setAssignedMinistries([]);
    } else {
      const all = ALL_MINISTRIES_CATALOG.map((m) => ({
        ministryCode: m.code,
        ministryName: m.name,
        sector: m.sector,
        assignedAdvisor: m.defaultAdvisor,
        assignedForms: [...m.defaultForms],
        focalPointName: m.defaultFocalPoint.name,
        focalPointEmail: m.defaultFocalPoint.email,
        focalPointPhone: m.defaultFocalPoint.phone,
        focalPointTitle: m.defaultFocalPoint.title,
        customDueDate: '',
        notes: '',
      }));
      setAssignedMinistries(all);
    }
  };

  // Helper for toggling individual forms for a specific ministry
  const handleToggleFormForMinistry = (ministryCode: string, formKey: FormTypeKey) => {
    setAssignedMinistries((prev) =>
      prev.map((m) => {
        if (m.ministryCode !== ministryCode) return m;
        const exists = m.assignedForms.includes(formKey);
        const updated = exists
          ? m.assignedForms.filter((f) => f !== formKey)
          : [...m.assignedForms, formKey];
        return { ...m, assignedForms: updated };
      })
    );
  };

  // Batch Form Presets for all currently selected ministries
  const applyPresetToAllSelected = (presetType: 'all' | 'needs' | 'received' | 'tech_cap' | 'default') => {
    setSelectedPreset(presetType);
    setAssignedMinistries((prev) =>
      prev.map((m) => {
        const cat = ALL_MINISTRIES_CATALOG.find((c) => c.code === m.ministryCode);
        if (presetType === 'all') {
          return { ...m, assignedForms: ['1A', '1B', '2A', '2B', '3A', '3B', '4'] };
        } else if (presetType === 'needs') {
          return { ...m, assignedForms: ['1A', '2A', '3A', '4'] };
        } else if (presetType === 'received') {
          return { ...m, assignedForms: ['1B', '2B', '3B', '4'] };
        } else if (presetType === 'tech_cap') {
          return { ...m, assignedForms: ['2A', '2B', '3A', '3B', '4'] };
        } else if (presetType === 'default' && cat) {
          return { ...m, assignedForms: [...cat.defaultForms] };
        }
        return m;
      })
    );
  };

  // Update specific ministry attributes
  const handleUpdateMinistryField = (
    ministryCode: string,
    field: keyof AssignedMinistryFormConfig,
    value: any
  ) => {
    setAssignedMinistries((prev) =>
      prev.map((m) => (m.ministryCode === ministryCode ? { ...m, [field]: value } : m))
    );
  };

  // Submission handler
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignedMinistries.length === 0) {
      alert('Please assign at least one ministry to this collection task cycle.');
      setStep(2);
      return;
    }

    // Check that each ministry has at least one form assigned
    const unassigned = assignedMinistries.find((m) => m.assignedForms.length === 0);
    if (unassigned) {
      alert(`Ministry "${unassigned.ministryName}" has 0 forms assigned. Please select at least 1 form.`);
      setStep(2);
      return;
    }

    const payload: CreateCollectionTaskPayload = {
      cycleTitle,
      reportingYear,
      taskCodePrefix,
      startDate,
      deadlineDate,
      reportingDirection,
      priority,
      instructions,
      defaultAdvisor,
      assignedMinistries,
    };

    onCreateTasks(payload);
    onClose();
  };

  const filteredCatalog = ALL_MINISTRIES_CATALOG.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMinistry.toLowerCase()) ||
      m.sector.toLowerCase().includes(searchMinistry.toLowerCase()) ||
      m.code.toLowerCase().includes(searchMinistry.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#0F3825] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Layers className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  CCCD Dispatch Engine
                </span>
                <span className="text-xs text-emerald-200/80">• Step {step} of 3</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Create & Assign Support Collection Task Cycle
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 font-semibold pb-1 border-b-2 transition-colors ${
                step === 1
                  ? 'border-[#0F3825] text-[#0F3825]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                step === 1 ? 'bg-[#0F3825] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </span>
              <span>1. Collection Cycle Metadata</span>
            </button>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 font-semibold pb-1 border-b-2 transition-colors ${
                step === 2
                  ? 'border-[#0F3825] text-[#0F3825]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                step === 2 ? 'bg-[#0F3825] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </span>
              <span>2. Assign Ministries & Form Allocations</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 font-semibold pb-1 border-b-2 transition-colors ${
                step === 3
                  ? 'border-[#0F3825] text-[#0F3825]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                step === 3 ? 'bg-[#0F3825] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </span>
              <span>3. Review & Dispatch</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {assignedMinistries.length} Ministries Assigned • {assignedMinistries.reduce((acc, m) => acc + m.assignedForms.length, 0)} Total Form Tasks
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CYCLE METADATA */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <p className="font-semibold">CCCD Collection Task Generator</p>
                  <p className="text-emerald-800/90 mt-0.5">
                    Define the overarching reporting cycle parameters for Egypt's Biennial Transparency Report (BTR). In Step 2, you will allocate specific ministries and tailor the exact forms required from each.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Collection Cycle Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cycleTitle}
                    onChange={(e) => setCycleTitle(e.target.value)}
                    placeholder="e.g., 2026 National Support Needs & Received Data Collection (BTR-1)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reporting Year / Cycle <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reportingYear}
                    onChange={(e) => setReportingYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  >
                    <option value={2026}>2026 (UNFCCC BTR-1 Official Window)</option>
                    <option value={2025}>2025 (Annual Interim MRV Cycle)</option>
                    <option value={2027}>2027 (Subsequent NDC Tracking Cycle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Code Prefix <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={taskCodePrefix}
                    onChange={(e) => setTaskCodePrefix(e.target.value)}
                    placeholder="e.g., SUP-EGY-2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Each assigned ministry task will be suffixed with their acronym (e.g. {taskCodePrefix}-MoERE).</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Collection Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Global Submission Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reporting Scope & Destination
                  </label>
                  <select
                    value={reportingDirection}
                    onChange={(e) => setReportingDirection(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  >
                    <option value="Internationally (UNFCCC BTR)">Internationally (UNFCCC BTR Common Reporting Tables)</option>
                    <option value="Confidential (C) Nationally">Confidential (C) Nationally / Internal Climate Policy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cycle Priority / Urgency
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as UrgencyLevel)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  >
                    <option value="High">High (Strict BTR Deadline Mandate)</option>
                    <option value="Medium">Medium (Standard Sectoral Review)</option>
                    <option value="Low">Low (Informational Tracking)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Lead Support Review Advisor
                  </label>
                  <select
                    value={defaultAdvisor}
                    onChange={(e) => setDefaultAdvisor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  >
                    <option value="Ministry of Finance (MoF) / Climate Finance Unit">Ministry of Finance (MoF) / Climate Finance Unit</option>
                    <option value="Ministry of Planning, Economic Development and Int. Cooperation (MoPEDIC)">Ministry of Planning, Economic Development and Int. Cooperation (MoPEDIC)</option>
                    <option value="Ministry of Foreign Affairs (MFA) / Climate Affairs">Ministry of Foreign Affairs (MFA) / Climate Affairs</option>
                    <option value="CCCD Direct Review (EEAA)">CCCD Direct Review (EEAA)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Instructions & Directives to Focal Points
                  </label>
                  <textarea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter official circular instructions, required attachments, and co-financing rules..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3825] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ASSIGN MINISTRIES & PER-MINISTRY FORM ALLOCATIONS (Req #03) */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Quick Presets Toolbar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-700" />
                      Ministry Assignment & Form Allocation Matrix
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select which ministries are assigned to this collection task, and specify for each ministry exactly which forms they must complete.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleToggleAllMinistries}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                    >
                      {assignedMinistries.length === ALL_MINISTRIES_CATALOG.length
                        ? 'Deselect All Ministries'
                        : `Select All (${ALL_MINISTRIES_CATALOG.length}) Ministries`}
                    </button>
                  </div>
                </div>

                {/* Form Presets Batch Bar */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] font-semibold text-slate-600">Quick Form Presets (Apply to All Selected):</span>
                  <button
                    type="button"
                    onClick={() => applyPresetToAllSelected('all')}
                    className="px-2.5 py-1 bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-md text-[11px] font-semibold transition-colors"
                  >
                    Full 7 Forms Suite (1A → 4)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetToAllSelected('needs')}
                    className="px-2.5 py-1 bg-blue-100/70 hover:bg-blue-200 text-blue-900 border border-blue-300 rounded-md text-[11px] font-semibold transition-colors"
                  >
                    Needs Focus (1A, 2A, 3A, 4)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetToAllSelected('received')}
                    className="px-2.5 py-1 bg-teal-100/70 hover:bg-teal-200 text-teal-900 border border-teal-300 rounded-md text-[11px] font-semibold transition-colors"
                  >
                    Received Inflows (1B, 2B, 3B, 4)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetToAllSelected('default')}
                    className="px-2.5 py-1 bg-slate-200/70 hover:bg-slate-300 text-slate-800 border border-slate-300 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset to Sector Defaults
                  </button>
                </div>
              </div>

              {/* Ministries Selection & Form Matrix List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={searchMinistry}
                      onChange={(e) => setSearchMinistry(e.target.value)}
                      placeholder="Search ministries or sectors..."
                      className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3825]"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  <span className="text-xs font-bold text-[#0F3825] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    {assignedMinistries.length} of {ALL_MINISTRIES_CATALOG.length} Ministries Active
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredCatalog.map((catalogItem) => {
                    const isSelected = isMinistrySelected(catalogItem.code);
                    const config = assignedMinistries.find((m) => m.ministryCode === catalogItem.code);

                    return (
                      <div
                        key={catalogItem.code}
                        className={`rounded-xl border transition-all duration-150 ${
                          isSelected
                            ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-400/30'
                            : 'bg-slate-50/70 border-slate-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {/* Ministry Header / Selection row */}
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id={`check-min-${catalogItem.code}`}
                              checked={isSelected}
                              onChange={() => handleToggleMinistry(catalogItem)}
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F3825] focus:ring-[#0F3825] cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <label
                                  htmlFor={`check-min-${catalogItem.code}`}
                                  className="text-xs font-bold text-slate-900 cursor-pointer hover:text-emerald-800"
                                >
                                  {catalogItem.name}
                                </label>
                                <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {catalogItem.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Sector: <span className="font-medium text-slate-700">{catalogItem.sector}</span>
                              </p>
                            </div>
                          </div>

                          {/* Quick status on right */}
                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {config?.assignedForms.length || 0} Forms Assigned
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleMinistry(catalogItem)}
                                className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-emerald-300"
                              >
                                + Include in Cycle
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expandable Form Allocation Matrix for this Ministry (when selected) */}
                        {isSelected && config && (
                          <div className="p-4 bg-emerald-50/30 space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                  Forms to Assign on {catalogItem.code}:
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Click to toggle individual forms for this ministry
                                </span>
                              </div>

                              {/* Form Badges Matrix */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                                {AVAILABLE_FORMS.map((formDef) => {
                                  const isAssigned = config.assignedForms.includes(formDef.key);

                                  return (
                                    <button
                                      type="button"
                                      key={formDef.key}
                                      onClick={() => handleToggleFormForMinistry(catalogItem.code, formDef.key)}
                                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                        isAssigned
                                          ? 'bg-white border-emerald-500 shadow-2xs ring-1 ring-emerald-500/20'
                                          : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                          isAssigned ? formDef.badgeColor : 'bg-slate-200 text-slate-500'
                                        }`}>
                                          {formDef.number}
                                        </span>
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                          isAssigned ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                                        }`}>
                                          {isAssigned && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                      </div>
                                      <span className={`text-xs font-semibold leading-tight line-clamp-2 ${
                                        isAssigned ? 'text-slate-900' : 'text-slate-500'
                                      }`}>
                                        {formDef.name}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Focal point & Advisor overrides */}
                            <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                  Focal Point Compiler
                                </label>
                                <input
                                  type="text"
                                  value={config.focalPointName || ''}
                                  onChange={(e) =>
                                    handleUpdateMinistryField(catalogItem.code, 'focalPointName', e.target.value)
                                  }
                                  placeholder="Compiler Name"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                  Focal Point Email
                                </label>
                                <input
                                  type="email"
                                  value={config.focalPointEmail || ''}
                                  onChange={(e) =>
                                    handleUpdateMinistryField(catalogItem.code, 'focalPointEmail', e.target.value)
                                  }
                                  placeholder="compiler@ministry.gov.eg"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                  Assigned Review Advisor
                                </label>
                                <select
                                  value={config.assignedAdvisor || catalogItem.defaultAdvisor}
                                  onChange={(e) =>
                                    handleUpdateMinistryField(catalogItem.code, 'assignedAdvisor', e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
                                >
                                  <option value="Ministry of Finance (MoF) / Climate Finance Unit">Ministry of Finance (MoF)</option>
                                  <option value="Ministry of Planning, Economic Development and Int. Cooperation (MoPEDIC)">MoPEDIC</option>
                                  <option value="Ministry of Foreign Affairs (MFA) / Climate Affairs">MFA</option>
                                  <option value="CCCD Direct Review (EEAA)">CCCD Direct Review (EEAA)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & DISPATCH */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      Pre-Dispatch Summary
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {cycleTitle}
                    </h3>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Cycle Year: <span className="font-bold text-white">{reportingYear}</span> • Deadline: <span className="font-bold text-white">{deadlineDate}</span> • Scope: <span className="font-bold text-white">{reportingDirection}</span>
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-3xl font-extrabold text-emerald-300">
                      {assignedMinistries.length}
                    </span>
                    <p className="text-xs text-emerald-100/90 font-medium">
                      Collection Tasks to Create
                    </p>
                  </div>
                </div>
              </div>

              {/* Ministry Assignment Table Overview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Assigned Ministries ({assignedMinistries.length})</span>
                  <span>Form Allocations Breakdown</span>
                </div>

                <div className="divide-y divide-slate-200 bg-white">
                  {assignedMinistries.map((m) => (
                    <div key={m.ministryCode} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.ministryName}</span>
                          <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {taskCodePrefix}-{m.ministryCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Focal Point: <span className="font-medium text-slate-700">{m.focalPointName || 'Assigned Lead'} ({m.focalPointEmail || 'pending email'})</span> • Advisor: <span className="text-emerald-800 font-medium">{m.assignedAdvisor}</span>
                        </p>
                      </div>

                      {/* Forms Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {m.assignedForms.map((fKey) => {
                          const fDef = AVAILABLE_FORMS.find((f) => f.key === fKey);
                          return (
                            <span
                              key={fKey}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                fDef?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                              title={fDef?.name}
                            >
                              {fDef?.number || fKey}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-semibold">Confirmation & Dispatch Actions</p>
                  <p className="text-amber-800 mt-0.5">
                    Clicking "Create & Dispatch Collection Tasks" will register these {assignedMinistries.length} collection tasks into the National MRV database, initialize their form matrices, and notify the respective ministerial focal points.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !cycleTitle.trim()) {
                    alert('Please enter a collection cycle title.');
                    return;
                  }
                  if (step === 2 && assignedMinistries.length === 0) {
                    alert('Please select at least 1 ministry to assign.');
                    return;
                  }
                  setStep((prev) => (prev + 1) as any);
                }}
                className="px-5 py-2.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Continue to {step === 1 ? 'Assign Ministries' : 'Review & Dispatch'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>Create & Dispatch ({assignedMinistries.length}) Collection Tasks</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
