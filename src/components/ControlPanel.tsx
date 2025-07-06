
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, ArrowRight } from 'lucide-react';
import { ClinicalSummaryModal } from './ClinicalSummaryModal';

interface SymptomAssessment {
  zoneId: string;
  zoneName: string;
  answers: Record<string, any>;
  completed: boolean;
}

interface PatientData {
  name: string;
  age: number;
  consultationTime: string;
}

interface ControlPanelProps {
  hasSymptoms: boolean;
  onClear: () => void;
  language: 'fr' | 'ar';
  assessments: SymptomAssessment[];
  patientData: PatientData;
}

export const ControlPanel = ({ 
  hasSymptoms, 
  onClear, 
  language, 
  assessments, 
  patientData 
}: ControlPanelProps) => {
  const handleExport = () => {
    // This would typically export the SOAP summary
    console.log('Exporting SOAP summary...');
  };

  return (
    <footer className="glass-card border-t border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onClear}
            disabled={!hasSymptoms}
            className="glass border-white/30 hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {language === 'fr' ? 'Effacer tout' : 'مسح الكل'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!hasSymptoms}
            className="glass border-white/30 hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'fr' ? 'Exporter' : 'تصدير'}
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-medical-slate-600">
            {language === 'fr' 
              ? 'Prêt pour la consultation médicale' 
              : 'جاهز للاستشارة الطبية'
            }
          </div>
          
          <ClinicalSummaryModal
            assessments={assessments}
            patientData={patientData}
            language={language}
          >
            <Button
              disabled={!hasSymptoms}
              className="bg-gradient-to-r from-medical-cyan-500 to-medical-lavender-500 hover:from-medical-cyan-600 hover:to-medical-lavender-600 text-white px-6"
            >
              {language === 'fr' ? 'Transmettre au médecin' : 'إرسال للطبيب'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </ClinicalSummaryModal>
        </div>
      </div>
    </footer>
  );
};
