
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface BodyZone {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  coordinates: string;
  category: 'head' | 'torso' | 'arms' | 'legs' | 'hands' | 'feet';
}

interface SymptomVisualization {
  zoneId: string;
  intensity: number;
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
  { id: 'head', name: { fr: 'Tête', ar: 'الرأس' }, coordinates: 'M150,30 Q180,30 180,70 Q180,90 150,90 Q120,90 120,70 Q120,30 150,30', category: 'head' },
  { id: 'neck', name: { fr: 'Cou', ar: 'الرقبة' }, coordinates: 'M140,90 L160,90 L160,110 L140,110 Z', category: 'head' },
  { id: 'chest', name: { fr: 'Poitrine', ar: 'الصدر' }, coordinates: 'M120,110 L180,110 L175,180 L125,180 Z', category: 'torso' },
  { id: 'abdomen', name: { fr: 'Abdomen', ar: 'البطن' }, coordinates: 'M125,180 L175,180 L170,250 L130,250 Z', category: 'torso' },
  { id: 'pelvis', name: { fr: 'Bassin', ar: 'الحوض' }, coordinates: 'M130,250 L170,250 L165,290 L135,290 Z', category: 'torso' },
  { id: 'left-shoulder', name: { fr: 'Épaule gauche', ar: 'الكتف الأيسر' }, coordinates: 'M90,110 L120,110 L120,140 L90,140 Z', category: 'arms' },
  { id: 'right-shoulder', name: { fr: 'Épaule droite', ar: 'الكتف الأيمن' }, coordinates: 'M180,110 L210,110 L210,140 L180,140 Z', category: 'arms' },
  { id: 'left-arm-upper', name: { fr: 'Bras gauche', ar: 'الذراع الأيسر' }, coordinates: 'M85,140 L115,140 L115,210 L85,210 Z', category: 'arms' },
  { id: 'right-arm-upper', name: { fr: 'Bras droit', ar: 'الذراع الأيمن' }, coordinates: 'M185,140 L215,140 L215,210 L185,210 Z', category: 'arms' },
  { id: 'left-arm-lower', name: { fr: 'Avant-bras gauche', ar: 'الساعد الأيسر' }, coordinates: 'M80,210 L110,210 L110,280 L80,280 Z', category: 'arms' },
  { id: 'right-arm-lower', name: { fr: 'Avant-bras droit', ar: 'الساعد الأيمن' }, coordinates: 'M190,210 L220,280 L190,280 Z', category: 'arms' },
  { id: 'left-thigh', name: { fr: 'Cuisse gauche', ar: 'الفخذ الأيسر' }, coordinates: 'M135,290 L150,290 L150,380 L135,380 Z', category: 'legs' },
  { id: 'right-thigh', name: { fr: 'Cuisse droite', ar: 'الفخذ الأيمن' }, coordinates: 'M150,290 L165,290 L165,380 L150,380 Z', category: 'legs' },
  { id: 'left-knee', name: { fr: 'Genou gauche', ar: 'الركبة اليسرى' }, coordinates: 'M135,380 L150,380 L150,400 L135,400 Z', category: 'legs' },
  { id: 'right-knee', name: { fr: 'Genou droit', ar: 'الركبة اليمنى' }, coordinates: 'M150,380 L165,380 L165,400 L150,400 Z', category: 'legs' },
  { id: 'left-leg', name: { fr: 'Jambe gauche', ar: 'الساق اليسرى' }, coordinates: 'M137,400 L148,400 L148,480 L137,480 Z', category: 'legs' },
  { id: 'right-leg', name: { fr: 'Jambe droite', ar: 'الساق اليمنى' }, coordinates: 'M152,400 L163,400 L163,480 L152,480 Z', category: 'legs' },
  { id: 'left-foot', name: { fr: 'Pied gauche', ar: 'القدم اليسرى' }, coordinates: 'M130,480 L155,480 L155,500 L130,500 Z', category: 'feet' },
  { id: 'right-foot', name: { fr: 'Pied droit', ar: 'القدم اليمنى' }, coordinates: 'M145,480 L170,480 L170,500 L145,500 Z', category: 'feet' }
];

