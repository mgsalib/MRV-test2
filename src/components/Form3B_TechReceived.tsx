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
  Building,
  Users,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Percent
} from 'lucide-react';
import { TechnologicalSupportReceivedItem, SupportType, ActivityStatus, SatisfactionRating } from '../types';
import { SUPPORT_TYPES, ACTIVITY_STATUSES } from '../data/initialData';

interface Form3BProps {
  items: TechnologicalSupportReceivedItem[];
  sectorName: string;
  onAddItem: (item: TechnologicalSupportReceivedItem) => void;
  onUpdateItem: (item: TechnologicalSupportReceivedItem) => void;
  onDeleteItem: (id: string) => void;
  isReadOnly?: boolean;
}

export const Form3B_TechReceived: React.FC<Form3BProps> = ({
  items,
  sectorName,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [satisfactionFilter, setSatisfactionFilter] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TechnologicalSupportReceivedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.technologyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supportProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipientEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.useImpactAndResults && item.useImpactAndResults.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.additionalInformation && item.additionalInformation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All' || item.supportType === typeFilter;
    const matchesStatus = statusFilter === 'All' || item.activityStatus === statusFilter;
    const matchesSatisfaction = satisfactionFilter === 'All' || String(item.satisfactionRating) === satisfactionFilter;
    return matchesSearch && matchesType && matchesStatus && matchesSatisfaction;
  });

  const totalTrained = items.reduce((sum, item) => sum + (item.trainedPersonnelCount || 0), 0);
  const averageSatisfaction = items.length > 0 
    ? (items.reduce((sum, item) => sum + (Number(item.satisfactionRating) || 0), 0) / items.length).toFixed(1)
    : '0.0';

  const handleOpenAdd = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split('T')[0];

    const newItem: TechnologicalSupportReceivedItem = {
      id: `TECH-REC-${Date.now().toString().slice(-4)}`,
      supportType: 'Mitigation',
      technologyType: '',
      supportProvider: 'JICA / Climate Technology Centre and Network (CTCN)',
      dateReceived: todayStr,
      recipientEntity: `${sectorName} National Operations & Dispatch Unit`,
      trainedPersonnelCount: 15,
      satisfactionRating: 5,
      progressPercent: 100,
      timeFrame: '2025 - 2026 (12 months)',
      startDate: todayStr,
      endDate: nextYearStr,
      activityStatus: 'Completed',
      useImpactAndResults: '',
      additionalInformation: '',
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TechnologicalSupportReceivedItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: TechnologicalSupportReceivedItem) => {
    const duplicated: TechnologicalSupportReceivedItem = {
      ...item,
      id: `TECH-REC-${Date.now().toString().slice(-4)}`,
      technologyType: `${item.technologyType} (Copy)`,
    };
    onAddItem(duplicated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (items.some((i) => i.id === editingItem.id)) {
      onUpdateItem(editingItem);
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
                FORM 3B
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Technology Development & Transfer Received
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Table of clean technologies, equipment, and digital monitoring systems received (15 Reporting Fields)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Delivered Deployments</div>
                <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                  {items.length} <span className="text-xs font-semibold text-slate-600">Transfers</span>
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-4">
                <div className="text-[11px] text-slate-400 font-medium">Trained Operators</div>
                <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                  {totalTrained.toLocaleString()} <span className="text-xs font-semibold text-slate-600">Staff</span>
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-4">
                <div className="text-[11px] text-slate-400 font-medium">Avg Satisfaction</div>
                <div className="text-base font-bold font-mono text-emerald-800 tracking-tight flex items-center justify-end gap-1">
                  <span>{averageSatisfaction}</span>
                  <span className="text-xs text-amber-500 font-semibold">★ / 5</span>
                </div>
              </div>
            </div>

            {!isReadOnly && (
              <button
                onClick={handleOpenAdd}
                id="btn-add-tech-received"
                className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>Add Technology Record</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search technology, provider, recipient, impact, or results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3825] text-slate-800"
            />
          </div>

          <div className="flex items-center flex-wrap gap-3">
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
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                {ACTIVITY_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Satisfaction:</span>
              <select
                value={satisfactionFilter}
                onChange={(e) => setSatisfactionFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table strictly conforming to the 15-column schema shown in the template image */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Cpu className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Received Technology Records Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add Technology Record" to document delivered climate technology transfers across all 15 parameters.
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
                  <th className="py-3 px-3 font-bold min-w-[180px]">
                    Support Provider
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Type of support<br/><span className="text-[10px] font-medium text-slate-500 lowercase">(Mitigation/Adaptation/Crosscutting)</span>
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Date of Receiving Support
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[170px]">
                    Recipient Entity
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Number of Trained Personnel
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Satisfaction (1–5)
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Progress (%)
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Time Frame
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    End Date
                  </th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    Status of the Activity<br/><span className="text-[10px] font-medium text-slate-500 lowercase">(Planned/Ongoing/Completed)</span>
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[240px]">
                    Use, Impact and Quantitative results (Benefits)
                  </th>
                  <th className="py-3 px-3 font-bold min-w-[200px]">
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
                              title={isExpanded ? "Collapse 15-field details" : "Expand all 15 fields"}
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

                        {/* Column 3: Support Provider */}
                        <td className="py-3.5 px-3 align-top">
                          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                            <Building className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{item.supportProvider}</span>
                          </div>
                        </td>

                        {/* Column 4: Type of support (Mitigation/Adaptation/Crosscutting) */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top font-medium text-slate-700">
                          {item.supportType}
                        </td>

                        {/* Column 5: Date of Receiving Support */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top font-medium text-slate-700">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.dateReceived || 'N/A'}</span>
                          </div>
                        </td>

                        {/* Column 6: Recipient Entity */}
                        <td className="py-3.5 px-3 align-top font-medium text-slate-800 text-xs">
                          {item.recipientEntity}
                        </td>

                        {/* Column 7: Number of Trained Personnel */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top">
                          <div className="font-bold font-mono text-slate-900 text-xs flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{item.trainedPersonnelCount} Trainees</span>
                          </div>
                        </td>

                        {/* Column 8: Satisfaction (1–5) */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center text-amber-500">
                              {[...Array(item.satisfactionRating || 5)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">({item.satisfactionRating}/5)</span>
                          </div>
                        </td>

                        {/* Column 9: Progress (%) */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-14 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-emerald-700 h-1.5 rounded-full" 
                                  style={{ width: `${Math.min(100, Math.max(0, item.progressPercent || 0))}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-700">{item.progressPercent}%</span>
                            </div>
                          </div>
                        </td>

                        {/* Column 10: Time Frame */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top text-slate-700 font-medium">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.timeFrame}</span>
                          </div>
                        </td>

                        {/* Column 11: Start Date */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top text-slate-600 text-[11px] font-mono">
                          {item.startDate || 'N/A'}
                        </td>

                        {/* Column 12: End Date */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top text-slate-600 text-[11px] font-mono">
                          {item.endDate || 'N/A'}
                        </td>

                        {/* Column 13: Status of the Activity (Planned/Ongoing/Completed) */}
                        <td className="py-3.5 px-3 whitespace-nowrap align-top">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.activityStatus === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.activityStatus === 'Ongoing'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {item.activityStatus}
                          </span>
                        </td>

                        {/* Column 14: Use, Impact and Quantitative results (Benefits) */}
                        <td className="py-3.5 px-3 text-slate-700 leading-relaxed align-top">
                          <div className="line-clamp-3">
                            {item.useImpactAndResults || <span className="text-slate-400 italic">Not specified</span>}
                          </div>
                        </td>

                        {/* Column 15: Additional Information */}
                        <td className="py-3.5 px-3 text-slate-600 leading-relaxed align-top">
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

                      {/* Expandable 15-Field Detailed Card Inspector */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={16} className="p-4 sm:p-5">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F3825]" />
                                  Complete 15-Field Technology Received Record • Form 3B
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {item.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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

                                {/* 3. Support Provider */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Support Provider</span>
                                  <span className="font-semibold text-emerald-800 mt-0.5 block">{item.supportProvider}</span>
                                </div>

                                {/* 4. Type of support */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Type of support</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.supportType}</span>
                                </div>

                                {/* 5. Date of Receiving Support */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Date of Receiving Support</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.dateReceived || 'N/A'}</span>
                                </div>

                                {/* 6. Recipient Entity */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Recipient Entity</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.recipientEntity}</span>
                                </div>

                                {/* 7. Number of Trained Personnel */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Number of Trained Personnel</span>
                                  <span className="font-bold font-mono text-emerald-800 mt-0.5 block">{item.trainedPersonnelCount} Persons</span>
                                </div>

                                {/* 8. Satisfaction (1–5) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Satisfaction (1–5)</span>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <div className="flex text-amber-500">
                                      {[...Array(item.satisfactionRating || 5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      ))}
                                    </div>
                                    <span className="font-bold text-slate-900">({item.satisfactionRating}/5)</span>
                                  </div>
                                </div>

                                {/* 9. Progress (%) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">9. Progress (%)</span>
                                  <span className="font-bold font-mono text-slate-900 mt-0.5 block">{item.progressPercent}% Completed</span>
                                </div>

                                {/* 10. Time Frame */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">10. Time Frame</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.timeFrame}</span>
                                </div>

                                {/* 11. Start Date */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">11. Start Date</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.startDate || 'N/A'}</span>
                                </div>

                                {/* 12. End Date */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">12. End Date</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.endDate || 'N/A'}</span>
                                </div>

                                {/* 13. Status of the Activity */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">13. Status of the Activity (Planned/Ongoing/Completed)</span>
                                  <span className="font-bold text-emerald-800 mt-0.5 block">{item.activityStatus}</span>
                                </div>

                                {/* 14. Use, Impact and Quantitative results (Benefits) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-4">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">14. Use, Impact and Quantitative results (Benefits)</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.useImpactAndResults || 'N/A'}</span>
                                </div>

                                {/* 15. Additional Information */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-4">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">15. Additional Information</span>
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

      {/* Add / Edit Modal strictly matching the 15 columns in the template image */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#0F3825] text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 text-emerald-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D4E5DB] text-[#0F3825] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Form 3B
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {editingItem.technologyType ? 'Edit Received Technology Record' : 'Record Received Technology Support'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Enter the 15 standardized reporting parameters for technology received according to UNFCCC BTR Chapter 5 & Article 10
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

            {/* Modal Form Body - Strictly 15 Fields from the template image */}
            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-[#F9FAF9] flex-1">
              
              {/* Section 1: Support Type, Technology & Provider (Fields 1, 2, 3, 4) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Support Type, Technology & Provider (Fields 1, 2, 3, 4)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1 & 4: Type of support (Mitigation/Adaptation/Crosscutting) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      1 & 4. Type of support (Mitigation/Adaptation/Crosscutting) <span className="text-rose-500">*</span>
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

                  {/* Field 3: Support Provider */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      3. Support Provider <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.supportProvider}
                      onChange={(e) => setEditingItem({ ...editingItem, supportProvider: e.target.value })}
                      placeholder="e.g. JICA (Japan International Cooperation Agency), CTCN, UNDP / GEF"
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
                      placeholder="e.g. Automated Solar Irradiation Pyranometer Stations and Wind Lidar Units"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Receipt Date, Recipient, Trainees, Satisfaction & Progress (Fields 5, 6, 7, 8, 9) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Receipt Date, Recipient Entity, Trainees & Progress (Fields 5, 6, 7, 8, 9)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Field 5: Date of Receiving Support */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      5. Date of Receiving Support <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.dateReceived}
                      onChange={(e) => setEditingItem({ ...editingItem, dateReceived: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 6: Recipient Entity */}
                  <div className="lg:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      6. Recipient Entity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.recipientEntity}
                      onChange={(e) => setEditingItem({ ...editingItem, recipientEntity: e.target.value })}
                      placeholder="e.g. New & Renewable Energy Authority (NREA) / National Dispatch Center"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 7: Number of Trained Personnel */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      7. Number of Trained Personnel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingItem.trainedPersonnelCount}
                      onChange={(e) => setEditingItem({ ...editingItem, trainedPersonnelCount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono font-bold focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 8: Satisfaction (1–5) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      8. Satisfaction (1–5) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.satisfactionRating}
                      onChange={(e) => setEditingItem({ ...editingItem, satisfactionRating: parseInt(e.target.value) as SatisfactionRating })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      <option value={5}>5 - Excellent (Exceeded Expectations)</option>
                      <option value={4}>4 - Very Good (Satisfactory)</option>
                      <option value={3}>3 - Good (Adequate)</option>
                      <option value={2}>2 - Fair (Minor Deficiencies)</option>
                      <option value={1}>1 - Poor (Substantial Issues)</option>
                    </select>
                  </div>

                  {/* Field 9: Progress (%) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      9. Progress (%) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingItem.progressPercent || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, progressPercent: parseInt(e.target.value) || 0 })}
                        className="flex-1 accent-[#0F3825]"
                      />
                      <span className="font-mono font-bold text-xs text-slate-800 w-12 text-right">
                        {editingItem.progressPercent || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Timeframe, Start Date, End Date & Activity Status (Fields 10, 11, 12, 13) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Timeframe, Milestone Dates & Activity Status (Fields 10, 11, 12, 13)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Field 10: Time Frame */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      10. Time Frame <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.timeFrame}
                      onChange={(e) => setEditingItem({ ...editingItem, timeFrame: e.target.value })}
                      placeholder="e.g. 2024 - 2025 (12 months)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 11: Start Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      11. Start Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.startDate}
                      onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 12: End Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      12. End Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.endDate}
                      onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 13: Status of the Activity */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      13. Status of the Activity <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.activityStatus}
                      onChange={(e) => setEditingItem({ ...editingItem, activityStatus: e.target.value as ActivityStatus })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {ACTIVITY_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Use, Impact, Quantitative Results & Additional Information (Fields 14, 15) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Impact, Quantitative Results & Additional Information (Fields 14, 15)</span>
                </div>

                <div className="space-y-4">
                  {/* Field 14: Use, Impact and Quantitative results (Benefits) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      14. Use, Impact and Quantitative results (Benefits) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingItem.useImpactAndResults}
                      onChange={(e) => setEditingItem({ ...editingItem, useImpactAndResults: e.target.value })}
                      placeholder="e.g. Deployed 8 solar mapping towers and 4 wind lidars in East Nile and Minya expansion zones for accurate resource forecasting and grid integration."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium leading-relaxed"
                    />
                  </div>

                  {/* Field 15: Additional Information */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      15. Additional Information
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.additionalInformation}
                      onChange={(e) => setEditingItem({ ...editingItem, additionalInformation: e.target.value })}
                      placeholder="e.g. Hardware currently streaming live telemetry into NREA central data server with 5-year maintenance warranty."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>All 15 fields adhere to UNFCCC BTR Form 3B guidelines</span>
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
                    {editingItem.technologyType ? 'Update Technology Record' : 'Save Technology Record'}
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
