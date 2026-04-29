import React from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { ThemeColor } from '../types';

interface FullscreenButtonProps {
  theme: { button: string };
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ theme }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className={`p-2 rounded-full text-white shadow-lg transition-transform hover:scale-110 ${theme.button}`}
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
};

export default FullscreenButton;
