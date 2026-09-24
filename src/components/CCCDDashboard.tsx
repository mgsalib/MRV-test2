import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  FileSpreadsheet, 
  Download, 
  Share2, 
  Plus, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  Filter, 
  Search, 
  UserCheck, 
  Award, 
  Globe, 
  Send, 
  HelpCircle, 
  RefreshCw, 
  DollarSign, 
  Cpu, 
  GraduationCap, 
  Landmark, 
  ChevronRight,
  Bell,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  SupportCollectionTask, 
  WorkflowStatus, 
  FormTypeKey, 
  UserRole 
} from '../types';
import { AVAILABLE_FORMS, FormDefinition } from '../data/initialData';
import { exportNationalDatasetToCSV, downloadCSV } from '../utils/exportUtils';
import { runAutomatedQC } from '../utils/qcValidator';

interface CCCDDashboardProps {
  tasks: SupportCollectionTask[];
  onSelectTask: (task: SupportCollectionTask) => void;
  onNavigateToWorkspace: (taskId?: string, formKey?: string) => void;
  onOpenCreateTaskModal: () => void;
  onOpenBTRModal: () => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: WorkflowStatus, note: string) => void;
}

const EGP_RATE = 48.5; // 1 USD = 48.50 EGP

export const CCCDDashboard: React.FC<CCCDDashboardProps> = ({
  tasks,
  onSelectTask,
  onNavigateToWorkspace,
  onOpenCreateTaskModal,
  onOpenBTRModal,
  onUpdateTaskStatus,
}) => {
  // Filter States
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchMinistry, setSearchMinistry] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Available unique cycles
  const cycles = useMemo(() => {
    const set = new Set(tasks.map((t) => t.cycleTitle || `Cycle ${t.reportingYear}`));
    return Array.from(set);
  }, [tasks]);

  // Available unique sectors
  const sectors = useMemo(() => {
    const set = new Set(tasks.map((t) => t.generalInfo.sector));
    return Array.from(set);
  }, [tasks]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchCycle = selectedCycle === 'all' || (t.cycleTitle || `Cycle ${t.reportingYear}`) === selectedCycle;
      const matchSector = selectedSector === 'all' || t.generalInfo.sector === selectedSector;
      const matchSearch = !searchMinistry || 
        t.generalInfo.ministryName.toLowerCase().includes(searchMinistry.toLowerCase()) ||
        t.taskCode.toLowerCase().includes(searchMinistry.toLowerCase()) ||
        t.generalInfo.compilerName.toLowerCase().includes(searchMinistry.toLowerCase());
      return matchCycle && matchSector && matchSearch;
    });
  }, [tasks, selectedCycle, selectedSector, searchMinistry]);

  // Currency Formatter Helper
  const formatMoney = (amountUSD: number) => {
    const val = currency === 'USD' ? amountUSD : amountUSD * EGP_RATE;
    const prefix = currency === 'USD' ? '$' : 'EGP ';
    if (val >= 1_000_000_000) {
      return `${prefix}${(val / 1_000_000_000).toFixed(2)}B`;
    }
    if (val >= 1_000_000) {
      return `${prefix}${(val / 1_000_000).toFixed(1)}M`;
    }
    if (val >= 1_000) {
      return `${prefix}${(val / 1_000).toFixed(0)}K`;
    }
    return `${prefix}${val.toLocaleString()}`;
  };

  // High-Level Aggregate Calculations
  const metrics = useMemo(() => {
    let totalNeededUSD = 0;
    let totalReceivedUSD = 0;
    let mitigationNeededUSD = 0;
    let adaptationNeededUSD = 0;
    let crosscuttingNeededUSD = 0;

    let mitigationReceivedUSD = 0;
    let adaptationReceivedUSD = 0;
    let crosscuttingReceivedUSD = 0;

    let totalTechNeededCount = 0;
    let totalTechReceivedCount = 0;
    let totalCapacityNeededCount = 0;
    let totalCapacityReceivedCount = 0;

    const instrumentDistribution: Record<string, number> = {};
    const providerDistribution: Record<string, number> = {};
    const sectorComparisonMap: Record<string, { sector: string; neededUSD: number; receivedUSD: number }> = {};

    filteredTasks.forEach((t) => {
      const sec = t.generalInfo.sector || 'Other';
      if (!sectorComparisonMap[sec]) {
        sectorComparisonMap[sec] = { sector: sec, neededUSD: 0, receivedUSD: 0 };
      }

      // Needed items
      t.financialNeeded.forEach((item) => {
        const amt = item.amountRequestedUSD || 0;
        totalNeededUSD += amt;
        sectorComparisonMap[sec].neededUSD += amt;

        if (item.supportType === 'Mitigation') mitigationNeededUSD += amt;
        else if (item.supportType === 'Adaptation') adaptationNeededUSD += amt;
        else crosscuttingNeededUSD += amt;

        const inst = item.expectedFinancialInstrument || 'Concessional Loan';
        instrumentDistribution[inst] = (instrumentDistribution[inst] || 0) + amt;
      });

      // Received items
      t.financialReceived.forEach((item) => {
        const amt = item.amountReceivedUSD || 0;
        totalReceivedUSD += amt;
        sectorComparisonMap[sec].receivedUSD += amt;

        if (item.supportType === 'Mitigation') mitigationReceivedUSD += amt;
        else if (item.supportType === 'Adaptation') adaptationReceivedUSD += amt;
        else crosscuttingReceivedUSD += amt;

        const src = item.fundingSource || item.supportProvider || 'Multilateral / Other';
        providerDistribution[src] = (providerDistribution[src] || 0) + amt;
      });

      // Non-monetized counts
      totalTechNeededCount += t.techNeeded.length;
      totalTechReceivedCount += t.techReceived.length;
      totalCapacityNeededCount += t.capacityNeeded.length;
      totalCapacityReceivedCount += t.capacityReceived.length;
    });

    const gapUSD = Math.max(0, totalNeededUSD - totalReceivedUSD);
    const mobilizationRate = totalNeededUSD > 0 ? (totalReceivedUSD / totalNeededUSD) * 100 : 0;

    // Workflow counts
    const totalCount = filteredTasks.length;
    const approvedBTRCount = filteredTasks.filter((t) => t.status === 'Approved_For_BTR').length;
    const underReviewCount = filteredTasks.filter((t) => 
      t.status === 'Submitted_To_Advisor' || t.status === 'Under_Advisor_Review' || t.status === 'Coordinator_Review'
    ).length;
    const draftCount = filteredTasks.filter((t) => t.status === 'Draft' || t.status === 'QC_Passed' || t.status === 'QC_Pending').length;

    // Convert sector map to chart array
    const sectorChartData = Object.values(sectorComparisonMap).map((s) => ({
      name: s.sector.replace(' & Renewable Energy', '').replace(' & Mineral Resources', '').replace(' & Land Reclamation', ''),
      needed: currency === 'USD' ? Math.round(s.neededUSD / 1_000_000) : Math.round((s.neededUSD * EGP_RATE) / 1_000_000),
      received: currency === 'USD' ? Math.round(s.receivedUSD / 1_000_000) : Math.round((s.receivedUSD * EGP_RATE) / 1_000_000),
    }));

    // Instruments Pie Data
    const instrumentPieData = Object.entries(instrumentDistribution)
      .map(([name, value]) => ({
        name,
        value: currency === 'USD' ? Math.round(value / 1_000_000) : Math.round((value * EGP_RATE) / 1_000_000),
      }))
      .filter((d) => d.value > 0);

    // Top Providers Bar Data
    const topProvidersData = Object.entries(providerDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, val]) => ({
        name,
        amount: currency === 'USD' ? Math.round(val / 1_000_000) : Math.round((val * EGP_RATE) / 1_000_000),
      }));

    return {
      totalNeededUSD,
      totalReceivedUSD,
      gapUSD,
      mobilizationRate,
      mitigationNeededUSD,
      adaptationNeededUSD,
      crosscuttingNeededUSD,
      mitigationReceivedUSD,
      adaptationReceivedUSD,
      crosscuttingReceivedUSD,
      totalTechNeededCount,
      totalTechReceivedCount,
      totalCapacityNeededCount,
      totalCapacityReceivedCount,
      totalCount,
      approvedBTRCount,
      underReviewCount,
      draftCount,
      sectorChartData,
      instrumentPieData,
      topProvidersData,
    };
  }, [filteredTasks, currency]);

  // Chart Colors
  const PIE_COLORS = ['#0F3825', '#16A34A', '#0284C7', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

  // Handle Export National CSV
  const handleExportNational = () => {
    const csvContent = exportNationalDatasetToCSV(tasks);
    downloadCSV(`Egypt_BTR1_CCCD_National_Support_Dataset_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  // Handle Trigger Reminder Circular
  const handleSendReminder = (ministryName?: string) => {
    const target = ministryName ? `${ministryName} focal point` : 'all line ministries with pending submissions';
    setReminderToast(`Official CCCD Circular notification dispatched to ${target}. CC: Ministry of Foreign Affairs (MFA).`);
    setTimeout(() => {
      setReminderToast(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3825] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-slideUp max-w-md">
          <Bell className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
          <p className="text-xs font-medium leading-snug">{reminderToast}</p>
          <button 
            onClick={() => setReminderToast(null)}
            className="text-white/60 hover:text-white ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header Card with National Identity */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#0F3825] text-emerald-300 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CCCD National Coordinator Authority
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Egyptian Environmental Affairs Agency (EEAA)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                UNFCCC Paris Agreement ETF / BTR-1
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              CCCD National Climate Transparency & Support Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              Consolidated national command overview tracking climate finance, technology transfer, and capacity-building support needed and mobilized across all Egyptian ministries pursuant to Decision 18/CMA.1 Article 13.10 for Egypt's Biennial Transparency Report.
            </p>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              id="btn-cccd-new-cycle"
              onClick={onOpenCreateTaskModal}
              className="px-4 py-2.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer ring-1 ring-[#0F3825]"
            >
              <Plus className="w-4 h-4 text-emerald-300 stroke-[3]" />
              <span>Launch New Collection Task</span>
            </button>

            <button
              id="btn-cccd-open-btr"
              onClick={onOpenBTRModal}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-300 shadow-2xs transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>BTR-1 Chapter 6 Dossier</span>
            </button>

            <button
              id="btn-cccd-export-national"
              onClick={handleExportNational}
              className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
              title="Download consolidated national CSV for all ministries"
            >
              <Download className="w-4 h-4 text-emerald-800" />
              <span className="hidden sm:inline">Export National CSV</span>
            </button>
          </div>
        </div>

        {/* Global Dashboard Filters Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Cycle Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
              <span className="text-slate-400 font-medium">Cycle:</span>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Collection Cycles ({cycles.length})</option>
                {cycles.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
              <span className="text-slate-400 font-medium">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Sectors ({sectors.length})</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Ministry */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search line ministry..."
                value={searchMinistry}
                onChange={(e) => setSearchMinistry(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs w-48 sm:w-60"
              />
            </div>
          </div>

          {/* Currency Toggle & Remind Action */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-slate-200/70 rounded-xl border border-slate-300/80">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('EGP')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'EGP'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EGP (ج.م)
              </button>
            </div>

            <button
              onClick={() => handleSendReminder()}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-1.5 transition-colors"
              title="Issue official reminder circular to all pending ministries"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Issue Circular Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Strategic Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Support Needed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Support Needed
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="pt-2">
              <div className="text-2xl font-black text-slate-900">
                {formatMoney(metrics.totalNeededUSD)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Total pipeline requested for NDC 2030
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Mitigation:</span>
              <span className="font-bold text-slate-800">{formatMoney(metrics.mitigationNeededUSD)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Adaptation:</span>
              <span className="font-bold text-slate-800">{formatMoney(metrics.adaptationNeededUSD)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Support Received */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Support Received
              </span>
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
                <Landmark className="w-4 h-4" />
              </span>
            </div>
            <div className="pt-2">
              <div className="text-2xl font-black text-sky-800">
                {formatMoney(metrics.totalReceivedUSD)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Inflows committed & disbursed
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Mobilization Rate:</span>
              <span className="font-bold text-sky-700">{metrics.mobilizationRate.toFixed(1)}% of needed</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-sky-600 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, metrics.mobilizationRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: National Financing Gap */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                National Gap
              </span>
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="pt-2">
              <div className="text-2xl font-black text-amber-700">
                {formatMoney(metrics.gapUSD)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Unfunded NDC funding shortfall
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>UNFCCC Priority:</span>
              <span className="font-bold text-amber-800">COP30 Mobilization</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Needs targeted bilateral & MDB co-finance
            </div>
          </div>
        </div>

        {/* Card 4: Non-Financial Pipelines (Tech & Capacity) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Tech & Capacity
              </span>
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                <Cpu className="w-4 h-4" />
              </span>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-900">
                  {metrics.totalTechNeededCount + metrics.totalCapacityNeededCount}
                </span>
                <span className="text-xs text-slate-500 font-semibold">items</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Article 13.10 non-monetized support
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Tech Transfer:</span>
              <span className="font-bold text-slate-800">{metrics.totalTechNeededCount} needed / {metrics.totalTechReceivedCount} rec'd</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Capacity Building:</span>
              <span className="font-bold text-slate-800">{metrics.totalCapacityNeededCount} needed / {metrics.totalCapacityReceivedCount} rec'd</span>
            </div>
          </div>
        </div>

        {/* Card 5: BTR Ministerial Submissions Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                BTR-1 Readiness
              </span>
              <span className="p-1.5 rounded-lg bg-[#0F3825]/10 text-[#0F3825]">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0F3825]">
                  {metrics.approvedBTRCount} / {metrics.totalCount}
                </span>
                <span className="text-xs text-emerald-800 font-bold">Approved</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Line ministries cleared for submission
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex justify-between text-amber-700 font-medium">
              <span>Under Advisor Review:</span>
              <span className="font-bold">{metrics.underReviewCount}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>In Drafting / QC:</span>
              <span className="font-bold text-slate-700">{metrics.draftCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Sectoral Finance Comparison (BarChart) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Sectoral Climate Support Needed vs. Received ({currency === 'USD' ? '$ Millions' : 'M EGP'})
              </h2>
              <p className="text-xs text-slate-500">
                Direct cross-comparison by sectoral portfolio for Egypt's NDC priorities
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {metrics.sectorChartData.length} Sectors Analyzed
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.sectorChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#475569' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#475569' }} 
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    `${currency === 'USD' ? '$' : 'EGP '}${Number(value).toLocaleString()}M`,
                    name === 'needed' ? 'Support Needed' : 'Support Received',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    borderColor: '#CBD5E1',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(val) => val === 'needed' ? 'Support Needed' : 'Support Received'}
                />
                <Bar dataKey="needed" fill="#0F3825" radius={[4, 4, 0, 0]} name="needed" />
                <Bar dataKey="received" fill="#0284C7" radius={[4, 4, 0, 0]} name="received" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Financial Instruments Distribution (Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-sky-700" />
                Financial Instruments
              </h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Expected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of required financing vehicles
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {metrics.instrumentPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.instrumentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {metrics.instrumentPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${currency === 'USD' ? '$' : 'EGP '}${val}M`, 'Volume']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No instrument data available</div>
            )}
          </div>

          {/* Mini Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {metrics.instrumentPieData.slice(0, 4).map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} 
                />
                <span className="text-slate-600 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row with Top Providers & Climate Theme Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top International Support Providers */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-700" />
                Key Climate Finance Providers Mobilized
              </h2>
              <p className="text-xs text-slate-500">
                Leading multilateral funds, bilateral partners & MDBs supporting Egypt
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {metrics.topProvidersData.length > 0 ? (
              metrics.topProvidersData.map((prov, i) => {
                const maxAmt = metrics.topProvidersData[0]?.amount || 1;
                const pct = (prov.amount / maxAmt) * 100;
                return (
                  <div key={prov.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{prov.name}</span>
                      <span className="text-emerald-800 font-bold">{currency === 'USD' ? '$' : 'EGP '}{prov.amount}M</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#0F3825] h-full rounded-full transition-all" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No provider data yet.</p>
            )}
          </div>
        </div>

        {/* Climate Action Balance: Mitigation vs. Adaptation */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Climate Action Pillars Allocation
            </h2>
            <p className="text-xs text-slate-500">
              Mitigation vs. Adaptation alignment for UNFCCC reporting balance
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Support Needed Balance */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Support Needed Balance</span>
                <span className="text-emerald-900">{formatMoney(metrics.totalNeededUSD)}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div 
                  className="bg-emerald-700 h-full" 
                  style={{ width: `${metrics.totalNeededUSD ? (metrics.mitigationNeededUSD / metrics.totalNeededUSD) * 100 : 0}%` }}
                  title="Mitigation"
                />
                <div 
                  className="bg-sky-600 h-full" 
                  style={{ width: `${metrics.totalNeededUSD ? (metrics.adaptationNeededUSD / metrics.totalNeededUSD) * 100 : 0}%` }}
                  title="Adaptation"
                />
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${metrics.totalNeededUSD ? (metrics.crosscuttingNeededUSD / metrics.totalNeededUSD) * 100 : 0}%` }}
                  title="Crosscutting"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  Mitigation ({metrics.totalNeededUSD ? Math.round((metrics.mitigationNeededUSD / metrics.totalNeededUSD) * 100) : 0}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  Adaptation ({metrics.totalNeededUSD ? Math.round((metrics.adaptationNeededUSD / metrics.totalNeededUSD) * 100) : 0}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Cross-cutting
                </span>
              </div>
            </div>

            {/* Support Received Balance */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Support Received Balance</span>
                <span className="text-sky-900">{formatMoney(metrics.totalReceivedUSD)}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div 
                  className="bg-emerald-700 h-full" 
                  style={{ width: `${metrics.totalReceivedUSD ? (metrics.mitigationReceivedUSD / metrics.totalReceivedUSD) * 100 : 0}%` }}
                  title="Mitigation"
                />
                <div 
                  className="bg-sky-600 h-full" 
                  style={{ width: `${metrics.totalReceivedUSD ? (metrics.adaptationReceivedUSD / metrics.totalReceivedUSD) * 100 : 0}%` }}
                  title="Adaptation"
                />
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${metrics.totalReceivedUSD ? (metrics.crosscuttingReceivedUSD / metrics.totalReceivedUSD) * 100 : 0}%` }}
                  title="Crosscutting"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  Mitigation ({metrics.totalReceivedUSD ? Math.round((metrics.mitigationReceivedUSD / metrics.totalReceivedUSD) * 100) : 0}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  Adaptation ({metrics.totalReceivedUSD ? Math.round((metrics.adaptationReceivedUSD / metrics.totalReceivedUSD) * 100) : 0}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Cross-cutting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* National Line Ministries Compliance & Workflow Matrix (CCCD Operational Core) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0F3825]" />
              National Line Ministries Status & Compliance Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Live tracking of ministerial submission readiness, assigned form requirements, and quality checks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
              <tr>
                <th className="py-3 px-4">Ministry / Sector</th>
                <th className="py-3 px-3">Focal Point Compiler</th>
                <th className="py-3 px-3 text-center">Forms Required</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Support Needed</th>
                <th className="py-3 px-3">Support Received</th>
                <th className="py-3 px-3 text-center">QC Checks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => {
                const qc = runAutomatedQC(t);
                const taskNeededUSD = t.financialNeeded.reduce((acc, i) => acc + (i.amountRequestedUSD || 0), 0);
                const taskReceivedUSD = t.financialReceived.reduce((acc, i) => acc + (i.amountReceivedUSD || 0), 0);
                const forms = t.assignedForms || ['1A', '1B', '2A', '2B', '3A', '3B', '4'];

                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{t.generalInfo.ministryName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono text-emerald-800 font-bold">{t.taskCode}</span>
                        <span>•</span>
                        <span>{t.generalInfo.sector}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-900">{t.generalInfo.compilerName}</div>
                      <div className="text-[11px] text-slate-400">{t.generalInfo.compilerEmail}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center justify-center gap-1 flex-wrap max-w-[170px]">
                        {forms.map((fKey) => (
                          <span
                            key={fKey}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                            title={`Form ${fKey}`}
                          >
                            {fKey}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        t.status === 'Approved_For_BTR'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : t.status === 'Submitted_To_Advisor' || t.status === 'Under_Advisor_Review' || t.status === 'Coordinator_Review'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : t.status === 'QC_Passed'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {t.status === 'Approved_For_BTR' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {formatMoney(taskNeededUSD)}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {t.financialNeeded.length} projects
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-sky-800">
                      {formatMoney(taskReceivedUSD)}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {t.financialReceived.length} disbursements
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {qc.errors.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          {qc.errors.length} err
                        </span>
                      ) : qc.warnings.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {qc.warnings.length} warn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Clean
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectTask(t);
                            onNavigateToWorkspace(t.id);
                          }}
                          className="px-2.5 py-1.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                          title="Open 7 forms workspace for this ministry"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSendReminder(t.generalInfo.ministryName)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Send Circular Reminder"
                        >
                          <Bell className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BTR-1 Chapter 6 CTF Readiness Checklist & Guidelines Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              UNFCCC 18/CMA.1 Chapter VI (Support N/R) Compliance Protocols
            </h2>
            <p className="text-xs text-slate-500">
              National readiness verification before submitting Egypt's First Biennial Transparency Report
            </p>
          </div>

          <button
            onClick={onOpenBTRModal}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
            <span>Generate Official CTF Summary Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>CTF Table 1 (Finance Needed)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              100% of pipeline projects tagged by support type and financial instrument.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>CTF Table 2 (Finance Received)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Inflows verified against official CBE / Ministry of Finance records.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>CTF Table 3 & 4 (Tech / Capacity)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Hardware, software, and systemic capacity-building measures cataloged.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Form 4 Methodologies</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Assumptions, gaps, barriers, and MRV institutional arrangements documented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
