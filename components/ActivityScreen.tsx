import React, { useState, useEffect, useRef } from 'react';
import { Activity, ThemeColor, FontSize, UserProfile, ActivityType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Check, Volume2, Loader2 } from 'lucide-react';
import { listen } from '../services/voiceService';

interface ActivityScreenProps {
  activity: Activity;
  userProfile: UserProfile;
  onAnswer: (answer: string) => void;
  isFeedbackState: boolean;
  selectedAnswer: string | null;
  theme: { bg: string; text: string; button: string };
  isWaitingForContinue: boolean;
  onContinue: () => void;
  isTransitioning: boolean;
}

const ActivityScreen: React.FC<ActivityScreenProps> = ({ 
  activity, 
  userProfile, 
  onAnswer, 
  isFeedbackState, 
  selectedAnswer, 
  theme, 
  isWaitingForContinue, 
  onContinue, 
  isTransitioning 
}) => {
  const isCorrect = selectedAnswer === activity.correctAnswer;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [buildWordState, setBuildWordState] = useState<string[]>([]);
  const stopListenRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (activity.type === ActivityType.BUILD_WORD && activity.fullWord) {
      const initial = activity.fullWord.split('').map(char => 
        activity.missingLetters?.includes(char) ? '' : char
      );
      setBuildWordState(initial);
    }
    setTranscript('');
    setIsListening(false);
  }, [activity]);

  const startListening = () => {
    if (selectedAnswer !== null || isListening) return;
    
    setIsListening(true);
    setTranscript('');
    
    stopListenRef.current = listen(
      (result) => {
        setTranscript(result);
        // Procesar resultado automáticamente
        processVoiceResult(result);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const processVoiceResult = (voiceInput: string) => {
    const cleanInput = voiceInput.trim().toLowerCase();
    
    // Lógica común para juegos de elección (botones)
    if ([ActivityType.CHOOSE_WORD, ActivityType.FIND_OPTION, ActivityType.MISSING_LETTER, ActivityType.IMAGE_CHOICE].includes(activity.type)) {
      const match = activity.options?.find(opt => cleanInput.includes(opt.toLowerCase()));
      if (match) {
        onAnswer(match);
        return;
      }
      if (cleanInput.includes(activity.correctAnswer.toLowerCase())) {
        onAnswer(activity.correctAnswer);
        return;
      }
    }

    // Lógica para juegos de producción oral directa
    if ([ActivityType.SAY_NAME, ActivityType.REPEAT_WORD, ActivityType.LISTEN_SAY, ActivityType.BUILD_FROM_IMAGE].includes(activity.type)) {
      const target = (activity.correctAnswer || activity.word || activity.fullWord || '').toLowerCase();
      if (cleanInput.includes(target) || target.includes(cleanInput) && cleanInput.length > 2) {
        onAnswer(activity.correctAnswer || activity.word || activity.fullWord || '');
        return;
      }
    }

    // Lógica para repetición de sílabas
    if (activity.type === ActivityType.REPEAT_SYLLABLES) {
      const fullTarget = (activity.correctAnswer || activity.word || '').toLowerCase();
      const anySyllableMatch = activity.syllables?.some(s => cleanInput.includes(s.toLowerCase()));
      if (cleanInput.includes(fullTarget) || anySyllableMatch) {
        onAnswer(activity.correctAnswer || activity.word || '');
        return;
      }
    }

    // Lógica para completar palabra
    if (activity.type === ActivityType.COMPLETE_WORD || activity.type === ActivityType.BUILD_WORD) {
      const target = (activity.correctAnswer || activity.fullWord || '').toLowerCase();
      if (cleanInput.includes(target)) {
        onAnswer(activity.correctAnswer || activity.fullWord || '');
        return;
      }
    }
  };

  const renderActivityContent = () => {
    switch (activity.type) {
      case ActivityType.CHOOSE_WORD:
      case ActivityType.FIND_OPTION:
      case ActivityType.IMAGE_CHOICE:
      case ActivityType.MISSING_LETTER:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {activity.options?.map((option) => (
              <div
                key={option}
                className={`
                  p-6 rounded-2xl text-2xl md:text-4xl font-bold transition-all shadow-lg text-center
                  ${selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-500 text-white scale-110'
                      : 'bg-red-500 text-white'
                    : 'bg-white text-sky-700'
                  }
                  ${selectedAnswer !== null && option === activity.correctAnswer && !isCorrect
                    ? 'bg-green-500 text-white animate-pulse'
                    : ''
                  }
                  border-4 border-transparent
                `}
              >
                {option}
              </div>
            ))}
          </div>
        );

      case ActivityType.REPEAT_WORD:
      case ActivityType.SAY_NAME:
      case ActivityType.LISTEN_SAY:
      case ActivityType.BUILD_FROM_IMAGE:
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="text-4xl md:text-6xl font-bold text-sky-800 bg-white px-12 py-6 rounded-full shadow-xl border-4 border-sky-200">
              {activity.type === ActivityType.SAY_NAME || activity.type === ActivityType.BUILD_FROM_IMAGE ? '???' : (activity.word || activity.correctAnswer)}
            </div>
          </div>
        );

      case ActivityType.REPEAT_SYLLABLES:
        return (
          <div className="flex flex-wrap justify-center gap-4">
            {activity.syllables?.map((syllable, idx) => (
              <div 
                key={idx}
                className="px-8 py-4 bg-white rounded-2xl text-3xl md:text-5xl font-bold text-sky-700 shadow-lg border-b-4 border-sky-200"
              >
                {syllable}
              </div>
            ))}
          </div>
        );

      case ActivityType.COMPLETE_WORD:
      case ActivityType.BUILD_WORD:
        return (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="text-4xl md:text-6xl font-bold text-sky-800 bg-white px-12 py-6 rounded-full shadow-xl border-4 border-sky-200 tracking-widest">
              {activity.word || activity.fullWord}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center gap-8">
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full flex flex-col items-center gap-6"
      >
        <h2 className={`text-2xl md:text-4xl font-bold text-center ${theme.text}`}>
          {activity.instruction}
        </h2>

        {activity.imageUrl && (
          <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
            <img
              src={activity.imageUrl}
              alt="Actividad"
              className="w-full h-full object-contain p-4"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {renderActivityContent()}

        <div className="flex flex-col items-center gap-4 mt-4">
          <p className="text-xl font-bold text-red-500 animate-pulse mb-2">
            🎤 Respuesta por voz obligatoria
          </p>
          <AnimatePresence mode="wait">
            {selectedAnswer === null ? (
              <motion.button
                key="mic-btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={startListening}
                disabled={isListening}
                className={`
                  relative p-8 rounded-full shadow-2xl transition-all transform hover:scale-110
                  ${isListening ? 'bg-red-500 animate-pulse' : 'bg-sky-500 hover:bg-sky-600'}
                  text-white
                `}
              >
                {isListening ? <Loader2 size={48} className="animate-spin" /> : <Mic size={48} />}
                {isListening && (
                  <motion.div 
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 rounded-full border-4 border-white/50"
                  />
                )}
              </motion.button>
            ) : (
              <motion.div
                key="result-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`p-6 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white shadow-xl`}
              >
                {isCorrect ? <Check size={48} /> : <Volume2 size={48} />}
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="text-xl font-medium text-slate-500 h-8">
            {isListening ? '¡Te escucho! Di la respuesta...' : transcript ? `Dijiste: "${transcript}"` : 'Presiona el micrófono para hablar'}
          </p>
        </div>

        <AnimatePresence>
          {isWaitingForContinue && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={onContinue}
              className={`mt-4 px-12 py-4 rounded-full text-white text-2xl font-bold shadow-2xl transition-transform hover:scale-105 ${theme.button}`}
            >
              Continuar
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ActivityScreen;
