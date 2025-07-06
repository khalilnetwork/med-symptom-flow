
interface ClickableResponseModuleProps {
  title: string;
  options: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  selectedValues: string | string[];
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
  language: 'fr' | 'ar';
}

export const ClickableResponseModule = ({
  title,
  options,
  selectedValues,
  onSelect,
  multiple = false,
  language
}: ClickableResponseModuleProps) => {
  const handleClick = (value: string) => {
    if (multiple) {
      const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
      if (currentValues.includes(value)) {
        onSelect(currentValues.filter(v => v !== value));
      } else {
        onSelect([...currentValues, value]);
      }
    } else {
      onSelect(value);
    }
  };

  const isSelected = (value: string) => {
    if (multiple) {
      return Array.isArray(selectedValues) && selectedValues.includes(value);
    }
    return selectedValues === value;
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-200 mb-3">
        {title}
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleClick(option.value)}
            className={`
              p-3 rounded-lg border transition-all duration-300 text-sm font-medium
              ${isSelected(option.value)
                ? 'border-blue-500 bg-blue-600/30 text-blue-200 shadow-lg'
                : 'border-slate-600 bg-slate-800/50 hover:border-blue-400 text-slate-300 hover:bg-slate-700/50'
              }
            `}
            style={isSelected(option.value) ? { 
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' 
            } : {}}
          >
            <div className="flex items-center justify-center">
              <span className="text-center">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
