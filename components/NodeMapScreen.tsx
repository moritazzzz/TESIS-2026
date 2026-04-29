import React from 'react';
import { motion } from 'motion/react';
import { MapNode, NodeType, ThemeColor, Difficulty } from '../types';
import { Star, Trophy, Lock, Play, Gift, ChevronLeft } from 'lucide-react';

interface NodeMapScreenProps {
  worldId: Difficulty;
  nodes: MapNode[];
  onSelectNode: (node: MapNode) => void;
  onGoBack: () => void;
  theme: { bg: string; text: string; button: string };
}

const NodeMapScreen: React.FC<NodeMapScreenProps> = ({ worldId, nodes, onSelectNode, onGoBack, theme }) => {
  const worldTitle = {
    [Difficulty.EASY]: 'Mundo Fácil: Exploradores',
    [Difficulty.MEDIUM]: 'Mundo Medio: Comunicadores',
    [Difficulty.HARD]: 'Mundo Difícil: Constructores',
  }[worldId];

  const worldColor = {
    [Difficulty.EASY]: 'text-green-600',
    [Difficulty.MEDIUM]: 'text-blue-600',
    [Difficulty.HARD]: 'text-purple-600',
  }[worldId];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center min-h-screen">
      <div className="w-full flex justify-between items-center mb-12">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-bold transition-colors"
        >
          <ChevronLeft size={24} />
          Volver a Mundos
        </button>
        <div className="text-right">
          <h2 className={`text-3xl md:text-4xl font-bold ${worldColor}`}>{worldTitle}</h2>
          <p className="text-slate-500 font-medium">¡Sigue el camino para ganar!</p>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center gap-16 py-12">
        {/* SVG Path Line */}
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-visible">
          <path
            d={`M 0 50 ${nodes.map((_, i) => `Q ${i % 2 === 0 ? 100 : -100} ${i * 150 + 125} 0 ${i * 150 + 200}`).join(' ')}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="12 12"
            className="text-slate-200"
            style={{ transform: 'translateX(50%)' }}
          />
        </svg>

        {nodes.map((node, index) => {
          const isLocked = !node.isUnlocked;
          const isCompleted = node.isCompleted;
          const isNext = node.isUnlocked && !node.isCompleted;

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative z-10 ${index % 2 === 0 ? 'translate-x-12 md:translate-x-24' : '-translate-x-12 md:-translate-x-24'}`}
            >
              <button
                disabled={isLocked}
                onClick={() => onSelectNode(node)}
                className={`
                  w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl transition-all transform
                  ${isLocked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                    isCompleted ? 'bg-green-500 text-white hover:scale-110' : 
                    'bg-white border-4 border-sky-400 text-sky-500 hover:scale-110 animate-pulse'}
                `}
              >
                {node.type === NodeType.ACTIVITY && (
                  isCompleted ? <Star className="w-10 h-10 fill-current" /> : 
                  isLocked ? <Lock className="w-8 h-8" /> : 
                  <Play className="w-10 h-10 fill-current" />
                )}
                {node.type === NodeType.CHEST && (
                  <Gift className={`w-10 h-10 ${isCompleted ? 'text-white' : 'text-amber-500'}`} />
                )}
                {node.type === NodeType.FINAL && (
                  <Trophy className={`w-12 h-12 ${isCompleted ? 'text-white' : 'text-yellow-500'}`} />
                )}
              </button>

              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`text-sm font-bold ${isLocked ? 'text-slate-300' : 'text-slate-600'}`}>
                  {node.type === NodeType.ACTIVITY ? `Actividad ${index + 1}` : 
                   node.type === NodeType.CHEST ? '¡Cofre Mágico!' : '¡Meta Final!'}
                </span>
              </div>

              {isNext && (
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                  ¡AQUÍ!
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeMapScreen;
