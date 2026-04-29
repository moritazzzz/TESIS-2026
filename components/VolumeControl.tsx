import React, { useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundContext } from '../contexts/SoundContext';

interface VolumeControlProps {
  theme: { button: string };
}

const VolumeControl: React.FC<VolumeControlProps> = ({ theme }) => {
  const { isMuted, setIsMuted, volume, setVolume } = useContext(SoundContext);

  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-lg">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-2 rounded-full text-white ${theme.button}`}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 accent-sky-500"
      />
    </div>
  );
};

export default VolumeControl;
