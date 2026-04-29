import React, { useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundContext } from '../contexts/SoundContext';

interface MuteButtonProps {
  theme: { button: string };
}

const MuteButton: React.FC<MuteButtonProps> = ({ theme }) => {
  const { isMuted, setIsMuted } = useContext(SoundContext);

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className={`p-2 md:p-3 rounded-full shadow-lg transition-colors z-10 ${theme.button} text-white transform hover:scale-105`}
      aria-label={isMuted ? 'Desmutear' : 'Mutear'}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default MuteButton;
