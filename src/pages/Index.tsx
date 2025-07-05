
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
      // Remove symptom
      setSelectedSymptoms(prev => prev.filter(id => id !== symptom.id));
      const newDetails = { ...symptomDetails };
      delete newDetails[symptom.id];
      setSymptomDetails(newDetails);
    } else {
      // Add symptom
      setSelectedSymptoms(prev => [...prev, symptom.id]);
      // Don't automatically open modal, let the cascading cards handle the flow
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
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-medical-cyan-400 to-medical-lavender-400 rounded-3xl mb-6 shadow-lg">
                  <div className="text-3xl">🩺</div>
                </div>
                
                <h1 className="text-4xl font-bold text-medical-slate-800 mb-4">
                  {language === 'fr' ? 'Assistant de Triage' : 'مساعد الفرز الطبي'}
                </h1>
                
                <p className="text-lg text-medical-slate-600 max-w-2xl mx-auto">
                  {language === 'fr' 
                    ? 'Sélectionnez les symptômes du patient. L\'interface s\'adaptera dynamiquement pour approfondir chaque symptôme choisi.' 
                    : 'اختر أعراض المريض. ستتكيف الواجهة ديناميكيًا لتعميق كل عرض مختار.'
                  }
                </p>
                
                {selectedSymptoms.length > 0 && (
                  <div className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-medical-cyan-100 to-medical-lavender-100 rounded-full">
                    <div className="w-3 h-3 bg-medical-cyan-400 rounded-full animate-pulse mr-3"></div>
                    <span className="text-sm font-medium text-medical-slate-700">
                      {selectedSymptoms.length} {language === 'fr' ? 'symptôme(s) sélectionné(s)' : 'عَرَض محدد'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Dynamic Symptom Grid */}
              <SymptomGrid
                selectedSymptoms={selectedSymptoms}
                onSymptomSelect={handleSymptomSelect}
                language={language}
              />
            </div>
          </main>
          
          {/* Summary Panel - Always visible but collapsible on mobile */}
          <div className="w-80 border-l border-white/20 bg-white/60 backdrop-blur-sm">
            <SummaryPanel
              selectedSymptoms={selectedSymptoms}
              symptomDetails={symptomDetails}
              patientData={patientData}
              language={language}
            />
          </div>
        </div>
        
        {/* Floating Control Panel */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-white/20">
          <ControlPanel
            hasSymptoms={selectedSymptoms.length > 0}
            onClear={clearAll}
            language={language}
          />
        </div>
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