export const BodySilhouette = ({ onZoneClick, symptomVisualizations, language }: BodySilhouetteProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const getZoneColor = (zoneId: string) => {
    const symptom = symptomVisualizations.find(s => s.zoneId === zoneId);
    if (!symptom) return 'rgba(59, 130, 246, 0.2)'; // Default blue
    
    const intensity = symptom.intensity;
    if (intensity <= 3) return 'rgba(34, 197, 94, 0.6)'; // Green
    if (intensity <= 6) return 'rgba(251, 191, 36, 0.7)'; // Yellow
    return 'rgba(239, 68, 68, 0.8)'; // Red
  };

  const getZoneStroke = (zoneId: string) => {
    const symptom = symptomVisualizations.find(s => s.zoneId === zoneId);
    if (!symptom) return '#3b82f6';
    
    const intensity = symptom.intensity;
    if (intensity <= 3) return '#22c55e';
    if (intensity <= 6) return '#fbbf24';
    return '#ef4444';
  };

  const getIrradiationEffect = (zoneId: string) => {
    const symptom = symptomVisualizations.find(s => s.zoneId === zoneId);
    if (!symptom?.hasIrradiation) return '';
    
    return 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))';
  };

  return (
    <Card className="bg-slate-900/90 backdrop-blur-lg border-slate-800 p-6 max-w-md mx-auto shadow-2xl">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          {language === 'fr' ? 'Sélection anatomique' : 'الاختيار التشريحي'}
        </h3>
        <p className="text-sm text-slate-400">
          {language === 'fr' ? 'Cliquez sur la zone concernée' : 'انقر على المنطقة المصابة'}
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 300 520"
          className="w-full h-auto max-h-96 mx-auto"
          style={{ 
            filter: 'drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3))',
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 100%)'
          }}
        >
          {/* Futuristic grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#1e293b', stopOpacity: 0.8}} />
              <stop offset="50%" style={{stopColor: '#334155', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#0f172a', stopOpacity: 0.9}} />
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Main body outline with futuristic styling */}
          <g>
            {/* Head */}
            <ellipse cx="150" cy="60" rx="30" ry="30" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/>
            
            {/* Neck */}
            <rect x="140" y="90" width="20" height="20" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/>
            
            {/* Torso */}
            <polygon points="120,110 180,110 175,180 170,250 165,290 135,290 130,250 125,180" 
                     fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/>
            
            {/* Arms */}
            <rect x="90" y="110" width="30" height="30" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left shoulder */}
            <rect x="180" y="110" width="30" height="30" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right shoulder */}
            <rect x="85" y="140" width="30" height="70" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left upper arm */}
            <rect x="185" y="140" width="30" height="70" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right upper arm */}
            <rect x="80" y="210" width="30" height="70" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left forearm */}
            <rect x="190" y="210" width="30" height="70" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right forearm */}
            
            {/* Legs */}
            <rect x="135" y="290" width="15" height="90" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left thigh */}
            <rect x="150" y="290" width="15" height="90" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right thigh */}
            <rect x="135" y="380" width="15" height="20" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left knee */}
            <rect x="150" y="380" width="15" height="20" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right knee */}
            <rect x="137" y="400" width="11" height="80" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left shin */}
            <rect x="152" y="400" width="11" height="80" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right shin */}
            <ellipse cx="142" cy="490" rx="12" ry="10" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Left foot */}
            <ellipse cx="158" cy="490" rx="12" ry="10" fill="url(#bodyGradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/> {/* Right foot */}
          </g>

          {/* Interactive zones */}
          {bodyZones.map((zone) => (
            <g key={zone.id}>
              <path
                d={zone.coordinates}
                fill={hoveredZone === zone.id ? 'rgba(59, 130, 246, 0.5)' : getZoneColor(zone.id)}
                stroke={hoveredZone === zone.id ? '#60a5fa' : getZoneStroke(zone.id)}
                strokeWidth={hoveredZone === zone.id ? "2" : "1"}
                className="cursor-pointer transition-all duration-300 hover:stroke-2"
                style={{ 
                  filter: getIrradiationEffect(zone.id),
                  mixBlendMode: 'screen'
                }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onZoneClick(zone)}
              />
              
              {/* Zone labels on hover */}
              {hoveredZone === zone.id && (
                <text
                  x="150"
                  y="20"
                  textAnchor="middle"
                  className="fill-blue-200 text-xs font-medium"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    textShadow: '0 0 10px rgba(59, 130, 246, 0.8)'
                  }}
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
                cy={60 + index * 25}
                r="6"
                fill={getZoneColor(symptom.zoneId)}
                stroke={getZoneStroke(symptom.zoneId)}
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' }}
              />
              <text
                x="280"
                y={65 + index * 25}
                className="fill-blue-200 text-xs font-medium"
                style={{ textShadow: '0 0 6px rgba(59, 130, 246, 0.8)' }}
              >
                {symptom.intensity}/10
              </text>
            </g>
          ))}
        </svg>

        {/* Legend with futuristic styling */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 shadow-lg" style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }}></div>
            <span className="text-slate-300">
              {language === 'fr' ? 'Léger (1-3)' : 'خفيف (1-3)'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-lg" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)' }}></div>
            <span className="text-slate-300">
              {language === 'fr' ? 'Modéré (4-6)' : 'متوسط (4-6)'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2 shadow-lg" style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)' }}></div>
            <span className="text-slate-300">
              {language === 'fr' ? 'Sévère (7-10)' : 'شديد (7-10)'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
