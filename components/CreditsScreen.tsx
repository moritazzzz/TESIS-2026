import React from 'react';
import { X, Heart, Code, Palette, Sparkles } from 'lucide-react';

interface CreditsScreenProps {
  onBack: () => void;
}

const CreditsScreen: React.FC<CreditsScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-sky-700">Créditos</h2>
        <button onClick={onBack} className="text-gray-500 hover:text-red-500 transition-colors">
          <X size={32} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-sky-50 flex flex-col items-center text-center gap-4">
          <Heart size={48} className="text-red-500" />
          <h3 className="text-2xl font-bold text-gray-800">Misión</h3>
          <p className="text-gray-600">
            Creado con amor para ayudar a todos los niños a descubrir el maravilloso mundo del lenguaje y la comunicación.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-50 flex flex-col items-center text-center gap-4">
          <Sparkles size={48} className="text-yellow-400" />
          <h3 className="text-2xl font-bold text-gray-800">Magia IA</h3>
          <p className="text-gray-600">
            Impulsado por Google Gemini para crear actividades personalizadas y únicas para cada pequeño aventurero.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-50 flex flex-col items-center text-center gap-4">
          <Code size={48} className="text-emerald-500" />
          <h3 className="text-2xl font-bold text-gray-800">Desarrollo</h3>
          <p className="text-gray-600">
            Construido con React, Tailwind CSS y Motion para una experiencia fluida y divertida.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-violet-50 flex flex-col items-center text-center gap-4">
          <Palette size={48} className="text-violet-500" />
          <h3 className="text-2xl font-bold text-gray-800">Diseño</h3>
          <p className="text-gray-600">
            Diseñado para ser accesible, colorido y amigable para niños con diversas necesidades educativas.
          </p>
        </div>
      </div>

      <div className="text-center text-gray-400 font-medium">
        <p>© 2024 Aventuras de Aleph. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default CreditsScreen;
