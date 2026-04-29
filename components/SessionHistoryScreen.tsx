import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, SessionRecord } from '../types';
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ArrowRight } from 'lucide-react';

interface SessionHistoryScreenProps {
  profile: UserProfile;
  onBack: () => void;
}

const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

const SessionHistoryScreen: React.FC<SessionHistoryScreenProps> = ({ profile, onBack }) => {
  const history = profile.history || [];
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);

  const containerVariants = {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button onClick={selectedSession ? () => setSelectedSession(null) : onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
        <h2 className="text-4xl font-bold text-sky-700">
            {selectedSession ? 'Detalle de Sesión' : `Historial de ${profile.nickname || profile.name}`}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSession ? (
          <motion.div 
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-6"
          >
            {history.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-xl text-center flex flex-col items-center gap-4">
                <Calendar size={64} className="text-gray-300" />
                <p className="text-2xl text-gray-500 font-medium">Aún no hay sesiones registradas.</p>
                <p className="text-gray-400">¡Empieza a jugar para ver tu progreso!</p>
              </div>
            ) : (
                history.map((session, index) => {
                    const date = new Date(session.startTime).toLocaleDateString();
                    const time = new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const correctCount = session.activities.filter(a => a.isCorrect).length;
                    const totalCount = session.activities.length;
                    const incorrectCount = totalCount - correctCount;
                    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

                    return (
                      <div key={index} onClick={() => setSelectedSession(session)} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-sky-50 flex flex-col gap-6 cursor-pointer hover:border-sky-200 transition-colors">
                        <div className="bg-sky-50 p-4 rounded-xl text-sky-800 font-bold flex justify-between items-center text-sm md:text-base border border-sky-100">
                            <span>Aciertos: {correctCount} / Desaciertos: {incorrectCount}</span>
                            <span className="bg-sky-200 px-3 py-1 rounded-full">Precisión: {percentage}%</span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
                            <div className="flex items-center gap-6">
                              <div className="bg-sky-100 p-4 rounded-2xl text-sky-600">
                                <Calendar size={32} />
                              </div>
                              <div className="text-left">
                                <h3 className="text-xl font-bold text-gray-800">{date} a las {time}</h3>
                                <div className="flex items-center gap-4 text-gray-500 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {totalCount} actividades
                                  </span>
                                  <span className="flex items-center gap-1 border-l pl-4">
                                    <Clock size={16} />
                                    Duración: {formatDuration(session.durationSeconds)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight size={24} className="text-sky-400" />
                        </div>
                      </div>
                    );
                })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-6 rounded-3xl shadow-lg border-2 border-sky-50 flex flex-col gap-6"
          >
            <h3 className="text-2xl font-bold text-sky-800">
                Resumen de sesión: {new Date(selectedSession.startTime).toLocaleDateString()}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl text-green-800 text-center font-bold">
                    Aciertos: {selectedSession.activities.filter(a => a.isCorrect).length}
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-red-800 text-center font-bold">
                    Fallos: {selectedSession.activities.length - selectedSession.activities.filter(a => a.isCorrect).length}
                </div>
                <div className="bg-sky-50 p-4 rounded-xl text-sky-800 text-center font-bold">
                    Total: {selectedSession.activities.length} actividades
                </div>
            </div>

            <h4 className="text-lg font-bold text-gray-700 mt-4">Actividades realizadas:</h4>
            <div className="flex flex-col gap-3">
                {selectedSession.activities.map((activity, i) => (
                    <div key={i} className={`p-4 rounded-xl flex items-center justify-between gap-4 ${activity.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                        <div>
                            <p className="font-bold">{activity.instruction}</p>
                            <p className="text-sm text-gray-600">Respuesta: {activity.userAnswer || 'N/A'}</p>
                        </div>
                        {activity.isCorrect ? (
                            <CheckCircle className="text-green-500" size={24} />
                        ) : (
                            <XCircle className="text-red-500" size={24} />
                        )}
                    </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionHistoryScreen;
