import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AvatarExpression, ThemeColor, AssistantVoice } from '../types';
import { speak, stopSpeech } from '../services/voiceService';

interface AvatarProps {
  speech: string;
  expression: AvatarExpression;
  voice: AssistantVoice;
  themeColor: ThemeColor;
  onSpeechEnd?: () => void;
}

const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu, '') // Emojis
    .replace(/[*_#`~[\]()]/g, '') // Markdown
    .replace(/\s+/g, ' ') // Extra spaces
    .trim();
};

const Avatar: React.FC<AvatarProps> = ({ speech, expression, voice, themeColor, onSpeechEnd }) => {
  React.useEffect(() => {
    let isMounted = true;
    if (speech) {
      const cleanedSpeech = cleanTextForSpeech(speech);
      speak(cleanedSpeech, voice).then(() => {
        if (isMounted && onSpeechEnd) {
          onSpeechEnd();
        }
      });
    }
    return () => {
      isMounted = false;
      stopSpeech();
    };
  }, [speech, voice, onSpeechEnd]);

  const getExpressionEmoji = () => {
    switch (expression) {
      case AvatarExpression.HAPPY: return '😊';
      case AvatarExpression.ENCOURAGING: return '✨';
      case AvatarExpression.NEUTRAL:
      default: return '👋';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-xs">
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: expression === AvatarExpression.HAPPY ? [1, 1.1, 1] : 1
        }}
        transition={{
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          scale: { duration: 0.5 }
        }}
        className="text-8xl md:text-9xl filter drop-shadow-xl"
      >
        {getExpressionEmoji()}
      </motion.div>
      
      <AnimatePresence mode="wait">
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="bg-white p-4 rounded-2xl shadow-lg border-2 border-sky-100 relative"
          >
            <p className="text-sky-800 font-medium text-center text-lg md:text-xl">
              {speech}
            </p>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-sky-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatar;
