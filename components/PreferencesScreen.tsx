import React, { useState } from 'react';
import { UserProfile, ThemeColor, AssistantVoice, FontSize, Difficulty } from '../types';
import { THEME_OPTIONS, VOICE_OPTIONS } from '../constants';
import { Save, X } from 'lucide-react';

interface PreferencesScreenProps {
  profile: UserProfile;
  onSave: (updatedData: { preferredDifficulty: Difficulty, dailySessionDuration: number, favoriteGameTypes: string, fontSize: FontSize, themeColor: ThemeColor }) => void;
  onCancel: () => void;
  onHelpTrigger: (text: string) => void;
  theme: { text: string; button: string };
}

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ profile, onSave, onCancel, onHelpTrigger, theme }) => {
  const [themeColor, setThemeColor] = useState(profile.themeColor);
  const [assistantVoice, setAssistantVoice] = useState(profile.assistantVoice);
  const [fontSize, setFontSize] = useState(profile.fontSize || FontSize.NORMAL);
  const [dailySessionDuration, setDailySessionDuration] = useState(profile.dailySessionDuration || 15);
  const [preferredDifficulty, setPreferredDifficulty] = useState(profile.preferredDifficulty || Difficulty.EASY);
  const [favoriteGameTypes, setFavoriteGameTypes] = useState(profile.favoriteGameTypes || '');

  const handleSave = () => {
    onSave({
      themeColor,
      assistantVoice,
      fontSize,
      dailySessionDuration,
      preferredDifficulty,
      favoriteGameTypes
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h2 className={`text-4xl font-bold ${theme.text}`}>Preferencias</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-red-500 transition-colors">
          <X size={32} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-700">Color del Tema</h3>
          <div className="grid grid-cols-4 gap-4">
            {THEME_OPTIONS.map((color) => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-110 ${themeColor === color ? 'ring-4 ring-sky-500 scale-110' : ''}`}
                style={{ backgroundColor: color === ThemeColor.SKY ? '#0ea5e9' : color === ThemeColor.MINT ? '#10b981' : color === ThemeColor.LAVENDER ? '#8b5cf6' : color === ThemeColor.PEACH ? '#f97316' : color === ThemeColor.ROSE ? '#f43f5e' : color === ThemeColor.AMBER ? '#f59e0b' : color === ThemeColor.CYAN ? '#06b6d4' : '#d946ef' }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-700">Voz del Asistente</h3>
          <div className="flex gap-4">
            {VOICE_OPTIONS.map((voice) => (
              <button
                key={voice}
                onClick={() => setAssistantVoice(voice)}
                className={`flex-1 py-4 rounded-2xl font-bold text-xl transition-all ${assistantVoice === voice ? 'bg-sky-500 text-white shadow-xl scale-105' : 'bg-white text-sky-600 border-2 border-sky-100'}`}
              >
                {voice}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-700">Tamaño de Letra</h3>
          <div className="flex gap-4">
            {Object.values(FontSize).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 py-4 rounded-2xl font-bold text-xl transition-all ${fontSize === size ? 'bg-sky-500 text-white shadow-xl scale-105' : 'bg-white text-sky-600 border-2 border-sky-100'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-700">Duración de Sesión (min)</h3>
          <div className="flex gap-4">
            {[5, 10, 15, 20, 30].map((duration) => (
              <button
                key={duration}
                onClick={() => setDailySessionDuration(duration)}
                className={`flex-1 py-4 rounded-2xl font-bold text-xl transition-all ${dailySessionDuration === duration ? 'bg-sky-500 text-white shadow-xl scale-105' : 'bg-white text-sky-600 border-2 border-sky-100'}`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={handleSave}
          className={`flex items-center gap-3 px-12 py-4 rounded-full text-white text-2xl font-bold shadow-2xl transition-transform hover:scale-105 ${theme.button}`}
        >
          <Save size={28} />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </div>
  );
};

export default PreferencesScreen;
