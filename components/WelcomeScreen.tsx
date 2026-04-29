
import React, { useState, useEffect } from 'react';
import { Play, UserCog } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onTherapistLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onTherapistLogin }) => {
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showInitialButton, setShowInitialButton] = useState(false);
    
    useEffect(() => {
        const subtitleTimer = setTimeout(() => setShowSubtitle(true), 1500);
        const buttonTimer = setTimeout(() => setShowInitialButton(true), 2500);

        return () => {
            clearTimeout(subtitleTimer);
            clearTimeout(buttonTimer);
        };
    }, []);

    const title = "¡BIENVENIDO!";
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-sky-500', 'text-blue-500', 'text-indigo-500', 'text-violet-500', 'text-pink-500', 'text-rose-500', 'text-emerald-500', 'text-amber-500', 'text-cyan-500', 'text-fuchsia-500', 'text-teal-500', 'text-lime-500', 'text-purple-500', 'text-slate-500', 'text-zinc-500', 'text-stone-500', 'text-neutral-500'];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 relative min-h-[60vh]">
            <div>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 flex flex-wrap justify-center animate-float" aria-label={title}>
                    {title.split('').map((letter, index) => (
                        <span
                            key={index}
                            className={`animate-drop ${colors[index % colors.length]}`}
                            style={{ animationDelay: `${index * 150}ms`, opacity: 0 }}
                        >
                            {letter === ' ' ? '\u00A0' : letter}
                        </span>
                    ))}
                </h1>
                <div className={`transition-opacity duration-1000 min-h-[48px] ${showSubtitle ? 'opacity-100' : 'opacity-0'}`}>
                    {showSubtitle && (
                        <p className="text-xl md:text-2xl text-slate-600 animate-fade-in">
                            ¡Tu aventura mágica de lenguaje comienza aquí! Únete a nosotros para descubrir un mundo de sonidos y diversión.
                        </p>
                    )}
                </div>
            </div>

            <div className="transition-opacity duration-500 mt-12 min-h-[160px] flex flex-col items-center justify-center gap-4">
                {showInitialButton && (
                    <>
                        <button
                            onClick={onStart}
                            className="bg-sky-500 text-white font-bold py-4 px-12 rounded-full text-2xl hover:bg-sky-600 transition-transform transform hover:scale-110 shadow-xl animate-fade-in flex items-center gap-3"
                        >
                            <Play className="w-8 h-8 fill-current" />
                            Empezar
                        </button>
                        <button
                            onClick={onTherapistLogin}
                            className="text-slate-400 hover:text-sky-500 font-semibold py-2 px-6 rounded-full text-sm transition-colors animate-fade-in mt-4 border border-slate-200 hover:border-sky-200 flex items-center gap-2"
                        >
                            <UserCog className="w-4 h-4" />
                            Acceso Terapeuta
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WelcomeScreen;
