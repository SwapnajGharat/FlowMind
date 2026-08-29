export type ScreenView = 
  | 'login_minimal'
  | 'signin_card'
  | 'checklist'
  | 'assistant'
  | 'lab_finder'
  | 'product_analysis'
  | 'reports';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  section: 'Material Sourcing' | 'Laboratory Testing' | 'Documentation & Marking';
  status: 'pending' | 'in_progress' | 'complete';
  priority?: 'normal' | 'urgent';
  standardRef?: string;
  actionText?: string;
  actionType?: 'schedule' | 'review' | 'upload';
}

export interface AuditDeviation {
  section: string;
  title: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  clauseRef?: string;
  clauseDetail?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  isAuditReport?: boolean;
  standardRef?: string;
  deviationsCount?: number;
  deviations?: AuditDeviation[];
  actions?: {
    label: string;
    action: string;
    variant: 'primary' | 'secondary';
  }[];
}

export interface LabFacility {
  id: string;
  name: string;
  distance: string;
  distanceNum: number;
  address: string;
  pinCode: string;
  disciplines: string[];
  status: 'Active Accreditation' | 'Under Audit' | 'Renewal Pending';
  coordinates: { x: number; y: number }; // percentage on map
  phone: string;
  email: string;
  incharge: string;
  leadTimeDays: number;
}

export interface ProductAnalysisResult {
  matchedStandard: string;
  standardTitle: string;
  scheme: 'CRS (Compulsory Registration)' | 'ISI Mark (Scheme-I)' | 'Hallmarking' | 'BEE Star Rating';
  mandatoryDeadline: string;
  testingParameters: {
    title: string;
    clause: string;
    description: string;
  }[];
  regulatorySteps: {
    step: number;
    title: string;
    description: string;
  }[];
}
