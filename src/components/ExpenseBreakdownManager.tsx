import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Receipt, 
  CheckCircle2, 
  AlertTriangle, 
  PieChart, 
  FileText, 
  Building2, 
  Sparkles, 
  X, 
  Check, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ExpenseDetailItem } from '../types';
import { EXPENSE_CATEGORIES } from '../data/initialData';

interface ExpenseBreakdownManagerProps {
  amountReceivedUSD: number;
  amountSpentUSD: number;
  expenses: ExpenseDetailItem[];
  currencyMode?: 'USD' | 'EGP';
  isReadOnly?: boolean;
  onUpdateExpenses: (newExpenses: ExpenseDetailItem[], newAmountSpentUSD: number) => void;
  onSyncSpentAmount?: (newAmountSpentUSD: number) => void;
}

export const ExpenseBreakdownManager: React.FC<ExpenseBreakdownManagerProps> = ({
  amountReceivedUSD = 0,
  amountSpentUSD = 0,
  expenses = [],
  currencyMode = 'USD',
  isReadOnly = false,
  onUpdateExpenses,
}) => {
  const EGP_RATE = 50.4094;

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // New/Editing Expense Form State
  const [expenseForm, setExpenseForm] = useState<ExpenseDetailItem>({
    id: '',
    category: EXPENSE_CATEGORIES[0] || 'Civil Works & Substations',
    description: '',
    vendorOrRecipient: '',
    invoiceOrReference: '',
    date: new Date().toISOString().split('T')[0],
    amountUSD: 0,
    status: 'Paid',
    notes: '',
  });

  const totalItemizedUSD = expenses.reduce((sum, item) => sum + (item.amountUSD || 0), 0);
  const effectiveSpentUSD = expenses.length > 0 ? totalItemizedUSD : amountSpentUSD;
  const remainingUSD = amountReceivedUSD - effectiveSpentUSD;
  const utilizationRate = amountReceivedUSD > 0 ? (effectiveSpentUSD / amountReceivedUSD) * 100 : 0;
  const isOverspent = effectiveSpentUSD > amountReceivedUSD;
  const isFullyUtilized = amountReceivedUSD > 0 && Math.abs(amountReceivedUSD - effectiveSpentUSD) < 1;

  const formatAmount = (usdVal: number) => {
    if (currencyMode === 'EGP') {
      return (usdVal * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return (usdVal || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  // Group by category for distribution summary
  const categoryTotals: Record<string, number> = expenses.reduce<Record<string, number>>((acc, curr) => {
    const cat = curr.category || 'Other Direct Expenditures';
    acc[cat] = (acc[cat] || 0) + (curr.amountUSD || 0);
    return acc;
  }, {});

  const handleOpenAddForm = () => {
    setExpenseForm({
      id: `EXP-${Date.now().toString().slice(-4)}`,
      category: EXPENSE_CATEGORIES[0] || 'Civil Works & Substations',
      description: '',
      vendorOrRecipient: '',
      invoiceOrReference: '',
      date: new Date().toISOString().split('T')[0],
      amountUSD: 0,
      status: 'Paid',
      notes: '',
    });
    setEditingExpenseId(null);
    setIsAddingNew(true);
  };

  const handleOpenEditForm = (exp: ExpenseDetailItem) => {
    setExpenseForm({ ...exp });
    setEditingExpenseId(exp.id);
    setIsAddingNew(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description?.trim() || expenseForm.amountUSD <= 0) return;

    let updatedList: ExpenseDetailItem[];
    if (editingExpenseId) {
      updatedList = expenses.map((item) => (item.id === editingExpenseId ? expenseForm : item));
    } else {
      updatedList = [...expenses, { ...expenseForm, id: `EXP-${Date.now().toString().slice(-4)}` }];
    }

    const newTotal = updatedList.reduce((sum, item) => sum + (item.amountUSD || 0), 0);
    onUpdateExpenses(updatedList, newTotal);
    setIsAddingNew(false);
    setEditingExpenseId(null);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedList = expenses.filter((item) => item.id !== id);
    const newTotal = updatedList.reduce((sum, item) => sum + (item.amountUSD || 0), 0);
    onUpdateExpenses(updatedList, newTotal);
  };

  const handleLoadSampleExpenses = () => {
    if (amountReceivedUSD <= 0) return;
    // Generate realistic infrastructure package breakdown based on received amount
    const sampleItems: ExpenseDetailItem[] = [
      {
        id: `EXP-PRESET-1`,
        category: 'Civil Works & Substations',
        description: 'Civil engineering, structural foundations, and main transformer yard construction',
        vendorOrRecipient: 'Elsewedy Electric T&D',
        invoiceOrReference: 'PKG-CIVIL-2024-01',
        date: '2024-02-15',
        amountUSD: Math.round(amountReceivedUSD * 0.38),
        status: 'Paid',
        notes: 'Primary civil works and containment bunds completed.',
      },
      {
        id: `EXP-PRESET-2`,
        category: 'High-Voltage Switchgear & Transformers',
        description: 'Procurement, shipment and delivery of step-up transformers & GIS switchgear',
        vendorOrRecipient: 'Siemens Energy AG',
        invoiceOrReference: 'PKG-ELEC-2024-88',
        date: '2024-05-20',
        amountUSD: Math.round(amountReceivedUSD * 0.28),
        status: 'Paid',
        notes: 'Factory acceptance testing (FAT) cleared & commissioned.',
      },
      {
        id: `EXP-PRESET-3`,
        category: 'Transmission Lines & Grid Interconnection',
        description: 'Overhead transmission line corridors and grid interconnection stringing',
        vendorOrRecipient: 'Giza Cable Industries',
        invoiceOrReference: 'PKG-GRID-2024-03',
        date: '2024-08-10',
        amountUSD: Math.round(amountReceivedUSD * 0.15),
        status: 'Paid',
        notes: 'High-voltage grid connection energization test passed.',
      },
      {
        id: `EXP-PRESET-4`,
        category: 'SCADA, Telemetry & Digitalization',
        description: 'SCADA automation, RTU telemetry and digital control integration with National Center',
        vendorOrRecipient: 'Hitachi Energy / ABB',
        invoiceOrReference: 'PKG-SCADA-2024-12',
        date: '2024-11-05',
        amountUSD: Math.round(amountReceivedUSD * 0.06),
        status: 'Paid',
        notes: 'Automated 15-min generation data streaming verified.',
      },
      {
        id: `EXP-PRESET-5`,
        category: 'Engineering Consultancy & Supervision',
        description: 'Third-party Owner Engineer inspection, QA/QC supervision, and environmental audit',
        vendorOrRecipient: 'Fichtner Consulting Engineers',
        invoiceOrReference: 'PKG-CONSULT-2024-09',
        date: '2025-01-20',
        amountUSD: Math.round(amountReceivedUSD * 0.04),
        status: 'Paid',
        notes: 'Independent monitoring report submitted to funding facility.',
      },
    ];

    const newTotal = sampleItems.reduce((sum, item) => sum + item.amountUSD, 0);
    onUpdateExpenses(sampleItems, newTotal);
  };

  return (
    <div className="space-y-4">
      {/* Financial Reconciliation & Utilization Header Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F3825] text-emerald-300 flex items-center justify-center font-bold">
              <Receipt className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Expenditure Reconciliation & Spent Amount Breakdown</span>
                {expenses.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {expenses.length} Line {expenses.length === 1 ? 'Item' : 'Items'} Logged
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-500">
                Detailed accounting of how received climate finance is utilized across contracts, equipment, and sub-components.
              </p>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex items-center gap-2 self-end sm:self-center">
              {expenses.length === 0 && amountReceivedUSD > 0 && (
                <button
                  type="button"
                  onClick={handleLoadSampleExpenses}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#0F3825] bg-emerald-100/80 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                  title="Generate standard 5-contract infrastructure breakdown"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Load Preset Expenses</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-3 py-1.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-300" />
                <span>Add Expense Item</span>
              </button>
            </div>
          )}
        </div>

        {/* 3-Way Reconciliation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Total Received */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Total Funds Received
            </span>
            <div className="text-base font-bold font-mono text-slate-900 mt-1">
              ${formatAmount(amountReceivedUSD)} <span className="text-xs font-semibold text-slate-600">{currencyMode}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              100% Inflow Allocation
            </div>
          </div>

          {/* Total Spent / Itemized */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              2. Total Spent / Accounted For
            </span>
            <div className="text-base font-bold font-mono text-slate-900 mt-1 flex items-baseline justify-between">
              <span>${formatAmount(effectiveSpentUSD)} <span className="text-xs font-semibold text-slate-600">{currencyMode}</span></span>
              <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
                isOverspent ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {utilizationRate.toFixed(1)}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
              <span>{expenses.length > 0 ? `Sum of ${expenses.length} expense items` : 'Manually entered spent total'}</span>
            </div>
          </div>

          {/* Remaining Balance */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              3. Remaining Funds / Balance
            </span>
            <div className="text-base font-bold font-mono mt-1 flex items-baseline justify-between">
              <span className={remainingUSD < 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                ${formatAmount(remainingUSD)} <span className="text-xs font-semibold text-slate-600">{currencyMode}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {(100 - utilizationRate).toFixed(1)}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {remainingUSD > 0 ? 'Available for milestone retention & testing' : remainingUSD === 0 ? 'Fully disbursed and reconciled' : 'Exceeds received allocation'}
            </div>
          </div>
        </div>

        {/* Utilization Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1">
              <strong>Utilization Progress:</strong>
              {isOverspent ? (
                <span className="text-rose-600 font-bold flex items-center gap-0.5">
                  <AlertTriangle className="w-3 h-3" /> Overspent by ${(Math.abs(remainingUSD)).toLocaleString()} USD
                </span>
              ) : isFullyUtilized ? (
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> 100% Fully Utilized
                </span>
              ) : (
                <span className="text-emerald-800 font-bold">
                  {utilizationRate.toFixed(1)}% utilized • ${(remainingUSD).toLocaleString()} USD remaining
                </span>
              )}
            </span>
            <span className="font-mono text-slate-500">{utilizationRate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden flex">
            <div 
              className={`h-full transition-all duration-300 ${
                isOverspent ? 'bg-rose-500' : 'bg-[#0F3825]'
              }`}
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown Chips */}
        {Object.keys(categoryTotals).length > 0 && (
          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              By Category:
            </span>
            {Object.entries(categoryTotals).map(([cat, total]) => {
              const amount = Number(total);
              const catPct = effectiveSpentUSD > 0 ? (amount / effectiveSpentUSD) * 100 : 0;
              return (
                <span key={cat} className="inline-flex items-center gap-1 text-[10px] font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 shadow-2xs">
                  <span className="font-semibold text-slate-900">{cat}:</span>
                  <span className="font-mono text-emerald-800 font-bold">${amount.toLocaleString()}</span>
                  <span className="text-slate-400">({catPct.toFixed(0)}%)</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Inline Form for Adding / Editing Expense Item */}
      {isAddingNew && !isReadOnly && (
        <form onSubmit={handleSaveExpense} className="p-4 rounded-xl bg-white border-2 border-emerald-500/30 shadow-md space-y-3 animate-in fade-in zoom-in-98 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Plus className="w-4 h-4 text-[#0F3825]" />
              <span>{editingExpenseId ? 'Edit Expenditure Line Item' : 'Add New Expenditure Line Item'}</span>
            </div>
            <button
              type="button"
              onClick={() => { setIsAddingNew(false); setEditingExpenseId(null); }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs font-medium"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Description / Specific Activity <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Turnkey construction of GIS collector substation and cable laying"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs"
              />
            </div>

            {/* Vendor / Recipient */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vendor / Contractor / Recipient
              </label>
              <input
                type="text"
                placeholder="e.g. Elsewedy Electric / Siemens Consortium"
                value={expenseForm.vendorOrRecipient || ''}
                onChange={(e) => setExpenseForm({ ...expenseForm, vendorOrRecipient: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs"
              />
            </div>

            {/* Invoice / Reference */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Invoice / Contract Reference #
              </label>
              <input
                type="text"
                placeholder="e.g. EETC-LOT1-INV-2024"
                value={expenseForm.invoiceOrReference || ''}
                onChange={(e) => setExpenseForm({ ...expenseForm, invoiceOrReference: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs font-mono"
              />
            </div>

            {/* Expense Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Disbursement / Invoice Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs"
              />
            </div>

            {/* Amount in USD */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Amount in USD <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0"
                  value={expenseForm.amountUSD || ''}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amountUSD: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold font-mono focus:ring-1 focus:ring-[#0F3825] shadow-2xs"
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                ≈ {((expenseForm.amountUSD || 0) * EGP_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Payment / Verification Status
              </label>
              <select
                value={expenseForm.status || 'Paid'}
                onChange={(e) => setExpenseForm({ ...expenseForm, status: e.target.value as any })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs font-medium"
              >
                <option value="Paid">Paid (Disbursed)</option>
                <option value="Committed">Committed (Contract Signed)</option>
                <option value="Pending Verification">Pending Verification / Audit</option>
              </select>
            </div>

            {/* Notes / Deliverable */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Notes / Milestone Deliverable
              </label>
              <input
                type="text"
                placeholder="e.g. Cleared factory testing; installed on site"
                value={expenseForm.notes || ''}
                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-1 focus:ring-[#0F3825] shadow-2xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setIsAddingNew(false); setEditingExpenseId(null); }}
              className="px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingExpenseId ? 'Update Expense Item' : 'Add Expense Item'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Itemized Expenses Table */}
      {expenses.length === 0 ? (
        <div className="p-6 rounded-xl bg-white border border-dashed border-slate-300 text-center space-y-2">
          <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
          <h5 className="text-xs font-bold text-slate-700">No Itemized Expenses Documented Yet</h5>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Add detailed expense records for contracts, equipment procurement, civil works, or consultancy to track exactly how the ${amountReceivedUSD.toLocaleString()} USD received amount was spent.
          </p>
          {!isReadOnly && (
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-3.5 py-1.5 bg-[#0F3825] hover:bg-[#184A34] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log First Expense</span>
              </button>
              {amountReceivedUSD > 0 && (
                <button
                  type="button"
                  onClick={handleLoadSampleExpenses}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0F3825] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Auto-fill Sample Breakdown</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Category & Scope</th>
                  <th className="py-2.5 px-3">Vendor / Contractor</th>
                  <th className="py-2.5 px-3">Date & Ref #</th>
                  <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  {!isReadOnly && <th className="py-2.5 px-3 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp, idx) => {
                  const sharePct = effectiveSpentUSD > 0 ? (exp.amountUSD / effectiveSpentUSD) * 100 : 0;
                  return (
                    <tr key={exp.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 font-bold text-[10px]">
                        {idx + 1}
                      </td>

                      {/* Category & Description */}
                      <td className="py-2.5 px-3 max-w-xs">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200/80 mb-0.5">
                          {exp.category}
                        </span>
                        <div className="font-semibold text-slate-900 leading-snug">
                          {exp.description}
                        </div>
                        {exp.notes && (
                          <div className="text-[10px] text-slate-500 mt-0.5 italic">
                            {exp.notes}
                          </div>
                        )}
                      </td>

                      {/* Vendor */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                        {exp.vendorOrRecipient ? (
                          <div className="flex items-center gap-1 font-medium">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{exp.vendorOrRecipient}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </td>

                      {/* Date & Ref */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                        <div className="font-mono text-slate-800 text-[11px]">
                          {exp.date || 'N/A'}
                        </div>
                        {exp.invoiceOrReference && (
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            Ref: {exp.invoiceOrReference}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-right font-mono">
                        <div className="font-bold text-slate-900">
                          ${formatAmount(exp.amountUSD || 0)} <span className="text-[10px] font-medium text-slate-500">{currencyMode}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sharePct.toFixed(1)}% of spent
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          exp.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          exp.status === 'Committed' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {exp.status || 'Paid'}
                        </span>
                      </td>

                      {/* Actions */}
                      {!isReadOnly && (
                        <td className="py-2.5 px-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(exp)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                              title="Edit item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50/90 font-bold border-t border-slate-200 text-slate-900">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-[10px] tracking-wider">
                    Total Itemized Expenditures:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">
                    ${formatAmount(totalItemizedUSD)} {currencyMode}
                  </td>
                  <td colSpan={isReadOnly ? 1 : 2} className="py-2.5 px-3 text-left text-[10px] text-slate-500">
                    ({expenses.length} items logged)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
