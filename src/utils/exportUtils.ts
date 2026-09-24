import { SupportCollectionTask } from '../types';

export function exportSupportTaskToCSV(task: SupportCollectionTask): string {
  const escapeCsv = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const sectorName = task.generalInfo.sector || 'Energy';
  const lines: string[] = [];

  lines.push(`Data Collection Form for ${sectorName} Sector Support Needed & Received - ${task.generalInfo.ministryName}`);
  lines.push('');
  lines.push('');
  lines.push('General Information');
  lines.push(`Name of compiler,${escapeCsv(task.generalInfo.compilerName)}`);
  lines.push(`Date of compilation,${escapeCsv(task.generalInfo.compilationDate)}`);
  lines.push(`The calendar year that this data covers,${escapeCsv(task.generalInfo.reportingYear)}`);
  lines.push(`Contact info of the compiler,${escapeCsv(task.generalInfo.compilerContact)} / ${escapeCsv(task.generalInfo.compilerEmail)}`);
  lines.push(`Ministry / Entity,${escapeCsv(task.generalInfo.ministryName)}`);
  lines.push(`Sector,${escapeCsv(task.generalInfo.sector)}`);
  lines.push(`Collection Task ID,${escapeCsv(task.id)}`);
  lines.push(`Status,${escapeCsv(task.status)}`);
  lines.push('');
  lines.push('');

  // Form 1A: Financial Support Needed
  lines.push(`Form 1A: ${sectorName}-Sector Financial Support Needed`);
  lines.push([
    'Title of Activity/Programme/Project',
    'Programme/Project Description',
    'Specific Need or Request',
    'Amount Requested in USD',
    'Expected Time Frame for the Activity',
    'Expected Financial Instrument (Loan/Grant/Other)',
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Estimated Gap',
    'Whether the activity is anchored in  a national strategy and/or an NDC (Yes/No)',
    'If the activity is anchored in a national strategy/action plan please mention its exact name',
    'Urgency (High/Medium/Low)',
    'Expected use, impact and estimated results',
    'Methodologies /Assumptions',
    'Additional Information',
  ].join(','));

  task.financialNeeded.forEach((item) => {
    lines.push([
      escapeCsv(item.title),
      escapeCsv(item.description),
      escapeCsv(item.specificNeed),
      escapeCsv(item.amountRequestedUSD),
      escapeCsv(item.expectedTimeFrame),
      escapeCsv(item.expectedFinancialInstrument),
      escapeCsv(item.supportType),
      escapeCsv(item.estimatedGapUSD),
      escapeCsv(item.anchoredInNDC),
      escapeCsv(item.strategyName),
      escapeCsv(item.urgency),
      escapeCsv(item.expectedUseAndImpact),
      escapeCsv(item.methodologiesAndAssumptions),
      escapeCsv(item.additionalInformation),
    ].join(','));
  });

  lines.push('');
  lines.push('');

  // Form 1B: Financial Support Received
  lines.push(`Form 1B: ${sectorName}- Sector Financial Support Received`);
  lines.push([
    'Title of Activity/Programme/Project',
    'Programme/Project Description',
    'Funding Source (e.g., Treasury, Grants "Specify Donor", Loans "Specify Lender", Self-financing, etc.)',
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Amount Received in USD',
    'Amount Spent in USD',
    'Remaining Funds in USD',
    'Disbursement Date',
    'Purpose / Activity Supported',
    'Financial Instrument (Loan/Grant/Other)',
    'Status of Finance (Committed/ongoing/implemented)',
    'Progress (%)',
    'Time Frame',
    'Start Date',
    'End Date',
    'Status of the Activity (Planned/Ongoing/Completed)',
    'Use, Impact and Quantitative results (Benefits)',
    'Additional Information',
  ].join(','));

  task.financialReceived.forEach((item) => {
    lines.push([
      escapeCsv(item.title),
      escapeCsv(item.description),
      escapeCsv(item.fundingSource),
      escapeCsv(item.supportType),
      escapeCsv(item.amountReceivedUSD),
      escapeCsv(item.amountSpentUSD),
      escapeCsv(item.amountReceivedUSD - item.amountSpentUSD),
      escapeCsv(item.disbursementDate),
      escapeCsv(item.purpose),
      escapeCsv(item.financialInstrument),
      escapeCsv(item.statusOfFinance),
      escapeCsv(item.progressPercent),
      escapeCsv(item.timeFrame),
      escapeCsv(item.startDate),
      escapeCsv(item.endDate),
      escapeCsv(item.activityStatus),
      escapeCsv(item.useImpactAndResults),
      escapeCsv(item.additionalInformation),
    ].join(','));
  });

  // Check if any financial received item has itemized expenses
  const allExpenses = task.financialReceived.flatMap((item) => 
    (item.expenses || []).map((exp) => ({ ...exp, projectTitle: item.title, projectId: item.id }))
  );

  if (allExpenses.length > 0) {
    lines.push('');
    lines.push(`Form 1B (Annex): Itemized Expenditure Lines & Audit Justification (${sectorName} Sector)`);
    lines.push([
      'Project ID',
      'Project Title',
      'Expense Line ID',
      'Category',
      'Description / Specific Activity',
      'Vendor / Contractor / Recipient',
      'Invoice / Contract Reference #',
      'Date',
      'Amount (USD)',
      'Status',
      'Notes / Deliverables',
    ].join(','));

    allExpenses.forEach((exp) => {
      lines.push([
        escapeCsv(exp.projectId),
        escapeCsv(exp.projectTitle),
        escapeCsv(exp.id),
        escapeCsv(exp.category),
        escapeCsv(exp.description),
        escapeCsv(exp.vendorOrRecipient),
        escapeCsv(exp.invoiceOrReference),
        escapeCsv(exp.date),
        escapeCsv(exp.amountUSD),
        escapeCsv(exp.status),
        escapeCsv(exp.notes),
      ].join(','));
    });
  }

  lines.push('');
  lines.push('');

  // Form 2A: Capacity Building Support Needed
  lines.push(`Form 2A: ${sectorName}-Sector Capacity Building Support Needed`);
  lines.push([
    'Activity/Programme/Project',
    'Target Staff / Units',
    'Specific Need or Request',
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Expected Time Frame',
    'Whether the activity is anchored in  a national strategy and/or an NDC (Yes/No)',
    'If the activity is anchored in a national strategy/action plan please mention its exact name',
    'Urgency (High/Medium/Low)',
    'Expected use, impact and estimated results',
    'Methodologies /Assumptions',
    'Additional Information',
  ].join(','));

  task.capacityNeeded.forEach((item) => {
    lines.push([
      escapeCsv(item.activityTitle),
      escapeCsv(item.targetStaffUnits),
      escapeCsv(item.specificNeed),
      escapeCsv(item.supportType),
      escapeCsv(item.expectedTimeFrame),
      escapeCsv(item.anchoredInNDC),
      escapeCsv(item.strategyName),
      escapeCsv(item.urgency),
      escapeCsv(item.expectedUseAndImpact),
      escapeCsv(item.methodologiesAndAssumptions),
      escapeCsv(item.additionalInformation),
    ].join(','));
  });

  lines.push('');
  lines.push('');

  // Form 2B: Capacity Building Support Received
  lines.push(`Form 2B: ${sectorName}- Sector Capacity Building Support Received`);
  lines.push([
    'Training Topic',
    'Support Provider',
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Date of Receiving Support',
    'Recipient Entity',
    'Number of Trained Personnel',
    'Satisfaction (1-5)',
    'Progress (%)',
    'Time Frame',
    'Start Date',
    'End Date',
    'Status of the Activity (Planned/Ongoing/Completed)',
    'Use, Impact and Quantitative results(Benefits)',
    'Additional Information',
  ].join(','));

  task.capacityReceived.forEach((item) => {
    lines.push([
      escapeCsv(item.trainingTopic),
      escapeCsv(item.supportProvider),
      escapeCsv(item.supportType),
      escapeCsv(item.dateReceived),
      escapeCsv(item.recipientEntity),
      escapeCsv(item.trainedPersonnelCount),
      escapeCsv(item.satisfactionRating),
      escapeCsv(item.progressPercent),
      escapeCsv(item.timeFrame),
      escapeCsv(item.startDate),
      escapeCsv(item.endDate),
      escapeCsv(item.activityStatus),
      escapeCsv(item.useImpactAndResults),
      escapeCsv(item.additionalInformation),
    ].join(','));
  });

  lines.push('');
  lines.push('');

  // Form 3A: Technological Support Needed
  lines.push(`Form 3A: ${sectorName}-Sector Technological Support Needed`);
  lines.push([
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Type of technology',
    'Objective',
    'Expected Time Frame',
    'Expected Use/Impact',
    'Programme/project description',
    'Additional Information',
  ].join(','));

  task.techNeeded.forEach((item) => {
    lines.push([
      escapeCsv(item.supportType),
      escapeCsv(item.technologyType),
      escapeCsv(item.objective),
      escapeCsv(item.expectedTimeFrame),
      escapeCsv(item.expectedUseAndImpact),
      escapeCsv(item.programmeDescription),
      escapeCsv(item.additionalInformation),
    ].join(','));
  });

  lines.push('');
  lines.push('');

  // Form 3B: Technological Support Received
  lines.push(`Form 3B: ${sectorName}- Sector Technological Support Received`);
  lines.push([
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Type of technology',
    'Support Provider',
    'Type of support (Mitigation/Adaptation/Crosscutting)',
    'Date of Receiving Support',
    'Recipient Entity',
    'Number of Trained Personnel',
    'Satisfaction (1-5)',
    'Progress (%)',
    'Time Frame',
    'Start Date',
    'End Date',
    'Status of the Activity (Planned/Ongoing/Completed)',
    'Use, Impact and Quantitative results(Benefits)',
    'Additional Information',
  ].join(','));

  task.techReceived.forEach((item) => {
    lines.push([
      escapeCsv(item.supportType),
      escapeCsv(item.technologyType),
      escapeCsv(item.supportProvider),
      escapeCsv(item.supportType),
      escapeCsv(item.dateReceived),
      escapeCsv(item.recipientEntity),
      escapeCsv(item.trainedPersonnelCount),
      escapeCsv(item.satisfactionRating),
      escapeCsv(item.progressPercent),
      escapeCsv(item.timeFrame),
      escapeCsv(item.startDate),
      escapeCsv(item.endDate),
      escapeCsv(item.activityStatus),
      escapeCsv(item.useImpactAndResults),
      escapeCsv(item.additionalInformation),
    ].join(','));
  });

  lines.push('');
  lines.push('');

  // Form 4: Open-Ended Questions
  lines.push('Form 4: Open-Ended Questions');
  lines.push('');
  lines.push('1) Have you made any assumptions while completing this form or reporting the information?');
  lines.push(escapeCsv(task.form4.hasAssumptions));
  lines.push('');
  lines.push('2) If yes, please describe the assumptions made.');
  lines.push('(e.g. projected costs, estimated staff needs, anticipated funding availability, unofficial sources used)');
  lines.push(escapeCsv(task.form4.assumptionsDescription));
  lines.push('');
  lines.push(`3) In your view, what are the main barriers to attracting international finance to support projects in the ${sectorName}- sector (particularly those involving MRV systems)?`);
  lines.push(escapeCsv(task.form4.mainBarriers));
  if (task.form4.notesOnMRVSystems) {
    lines.push(escapeCsv(task.form4.notesOnMRVSystems));
  }

  return lines.join('\n');
}

