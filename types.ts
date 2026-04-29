
export enum ThemeColor {
  SKY = 'Cielo',
  MINT = 'Menta',
  LAVENDER = 'Lavanda',
  PEACH = 'Durazno',
  ROSE = 'Rosa',
  AMBER = 'Ámbar',
  CYAN = 'Cian',
  FUCHSIA = 'Fucsia',
}

export enum AssistantVoice {
  FEMALE = 'Femenina',
  MALE = 'Masculina',
}

export enum FocusArea {
  ADAPTIVE_AUTONOMY = 'Área adaptativa y de autonomía',
  SENSORY_PERCEPTUAL = 'Área sensorial–perceptiva',
  SOCIOEMOTIONAL = 'Área socioemocional',
  COMMUNICATION_LANGUAGE = 'Área comunicativa y del lenguaje',
  COGNITIVE_ACADEMIC = 'Área cognitiva–académica',
}

export enum LearningStyle {
  VISUAL = 'Visual',
  AUDITORY = 'Auditivo',
  READING_WRITING = 'Lectura/Escritura',
  SOCIAL = 'Social',
  INDIVIDUAL = 'Individual',
}

export enum SyllabicLevel {
  PRESILABICO = 'Presilábico',
  SILABICO = 'Silábico',
  ALFABETICO = 'Alfabético',
}

export enum SpecialNeed {
  DYSLEXIA = 'Dislexia',
  PHONOLOGICAL = 'Fonológico',
  SEMANTIC = 'Semántico',
  PRAGMATIC = 'Pragmático',
  TEL = 'TEL (Trastorno Específico del Lenguaje)',
  AUTISM_SPECTRUM = 'Espectro Autista',
  ADHD = 'TDAH',
  MIXED = 'Trastorno Mixto',
  INTELLECTUAL_DISABILITY = 'Discapacidad Intelectual',
  OTHER = 'Otro',
}

export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Medio',
  HARD = 'Difícil',
}

export enum LevelId {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum FontSize {
  NORMAL = 'Normal',
  MEDIUM = 'Mediana',
  LARGE = 'Grande',
}

export interface SessionActivityRecord {
    instruction: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    difficulty?: Difficulty;
}

export interface SessionRecord {
    startTime: string;
    endTime: string;
    durationSeconds: number;
    activities: SessionActivityRecord[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  age: number;
  avatar: string;
  themeColor: ThemeColor;
  assistantVoice: AssistantVoice;
  focusAreas: FocusArea[];
  learningStyle: LearningStyle;
  specialNeedType: SpecialNeed;
  favoriteTopics: string[];
  supportStrategies: string[];
  level: SyllabicLevel;
  currentLevel: number;
  score: number;
  correctAnswersStreak: number;
  history: SessionRecord[];
  badges: string[];
  preferredDifficulty?: Difficulty;
  dailySessionDuration?: number;
  favoriteGameTypes?: string;
  fontSize?: FontSize;
  therapistName?: string;
  unlockedLevels: number[];
  worldProgress: Record<string, WorldProgress>;
}

export interface TherapistReport {
  id: string;
  date: string;
  time: string;
  durationMinutes?: number;
  childId: string;
  childName: string;
  therapistName: string;
  levelWorked: Difficulty;
  activityPerformed: string;
  result: string;
  observations: string;
}

export enum GameState {
  WELCOME,
  PROFILE_SELECTION,
  PROFILE_SETUP,
  MANAGE_PROFILES,
  PREFERENCES,
  SESSION_REPORT,
  LOADING,
  ACTIVITY,
  FEEDBACK,
  SESSION_END,
  CREDITS,
  SESSION_HISTORY,
  WORLD_SELECTION,
  LEVEL_MAP,
  THERAPIST_DASHBOARD,
}

export enum NodeType {
    ACTIVITY = 'activity',
    CHEST = 'chest',
    FINAL = 'final',
}

export interface MapNode {
    id: string;
    type: NodeType;
    activityId?: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    position: { x: number; y: number };
    reward?: string;
}

export interface WorldProgress {
    worldId: Difficulty;
    completedNodes: string[];
    unlockedNodes: string[];
    currentScore: number;
}

export enum ActivityType {
  // Nivel Fácil: Reconocimiento visual y asociación palabra-imagen
  CHOOSE_WORD = 'choose_word',      // Elige la palabra correcta
  SAY_NAME = 'say_name',            // Di el nombre de la imagen
  FIND_OPTION = 'find_option',      // Encuentra la opción correcta (similar a choose_word pero con más opciones o distractores)

  // Nivel Medio: Producción oral y repetición
  REPEAT_WORD = 'repeat_word',      // Repite la palabra
  LISTEN_SAY = 'listen_say',        // Escucha y di
  REPEAT_SYLLABLES = 'repeat_syllables', // Repite sílabas

  // Nivel Difícil: Construcción lingüística
  COMPLETE_WORD = 'complete_word',  // Completa la palabra (falta una parte)
  MISSING_LETTER = 'missing_letter', // Di la letra faltante
  BUILD_FROM_IMAGE = 'build_from_image', // Construye la palabra desde la imagen (letras desordenadas o faltantes)
  
  // Legacy/Compatibility
  IMAGE_CHOICE = 'image_choice',
  BUILD_WORD = 'build_word',
}

export interface Activity {
  id: string;
  type: ActivityType;
  levelId: LevelId;
  instruction: string;
  options?: string[];
  correctAnswer: string;
  imageUrl?: string;
  word?: string; 
  missingLetters?: string[]; 
  fullWord?: string;
  syllables?: string[]; // Para REPEAT_SYLLABLES
}

export enum AvatarExpression {
    NEUTRAL = 'neutral',
    HAPPY = 'happy',
    ENCOURAGING = 'encouraging',
}
