import React from 'react';
import { UserProfile, SessionActivityRecord, ThemeColor } from '../types';
import { motion } from 'motion/react';
import { Trophy, Home, RotateCcw, Users } from 'lucide-react';

interface SessionEndScreenProps {
  userProfile: UserProfile;
  sessionHistory: SessionActivityRecord[];
  startTime: string;
  onPlayAgain: () => void;
  onSwitchProfile: () => void;
  onGoHome: () => void;
  theme: { text: string; button: string };
}

const SessionEndScreen: React.FC<SessionEndScreenProps> = ({ userProfile, sessionHistory, startTime, onPlayAgain, onSwitchProfile, onGoHome, theme }) => {
  const correctCount = sessionHistory.filter(a => a.isCorrect).length;
  const totalCount = sessionHistory.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  
  const durationSeconds = Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000);
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const durationText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center gap-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <Trophy size={120} className="text-yellow-400 drop-shadow-xl" />
        <h2 className={`text-5xl font-bold text-center ${theme.text}`}>¡SESIÓN COMPLETADA!</h2>
        <p className="text-2xl text-gray-600 font-medium text-center">
          ¡Increíble trabajo, {userProfile.nickname || userProfile.name}!
        </p>
        <div className="bg-sky-50 px-6 py-2 rounded-full border-2 border-sky-100 text-sky-700 font-bold">
            Tiempo de sesión: {durationText}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-sky-100 flex flex-col items-center gap-2">
          <span className="text-5xl font-bold text-sky-600">{totalCount}</span>
          <span className="text-gray-500 font-semibold">Actividades</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-green-100 flex flex-col items-center gap-2">
          <span className="text-5xl font-bold text-green-500">{correctCount}</span>
          <span className="text-gray-500 font-semibold">Aciertos</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-100 flex flex-col items-center gap-2">
          <span className="text-5xl font-bold text-yellow-500">{percentage}%</span>
          <span className="text-gray-500 font-semibold">Precisión</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <button
          onClick={onPlayAgain}
          className={`flex items-center gap-3 px-8 py-4 rounded-full text-white text-xl font-bold shadow-xl transition-transform hover:scale-105 ${theme.button}`}
        >
          <RotateCcw size={24} />
          <span>Jugar de Nuevo</span>
        </button>
        <button
          onClick={onSwitchProfile}
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-sky-600 border-4 border-sky-100 text-xl font-bold shadow-xl transition-transform hover:scale-105"
        >
          <Users size={24} />
          <span>Cambiar Perfil</span>
        </button>
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-gray-600 border-4 border-gray-100 text-xl font-bold shadow-xl transition-transform hover:scale-105"
        >
          <Home size={24} />
          <span>Inicio</span>
        </button>
      </div>
    </div>
  );
};

export default SessionEndScreen;
