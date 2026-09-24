export type SupportType = 'Mitigation' | 'Adaptation' | 'Crosscutting';
export type FinancialInstrument = 
  | 'In-kind' 
  | 'Direct Investment' 
  | 'Guarantee' 
  | 'Equity' 
  | 'Loan' 
  | 'Concessional Loan' 
  | 'Grant';
export type UrgencyLevel = 'High' | 'Medium' | 'Low';
export type ActivityStatus = 'Planned' | 'Ongoing' | 'Completed' | 'Suspended';
export type FinanceStatus = 'Committed' | 'Disbursed' | 'Ongoing' | 'Implemented';
export type SatisfactionRating = 1 | 2 | 3 | 4 | 5;

export type WorkflowStatus = 
  | 'Draft' 
  | 'QC_Pending'
  | 'QC_Passed'
  | 'Submitted_To_Advisor'
  | 'Under_Advisor_Review'
  | 'Advisor_Approved'
  | 'Coordinator_Review'
  | 'Approved_For_BTR'
  | 'Returned_For_Rework'
  | 'Overdue';

export type UserRole = 
  | 'Entity_Senior'
  | 'Data_Collector'
  | 'Support_Advisor'
  | 'System_Coordinator'
  | 'External_Expert';

export interface GeneralInformation {
  compilerName: string;
  compilationDate: string;
  reportingYear: number;
  compilerContact: string;
  compilerEmail: string;
  compilerPhone: string;
  compilerTitle: string;
  entityName: string;
  ministryName: string;
  sector: string;
  assignedAdvisor: string; // e.g. 'Ministry of Finance (MoF)' | 'MoPEDIC' | 'MFA'
  collectionTaskId: string;
  deadlineDate: string;
  startDate: string;
  reportingPeriodStart?: string;
  reportingPeriodEnd?: string;
  submissionDate?: string;
  dataCollectionStartDate?: string;
  priority?: UrgencyLevel;
  currencyCode?: string;
}

export interface FinancialSupportNeededItem {
  id: string;
  title: string;
  description: string;
  specificNeed: string;
  amountRequestedUSD: number;
  expectedTimeFrame: string;
  expectedFinancialInstrument: FinancialInstrument;
  supportType: SupportType;
  estimatedGapUSD: number;
  anchoredInNDC: 'Yes' | 'No';
  strategyName: string;
  urgency: UrgencyLevel;
  expectedUseAndImpact: string;
  methodologiesAndAssumptions: string;
  additionalInformation: string;
  status: 'Draft' | 'Validated' | 'Flagged';
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseDetailItem {
  id: string;
  category: string;
  description: string;
  date: string;
  amountUSD: number;
  vendorOrRecipient?: string;
  invoiceOrReference?: string;
  status?: 'Paid' | 'Committed' | 'Pending Verification';
  notes?: string;
}

export interface FinancialSupportReceivedItem {
  id: string;
  linkedNeededId?: string;
  title: string;
  description?: string;
  fundingSource?: string; // e.g. 'GCF', 'EBRD', 'EU Grant', 'Treasury'
  supportProvider?: string; // Alternate alias for funding source
  supportType: SupportType;
  amountReceivedUSD: number;
  amountSpentUSD: number;
  remainingFundsUSD: number; // auto-calculated
  disbursementDate?: string;
  dateReceived?: string;
  purpose?: string;
  financialInstrument: FinancialInstrument;
  statusOfFinance?: FinanceStatus;
  financeStatus?: FinanceStatus;
  progressPercent?: number;
  timeFrame?: string;
  startDate?: string;
  endDate?: string;
  activityStatus?: ActivityStatus;
  useImpactAndResults?: string;
  additionalInformation?: string;
  channel?: 'Bilateral' | 'Multilateral' | 'Regional' | 'Other';
  recipientEntity?: string;
  implementingEntity?: string;
  exchangeRate?: number;
  amountCommittedUSD?: number;
  expenses?: ExpenseDetailItem[];
}

export interface CapacityBuildingSupportNeededItem {
  id: string;
  activityTitle: string;
  targetStaffUnits?: string;
  targetAudience?: string;
  specificNeed?: string;
  supportType: SupportType;
  expectedTimeFrame: string;
  anchoredInNDC?: 'Yes' | 'No';
  strategyName?: string;
  urgency: UrgencyLevel;
  expectedUseAndImpact?: string;
  methodologiesAndAssumptions?: string;
  additionalInformation?: string;
  description?: string;
  estimatedCostUSD?: number;
  targetTrainedCount?: number;
  status: 'Draft' | 'Validated' | 'Flagged';
  createdAt?: string;
  updatedAt?: string;
}

export interface CapacityBuildingSupportReceivedItem {
  id: string;
  linkedNeededId?: string;
  trainingTopic: string;
  supportProvider: string; // e.g. 'UNDP', 'GIZ', 'UNEP'
  supportType: SupportType;
  dateReceived: string;
  recipientEntity: string;
  trainedPersonnelCount: number;
  satisfactionRating: SatisfactionRating;
  progressPercent: number;
  timeFrame: string;
  startDate: string;
  endDate: string;
  activityStatus: ActivityStatus;
  useImpactAndResults: string;
  additionalInformation: string;
}

export interface TechnologicalSupportNeededItem {
  id: string;
  supportType: SupportType;
  technologyType: string; // e.g. 'Continuous Emissions Monitoring Sensors', 'Solar Microgrid Hardware'
  objective: string;
  expectedTimeFrame: string;
  expectedUseAndImpact: string;
  programmeDescription: string;
  urgency: UrgencyLevel;
  anchoredInNDC: 'Yes' | 'No';
  additionalInformation: string;
  status: 'Draft' | 'Validated' | 'Flagged';
  createdAt: string;
  updatedAt: string;
}

export interface TechnologicalSupportReceivedItem {
  id: string;
  linkedNeededId?: string;
  supportType: SupportType;
  technologyType: string;
  supportProvider: string;
  dateReceived: string;
  recipientEntity: string;
  trainedPersonnelCount: number;
  satisfactionRating: SatisfactionRating;
  progressPercent: number;
  timeFrame: string;
  startDate: string;
  endDate: string;
  activityStatus: ActivityStatus;
  useImpactAndResults: string;
  additionalInformation: string;
}

export interface Form4OpenEnded {
  hasAssumptions: 'Yes' | 'No';
  assumptionsDescription: string;
  mainBarriers: string;
  notesOnMRVSystems: string;
}

export interface QCIssue {
  id: string;
  formType: 'General' | 'Form 1A' | 'Form 2A' | 'Form 3A' | 'Form 4';
  itemId?: string;
  itemTitle?: string;
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  ruleCode: string; // e.g., 'SPBR-03', 'SPBR-06'
}

export interface ReviewComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  entity: string;
  timestamp: string;
  formSection: string;
  content: string;
  isResolved: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  previousStatus?: WorkflowStatus;
  newStatus?: WorkflowStatus;
}

