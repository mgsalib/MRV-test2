import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  RotateCcw, 
  FileCheck2, 
  UserCheck, 
  Send,
  Building,
  Globe
} from 'lucide-react';
import { WorkflowStatus, SupportCollectionTask } from '../types';

interface WorkflowStatusBarProps {
  task: SupportCollectionTask;
  onOpenComments?: () => void;
}

export const WorkflowStatusBar: React.FC<WorkflowStatusBarProps> = ({ task, onOpenComments }) => {
  const getStepStatus = (stepIndex: number) => {
    // 0: Entity Senior (Collection & Draft)
    // 1: Automated QC Validation
    // 2: Support Advisor (MoF / MoPEDIC) Review & Decision
    // 3: System Coordinator (CCCD) Review & Routing
    // 4: BTR Submission / Finalization

    switch (task.status) {
      case 'Draft':
        if (stepIndex === 0) return 'current';
        return 'upcoming';

      case 'QC_Pending':
        if (stepIndex === 0) return 'completed';
        if (stepIndex === 1) return 'current';
        return 'upcoming';

      case 'QC_Passed':
        if (stepIndex <= 1) return 'completed';
        if (stepIndex === 0) return 'current'; // ready to submit
        return 'upcoming';

      case 'Submitted_To_Advisor':
      case 'Under_Advisor_Review':
        if (stepIndex <= 1) return 'completed';
        if (stepIndex === 2) return 'current';
        return 'upcoming';

      case 'Advisor_Approved':
      case 'Coordinator_Review':
        if (stepIndex <= 2) return 'completed';
        if (stepIndex === 3) return 'current';
        return 'upcoming';

      case 'Approved_For_BTR':
        return 'completed';

      case 'Returned_For_Rework':
        if (stepIndex === 0) return 'error-rework';
        return 'upcoming';

      default:
        return 'upcoming';
    }
  };

  const steps = [
    {
      title: '1. Senior Entity CCU',
      subtitle: 'Data Collection & Verification',
      actor: task.generalInfo.entityName || 'Ministry CCU',
      desc: 'Form 1A, 2A, 3A, 4 Entry & NDC Linkage',
    },
    {
      title: '2. Automated QC Gate',
      subtitle: 'System QC Validation (SPBR-06)',
      actor: 'MRV Validation Engine',
      desc: 'Sanity, range, gap & NDC compliance checks',
    },
    {
      title: '3. Support Advisor',
      subtitle: 'Eligibility & Co-Financing',
      actor: task.generalInfo.assignedAdvisor || 'MoF / MoPEDIC',
      desc: 'Forms 1B, 2B, 3B Received Data & Donor Matching',
    },
    {
      title: '4. System Coordinator',
      subtitle: 'CCCD Final Approval & Routing',
      actor: 'CCCD (Ministry of Environment)',
      desc: 'Consolidation & Verification Review',
    },
    {
      title: '5. National BTR Output',
      subtitle: 'UNFCCC ETF CTF Tables',
      actor: 'Global / National BTR',
      desc: 'International or Confidential Submission',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Status Alert Banner if Returned for Rework */}
        {task.status === 'Returned_For_Rework' && (
          <div className="mb-3.5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600 animate-spin" />
              <span>
                <strong>Action Required:</strong> This Support N/R task was returned with reviewer comments. Please address the feedback in the comments tab and resubmit.
              </span>
            </div>
            {onOpenComments && (
              <button
                onClick={onOpenComments}
                className="px-2.5 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 transition-colors"
              >
                View Reviewer Comments
              </button>
            )}
          </div>
        )}

        {/* Workflow Steps Horizontal Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {steps.map((step, idx) => {
            const state = getStepStatus(idx);
            return (
              <div
                key={idx}
                className={`relative p-3 rounded-xl border transition-all text-xs ${
                  state === 'completed'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : state === 'current'
                    ? 'bg-sky-50/80 border-sky-300 text-sky-950 shadow-xs ring-1 ring-sky-300'
                    : state === 'error-rework'
                    ? 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-300'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    {step.title}
                  </span>
                  {state === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {state === 'current' && <Clock className="w-4 h-4 text-sky-600 animate-pulse shrink-0" />}
                  {state === 'error-rework' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  {state === 'upcoming' && <span className="w-2 h-2 rounded-full bg-slate-300"></span>}
                </div>

                <div className="font-semibold text-slate-800 text-[12px] truncate">
                  {step.subtitle}
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{step.actor}</span>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
