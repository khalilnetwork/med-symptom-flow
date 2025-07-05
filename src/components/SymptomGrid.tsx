
import { symptoms } from '@/data/symptoms';
import { Symptom } from '@/types/medical';

interface SymptomGridProps {
  selectedSymptoms: string[];
  onSymptomSelect: (symptom: Symptom) => void;
  language: 'fr' | 'ar';
}

export const SymptomGrid = ({ selectedSymptoms, onSymptomSelect, language }: SymptomGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {symptoms.map((symptom) => {
        const isSelected = selectedSymptoms.includes(symptom.id);
        
        return (
          <div
            key={symptom.id}
            onClick={() => onSymptomSelect(symptom)}
            className={`symptom-card glass-card rounded-2xl p-6 cursor-pointer ${
              isSelected ? 'selected' : ''
            }`}
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${symptom.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto`}>
              {symptom.icon}
            </div>
            
            <h3 className={`text-center font-semibold text-medical-slate-800 ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}>
              {symptom.name[language]}
            </h3>
            
            <div className={`mt-2 text-xs px-3 py-1 rounded-full text-center ${
              isSelected 
                ? 'bg-medical-cyan-100 text-medical-cyan-700' 
                : 'bg-medical-slate-100 text-medical-slate-600'
            }`}>
              {isSelected 
                ? (language === 'fr' ? 'Sélectionné' : 'محدد')
                : (language === 'fr' ? 'Cliquer pour sélectionner' : 'انقر للتحديد')
              }
            </div>
          </div>
        );
      })}
    </div>
  );
};
