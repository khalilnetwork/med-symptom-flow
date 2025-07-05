
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, FileText, Activity } from 'lucide-react';
import { symptoms } from '@/data/symptoms';
import { PatientData, SymptomDetail } from '@/types/medical';

interface SummaryPanelProps {
  selectedSymptoms: string[];
  symptomDetails: Record<string, SymptomDetail>;
  patientData: PatientData;
  language: 'fr' | 'ar';
}

export const SummaryPanel = ({ selectedSymptoms, symptomDetails, patientData, language }: SummaryPanelProps) => {
  const getSymptomSummary = (symptomId: string) => {
    const symptom = symptoms.find(s => s.id === symptomId);
    const details = symptomDetails[symptomId];
    
    if (!symptom || !details) return '';

    const answers = details.answers;
    let summary = symptom.name[language];
    
    // Add key details based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = symptom.questions.find(q => q.id === questionId);
      if (question && answer) {
        if (question.type === 'select') {
          const option = question.options?.find(opt => opt.value === answer);
          if (option) {
            summary += ` (${option[language]})`;
          }
        } else if (question.type === 'scale' || question.type === 'number') {
          summary += ` (${answer})`;
        }
      }
    });

    return summary;
  };

  const generateSOAPSummary = () => {
    if (selectedSymptoms.length === 0) return '';

    const date = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-SA');
    const chiefComplaints = selectedSymptoms
      .filter(id => symptomDetails[id])
      .map(id => getSymptomSummary(id))
      .join(', ');

    return `👤 ${language === 'fr' ? 'Patient' : 'المريض'}: ${patientData.name}, ${patientData.age} ${language === 'fr' ? 'ans' : 'سنة'}
📆 ${language === 'fr' ? 'Date' : 'التاريخ'}: ${date}
📝 ${language === 'fr' ? 'Motif de consultation' : 'سبب الاستشارة'}: ${chiefComplaints}
📋 ${language === 'fr' ? 'Symptômes sélectionnés' : 'الأعراض المحددة'}: ${selectedSymptoms.length}`;
  };

  return (
    <aside className="w-96 glass-card border-l border-white/20 p-6 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-medical-lavender-400 to-medical-lavender-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-medical-slate-800">
              {language === 'fr' ? 'Résumé SOAP (S)' : 'ملخص SOAP (S)'}
            </h3>
            <p className="text-sm text-medical-slate-600">
              {language === 'fr' ? 'Partie subjective' : 'الجزء الذاتي'}
            </p>
          </div>
        </div>

        <Card className="glass border-white/30 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-4 h-4 text-medical-cyan-600" />
            <span className="text-sm font-medium text-medical-slate-700">
              {language === 'fr' ? 'Informations patient' : 'معلومات المريض'}
            </span>
          </div>
          <div className="text-sm text-medical-slate-600 space-y-1">
            <div>{patientData.name}</div>
            <div>{patientData.age} {language === 'fr' ? 'ans' : 'سنة'}</div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {patientData.consultationTime}
            </div>
          </div>
        </Card>

        <Card className="glass border-white/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-medical-cyan-600" />
              <span className="text-sm font-medium text-medical-slate-700">
                {language === 'fr' ? 'Symptômes sélectionnés' : 'الأعراض المحددة'}
              </span>
            </div>
            <Badge variant="secondary" className="bg-medical-cyan-100 text-medical-cyan-700">
              {selectedSymptoms.length}
            </Badge>
          </div>
          
          {selectedSymptoms.length === 0 ? (
            <p className="text-sm text-medical-slate-500 italic">
              {language === 'fr' 
                ? 'Aucun symptôme sélectionné...' 
                : 'لم يتم تحديد أي أعراض...'
              }
            </p>
          ) : (
            <div className="space-y-2">
              {selectedSymptoms.map(symptomId => {
                const symptom = symptoms.find(s => s.id === symptomId);
                const hasDetails = !!symptomDetails[symptomId];
                
                return (
                  <div
                    key={symptomId}
                    className={`p-3 rounded-lg border ${
                      hasDetails 
                        ? 'bg-medical-cyan-50 border-medical-cyan-200' 
                        : 'bg-medical-slate-50 border-medical-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {symptom?.name[language]}
                      </span>
                      <Badge
                        variant={hasDetails ? 'default' : 'secondary'}
                        className={hasDetails ? 'bg-medical-cyan-600' : ''}
                      >
                        {hasDetails 
                          ? (language === 'fr' ? 'Détaillé' : 'مفصل')
                          : (language === 'fr' ? 'En attente' : 'في الانتظار')
                        }
                      </Badge>
                    </div>
                    {hasDetails && (
                      <div className="mt-2 text-xs text-medical-slate-600">
                        {getSymptomSummary(symptomId)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {selectedSymptoms.length > 0 && (
          <Card className="glass border-white/30 p-4">
            <h4 className="text-sm font-semibold text-medical-slate-800 mb-3">
              {language === 'fr' ? 'Aperçu du résumé' : 'معاينة الملخص'}
            </h4>
            <pre className="text-xs text-medical-slate-600 whitespace-pre-wrap font-mono bg-medical-slate-50 p-3 rounded border">
              {generateSOAPSummary()}
            </pre>
          </Card>
        )}
      </div>
    </aside>
  );
};
