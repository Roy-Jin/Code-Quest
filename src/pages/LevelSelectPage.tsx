import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LEVELS, TRANSLATIONS } from '../config';
import { motion } from 'motion/react';
import { Play, Lock, CheckCircle2, Settings, Home } from 'lucide-react';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { useStore } from '../context/StoreContext';

export function LevelSelectPage() {
  const navigate = useNavigate();
  const { settings, progress } = useStore();
  const t = TRANSLATIONS[settings.language];
  
  const unlockedLevelIndex = progress.unlockedLevelIndex;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-8 flex flex-col items-center relative overflow-x-hidden">
      <BackgroundGrid />
      
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center px-4 lg:px-8 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-lg md:text-xl font-bold text-white">CQ</span>
              </div>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
              title={t.backToHome}
            >
              <Home size={20} />
            </Link>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
              title={t.settings}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mb-8 z-10 pt-24 lg:pt-28">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-slate-300 flex items-center gap-2">
          <span className="w-1 h-6 md:h-8 bg-blue-500 rounded-full"></span>
          {t.selectLevel}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level, index) => {
            const isUnlocked = index <= unlockedLevelIndex;
            const isCompleted = index < unlockedLevelIndex;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={isUnlocked ? `/game/${level.id}` : '#'}
                  className={`block p-6 rounded-2xl border transition-all duration-300 h-full relative overflow-hidden group ${
                    isUnlocked 
                      ? 'border-slate-700 bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-800/90 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer backdrop-blur-sm' 
                      : 'border-slate-800 bg-slate-950/50 opacity-60 cursor-not-allowed grayscale'
                  }`}
                  onClick={(e) => !isUnlocked && e.preventDefault()}
                >
                  {/* Card Background Gradient Effect */}
                  {isUnlocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider bg-slate-800/50 px-2 py-1 rounded">
                      {t.level} {index + 1}
                    </span>
                    {isCompleted ? (
                      <div className="bg-green-500/10 p-1.5 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    ) : isUnlocked ? (
                      <div className="bg-blue-500/10 p-1.5 rounded-full group-hover:bg-blue-500/20 transition-colors">
                        <Play className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      </div>
                    ) : (
                      <div className="bg-slate-800 p-1.5 rounded-full">
                        <Lock className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-blue-200 transition-colors relative z-10">
                    {settings.language === 'en' ? level.name.en : level.name.zh}
                  </h3>
                  
                  <div className="relative z-10 mt-6">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">
                      <span>{t.difficulty}</span>
                      <span>{level.difficulty}/10</span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i < level.difficulty 
                              ? i < 3 ? 'bg-green-500' : i < 6 ? 'bg-yellow-500' : 'bg-red-500'
                              : 'bg-slate-800'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
