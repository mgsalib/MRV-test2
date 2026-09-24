import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { QCIssue } from '../types';

interface QCValidationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  issues: {
    passed: boolean;
    errors: QCIssue[];
    warnings: QCIssue[];
    infos: QCIssue[];
  };
  onNavigateToForm: (formKey: string) => void;
}

export const QCValidationPanel: React.FC<QCValidationPanelProps> = ({
  isOpen,
  onClose,
  issues,
  onNavigateToForm,
}) => {
  if (!isOpen) return null;

  const totalIssues = issues.errors.length + issues.warnings.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              issues.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Automated Quality Control (QC Gate)
              </h3>
              <p className="text-[11px] text-slate-500">
                Compliance Verification (Requirement SPBR-06)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className="p-4 border-b border-slate-100">
          {issues.passed ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">QC Validation Passed!</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  All mandatory data elements, NDC linkages (SPBR-03), and numeric range tests conform to BTR reporting specifications. Ready for Entity Senior submission.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {issues.errors.length} Blocking Error{issues.errors.length > 1 ? 's' : ''} Detected
                </strong>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Per requirement SPBR-06, submissions with blocking errors cannot proceed to the Support Advisor until resolved.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Blocking Errors */}
          {issues.errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-800 text-[11px] uppercase tracking-wider">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Blocking Issues ({issues.errors.length})</span>
              </div>

              <div className="space-y-2">
                {issues.errors.map((error) => (
                  <div
                    key={error.id}
                    className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-rose-900">
                        {error.formType}: {error.field}
                      </span>
                      <span className="font-mono text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                        {error.ruleCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-relaxed">
                      {error.message}
                    </p>
                    <button
                      onClick={() => {
                        const tabKey = 
                          error.formType === 'General' ? 'general' :
                          error.formType === 'Form 1A' ? '1A' :
                          error.formType === 'Form 2A' ? '2A' :
                          error.formType === 'Form 3A' ? '3A' : '4';
                        onNavigateToForm(tabKey);
                        onClose();
                      }}
                      className="text-[11px] text-rose-800 hover:text-rose-950 font-semibold flex items-center gap-1 mt-1 underline cursor-pointer"
                    >
                      <span>Jump to fix in {error.formType}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {issues.warnings.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Advisory Warnings ({issues.warnings.length})</span>
              </div>

              <div className="space-y-2">
                {issues.warnings.map((warn) => (
                  <div
                    key={warn.id}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-amber-900">
                        {warn.formType}
                      </span>
                      <span className="font-mono text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                        {warn.ruleCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {warn.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rule References Explainer */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Pillar 4 (Support N/R) QC Rules Applied</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
              <li><strong>SPBR-01:</strong> Valid compilation date, compiler credentials, and active reporting year.</li>
              <li><strong>SPBR-03:</strong> Mandatory anchoring of requested support in Egypt's NDC or National Strategy 2050.</li>
              <li><strong>SPBR-04:</strong> Completeness of Forms 1A (Financial), 2A (Capacity), and 3A (Technological).</li>
              <li><strong>SPBR-05:</strong> Complete Form 4 narrative on assumptions and barriers to climate finance.</li>
              <li><strong>SPBR-06:</strong> Automated QC sanity gate before forwarding to Support Advisor.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {issues.errors.length} errors • {issues.warnings.length} warnings
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs shadow-xs"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
