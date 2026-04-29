import React from 'react';
import { UserProfile, ThemeColor } from '../types';
import { Trash2, Edit, History, Settings } from 'lucide-react';

interface ManageProfilesScreenProps {
  profiles: UserProfile[];
  onEditProfile: (profileId: string) => void;
  onDeleteProfile: (id: string) => void;
  onViewHistory: (profileId: string) => void;
  onEditPreferences: (profileId: string) => void;
  onDone: () => void;
  onAddNewProfile: () => void;
  onGoHome: () => void;
  theme: { text: string; button: string };
}

const ManageProfilesScreen: React.FC<ManageProfilesScreenProps> = ({ profiles, onEditProfile, onDeleteProfile, onViewHistory, onEditPreferences, onDone, onAddNewProfile, onGoHome, theme }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-12">
        <h2 className={`text-4xl font-bold ${theme.text}`}>Gestionar Perfiles</h2>
        <div className="flex gap-4">
          <button
            onClick={onAddNewProfile}
            className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-600 transition-colors"
          >
            + Nuevo Perfil
          </button>
          <button
            onClick={onDone}
            className="text-gray-500 hover:text-sky-500 font-semibold"
          >
            Listo
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white shadow-lg border-2 border-transparent hover:border-sky-100 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="text-6xl">{profile.avatar}</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-800">{profile.nickname || profile.name}</h3>
                <p className="text-gray-500">{profile.level} • {profile.age} años</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onEditProfile(profile.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors font-semibold"
              >
                <Edit size={20} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => onEditPreferences(profile.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors font-semibold"
              >
                <Settings size={20} />
                <span>Preferencias</span>
              </button>
              <button
                onClick={() => onViewHistory(profile.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors font-semibold"
              >
                <History size={20} />
                <span>Historial</span>
              </button>
              <button
                onClick={() => onDeleteProfile(profile.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold"
              >
                <Trash2 size={20} />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={onGoHome}
          className="text-gray-500 hover:underline"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ManageProfilesScreen;
