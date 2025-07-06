
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, ArrowRight, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface ClinicalSummaryModalProps {
  assessments: SymptomAssessment[];
  patientData: PatientData;
  language: 'fr' | 'ar';
  children: React.ReactNode;
}

export const ClinicalSummaryModal = ({ 
  assessments, 
  patientData, 
  language,
  children 
}: ClinicalSummaryModalProps) => {
  const { toast } = useToast();
  
  const generateProfessionalSummary = () => {
    const completedAssessments = assessments.filter(a => a.completed);
    
    if (completedAssessments.length === 0) {
      return language === 'fr' 
        ? 'Aucune évaluation complétée.'
        : 'لم يتم إكمال أي تقييم.';
    }

    // Generate main complaint
    const mainComplaints = completedAssessments.map(assessment => {
      const { answers, zoneName } = assessment;
      
      // Build symptom description
      const character = getAnswerText('character', answers.character);
      const onset = getAnswerText('onset', answers.onset);
      const severity = answers.severity || 0;
      const duration = getAnswerText('duration', answers.duration);
      const timing = getAnswerText('timing', answers.timing);
      
      let description = `${zoneName} de type ${character}`;
      
      if (severity > 0) {
        description += ` d'intensité ${severity}/10`;
      }
      
      if (onset) {
        description += `, à début ${onset}`;
      }
      
      if (duration) {
        description += `, évoluant depuis ${duration}`;
      }
      
      if (timing) {
        description += `, ${timing}`;
      }
      
      // Add radiation if present
      if (answers.radiation === 'yes' && answers.radiation_location) {
        description += `, avec irradiation vers ${answers.radiation_location}`;
      }
      
      // Add aggravating/relieving factors
      const aggravating = answers.aggravating?.filter((f: string) => f !== 'none') || [];
      const relieving = answers.relieving?.filter((f: string) => f !== 'nothing') || [];
      
      if (aggravating.length > 0) {
        description += `, aggravé par ${aggravating.join(', ')}`;
      }
      
      if (relieving.length > 0) {
        description += `, soulagé par ${relieving.join(', ')}`;
      }
      
      return description;
    }).join('. ');

    // Collect all associated symptoms
    const allAssociatedSymptoms = completedAssessments
      .flatMap(a => a.answers.associated || [])
      .filter((value, index, self) => self.indexOf(value) === index);

    // Generate professional summary
    const date = new Date().toLocaleDateString('fr-FR');
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    let summary = `Patient ${patientData.name}, ${patientData.age} ans, consulte le ${date} à ${time} pour ${mainComplaints}.`;
    
    if (allAssociatedSymptoms.length > 0) {
      const symptomsText = allAssociatedSymptoms.map(s => getSymptomTranslation(s)).join(', ');
      summary += ` Signes associés : ${symptomsText}.`;
    }
    
    // Add previous episodes if any
    const hasPrevious = completedAssessments.some(a => a.answers.previous === 'yes');
    if (hasPrevious) {
      summary += ` Épisodes similaires rapportés dans les antécédents.`;
    }
    
    return summary;
  };

  const getAnswerText = (questionId: string, answer: any) => {
    const answerMaps: Record<string, Record<string, string>> = {
      onset: {
        brutal: 'brutal',
        progressif: 'progressif',
        'post-trauma': 'post-traumatique',
        'post-meal': 'post-prandial',
        unknown: 'indéterminé'
      },
      character: {
        burning: 'brûlure',
        stabbing: 'à type d\'élancements',
        tightness: 'serrement',
        tingling: 'picotements',
        pulsating: 'pulsatile',
        numbness: 'engourdissement',
        heaviness: 'lourdeur'
      },
      timing: {
        continuous: 'continu',
        episodic: 'épisodique',
        nocturnal: 'nocturne',
        morning: 'matinal',
        'after-effort': 'post-effort',
        postural: 'positionnel'
      },
      duration: {
        '<24h': 'moins de 24 heures',
        '1-3days': '1 à 3 jours',
        '>3days': 'plus de 3 jours',
        '1week+': 'plus d\'une semaine'
      }
    };

    return answerMaps[questionId]?.[answer] || answer?.toString() || 'non précisé';
  };

  const getSymptomTranslation = (symptom: string) => {
    const translations: Record<string, string> = {
      fever: 'fièvre',
      nausea: 'nausées',
      vomiting: 'vomissements',
      diarrhea: 'diarrhée',
      cough: 'toux',
      dyspnea: 'dyspnée',
      chills: 'frissons',
      dysuria: 'dysurie'
    };
    
    return translations[symptom] || symptom;
  };

  const handleCopy = () => {
    const summary = generateProfessionalSummary();
    navigator.clipboard.writeText(summary);
    toast({
      title: language === 'fr' ? 'Copié !' : 'تم النسخ!',
      description: language === 'fr' 
        ? 'Le résumé clinique a été copié dans le presse-papiers.'
        : 'تم نسخ الملخص السريري إلى الحافظة.',
    });
  };

  const summary = generateProfessionalSummary();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-medical-cyan-600" />
            <span>
              {language === 'fr' ? 'Résumé Clinique Professionnel' : 'الملخص السريري المهني'}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient Header */}
          <Card className="bg-gradient-to-r from-medical-cyan-50 to-medical-lavender-50 p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-medical-slate-800 mb-2">
                {patientData.name}
              </h3>
              <div className="text-sm text-medical-slate-600 space-x-4">
                <span>{patientData.age} {language === 'fr' ? 'ans' : 'سنة'}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-SA')}</span>
                <span>•</span>
                <span>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </Card>

          {/* Professional Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-medical-slate-800">
                {language === 'fr' ? 'Résumé pour le Médecin' : 'ملخص للطبيب'}
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{language === 'fr' ? 'Copier' : 'نسخ'}</span>
              </Button>
            </div>
            
            <div className="bg-medical-slate-50 p-4 rounded-lg border-l-4 border-medical-cyan-500">
              <p className="text-medical-slate-800 leading-relaxed font-medium">
                {summary}
              </p>
            </div>
          </Card>

          {/* Assessment Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-cyan-600 mb-1">
                {assessments.filter(a => a.completed).length}
              </div>
              <div className="text-xs text-medical-slate-600">
                {language === 'fr' ? 'Zones évaluées' : 'مناطق مقيمة'}
              </div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-lavender-600 mb-1">
                {Math.max(...assessments.filter(a => a.completed).map(a => a.answers.severity || 0), 0)}
              </div>
              <div className="text-xs text-medical-slate-600">
                {language === 'fr' ? 'Douleur max' : 'أقصى ألم'}
              </div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-slate-600 mb-1">
                {assessments.filter(a => a.completed).flatMap(a => a.answers.associated || []).filter((v, i, s) => s.indexOf(v) === i).length}
              </div>
              <div className="text-xs text-medical-slate-600">
                {language === 'fr' ? 'Signes associés' : 'علامات مصاحبة'}
              </div>
            </Card>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button className="bg-gradient-to-r from-medical-cyan-500 to-medical-lavender-500 hover:from-medical-cyan-600 hover:to-medical-lavender-600 text-white px-8">
              {language === 'fr' ? 'Confirmer la transmission' : 'تأكيد الإرسال'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
