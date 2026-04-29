
import React, { useState, useEffect } from 'react';
import { UserProfile, TherapistReport, Difficulty, GameState } from '../types';
import { DIFFICULTY_OPTIONS } from '../constants';
import { Plus, Edit2, FileText, BarChart2, ArrowLeft, Save, Trash2, Calendar, Clock, User, Clipboard, Activity, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupabaseExample } from './SupabaseExample';

interface TherapistDashboardProps {
  profiles: UserProfile[];
  reports: TherapistReport[];
  onAddProfile: () => void;
  onEditProfile: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onSaveReport: (report: Omit<TherapistReport, 'id'>) => void;
  onGoBack: () => void;
}

const TherapistDashboard: React.FC<TherapistDashboardProps> = ({
  profiles,
  reports,
  onAddProfile,
  onEditProfile,
  onDeleteProfile,
  onSaveReport,
  onGoBack
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'reports' | 'history' | 'server'>('profiles');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  // Report Form State
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportTime, setReportTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [reportDuration, setReportDuration] = useState<number>(15);
  const [reportTherapist, setReportTherapist] = useState('');
  const [reportLevel, setReportLevel] = useState<Difficulty>(Difficulty.EASY);
  const [reportActivity, setReportActivity] = useState('');
  const [reportResult, setReportResult] = useState('');
  const [reportObservations, setReportObservations] = useState('');

  const selectedChild = profiles.find(p => p.id === selectedChildId);
  const childReports = reports.filter(r => r.childId === selectedChildId).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !selectedChild) return;

    onSaveReport({
      date: reportDate,
      time: reportTime,
      durationMinutes: reportDuration,
      childId: selectedChildId,
      childName: selectedChild.name,
      therapistName: reportTherapist || selectedChild.therapistName || 'Terapeuta',
      levelWorked: reportLevel,
      activityPerformed: reportActivity,
      result: reportResult,
      observations: reportObservations
    });

    setShowReportForm(false);
    // Reset form
    setReportActivity('');
    setReportResult('');
    setReportObservations('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      {/* Header */}
      <div className="bg-white border-bottom border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onGoBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Panel del Terapeuta</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'profiles' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Perfiles
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'reports' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Informes
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Progreso
          </button>
          <button 
            onClick={() => setActiveTab('server')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'server' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Servidor
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'profiles' && (
            <motion.div 
              key="profiles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Add New Profile Card */}
              <button 
                onClick={onAddProfile}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-sky-400 hover:bg-sky-50 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500 transition-colors mb-4">
                  <Plus size={32} />
                </div>
                <span className="text-slate-600 font-semibold group-hover:text-sky-600">Crear Nuevo Perfil</span>
              </button>

              {profiles.map(profile => (
                <div key={profile.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                        {profile.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{profile.name}</h3>
                        <p className="text-slate-500 text-sm">{profile.specialNeedType}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onEditProfile(profile.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteProfile(profile.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Terapeuta:</span>
                      <span className="font-medium text-slate-700">{profile.therapistName || 'No asignado'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Nivel Actual:</span>
                      <span className="font-medium text-slate-700">{profile.level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Puntaje:</span>
                      <span className="font-medium text-slate-700">{profile.score} pts</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => { setSelectedChildId(profile.id); setActiveTab('reports'); }}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-sky-50 text-sky-600 rounded-xl text-sm font-bold hover:bg-sky-100 transition-colors"
                    >
                      <FileText size={16} />
                      Informes
                    </button>
                    <button 
                      onClick={() => { setSelectedChildId(profile.id); setActiveTab('reports'); }}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors"
                    >
                      <BarChart2 size={16} />
                      Progreso
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Children List for Selection */}
                <div className="w-full md:w-1/3 bg-white rounded-2xl border border-slate-200 p-4 overflow-y-auto max-h-[60vh] md:max-h-full">
                  <h3 className="font-bold text-slate-800 mb-4 px-2">Seleccionar Niño</h3>
                  <div className="space-y-2">
                    {profiles.map(profile => (
                      <button 
                        key={profile.id}
                        onClick={() => setSelectedChildId(profile.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedChildId === profile.id ? 'bg-sky-500 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        <span className="text-2xl">{profile.avatar}</span>
                        <div className="text-left">
                          <p className="font-bold text-sm leading-tight">{profile.name}</p>
                          <p className={`text-xs ${selectedChildId === profile.id ? 'text-sky-100' : 'text-slate-500'}`}>{profile.specialNeedType}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reports History / Form */}
                <div className="w-full md:w-2/3 flex flex-col gap-6">
                  {selectedChildId ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800">Historial de {selectedChild?.name}</h3>
                        <button 
                          onClick={() => {
                            setReportTherapist(selectedChild?.therapistName || '');
                            setShowReportForm(true);
                          }}
                          className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-md"
                        >
                          <Plus size={20} />
                          Nuevo Informe
                        </button>
                      </div>

                      {showReportForm ? (
                        <motion.form 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onSubmit={handleSaveReport}
                          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-700 flex items-center gap-2">
                              <Clipboard size={20} className="text-sky-500" />
                              Registrar Informe de Sesión
                            </h4>
                            <button 
                              type="button"
                              onClick={() => setShowReportForm(false)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              Cancelar
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                  type="date" 
                                  required
                                  value={reportDate}
                                  onChange={e => setReportDate(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora</label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                  type="time" 
                                  required
                                  value={reportTime}
                                  onChange={e => setReportTime(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duración (minutos)</label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                  type="number" 
                                  required
                                  min="1"
                                  value={reportDuration}
                                  onChange={e => setReportDuration(parseInt(e.target.value))}
                                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Terapeuta</label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Nombre del terapeuta"
                                  value={reportTherapist}
                                  onChange={e => setReportTherapist(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nivel Trabajado</label>
                              <select 
                                value={reportLevel}
                                onChange={e => setReportLevel(e.target.value as Difficulty)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                              >
                                {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Actividad Realizada</label>
                            <div className="relative">
                              <Activity className="absolute left-3 top-3 text-slate-400" size={16} />
                              <input 
                                type="text" 
                                required
                                placeholder="Ej: Discriminación auditiva de fonemas"
                                value={reportActivity}
                                onChange={e => setReportActivity(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resultado</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Ej: 80% de aciertos, mejora en fluidez"
                              value={reportResult}
                              onChange={e => setReportResult(e.target.value)}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                            <div className="relative">
                              <MessageSquare className="absolute left-3 top-3 text-slate-400" size={16} />
                              <textarea 
                                rows={3}
                                placeholder="Detalles adicionales sobre el desempeño..."
                                value={reportObservations}
                                onChange={e => setReportObservations(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none resize-none"
                              />
                            </div>
                          </div>

                          <button 
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md"
                          >
                            <Save size={20} />
                            Guardar Informe
                          </button>
                        </motion.form>
                      ) : (
                        <div className="space-y-4">
                          {childReports.length > 0 ? (
                            childReports.map(report => (
                              <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-sky-100 text-sky-600 p-2 rounded-lg">
                                      <Calendar size={18} />
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-800">{new Date(report.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                      <p className="text-xs text-slate-500">{report.time} • {report.durationMinutes} min • Terapeuta: {report.therapistName}</p>
                                    </div>
                                  </div>
                                  <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                    Nivel: {report.levelWorked}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                                  <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Actividad</p>
                                    <p className="text-sm text-slate-700 font-medium">{report.activityPerformed}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Resultado</p>
                                    <p className="text-sm text-emerald-600 font-bold">{report.result}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Observaciones</p>
                                    <p className="text-sm text-slate-600 italic">"{report.observations || 'Sin observaciones'}"</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                <FileText size={32} />
                              </div>
                              <p className="text-slate-500 font-medium">No hay informes registrados para este niño.</p>
                              <p className="text-slate-400 text-sm">Comienza registrando la primera sesión.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-200">
                      <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-400 mb-6">
                        <User size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Selecciona un perfil</h3>
                      <p className="text-slate-500 max-w-xs">Elige a un niño de la lista de la izquierda para ver su historial o registrar nuevos informes.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Children List for Selection */}
                <div className="w-full md:w-1/3 bg-white rounded-2xl border border-slate-200 p-4 overflow-y-auto max-h-[60vh] md:max-h-full">
                  <h3 className="font-bold text-slate-800 mb-4 px-2">Seleccionar Niño</h3>
                  <div className="space-y-2">
                    {profiles.map(profile => (
                      <button 
                        key={profile.id}
                        onClick={() => setSelectedChildId(profile.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedChildId === profile.id ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        <span className="text-2xl">{profile.avatar}</span>
                        <div className="text-left">
                          <p className="font-bold text-sm leading-tight">{profile.name}</p>
                          <p className={`text-xs ${selectedChildId === profile.id ? 'text-emerald-100' : 'text-slate-500'}`}>{profile.specialNeedType}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* History List */}
                <div className="w-full md:w-2/3 flex flex-col gap-6">
                  {selectedChildId ? (
                    <>
                      <h3 className="text-xl font-bold text-slate-800">Progreso Automático de {selectedChild?.name}</h3>
                      <div className="space-y-4">
                        {selectedChild?.history && selectedChild.history.length > 0 ? (
                          [...selectedChild.history].reverse().map((session, idx) => {
                            const date = new Date(session.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                            const time = new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const duration = session.durationSeconds ? Math.floor(session.durationSeconds / 60) : 0;
                            const correct = session.activities.filter(a => a.isCorrect).length;
                            const total = session.activities.length;

                            return (
                              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                                      <Calendar size={18} />
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-800">{date}</p>
                                      <p className="text-xs text-slate-500">{time} • {duration} min de sesión</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-emerald-600">{Math.round((correct/total)*100)}%</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Precisión</p>
                                  </div>
                                </div>
                                <div className="flex gap-4 text-sm">
                                  <div className="flex-1 bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Actividades</p>
                                    <p className="font-bold text-slate-700">{total}</p>
                                  </div>
                                  <div className="flex-1 bg-green-50 p-3 rounded-xl">
                                    <p className="text-xs text-green-400 font-bold uppercase mb-1">Aciertos</p>
                                    <p className="font-bold text-green-700">{correct}</p>
                                  </div>
                                  <div className="flex-1 bg-red-50 p-3 rounded-xl">
                                    <p className="text-xs text-red-400 font-bold uppercase mb-1">Fallos</p>
                                    <p className="font-bold text-red-700">{total - correct}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                              <BarChart2 size={32} />
                            </div>
                            <p className="text-slate-500 font-medium">No hay progreso registrado aún.</p>
                            <p className="text-slate-400 text-sm">El progreso se registra automáticamente al completar sesiones.</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-200">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-400 mb-6">
                        <BarChart2 size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Selecciona un perfil</h3>
                      <p className="text-slate-500 max-w-xs">Elige a un niño para ver su progreso automático detallado.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'server' && (
            <motion.div 
              key="server"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-2xl">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Estado del Servidor y Base de Datos</h3>
                  <p className="text-slate-600 mb-4">
                    Aquí puedes verificar la conexión con Supabase y ver si el servidor está configurado correctamente para producción.
                  </p>
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-sky-800 text-sm mb-4">
                    <strong>Nota:</strong> Para que la persistencia funcione, asegúrate de haber ejecutado el script SQL en el editor de Supabase.
                    El archivo se encuentra en la raíz del proyecto como <code>SUPABASE_SCHEMA.sql</code>.
                  </div>
                </div>
                <SupabaseExample />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TherapistDashboard;
