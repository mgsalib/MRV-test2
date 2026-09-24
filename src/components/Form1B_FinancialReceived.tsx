import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Calendar, 
  X,
  Building,
  ChevronDown,
  ChevronUp,
  Copy,
  FileSpreadsheet,
  Info,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  PieChart
} from 'lucide-react';
import { 
  FinancialSupportReceivedItem, 
  SupportType, 
  FinancialInstrument, 
  FinanceStatus, 
  ActivityStatus, 
  ExpenseDetailItem 
} from '../types';
import { FINANCIAL_INSTRUMENTS, SUPPORT_TYPES, FINANCIAL_STATUSES, ACTIVITY_STATUSES } from '../data/initialData';
import { ExpenseBreakdownManager } from './ExpenseBreakdownManager';

interface Form1BProps {
  items: FinancialSupportReceivedItem[];
  sectorName: string;
  onAddItem: (item: FinancialSupportReceivedItem) => void;
  onUpdateItem: (item: FinancialSupportReceivedItem) => void;
  onDeleteItem: (id: string) => void;
  isReadOnly?: boolean;
}

export const Form1B_FinancialReceived: React.FC<Form1BProps> = ({
  items,
  sectorName,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'EGP'>('USD');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FinancialSupportReceivedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Exchange rate conversion (1 USD = 50.4094 EGP)
  const EGP_RATE = 50.4094;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fundingSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.useImpactAndResults && item.useImpactAndResults.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || item.statusOfFinance === statusFilter;
    const matchesType = typeFilter === 'All' || item.supportType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalReceivedUSD = items.reduce((sum, item) => sum + (item.amountReceivedUSD || 0), 0);
  const totalSpentUSD = items.reduce((sum, item) => sum + (item.amountSpentUSD || 0), 0);
  const totalRemainingUSD = totalReceivedUSD - totalSpentUSD;

  const formatAmount = (usdVal: number) => {
    if (currencyMode === 'EGP') {
      return (usdVal * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return (usdVal || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const handleOpenAdd = () => {
    const newItem: FinancialSupportReceivedItem = {
      id: `FIN-REC-${Date.now().toString().slice(-4)}`,
      title: '',
      description: '',
      fundingSource: 'Green Climate Fund (GCF) / Bilateral Facility',
      supportType: 'Mitigation',
      amountReceivedUSD: 0,
      amountSpentUSD: 0,
      remainingFundsUSD: 0,
      disbursementDate: new Date().toISOString().split('T')[0],
      purpose: '',
      financialInstrument: 'Concessional Loan',
      statusOfFinance: 'Disbursed',
      progressPercent: 50,
      timeFrame: '2024 - 2027',
      startDate: '2024-01-01',
      endDate: '2027-12-31',
      activityStatus: 'Ongoing',
      useImpactAndResults: '',
      additionalInformation: '',
      expenses: [],
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FinancialSupportReceivedItem) => {
    setEditingItem({ ...item, expenses: item.expenses || [] });
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: FinancialSupportReceivedItem) => {
    const duplicated: FinancialSupportReceivedItem = {
      ...item,
      id: `FIN-REC-${Date.now().toString().slice(-4)}`,
      title: `${item.title} (Copy)`,
      expenses: item.expenses ? [...item.expenses] : [],
    };
    onAddItem(duplicated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const remaining = (editingItem.amountReceivedUSD || 0) - (editingItem.amountSpentUSD || 0);
    const itemToSave: FinancialSupportReceivedItem = { ...editingItem, remainingFundsUSD: remaining };

    if (items.some((i) => i.id === editingItem.id)) {
      onUpdateItem(itemToSave);
    } else {
      onAddItem(itemToSave);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Subheader Container Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0F3825] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                FORM 1B
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Financial Support Received
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Table of disbursed climate finance inflows, utilization, and co-financing tracking (18 Reporting Fields)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Total Received</div>
              <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                {formatAmount(totalReceivedUSD)} <span className="text-xs font-semibold text-slate-600">{currencyMode}</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-mono">
                Spent: {formatAmount(totalSpentUSD)} {currencyMode} | Remaining: {formatAmount(totalRemainingUSD)} {currencyMode}
              </div>
            </div>

            <button
              onClick={handleOpenAdd}
              id="btn-add-financial-received"
              className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>Add Financial Record</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, funding source, purpose, or impact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3825] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Finance Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                {FINANCIAL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
              >
                <option value="All">All Types</option>
                {SUPPORT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-slate-200/80 rounded-md p-0.5 text-[11px] font-semibold">
              <button
                onClick={() => setCurrencyMode('USD')}
                className={`px-2 py-0.5 rounded transition-all ${currencyMode === 'USD' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrencyMode('EGP')}
                className={`px-2 py-0.5 rounded transition-all ${currencyMode === 'EGP' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                EGP
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Received Finance Records Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add Financial Record" to document climate finance inflows with all 18 standardized reporting attributes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#E9ECE9] text-slate-700 font-bold border-y border-slate-300/80 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-bold">Activity / Programme & Source</th>
                  <th className="py-3 px-3 font-bold">Type & Instrument</th>
                  <th className="py-3 px-3 font-bold">Received (USD)</th>
                  <th className="py-3 px-3 font-bold">Spent / Remaining</th>
                  <th className="py-3 px-3 font-bold">Finance Status</th>
                  <th className="py-3 px-3 font-bold">Activity Status & Progress</th>
                  <th className="py-3 px-3 font-bold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {filteredItems.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  const remaining = (item.amountReceivedUSD || 0) - (item.amountSpentUSD || 0);
                  const utilizationPct = Math.round(((item.amountSpentUSD || 0) / (item.amountReceivedUSD || 1)) * 100);

                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        {/* Title & Funding Provider */}
                        <td className="py-3.5 px-3 sm:px-4 max-w-sm sm:max-w-md">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleRowExpansion(item.id)}
                              className="mt-0.5 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                              title={isExpanded ? "Collapse 18-field details" : "Expand all 18 fields"}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0F3825]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-emerald-800 font-medium mt-0.5 flex items-center gap-1">
                                <Building className="w-3 h-3 text-emerald-600" />
                                <span>{item.fundingSource}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                                <strong>Purpose:</strong> {item.purpose}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Type & Instrument */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                              item.supportType === 'Mitigation'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.supportType === 'Crosscutting'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {item.supportType}
                            </span>
                            <div className="text-slate-600 text-[11px]">
                              {item.financialInstrument}
                            </div>
                          </div>
                        </td>

                        {/* Amount Received */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-bold font-mono text-slate-900 text-xs sm:text-sm">
                            {formatAmount(item.amountReceivedUSD || 0)}
                            <span className="text-[10px] font-normal text-slate-500 ml-1">{currencyMode}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Disbursed: {item.disbursementDate || 'N/A'}
                          </div>
                        </td>

                        {/* Spent / Remaining */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-semibold font-mono text-slate-700 text-xs">
                            Spent: {formatAmount(item.amountSpentUSD || 0)} {currencyMode}
                            <span className="text-[10px] text-slate-500 ml-1">({utilizationPct}%)</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-mono font-medium mt-0.5">
                            Rem: {formatAmount(remaining)} {currencyMode}
                          </div>
                          {item.expenses && item.expenses.length > 0 ? (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleRowExpansion(item.id); }}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors"
                              title="Click to view itemized expense receipts and contracts"
                            >
                              <span>{item.expenses.length} Expenses Logged</span>
                              <ChevronDown className="w-2.5 h-2.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-700 underline decoration-dotted"
                            >
                              + Itemize expenses
                            </button>
                          )}
                        </td>

                        {/* Finance Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.statusOfFinance === 'Disbursed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.statusOfFinance === 'Committed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.statusOfFinance}
                          </span>
                        </td>

                        {/* Activity Status & Progress */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                            <span className={`w-2 h-2 rounded-full ${
                              item.activityStatus === 'Completed' ? 'bg-emerald-500' :
                              item.activityStatus === 'Ongoing' ? 'bg-blue-500' : 'bg-slate-400'
                            }`} />
                            <span>{item.activityStatus}</span>
                            <span className="text-slate-400 font-mono text-[10px] ml-1">({item.progressPercent || 0}%)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-2.5 h-2.5 text-slate-400" />
                            <span>{item.timeFrame}</span>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Edit Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleDuplicate(item)}
                                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                                  title="Duplicate Record"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteItem(item.id)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable 18-Field Full View */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="p-4 sm:p-5">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F3825]" />
                                  Complete 18-Field Reporting Record • Form 1B
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {item.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Title of Activity/Programme/Project</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.title}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Programme/Project Description</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.description}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Funding Source (e.g., Treasury, Grants "Specify")</span>
                                  <span className="font-semibold text-emerald-800 mt-0.5 block">{item.fundingSource}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Type of support (Mitigation/Adaptation/Crosscutting)</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.supportType}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Amount Received in USD</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                                    ${(item.amountReceivedUSD || 0).toLocaleString()} USD
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Amount Spent in USD</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                                    ${(item.amountSpentUSD || 0).toLocaleString()} USD ({utilizationPct}%)
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Remaining Funds in USD</span>
                                  <span className="font-bold text-emerald-700 mt-0.5 block font-mono">
                                    ${remaining.toLocaleString()} USD
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Disbursement Date</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.disbursementDate || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">9. Purpose / Activity Supported</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.purpose}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">10. Financial Instrument</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.financialInstrument}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">11. Status of Finance (Committed/Disbursed)</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.statusOfFinance}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">12. Progress (%)</span>
                                  <span className="font-bold text-slate-800 mt-0.5 block">{item.progressPercent || 0}%</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">13. Time Frame</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.timeFrame}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">14. Start Date</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.startDate || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">15. End Date</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.endDate || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">16. Status of the Activity</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.activityStatus}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">17. Use, Impact and Estimated Results</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.useImpactAndResults || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">18. Additional Information</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.additionalInformation || 'N/A'}</span>
                                </div>
                              </div>

                              {/* Detailed Expense Line Items & Spending Breakdown */}
                              <div className="pt-3 border-t border-slate-200">
                                <ExpenseBreakdownManager
                                  amountReceivedUSD={item.amountReceivedUSD || 0}
                                  amountSpentUSD={item.amountSpentUSD || 0}
                                  expenses={item.expenses || []}
                                  currencyMode={currencyMode}
                                  isReadOnly={isReadOnly}
                                  onUpdateExpenses={(newExpenses, newSpentTotal) => {
                                    const remainingFunds = (item.amountReceivedUSD || 0) - newSpentTotal;
                                    onUpdateItem({
                                      ...item,
                                      expenses: newExpenses,
                                      amountSpentUSD: newSpentTotal,
                                      remainingFundsUSD: remainingFunds,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal with all 18 Fields exactly matching the template */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#0F3825] text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 text-emerald-300">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D4E5DB] text-[#0F3825] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Form 1B
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {editingItem.title ? 'Edit Financial Support Received Record' : 'Add New Financial Received Request'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Enter the 18 standardized reporting parameters according to UNFCCC BTR Chapter 5 & Paris Agreement Article 9.7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 18 Form Fields Organized by Group */}
            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-[#F9FAF9] flex-1">
              
              {/* Section 1: Activity & Scope Identification (Fields 1 - 3) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Activity & Source Identification (Fields 1 – 3)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Title of Activity/Programme/Project */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      1. Title of Activity/Programme/Project <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="e.g. Benban Solar Park Transmission Infrastructure Phase 2"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 2: Programme/Project Description */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      2. Programme/Project Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Provide comprehensive overview of scope, objectives, technical interventions, and infrastructure components..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 3: Funding Source */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      3. Funding Source (e.g., Treasury, Grants "Specify Donor", Loans "Specify Lender", Self-financing) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.fundingSource}
                      onChange={(e) => setEditingItem({ ...editingItem, fundingSource: e.target.value })}
                      placeholder="e.g. EBRD / Green Climate Fund (GCF) Concessional Facility, National Treasury, EU Grant"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Support Classification, Purpose & Instrument (Fields 4, 9, 10) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Support Classification, Instrument & Purpose (Fields 4, 9, 10)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 4: Type of support */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      4. Type of support (Mitigation/Adaptation/Crosscutting) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.supportType}
                      onChange={(e) => setEditingItem({ ...editingItem, supportType: e.target.value as SupportType })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {SUPPORT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 10: Financial Instrument */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      10. Financial Instrument <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.financialInstrument}
                      onChange={(e) => setEditingItem({ ...editingItem, financialInstrument: e.target.value as FinancialInstrument })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {FINANCIAL_INSTRUMENTS.map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 9: Purpose / Activity Supported */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      9. Purpose / Activity Supported <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.purpose}
                      onChange={(e) => setEditingItem({ ...editingItem, purpose: e.target.value })}
                      placeholder="Specify the operational purpose, dedicated outputs, and specific climate actions financed..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Financial Quantities, Utilization & Disbursement (Fields 5, 6, 7, 8, 11 + Detailed Expenses) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Financial Quantities, Utilization & Disbursement (Fields 5 – 8, 11)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Exchange: 1 USD = {EGP_RATE} EGP
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Field 5: Amount Received in USD */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      5. Amount Received in USD <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="any"
                        value={editingItem.amountReceivedUSD || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, amountReceivedUSD: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold font-mono focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      ≈ {((editingItem.amountReceivedUSD || 0) * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP
                    </div>
                  </div>

                  {/* Field 6: Amount Spent in USD */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      6. Amount Spent in USD <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="any"
                        value={editingItem.amountSpentUSD || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, amountSpentUSD: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold font-mono focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono flex items-center justify-between">
                      <span>Utilization: {Math.round(((editingItem.amountSpentUSD || 0) / (editingItem.amountReceivedUSD || 1)) * 100)}%</span>
                      {editingItem.expenses && editingItem.expenses.length > 0 && (
                        <span className="text-emerald-700 font-semibold">({editingItem.expenses.length} itemized)</span>
                      )}
                    </div>
                  </div>

                  {/* Field 7: Remaining Funds in USD */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      7. Remaining Funds in USD (Auto-calculated)
                    </label>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-emerald-800 font-mono text-sm">
                        ${((editingItem.amountReceivedUSD || 0) - (editingItem.amountSpentUSD || 0)).toLocaleString()} USD
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        ≈ {(((editingItem.amountReceivedUSD || 0) - (editingItem.amountSpentUSD || 0)) * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP
                      </div>
                    </div>
                  </div>

                  {/* Field 8: Disbursement Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      8. Disbursement Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.disbursementDate}
                      onChange={(e) => setEditingItem({ ...editingItem, disbursementDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 11: Status of Finance */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      11. Status of Finance (Committed/Disbursed/Ongoing/Implemented) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.statusOfFinance}
                      onChange={(e) => setEditingItem({ ...editingItem, statusOfFinance: e.target.value as FinanceStatus })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {FINANCIAL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Embedded Itemized Expense Breakdown Manager */}
                <div className="pt-3 border-t border-slate-100">
                  <ExpenseBreakdownManager
                    amountReceivedUSD={editingItem.amountReceivedUSD || 0}
                    amountSpentUSD={editingItem.amountSpentUSD || 0}
                    expenses={editingItem.expenses || []}
                    currencyMode={currencyMode}
                    onUpdateExpenses={(newExpenses, newSpentTotal) => {
                      setEditingItem({
                        ...editingItem,
                        expenses: newExpenses,
                        amountSpentUSD: newSpentTotal,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Section 4: Implementation Timeline & Activity Status (Fields 12 - 16) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Timeline & Execution Status (Fields 12 – 16)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Field 12: Progress (%) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      12. Progress (%) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={editingItem.progressPercent || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, progressPercent: parseInt(e.target.value) || 0 })}
                        className="w-20 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold font-mono focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingItem.progressPercent || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, progressPercent: parseInt(e.target.value) || 0 })}
                        className="flex-1 accent-[#0F3825]"
                      />
                    </div>
                  </div>

                  {/* Field 13: Time Frame */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      13. Time Frame <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.timeFrame}
                      onChange={(e) => setEditingItem({ ...editingItem, timeFrame: e.target.value })}
                      placeholder="e.g. 2024 - 2027"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 14: Start Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      14. Start Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.startDate}
                      onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 15: End Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      15. End Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.endDate}
                      onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 16: Status of the Activity */}
                  <div className="lg:col-span-4">
                    <label className="block font-bold text-slate-800 mb-1">
                      16. Status of the Activity (Planned / Ongoing / Completed) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.activityStatus}
                      onChange={(e) => setEditingItem({ ...editingItem, activityStatus: e.target.value as ActivityStatus })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {ACTIVITY_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Impact & Additional Information (Fields 17 - 18) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Impact, Quantitative Results & Additional Context (Fields 17 – 18)</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Field 17: Use, Impact and Estimated Results */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      17. Use, Impact and Estimated Results (Quantitative Benefits, avoided emissions, MWh clean generation) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.useImpactAndResults}
                      onChange={(e) => setEditingItem({ ...editingItem, useImpactAndResults: e.target.value })}
                      placeholder="e.g. Enabled total generation of 3,800 GWh clean electricity in 2025, avoiding 1,780 Gg CO2e annual greenhouse gas emissions."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 18: Additional Information */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      18. Additional Information (Auditing status, MRV institutional ties, co-financing partners)
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.additionalInformation}
                      onChange={(e) => setEditingItem({ ...editingItem, additionalInformation: e.target.value })}
                      placeholder="e.g. Final verification audit scheduled with external engineering consultant in Q4 2026."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="text-rose-500 font-bold">*</span>
                  <span>Required standard fields</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Financial Record</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
