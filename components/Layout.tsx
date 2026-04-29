
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Star, Calendar, Home, User, Settings, ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  role?: 'therapist' | 'child';
  stars?: number;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  role = 'therapist', 
  stars = 0,
  onBack 
}) => {
  const navigate = useNavigate();

  // Recipe-inspired styles
  const isChild = role === 'child';
  
  return (
    <div className={`min-h-screen flex flex-col overflow-hidden relative font-sans transition-colors duration-500 ${
      isChild ? 'bg-[#FFF9F0]' : 'bg-slate-50'
    }`}>
      
      {/* Background elements for Child role (Atmospheric/Organic recipe) */}
      {isChild && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Nature Landscape Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ 
              backgroundImage: `url("https://img.freepik.com/premium-vector/little-kids-using-time-clock_23-2148450146.jpg")`,
            }}
          />
          
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-200/30 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/30 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-pink-200/20 blur-[80px]" />
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
      )}

      {/* Header (Clean Utility / Minimal recipe for therapist, Playful for child) */}
      <header className={`sticky top-0 z-50 flex-shrink-0 transition-all border-b ${
        isChild 
          ? 'bg-white/80 backdrop-blur-md border-orange-100 h-16 px-4 md:px-8' 
          : 'bg-white border-slate-200 h-16 md:h-20 px-4 md:px-10 shadow-sm'
      } flex items-center justify-between`}>
        
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className={`p-2 rounded-full transition-colors ${
                isChild ? 'hover:bg-orange-50 text-orange-500' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {role === 'therapist' ? (
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"
              >
                <Home size={22} strokeWidth={2.5} />
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-none">
                  HABLA, JUEGA <span className="text-sky-500">Y APRENDE</span>
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Panel de Administración</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl">🦁</span>
               </div>
               <h2 className="font-bold text-orange-600 text-lg hidden sm:block">¡Hola, Aventurero!</h2>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
           {role === 'therapist' && (
             <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
               <Calendar size={16} className="text-slate-400" />
               <span className="text-sm font-bold text-slate-600">
                 {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
               </span>
             </div>
           )}

           {isChild && (
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1.5 rounded-full text-white font-black shadow-lg shadow-orange-200 border-2 border-white/50"
             >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Star size={20} fill="currentColor" />
                </motion.div>
                <span className="text-xl tabular-nums">{stars}</span>
             </motion.div>
           )}

           <div className="flex items-center gap-2">
             {role === 'therapist' ? (
               <>
                 <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                   <Settings size={20} />
                 </button>
                 <button 
                   onClick={() => navigate('/')}
                   className="flex items-center gap-2 bg-white hover:bg-red-50 px-4 py-2 rounded-xl transition-all text-red-500 font-bold border border-red-100 shadow-sm active:scale-95"
                 >
                   <LogOut size={18} />
                   <span className="hidden sm:inline text-sm">Salir</span>
                 </button>
               </>
             ) : (
               <button 
                 onClick={() => navigate('/')}
                 className="bg-white/80 hover:bg-white px-5 py-2 rounded-full text-orange-500 font-black text-sm border-2 border-orange-100 shadow-sm transition-all active:scale-95"
               >
                 SALIR
               </button>
             )}
           </div>
        </div>
      </header>
      
      <main className="relative z-10 w-full flex-grow overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={title || 'layout-content'}
            className="w-full h-full flex flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`w-full h-full overflow-y-auto custom-scrollbar ${
              isChild 
                ? 'p-4 md:p-8' 
                : 'max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-10 w-full'
            }`}>
              {title && !isChild && (
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h2>
                  <div className="h-1 w-12 bg-sky-500 rounded-full mt-2" />
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Decorative for Child */}
      {isChild && (
        <div className="h-4 bg-gradient-to-r from-orange-400 via-yellow-400 to-sky-400 w-full flex-shrink-0" />
      )}
    </div>
  );
};

export default Layout;