export type FormTypeKey = '1A' | '1B' | '2A' | '2B' | '3A' | '3B' | '4';

export interface AssignedMinistryFormConfig {
  ministryCode: string;
  ministryName: string;
  sector: string;
  assignedAdvisor: string;
  assignedForms: FormTypeKey[];
  focalPointName?: string;
  focalPointEmail?: string;
  focalPointPhone?: string;
  focalPointTitle?: string;
  customDueDate?: string;
  notes?: string;
}

export interface CreateCollectionTaskPayload {
  cycleTitle: string;
  reportingYear: number;
  taskCodePrefix: string;
  startDate: string;
  deadlineDate: string;
  reportingDirection: 'Internationally (UNFCCC BTR)' | 'Confidential (C) Nationally';
  priority: UrgencyLevel;
  instructions: string;
  defaultAdvisor: string;
  assignedMinistries: AssignedMinistryFormConfig[];
}

export interface SupportCollectionTask {
  id: string;
  taskCode: string;
  taskTitle?: string;
  reportingYear: number;
  status: WorkflowStatus;
  activeRole: UserRole;
  generalInfo: GeneralInformation;
  assignedForms?: FormTypeKey[];
  cycleId?: string;
  cycleTitle?: string;
  priority?: UrgencyLevel;
  instructions?: string;
  createdAt?: string;
  updatedAt?: string;
  financialNeeded: FinancialSupportNeededItem[];
  financialReceived: FinancialSupportReceivedItem[];
  capacityNeeded: CapacityBuildingSupportNeededItem[];
  capacityReceived: CapacityBuildingSupportReceivedItem[];
  techNeeded: TechnologicalSupportNeededItem[];
  techReceived: TechnologicalSupportReceivedItem[];
  form4: Form4OpenEnded;
  comments: ReviewComment[];
  auditLogs: AuditLogEntry[];
  submissionDate?: string;
  submittedBy?: string;
  reportingDirection?: 'Internationally (UNFCCC BTR)' | 'Confidential (C) Nationally';
}
