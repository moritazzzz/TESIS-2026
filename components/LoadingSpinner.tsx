import React from 'react';
import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full"
      />
      <p className="text-sky-600 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
