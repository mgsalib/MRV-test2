import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Cpu, 
  Calendar, 
  X,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { TechnologicalSupportNeededItem, SupportType, UrgencyLevel } from '../types';
import { SUPPORT_TYPES, URGENCY_LEVELS } from '../data/initialData';

interface Form3AProps {
  items: TechnologicalSupportNeededItem[];
  sectorName: string;
  onAddItem: (item: TechnologicalSupportNeededItem) => void;
  onUpdateItem: (item: TechnologicalSupportNeededItem) => void;
  onDeleteItem: (id: string) => void;
  isReadOnly?: boolean;
}

export const Form3A_TechNeeded: React.FC<Form3AProps> = ({
  items,
  sectorName,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TechnologicalSupportNeededItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.technologyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expectedUseAndImpact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.programmeDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.additionalInformation && item.additionalInformation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All' || item.supportType === typeFilter;
    return matchesSearch && matchesType;
  });

  const mitigationCount = items.filter(i => i.supportType === 'Mitigation').length;
  const adaptationCount = items.filter(i => i.supportType === 'Adaptation').length;
  const crosscuttingCount = items.filter(i => i.supportType === 'Crosscutting').length;

  const handleOpenAdd = () => {
    const newItem: TechnologicalSupportNeededItem = {
      id: `TECH-NEED-${Date.now().toString().slice(-4)}`,
      supportType: 'Mitigation',
      technologyType: '',
      objective: '',
      expectedTimeFrame: '2026 - 2028',
      expectedUseAndImpact: '',
      programmeDescription: '',
      urgency: 'High',
      anchoredInNDC: 'Yes',
      additionalInformation: '',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TechnologicalSupportNeededItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: TechnologicalSupportNeededItem) => {
    const duplicated: TechnologicalSupportNeededItem = {
      ...item,
      id: `TECH-NEED-${Date.now().toString().slice(-4)}`,
      technologyType: `${item.technologyType} (Copy)`,
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
                FORM 3A
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Technology Development & Transfer Needed
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Standardized reporting table for identified climate technology, digital telemetry, and equipment requests (7 Core Fields)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Total Requests</div>
                <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                  {items.length} <span className="text-xs font-semibold text-slate-600">Solutions</span>
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-3 text-[11px]">
                <div className="text-slate-400 font-medium">Breakdown</div>
                <div className="font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-700 font-mono font-bold">{mitigationCount}M</span>
                  <span>•</span>
                  <span className="text-indigo-700 font-mono font-bold">{adaptationCount}A</span>
                  <span>•</span>
                  <span className="text-sky-700 font-mono font-bold">{crosscuttingCount}C</span>
                </div>
              </div>
            </div>

            {!isReadOnly && (
              <button
                onClick={handleOpenAdd}
                id="btn-add-tech-needed"
                className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>Add Technology Request</span>
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
              placeholder="Search by technology, objective, impact, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3825] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Type of support:</span>
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
          </div>
        </div>

        {/* Table strictly conforming to the 7-column schema shown in the template image */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Cpu className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Technology Requests Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add Technology Request" to record required climate solutions across the 7 reporting fields.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#E9ECE9] text-slate-700 font-bold border-y border-slate-300/80 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-bold whitespace-nowrap">
                    Type of support<br/><span className="text-[10px] font-medium text-slate-500 lowercase">(Mitigation/Adaptation/Crosscutting)</span>
                  </th>
                  <th className="py-3 px-3 sm:px-4 font-bold min-w-[200px]">
                    Type of technology
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[220px]">
                    Objective
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Expected Time Frame
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[220px]">
                    Expected Use/Impact
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[220px]">
                    Programme/project description
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[180px]">
                    Additional Information
                  </th>
                  <th className="py-3 px-3 font-bold text-center whitespace-nowrap">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {filteredItems.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        
                        {/* Column 1: Type of support (Mitigation/Adaptation/Crosscutting) */}
                        <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap align-top">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.supportType === 'Mitigation'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.supportType === 'Crosscutting'
                              ? 'bg-sky-100 text-sky-800 border border-sky-200'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {item.supportType}
                          </span>
                        </td>

                        {/* Column 2: Type of technology */}
                        <td className="py-3.5 px-3 sm:px-4 align-top">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleRowExpansion(item.id)}
                              className="mt-0.5 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0"
                              title={isExpanded ? "Collapse 7-field details" : "Expand all 7 fields"}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0F3825]" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.technologyType}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 3: Objective */}
                        <td className="py-3.5 px-3 text-slate-700 font-medium leading-relaxed align-top">
                          <div className="line-clamp-3">
                            {item.objective}
                          </div>
                        </td>

                        {/* Column 4: Expected Time Frame */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 align-top font-medium">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.expectedTimeFrame}</span>
                          </div>
                        </td>

                        {/* Column 5: Expected Use/Impact */}
                        <td className="py-3.5 px-3 text-slate-700 leading-relaxed align-top">
                          <div className="line-clamp-3">
                            {item.expectedUseAndImpact || <span className="text-slate-400 italic">Not specified</span>}
                          </div>
                        </td>

                        {/* Column 6: Programme/project description */}
                        <td className="py-3.5 px-3 text-slate-600 leading-relaxed align-top">
                          <div className="line-clamp-3">
                            {item.programmeDescription || <span className="text-slate-400 italic">Not specified</span>}
                          </div>
                        </td>

                        {/* Column 7: Additional Information */}
                        <td className="py-3.5 px-3 text-slate-500 leading-relaxed align-top">
                          <div className="line-clamp-3 text-[11px]">
                            {item.additionalInformation || <span className="text-slate-400 italic">None</span>}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap align-top">
                          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Edit Technology Request"
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

                      {/* Expandable 7-Field Detailed Card Inspector */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={8} className="p-4 sm:p-5">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F3825]" />
                                  Complete 7-Field Technology Needed Record • Form 3A
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {item.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                                {/* 1. Type of support */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Type of support (Mitigation/Adaptation/Crosscutting)</span>
                                  <span className="font-bold text-emerald-800 mt-0.5 block">{item.supportType}</span>
                                </div>

                                {/* 2. Type of technology */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Type of technology</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block">{item.technologyType}</span>
                                </div>

                                {/* 3. Objective */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Objective</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.objective}</span>
                                </div>

                                {/* 4. Expected Time Frame */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Expected Time Frame</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block">{item.expectedTimeFrame}</span>
                                </div>

                                {/* 5. Expected Use/Impact */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Expected Use/Impact</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.expectedUseAndImpact || 'N/A'}</span>
                                </div>

                                {/* 6. Programme/project description */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Programme/project description</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.programmeDescription || 'N/A'}</span>
                                </div>

                                {/* 7. Additional Information */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Additional Information</span>
                                  <span className="text-slate-700 mt-0.5 block leading-relaxed">{item.additionalInformation || 'N/A'}</span>
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

      {/* Add / Edit Modal strictly matching the 7 columns in the template image */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#0F3825] text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 text-emerald-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D4E5DB] text-[#0F3825] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Form 3A
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {editingItem.technologyType ? 'Edit Technology Request' : 'Add New Technology Transfer Request'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Enter the 7 standardized reporting parameters for technology needed (UNFCCC BTR Chapter 5 & Article 10)
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

            {/* Modal Form Body - Strictly 7 Fields from the template image */}
            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-[#F9FAF9] flex-1">
              
              {/* Card 1: Core Technology Info (Fields 1, 2, 4) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Support Type, Technology & Timeframe (Fields 1, 2, 4)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Type of support (Mitigation/Adaptation/Crosscutting) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      1. Type of support (Mitigation/Adaptation/Crosscutting) <span className="text-rose-500">*</span>
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

                  {/* Field 4: Expected Time Frame */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      4. Expected Time Frame <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.expectedTimeFrame}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedTimeFrame: e.target.value })}
                      placeholder="e.g. 2026 - 2028 (24 months)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 2: Type of technology */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      2. Type of technology <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.technologyType}
                      onChange={(e) => setEditingItem({ ...editingItem, technologyType: e.target.value })}
                      placeholder="e.g. Grid-Scale Battery Energy Storage Systems (BESS) & Fast Frequency Response Inverters"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Objective & Expected Impact (Fields 3, 5) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Objective & Expected Impact (Fields 3, 5)</span>
                </div>

                <div className="space-y-4">
                  {/* Field 3: Objective */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      3. Objective <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.objective}
                      onChange={(e) => setEditingItem({ ...editingItem, objective: e.target.value })}
                      placeholder="e.g. Deploy pilot 50 MW / 200 MWh utility-scale battery storage system at Zafarana substation to provide frequency regulation and shave peak demand..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium leading-relaxed"
                    />
                  </div>

                  {/* Field 5: Expected Use/Impact */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      5. Expected Use/Impact <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.expectedUseAndImpact}
                      onChange={(e) => setEditingItem({ ...editingItem, expectedUseAndImpact: e.target.value })}
                      placeholder="e.g. Displaces 120,000 MWh of gas turbine peaking power annually, mitigating approx. 78 Gg CO2e while increasing transmission reliability."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Project Description & Additional Information (Fields 6, 7) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Programme Description & Additional Information (Fields 6, 7)</span>
                </div>

                <div className="space-y-4">
                  {/* Field 6: Programme/project description */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      6. Programme/project description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.programmeDescription}
                      onChange={(e) => setEditingItem({ ...editingItem, programmeDescription: e.target.value })}
                      placeholder="e.g. National Grid Renewable Stabilization and Fast Balancing Pilot under MoERE Long-Term Energy Transition Roadmap."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium leading-relaxed"
                    />
                  </div>

                  {/* Field 7: Additional Information */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      7. Additional Information
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.additionalInformation}
                      onChange={(e) => setEditingItem({ ...editingItem, additionalInformation: e.target.value })}
                      placeholder="e.g. Requires technology transfer from international Tier 1 battery system integrators, warranty standards, and local manufacturing co-benefits."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>All 7 fields adhere to UNFCCC BTR Form 3A guidelines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white rounded-lg font-semibold shadow-xs transition-colors"
                  >
                    {editingItem.technologyType ? 'Update Technology Request' : 'Save Technology Request'}
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
