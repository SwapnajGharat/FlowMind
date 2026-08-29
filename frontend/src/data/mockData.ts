import { ChecklistItem, LabFacility, ChatMessage, ProductAnalysisResult } from '../types';

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // Section 1: Material Sourcing
  {
    id: 'mat-1',
    title: 'Vendor Verification',
    description: 'Confirm ISO 9001 certification for primary suppliers.',
    section: 'Material Sourcing',
    status: 'pending',
  },
  {
    id: 'mat-2',
    title: 'Raw Material Traceability',
    description: 'Submit batch tracking documentation.',
    section: 'Material Sourcing',
    status: 'in_progress',
  },
  {
    id: 'mat-3',
    title: 'Environmental Compliance',
    description: 'RoHS and REACH declarations received.',
    section: 'Material Sourcing',
    status: 'complete',
  },
  // Section 2: Laboratory Testing
  {
    id: 'lab-1',
    title: 'Thermal Stress Test',
    description: 'Requires BIS recognized lab submission.',
    section: 'Laboratory Testing',
    status: 'pending',
    priority: 'normal',
    actionText: 'SCHEDULE',
    actionType: 'schedule',
  },
  {
    id: 'lab-2',
    title: 'Electrical Safety',
    description: 'IS 302-1 compliance testing pending review.',
    section: 'Laboratory Testing',
    status: 'pending',
    priority: 'urgent',
    actionText: 'REVIEW FINDINGS',
    actionType: 'review',
    standardRef: 'IS 302-1:2008',
  },
  // Additional items to make the 8 of 20 realistic
  {
    id: 'doc-1',
    title: 'Factory Quality Audit Manual',
    description: 'Scheme of Testing and Inspection (STI) adherence verified.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
  {
    id: 'doc-2',
    title: 'ISI Standard Mark Stenciling',
    description: 'Label typography and license number (CM/L) artwork approved.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
  {
    id: 'doc-3',
    title: 'Calibration Certificates',
    description: 'Master pressure gauges and multimeters NABL calibrated.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
  {
    id: 'doc-4',
    title: 'Component Critical List (CCL)',
    description: 'Safety-critical components cataloged with test certs.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
  {
    id: 'doc-5',
    title: 'Declaration of Conformity',
    description: 'Signed Form IV compliance undertaking by Plant Head.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
  {
    id: 'doc-6',
    title: 'Packaging Drop & Impact Verification',
    description: 'IS 7028 compliant drop test reports validated.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
  {
    id: 'doc-7',
    title: 'Warranty & Instruction Manual Audit',
    description: 'Dual language (Hindi/English) cautionary markings checked.',
    section: 'Documentation & Marking',
    status: 'complete',
  },
];

export const LAB_FACILITIES: LabFacility[] = [
  {
    id: 'lab-nth',
    name: 'National Test House (NR)',
    distance: '2.4 km',
    distanceNum: 2.4,
    address: 'Kamla Nehru Nagar, Ghaziabad, Uttar Pradesh 201002',
    pinCode: '201002',
    disciplines: ['Mechanical', 'Chemical', 'Electrical'],
    status: 'Active Accreditation',
    coordinates: { x: 33, y: 50 },
    phone: '+91 120 278 9845',
    email: 'nr.director@nth.gov.in',
    incharge: 'Dr. S. K. Sharma (Joint Director)',
    leadTimeDays: 7,
  },
  {
    id: 'lab-bis-central',
    name: 'BIS Central Laboratory',
    distance: '5.1 km',
    distanceNum: 5.1,
    address: 'Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP',
    pinCode: '201010',
    disciplines: ['Textiles', 'Metallurgical'],
    status: 'Active Accreditation',
    coordinates: { x: 67, y: 34 },
    phone: '+91 120 417 8200',
    email: 'cl-bis@bis.gov.in',
    incharge: 'Er. Rajeshwari Devi (Scientist F)',
    leadTimeDays: 5,
  },
  {
    id: 'lab-spectro',
    name: 'Spectro Analytical Labs',
    distance: '8.7 km',
    distanceNum: 8.7,
    address: 'E-41, Okhla Industrial Area, Phase II, New Delhi 110020',
    pinCode: '110020',
    disciplines: ['Biological', 'Food & Water'],
    status: 'Active Accreditation',
    coordinates: { x: 50, y: 68 },
    phone: '+91 11 4052 4470',
    email: 'compliance@spectrolabs.com',
    incharge: 'Mr. Arvind Gupta (Lab Head)',
    leadTimeDays: 4,
  },
  {
    id: 'lab-shriram',
    name: 'Shriram Institute for Industrial Research',
    distance: '11.2 km',
    distanceNum: 11.2,
    address: '19, University Road, Delhi 110007',
    pinCode: '110007',
    disciplines: ['Chemical', 'Electrical', 'Biological'],
    status: 'Active Accreditation',
    coordinates: { x: 74, y: 44 },
    phone: '+91 11 2766 7267',
    email: 'testing@shriraminstitute.org',
    incharge: 'Dr. Neha Verma (Chief Scientist)',
    leadTimeDays: 8,
  },
  {
    id: 'lab-rt-north',
    name: 'Regional Testing Laboratory (BIS Northern)',
    distance: '14.5 km',
    distanceNum: 14.5,
    address: 'Sector 27-B, Madhya Marg, Chandigarh / NCR Branch',
    pinCode: '160019',
    disciplines: ['Mechanical', 'Electrical', 'Textiles'],
    status: 'Active Accreditation',
    coordinates: { x: 25, y: 28 },
    phone: '+91 172 265 0290',
    email: 'nro@bis.gov.in',
    incharge: 'Shri Vikram Malhotra',
    leadTimeDays: 10,
  },
  {
    id: 'lab-tuv',
    name: 'TUV Rheinland India Testing Centre',
    distance: '18.3 km',
    distanceNum: 18.3,
    address: 'Plot 27B, Udyog Vihar Phase IV, Gurugram 122016',
    pinCode: '122016',
    disciplines: ['Electrical', 'Mechanical', 'Biological'],
    status: 'Active Accreditation',
    coordinates: { x: 18, y: 75 },
    phone: '+91 124 456 9900',
    email: 'lab.in@tuv.com',
    incharge: 'Mr. K. Narayanan',
    leadTimeDays: 6,
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '10:42 AM',
    text: 'Can you audit the attached technical specifications for the new industrial pump series against IS 5120:1977?',
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    timestamp: '10:42 AM',
    isAuditReport: true,
    standardRef: 'IS 5120:1977',
    deviationsCount: 2,
    text: 'I have reviewed the provided technical specifications for the industrial pump series. The analysis indicates 2 Critical Deviations that require immediate attention prior to certification submission.',
    deviations: [
      {
        section: 'Section 4: Materials',
        title: 'Cast Iron Grade Verification',
        status: 'pass',
        description: 'Cast Iron components meet grade FG 200 requirement.',
        clauseRef: 'Clause 4.1.2 - Material specifications for casing and impellers',
        clauseDetail: 'Materials for casings of non-clog and centrifugal pumps shall conform to IS 210 Grade FG 200 or higher. Chemical composition verified: Carbon 3.0-3.3%, Silicon 1.8-2.2%. Tensile strength test achieved 215 MPa (threshold 200 MPa).'
      },
      {
        section: 'Section 5.2: Hydrostatic Test',
        title: 'Hydrostatic Test Pressure Threshold',
        status: 'fail',
        description: 'Spec states 1.2x working pressure. Standard mandates 1.5x working pressure.',
        clauseRef: 'Clause 5.2.1 - Hydrostatic pressure testing of casing',
        clauseDetail: 'Every pump casing shall withstand without leakage or failure a hydrostatic test pressure of at least 1.5 times the maximum allowable working pressure or 2.0 times the duty head pressure, whichever is higher, sustained for a minimum duration of not less than 15 minutes.'
      },
      {
        section: 'Section 7: Marking',
        title: 'Mandatory ISI Mark Dimensions & Data Plate',
        status: 'warning',
        description: 'Missing mandatory ISI Standard Mark dimensional requirements in technical drawing.',
        clauseRef: 'Clause 7.1 & 7.2 - Marking and Identification Plates',
        clauseDetail: 'The pump casing or nameplate shall bear the Standard Mark as approved by the Bureau of Indian Standards, displaying: (a) IS Number: IS 5120, (b) License Number: CM/L-XXXXXXX, (c) Rated capacity in m³/hr, (d) Total head in meters, and (e) Direction of rotation arrow cast in relief.'
      },
      {
        section: 'Section 6: Performance',
        title: 'Hydraulic Efficiency & Tolerances',
        status: 'pass',
        description: 'Efficiency curves align with declared values within tolerance limits.',
        clauseRef: 'Clause 6.3 - Overall pump efficiency tolerances',
        clauseDetail: 'Efficiency at guaranteed duty point shall be within Class B tolerance (-2.5% of declared efficiency) as defined in Table 3 of IS 5120:1977. Provided test log shows 78.4% efficiency against 80.0% nominal, adhering to the limit.'
      }
    ],
    actions: [
      { label: 'Generate Report', action: 'generate_report', variant: 'secondary' },
      { label: 'Draft Action Plan', action: 'draft_action_plan', variant: 'primary' }
    ]
  }
];

export const CATEGORY_STANDARDS_MAP: Record<string, ProductAnalysisResult> = {
  machinery: {
    matchedStandard: 'IS 5120:1977',
    standardTitle: 'Technical Requirements for Rotodynamic Special Purpose Pumps',
    scheme: 'ISI Mark (Scheme-I)',
    mandatoryDeadline: 'Mandatory under Quality Control Order (QCO)',
    testingParameters: [
      { title: 'Hydrostatic Pressure Test', clause: 'Cl. 5.2', description: 'Subject casing to 1.5x shutoff pressure for 15 minutes minimum.' },
      { title: 'Cavitation & NPSH Test', clause: 'Cl. 6.4', description: 'Net positive suction head determination at 100% and 120% duty flow.' },
      { title: 'Vibration & Balancing Test', clause: 'Cl. 8.1', description: 'Peak vibration velocity < 4.5 mm/s RMS under full operating speed.' },
      { title: 'Dynamic Shaft Deflection', clause: 'Cl. 5.6', description: 'Total indicator reading at stuffing box face < 0.05 mm.' }
    ],
    regulatorySteps: [
      { step: 1, title: 'Portal Application', description: 'Submit Form-I on BIS Manakonline portal under Scheme-I.' },
      { step: 2, title: 'In-House Testing Setup', description: 'Verify testing equipment as per Scheme of Testing and Inspection (STI).' },
      { step: 3, title: 'Factory Audit by BIS Officer', description: 'Physical inspection and independent sealing of production samples.' },
      { step: 4, title: 'Grant of License (CM/L)', description: 'Receive unique license number to stencil the ISI Standard Mark.' }
    ]
  },
  electronics: {
    matchedStandard: 'IS 13252 (Part 1): 2010 / IEC 60950-1',
    standardTitle: 'Information Technology Equipment - Safety - General Requirements',
    scheme: 'CRS (Compulsory Registration)',
    mandatoryDeadline: 'Mandatory under MeitY Compulsory Registration Scheme',
    testingParameters: [
      { title: 'Electric Strength (Hi-Pot)', clause: 'Cl. 5.2.2', description: 'Apply 3000 V AC between primary power and grounded chassis.' },
      { title: 'Touch Current & Earth Leakage', clause: 'Cl. 5.1', description: 'Protective conductor current not exceeding 3.5 mA RMS.' },
      { title: 'Flammability & Heat Resistance', clause: 'Cl. 4.7', description: 'Enclosure material must meet UL94 V-1 or V-0 rating.' },
      { title: 'Abnormal Operation & Faults', clause: 'Cl. 5.3', description: 'Component single-fault simulation without smoke or fire propagation.' }
    ],
    regulatorySteps: [
      { step: 1, title: 'CRS Portal Registration', description: 'Create applicant profile on www.crsbis.in.' },
      { step: 2, title: 'Testing at BIS Recognized Lab', description: 'Submit 2 production units to an accredited lab (e.g. NTH or Spectro).' },
      { step: 3, title: 'Test Report Generation', description: 'Obtain compliant test report issued with QR-code verification.' },
      { step: 4, title: 'Registration Number Grant', description: 'Receive R-number and affix the BIS standard words with registration tag.' }
    ]
  },
  chemicals: {
    matchedStandard: 'IS 10112:2018',
    standardTitle: 'Chemical Products & Industrial Solvents Specification',
    scheme: 'ISI Mark (Scheme-I)',
    mandatoryDeadline: 'Mandatory under Department of Chemicals & Petrochemicals QCO',
    testingParameters: [
      { title: 'Purity by Gas Chromatography', clause: 'Cl. 3.2', description: 'Assay of active chemical entity minimum 99.2% by wt.' },
      { title: 'Moisture Content (Karl Fischer)', clause: 'Cl. 4.1', description: 'Total water content maximum 0.05% by mass.' },
      { title: 'Heavy Metals (Lead & Cadmium)', clause: 'Cl. 4.5', description: 'Inductively Coupled Plasma testing < 5 ppm.' }
    ],
    regulatorySteps: [
      { step: 1, title: 'MSDS & Storage Filing', description: 'Submit Material Safety Data Sheets and warehouse safety layouts.' },
      { step: 2, title: 'Batch Sampling', description: 'BIS officer draws sealed samples from three distinct production batches.' },
      { step: 3, title: 'Reference Lab Audit', description: 'Chemical verification at Regional BIS Chemical Lab.' }
    ]
  },
  textiles: {
    matchedStandard: 'IS 15748:2007',
    standardTitle: 'Protective Clothing for Industrial Workers Exposed to Heat and Flame',
    scheme: 'ISI Mark (Scheme-I)',
    mandatoryDeadline: 'Mandatory under Ministry of Textiles Technical Textiles Order',
    testingParameters: [
      { title: 'Limited Flame Spread', clause: 'Cl. 6.1', description: 'No after-flame > 2 sec, no hole formation through innermost layer.' },
      { title: 'Convective Heat Transmission', clause: 'Cl. 6.2', description: 'Heat transfer index HTI 24 minimum 7.0 seconds.' },
      { title: 'Tensile & Tear Strength', clause: 'Cl. 7.1', description: 'Warp and weft tensile breaking load minimum 800 N.' }
    ],
    regulatorySteps: [
      { step: 1, title: 'Fabric Quality Plan', description: 'Yarn denier and blend certification filing.' },
      { step: 2, title: 'Laboratory Burn Testing', description: 'Flame testing at BIS Central Laboratory Sahibabad.' },
      { step: 3, title: 'ISI Marking Authorization', description: 'Affixing woven ISI label to garments.' }
    ]
  },
  medical: {
    matchedStandard: 'IS 13450 (Part 1): 2018 / IEC 60601-1',
    standardTitle: 'Medical Electrical Equipment - General Requirements for Basic Safety',
    scheme: 'ISI Mark (Scheme-I)',
    mandatoryDeadline: 'Mandatory under CDSCO / BIS Medical Device Regulations',
    testingParameters: [
      { title: 'Patient Leakage Current', clause: 'Cl. 8.7.4', description: 'Type BF applied part current < 100 μA in single fault condition.' },
      { title: 'Defibrillation Protection', clause: 'Cl. 8.5.5', description: 'Equipment withstands 5 kV defibrillator discharge without damage.' },
      { title: 'Electromagnetic Compatibility (EMC)', clause: 'Cl. 17', description: 'Conformity with IEC 60601-1-2 emission and immunity thresholds.' }
    ],
    regulatorySteps: [
      { step: 1, title: 'Risk Management File (ISO 14971)', description: 'Submission of clinical hazard analysis to BIS.' },
      { step: 2, title: 'Bio-compatibility & Electrical Audit', description: 'Testing in specialized NABL/BIS testing facility.' },
      { step: 3, title: 'Dual CDSCO / BIS Registration', description: 'Coordinated compliance signoff.' }
    ]
  }
};
