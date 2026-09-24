import { SupportCollectionTask, QCIssue } from '../types';

export function runAutomatedQC(task: SupportCollectionTask): {
  passed: boolean;
  errors: QCIssue[];
  warnings: QCIssue[];
  infos: QCIssue[];
} {
  const issues: QCIssue[] = [];

  // --- 1. General Information Checks ---
  if (!task.generalInfo?.compilerName?.trim()) {
    issues.push({
      id: 'QC-GEN-001',
      formType: 'General',
      field: 'compilerName',
      severity: 'error',
      message: 'Name of compiler is required.',
      ruleCode: 'SPBR-01',
    });
  }

  if (!task.generalInfo?.compilationDate) {
    issues.push({
      id: 'QC-GEN-002',
      formType: 'General',
      field: 'compilationDate',
      severity: 'error',
      message: 'Date of compilation is required.',
      ruleCode: 'SPBR-01',
    });
  }

  const contactInfo = task.generalInfo?.compilerContact?.trim() || task.generalInfo?.compilerEmail?.trim() || '';
  if (!contactInfo) {
    issues.push({
      id: 'QC-GEN-003',
      formType: 'General',
      field: 'compilerContact',
      severity: 'error',
      message: 'Contact info or email of the compiler is required for auditability.',
      ruleCode: 'SPBR-01',
    });
  }

  if (!task.generalInfo?.reportingYear || task.generalInfo.reportingYear < 2020) {
    issues.push({
      id: 'QC-GEN-004',
      formType: 'General',
      field: 'reportingYear',
      severity: 'error',
      message: 'Valid calendar year for reported data is required.',
      ruleCode: 'SPBR-01',
    });
  }

  // --- 2. Form 1A Checks (Financial Support Needed) ---
  if (!task.financialNeeded || task.financialNeeded.length === 0) {
    issues.push({
      id: 'QC-F1A-000',
      formType: 'Form 1A',
      field: 'financialNeeded',
      severity: 'warning',
      message: 'No financial support needed items added yet. At least one project is recommended if requesting climate finance.',
      ruleCode: 'SPBR-04',
    });
  }

  (task.financialNeeded || []).forEach((item, index) => {
    const itemLabel = item.title || `Item #${index + 1}`;

    if (!item.title?.trim()) {
      issues.push({
        id: `QC-F1A-TIT-${item.id}`,
        formType: 'Form 1A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'title',
        severity: 'error',
        message: `Title of Activity/Programme/Project is missing in Form 1A (${itemLabel}).`,
        ruleCode: 'SPBR-04',
      });
    }

    if (!item.amountRequestedUSD || item.amountRequestedUSD <= 0) {
      issues.push({
        id: `QC-F1A-AMT-${item.id}`,
        formType: 'Form 1A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'amountRequestedUSD',
        severity: 'error',
        message: `Amount requested in USD must be greater than 0 for "${itemLabel}".`,
        ruleCode: 'SPBR-04',
      });
    }

    if (item.estimatedGapUSD > item.amountRequestedUSD) {
      issues.push({
        id: `QC-F1A-GAP-${item.id}`,
        formType: 'Form 1A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'estimatedGapUSD',
        severity: 'warning',
        message: `Estimated financing gap ($${item.estimatedGapUSD.toLocaleString()}) exceeds total requested amount ($${item.amountRequestedUSD.toLocaleString()}) for "${itemLabel}".`,
        ruleCode: 'SPBR-06',
      });
    }

    // SPBR-03: NDC Linkage Check
    if (item.anchoredInNDC === 'Yes' && !item.strategyName?.trim()) {
      issues.push({
        id: `QC-F1A-NDC-${item.id}`,
        formType: 'Form 1A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'strategyName',
        severity: 'error',
        message: `Please specify the exact name of the national strategy/action plan/NDC target for "${itemLabel}".`,
        ruleCode: 'SPBR-03',
      });
    }

    if (item.anchoredInNDC === 'No') {
      issues.push({
        id: `QC-F1A-NONDC-${item.id}`,
        formType: 'Form 1A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'anchoredInNDC',
        severity: 'warning',
        message: `Item "${itemLabel}" is marked as not anchored in an NDC or national strategy. ETF BTR guidelines prioritize anchored actions.`,
        ruleCode: 'SPBR-03',
      });
    }

    if (!item.expectedUseAndImpact?.trim()) {
      issues.push({
        id: `QC-F1A-IMP-${item.id}`,
        formType: 'Form 1A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'expectedUseAndImpact',
        severity: 'warning',
        message: `Expected use, impact, and estimated results should be articulated for "${itemLabel}".`,
        ruleCode: 'SPBR-04',
      });
    }
  });

  // --- 3. Form 2A Checks (Capacity Building Support Needed) ---
  (task.capacityNeeded || []).forEach((item, index) => {
    const itemLabel = item.activityTitle || `Capacity Item #${index + 1}`;

    if (!item.activityTitle?.trim()) {
      issues.push({
        id: `QC-F2A-TIT-${item.id}`,
        formType: 'Form 2A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'activityTitle',
        severity: 'error',
        message: `Activity/Programme/Project title is missing in Form 2A (${itemLabel}).`,
        ruleCode: 'SPBR-04',
      });
    }

    const staffTarget = item.targetStaffUnits || item.targetAudience || '';
    if (!staffTarget.trim()) {
      issues.push({
        id: `QC-F2A-STF-${item.id}`,
        formType: 'Form 2A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'targetStaffUnits',
        severity: 'error',
        message: `Target Staff / Units is required for capacity request "${itemLabel}".`,
        ruleCode: 'SPBR-04',
      });
    }

    if (item.anchoredInNDC === 'Yes' && !item.strategyName?.trim()) {
      issues.push({
        id: `QC-F2A-NDC-${item.id}`,
        formType: 'Form 2A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'strategyName',
        severity: 'error',
        message: `Please specify the exact name of the national strategy/action plan for "${itemLabel}".`,
        ruleCode: 'SPBR-03',
      });
    }
  });

  // --- 4. Form 3A Checks (Technological Support Needed) ---
  (task.techNeeded || []).forEach((item, index) => {
    const itemLabel = item.technologyType || `Tech Item #${index + 1}`;

    if (!item.technologyType?.trim()) {
      issues.push({
        id: `QC-F3A-TYP-${item.id}`,
        formType: 'Form 3A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'technologyType',
        severity: 'error',
        message: `Type of technology is missing in Form 3A (${itemLabel}).`,
        ruleCode: 'SPBR-04',
      });
    }

    if (!item.objective?.trim()) {
      issues.push({
        id: `QC-F3A-OBJ-${item.id}`,
        formType: 'Form 3A',
        itemId: item.id,
        itemTitle: itemLabel,
        field: 'objective',
        severity: 'error',
        message: `Objective is required for technology support request "${itemLabel}".`,
        ruleCode: 'SPBR-04',
      });
    }
  });

  // --- 5. Form 4 Checks (Open-Ended Questions) ---
  if (task.form4?.hasAssumptions === 'Yes' && !task.form4?.assumptionsDescription?.trim()) {
    issues.push({
      id: 'QC-F4-ASSUMP',
      formType: 'Form 4',
      field: 'assumptionsDescription',
      severity: 'error',
      message: 'You indicated assumptions were made (Question 1 = Yes). Please describe the assumptions made (Question 2).',
      ruleCode: 'SPBR-05',
    });
  }

  if (!task.form4?.mainBarriers?.trim()) {
    issues.push({
      id: 'QC-F4-BARRIERS',
      formType: 'Form 4',
      field: 'mainBarriers',
      severity: 'error',
      message: 'Please provide the main barriers to attracting international climate finance in your sector (Question 3).',
      ruleCode: 'SPBR-05',
    });
  }

  // Summary counts
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    infos,
  };
}
