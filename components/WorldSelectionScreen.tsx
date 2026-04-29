import React from 'react';
import { motion } from 'motion/react';
import { Difficulty, ThemeColor } from '../types';
import { Star, Zap, Trophy } from 'lucide-react';

interface WorldSelectionScreenProps {
  onSelectWorld: (world: Difficulty) => void;
  onGoBack: () => void;
  theme: { bg: string; text: string; button: string };
}

const WorldSelectionScreen: React.FC<WorldSelectionScreenProps> = ({ onSelectWorld, onGoBack, theme }) => {
  const worlds = [
    {
      id: Difficulty.EASY,
      title: 'Nivel Fácil',
      objective: 'Reconocimiento visual y asociación',
      icon: <Star className="w-12 h-12 text-yellow-500" />,
      color: 'bg-green-100 border-green-300 hover:bg-green-200',
      textColor: 'text-green-700',
      games: ['Elige la palabra', 'Di el nombre', 'Encuentra la opción']
    },
    {
      id: Difficulty.MEDIUM,
      title: 'Nivel Medio',
      objective: 'Producción oral y repetición',
      icon: <Zap className="w-12 h-12 text-blue-500" />,
      color: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
      textColor: 'text-blue-700',
      games: ['Repite la palabra', 'Escucha y di', 'Repite sílabas']
    },
    {
      id: Difficulty.HARD,
      title: 'Nivel Difícil',
      objective: 'Construcción lingüística',
      icon: <Trophy className="w-12 h-12 text-purple-500" />,
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      textColor: 'text-purple-700',
      games: ['Completa la palabra', 'Letra faltante', 'Construye desde imagen']
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center gap-8">
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-4xl md:text-5xl font-bold text-center ${theme.text}`}
      >
        Elige tu Mundo de Aventuras
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
        {worlds.map((world, idx) => (
          <motion.button
            key={world.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelectWorld(world.id)}
            className={`flex flex-col items-center p-8 rounded-3xl border-4 shadow-xl transition-all transform hover:scale-105 ${world.color} group`}
          >
            <div className="mb-4 transform group-hover:rotate-12 transition-transform">
              {world.icon}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${world.textColor}`}>{world.title}</h3>
            <p className="text-sm font-medium text-slate-600 mb-4">{world.objective}</p>
            
            <div className="flex flex-col gap-2 w-full">
              {world.games.map((game, i) => (
                <span key={i} className="text-xs bg-white/50 py-1 px-3 rounded-full text-slate-700">
                  {game}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={onGoBack}
        className="mt-8 text-slate-500 hover:text-slate-700 font-semibold underline"
      >
        Volver a perfiles
      </button>
    </div>
  );
};

export default WorldSelectionScreen;
