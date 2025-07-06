
interface PainScaleModuleProps {
  value: number;
  onChange: (value: number) => void;
  language: 'fr' | 'ar';
}

export const PainScaleModule = ({ value, onChange, language }: PainScaleModuleProps) => {
  const getPainLevel = (level: number) => {
    if (level <= 3) return { text: language === 'fr' ? 'Léger' : 'خفيف', color: 'text-green-400' };
    if (level <= 6) return { text: language === 'fr' ? 'Modéré' : 'متوسط', color: 'text-yellow-400' };
    return { text: language === 'fr' ? 'Sévère' : 'شديد', color: 'text-red-400' };
  };

  const painLevel = getPainLevel(value);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-200">
        {language === 'fr' ? 'Niveau de douleur (0-10)' : 'مستوى الألم (0-10)'}
      </h4>
      
      <div className="grid grid-cols-11 gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`
              h-12 rounded-lg border font-bold text-sm transition-all duration-300
              ${value === i
                ? 'border-blue-500 bg-blue-600/50 text-blue-200 shadow-lg'
                : 'border-slate-600 bg-slate-800/50 hover:border-blue-400 text-slate-300'
              }
            `}
            style={value === i ? { 
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' 
            } : {}}
          >
            {i}
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <span className={`text-lg font-semibold ${painLevel.color}`}>
          {value}/10 - {painLevel.text}
        </span>
      </div>
    </div>
  );
};
