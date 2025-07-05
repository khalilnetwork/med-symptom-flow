
import { useState } from 'react';
import { MedicalHeader } from '@/components/MedicalHeader';
import { SymptomGrid } from '@/components/SymptomGrid';
import { SymptomModal } from '@/components/SymptomModal';
import { SummaryPanel } from '@/components/SummaryPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { Symptom, PatientData, SymptomDetail } from '@/types/medical';

const Index = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeSymptom, setActiveSymptom] = useState<Symptom | null>(null);
  const [symptomDetails, setSymptomDetails] = useState<Record<string, SymptomDetail>>({});
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [patientData, setPatientData] = useState<PatientData>({
    name: 'Ahmed Ben Salah',
    age: 45,
    consultationTime: new Date().toLocaleString('fr-FR')
  });

  const handleSymptomSelect = (symptom: Symptom) => {
    if (selectedSymptoms.includes(symptom.id)) {
      setSelectedSymptoms(prev => prev.filter(id => id !== symptom.id));
      const newDetails = { ...symptomDetails };
      delete newDetails[symptom.id];
      setSymptomDetails(newDetails);
    } else {
      setSelectedSymptoms(prev => [...prev, symptom.id]);
      setActiveSymptom(symptom);
    }
  };

  const handleSymptomDetailSubmit = (symptomId: string, details: SymptomDetail) => {
    setSymptomDetails(prev => ({
      ...prev,
      [symptomId]: details
    }));
    setActiveSymptom(null);
  };

  const handleCloseModal = () => {
    setActiveSymptom(null);
  };

  const clearAll = () => {
    setSelectedSymptoms([]);
    setSymptomDetails({});
    setActiveSymptom(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-cyan-50 via-medical-lavender-50 to-medical-slate-50">
      <div className="flex flex-col h-screen">
        <MedicalHeader 
          patientData={patientData}
          language={language}
          onLanguageToggle={() => setLanguage(prev => prev === 'fr' ? 'ar' : 'fr')}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-medical-slate-800 mb-2">
                  {language === 'fr' ? 'Sélectionnez les symptômes' : 'اختر الأعراض'}
                </h1>
                <p className="text-medical-slate-600">
                  {language === 'fr' 
                    ? 'Cliquez sur les cartes pour décrire les symptômes du patient' 
                    : 'انقر على البطاقات لوصف أعراض المريض'
                  }
                </p>
              </div>
              
              <SymptomGrid
                selectedSymptoms={selectedSymptoms}
                onSymptomSelect={handleSymptomSelect}
                language={language}
              />
            </div>
          </main>
          
          <SummaryPanel
            selectedSymptoms={selectedSymptoms}
            symptomDetails={symptomDetails}
            patientData={patientData}
            language={language}
          />
        </div>
        
        <ControlPanel
          hasSymptoms={selectedSymptoms.length > 0}
          onClear={clearAll}
          language={language}
        />
      </div>
      
      {activeSymptom && (
        <SymptomModal
          symptom={activeSymptom}
          onSubmit={handleSymptomDetailSubmit}
          onClose={handleCloseModal}
          language={language}
        />
      )}
    </div>
  );
};

export default Index;
