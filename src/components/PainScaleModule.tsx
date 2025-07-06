
interface PainScaleModuleProps {
  value: number;
  onChange: (value: number) => void;
  language: 'fr' | 'ar';
}

export const PainScaleModule = ({ value, onChange, language }: PainScaleModuleProps) => {
  const getPainLevel = (level: number) => {
    if (level <= 3) return { text: language === 'fr' ? 'Léger' : 'خفيف', color: 'text-green-600' };
    if (level <= 6) return { text: language === 'fr' ? 'Modéré' : 'متوسط', color: 'text-yellow-600' };
    return { text: language === 'fr' ? 'Sévère' : 'شديد', color: 'text-red-600' };
  };

  const painLevel = getPainLevel(value);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-medical-slate-700">
        🔥 {language === 'fr' ? 'Niveau de douleur (0-10)' : 'مستوى الألم (0-10)'}
      </h4>
      
      <div className="grid grid-cols-11 gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`
              h-12 rounded-lg border-2 font-bold text-sm transition-all duration-200
              ${value === i
                ? 'border-medical-cyan-500 bg-medical-cyan-500 text-white'
                : 'border-medical-slate-200 bg-white hover:border-medical-cyan-300 text-medical-slate-600'
              }
            `}
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
