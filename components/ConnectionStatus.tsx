import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { checkConnection } from '../services/geminiService';

const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const check = async () => {
      const online = await checkConnection();
      setIsOnline(online);
    };
    const interval = setInterval(check, 10000);
    check();
    return () => clearInterval(interval);
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-50">
      <WifiOff size={20} />
      <span>Sin conexión</span>
    </div>
  );
};

export default ConnectionStatus;
