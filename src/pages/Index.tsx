import { useState } from 'react';
import { MedicalHeader } from '@/components/MedicalHeader';
import { BodySilhouette } from '@/components/BodySilhouette';
import { MedicalAssistant } from '@/components/MedicalAssistant';
import { ClinicalSummary } from '@/components/ClinicalSummary';
import { ControlPanel } from '@/components/ControlPanel';
import { PatientData } from '@/types/medical';

interface SymptomAssessment {
  zoneId: string;
  zoneName: string;
  answers: Record<string, any>;
  completed: boolean;
}

interface BodyZone {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
}

interface SymptomVisualization {
  zoneId: string;
  intensity: number;
  type: string;
  hasIrradiation: boolean;
  irradiationZones?: string[];
}

const Index = () => {
  const [selectedZone, setSelectedZone] = useState<BodyZone | null>(null);
  const [assessments, setAssessments] = useState<SymptomAssessment[]>([]);
  const [symptomVisualizations, setSymptomVisualizations] = useState<SymptomVisualization[]>([]);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [patientData, setPatientData] = useState<PatientData>({
    name: 'Ahmed Ben Salah',
    age: 45,
    consultationTime: new Date().toLocaleString('fr-FR')
  });

  const handleZoneClick = (zone: BodyZone) => {
    setSelectedZone(zone);
  };

  const handleAssessmentComplete = (assessment: SymptomAssessment) => {
    // Update assessments
    setAssessments(prev => {
      const existing = prev.find(a => a.zoneId === assessment.zoneId);
      if (existing) {
        return prev.map(a => a.zoneId === assessment.zoneId ? assessment : a);
      }
      return [...prev, assessment];
    });

    // Create visualization
    const visualization: SymptomVisualization = {
      zoneId: assessment.zoneId,
      intensity: assessment.answers.severity || 0,
      type: assessment.answers.character || 'unknown',
      hasIrradiation: assessment.answers.radiation && 
                     assessment.answers.radiation.length > 0 && 
                     !assessment.answers.radiation.includes('none'),
      irradiationZones: assessment.answers.radiation?.filter((r: string) => r !== 'none') || []
    };

    setSymptomVisualizations(prev => {
      const existing = prev.find(v => v.zoneId === assessment.zoneId);
      if (existing) {
        return prev.map(v => v.zoneId === assessment.zoneId ? visualization : v);
      }
      return [...prev, visualization];
    });

    // Clear selected zone to show completion
    setSelectedZone(null);
  };

  const clearAll = () => {
    setAssessments([]);
    setSymptomVisualizations([]);
    setSelectedZone(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Futuristic background orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      
      <div className="flex flex-col h-screen relative z-10">
        <MedicalHeader 
          patientData={patientData}
          language={language}
          onLanguageToggle={() => setLanguage(prev => prev === 'fr' ? 'ar' : 'fr')}
        />
        
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6">
              {/* Hero Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl border border-blue-500/30">
                  <div className="text-3xl text-white neon-glow">🩺</div>
                </div>
                
                <h1 className="text-4xl font-bold text-slate-100 mb-4 neon-glow">
                  {language === 'fr' ? 'Assistant de Triage Médical' : 'مساعد الفرز الطبي'}
                </h1>
                
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                  {language === 'fr' 
                    ? 'Cliquez sur une zone anatomique du corps humain. L\'assistant vous guidera avec la méthode OCRSTFIT pour une évaluation complète.' 
                    : 'انقر على منطقة تشريحية من جسم الإنسان. سيرشدك المساعد بطريقة OCRSTFIT لتقييم شامل.'
                  }
                </p>
                
                {assessments.length > 0 && (
                  <div className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full border border-blue-500/30 border-glow">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mr-3" style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}></div>
                    <span className="text-sm font-medium text-slate-200">
                      {assessments.filter(a => a.completed).length} {language === 'fr' ? 'zone(s) évaluée(s)' : 'منطقة مُقيمة'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Main Interface - Body Silhouette and Medical Assistant Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <BodySilhouette
                    onZoneClick={handleZoneClick}
                    symptomVisualizations={symptomVisualizations}
                    language={language}
                  />
                </div>
                
                <div className="space-y-6">
                  <MedicalAssistant
                    selectedZone={selectedZone}
                    onAssessmentComplete={handleAssessmentComplete}
                    language={language}
                  />
                </div>
              </div>

              {/* Clinical Summary at Bottom */}
              <div className="mt-8">
                <ClinicalSummary
                  assessments={assessments}
                  patientData={patientData}
                  language={language}
                />
              </div>
            </div>
          </main>
        </div>
        
        {/* Control Panel */}
        <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-lg border-t border-blue-500/30">
          <ControlPanel
            hasSymptoms={assessments.length > 0}
            onClear={clearAll}
            language={language}
            assessments={assessments}
            patientData={patientData}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
