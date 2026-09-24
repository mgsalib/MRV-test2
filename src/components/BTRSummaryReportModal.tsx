import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  Cpu, 
  GraduationCap, 
  FileCheck, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  ChevronRight,
  Filter,
  Info,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { SupportCollectionTask } from '../types';
import { exportSupportTaskToCSV, downloadCSV } from '../utils/exportUtils';
import { 
  BTR_MACRO_FINANCIAL_NEEDS,
  BTR_FINANCE_BARRIERS,
  BTR_FINANCIAL_NEEDED_BREAKDOWN,
  BTR_FINANCIAL_RECEIVED_PROJECTS,
  BTR_ENDOGENOUS_TECH_NEEDS,
  BTR_TECH_RECEIVED_PROJECTS,
  BTR_CAPACITY_BUILDING_SUMMARY,
  BTR_ARTICLE_13_SUPPORT 
} from '../data/btrNationalData';

interface BTRSummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: SupportCollectionTask;
}

type TabType = 
  | 'macro' 
  | 'fin_needed' 
  | 'fin_received' 
  | 'tech' 
  | 'capacity' 
  | 'article13' 
  | 'task_ctf';

export const BTRSummaryReportModal: React.FC<BTRSummaryReportModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('macro');
  const [finReceivedFilter, setFinReceivedFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  if (!isOpen) return null;

  // Active Task Totals
  const taskTotalRequested = task.financialNeeded.reduce((acc, curr) => acc + (curr.amountRequestedUSD || 0), 0);
  const taskTotalGap = task.financialNeeded.reduce((acc, curr) => acc + (curr.estimatedGapUSD || 0), 0);
  const taskTotalReceived = task.financialReceived.reduce((acc, curr) => acc + (curr.amountReceivedUSD || 0), 0);

  // Filtered Financial Received Projects
  const filteredReceived = BTR_FINANCIAL_RECEIVED_PROJECTS.filter((proj) => {
    const matchesFilter = finReceivedFilter === 'All' || proj.typeOfSupport === finReceivedFilter || proj.sector.toLowerCase().includes(finReceivedFilter.toLowerCase());
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = exportSupportTaskToCSV(task);
    downloadCSV(`BTR1_Chapter5_Support_Report_${task.generalInfo.ministryName.replace(/[^a-zA-Z0-9]/g, '_')}_${task.reportingYear}.csv`, csvContent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-h-none print:shadow-none print:border-none">
        
        {/* Modal Top Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0F3825] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center border border-white/10 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Egypt’s First Biennial Transparency Report (BTR1)
                </h3>
                <span className="bg-[#D4E5DB] text-[#0F3825] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Chapter 5 Summary
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Support Needed and Received under Articles 9–11 & 13 of the Paris Agreement (MPG Dec. 18/CMA.1)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              id="btn-btr-print"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>Print Report</span>
            </button>
            <button
              id="btn-btr-export-csv"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              id="btn-btr-close"
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Secondary Navigation Bar */}
        <div className="bg-[#F4F6F4] border-b border-slate-200 px-4 pt-2 flex items-center gap-1 overflow-x-auto no-scrollbar print:hidden">
          <button
            id="tab-btr-macro"
            onClick={() => setActiveTab('macro')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'macro'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1. Executive & Macro Finance</span>
          </button>

          <button
            id="tab-btr-needed"
            onClick={() => setActiveTab('fin_needed')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fin_needed'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Financial Support Needed ($246B)</span>
          </button>

          <button
            id="tab-btr-received"
            onClick={() => setActiveTab('fin_received')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fin_received'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Financial Support Received</span>
          </button>

          <button
            id="tab-btr-tech"
            onClick={() => setActiveTab('tech')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tech'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>4. Technology Transfer (Art. 10)</span>
          </button>

          <button
            id="tab-btr-capacity"
            onClick={() => setActiveTab('capacity')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'capacity'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>5. Capacity Building (Art. 11)</span>
          </button>

          <button
            id="tab-btr-art13"
            onClick={() => setActiveTab('article13')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'article13'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>6. Article 13 & MRV Support</span>
          </button>

          <button
            id="tab-btr-task"
            onClick={() => setActiveTab('task_ctf')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'task_ctf'
                ? 'bg-white text-[#0F3825] border-[#0F3825] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>7. Active Sector Task CTF</span>
          </button>
        </div>

        {/* Report Document Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-800 bg-[#F9FAF9] flex-1">
          
          {/* TAB 1: EXECUTIVE & MACRO FINANCE */}
          {activeTab === 'macro' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Document Overview Banner */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      National Climate Finance Requirements & Strategic Alignment
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Synthesis of Egypt’s NCCS 2050 and Second Updated Nationally Determined Contribution (NDC)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                      Exchange Rate: <strong>1 USD = 50.4094 EGP</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* NCCS 2050 Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                        National Climate Change Strategy 2050 (NCCS)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Total: $324 Billion USD
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Mitigation Programs</span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">$211.0 B</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Secured: <strong className="text-emerald-700">$57.6 B</strong> • Gap: <strong className="text-amber-700">$153.6 B</strong>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Adaptation Programs</span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">$113.0 B</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Secured: <strong className="text-emerald-700">$18.3 B</strong> • Gap: <strong className="text-amber-700">$94.7 B</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">5 Strategic Goals:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
                        <li>Goal 1: Sustainable Economic Growth & Low-Emission Development</li>
                        <li>Goal 2: Enhancing Adaptive Capacity & Resilience to Climate Impacts</li>
                        <li>Goal 3: Enhancing Climate Change Action Governance</li>
                        <li>Goal 4: Enhancing Climate Financing Infrastructure & Green Banking</li>
                        <li>Goal 5: Scientific Research, Technology Transfer & Knowledge Management</li>
                      </ul>
                    </div>
                  </div>

                  {/* Second Updated NDC Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                        Second Updated NDC Requirements (to 2030)
                      </span>
                      <span className="bg-[#0F3825] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Total: $246 Billion USD
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Mitigation Needs</span>
                        <div className="text-base font-bold text-emerald-800 mt-0.5">$196.0 B</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Electricity, Oil & Gas, Transport, Industry, Buildings
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Adaptation Needs</span>
                        <div className="text-base font-bold text-sky-800 mt-0.5">$50.0 B</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Water Resources, Agriculture, Coastal Zones, Tourism
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">NDC Quantitative Mitigation Commitments:</p>
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200">
                          <span>Electricity Sector (Generation, T&D):</span>
                          <strong className="text-emerald-800">37% reduction below BAU (80.5 Mt)</strong>
                        </div>
                        <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200">
                          <span>Oil & Gas (Associated Gases Flaring):</span>
                          <strong className="text-emerald-800">65% reduction below BAU (1.68 Mt)</strong>
                        </div>
                        <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200">
                          <span>Transport Sector (Modal Shift & EV):</span>
                          <strong className="text-emerald-800">7% reduction below BAU (8.96 Mt)</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table 78: Methodological Assumptions */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#0F3825]" />
                  <span>Table 78: Underlying Assumptions, Definitions & Methodologies (BTR Chapter 5.3)</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Exchange Rate Baselines</span>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Central Bank of Egypt buy rate (10/11 Dec 2024): <strong>50.4094 EGP/USD</strong> and <strong>53.0610 EGP/EUR</strong>, held constant for the reporting window.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Reporting Timeframe</span>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Financial support reported from <strong>January 1, 2022 to June 6, 2024</strong>. Projects started or approved in 2024 are included.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Channels & Financial Instruments</span>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Bilateral & Multilateral agreements, Sovereign Green Bonds ($750M), Concessional Loans, Grants, Guarantees, and Equity.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Support Status Definitions</span>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      <strong>Committed</strong> (formally pledged), <strong>Received</strong> (funds disbursed), and <strong>Needed</strong> (future capital requirements).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Avoidance of Double Counting</span>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Strict separation between Article 13 transparency-related capacity funding and broader climate mitigation/adaptation programs.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Green Regulatory Frameworks</span>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Green Hydrogen Incentives Law (2024), FRA Green Bond framework (2020), and CBE Sustainable Finance Principles (2021-2022).
                    </p>
                  </div>
                </div>
              </div>

              {/* Table 79: Barriers and Gaps Attracting International Finance */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Table 79: Key Barriers & Gaps to Attracting International Climate Finance (BTR Chapter 5.4.2)</span>
                </h4>
                
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {BTR_FINANCE_BARRIERS.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="sm:w-64 shrink-0 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{item.barrier}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed flex-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL SUPPORT NEEDED (TABLE 80 & 81) */}
          {activeTab === 'fin_needed' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Breakdown of Climate Financial Support Needed (Tables 80 & 81)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Official sectoral cost assessments for Mitigation ($196 Billion) and Adaptation ($50 Billion) under Article 9
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      Total Needed: $246 Billion USD
                    </span>
                  </div>
                </div>

                {/* Sector Breakdown Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {BTR_FINANCIAL_NEEDED_BREAKDOWN.map((sector, idx) => {
                    const isExpanded = expandedSector === sector.sector;
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border transition-all ${
                          sector.category === 'Mitigation' 
                            ? 'bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-400' 
                            : 'bg-sky-50/30 border-sky-200/80 hover:border-sky-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              sector.category === 'Mitigation' ? 'bg-emerald-200/70 text-emerald-900' : 'bg-sky-200/70 text-sky-900'
                            }`}>
                              {sector.category}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 mt-1">
                              {sector.sector}
                            </h5>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">
                              ${(sector.amountUSD / 1_000_000).toLocaleString()} M USD
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {(sector.amountEGP / 1_000_000_000).toFixed(2)} Billion EGP
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                          {sector.description}
                        </p>

                        {/* Project Sub-items */}
                        <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-200/60">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Key Project Components:
                          </div>
                          <div className="space-y-1">
                            {sector.keyProjects.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200/80 text-[11px]">
                                <span className="font-medium text-slate-800">{p.name}</span>
                                <span className="font-semibold text-slate-900">${(p.amountUSD / 1_000_000).toLocaleString()} M</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 text-[10px] text-slate-500 border-t border-slate-200/60 flex items-center justify-between">
                          <span><strong>Anchor:</strong> {sector.anchor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIAL SUPPORT RECEIVED (TABLE 82) */}
          {activeTab === 'fin_received' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Table 82: Breakdown of Received Financial Support (BTR Chapter 5.6)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Official documentation of disbursed climate finance from bilateral, multilateral, and green bond sources
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-44 focus:ring-1 focus:ring-[#0F3825] focus:outline-none"
                      />
                    </div>

                    <select
                      value={finReceivedFilter}
                      onChange={(e) => setFinReceivedFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F3825]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Mitigation">Mitigation</option>
                      <option value="Crosscutting">Cross-cutting</option>
                      <option value="Energy">Energy</option>
                      <option value="Transport">Transport</option>
                      <option value="Industry">Industry</option>
                      <option value="Agriculture">Agriculture & Water</option>
                    </select>
                  </div>
                </div>

                {/* Projects Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#E9ECE9] text-[#0F3825] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Project Title & Description</th>
                          <th className="p-3">Funding Channel</th>
                          <th className="p-3">Recipient & Implementing Entity</th>
                          <th className="p-3 text-right">Amount (USD)</th>
                          <th className="p-3">Instrument</th>
                          <th className="p-3">Support Type</th>
                          <th className="p-3">Timeframe & Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredReceived.map((proj) => (
                          <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-medium text-slate-900 max-w-xs">
                              <div className="font-bold text-slate-900">{proj.title}</div>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{proj.description}</p>
                            </td>
                            <td className="p-3 text-slate-700 text-[11px]">
                              {proj.channel}
                            </td>
                            <td className="p-3 text-[11px] text-slate-700 max-w-[200px]">
                              <div className="font-semibold text-slate-800">{proj.recipientEntity}</div>
                              <div className="text-slate-500">{proj.implementingEntity}</div>
                            </td>
                            <td className="p-3 text-right font-bold text-slate-900 whitespace-nowrap">
                              ${proj.amountUSD.toLocaleString()}
                              <div className="text-[10px] text-slate-500 font-normal">
                                {proj.amountOriginalStr}
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                                {proj.financialInstrument}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                proj.typeOfSupport === 'Mitigation' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {proj.typeOfSupport}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] text-slate-600 whitespace-nowrap">
                              <div>{proj.timeFrame}</div>
                              <span className="text-[10px] text-emerald-700 font-semibold">{proj.status} ({proj.statusOfActivity})</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TECHNOLOGY TRANSFER (TABLES 83 - 86) */}
          {activeTab === 'tech' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Endogenous Tech Priorities (Table 84) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#0F3825]" />
                    <span>Table 84: Priority Endogenous Technologies Needed (BTR Chapter 5.7.4)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Critical climate technologies prioritized for national manufacturing, licensing, and international transfer
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BTR_ENDOGENOUS_TECH_NEEDS.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                            {item.sector}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs mt-2">
                          {item.project}
                        </h5>
                        <div className="mt-2 text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-700 font-medium">
                          <strong className="text-slate-900">Tech: </strong>{item.technologyNeeded}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed pt-2 border-t border-slate-200/60">
                        {item.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Received Breakdown (Table 86) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Table 86: Technology Development & Transfer Support Received (BTR Chapter 5.8)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Operational projects transferring clean hardware, technical know-how, and smart grid automation
                  </p>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {BTR_TECH_RECEIVED_PROJECTS.map((proj, idx) => (
                    <div key={idx} className="p-4 bg-white hover:bg-slate-50 transition-colors space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {proj.title}
                        </h5>
                        <div className="flex items-center gap-2">
                          {proj.amountUSD && (
                            <span className="font-bold text-slate-900 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                              ${proj.amountUSD.toLocaleString()} USD
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                            {proj.channel}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs">{proj.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <strong className="text-slate-800">Transferred Technology: </strong>
                          <span className="text-slate-600">{proj.typeOfTechnology}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <strong className="text-slate-800">Outcome / Results: </strong>
                          <span className="text-slate-600">{proj.estimatedResults}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CAPACITY BUILDING (TABLES 87 & 88) */}
          {activeTab === 'capacity' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Capacity Needed (Table 87) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0F3825]" />
                    <span>Table 87: Specific Capacity-Building Support Needed (BTR Chapter 5.9)</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {BTR_CAPACITY_BUILDING_SUMMARY.needed.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="w-7 h-7 rounded-lg bg-[#D4E5DB] text-[#0F3825] flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">{item.category}</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity Received (Table 88) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Table 88: Key Capacity-Building Initiatives Received (BTR Chapter 5.11)</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BTR_CAPACITY_BUILDING_SUMMARY.received.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200 whitespace-nowrap">
                          {item.partner}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ARTICLE 13 & MRV SUPPORT (TABLES 89 & 90) */}
          {activeTab === 'article13' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0F3825]" />
                    <span>Support for Article 13 & National MRV System Operationalization (BTR Chapter 5.12)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Transparency-related assistance under the Enhanced Transparency Framework (ETF) of the Paris Agreement
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BTR_ARTICLE_13_SUPPORT.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.title}
                          </h5>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap ${
                            item.status.includes('Completed') ? 'bg-slate-200 text-slate-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap text-[11px] mt-2">
                          <span className="text-slate-500">Partner: <strong>{item.channel}</strong></span>
                          {item.amountUSD && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-emerald-800 font-semibold">Grant: {item.amountUSD}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {item.outputs && (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-slate-700 uppercase text-[10px] block">Key Outputs Delivered:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {item.outputs.map((out, oIdx) => (
                              <li key={oIdx}>{out}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                        <span>Recipient: {item.recipientEntity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ACTIVE TASK CTF COMMON TABULAR FORMAT */}
          {activeTab === 'task_ctf' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Institutional Header */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      National Climate MRV System • CTF Table Compilation
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {task.generalInfo.ministryName}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Sector: {task.generalInfo.sector} • Task ID: <span className="font-mono font-semibold">{task.id}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Status: {task.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Senior Compiler</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{task.generalInfo.compilerName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned Advisor</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{task.generalInfo.assignedAdvisor}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Total Financial Needed</span>
                    <div className="font-bold text-slate-900 mt-0.5">${taskTotalRequested.toLocaleString()} USD</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Total Financial Received</span>
                    <div className="font-bold text-emerald-800 mt-0.5">${taskTotalReceived.toLocaleString()} USD</div>
                  </div>
                </div>
              </div>

              {/* Form 1A CTF Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    1. Financial Support Needed (CTF Format)
                  </h5>
                  <span className="text-xs font-bold text-emerald-700">
                    Total: ${taskTotalRequested.toLocaleString()} USD
                  </span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#E9ECE9] text-[#0F3825] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Title of Activity / Project</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Instrument</th>
                        <th className="p-2.5 text-right">Amount (USD)</th>
                        <th className="p-2.5 text-right">Gap (USD)</th>
                        <th className="p-2.5">Urgency</th>
                        <th className="p-2.5">NDC Anchor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {task.financialNeeded.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900">{item.title}</td>
                          <td className="p-2.5">{item.supportType}</td>
                          <td className="p-2.5">{item.expectedFinancialInstrument}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">${(item.amountRequestedUSD || 0).toLocaleString()}</td>
                          <td className="p-2.5 text-right font-medium text-amber-800">${(item.estimatedGapUSD || 0).toLocaleString()}</td>
                          <td className="p-2.5 font-semibold">{item.urgency}</td>
                          <td className="p-2.5 text-[11px] text-slate-600">{item.strategyName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form 2A & 3A Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs">
                    2. Capacity Building Needed (Form 2A)
                  </h5>
                  <div className="space-y-2">
                    {task.capacityNeeded.map((cap) => (
                      <div key={cap.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900">{cap.activityTitle}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{cap.specificNeed}</p>
                        <div className="text-[10px] text-slate-500 mt-1">Target: {cap.targetStaffUnits} • Timeframe: {cap.expectedTimeFrame}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs">
                    3. Technology Support Needed (Form 3A)
                  </h5>
                  <div className="space-y-2">
                    {task.techNeeded.map((tech) => (
                      <div key={tech.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900">{tech.technologyType}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{tech.objective}</p>
                        <div className="text-[10px] text-slate-500 mt-1">Impact: {tech.expectedUseAndImpact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form 4 Open-Ended Summary */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">
                  4. Transparency Statement & Assumptions (Form 4)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-800 text-[11px] block">Assumptions Made:</strong>
                    <p className="text-slate-600 text-[11px] mt-1">{task.form4.assumptionsDescription || 'None specified'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-800 text-[11px] block">Sectoral Access Barriers:</strong>
                    <p className="text-slate-600 text-[11px] mt-1">{task.form4.barriersDescription || 'None specified'}</p>
                  </div>
                </div>
              </div>

              {/* Official Signoff */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <span>Official Submission Timestamp: </span>
                  <strong>{task.submissionDate || new Date().toISOString().slice(0, 19)}</strong>
                </div>
                <div>
                  <span>Compiled by: </span>
                  <strong>{task.generalInfo.compilerName} ({task.generalInfo.compilerTitle})</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Aligned with UNFCCC Decision 18/CMA.1 (Enhanced Transparency Framework)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Close Summary
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
