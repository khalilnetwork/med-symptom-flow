
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin, Clock, Zap, Activity, Stethoscope, Pill, User } from 'lucide-react';

interface SymptomAssessment {
  zoneId: string;
  zoneName: string;
  answers: Record<string, any>;
  completed: boolean;
}

interface ClinicalSummaryProps {
  assessments: SymptomAssessment[];
  patientData: {
    name: string;
    age: number;
    consultationTime: string;
  };
  language: 'fr' | 'ar';
}

export const ClinicalSummary = ({ assessments, patientData, language }: ClinicalSummaryProps) => {
  const getAnswerText = (questionId: string, answer: any) => {
    // Map answer values to readable text
    const answerMaps: Record<string, Record<string, { fr: string; ar: string }>> = {
      onset: {
        minutes: { fr: 'Quelques minutes', ar: 'بضع دقائق' },
        hours: { fr: 'Quelques heures', ar: 'بضع ساعات' },
        days: { fr: 'Quelques jours', ar: 'بضعة أيام' },
        weeks: { fr: 'Quelques semaines', ar: 'بضعة أسابيع' },
        months: { fr: 'Quelques mois', ar: 'بضعة أشهر' }
      },
      character: {
        sharp: { fr: 'Douleur aiguë', ar: 'ألم حاد' },
        burning: { fr: 'Brûlure', ar: 'حرقة' },
        throbbing: { fr: 'Pulsatile', ar: 'نابض' },
        cramping: { fr: 'Crampes', ar: 'تشنج' },
        tingling: { fr: 'Picotements', ar: 'وخز' },
        numbness: { fr: 'Engourdissement', ar: 'خدر' },
        pressure: { fr: 'Pression', ar: 'ضغط' }
      },
      timing: {
        constant: { fr: 'Constant', ar: 'مستمر' },
        intermittent: { fr: 'Par épisodes', ar: 'على فترات' },
        morning: { fr: 'Le matin', ar: 'في الصباح' },
        evening: { fr: 'Le soir', ar: 'في المساء' },
        activity: { fr: 'Pendant l\'activité', ar: 'أثناء النشاط' },
        rest: { fr: 'Au repos', ar: 'أثناء الراحة' }
      }
    };

    if (Array.isArray(answer)) {
      return answer.map(val => answerMaps[questionId]?.[val]?.[language] || val).join(', ');
    }
    
    return answerMaps[questionId]?.[answer]?.[language] || answer?.toString() || (language === 'fr' ? 'Non précisé' : 'غير محدد');
  };

  const generateSOAPSummary = () => {
    if (assessments.length === 0) return '';

    const completedAssessments = assessments.filter(a => a.completed);
    const mainSymptoms = completedAssessments.map(assessment => {
      const onset = getAnswerText('onset', assessment.answers.onset);
      const character = getAnswerText('character', assessment.answers.character);
      const severity = assessment.answers.severity || 0;
      
      return `${assessment.zoneName} (${character}, ${severity}/10, ${onset})`;
    });

    const associatedSymptoms = completedAssessments
      .flatMap(a => a.answers.associated || [])
      .filter((value, index, self) => self.indexOf(value) === index);

    return {
      chiefComplaint: mainSymptoms.join(' ; '),
      associatedSymptoms: associatedSymptoms,
      completedZones: completedAssessments.length
    };
  };

  const summary = generateSOAPSummary();

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-medical-cyan-400 to-medical-lavender-400 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-medical-slate-800">
              {language === 'fr' ? 'Résumé Clinique (SOAP-S)' : 'الملخص السريري (SOAP-S)'}
            </h3>
            <p className="text-sm text-medical-slate-600">
              {language === 'fr' ? 'Partie subjective - Prêt pour le médecin' : 'الجزء الذاتي - جاهز للطبيب'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="bg-white/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-medical-cyan-600" />
              <span className="text-sm font-medium text-medical-slate-700">
                {language === 'fr' ? 'Informations patient' : 'معلومات المريض'}
              </span>
            </div>
            <div className="text-sm text-medical-slate-600">
              <div>👤 {patientData.name}, {patientData.age} {language === 'fr' ? 'ans' : 'سنة'}</div>
              <div>📆 {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-SA')}</div>
              <div>⏰ {patientData.consultationTime}</div>
            </div>
          </div>

          {/* Chief Complaint */}
          {summary.chiefComplaint && (
            <div className="bg-white/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-medical-cyan-600" />
                <span className="text-sm font-medium text-medical-slate-700">
                  {language === 'fr' ? 'Motif de consultation' : 'سبب الاستشارة'}
                </span>
              </div>
              <div className="text-sm text-medical-slate-800 font-medium">
                {summary.chiefComplaint}
              </div>
            </div>
          )}

          {/* Individual Zone Details */}
          {assessments.filter(a => a.completed).map((assessment, index) => (
            <div key={assessment.zoneId} className="bg-white/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-medical-lavender-600" />
                  <span className="text-sm font-medium text-medical-slate-700">
                    {assessment.zoneName}
                  </span>
                </div>
                <Badge className="bg-medical-cyan-100 text-medical-cyan-700">
                  {language === 'fr' ? 'Évalué' : 'مُقيم'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Onset */}
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <Clock className="w-3 h-3 text-medical-slate-500" />
                    <span className="font-medium text-medical-slate-600">
                      {language === 'fr' ? 'Début' : 'البداية'}
                    </span>
                  </div>
                  <div className="text-medical-slate-700">
                    {getAnswerText('onset', assessment.answers.onset)}
                  </div>
                </div>

                {/* Character */}
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <Zap className="w-3 h-3 text-medical-slate-500" />
                    <span className="font-medium text-medical-slate-600">
                      {language === 'fr' ? 'Type' : 'النوع'}
                    </span>
                  </div>
                  <div className="text-medical-slate-700">
                    {getAnswerText('character', assessment.answers.character)}
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <Activity className="w-3 h-3 text-medical-slate-500" />
                    <span className="font-medium text-medical-slate-600">
                      {language === 'fr' ? 'Intensité' : 'الشدة'}
                    </span>
                  </div>
                  <div className="text-medical-slate-700">
                    {assessment.answers.severity || 0}/10
                  </div>
                </div>

                {/* Associated Symptoms */}
                {assessment.answers.associated && assessment.answers.associated.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Pill className="w-3 h-3 text-medical-slate-500" />
                      <span className="font-medium text-medical-slate-600">
                        {language === 'fr' ? 'Associés' : 'مصاحب'}
                      </span>
                    </div>
                    <div className="text-medical-slate-700">
                      {(assessment.answers.associated as string[]).length} {language === 'fr' ? 'symptômes' : 'أعراض'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Summary Statistics */}
          <div className="bg-gradient-to-r from-medical-cyan-50 to-medical-lavender-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-medical-cyan-600">
                  {assessments.filter(a => a.completed).length}
                </div>
                <div className="text-xs text-medical-slate-600">
                  {language === 'fr' ? 'Zones évaluées' : 'مناطق مقيمة'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-medical-lavender-600">
                  {Math.max(...assessments.filter(a => a.completed).map(a => a.answers.severity || 0), 0)}
                </div>
                <div className="text-xs text-medical-slate-600">
                  {language === 'fr' ? 'Intensité max' : 'أقصى شدة'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-medical-slate-600">
                  {summary.associatedSymptoms.length}
                </div>
                <div className="text-xs text-medical-slate-600">
                  {language === 'fr' ? 'Symptômes liés' : 'أعراض مرتبطة'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
