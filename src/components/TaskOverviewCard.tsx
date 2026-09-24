import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  User, 
  DollarSign, 
  Layers, 
  Wrench, 
  GraduationCap, 
  Edit3, 
  Save, 
  Info,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileBadge
} from 'lucide-react';
import { SupportCollectionTask, GeneralInformation } from '../types';
import { AVAILABLE_SECTORS } from '../data/initialData';

interface TaskOverviewCardProps {
  task: SupportCollectionTask;
  onUpdateGeneralInfo: (info: GeneralInformation) => void;
  onSectorSwitch: (sectorCode: string) => void;
}

export const TaskOverviewCard: React.FC<TaskOverviewCardProps> = ({
  task,
  onUpdateGeneralInfo,
  onSectorSwitch,
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState<GeneralInformation>(task.generalInfo);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGeneralInfo(formData);
    setIsEditingInfo(false);
  };

  // Calculations
  const totalFinancialNeeded = task.financialNeeded.reduce((acc, curr) => acc + (curr.amountRequestedUSD || 0), 0);
  const totalGap = task.financialNeeded.reduce((acc, curr) => acc + (curr.estimatedGapUSD || 0), 0);
  const totalFinancialReceived = task.financialReceived.reduce((acc, curr) => acc + (curr.amountReceivedUSD || 0), 0);
  const capacityNeededCount = task.capacityNeeded.length;
  const techNeededCount = task.techNeeded.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-6">
      {/* Header with Sector Selector & Status */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-emerald-50/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Entity Senior Task
            </span>
            <span className="text-slate-500 text-xs">Task Code:</span>
            <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {task.id}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              task.status === 'Draft'
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : task.status === 'Submitted_To_Advisor'
                ? 'bg-sky-50 text-sky-700 border-sky-300'
                : task.status === 'Approved_For_BTR'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}>
              Status: {task.status.replace(/_/g, ' ')}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{task.generalInfo.ministryName}</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pillar: <strong>Support Needed / Received (ETF Art. 13.10)</strong> • Reporting Year: <strong>{task.reportingYear}</strong> • Sub-unit: <strong>{task.generalInfo.entityName}</strong>
          </p>
        </div>

        {/* Ministry / Sector Switcher */}
        <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Switch Sector Template
          </label>
          <select
            value={AVAILABLE_SECTORS.find(s => s.name === task.generalInfo.ministryName)?.code || 'MoERE'}
            onChange={(e) => onSectorSwitch(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 shadow-2xs hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            {AVAILABLE_SECTORS.map((sec) => (
              <option key={sec.code} value={sec.code}>
                {sec.code} - {sec.sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-white">
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Total Financial Needed</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ${totalFinancialNeeded.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Financing Gap:</span>
            <strong className="text-amber-700">${totalGap.toLocaleString()}</strong>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Capacity Building (2A)</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {capacityNeededCount} <span className="text-xs font-normal text-slate-500">programs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {task.capacityReceived.length} received recorded (2B)
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Wrench className="w-4 h-4 text-purple-600" />
            <span>Technology Support (3A)</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {techNeededCount} <span className="text-xs font-normal text-slate-500">technologies</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {task.techReceived.length} transfer recorded (3B)
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <FileBadge className="w-4 h-4 text-teal-600" />
            <span>Support Received (1B)</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">
            ${totalFinancialReceived.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Disbursed / Committed grants & loans
          </div>
        </div>
      </div>

      {/* Compiler & Task Metadata Bar */}
      <div className="px-5 py-3.5 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-slate-600">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Compiler: <strong className="text-slate-800">{task.generalInfo.compilerName}</strong> ({task.generalInfo.compilerTitle})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Date: <strong className="text-slate-800">{task.generalInfo.compilationDate}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Assigned Advisor: <strong className="text-slate-800">{task.generalInfo.assignedAdvisor}</strong></span>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(task.generalInfo);
            setIsEditingInfo(!isEditingInfo);
          }}
          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditingInfo ? 'Hide Compiler Details' : 'Edit Compiler Info'}</span>
          {isEditingInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Compiler Info Editor */}
      {isEditingInfo && (
        <form onSubmit={handleSaveInfo} className="p-5 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>General Identification & Compiler Information (SPBR-01)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Name of Compiler *</label>
              <input
                type="text"
                value={formData.compilerName}
                onChange={(e) => setFormData({ ...formData, compilerName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Compiler Title / Role *</label>
              <input
                type="text"
                value={formData.compilerTitle}
                onChange={(e) => setFormData({ ...formData, compilerTitle: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Date of Compilation *</label>
              <input
                type="date"
                value={formData.compilationDate}
                onChange={(e) => setFormData({ ...formData, compilationDate: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Calendar Year Data Covers *</label>
              <input
                type="number"
                value={formData.reportingYear}
                onChange={(e) => setFormData({ ...formData, reportingYear: parseInt(e.target.value) || 2026 })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Official Email *</label>
              <input
                type="email"
                value={formData.compilerEmail}
                onChange={(e) => setFormData({ ...formData, compilerEmail: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone / Office Contact</label>
              <input
                type="text"
                value={formData.compilerContact}
                onChange={(e) => setFormData({ ...formData, compilerContact: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Submitting Entity / Unit</label>
              <input
                type="text"
                value={formData.entityName}
                onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Assigned Support Advisor</label>
              <input
                type="text"
                value={formData.assignedAdvisor}
                onChange={(e) => setFormData({ ...formData, assignedAdvisor: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingInfo(false)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Compiler Information</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
