import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  GraduationCap, 
  Calendar, 
  X,
  Users,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info,
  Layers,
  Compass,
  FileText,
  AlertCircle
} from 'lucide-react';
import { CapacityBuildingSupportNeededItem, SupportType, UrgencyLevel } from '../types';
import { SUPPORT_TYPES, URGENCY_LEVELS } from '../data/initialData';

interface Form2AProps {
  items: CapacityBuildingSupportNeededItem[];
  sectorName: string;
  onAddItem: (item: CapacityBuildingSupportNeededItem) => void;
  onUpdateItem: (item: CapacityBuildingSupportNeededItem) => void;
  onDeleteItem: (id: string) => void;
  isReadOnly?: boolean;
}

export const Form2A_CapacityNeeded: React.FC<Form2AProps> = ({
  items,
  sectorName,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [ndcFilter, setNdcFilter] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CapacityBuildingSupportNeededItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetStaffUnits.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specificNeed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.strategyName && item.strategyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.expectedUseAndImpact && item.expectedUseAndImpact.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All' || item.supportType === typeFilter;
    const matchesUrgency = urgencyFilter === 'All' || item.urgency === urgencyFilter;
    const matchesNdc = ndcFilter === 'All' || item.anchoredInNDC === ndcFilter;
    return matchesSearch && matchesType && matchesUrgency && matchesNdc;
  });

  const handleOpenAdd = () => {
    const newItem: CapacityBuildingSupportNeededItem = {
      id: `CAP-NEED-${Date.now().toString().slice(-4)}`,
      activityTitle: '',
      targetStaffUnits: '',
      specificNeed: '',
      supportType: 'Crosscutting',
      expectedTimeFrame: '2026 - 2027',
      anchoredInNDC: 'Yes',
      strategyName: 'Egypt Climate Change Strategy 2050 / Enhanced Transparency Framework Readiness',
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

  const handleOpenEdit = (item: CapacityBuildingSupportNeededItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: CapacityBuildingSupportNeededItem) => {
    const duplicated: CapacityBuildingSupportNeededItem = {
      ...item,
      id: `CAP-NEED-${Date.now().toString().slice(-4)}`,
      activityTitle: `${item.activityTitle} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddItem(duplicated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (items.some((i) => i.id === editingItem.id)) {
      onUpdateItem({ ...editingItem, updatedAt: new Date().toISOString() });
    } else {
      onAddItem(editingItem);
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
                FORM 2A
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Capacity Building Support Needed
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Table of capacity-building, institutional strengthening, and training requests (11 Reporting Fields)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Total Requests</div>
              <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                {items.length} <span className="text-xs font-semibold text-slate-600">Activities</span>
              </div>
            </div>

            {!isReadOnly && (
              <button
                onClick={handleOpenAdd}
                id="btn-add-capacity-needed"
                className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>Add Capacity Request</span>
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
              placeholder="Search by activity, target units, specific need, or NDC strategy..."
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

            <div className="flex items-center gap-1.5 text-slate-600">
              <span>NDC Anchor:</span>
              <select
                value={ndcFilter}
                onChange={(e) => setNdcFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Yes">Anchored (Yes)</option>
                <option value="No">Unanchored (No)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Capacity Building Requests Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add Capacity Request" to identify institutional training requirements across all 11 standardized parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#E9ECE9] text-slate-700 font-bold border-y border-slate-300/80 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-bold">Activity / Programme / Project</th>
                  <th className="py-3 px-3 font-bold">Target Staff / Units</th>
                  <th className="py-3 px-3 font-bold">Type & Urgency</th>
                  <th className="py-3 px-3 font-bold">Expected Time Frame</th>
                  <th className="py-3 px-3 font-bold">NDC & Strategy Anchor</th>
                  <th className="py-3 px-3 font-bold">Specific Need & Expected Impact</th>
                  <th className="py-3 px-3 font-bold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {filteredItems.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        {/* Activity / Programme / Project */}
                        <td className="py-3.5 px-3 sm:px-4 max-w-sm">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleRowExpansion(item.id)}
                              className="mt-0.5 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0"
                              title={isExpanded ? "Collapse 11-field details" : "Expand all 11 fields"}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0F3825]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.activityTitle}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Target Staff / Units */}
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                            <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-xs">{item.targetStaffUnits}</span>
                          </div>
                        </td>

                        {/* Type & Urgency */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <div>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.supportType === 'Mitigation'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.supportType === 'Crosscutting'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {item.supportType}
                              </span>
                            </div>
                            <div>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                item.urgency === 'High'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : item.urgency === 'Medium'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {item.urgency} Urgency
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Expected Time Frame */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-800">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.expectedTimeFrame}</span>
                          </div>
                        </td>

                        {/* NDC / Strategy Anchor */}
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <div className="flex items-center gap-1 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.anchoredInNDC === 'Yes' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              NDC: {item.anchoredInNDC}
                            </span>
                          </div>
                          {item.strategyName && (
                            <div className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug font-medium" title={item.strategyName}>
                              {item.strategyName}
                            </div>
                          )}
                        </td>

                        {/* Specific Need & Expected Impact */}
                        <td className="py-3.5 px-3 max-w-sm">
                          <div className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                            <strong className="text-slate-900 font-semibold">Need: </strong>{item.specificNeed}
                          </div>
                          {item.expectedUseAndImpact && (
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                              <strong>Impact: </strong>{item.expectedUseAndImpact}
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

                      {/* Expandable 11-Field Detailed Card */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="p-4 sm:p-5">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F3825]" />
                                  Complete 11-Field Capacity Building Record • Form 2A
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {item.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                                {/* 1. Activity/Programme/Project */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Activity/Programme/Project</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block">{item.activityTitle}</span>
                                </div>

                                {/* 2. Target Staff / Units */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Target Staff / Units</span>
                                  <span className="font-semibold text-emerald-800 mt-0.5 block">{item.targetStaffUnits}</span>
                                </div>

                                {/* 3. Specific Need or Request */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Specific Need or Request</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.specificNeed}</span>
                                </div>

                                {/* 4. Type of support (Mitigation/Adaptation/Crosscutting) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Type of support (Mitigation/Adaptation/Crosscutting)</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.supportType}</span>
                                </div>

                                {/* 5. Expected Time Frame */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Expected Time Frame</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.expectedTimeFrame}</span>
                                </div>

                                {/* 8. Urgency (High/Medium/Low) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Urgency (High/Medium/Low)</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.urgency}</span>
                                </div>

                                {/* 6. Whether the activity is anchored in a national strategy and/or an NDC (Yes/No) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Anchored in National Strategy / NDC (Yes/No)</span>
                                  <span className="font-bold text-emerald-800 mt-0.5 block">{item.anchoredInNDC}</span>
                                </div>

                                {/* 7. If anchored, exact name */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">7. National Strategy / Action Plan Exact Name</span>
                                  <span className="text-slate-800 mt-0.5 block font-medium">{item.strategyName || 'Not specified'}</span>
                                </div>

                                {/* 9. Expected use, impact and estimated results */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">9. Expected use, impact and estimated results</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.expectedUseAndImpact || 'N/A'}</span>
                                </div>

                                {/* 10. Methodologies / Assumptions */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 md:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">10. Methodologies / Assumptions</span>
                                  <span className="text-slate-700 mt-0.5 block leading-relaxed">{item.methodologiesAndAssumptions || 'N/A'}</span>
                                </div>

                                {/* 11. Additional Information */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">11. Additional Information</span>
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

      {/* Add / Edit Modal with all 11 Fields strictly matching the template image */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#0F3825] text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 text-emerald-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D4E5DB] text-[#0F3825] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Form 2A
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {editingItem.activityTitle ? 'Edit Capacity Building Request' : 'Add New Capacity Needed Request'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Enter the 11 standardized reporting parameters according to UNFCCC BTR Chapter 5 & Paris Agreement Article 11
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

            {/* Modal Form Body - 11 Fields Grouped Logically */}
            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-[#F9FAF9] flex-1">
              
              {/* Section 1: Activity & Target Beneficiary Units (Fields 1 & 2) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Activity Identification & Target Units (Fields 1 – 2)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Activity/Programme/Project */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      1. Activity/Programme/Project <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.activityTitle}
                      onChange={(e) => setEditingItem({ ...editingItem, activityTitle: e.target.value })}
                      placeholder="e.g. Advanced Digital MRV System & Facility-Level Carbon Accounting Certification"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 2: Target Staff / Units */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      2. Target Staff / Units <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.targetStaffUnits}
                      onChange={(e) => setEditingItem({ ...editingItem, targetStaffUnits: e.target.value })}
                      placeholder="e.g. Central Department for Climate Change & Planning, EEHC Environmental Inspectors, EETC Dispatch Engineers (approx. 45 engineers)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Specific Need, Support Type & Timeframe (Fields 3, 4, 5, 8) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Specific Need, Support Type, Timeframe & Urgency (Fields 3, 4, 5, 8)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 3: Specific Need or Request */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      3. Specific Need or Request <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.specificNeed}
                      onChange={(e) => setEditingItem({ ...editingItem, specificNeed: e.target.value })}
                      placeholder="Describe the precise institutional capacity gap, training scope, or technical assistance request..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs leading-relaxed"
                    />
                  </div>

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

                  {/* Field 5: Expected Time Frame */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      5. Expected Time Frame <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.expectedTimeFrame}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedTimeFrame: e.target.value })}
                      placeholder="e.g. 2026 - 2027 (18 months)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 8: Urgency (High/Medium/Low) */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      8. Urgency (High/Medium/Low) <span className="text-rose-500">*</span>
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

              {/* Section 3: National Alignment & Strategy (Fields 6 & 7) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>National Strategy & NDC Alignment (Fields 6 – 7)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 6: Whether the activity is anchored in a national strategy and/or an NDC (Yes/No) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      6. Whether the activity is anchored in a national strategy and/or an NDC (Yes/No) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="anchoredInNDC"
                          value="Yes"
                          checked={editingItem.anchoredInNDC === 'Yes'}
                          onChange={() => setEditingItem({ ...editingItem, anchoredInNDC: 'Yes' })}
                          className="text-[#0F3825] focus:ring-[#0F3825]"
                        />
                        <span className="font-semibold text-slate-800 text-xs">Yes (Anchored)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="anchoredInNDC"
                          value="No"
                          checked={editingItem.anchoredInNDC === 'No'}
                          onChange={() => setEditingItem({ ...editingItem, anchoredInNDC: 'No' })}
                          className="text-[#0F3825] focus:ring-[#0F3825]"
                        />
                        <span className="font-medium text-slate-600 text-xs">No (Unanchored)</span>
                      </label>
                    </div>
                  </div>

                  {/* Field 7: If the activity is anchored in a national strategy/action plan please mention its exact name */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      7. If anchored in national strategy/action plan, exact name
                    </label>
                    <input
                      type="text"
                      value={editingItem.strategyName}
                      onChange={(e) => setEditingItem({ ...editingItem, strategyName: e.target.value })}
                      placeholder="e.g. Enhanced Transparency Framework (ETF) National Readiness Plan / NDC 2030"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Expected Impact, Methodologies & Additional Context (Fields 9, 10, 11) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Expected Impact, Methodologies & Additional Info (Fields 9 – 11)</span>
                </div>

                <div className="space-y-4">
                  {/* Field 9: Expected use, impact and estimated results */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      9. Expected use, impact and estimated results <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.expectedUseAndImpact}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedUseAndImpact: e.target.value })}
                      placeholder="Explain quantitative institutional benefits, reduced data lag, compliant reporting, enhanced governance..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs leading-relaxed"
                    />
                  </div>

                  {/* Field 10: Methodologies/Assumptions */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      10. Methodologies/Assumptions
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.methodologiesAndAssumptions}
                      onChange={(e) => setEditingItem({ ...editingItem, methodologiesAndAssumptions: e.target.value })}
                      placeholder="e.g. Based on 2006 IPCC Guidelines, UNFCCC Training Program for technical experts, or ISO 14064 standards..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 11: Additional Information */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      11. Additional Information
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.additionalInformation}
                      onChange={(e) => setEditingItem({ ...editingItem, additionalInformation: e.target.value })}
                      placeholder="Provide any co-funding considerations, bilateral partners, previous phases, or prerequisites..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 bg-white p-3 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  {editingItem.activityTitle ? 'Update Capacity Request' : 'Save Capacity Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
