
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface OCRSTFITQuestion {
  id: string;
  step: 'O' | 'C' | 'R' | 'S' | 'T' | 'F' | 'I' | 'T2';
  question: {
    fr: string;
    ar: string;
  };
  type: 'select' | 'text' | 'scale' | 'multiselect' | 'duration';
  options?: { value: string; fr: string; ar: string }[];
  required: boolean;
}

interface SymptomAssessment {
  zoneId: string;
  zoneName: string;
  answers: Record<string, any>;
  completed: boolean;
}

interface MedicalAssistantProps {
  selectedZone: { id: string; name: { fr: string; ar: string } } | null;
  onAssessmentComplete: (assessment: SymptomAssessment) => void;
  language: 'fr' | 'ar';
}

const ocrstfitQuestions: OCRSTFITQuestion[] = [
  {
    id: 'onset',
    step: 'O',
    question: { fr: 'Depuis quand ce symptôme est-il présent ?', ar: 'منذ متى هذا العرض موجود؟' },
    type: 'select',
    options: [
      { value: 'minutes', fr: 'Quelques minutes', ar: 'بضع دقائق' },
      { value: 'hours', fr: 'Quelques heures', ar: 'بضع ساعات' },
      { value: 'days', fr: 'Quelques jours', ar: 'بضعة أيام' },
      { value: 'weeks', fr: 'Quelques semaines', ar: 'بضعة أسابيع' },
      { value: 'months', fr: 'Quelques mois', ar: 'بضعة أشهر' }
    ],
    required: true
  },
  {
    id: 'character',
    step: 'C',
    question: { fr: 'Quel est le type exact de sensation ?', ar: 'ما هو النوع الدقيق للإحساس؟' },
    type: 'select',
    options: [
      { value: 'sharp', fr: 'Douleur aiguë/coupante', ar: 'ألم حاد/قاطع' },
      { value: 'burning', fr: 'Brûlure', ar: 'حرقة' },
      { value: 'throbbing', fr: 'Pulsatile/battements', ar: 'نابض' },
      { value: 'cramping', fr: 'Crampes/serrement', ar: 'تشنج/انقباض' },
      { value: 'tingling', fr: 'Picotements', ar: 'وخز' },
      { value: 'numbness', fr: 'Engourdissement', ar: 'خدر' },
      { value: 'pressure', fr: 'Pression/lourdeur', ar: 'ضغط/ثقل' }
    ],
    required: true
  },
  {
    id: 'radiation',
    step: 'R',
    question: { fr: 'Est-ce que cela irradie ? Vers où ?', ar: 'هل ينتشر؟ إلى أين؟' },
    type: 'multiselect',
    options: [
      { value: 'none', fr: 'Pas d\'irradiation', ar: 'لا ينتشر' },
      { value: 'up', fr: 'Vers le haut', ar: 'نحو الأعلى' },
      { value: 'down', fr: 'Vers le bas', ar: 'نحو الأسفل' },
      { value: 'left', fr: 'Vers la gauche', ar: 'نحو اليسار' },
      { value: 'right', fr: 'Vers la droite', ar: 'نحو اليمين' },
      { value: 'back', fr: 'Vers le dos', ar: 'نحو الظهر' },
      { value: 'front', fr: 'Vers l\'avant', ar: 'نحو الأمام' }
    ],
    required: true
  },
  {
    id: 'severity',
    step: 'S',
    question: { fr: 'Quelle est l\'intensité (échelle de 0 à 10) ?', ar: 'ما شدة الألم (من 0 إلى 10)؟' },
    type: 'scale',
    required: true
  },
  {
    id: 'timing',
    step: 'T',
    question: { fr: 'Est-ce constant ou par épisodes ? Quand survient-il ?', ar: 'هل هو مستمر أم على شكل نوبات؟ متى يحدث؟' },
    type: 'select',
    options: [
      { value: 'constant', fr: 'Constant', ar: 'مستمر' },
      { value: 'intermittent', fr: 'Par épisodes', ar: 'على فترات' },
      { value: 'morning', fr: 'Le matin', ar: 'في الصباح' },
      { value: 'evening', fr: 'Le soir', ar: 'في المساء' },
      { value: 'activity', fr: 'Pendant l\'activité', ar: 'أثناء النشاط' },
      { value: 'rest', fr: 'Au repos', ar: 'أثناء الراحة' }
    ],
    required: true
  },
  {
    id: 'factors',
    step: 'F',
    question: { fr: 'Qu\'est-ce qui aggrave ou soulage ce symptôme ?', ar: 'ما الذي يزيد أو يخفف هذا العرض؟' },
    type: 'multiselect',
    options: [
      { value: 'movement', fr: 'Mouvement (aggrave)', ar: 'الحركة (تزيد)' },
      { value: 'rest', fr: 'Repos (soulage)', ar: 'الراحة (تخفف)' },
      { value: 'heat', fr: 'Chaleur (soulage)', ar: 'الحرارة (تخفف)' },
      { value: 'cold', fr: 'Froid (soulage)', ar: 'البرودة (تخفف)' },
      { value: 'medication', fr: 'Médicaments (soulagent)', ar: 'الأدوية (تخفف)' },
      { value: 'position', fr: 'Position (influence)', ar: 'الوضعية (تؤثر)' }
    ],
    required: false
  },
  {
    id: 'associated',
    step: 'I',
    question: { fr: 'Y a-t-il des symptômes associés ?', ar: 'هل هناك أعراض مصاحبة؟' },
    type: 'multiselect',
    options: [
      { value: 'fever', fr: 'Fièvre', ar: 'حمى' },
      { value: 'nausea', fr: 'Nausée', ar: 'غثيان' },
      { value: 'vomiting', fr: 'Vomissements', ar: 'قيء' },
      { value: 'fatigue', fr: 'Fatigue', ar: 'تعب' },
      { value: 'dizziness', fr: 'Vertiges', ar: 'دوار' },
      { value: 'shortness', fr: 'Essoufflement', ar: 'ضيق تنفس' },
      { value: 'sweating', fr: 'Transpiration', ar: 'تعرق' }
    ],
    required: false
  },
  {
    id: 'treatment',
    step: 'T2',
    question: { fr: 'Y a-t-il des antécédents médicaux, allergies ou traitements en cours ?', ar: 'هل هناك تاريخ طبي أو حساسية أو علاج حالي؟' },
    type: 'text',
    required: false
  }
];

