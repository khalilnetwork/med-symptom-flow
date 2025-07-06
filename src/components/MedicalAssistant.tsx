import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { ClickableResponseModule } from './ClickableResponseModule';
import { PainScaleModule } from './PainScaleModule';

interface OCRSTFITQuestion {
  id: string;
  step: 'O' | 'C' | 'R' | 'S' | 'T' | 'F1' | 'F2' | 'I' | 'T2' | 'T3' | 'T4';
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
    question: { fr: 'Comment cela a commencé ?', ar: 'كيف بدأ هذا؟' },
    type: 'select',
    options: [
      { value: 'brutal', fr: 'Brutal', ar: 'مفاجئ' },
      { value: 'progressif', fr: 'Progressif', ar: 'تدريجي' },
      { value: 'post-trauma', fr: 'Post-trauma', ar: 'بعد صدمة' },
      { value: 'post-meal', fr: 'Après repas', ar: 'بعد الوجبة' },
      { value: 'unknown', fr: 'Inconnu', ar: 'غير معروف' }
    ],
    required: true
  },
  {
    id: 'character',
    step: 'C',
    question: { fr: 'Quelle est la sensation ?', ar: 'ما هو الإحساس؟' },
    type: 'select',
    options: [
      { value: 'burning', fr: 'Brûlure', ar: 'حرقة' },
      { value: 'stabbing', fr: 'Élancements', ar: 'طعن' },
      { value: 'tightness', fr: 'Serrement', ar: 'انقباض' },
      { value: 'tingling', fr: 'Picotements', ar: 'وخز' },
      { value: 'pulsating', fr: 'Pulsation', ar: 'نبض' },
      { value: 'numbness', fr: 'Engourdissement', ar: 'خدر' },
      { value: 'heaviness', fr: 'Lourdeur', ar: 'ثقل' }
    ],
    required: true
  },
  {
    id: 'radiation',
    step: 'R',
    question: { fr: 'Est-ce que ça se propage ?', ar: 'هل ينتشر؟' },
    type: 'select',
    options: [
      { value: 'no', fr: 'Non', ar: 'لا' },
      { value: 'yes', fr: 'Oui', ar: 'نعم' }
    ],
    required: true
  },
  {
    id: 'radiation_location',
    step: 'R',
    question: { fr: 'Où se propage-t-il ?', ar: 'أين ينتشر؟' },
    type: 'text',
    required: false
  },
  {
    id: 'severity',
    step: 'S',
    question: { fr: 'Niveau de douleur (0-10) ?', ar: 'مستوى الألم (0-10)؟' },
    type: 'scale',
    required: true
  },
  {
    id: 'timing',
    step: 'T',
    question: { fr: 'Comment évolue le symptôme ?', ar: 'كيف يتطور العرض؟' },
    type: 'select',
    options: [
      { value: 'continuous', fr: 'Continu', ar: 'مستمر' },
      { value: 'episodic', fr: 'Par crises', ar: 'على شكل نوبات' },
      { value: 'nocturnal', fr: 'Nocturne', ar: 'ليلي' },
      { value: 'morning', fr: 'Matinal', ar: 'صباحي' },
      { value: 'after-effort', fr: 'Après effort', ar: 'بعد المجهود' },
      { value: 'postural', fr: 'Postural', ar: 'وضعي' }
    ],
    required: true
  },
  {
    id: 'associated',
    step: 'I',
    question: { fr: 'Y a-t-il d\'autres signes ?', ar: 'هل هناك علامات أخرى؟' },
    type: 'multiselect',
    options: [
      { value: 'fever', fr: 'Fièvre', ar: 'حمى' },
      { value: 'nausea', fr: 'Nausées', ar: 'غثيان' },
      { value: 'vomiting', fr: 'Vomissements', ar: 'قيء' },
      { value: 'diarrhea', fr: 'Diarrhée', ar: 'إسهال' },
      { value: 'cough', fr: 'Toux', ar: 'سعال' },
      { value: 'dyspnea', fr: 'Essoufflement', ar: 'ضيق تنفس' },
      { value: 'chills', fr: 'Frissons', ar: 'قشعريرة' },
      { value: 'dysuria', fr: 'Douleur à la miction', ar: 'ألم عند التبول' }
    ],
    required: false
  },
  {
    id: 'aggravating',
    step: 'F1',
    question: { fr: 'Qu\'est-ce qui aggrave ?', ar: 'ما الذي يزيد الأمر سوءاً؟' },
    type: 'multiselect',
    options: [
      { value: 'movement', fr: 'Mouvement', ar: 'الحركة' },
      { value: 'breathing', fr: 'Respiration', ar: 'التنفس' },
      { value: 'eating', fr: 'Alimentation', ar: 'الأكل' },
      { value: 'stress', fr: 'Stress', ar: 'التوتر' },
      { value: 'none', fr: 'Aucun', ar: 'لا شيء' },
      { value: 'other', fr: 'Autre', ar: 'أخرى' }
    ],
    required: false
  },
  {
    id: 'relieving',
    step: 'F2',
    question: { fr: 'Qu\'est-ce qui soulage ?', ar: 'ما الذي يخفف؟' },
    type: 'multiselect',
    options: [
      { value: 'rest', fr: 'Repos', ar: 'الراحة' },
      { value: 'medication', fr: 'Médicaments', ar: 'الأدوية' },
      { value: 'cold', fr: 'Froid', ar: 'البرد' },
      { value: 'heat', fr: 'Chaud', ar: 'الحرارة' },
      { value: 'nothing', fr: 'Rien', ar: 'لا شيء' },
      { value: 'other', fr: 'Autre', ar: 'أخرى' }
    ],
    required: false
  },
  {
    id: 'duration',
    step: 'T2',
    question: { fr: 'Depuis combien de temps ?', ar: 'منذ متى؟' },
    type: 'select',
    options: [
      { value: '<24h', fr: '<24h', ar: '<24ساعة' },
      { value: '1-3days', fr: '1–3 jours', ar: '1-3 أيام' },
      { value: '>3days', fr: '+3 jours', ar: '+3 أيام' },
      { value: '1week+', fr: '1 semaine+', ar: 'أسبوع+' }
    ],
    required: true
  },
  {
    id: 'previous',
    step: 'T3',
    question: { fr: 'Cela s\'est-il déjà produit ?', ar: 'هل حدث هذا من قبل؟' },
    type: 'select',
    options: [
      { value: 'yes', fr: 'Oui', ar: 'نعم' },
      { value: 'no', fr: 'Non', ar: 'لا' },
      { value: 'unknown', fr: 'Inconnu', ar: 'غير معروف' }
    ],
    required: false
  },
  {
    id: 'trigger',
    step: 'T4',
    question: { fr: 'Y a-t-il un déclencheur connu ?', ar: 'هل هناك محفز معروف؟' },
    type: 'multiselect',
    options: [
      { value: 'exercise', fr: 'Exercice', ar: 'التمرين' },
      { value: 'trauma', fr: 'Traumatisme', ar: 'صدمة' },
      { value: 'food', fr: 'Alimentation', ar: 'الطعام' },
      { value: 'stress', fr: 'Stress', ar: 'التوتر' },
      { value: 'none', fr: 'Aucun', ar: 'لا شيء' },
      { value: 'other', fr: 'Autre', ar: 'أخرى' }
    ],
    required: false
  }
];

