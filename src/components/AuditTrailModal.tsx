import React from 'react';
import { History, X, Shield, Clock, User, CheckCircle2 } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
  taskCode: string;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  logs,
  taskCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Audit Trail & Traceability Log
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Task Reference: {taskCode}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {logs.map((log, index) => (
              <div key={log.id} className="relative pl-6">
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>{log.actorName}</strong> ({log.actorRole.replace(/_/g, ' ')})</span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed">
                    {log.details}
                  </p>

                  {log.newStatus && (
                    <div className="mt-1 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span>Status transition:</span>
                      {log.previousStatus && (
                        <>
                          <span className="font-semibold text-slate-600">{log.previousStatus}</span>
                          <span>→</span>
                        </>
                      )}
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {log.newStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
