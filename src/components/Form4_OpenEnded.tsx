import React from 'react';
import { HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Form4OpenEnded } from '../types';

interface Form4Props {
  form4: Form4OpenEnded;
  sectorName: string;
  onChange: (form4: Form4OpenEnded) => void;
  isReadOnly?: boolean;
}

export const Form4_OpenEnded: React.FC<Form4Props> = ({
  form4,
  sectorName,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Subheader Container Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Barriers & Methodological Assumptions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparency statements on sectoral cost benchmarks, assumptions, and institutional access barriers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D4E5DB] text-[#24533C] text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ETF SPBR-05 Compliant</span>
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-200/80 space-y-6 text-xs bg-slate-50/40">
          {/* Question 1 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <label className="block font-bold text-slate-900 text-xs sm:text-sm mb-2">
              1) Have you made any assumptions while completing this support reporting form? *
            </label>
            <div className="flex items-center gap-6 mt-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="hasAssumptions"
                  value="Yes"
                  disabled={isReadOnly}
                  checked={form4.hasAssumptions === 'Yes'}
                  onChange={() => onChange({ ...form4, hasAssumptions: 'Yes' })}
                  className="w-4 h-4 text-[#0F3825] focus:ring-[#0F3825]"
                />
                <span className="text-xs font-semibold text-slate-800">Yes, assumptions were made</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="hasAssumptions"
                  value="No"
                  disabled={isReadOnly}
                  checked={form4.hasAssumptions === 'No'}
                  onChange={() => onChange({ ...form4, hasAssumptions: 'No' })}
                  className="w-4 h-4 text-[#0F3825] focus:ring-[#0F3825]"
                />
                <span className="text-xs font-semibold text-slate-800">No assumptions made</span>
              </label>
            </div>
          </div>

          {/* Question 2 */}
          {form4.hasAssumptions === 'Yes' && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block font-bold text-slate-900 text-xs sm:text-sm">
                  2) If yes, please describe the assumptions made: *
                </label>
                <span className="text-[11px] text-slate-400 font-normal">
                  (projected costs, staffing models, exchange rate baselines)
                </span>
              </div>
              <textarea
                rows={4}
                disabled={isReadOnly}
                value={form4.assumptionsDescription}
                onChange={(e) => onChange({ ...form4, assumptionsDescription: e.target.value })}
                placeholder="Detail calculation baselines, foreign exchange rate assumptions, capital equipment unit costs, discount rates..."
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] leading-relaxed"
              />
            </div>
          )}

          {/* Question 3 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <label className="block font-bold text-slate-900 text-xs sm:text-sm">
              3) In your view, what are the main barriers to attracting international climate finance in the {sectorName} sector? *
            </label>
            <p className="text-[11px] text-slate-500">
              Consider structural, institutional, foreign exchange, risk-guarantee, and technical telemetry hurdles.
            </p>
            <textarea
              rows={4}
              disabled={isReadOnly}
              value={form4.barriersDescription}
              onChange={(e) => onChange({ ...form4, barriersDescription: e.target.value })}
              placeholder="e.g. Lengthy international accreditation procedures, lack of foreign exchange risk hedges, complex MRV baseline requirements..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825] leading-relaxed"
            />
          </div>

          {/* Question 4 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <label className="block font-bold text-slate-900 text-xs sm:text-sm">
              4) Additional comments, sector recommendations, or technical notes:
            </label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={form4.additionalComments}
              onChange={(e) => onChange({ ...form4, additionalComments: e.target.value })}
              placeholder="Optional notes for national compilers and UNFCCC review teams..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-1 focus:ring-[#0F3825] focus:border-[#0F3825]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
