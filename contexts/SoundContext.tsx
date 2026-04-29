import React, { createContext, useState, ReactNode } from 'react';

interface SoundContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isMusicEnabled: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  playSound: (soundName: string) => void;
}

export const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  setIsMuted: () => {},
  isMusicEnabled: true,
  toggleMusic: () => {},
  volume: 0.5,
  setVolume: () => {},
  playSound: () => {},
});

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };

  const playSound = (soundName: string) => {
    if (isMuted) return;
    console.log(`Playing sound: ${soundName}`);
    // Implementation would go here
  };

  return (
    <SoundContext.Provider value={{ isMuted, setIsMuted, isMusicEnabled, toggleMusic, volume, setVolume, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
