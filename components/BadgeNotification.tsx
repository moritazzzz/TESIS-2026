import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../types';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 border-4 border-yellow-400 z-[100] flex flex-col items-center gap-4 min-w-[300px]"
    >
      <div className="text-6xl">{badge.icon}</div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-yellow-600">¡NUEVA MEDALLA!</h3>
        <p className="text-xl font-semibold text-gray-800">{badge.name}</p>
        <p className="text-gray-600">{badge.description}</p>
      </div>
      <button
        onClick={onClose}
        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
      >
        ¡Genial!
      </button>
    </motion.div>
  );
};

export default BadgeNotification;
