
import { useState } from 'react';
import { symptoms } from '@/data/symptoms';
import { Symptom, Question } from '@/types/medical';

interface SymptomGridProps {
  selectedSymptoms: string[];
  onSymptomSelect: (symptom: Symptom) => void;
  language: 'fr' | 'ar';
}

interface CardLevel {
  id: string;
  items: (Symptom | Question)[];
  parentId?: string;
  type: 'symptom' | 'question';
}

export const SymptomGrid = ({ selectedSymptoms, onSymptomSelect, language }: SymptomGridProps) => {
  const [cardLevels, setCardLevels] = useState<CardLevel[]>([
    { id: 'root', items: symptoms, type: 'symptom' }
  ]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleCardClick = (item: Symptom | Question, levelId: string) => {
    if ('category' in item) {
      // It's a symptom
      const symptom = item as Symptom;
      onSymptomSelect(symptom);
      
      if (symptom.questions.length > 0) {
        const newLevelId = `${levelId}-${symptom.id}`;
        const existingLevelIndex = cardLevels.findIndex(level => level.id === newLevelId);
        
        if (existingLevelIndex === -1) {
          // Add new level
          const newLevel: CardLevel = {
            id: newLevelId,
            items: symptom.questions,
            parentId: levelId,
            type: 'question'
          };
          setCardLevels(prev => [...prev, newLevel]);
        }
        
        setExpandedCards(prev => new Set([...prev, symptom.id]));
      }
    } else {
      // It's a question - handle question interaction
      console.log('Question clicked:', item);
    }
  };

  const isSelected = (item: Symptom | Question) => {
    if ('category' in item) {
      return selectedSymptoms.includes(item.id);
    }
    return false;
  };

  const isExpanded = (item: Symptom | Question) => {
    if ('category' in item) {
      return expandedCards.has(item.id);
    }
    return false;
  };

  return (
    <div className="space-y-8">
      {cardLevels.map((level, levelIndex) => (
        <div
          key={level.id}
          className={`transition-all duration-500 ease-out ${
            levelIndex > 0 ? 'animate-fade-in' : ''
          }`}
          style={{
            animationDelay: `${levelIndex * 100}ms`
          }}
        >
          {levelIndex > 0 && (
            <div className="flex items-center mb-4">
              <div className="h-px bg-gradient-to-r from-medical-cyan-200 to-medical-lavender-200 flex-1"></div>
              <div className="px-4 text-sm text-medical-slate-500 font-medium">
                {language === 'fr' ? 'Questions détaillées' : 'أسئلة تفصيلية'}
              </div>
              <div className="h-px bg-gradient-to-r from-medical-lavender-200 to-medical-cyan-200 flex-1"></div>
            </div>
          )}
          
          <div className={`grid gap-4 ${
            level.type === 'symptom' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {level.items.map((item) => {
              const selected = isSelected(item);
              const expanded = isExpanded(item);
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item, level.id)}
                  className={`group cursor-pointer transition-all duration-300 ease-out hover:scale-105 ${
                    selected ? 'scale-105' : ''
                  }`}
                >
                  <div className={`symptom-card glass-card rounded-2xl p-6 relative overflow-hidden ${
                    selected ? 'selected ring-2 ring-medical-cyan-400 ring-opacity-60' : ''
                  } ${expanded ? 'bg-gradient-to-br from-medical-cyan-50 to-medical-lavender-50' : ''}`}>
                    
                    {/* Animated background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ${
                      'category' in item 
                        ? item.color.replace('from-', 'from-').replace('to-', 'to-') + ' group-hover:opacity-10'
                        : 'from-medical-cyan-400 to-medical-lavender-400 group-hover:opacity-5'
                    }`}></div>
                    
                    <div className="relative z-10">
                      {'category' in item ? (
                        // Symptom card
                        <>
                          <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto transition-transform duration-200 group-hover:scale-110`}>
                            {item.icon}
                          </div>
                          
                          <h3 className={`text-center font-semibold text-medical-slate-800 mb-3 ${
                            language === 'ar' ? 'text-right' : 'text-left'
                          }`}>
                            {item.name[language]}
                          </h3>
                        </>
                      ) : (
                        // Question card
                        <>
                          <div className="w-12 h-12 bg-gradient-to-br from-medical-slate-400 to-medical-slate-500 rounded-xl flex items-center justify-center text-white text-sm mb-3 mx-auto">
                            ?
                          </div>
                          
                          <h4 className={`text-center font-medium text-medical-slate-700 text-sm ${
                            language === 'ar' ? 'text-right' : 'text-left'
                          }`}>
                            {item.text[language]}
                          </h4>
                        </>
                      )}
                      
                      <div className={`mt-3 text-xs px-3 py-1.5 rounded-full text-center transition-all duration-200 ${
                        selected 
                          ? 'bg-medical-cyan-100 text-medical-cyan-700 shadow-sm' 
                          : expanded
                          ? 'bg-medical-lavender-100 text-medical-lavender-700'
                          : 'bg-medical-slate-100 text-medical-slate-600 group-hover:bg-medical-slate-200'
                      }`}>
                        {selected 
                          ? (language === 'fr' ? 'Sélectionné' : 'محدد')
                          : expanded
                          ? (language === 'fr' ? 'Développé' : 'موسع')
                          : (language === 'fr' ? 'Cliquer pour sélectionner' : 'انقر للتحديد')
                        }
                      </div>
                      
                      {expanded && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-medical-cyan-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {cardLevels.length > 1 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => {
              setCardLevels([{ id: 'root', items: symptoms, type: 'symptom' }]);
              setExpandedCards(new Set());
            }}
            className="px-6 py-2 bg-gradient-to-r from-medical-slate-400 to-medical-slate-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            {language === 'fr' ? 'Réinitialiser la sélection' : 'إعادة تعيين التحديد'}
          </button>
        </div>
      )}
    </div>
  );
};
