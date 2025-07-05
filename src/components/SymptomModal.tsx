
import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Symptom, SymptomDetail } from '@/types/medical';

interface SymptomModalProps {
  symptom: Symptom;
  onSubmit: (symptomId: string, details: SymptomDetail) => void;
  onClose: () => void;
  language: 'fr' | 'ar';
}

export const SymptomModal = ({ symptom, onSubmit, onClose, language }: SymptomModalProps) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const details: SymptomDetail = {
      answers,
      notes: notes.trim() || undefined
    };
    onSubmit(symptom.id, details);
  };

  const canSubmit = symptom.questions
    .filter(q => q.required)
    .every(q => answers[q.id] !== undefined && answers[q.id] !== '');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${symptom.color} rounded-xl flex items-center justify-center text-xl`}>
                {symptom.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-medical-slate-800">
                  {symptom.name[language]}
                </h2>
                <p className="text-medical-slate-600">
                  {language === 'fr' 
                    ? 'Répondez aux questions pour préciser le symptôme' 
                    : 'أجب على الأسئلة لتوضيح العرض'
                  }
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-medical-slate-500 hover:text-medical-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {symptom.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-medical-slate-700 font-medium">
                  {question.text[language]}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {question.type === 'select' && (
                  <Select
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <SelectTrigger className="glass border-white/30">
                      <SelectValue placeholder={language === 'fr' ? 'Sélectionnez...' : 'اختر...'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md">
                      {question.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === 'multiselect' && (
                  <div className="grid grid-cols-2 gap-3">
                    {question.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${option.value}`}
                          checked={(answers[question.id] || []).includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentValues = answers[question.id] || [];
                            if (checked) {
                              handleAnswerChange(question.id, [...currentValues, option.value]);
                            } else {
                              handleAnswerChange(question.id, currentValues.filter((v: string) => v !== option.value));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          className="text-sm cursor-pointer"
                        >
                          {option[language]}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'number' && (
                  <Input
                    type="number"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="glass border-white/30"
                  />
                )}

                {question.type === 'text' && (
                  <Input
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="glass border-white/30"
                  />
                )}

                {question.type === 'scale' && (
                  <div className="space-y-3">
                    <Slider
                      value={[answers[question.id] || 1]}
                      onValueChange={(value) => handleAnswerChange(question.id, value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-medical-slate-600">
                      <span>1</span>
                      <span className="font-medium">
                        {answers[question.id] || 1}/10
                      </span>
                      <span>10</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="space-y-3">
              <Label className="text-medical-slate-700 font-medium">
                {language === 'fr' ? 'Notes additionnelles' : 'ملاحظات إضافية'}
              </Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'fr' 
                  ? 'Ajoutez des détails supplémentaires...' 
                  : 'أضف تفاصيل إضافية...'
                }
                className="w-full h-24 p-3 glass border-white/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-medical-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="glass border-white/30"
            >
              {language === 'fr' ? 'Annuler' : 'إلغاء'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-gradient-to-r from-medical-cyan-500 to-medical-lavender-500 hover:from-medical-cyan-600 hover:to-medical-lavender-600 text-white"
            >
              {language === 'fr' ? 'Confirmer' : 'تأكيد'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
