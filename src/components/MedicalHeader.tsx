
import { Clock, User, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientData } from '@/types/medical';

interface MedicalHeaderProps {
  patientData: PatientData;
  language: 'fr' | 'ar';
  onLanguageToggle: () => void;
}

export const MedicalHeader = ({ patientData, language, onLanguageToggle }: MedicalHeaderProps) => {
  return (
    <header className="glass-card border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-medical-cyan-400 to-medical-cyan-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-medical-slate-800">
                {patientData.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-medical-slate-600">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {language === 'fr' ? `${patientData.age} ans` : `${patientData.age} سنة`}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {patientData.consultationTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLanguageToggle}
            className="glass border-white/30 hover:bg-white/20"
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === 'fr' ? 'العربية' : 'Français'}
          </Button>
          <div className="px-4 py-2 bg-gradient-to-r from-medical-cyan-400 to-medical-lavender-400 rounded-lg text-white font-medium text-sm">
            {language === 'fr' ? 'Pré-consultation' : 'ما قبل الاستشارة'}
          </div>
        </div>
      </div>
    </header>
  );
};