export const MedicalAssistant = ({ selectedZone, onAssessmentComplete, language }: MedicalAssistantProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = ocrstfitQuestions[currentQuestionIndex];
  const canProceed = !currentQuestion?.required || answers[currentQuestion.id] !== undefined;

  // Skip radiation location question if radiation is "no"
  const shouldSkipQuestion = (question: OCRSTFITQuestion) => {
    if (question.id === 'radiation_location' && answers['radiation'] !== 'yes') {
      return true;
    }
    return false;
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    let nextIndex = currentQuestionIndex + 1;
    
    // Skip questions if needed
    while (nextIndex < ocrstfitQuestions.length && shouldSkipQuestion(ocrstfitQuestions[nextIndex])) {
      nextIndex++;
    }
    
    if (nextIndex < ocrstfitQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
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
    let prevIndex = currentQuestionIndex - 1;
    
    // Skip questions if needed
    while (prevIndex >= 0 && shouldSkipQuestion(ocrstfitQuestions[prevIndex])) {
      prevIndex--;
    }
    
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const renderQuestionInput = () => {
    if (currentQuestion.type === 'select') {
      return (
        <ClickableResponseModule
          title={`${currentQuestion.step} - ${currentQuestion.question[language]}`}
          options={currentQuestion.options?.map(opt => ({
            value: opt.value,
            label: opt[language],
            icon: getQuestionIcon(currentQuestion.step)
          })) || []}
          selectedValues={answers[currentQuestion.id] || ''}
          onSelect={(value) => handleAnswerChange(currentQuestion.id, value)}
          language={language}
        />
      );
    }

    if (currentQuestion.type === 'multiselect') {
      return (
        <ClickableResponseModule
          title={`${currentQuestion.step} - ${currentQuestion.question[language]}`}
          options={currentQuestion.options?.map(opt => ({
            value: opt.value,
            label: opt[language],
            icon: getQuestionIcon(currentQuestion.step)
          })) || []}
          selectedValues={answers[currentQuestion.id] || []}
          onSelect={(value) => handleAnswerChange(currentQuestion.id, value)}
          multiple={true}
          language={language}
        />
      );
    }

    if (currentQuestion.type === 'scale') {
      return (
        <PainScaleModule
          value={answers[currentQuestion.id] || 0}
          onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          language={language}
        />
      );
    }

    if (currentQuestion.type === 'text') {
      return (
        <div className="space-y-3">
          <Label className="text-medical-slate-700 font-medium text-base">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-medical-cyan-500 text-white rounded-full text-sm font-bold mr-2">
              {currentQuestion.step}
            </span>
            {currentQuestion.question[language]}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className="glass border-white/30"
            placeholder={language === 'fr' ? 'Précisez...' : 'حدد...'}
          />
        </div>
      );
    }
  };

  const getQuestionIcon = (step: string) => {
    const icons: Record<string, string> = {
      'O': '⏱',
      'C': '🧠',
      'R': '🔁',
      'S': '🔥',
      'T': '🕒',
      'I': '📋',
      'F1': '⚠️',
      'F2': '✅',
      'T2': '📆',
      'T3': '🔄',
      'T4': '🎯'
    };
    return icons[step] || '';
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
        {renderQuestionInput()}
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
