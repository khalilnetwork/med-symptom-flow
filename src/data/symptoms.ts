
import { Symptom } from '@/types/medical';

export const symptoms: Symptom[] = [
  {
    id: 'douleur',
    name: { fr: 'Douleur', ar: 'ألم' },
    icon: '⚡',
    color: 'from-red-400 to-red-600',
    category: 'pain',
    questions: [
      {
        id: 'location',
        text: { fr: 'Où est localisée la douleur ?', ar: 'أين يقع الألم؟' },
        type: 'select',
        options: [
          { fr: 'Tête', ar: 'الرأس', value: 'head' },
          { fr: 'Cou', ar: 'الرقبة', value: 'neck' },
          { fr: 'Poitrine', ar: 'الصدر', value: 'chest' },
          { fr: 'Abdomen', ar: 'البطن', value: 'abdomen' },
          { fr: 'Dos', ar: 'الظهر', value: 'back' },
          { fr: 'Membres', ar: 'الأطراف', value: 'limbs' }
        ],
        required: true
      },
      {
        id: 'intensity',
        text: { fr: 'Intensité de la douleur (1-10)', ar: 'شدة الألم (1-10)' },
        type: 'scale',
        required: true
      },
      {
        id: 'type',
        text: { fr: 'Type de douleur', ar: 'نوع الألم' },
        type: 'select',
        options: [
          { fr: 'Aiguë/Lancinante', ar: 'حادة/طاعنة', value: 'sharp' },
          { fr: 'Sourde/Constante', ar: 'خفيفة/مستمرة', value: 'dull' },
          { fr: 'Brûlante', ar: 'حارقة', value: 'burning' },
          { fr: 'Crampe', ar: 'تشنج', value: 'cramping' }
        ]
      },
      {
        id: 'duration',
        text: { fr: 'Depuis quand ?', ar: 'منذ متى؟' },
        type: 'select',
        options: [
          { fr: 'Moins d\'1 heure', ar: 'أقل من ساعة', value: '<1h' },
          { fr: '1-6 heures', ar: '1-6 ساعات', value: '1-6h' },
          { fr: '6-24 heures', ar: '6-24 ساعة', value: '6-24h' },
          { fr: '1-7 jours', ar: '1-7 أيام', value: '1-7d' },
          { fr: 'Plus d\'une semaine', ar: 'أكثر من أسبوع', value: '>1w' }
        ]
      }
    ]
  },
  {
    id: 'fievre',
    name: { fr: 'Fièvre', ar: 'حمى' },
    icon: '🌡️',
    color: 'from-orange-400 to-red-500',
    category: 'general',
    questions: [
      {
        id: 'temperature',
        text: { fr: 'Température mesurée (°C)', ar: 'درجة الحرارة المقاسة (°م)' },
        type: 'number',
        required: true
      },
      {
        id: 'duration',
        text: { fr: 'Depuis quand ?', ar: 'منذ متى؟' },
        type: 'select',
        options: [
          { fr: 'Aujourd\'hui', ar: 'اليوم', value: 'today' },
          { fr: '1-2 jours', ar: '1-2 أيام', value: '1-2d' },
          { fr: '3-7 jours', ar: '3-7 أيام', value: '3-7d' },
          { fr: 'Plus d\'une semaine', ar: 'أكثر من أسبوع', value: '>1w' }
        ]
      },
      {
        id: 'associated',
        text: { fr: 'Symptômes associés', ar: 'أعراض مصاحبة' },
        type: 'multiselect',
        options: [
          { fr: 'Frissons', ar: 'رعشة', value: 'chills' },
          { fr: 'Sueurs', ar: 'عرق', value: 'sweating' },
          { fr: 'Maux de tête', ar: 'صداع', value: 'headache' },
          { fr: 'Fatigue', ar: 'تعب', value: 'fatigue' }
        ]
      }
    ]
  },
  {
    id: 'toux',
    name: { fr: 'Toux', ar: 'سعال' },
    icon: '🫁',
    color: 'from-blue-400 to-blue-600',
    category: 'respiratory',
    questions: [
      {
        id: 'type',
        text: { fr: 'Type de toux', ar: 'نوع السعال' },
        type: 'select',
        options: [
          { fr: 'Sèche', ar: 'جاف', value: 'dry' },
          { fr: 'Grasse/Productive', ar: 'مع بلغم', value: 'productive' }
        ],
        required: true
      },
      {
        id: 'sputum',
        text: { fr: 'Couleur des crachats', ar: 'لون البلغم' },
        type: 'select',
        options: [
          { fr: 'Transparent', ar: 'شفاف', value: 'clear' },
          { fr: 'Blanc', ar: 'أبيض', value: 'white' },
          { fr: 'Jaune/Vert', ar: 'أصفر/أخضر', value: 'yellow-green' },
          { fr: 'Avec sang', ar: 'مع دم', value: 'bloody' }
        ]
      }
    ]
  },
  {
    id: 'dyspnee',
    name: { fr: 'Difficulté respiratoire', ar: 'صعوبة في التنفس' },
    icon: '💨',
    color: 'from-cyan-400 to-blue-500',
    category: 'respiratory',
    questions: [
      {
        id: 'severity',
        text: { fr: 'Sévérité (1-10)', ar: 'الشدة (1-10)' },
        type: 'scale',
        required: true
      },
      {
        id: 'triggers',
        text: { fr: 'Déclencheurs', ar: 'المحفزات' },
        type: 'multiselect',
        options: [
          { fr: 'Effort', ar: 'مجهود', value: 'effort' },
          { fr: 'Position couchée', ar: 'وضعية الاستلقاء', value: 'lying' },
          { fr: 'Au repos', ar: 'في الراحة', value: 'rest' }
        ]
      }
    ]
  },
  {
    id: 'cephalee',
    name: { fr: 'Maux de tête', ar: 'صداع' },
    icon: '🧠',
    color: 'from-purple-400 to-purple-600',
    category: 'neurological',
    questions: [
      {
        id: 'location',
        text: { fr: 'Localisation', ar: 'الموقع' },
        type: 'select',
        options: [
          { fr: 'Front', ar: 'الجبهة', value: 'frontal' },
          { fr: 'Tempes', ar: 'الصدغ', value: 'temporal' },
          { fr: 'Arrière de la tête', ar: 'مؤخرة الرأس', value: 'occipital' },
          { fr: 'Généralisé', ar: 'عام', value: 'generalized' }
        ]
      },
      {
        id: 'intensity',
        text: { fr: 'Intensité (1-10)', ar: 'الشدة (1-10)' },
        type: 'scale',
        required: true
      }
    ]
  },
  {
    id: 'vertiges',
    name: { fr: 'Vertiges', ar: 'دوخة' },
    icon: '💫',
    color: 'from-indigo-400 to-indigo-600',
    category: 'neurological',
    questions: [
      {
        id: 'type',
        text: { fr: 'Type de vertige', ar: 'نوع الدوخة' },
        type: 'select',
        options: [
          { fr: 'Rotatoire', ar: 'دوراني', value: 'rotatory' },
          { fr: 'Instabilité', ar: 'عدم استقرار', value: 'instability' },
          { fr: 'Sensation de flottement', ar: 'شعور بالطفو', value: 'floating' }
        ]
      }
    ]
  },
  {
    id: 'nausees',
    name: { fr: 'Nausées/Vomissements', ar: 'غثيان/قيء' },
    icon: '🤢',
    color: 'from-green-400 to-green-600',
    category: 'digestive',
    questions: [
      {
        id: 'frequency',
        text: { fr: 'Fréquence', ar: 'التكرار' },
        type: 'select',
        options: [
          { fr: 'Occasionnel', ar: 'أحياناً', value: 'occasional' },
          { fr: 'Fréquent', ar: 'متكرر', value: 'frequent' },
          { fr: 'Persistant', ar: 'مستمر', value: 'persistent' }
        ]
      }
    ]
  },
  {
    id: 'diarrhee',
    name: { fr: 'Diarrhée', ar: 'إسهال' },
    icon: '💩',
    color: 'from-yellow-400 to-orange-500',
    category: 'digestive',
    questions: [
      {
        id: 'frequency',
        text: { fr: 'Nombre de selles par jour', ar: 'عدد مرات التبرز في اليوم' },
        type: 'number',
        required: true
      },
      {
        id: 'consistency',
        text: { fr: 'Consistance', ar: 'القوام' },
        type: 'select',
        options: [
          { fr: 'Liquide', ar: 'سائل', value: 'liquid' },
          { fr: 'Molle', ar: 'طري', value: 'soft' },
          { fr: 'Avec sang', ar: 'مع دم', value: 'bloody' }
        ]
      }
    ]
  },
  {
    id: 'palpitations',
    name: { fr: 'Palpitations', ar: 'خفقان' },
    icon: '💓',
    color: 'from-pink-400 to-red-500',
    category: 'cardiac',
    questions: [
      {
        id: 'frequency',
        text: { fr: 'Fréquence cardiaque ressentie', ar: 'معدل ضربات القلب المحسوس' },
        type: 'select',
        options: [
          { fr: 'Rapide', ar: 'سريع', value: 'fast' },
          { fr: 'Irrégulier', ar: 'غير منتظم', value: 'irregular' },
          { fr: 'Fort', ar: 'قوي', value: 'strong' }
        ]
      }
    ]
  },
  {
    id: 'fatigue',
    name: { fr: 'Fatigue générale', ar: 'تعب عام' },
    icon: '🥱',
    color: 'from-gray-400 to-gray-600',
    category: 'general',
    questions: [
      {
        id: 'severity',
        text: { fr: 'Sévérité (1-10)', ar: 'الشدة (1-10)' },
        type: 'scale',
        required: true
      },
      {
        id: 'duration',
        text: { fr: 'Depuis quand ?', ar: 'منذ متى؟' },
        type: 'select',
        options: [
          { fr: 'Quelques jours', ar: 'بضعة أيام', value: 'days' },
          { fr: 'Quelques semaines', ar: 'بضعة أسابيع', value: 'weeks' },
          { fr: 'Plusieurs mois', ar: 'عدة أشهر', value: 'months' }
        ]
      }
    ]
  },
  {
    id: 'troubles_sommeil',
    name: { fr: 'Troubles du sommeil', ar: 'اضطرابات النوم' },
    icon: '😴',
    color: 'from-indigo-400 to-blue-500',
    category: 'general',
    questions: [
      {
        id: 'type',
        text: { fr: 'Type de trouble', ar: 'نوع الاضطراب' },
        type: 'multiselect',
        options: [
          { fr: 'Difficultés d\'endormissement', ar: 'صعوبة في النوم', value: 'falling_asleep' },
          { fr: 'Réveils nocturnes', ar: 'استيقاظ ليلي', value: 'night_waking' },
          { fr: 'Réveil précoce', ar: 'استيقاظ مبكر', value: 'early_waking' }
        ]
      }
    ]
  },
  {
    id: 'eruption_cutanee',
    name: { fr: 'Éruptions cutanées', ar: 'طفح جلدي' },
    icon: '🔴',
    color: 'from-red-300 to-pink-500',
    category: 'dermatological',
    questions: [
      {
        id: 'location',
        text: { fr: 'Localisation', ar: 'الموقع' },
        type: 'multiselect',
        options: [
          { fr: 'Visage', ar: 'الوجه', value: 'face' },
          { fr: 'Bras', ar: 'الذراعين', value: 'arms' },
          { fr: 'Jambes', ar: 'الساقين', value: 'legs' },
          { fr: 'Tronc', ar: 'الجذع', value: 'trunk' }
        ]
      },
      {
        id: 'appearance',
        text: { fr: 'Aspect', ar: 'المظهر' },
        type: 'select',
        options: [
          { fr: 'Rouges/inflammatoires', ar: 'حمراء/التهابية', value: 'red' },
          { fr: 'Avec démangeaisons', ar: 'مع حكة', value: 'itchy' },
          { fr: 'Avec desquamation', ar: 'مع تقشر', value: 'scaly' }
        ]
      }
    ]
  },
  {
    id: 'troubles_urinaires',
    name: { fr: 'Troubles urinaires', ar: 'اضطرابات بولية' },
    icon: '🚽',
    color: 'from-yellow-300 to-yellow-600',
    category: 'urological',
    questions: [
      {
        id: 'symptoms',
        text: { fr: 'Symptômes', ar: 'الأعراض' },
        type: 'multiselect',
        options: [
          { fr: 'Brûlures', ar: 'حرقة', value: 'burning' },
          { fr: 'Fréquence augmentée', ar: 'تكرار متزايد', value: 'frequency' },
          { fr: 'Urgence', ar: 'إلحاح', value: 'urgency' },
          { fr: 'Sang dans les urines', ar: 'دم في البول', value: 'blood' }
        ]
      }
    ]
  },
  {
    id: 'perte_poids',
    name: { fr: 'Perte de poids', ar: 'فقدان الوزن' },
    icon: '⚖️',
    color: 'from-purple-300 to-purple-500',
    category: 'general',
    questions: [
      {
        id: 'amount',
        text: { fr: 'Nombre de kilos perdus', ar: 'عدد الكيلوغرامات المفقودة' },
        type: 'number',
        required: true
      },
      {
        id: 'timeframe',
        text: { fr: 'Sur quelle période ?', ar: 'خلال أي فترة؟' },
        type: 'select',
        options: [
          { fr: '1 mois', ar: 'شهر واحد', value: '1month' },
          { fr: '3 mois', ar: '3 أشهر', value: '3months' },
          { fr: '6 mois', ar: '6 أشهر', value: '6months' },
          { fr: 'Plus de 6 mois', ar: 'أكثر من 6 أشهر', value: '>6months' }
        ]
      }
    ]
  },
  {
    id: 'anxiete',
    name: { fr: 'Anxiété/Stress', ar: 'قلق/ضغط نفسي' },
    icon: '😰',
    color: 'from-amber-400 to-orange-500',
    category: 'psychological',
    questions: [
      {
        id: 'severity',
        text: { fr: 'Niveau d\'anxiété (1-10)', ar: 'مستوى القلق (1-10)' },
        type: 'scale',
        required: true
      },
      {
        id: 'symptoms',
        text: { fr: 'Manifestations', ar: 'التجليات' },
        type: 'multiselect',
        options: [
          { fr: 'Palpitations', ar: 'خفقان', value: 'palpitations' },
          { fr: 'Sueurs', ar: 'عرق', value: 'sweating' },
          { fr: 'Tremblements', ar: 'رعشة', value: 'tremors' },
          { fr: 'Troubles du sommeil', ar: 'اضطرابات النوم', value: 'sleep_issues' }
        ]
      }
    ]
  }
];
