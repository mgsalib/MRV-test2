import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  History, 
  FileText, 
  Sparkles,
  Layers,
  UserCheck,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SupportCollectionTask, UserRole } from '../types';

interface HeaderProps {
  task: SupportCollectionTask;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenQC: () => void;
  onSubmitClick: () => void;
  onExportCSV: () => void;
  onOpenAudit: () => void;
  onOpenBTR: () => void;
  onOpenComments: () => void;
  qcErrorCount: number;
  qcWarningCount: number;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  task,
  activeRole,
  onRoleChange,
  onOpenQC,
  onSubmitClick,
  onExportCSV,
  onOpenAudit,
  onOpenBTR,
  onOpenComments,
  qcErrorCount,
  qcWarningCount,
  onToggleMobileSidebar,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unresolvedComments = task.comments.filter((c) => !c.isResolved).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels: Record<UserRole, { title: string; subtitle: string; initials: string; name: string }> = {
    Entity_Senior: {
      name: 'YASMIN EL-SAYED',
      title: 'Senior Entity',
      subtitle: task.generalInfo.ministryName,
      initials: 'YE',
    },
    Support_Advisor: {
      name: 'DR. HESHAM TAWFIK',
      title: 'Support Advisor',
      subtitle: 'Ministry of Finance (MoF)',
      initials: 'HT',
    },
    System_Coordinator: {
      name: 'DR. AMR OSAMA',
      title: 'System Coordinator (CCCD)',
      subtitle: 'Climate Change Central Department',
      initials: 'AO',
    },
    Data_Collector: {
      name: 'ENG. TAREK MANSOUR',
      title: 'Data Collector',
      subtitle: task.generalInfo.ministryName,
      initials: 'TM',
    },
    External_Expert: {
      name: 'DR. LEILA MAHMOUD',
      title: 'External Auditor',
      subtitle: 'UNFCCC Review Team',
      initials: 'LM',
    },
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels.Entity_Senior;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-slate-500">
          <span className="hover:text-slate-700 cursor-pointer">Data Management</span>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" />
          <span className="text-[#0F3825] font-bold">Support Needed & Received</span>
        </nav>
      </div>

      {/* Right: Quick Tools, Notifications, Vertical Divider, User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Review / QC Actions bar */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* QC Status pill */}
          <button
            onClick={onOpenQC}
            id="header-btn-qc"
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              qcErrorCount > 0
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : qcWarningCount > 0
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-[#0F3825] border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Automated Quality Control Validation"
          >
            {qcErrorCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>QC</span>
            {qcErrorCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold">
                {qcErrorCount}
              </span>
            )}
          </button>

          {/* Comments count */}
          <button
            onClick={onOpenComments}
            id="header-btn-comments"
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all ${
              unresolvedComments > 0
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Review Comments"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Comments</span>
            {unresolvedComments > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                {unresolvedComments}
              </span>
            )}
          </button>

          {/* BTR Preview */}
          <button
            onClick={onOpenBTR}
            id="header-btn-btr"
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all flex items-center gap-1.5"
            title="UNFCCC BTR Summary Table Preview"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xl:inline">BTR</span> Summary
          </button>

          {/* Audit Trail */}
          <button
            onClick={onOpenAudit}
            id="header-btn-audit"
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all flex items-center gap-1.5"
            title="System Audit Trail & Timestamp Log"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Audit</span> Log
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            id="header-btn-export"
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all flex items-center gap-1.5"
            title="Export Support N/R CSV"
          >
            <span className="text-slate-600 font-semibold">CSV</span>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            id="header-btn-notifications"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-900">Task Notifications</span>
                <span className="text-[10px] text-emerald-700 font-semibold">MRV System 2026</span>
              </div>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                <div className="p-2 bg-emerald-50/50 rounded-lg text-xs border border-emerald-100">
                  <p className="font-semibold text-[#0F3825]">Reporting Cycle Active</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Deadline for submission to Support Advisor is September 30, 2026.
                  </p>
                </div>
                {unresolvedComments > 0 && (
                  <div className="p-2 bg-amber-50/50 rounded-lg text-xs border border-amber-100">
                    <p className="font-semibold text-amber-900">Advisor Feedback Pending</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {unresolvedComments} unaddressed technical comment(s) logged on this task.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile and Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            id="header-user-profile-btn"
            className="flex items-center gap-2.5 text-left hover:bg-slate-50 p-1.5 rounded-lg transition-colors group"
          >
            <div className="hidden sm:block text-right">
              <div className="text-[12px] font-bold text-slate-900 tracking-wider uppercase leading-tight">
                {currentRoleInfo.name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight">
                {currentRoleInfo.title}
              </div>
            </div>

            {/* Avatar badge */}
            <div className="w-8 h-8 rounded-full bg-[#0F3825] text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:ring-2 group-hover:ring-emerald-600/30 transition-all">
              {currentRoleInfo.initials}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>

          {/* Profile & Role Switcher Popover */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 bg-slate-50 rounded-lg mb-2.5">
                <div className="font-bold text-xs text-slate-900">{currentRoleInfo.name}</div>
                <div className="text-[11px] text-emerald-800 font-semibold">{currentRoleInfo.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{task.generalInfo.ministryName}</div>
              </div>

              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-1.5">
                Simulate Workflow Role
              </div>

              <div className="space-y-1">
                {(['Entity_Senior', 'Support_Advisor', 'System_Coordinator'] as UserRole[]).map((r) => {
                  const roleData = roleLabels[r];
                  const isSelected = activeRole === r;
                  return (
                    <button
                      key={r}
                      id={`select-role-${r}`}
                      onClick={() => {
                        onRoleChange(r);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#0F3825] text-white font-semibold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div>
                        <div>{roleData.title}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {roleData.name}
                        </div>
                      </div>
                      {isSelected && <span className="text-[10px] bg-emerald-500 text-[#0F3825] px-1.5 py-0.2 rounded font-bold">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
