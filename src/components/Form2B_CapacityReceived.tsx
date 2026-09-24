import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy,
  GraduationCap, 
  Calendar, 
  X,
  Users,
  Building,
  Star,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info,
  Layers,
  FileText,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { CapacityBuildingSupportReceivedItem, SupportType, ActivityStatus, SatisfactionRating } from '../types';
import { SUPPORT_TYPES, ACTIVITY_STATUSES } from '../data/initialData';

interface Form2BProps {
  items: CapacityBuildingSupportReceivedItem[];
  sectorName: string;
  onAddItem: (item: CapacityBuildingSupportReceivedItem) => void;
  onUpdateItem: (item: CapacityBuildingSupportReceivedItem) => void;
  onDeleteItem: (id: string) => void;
  isReadOnly?: boolean;
}

export const Form2B_CapacityReceived: React.FC<Form2BProps> = ({
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
  const [editingItem, setEditingItem] = useState<CapacityBuildingSupportReceivedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.trainingTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    const newItem: CapacityBuildingSupportReceivedItem = {
      id: `CAP-REC-${Date.now().toString().slice(-4)}`,
      trainingTopic: '',
      supportProvider: 'GIZ / German Cooperation (JCEE)',
      supportType: 'Mitigation',
      dateReceived: todayStr,
      recipientEntity: `Ministry of Electricity & Renewable Energy (MoERE) - ${sectorName} CCU`,
      trainedPersonnelCount: 25,
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

  const handleOpenEdit = (item: CapacityBuildingSupportReceivedItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: CapacityBuildingSupportReceivedItem) => {
    const duplicated: CapacityBuildingSupportReceivedItem = {
      ...item,
      id: `CAP-REC-${Date.now().toString().slice(-4)}`,
      trainingTopic: `${item.trainingTopic} (Copy)`,
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
                FORM 2B
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Capacity Building Support Received
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Table of capacity-building, institutional training, and technical mentorship programs received (14 Reporting Fields)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Total Trained</div>
              <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                {totalTrained.toLocaleString()} <span className="text-xs font-semibold text-slate-600">Specialists</span>
              </div>
            </div>

            <div className="text-right border-l border-slate-200 pl-4">
              <div className="text-[11px] text-slate-400 font-medium">Avg Satisfaction</div>
              <div className="text-base font-bold font-mono text-emerald-800 tracking-tight flex items-center justify-end gap-1">
                <span>{averageSatisfaction}</span>
                <span className="text-xs text-amber-500 font-semibold">★ / 5</span>
              </div>
            </div>

            <button
              onClick={handleOpenAdd}
              id="btn-add-capacity-received"
              className="px-4 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>Add Capacity Record</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by training topic, support provider, recipient, or results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3825] text-slate-800"
            />
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Support Type:</span>
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

        {/* Table */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Received Capacity Records Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add Capacity Record" to document delivered training sessions across all 14 standardized parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#E9ECE9] text-slate-700 font-bold border-y border-slate-300/80 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-bold">Training Topic & Provider</th>
                  <th className="py-3 px-3 font-bold">Recipient Entity & Date</th>
                  <th className="py-3 px-3 font-bold">Type & Urgency</th>
                  <th className="py-3 px-3 font-bold">Personnel & Satisfaction</th>
                  <th className="py-3 px-3 font-bold">Progress & Status</th>
                  <th className="py-3 px-3 font-bold">Timeframe (Start - End)</th>
                  <th className="py-3 px-3 font-bold">Use, Impact & Results</th>
                  <th className="py-3 px-3 font-bold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {filteredItems.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        {/* Training Topic & Support Provider */}
                        <td className="py-3.5 px-3 sm:px-4 max-w-sm">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleRowExpansion(item.id)}
                              className="mt-0.5 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0"
                              title={isExpanded ? "Collapse 14-field details" : "Expand all 14 fields"}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0F3825]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.trainingTopic}
                              </div>
                              <div className="text-[11px] text-emerald-800 font-semibold mt-0.5 flex items-center gap-1">
                                <Building className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{item.supportProvider}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Recipient Entity & Date Received */}
                        <td className="py-3.5 px-3 max-w-[180px]">
                          <div className="font-medium text-slate-800 text-xs">
                            {item.recipientEntity}
                          </div>
                          {item.dateReceived && (
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Received: {item.dateReceived}</span>
                            </div>
                          )}
                        </td>

                        {/* Type of Support */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.supportType === 'Mitigation'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.supportType === 'Crosscutting'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {item.supportType}
                          </span>
                        </td>

                        {/* Trained Count & Satisfaction Rating */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="font-bold font-mono text-slate-900 text-xs flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{item.trainedPersonnelCount} Trainees</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center text-amber-500">
                                {[...Array(item.satisfactionRating || 5)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-slate-700">({item.satisfactionRating}/5)</span>
                            </div>
                          </div>
                        </td>

                        {/* Progress (%) & Status of Activity */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="space-y-1.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.activityStatus === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : item.activityStatus === 'Ongoing'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {item.activityStatus}
                            </span>
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

                        {/* Timeframe, Start Date & End Date */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.timeFrame}</span>
                          </div>
                          {(item.startDate || item.endDate) && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {item.startDate} → {item.endDate}
                            </div>
                          )}
                        </td>

                        {/* Use, Impact & Quantitative Results */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                            {item.useImpactAndResults || 'No impact details recorded'}
                          </div>
                          {item.additionalInformation && (
                            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.additionalInformation}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
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

                      {/* Expandable 14-Field Detailed Card Inspector */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={8} className="p-4 sm:p-5">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F3825]" />
                                  Complete 14-Field Capacity Building Received Record • Form 2B
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {item.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                {/* 1. Training Topic */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Training Topic</span>
                                  <span className="font-bold text-slate-900 mt-0.5 block">{item.trainingTopic}</span>
                                </div>

                                {/* 2. Support Provider */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Support Provider</span>
                                  <span className="font-semibold text-emerald-800 mt-0.5 block">{item.supportProvider}</span>
                                </div>

                                {/* 3. Type of support */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Type of support</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.supportType}</span>
                                </div>

                                {/* 4. Date of Receiving Support */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Date of Receiving Support</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.dateReceived || 'N/A'}</span>
                                </div>

                                {/* 5. Recipient Entity */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Recipient Entity</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.recipientEntity}</span>
                                </div>

                                {/* 6. Number of Trained Personnel */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Number of Trained Personnel</span>
                                  <span className="font-bold font-mono text-emerald-800 mt-0.5 block">{item.trainedPersonnelCount} Persons</span>
                                </div>

                                {/* 7. Satisfaction (1–5) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Satisfaction (1–5)</span>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <div className="flex text-amber-500">
                                      {[...Array(item.satisfactionRating || 5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      ))}
                                    </div>
                                    <span className="font-bold text-slate-900">({item.satisfactionRating}/5)</span>
                                  </div>
                                </div>

                                {/* 8. Progress (%) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Progress (%)</span>
                                  <span className="font-bold font-mono text-slate-900 mt-0.5 block">{item.progressPercent}% Completed</span>
                                </div>

                                {/* 9. Time Frame */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">9. Time Frame</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.timeFrame}</span>
                                </div>

                                {/* 10. Start Date */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">10. Start Date</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.startDate || 'N/A'}</span>
                                </div>

                                {/* 11. End Date */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">11. End Date</span>
                                  <span className="font-semibold text-slate-900 mt-0.5 block">{item.endDate || 'N/A'}</span>
                                </div>

                                {/* 12. Status of the Activity */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">12. Status of the Activity</span>
                                  <span className="font-bold text-emerald-800 mt-0.5 block">{item.activityStatus}</span>
                                </div>

                                {/* 13. Use, Impact and Quantitative results (Benefits) */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">13. Use, Impact and Quantitative results (Benefits)</span>
                                  <span className="text-slate-800 mt-0.5 block leading-relaxed">{item.useImpactAndResults || 'N/A'}</span>
                                </div>

                                {/* 14. Additional Information */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 lg:col-span-4">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">14. Additional Information</span>
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

      {/* Add / Edit Modal strictly matching the 14 columns in the template image */}
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
                      Form 2B
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {editingItem.trainingTopic ? 'Edit Capacity Received Record' : 'Add New Capacity Received Request'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Enter the 14 standardized reporting parameters according to UNFCCC BTR Chapter 5 & Paris Agreement Article 11
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

            {/* Modal Form Body - 14 Fields Grouped Logically */}
            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-[#F9FAF9] flex-1">
              
              {/* Section 1: Training Topic, Provider & Recipient (Fields 1, 2, 5) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Topic, Support Provider & Recipient Entity (Fields 1, 2, 5)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Training Topic */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      1. Training Topic <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.trainingTopic}
                      onChange={(e) => setEditingItem({ ...editingItem, trainingTopic: e.target.value })}
                      placeholder="e.g. Renewable Energy Grid Impact Modeling & DigSILENT PowerFactory Optimization"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 2: Support Provider */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      2. Support Provider <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.supportProvider}
                      onChange={(e) => setEditingItem({ ...editingItem, supportProvider: e.target.value })}
                      placeholder="e.g. GIZ / German Cooperation (JCEE Programme), UNDP / GEF, UNEP"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 5: Recipient Entity */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      5. Recipient Entity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.recipientEntity}
                      onChange={(e) => setEditingItem({ ...editingItem, recipientEntity: e.target.value })}
                      placeholder="e.g. EETC National Energy Control Center (NECC), CCU Central Unit"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Support Type, Date Received, Trained Count & Satisfaction (Fields 3, 4, 6, 7) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Support Type, Receipt Date, Trainees & Satisfaction (Fields 3, 4, 6, 7)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Field 3: Type of support */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      3. Type of support <span className="text-rose-500">*</span>
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

                  {/* Field 4: Date of Receiving Support */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      4. Date of Receiving Support <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.dateReceived}
                      onChange={(e) => setEditingItem({ ...editingItem, dateReceived: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 6: Number of Trained Personnel */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      6. Number of Trained Personnel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingItem.trainedPersonnelCount || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, trainedPersonnelCount: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 28"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                    />
                  </div>

                  {/* Field 7: Satisfaction (1–5) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      7. Satisfaction (1–5) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1 pt-0.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, satisfactionRating: val as SatisfactionRating })}
                          className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all border text-center flex flex-col items-center justify-center ${
                            editingItem.satisfactionRating === val
                              ? 'bg-[#0F3825] text-white border-[#0F3825] shadow-2xs ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{val}</span>
                          <span className="text-[9px] text-amber-300">★</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Progress, Time Frame, Dates & Status (Fields 8, 9, 10, 11, 12) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Progress, Time Frame, Implementation Dates & Status (Fields 8 – 12)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Field 8: Progress (%) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      8. Progress (%) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        value={editingItem.progressPercent ?? 100}
                        onChange={(e) => setEditingItem({ ...editingItem, progressPercent: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs"
                      />
                      <span className="text-slate-500 font-bold text-xs">%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingItem.progressPercent ?? 100}
                        onChange={(e) => setEditingItem({ ...editingItem, progressPercent: parseInt(e.target.value) || 0 })}
                        className="flex-1 accent-[#0F3825] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Field 9: Time Frame */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      9. Time Frame <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.timeFrame}
                      onChange={(e) => setEditingItem({ ...editingItem, timeFrame: e.target.value })}
                      placeholder="e.g. 2024 - 2025 (8 months)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 12: Status of the Activity */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      12. Status of the Activity (Planned/Ongoing/Completed) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editingItem.activityStatus}
                      onChange={(e) => setEditingItem({ ...editingItem, activityStatus: e.target.value as ActivityStatus })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    >
                      {ACTIVITY_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 10: Start Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      10. Start Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.startDate}
                      onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>

                  {/* Field 11: End Date */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      11. End Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.endDate}
                      onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Use, Impact & Additional Information (Fields 13 & 14) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0F3825]" />
                  <span>Impact, Quantitative Results & Additional Context (Fields 13 – 14)</span>
                </div>

                <div className="space-y-4">
                  {/* Field 13: Use, Impact and Quantitative results(Benefits) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      13. Use, Impact and Quantitative results(Benefits) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.useImpactAndResults}
                      onChange={(e) => setEditingItem({ ...editingItem, useImpactAndResults: e.target.value })}
                      placeholder="Detail institutional outcomes, models calibrated, hours of curtailment avoided, compliance reports filed, trained engineers certified..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs leading-relaxed"
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
                      placeholder="e.g. Software licenses renewed for 3 years, follow-up on-the-job mentorship planned for Q4 2026, complementary hardware donated..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] shadow-2xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <span className="text-rose-500 font-bold">*</span> All fields formatted for UNFCCC BTR Chapter 5 compliance
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold transition-colors shadow-2xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F3825] hover:bg-[#184A34] text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Save Capacity Record</span>
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

