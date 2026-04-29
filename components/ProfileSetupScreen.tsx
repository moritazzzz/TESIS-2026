
import React, { useState, useEffect } from 'react';
import { UserProfile, FocusArea, ThemeColor, LearningStyle, SpecialNeed, Difficulty, FontSize, Badge, SyllabicLevel } from '../types';
import { THEME_OPTIONS, VOICE_OPTIONS, FOCUS_AREA_OPTIONS, LEARNING_STYLE_OPTIONS, SPECIAL_NEED_OPTIONS, AVATAR_OPTIONS, DIFFICULTY_OPTIONS, SESSION_DURATION_OPTIONS, SYLLABIC_LEVEL_OPTIONS } from '../constants';

interface ProfileSetupScreenProps {
  onSetupComplete: (profileData: Omit<UserProfile, 'id' | 'supportStrategies' | 'score' | 'correctAnswersStreak' | 'history'>) => void;
  onCancel?: () => void;
  profileToEdit?: UserProfile | null;
  onHelpTrigger?: (text: string) => void;
}

const THEME_CLASSES: Record<ThemeColor, { bg: string; ring: string; text: string }> = {
    [ThemeColor.SKY]: { bg: 'bg-sky-500', ring: 'ring-sky-500', text: 'text-sky-700' },
    [ThemeColor.MINT]: { bg: 'bg-emerald-500', ring: 'ring-emerald-500', text: 'text-emerald-700' },
    [ThemeColor.LAVENDER]: { bg: 'bg-violet-500', ring: 'ring-violet-500', text: 'text-violet-700' },
    [ThemeColor.PEACH]: { bg: 'bg-orange-500', ring: 'ring-orange-500', text: 'text-orange-700' },
    [ThemeColor.ROSE]: { bg: 'bg-rose-500', ring: 'ring-rose-500', text: 'text-rose-700' },
    [ThemeColor.AMBER]: { bg: 'bg-amber-500', ring: 'ring-amber-500', text: 'text-amber-700' },
    [ThemeColor.CYAN]: { bg: 'bg-cyan-500', ring: 'ring-cyan-500', text: 'text-cyan-700' },
    [ThemeColor.FUCHSIA]: { bg: 'bg-fuchsia-500', ring: 'ring-fuchsia-500', text: 'text-fuchsia-700' },
};

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onSetupComplete, onCancel, profileToEdit, onHelpTrigger }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [themeColor, setThemeColor] = useState(THEME_OPTIONS[0]);
  const [assistantVoice, setAssistantVoice] = useState(VOICE_OPTIONS[0]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(LEARNING_STYLE_OPTIONS[0]);
  const [specialNeedType, setSpecialNeedType] = useState(SPECIAL_NEED_OPTIONS[0]);
  const [favoriteTopics, setFavoriteTopics] = useState('');
  const [level, setLevel] = useState<SyllabicLevel>(SYLLABIC_LEVEL_OPTIONS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [dailySessionDuration, setDailySessionDuration] = useState<number>(15);
  const [therapistName, setTherapistName] = useState('');

  useEffect(() => {
    if (profileToEdit) {
      // Pre-populate form for editing
      setName(profileToEdit.name);
      setNickname(profileToEdit.nickname || '');
      setAge(String(profileToEdit.age));
      setAvatar(profileToEdit.avatar);
      setThemeColor(profileToEdit.themeColor);
      setAssistantVoice(profileToEdit.assistantVoice || VOICE_OPTIONS[0]);
      setFocusAreas(profileToEdit.focusAreas || []);
      setLearningStyle(profileToEdit.learningStyle);
      setSpecialNeedType(profileToEdit.specialNeedType);
      setFavoriteTopics(profileToEdit.favoriteTopics ? profileToEdit.favoriteTopics.join(', ') : '');
      setLevel(profileToEdit.level);
      setDifficulty(profileToEdit.preferredDifficulty || Difficulty.EASY);
      setDailySessionDuration(profileToEdit.dailySessionDuration || 15);
      setTherapistName(profileToEdit.therapistName || '');
    } else {
      // Explicitly reset to defaults for new profile
      setName('');
      setNickname('');
      setAge('');
      setAvatar(AVATAR_OPTIONS[0]);
      setThemeColor(THEME_OPTIONS[0]);
      setAssistantVoice(VOICE_OPTIONS[0]);
      setFocusAreas([]);
      setLearningStyle(LEARNING_STYLE_OPTIONS[0]);
      setSpecialNeedType(SPECIAL_NEED_OPTIONS[0]);
      setFavoriteTopics('');
      setLevel(SYLLABIC_LEVEL_OPTIONS[0]);
      setDifficulty(Difficulty.EASY);
      setDailySessionDuration(15);
      setTherapistName('');
    }
  }, [profileToEdit]);

  const handleFocusAreaChange = (area: FocusArea) => {
    setFocusAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
    onHelpTrigger?.("Selecciona las habilidades que quieres que practiquemos hoy.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age && focusAreas.length > 0) {
      onSetupComplete({
        name: name.trim(),
        nickname: nickname.trim() || name.trim(),
        age: parseInt(age),
        avatar,
        themeColor,
        assistantVoice,
        focusAreas,
        learningStyle,
        specialNeedType,
        favoriteTopics: favoriteTopics.split(',').map(t => t.trim()).filter(Boolean),
        level,
        preferredDifficulty: difficulty,
        dailySessionDuration,
        therapistName: therapistName.trim(),
        badges: profileToEdit ? profileToEdit.badges : [],
        unlockedLevels: profileToEdit ? profileToEdit.unlockedLevels : [1],
      });
    } else {
        alert("Por favor, completa todos los campos requeridos (Nombre, Edad y al menos un Área de Enfoque).")
    }
  };

  const FormLabel: React.FC<{ htmlFor?: string, children: React.ReactNode, required?: boolean }> = ({ htmlFor, children, required }) => (
    <label htmlFor={htmlFor} className="block text-base font-semibold text-slate-600 mb-2">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isEditing = !!profileToEdit;

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {isEditing ? `Editar Perfil de ${profileToEdit?.name}` : '¡Crea tu nuevo perfil!'}
        </h2>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`h-3 w-12 rounded-full transition-colors ${step >= s ? THEME_CLASSES[themeColor].bg : 'bg-slate-200'}`}></div>
            ))}
        </div>

        <div className={`relative w-24 h-24 rounded-full mb-6 flex items-center justify-center text-6xl transition-colors duration-300 ${THEME_CLASSES[themeColor].bg} shadow-lg`}>
            <span className="transform">{avatar}</span>
        </div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-700 mb-4 text-left">1. Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormLabel required>Elige tu Avatar</FormLabel>
                        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-2">
                            {AVATAR_OPTIONS.map(opt => (
                                <button 
                                    type="button" 
                                    key={opt} 
                                    onClick={() => setAvatar(opt)}
                                    className={`p-2 border rounded-xl text-2xl transition-all duration-200 ${avatar === opt ? `ring-4 ring-offset-2 ${THEME_CLASSES[themeColor].ring}` : 'hover:scale-110 border-slate-200'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <FormLabel htmlFor="name" required>Nombre</FormLabel>
                        <input 
                            id="name" 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" 
                        />
                    </div>
                    <div>
                        <FormLabel htmlFor="age" required>Edad</FormLabel>
                        <input 
                            id="age" 
                            type="number" 
                            value={age} 
                            onChange={e => setAge(e.target.value)} 
                            required 
                            min="3" 
                            max="10" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormLabel htmlFor="therapistName">Nombre del Terapeuta</FormLabel>
                        <input 
                            id="therapistName" 
                            type="text" 
                            value={therapistName} 
                            onChange={e => setTherapistName(e.target.value)} 
                            placeholder="Nombre del profesional a cargo"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" 
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Step 2: Customization */}
        {step === 2 && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-700 mb-4 text-left">2. Tu Estilo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <FormLabel>Color del Tema</FormLabel>
                        <div className="flex gap-4 mt-2">
                            {THEME_OPTIONS.map(opt => (
                                 <button 
                                    type="button" 
                                    key={opt} 
                                    onClick={() => setThemeColor(opt)}
                                    className={`w-12 h-12 rounded-full transition-transform transform hover:scale-110 ${THEME_CLASSES[opt].bg} ${themeColor === opt ? `ring-4 ring-offset-2 ${THEME_CLASSES[opt].ring}` : ''}`} 
                                 ></button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <FormLabel>Voz del Asistente</FormLabel>
                        <div className="flex gap-4 mt-2">
                            {VOICE_OPTIONS.map(opt => (
                                <label key={opt} className="flex items-center gap-2 text-base cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="voice" 
                                        value={opt} 
                                        checked={assistantVoice === opt} 
                                        onChange={() => setAssistantVoice(opt)} 
                                        className="w-5 h-5 accent-sky-500"
                                    />
                                    {opt === 'Masculina' ? 'Voz masc.' : 'Voz fem.'}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* Step 3: Learning Profile */}
        {step === 3 && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-700 mb-4 text-left">3. Perfil de Aprendizaje</h3>
                <div className="space-y-6">
                    <div>
                        <FormLabel required>Áreas de Enfoque</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {FOCUS_AREA_OPTIONS.map(opt => (
                                <label key={opt} className={`p-4 border rounded-xl text-left cursor-pointer transition-all duration-200 ${focusAreas.includes(opt) ? `${THEME_CLASSES[themeColor].bg} text-white font-semibold shadow-md` : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={focusAreas.includes(opt)} 
                                        onChange={() => handleFocusAreaChange(opt)} 
                                        className="w-5 h-5 mr-3 align-middle accent-white" 
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormLabel required>Nivel de Aprendizaje</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            {SYLLABIC_LEVEL_OPTIONS.map(l => (
                                <button
                                    type="button"
                                    key={l}
                                    onClick={() => setLevel(l as SyllabicLevel)}
                                    className={`p-4 border rounded-2xl text-center transition-all transform hover:scale-105 ${level === l ? `${THEME_CLASSES[themeColor].bg} text-white shadow-lg ring-4 ring-offset-2 ${THEME_CLASSES[themeColor].ring}` : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                                >
                                    <div className="text-4xl mb-2">
                                        {l === SyllabicLevel.PRESILABICO ? '🌱' : l === SyllabicLevel.SILABICO ? '🌿' : '🌳'}
                                    </div>
                                    <div className="font-bold text-lg">{l}</div>
                                    <p className="text-xs mt-1 opacity-80">
                                        {l === SyllabicLevel.PRESILABICO ? 'Fácil' : l === SyllabicLevel.SILABICO ? 'Medio' : 'Difícil'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                        <div>
                            <FormLabel htmlFor="difficulty">Dificultad de Sesión</FormLabel>
                            <select 
                                id="difficulty" 
                                value={difficulty} 
                                onChange={e => setDifficulty(e.target.value as Difficulty)} 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                            >
                                {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <FormLabel htmlFor="learningStyle">Estilo de Aprendizaje</FormLabel>
                            <select 
                                id="learningStyle" 
                                value={learningStyle} 
                                onChange={e => setLearningStyle(e.target.value as LearningStyle)} 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                            >
                                {LEARNING_STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <FormLabel htmlFor="specialNeedType">Tipo de Trastorno / Necesidad</FormLabel>
                            <select 
                                id="specialNeedType" 
                                value={specialNeedType} 
                                onChange={e => setSpecialNeedType(e.target.value as SpecialNeed)} 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                            >
                                {SPECIAL_NEED_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <FormLabel htmlFor="duration">Tiempo de Sesión (min)</FormLabel>
                            <select 
                                id="duration" 
                                value={dailySessionDuration} 
                                onChange={e => setDailySessionDuration(parseInt(e.target.value))} 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                            >
                                {SESSION_DURATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} minutos</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 pb-8">
            <button 
                type="button" 
                onClick={step > 1 ? prevStep : onCancel} 
                className="bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-slate-300 transition-colors shadow-md"
            >
                {step > 1 ? 'Atrás' : 'Cancelar'}
            </button>
            
            {step < totalSteps ? (
                <button 
                    type="button" 
                    onClick={nextStep} 
                    className={`text-white font-bold py-4 px-10 rounded-2xl text-lg transition-transform transform hover:scale-105 shadow-xl ${THEME_CLASSES[themeColor].bg}`}
                >
                    Siguiente
                </button>
            ) : (
                <button 
                    type="submit" 
                    className={`text-white font-bold py-4 px-10 rounded-2xl text-lg transition-transform transform hover:scale-105 shadow-xl ${THEME_CLASSES[themeColor].bg}`}
                >
                    {isEditing ? '¡Guardar Cambios!' : '¡Crear Perfil!'}
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSetupScreen;
    