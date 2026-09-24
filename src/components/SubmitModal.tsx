import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  DollarSign, 
  GraduationCap, 
  Cpu, 
  FileText, 
  Lock,
  Building,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportCollectionTask, QCIssue } from '../types';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: SupportCollectionTask;
  qcResult: {
    passed: boolean;
    errors: QCIssue[];
    warnings: QCIssue[];
    infos: QCIssue[];
  };
  onSubmitSuccess: (submissionData: {
    signoffName: string;
    signoffTitle: string;
    submissionNotes: string;
  }) => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  task,
  qcResult,
  onSubmitSuccess,
}) => {
  const [signoffName, setSignoffName] = useState(task.generalInfo.compilerName || '');
  const [signoffTitle, setSignoffTitle] = useState(task.generalInfo.compilerTitle || '');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalFinancialRequested = task.financialNeeded.reduce(
    (sum, item) => sum + (item.amountRequestedUSD || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qcResult.passed || !isAgreed) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Trigger festive confetti celebration for official submission
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#34D399', '#F59E0B'],
        });
      } catch (err) {
        // Safe fallback
      }

      onSubmitSuccess({
        signoffName,
        signoffTitle,
        submissionNotes,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                  National MRV Submission Gate
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Submit Support Needed & Received Collection Task
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Pre-flight QC status */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            qcResult.passed 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            {qcResult.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-sm font-bold block">
                {qcResult.passed
                  ? 'Automated Quality Control (QC) Passed'
                  : 'Automated QC Gate: Submission Blocked'}
              </strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {qcResult.passed
                  ? 'All mandatory requirements (SPBR-01 through SPBR-06) have been verified. Your submission will be officially transmitted to the Support Advisor (MoF / MoPEDIC).'
                  : `There are ${qcResult.errors.length} blocking error(s) in your form data that must be corrected before submitting.`}
              </p>
            </div>
          </div>

          {/* Submission Summary Matrix */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Data Package Summary ({task.generalInfo.ministryName})</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Financial Needed</span>
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  ${totalFinancialRequested.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400">
                  {task.financialNeeded.length} projects requested
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Capacity Programs</span>
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {task.capacityNeeded.length} Activities
                </div>
                <span className="text-[10px] text-slate-400">Form 2A</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tech Transfer</span>
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {task.techNeeded.length} Systems
                </div>
                <span className="text-[10px] text-slate-400">Form 3A</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span>Form 4 Assumptions & Barriers:</span>
              <strong className="text-emerald-700 font-medium">Completed & Documented</strong>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Assigned Support Reviewer:</span>
              <strong className="text-slate-800">{task.generalInfo.assignedAdvisor}</strong>
            </div>
          </div>

          {/* Official Senior Entity Digital Declaration */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <UserCheck className="w-4 h-4 text-amber-700" />
              <span>Senior Entity Official Declaration & Sign-off</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Certifying Official Name *
                </label>
                <input
                  type="text"
                  required
                  value={signoffName}
                  onChange={(e) => setSignoffName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Official Title / Role *
                </label>
                <input
                  type="text"
                  required
                  value={signoffTitle}
                  onChange={(e) => setSignoffTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Submission Notes / Remarks for Support Advisor
              </label>
              <textarea
                rows={2}
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Add any covering notes or priority urgency guidance for the Ministry of Finance / MoPEDIC..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-[11px] text-slate-700 leading-snug">
                I hereby certify as <strong>Entity Senior</strong> that the submitted Support Needed & Received records have been validated against our sectoral NDC commitments, national strategies, and institutional data sources in full accordance with the National MRV System guidelines.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!qcResult.passed || !isAgreed || isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-semibold text-white flex items-center gap-2 shadow-sm transition-all ${
                !qcResult.passed || !isAgreed || isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Submission...' : 'Sign & Submit to Support Advisor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
