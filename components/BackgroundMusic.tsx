import React, { useEffect, useRef, useContext } from 'react';
import { SoundContext } from '../contexts/SoundContext';

const BackgroundMusic: React.FC = () => {
  const { isMuted, isMusicEnabled, volume } = useContext(SoundContext);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume * 0.3;
      
      if (!isMuted && isMusicEnabled) {
        audioRef.current.play().catch(err => {
          console.warn("Autoplay prevented or audio error:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isMusicEnabled, volume]);

  return (
    <audio
      ref={audioRef}
      loop
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    />
  );
};

export default BackgroundMusic;
