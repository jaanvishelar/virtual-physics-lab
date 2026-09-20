export interface Experiment {
  id: string;
  number: string;
  slug: string;
  title: string;
  classes: string;
  standard?: 9 | 10 | 11 | 12;
  status?: 'available' | 'coming-soon';
  category: string;
  description: string;
  aim: string;
  formula: string;
  formulaMeaning: string;
  apparatus: string[];
  variables?: {
    independent: string;
    dependent: string;
    controlled: string;
  };
  observationHeaders?: string[];
  sampleObservations?: Array<Record<string, string>>;
  graphType?: string;
  precautions?: string[];
  vivaQuestions?: Array<{ q: string; a: string }>;
}

export interface WorkflowStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  apparatusSample: string;
  iconName: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  category: string;
  badge: string;
  details: {
    overview: string;
    keyPoints: string[];
    sampleFormulasOrData?: Array<{ label: string; value: string; unit?: string }>;
  };
}

export interface DoubtDraft {
  studentName?: string;
  studentClass: string;
  experimentTopic: string;
  doubtCategory: 'Formula Application' | 'Graph Interpretation' | 'Apparatus Zero Error' | 'Observation Anomaly' | 'Calculation Steps' | 'General Practical Theory';
  description: string;
}

export interface ObservationReading {
  id: string;
  srNo: number;
  voltage: number;
  current: number;
  resistance: number;
  timestamp: number;
}

export interface PendulumObservation {
  id: string;
  srNo: number;
  location: 'Ground' | '4th Floor';
  height: number;
  length: number; // L in metres
  oscillations: number; // N
  time: number; // total time t in seconds
  timestamp: number;
}

export interface HookeObservation {
  id: string;
  srNo: number;
  massGrams: number; // Mass in g
  massKg: number; // Mass m in kg
  force: number; // Applied force F = mg in N
  extensionMeters: number; // Extension x in m
  extensionCm: number; // Extension x in cm
  springConstant: number | null; // k = F/x in N/m, null if zero load
  timestamp: number;
}

export interface ProjectileObservation {
  id: string;
  srNo: number;
  velocity: number; // initial velocity u in m/s
  angle: number; // projection angle θ in degrees
  launchHeight?: number; // launch height h in m (0 = ground, >0 = elevated)
  isElevated?: boolean;
  timeOfFlight: number; // T in s
  maxHeight: number; // H in m
  range: number; // R in m
  timestamp: number;
}

export interface ConvexLensObservation {
  id: string;
  trialNo: number;
  u: number; // signed object distance in cm (e.g. -60)
  v: number; // signed image distance in cm (e.g. +30)
  oneOverU: number; // 1/u in cm⁻¹
  oneOverV: number; // 1/v in cm⁻¹
  focalLength: number; // f in cm calculated from 1 / (1/v - 1/u)
  magnification: number; // m = v/u
  nature: string; // e.g. 'Real, Inverted, Diminished'
  timestamp: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VivaQuestionItem {
  id: string;
  question: string;
  answer: string;
  concept: string;
}

export interface ApparatusDetail {
  id: string;
  name: string;
  role: string;
  connectionType: 'Series' | 'Parallel' | 'Power' | 'Control' | 'Conductor';
  spec: string;
}

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  classGrade?: string; // e.g. "Class 9", "Class 10", "Class 11", "Class 12"
  division?: string;   // e.g. "A", "B", "C"
  role: UserRole;
  createdAt: string;
}

export interface ExperimentSubmission {
  id?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classGrade: string;
  division: string;
  experimentSlug: string;
  experimentTitle: string;
  attemptNumber: number;
  inputs: Record<string, number | string | boolean>;
  calculatedResults: Record<string, number | string>;
  observations?: Array<Record<string, any>>;
  notes?: string;
  submittedAt: string; // ISO string
}

export type ActiveNavSection = 
  | 'home' 
  | 'labs' 
  | 'how-it-works' 
  | 'mentoring' 
  | 'resources' 
  | 'about' 
  | 'feedback'
  | 'student-dashboard'
  | 'teacher-dashboard'
  | 'login'
  | 'register';