export const MedicalAssistant = ({ selectedZone, onAssessmentComplete, language }: MedicalAssistantProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = ocrstfitQuestions[currentQuestionIndex];
  const canProceed = !currentQuestion?.required || answers[currentQuestion.id] !== undefined;

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < ocrstfitQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete assessment
      const assessment: SymptomAssessment = {
        zoneId: selectedZone!.id,
        zoneName: selectedZone!.name[language],
        answers,
        completed: true
      };
      setIsCompleted(true);
      onAssessmentComplete(assessment);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  if (!selectedZone) {
    return (
      <Card className="glass-card p-6 text-center">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-medical-cyan-500" />
        <h3 className="text-lg font-semibold text-medical-slate-800 mb-2">
          {language === 'fr' ? 'Assistant Médical Intelligent' : 'المساعد الطبي الذكي'}
        </h3>
        <p className="text-medical-slate-600">
          {language === 'fr' 
            ? 'Cliquez sur une zone du corps pour commencer l\'évaluation OCRSTFIT'
            : 'انقر على منطقة من الجسم لبدء تقييم OCRSTFIT'
          }
        </p>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-medical-slate-800 mb-2">
            {language === 'fr' ? 'Évaluation Terminée' : 'التقييم مكتمل'}
          </h3>
          <p className="text-medical-slate-600">
            {language === 'fr' 
              ? `Zone évaluée : ${selectedZone.name[language]}`
              : `المنطقة المقيمة: ${selectedZone.name[language]}`
            }
          </p>
        </div>
        
        <Button
          onClick={resetAssessment}
          className="w-full bg-gradient-to-r from-medical-cyan-500 to-medical-lavender-500 hover:from-medical-cyan-600 hover:to-medical-lavender-600 text-white"
        >
          {language === 'fr' ? 'Nouvelle Évaluation' : 'تقييم جديد'}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-medical-slate-800">
            {language === 'fr' ? 'Évaluation OCRSTFIT' : 'تقييم OCRSTFIT'}
          </h3>
          <div className="text-sm text-medical-slate-600">
            {currentQuestionIndex + 1}/{ocrstfitQuestions.length}
          </div>
        </div>
        
        <div className="text-sm text-medical-slate-600 mb-2">
          {language === 'fr' ? 'Zone sélectionnée :' : 'المنطقة المحددة:'} 
          <span className="font-medium ml-1">{selectedZone.name[language]}</span>
        </div>
        
        <div className="w-full bg-medical-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-medical-cyan-500 to-medical-lavender-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / ocrstfitQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-medical-slate-700 font-medium text-base mb-4 block">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-medical-cyan-500 text-white rounded-full text-sm font-bold mr-2">
              {currentQuestion.step}
            </span>
            {currentQuestion.question[language]}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {currentQuestion.type === 'select' && (
            <Select
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              <SelectTrigger className="glass border-white/30">
                <SelectValue placeholder={language === 'fr' ? 'Sélectionnez...' : 'اختر...'} />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md">
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentQuestion.type === 'multiselect' && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${currentQuestion.id}-${option.value}`}
                    checked={(answers[currentQuestion.id] || []).includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = answers[currentQuestion.id] || [];
                      if (checked) {
                        handleAnswerChange(currentQuestion.id, [...currentValues, option.value]);
                      } else {
                        handleAnswerChange(currentQuestion.id, currentValues.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`${currentQuestion.id}-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option[language]}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'scale' && (
            <div className="space-y-4">
              <Slider
                value={[answers[currentQuestion.id] || 0]}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value[0])}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-medical-slate-600">
                <span>0</span>
                <span className="font-medium text-lg">
                  {answers[currentQuestion.id] || 0}/10
                </span>
                <span>10</span>
              </div>
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <Input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="glass border-white/30"
              placeholder={language === 'fr' ? 'Tapez votre réponse...' : 'اكتب إجابتك...'}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="glass border-white/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'fr' ? 'Précédent' : 'السابق'}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-medical-cyan-500 to-medical-lavender-500 hover:from-medical-cyan-600 hover:to-medical-lavender-600 text-white"
        >
          {currentQuestionIndex === ocrstfitQuestions.length - 1 
            ? (language === 'fr' ? 'Terminer' : 'إنهاء')
            : (language === 'fr' ? 'Suivant' : 'التالي')
          }
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