export function exportNationalDatasetToCSV(tasks: SupportCollectionTask[]): string {
  const escapeCsv = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines: string[] = [];
  lines.push('ARAB REPUBLIC OF EGYPT - CLIMATE CHANGE CENTRAL DEPARTMENT (EEAA)');
  lines.push('NATIONAL BIENNIAL TRANSPARENCY REPORT (BTR-1) - CONSOLIDATED SUPPORT NEEDED & RECEIVED DATASET');
  lines.push(`Generated on: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('--- SUMMARY BY LINE MINISTRY & COLLECTION TASK ---');
  lines.push(['Task Code', 'Ministry', 'Sector', 'Reporting Year', 'Direction', 'Status', 'Financial Needed (USD)', 'Financial Received (USD)', 'Capacity Items', 'Tech Items'].join(','));

  tasks.forEach((t) => {
    const fnTotal = t.financialNeeded.reduce((acc, item) => acc + (item.amountRequestedUSD || 0), 0);
    const frTotal = t.financialReceived.reduce((acc, item) => acc + (item.amountReceivedUSD || 0), 0);
    const capTotal = t.capacityNeeded.length + t.capacityReceived.length;
    const techTotal = t.techNeeded.length + t.techReceived.length;
    lines.push([
      escapeCsv(t.taskCode),
      escapeCsv(t.generalInfo.ministryName),
      escapeCsv(t.generalInfo.sector),
      escapeCsv(t.reportingYear),
      escapeCsv(t.reportingDirection),
      escapeCsv(t.status),
      escapeCsv(fnTotal),
      escapeCsv(frTotal),
      escapeCsv(capTotal),
      escapeCsv(techTotal),
    ].join(','));
  });

  lines.push('');
  lines.push('--- ALL FINANCIAL SUPPORT NEEDED ENTRIES ---');
  lines.push(['Task Code', 'Ministry', 'Sector', 'Title', 'Amount Requested (USD)', 'Instrument', 'Type', 'Urgency', 'NDC Anchored'].join(','));
  tasks.forEach((t) => {
    t.financialNeeded.forEach((item) => {
      lines.push([
        escapeCsv(t.taskCode),
        escapeCsv(t.generalInfo.ministryName),
        escapeCsv(t.generalInfo.sector),
        escapeCsv(item.title),
        escapeCsv(item.amountRequestedUSD),
        escapeCsv(item.expectedFinancialInstrument),
        escapeCsv(item.supportType),
        escapeCsv(item.urgency),
        escapeCsv(item.anchoredInNDC),
      ].join(','));
    });
  });

  lines.push('');
  lines.push('--- ALL FINANCIAL SUPPORT RECEIVED ENTRIES ---');
  lines.push(['Task Code', 'Ministry', 'Sector', 'Title', 'Funding Source', 'Amount Received (USD)', 'Amount Spent (USD)', 'Instrument', 'Type', 'Status'].join(','));
  tasks.forEach((t) => {
    t.financialReceived.forEach((item) => {
      lines.push([
        escapeCsv(t.taskCode),
        escapeCsv(t.generalInfo.ministryName),
        escapeCsv(t.generalInfo.sector),
        escapeCsv(item.title),
        escapeCsv(item.fundingSource || item.supportProvider || 'Unspecified'),
        escapeCsv(item.amountReceivedUSD),
        escapeCsv(item.amountSpentUSD),
        escapeCsv(item.financialInstrument),
        escapeCsv(item.supportType),
        escapeCsv(item.financeStatus || item.statusOfFinance || 'Disbursed'),
      ].join(','));
    });
  });

  return lines.join('\n');
}

export function downloadCSV(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

