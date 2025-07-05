
export interface Symptom {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  icon: string;
  color: string;
  category: 'pain' | 'respiratory' | 'digestive' | 'neurological' | 'cardiac' | 'dermatological' | 'urological' | 'gynecological' | 'psychological' | 'general';
  questions: Question[];
}

export interface Question {
  id: string;
  text: {
    fr: string;
    ar: string;
  };
  type: 'select' | 'multiselect' | 'text' | 'number' | 'scale';
  options?: {
    fr: string;
    ar: string;
    value: string;
  }[];
  required?: boolean;
}

export interface SymptomDetail {
  answers: Record<string, any>;
  notes?: string;
  severity?: number;
}

export interface PatientData {
  name: string;
  age: number;
  consultationTime: string;
}

export interface SOAPSummary {
  patient: PatientData;
  chiefComplaint: string;
  associatedSymptoms: string[];
  relevantHistory: string[];
  currentTreatment?: string[];
}
