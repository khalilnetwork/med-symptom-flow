
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
      <h4 className="text-sm font-medium text-medical-slate-700 mb-3">
        {title}
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleClick(option.value)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
              ${isSelected(option.value)
                ? 'border-medical-cyan-500 bg-medical-cyan-50 text-medical-cyan-700'
                : 'border-medical-slate-200 bg-white hover:border-medical-cyan-300 text-medical-slate-600'
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              {option.icon && <span>{option.icon}</span>}
              <span className="text-center">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
