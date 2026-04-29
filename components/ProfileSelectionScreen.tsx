import React from 'react';
import { UserProfile, ThemeColor } from '../types';

interface ProfileSelectionScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profileId: string) => void;
  onAddNewProfile: () => void;
  onManageProfiles: () => void;
  onGoHome: () => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ profiles, onSelectProfile, onAddNewProfile, onManageProfiles, onGoHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-sky-700 mb-8">¿Quién va a jugar hoy?</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelectProfile(profile.id)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-sky-300"
          >
            <div className="text-6xl mb-2">{profile.avatar}</div>
            <span className="text-xl font-bold text-gray-700">{profile.nickname || profile.name}</span>
          </button>
        ))}
        
        <button
          onClick={onAddNewProfile}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-sky-50 border-2 border-dashed border-sky-300 text-sky-500 hover:bg-sky-100 transition-all"
        >
          <div className="text-4xl">+</div>
          <span className="font-bold">Nuevo Perfil</span>
        </button>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={onManageProfiles}
          className="text-sky-600 font-semibold hover:underline"
        >
          Gestionar Perfiles
        </button>
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

export default ProfileSelectionScreen;
