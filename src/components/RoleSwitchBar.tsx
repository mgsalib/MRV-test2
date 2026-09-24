import React from 'react';
import { UserCheck, Shield, Award, CheckCircle, RotateCcw, AlertCircle, Sparkles, Send } from 'lucide-react';
import { UserRole, WorkflowStatus } from '../types';

interface RoleSwitchBarProps {
  activeRole: UserRole;
  workflowStatus: WorkflowStatus;
  onRoleChange: (role: UserRole) => void;
  onAdvisorDecision: (approved: boolean, comment?: string) => void;
  onCoordinatorDecision: (approved: boolean, reportingDirection?: 'Internationally (UNFCCC BTR)' | 'Confidential (C) Nationally') => void;
  onResetTask: () => void;
}

export const RoleSwitchBar: React.FC<RoleSwitchBarProps> = ({
  activeRole,
  workflowStatus,
  onRoleChange,
  onAdvisorDecision,
  onCoordinatorDecision,
  onResetTask,
}) => {
  return (
    <div className="bg-slate-900 text-white border-t border-slate-800 p-4 sticky bottom-0 z-20 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Role identity & explanation */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Active Simulation Perspective:</span>
              <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                {activeRole.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeRole === 'Entity_Senior'
                ? 'Entity Senior (Ministry CCU) can edit data, run QC validation, and submit the Support N/R collection task.'
                : activeRole === 'Support_Advisor'
                ? 'Support Advisor (Ministry of Finance / MoPEDIC) reviews support requests and fills Support Received (Forms 1B, 2B, 3B).'
                : 'System Coordinator (CCCD) conducts final national review and routes to UNFCCC BTR submission.'}
            </p>
          </div>
        </div>

        {/* Right: Dynamic Role Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Support Advisor Actions when task is submitted */}
          {activeRole === 'Support_Advisor' && (
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => onAdvisorDecision(true)}
                disabled={workflowStatus === 'Draft'}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  workflowStatus === 'Draft'
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Advisor Approve (MoF)</span>
              </button>

              <button
                onClick={() => onAdvisorDecision(false, 'Please clarify specific equipment unit costs in Form 3A and confirm co-financing.')}
                disabled={workflowStatus === 'Draft'}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  workflowStatus === 'Draft'
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return with Comments</span>
              </button>
            </div>
          )}

          {/* System Coordinator Actions */}
          {activeRole === 'System_Coordinator' && (
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => onCoordinatorDecision(true, 'Internationally (UNFCCC BTR)')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Approve for BTR (International)</span>
              </button>

              <button
                onClick={() => onCoordinatorDecision(false)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reject to Senior CCU</span>
              </button>
            </div>
          )}

          {/* Role selector dropdown */}
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Entity_Senior">Entity Senior (Ministry CCU)</option>
            <option value="Support_Advisor">Support Advisor (MoF / MoPEDIC)</option>
            <option value="System_Coordinator">System Coordinator (CCCD)</option>
          </select>

          {/* Reset Demo State button */}
          <button
            onClick={onResetTask}
            className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
            title="Reset collection task to initial state"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
};
