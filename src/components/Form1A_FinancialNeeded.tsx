import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Calendar,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { FinancialSupportNeededItem, SupportType, FinancialInstrument, UrgencyLevel } from '../types';
import { FINANCIAL_INSTRUMENTS, SUPPORT_TYPES, URGENCY_LEVELS } from '../data/initialData';

interface Form1AProps {
  items: FinancialSupportNeededItem[];
  sectorName: string;
  onAddItem: (item: FinancialSupportNeededItem) => void;
  onUpdateItem: (item: FinancialSupportNeededItem) => void;
  onDeleteItem: (id: string) => void;
  isReadOnly?: boolean;
}

export const Form1A_FinancialNeeded: React.FC<Form1AProps> = ({
  items,
  sectorName,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'EGP'>('USD');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FinancialSupportNeededItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Exchange rate conversion (1 USD = 50.4094 EGP)
  const EGP_RATE = 50.4094;

  // Filtered Items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.strategyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.specificNeed && item.specificNeed.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All' || item.supportType === typeFilter;
    const matchesUrgency = urgencyFilter === 'All' || item.urgency === urgencyFilter;
    return matchesSearch && matchesType && matchesUrgency;
  });

  const totalAmountUSD = items.reduce((sum, item) => sum + (item.amountRequestedUSD || 0), 0);
  const totalGapUSD = items.reduce((sum, item) => sum + (item.estimatedGapUSD || 0), 0);

  const formatAmount = (usdVal: number) => {
    if (currencyMode === 'EGP') {
      return (usdVal * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const handleOpenAdd = () => {
    const newItem: FinancialSupportNeededItem = {
      id: `FIN-NEED-${Date.now().toString().slice(-4)}`,
      title: '',
      description: '',
      specificNeed: '',
      amountRequestedUSD: 0,
      expectedTimeFrame: '2026 - 2029',
      expectedFinancialInstrument: 'Concessional Loan',
      supportType: 'Mitigation',
      estimatedGapUSD: 0,
      anchoredInNDC: 'Yes',
      strategyName: 'Egypt Updated Nationally Determined Contributions (NDC 2030)',
      urgency: 'High',
      expectedUseAndImpact: '',
      methodologiesAndAssumptions: '',
      additionalInformation: '',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FinancialSupportNeededItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: FinancialSupportNeededItem) => {
    const duplicated: FinancialSupportNeededItem = {
      ...item,
      id: `FIN-NEED-${Date.now().toString().slice(-4)}`,
      title: `${item.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddItem(duplicated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const exists = items.some((i) => i.id === editingItem.id);
    if (exists) {
      onUpdateItem({ ...editingItem, updatedAt: new Date().toISOString() });
    } else {
      onAddItem({ ...editingItem, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
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
                FORM 1A
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Financial Support Needed
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Table of financial requirements anchored in NDC & National Climate Strategies (14 Reporting Fields)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Total Requested</div>
              <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                {formatAmount(totalAmountUSD)} <span className="text-xs font-semibold text-slate-600">{currencyMode}</span>
              </div>
              <div className="text-[10px] text-amber-700 font-mono">
                Gap: {formatAmount(totalGapUSD)} {currencyMode}
              </div>
            </div>

            {!isReadOnly && (
              <button
                onClick={handleOpenAdd}
                id="btn-add-financial-request"
                className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>Add Financial Request</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, description, need, strategy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3825] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
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

            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Urgency:</span>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
              >
                <option value="All">All Urgencies</option>
                {URGENCY_LEVELS.map((u) => (
                  <option key={u} value={u}>{u}</option>
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

        {/* Data Table */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Financial Requests Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add Financial Request" to record a new climate funding requirement with all 14 standardized attributes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#E9ECE9] text-slate-700 font-bold border-y border-slate-300/80 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-bold">Activity / Programme / Project</th>
                  <th className="py-3 px-3 font-bold">Type & Instrument</th>
                  <th className="py-3 px-3 font-bold">Amount Requested</th>
                  <th className="py-3 px-3 font-bold">Estimated Gap</th>
                  <th className="py-3 px-3 font-bold">Urgency</th>
                  <th className="py-3 px-3 font-bold">NDC / Strategy Anchor</th>
                  <th className="py-3 px-3 font-bold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {filteredItems.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        {/* Title & Description & Timeframe */}
                        <td className="py-3.5 px-3 sm:px-4 max-w-sm sm:max-w-md">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleRowExpansion(item.id)}
                              className="mt-0.5 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                              title={isExpanded ? "Collapse 14-field details" : "Expand all 14 fields"}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0F3825]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                {item.description}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2 font-normal">
                                <span className="flex items-center gap-1 text-slate-600 font-medium">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {item.expectedTimeFrame}
                                </span>
                                {item.specificNeed && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[200px]" title={item.specificNeed}>
                                      <strong>Need:</strong> {item.specificNeed}
                                    </span>
                                  </>
                                )}
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
                              {item.expectedFinancialInstrument}
                            </div>
                          </div>
                        </td>

                        {/* Amount Requested */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-bold font-mono text-slate-900 text-xs sm:text-sm">
                            {formatAmount(item.amountRequestedUSD || 0)}
                            <span className="text-[10px] font-normal text-slate-500 ml-1">{currencyMode}</span>
                          </div>
                        </td>

                        {/* Estimated Gap */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-bold font-mono text-amber-700 text-xs sm:text-sm">
                            {formatAmount(item.estimatedGapUSD || 0)}
                            <span className="text-[10px] font-semibold text-slate-500 ml-1">GAP</span>
                          </div>
                        </td>

                        {/* Urgency */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.urgency === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : item.urgency === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.urgency}
                          </span>
                        </td>

                        {/* NDC / Strategy Anchor */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[#0F3825] text-xs">
                            {item.anchoredInNDC === 'Yes' ? 'Anchored (Yes)' : 'No'}
                          </div>
                          {item.strategyName && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5" title={item.strategyName}>
                              {item.strategyName}
                            </div>
                          )}
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
                                  title="Duplicate Request"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteItem(item.id)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                                  title="Delete Request"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable 14-Field Full CTF View */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="p-4 sm:p-5">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F3825]" />
                                  Complete 14-Field Reporting Record • Form 1A
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

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Specific Need or Request</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.specificNeed || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Amount Requested in USD</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                                    ${(item.amountRequestedUSD || 0).toLocaleString()} USD
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Expected Time Frame for the Activity</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.expectedTimeFrame}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Expected Financial Instrument</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.expectedFinancialInstrument}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Type of support (Mitigation/Adaptation/Crosscutting)</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.supportType}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Estimated Gap</span>
                                  <span className="font-bold text-amber-700 mt-0.5 block font-mono">
                                    ${(item.estimatedGapUSD || 0).toLocaleString()} USD
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">9. Whether anchored in national strategy/NDC</span>
                                  <span className="font-semibold text-emerald-800 mt-0.5 block">{item.anchoredInNDC}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">10. Exact name of national strategy/action plan</span>
                                  <span className="text-slate-800 mt-0.5 block">{item.strategyName || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">11. Urgency (High/Medium/Low)</span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">{item.urgency}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">12. Expected use, impact and estimated results</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.expectedUseAndImpact || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">13. Methodologies/Assumptions</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.methodologiesAndAssumptions || 'N/A'}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">14. Additional Information</span>
                                  <span className="text-slate-700 mt-0.5 block">{item.additionalInformation || 'N/A'}</span>
                                </div>
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

      {/* Add / Edit Modal with all 14 Fields matching the exact template */}
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
                      Form 1A
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {editingItem.title ? 'Edit Financial Support Needed Record' : 'Add New Financial Support Needed Request'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Enter the 14 standardized reporting parameters according to UNFCCC BTR Chapter 5 & Paris Agreement Article 9
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

            {/* Modal Body - 14 Form Fields */}
            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-[#F9FAF9] flex-1">
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Activity & Scope Identification (Fields 1 – 3)</span>
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
                      placeholder="e.g. Smart Grid Modernization & High-Voltage Renewable Infeed Integration"
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

                  {/* Field 3: Specific Need or Request */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      3. Specific Need or Request <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.specificNeed}
                      onChange={(e) => setEditingItem({ ...editingItem, specificNeed: e.target.value })}
                      placeholder="Specify exact funding requirements (concessional co-financing, capital grant, credit guarantee, technical assistance, feasibility studies)..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Financial Quantities, Instrument & Timeline (Fields 4 – 8)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Field 4: Amount Requested in USD */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      4. Amount Requested in USD <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="any"
                        value={editingItem.amountRequestedUSD || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, amountRequestedUSD: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold font-mono focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      ≈ {((editingItem.amountRequestedUSD || 0) * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP
                    </div>
                  </div>

                  {/* Field 5: Expected Time Frame for the Activity */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      5. Expected Time Frame for the Activity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.expectedTimeFrame}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedTimeFrame: e.target.value })}
                      placeholder="e.g. 2026 - 2029"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 6: Expected Financial Instrument */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      6. Expected Financial Instrument <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.expectedFinancialInstrument}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedFinancialInstrument: e.target.value as FinancialInstrument })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {FINANCIAL_INSTRUMENTS.map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 7: Type of support (Mitigation/Adaptation/Crosscutting) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      7. Type of support (Mitigation/Adaptation/Crosscutting) <span className="text-rose-500">*</span>
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

                  {/* Field 8: Estimated Gap */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      8. Estimated Gap in USD <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editingItem.estimatedGapUSD || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, estimatedGapUSD: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-amber-900 font-bold font-mono focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                      />
                    </div>
                    <div className="text-[10px] text-amber-700 mt-1 font-mono">
                      ≈ {((editingItem.estimatedGapUSD || 0) * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP
                    </div>
                  </div>

                  {/* Field 11: Urgency (High/Medium/Low) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      11. Urgency (High/Medium/Low) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.urgency}
                      onChange={(e) => setEditingItem({ ...editingItem, urgency: e.target.value as UrgencyLevel })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {URGENCY_LEVELS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-sky-700" />
                  <span>Strategic Anchoring & NDC Alignment (Fields 9 – 10)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Field 9: Whether the activity is anchored in a national strategy and/or an NDC (Yes/No) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      9. Anchored in national strategy / NDC (Yes/No) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.anchoredInNDC}
                      onChange={(e) => setEditingItem({ ...editingItem, anchoredInNDC: e.target.value as 'Yes' | 'No' })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Field 10: If anchored, mention exact name */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      10. If anchored, exact name of national strategy / action plan
                    </label>
                    <input
                      type="text"
                      value={editingItem.strategyName}
                      onChange={(e) => setEditingItem({ ...editingItem, strategyName: e.target.value })}
                      placeholder="e.g. Egypt Updated NDC (2030 Electricity Target: 37% GHG reduction below BAU) / NCCS 2050 Goal 1"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Impact, Methodologies & Additional Context (Fields 12 – 14)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 12: Expected use, impact and estimated results */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      12. Expected use, impact and estimated results <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.expectedUseAndImpact}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedUseAndImpact: e.target.value })}
                      placeholder="Specify quantitative GHG reductions (Gg CO2e/year), MW renewable capacity, efficiency gains, beneficiaries, or resilience improvements..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 13: Methodologies/Assumptions */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      13. Methodologies/Assumptions
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.methodologiesAndAssumptions}
                      onChange={(e) => setEditingItem({ ...editingItem, methodologiesAndAssumptions: e.target.value })}
                      placeholder="e.g. Grid baseline emission factor 0.468 kg CO2/kWh; IPCC Tier 2 / LEAP energy system model; CAPEX from EETC master plan..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 14: Additional Information */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      14. Additional Information
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.additionalInformation}
                      onChange={(e) => setEditingItem({ ...editingItem, additionalInformation: e.target.value })}
                      placeholder="e.g. Feasibility study completed with KfW/AfDB; Coordinated with Sovereign Fund of Egypt; Environmental impact assessment approved..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <span className="text-rose-500 font-bold">*</span> Required reporting fields under UNFCCC Decision 18/CMA.1
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white rounded-lg font-bold shadow-xs transition-colors"
                  >
                    Save Financial Request
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
