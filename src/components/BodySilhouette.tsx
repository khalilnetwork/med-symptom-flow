
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface BodyZone {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  coordinates: string; // SVG path or polygon coordinates
  category: 'head' | 'torso' | 'arms' | 'legs' | 'hands' | 'feet';
}

interface SymptomVisualization {
  zoneId: string;
  intensity: number; // 0-10
  type: string;
  hasIrradiation: boolean;
  irradiationZones?: string[];
}

interface BodySilhouetteProps {
  onZoneClick: (zone: BodyZone) => void;
  symptomVisualizations: SymptomVisualization[];
  language: 'fr' | 'ar';
}

const bodyZones: BodyZone[] = [
  { id: 'head', name: { fr: 'Tête', ar: 'الرأس' }, coordinates: 'M150,50 Q200,50 200,100 Q200,150 150,150 Q100,150 100,100 Q100,50 150,50', category: 'head' },
  { id: 'neck', name: { fr: 'Cou', ar: 'الرقبة' }, coordinates: 'M130,150 L170,150 L170,180 L130,180 Z', category: 'head' },
  { id: 'chest', name: { fr: 'Poitrine', ar: 'الصدر' }, coordinates: 'M100,180 L200,180 L200,260 L100,260 Z', category: 'torso' },
  { id: 'abdomen', name: { fr: 'Abdomen', ar: 'البطن' }, coordinates: 'M110,260 L190,260 L190,340 L110,340 Z', category: 'torso' },
  { id: 'pelvis', name: { fr: 'Bassin', ar: 'الحوض' }, coordinates: 'M115,340 L185,340 L185,380 L115,380 Z', category: 'torso' },
  { id: 'left-arm-upper', name: { fr: 'Bras gauche (haut)', ar: 'الذراع الأيسر (أعلى)' }, coordinates: 'M60,180 L100,180 L100,260 L60,260 Z', category: 'arms' },
  { id: 'right-arm-upper', name: { fr: 'Bras droit (haut)', ar: 'الذراع الأيمن (أعلى)' }, coordinates: 'M200,180 L240,180 L240,260 L200,260 Z', category: 'arms' },
  { id: 'left-arm-lower', name: { fr: 'Avant-bras gauche', ar: 'الساعد الأيسر' }, coordinates: 'M50,260 L90,260 L90,340 L50,340 Z', category: 'arms' },
  { id: 'right-arm-lower', name: { fr: 'Avant-bras droit', ar: 'الساعد الأيمن' }, coordinates: 'M210,260 L250,340 L210,340 Z', category: 'arms' },
  { id: 'left-thigh', name: { fr: 'Cuisse gauche', ar: 'الفخذ الأيسر' }, coordinates: 'M115,380 L150,380 L150,480 L115,480 Z', category: 'legs' },
  { id: 'right-thigh', name: { fr: 'Cuisse droite', ar: 'الفخذ الأيمن' }, coordinates: 'M150,380 L185,380 L185,480 L150,480 Z', category: 'legs' },
  { id: 'left-leg', name: { fr: 'Jambe gauche', ar: 'الساق اليسرى' }, coordinates: 'M120,480 L145,480 L145,580 L120,580 Z', category: 'legs' },
  { id: 'right-leg', name: { fr: 'Jambe droite', ar: 'الساق اليمنى' }, coordinates: 'M155,480 L180,480 L180,580 L155,580 Z', category: 'legs' }
];

export const BodySilhouette = ({ onZoneClick, symptomVisualizations, language }: BodySilhouetteProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const getZoneColor = (zoneId: string) => {
    const symptom = symptomVisualizations.find(s => s.zoneId === zoneId);
    if (!symptom) return 'rgba(147, 197, 253, 0.3)'; // Light blue default
    
    const intensity = symptom.intensity;
    if (intensity <= 3) return 'rgba(34, 197, 94, 0.6)'; // Green (mild)
    if (intensity <= 6) return 'rgba(251, 191, 36, 0.7)'; // Yellow (moderate)
    return 'rgba(239, 68, 68, 0.8)'; // Red (severe)
  };

  const getIrradiationEffect = (zoneId: string) => {
    const symptom = symptomVisualizations.find(s => s.zoneId === zoneId);
    if (!symptom?.hasIrradiation) return '';
    
    return 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))';
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-medical-slate-800">
          {language === 'fr' ? 'Cliquez sur la zone concernée' : 'انقر على المنطقة المصابة'}
        </h3>
        <p className="text-sm text-medical-slate-600">
          {language === 'fr' ? 'Sélectionnez la localisation du symptôme' : 'حدد موقع العرض'}
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 300 600"
          className="w-full h-auto max-h-96 mx-auto"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
        >
          {/* Body outline */}
          <path
            d="M150,50 Q200,50 200,100 Q200,150 170,150 L240,180 L250,340 L210,340 L210,260 L200,260 L200,180 L185,380 L180,580 L155,580 L155,480 L150,480 L150,380 L115,380 L115,480 L120,580 L145,580 L145,480 L120,480 L115,380 L100,260 L90,340 L50,340 L60,260 L100,180 L130,150 Q100,150 100,100 Q100,50 150,50"
            fill="rgba(226, 232, 240, 0.3)"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="2"
          />

          {/* Interactive zones */}
          {bodyZones.map((zone) => (
            <g key={zone.id}>
              <path
                d={zone.coordinates}
                fill={hoveredZone === zone.id ? 'rgba(59, 130, 246, 0.4)' : getZoneColor(zone.id)}
                stroke="rgba(71, 85, 105, 0.6)"
                strokeWidth="1"
                className="cursor-pointer transition-all duration-200 hover:stroke-2"
                style={{ filter: getIrradiationEffect(zone.id) }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onZoneClick(zone)}
              />
              
              {/* Zone labels on hover */}
              {hoveredZone === zone.id && (
                <text
                  x="150"
                  y="30"
                  textAnchor="middle"
                  className="fill-medical-slate-800 text-xs font-medium"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.8))' }}
                >
                  {zone.name[language]}
                </text>
              )}
            </g>
          ))}

          {/* Symptom intensity indicators */}
          {symptomVisualizations.map((symptom, index) => (
            <g key={`symptom-${symptom.zoneId}`}>
              <circle
                cx="270"
                cy={100 + index * 30}
                r="8"
                fill={getZoneColor(symptom.zoneId)}
                stroke="rgba(71, 85, 105, 0.6)"
                strokeWidth="1"
              />
              <text
                x="285"
                y={105 + index * 30}
                className="fill-medical-slate-700 text-xs font-medium"
              >
                {symptom.intensity}/10
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-medical-slate-600">
              {language === 'fr' ? 'Léger (1-3)' : 'خفيف (1-3)'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-medical-slate-600">
              {language === 'fr' ? 'Modéré (4-6)' : 'متوسط (4-6)'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <span className="text-medical-slate-600">
              {language === 'fr' ? 'Sévère (7-10)' : 'شديد (7-10)'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
