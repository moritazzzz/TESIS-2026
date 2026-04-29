import { Badge, ThemeColor, AssistantVoice, FocusArea, LearningStyle, SpecialNeed, Difficulty, SyllabicLevel } from './types';

export const LEVEL_UP_SCORE = 10;

export const THEME_OPTIONS = Object.values(ThemeColor);
export const VOICE_OPTIONS = Object.values(AssistantVoice);
export const FOCUS_AREA_OPTIONS = Object.values(FocusArea);
export const LEARNING_STYLE_OPTIONS = Object.values(LearningStyle);
export const SPECIAL_NEED_OPTIONS = Object.values(SpecialNeed);
export const DIFFICULTY_OPTIONS = Object.values(Difficulty);
export const SYLLABIC_LEVEL_OPTIONS = Object.values(SyllabicLevel);

export const AVATAR_OPTIONS = ['🦁', '🦊', '🐻', '🐼', '🐨', '🐯', '🐸', '🐵'];
export const SESSION_DURATION_OPTIONS = [5, 10, 15, 20, 30];

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'Primeros Pasos',
    description: '¡Has ganado tu primer punto!',
    icon: '👣'
  },
  {
    id: 'high_five',
    name: '¡Choca esos cinco!',
    description: '5 respuestas correctas seguidas.',
    icon: '✋'
  },
  {
    id: 'super_star',
    name: 'Súper Estrella',
    description: 'Has alcanzado 20 puntos.',
    icon: '⭐'
  },
  {
    id: 'syllabic_explorer',
    name: 'Explorador Silábico',
    description: 'Has llegado al nivel silábico.',
    icon: '🔍'
  },
  {
    id: 'alphabet_master',
    name: 'Maestro del Alfabeto',
    description: 'Has llegado al nivel alfabético.',
    icon: '🎓'
  },
  {
    id: 'streak_fire',
    name: 'Racha de Fuego',
    description: '10 respuestas correctas seguidas.',
    icon: '🔥'
  }
];
