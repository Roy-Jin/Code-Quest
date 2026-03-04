import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LEVELS, TRANSLATIONS, getLevelsByDifficulty, getDifficultyLevels } from '../config';
import { motion } from 'motion/react';
import { Play, Lock, CheckCircle2, Settings, Home } from 'lucide-react';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { PageTransition } from '../components/PageTransition';
import { TooltipButton } from '../components/TooltipButton';
import { useStore } from '../context/StoreContext';

export function LevelSelectPage() {
  const navigate = useNavigate();
  const { settings, progress } = useStore();
  const t = TRANSLATIONS[settings.language];
  
  const unlockedDifficulty = progress.unlockedDifficulty;
  const completedLevels = progress.completedLevels;
  
  // Group levels by difficulty
  const levelsByDifficulty = getLevelsByDifficulty();
  const difficulties = getDifficultyLevels();
  
  // Difficulty labels
  const difficultyLabels: Record<number, { en: string; zh: string }> = {
    0: { en: t.difficultyTutorial, zh: t.difficultyTutorial },
    1: { en: t.difficultyBeginner, zh: t.difficultyBeginner },
    2: { en: t.difficultyEasy, zh: t.difficultyEasy },
    3: { en: t.difficultyNormal, zh: t.difficultyNormal },
    4: { en: t.difficultyMedium, zh: t.difficultyMedium },
    5: { en: t.difficultyChallenging, zh: t.difficultyChallenging },
    6: { en: t.difficultyHard, zh: t.difficultyHard },
    7: { en: t.difficultyExpert, zh: t.difficultyExpert },
    8: { en: t.difficultyMaster, zh: t.difficultyMaster },
    9: { en: t.difficultyExtreme, zh: t.difficultyExtreme },
    10: { en: t.difficultyLegendary, zh: t.difficultyLegendary },
  };

  return (
    <PageTransition className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col relative overflow-hidden">
      <BackgroundGrid />
      
      <header className="h-20 shrink-0 flex items-center px-4 lg:px-8 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/icons/icon.svg" alt="CQ Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-lg shadow-blue-500/20" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipButton
              icon={<Home size={20} />}
              tooltip={t.backToHome}
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
            />
            <TooltipButton
              icon={<Settings size={20} />}
              tooltip={t.settings}
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-slate-300 flex items-center gap-2">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-1 h-6 md:h-8 bg-blue-500 rounded-full origin-left"
            />
            {t.selectLevel}
          </h2>
          
          {/* Render levels grouped by difficulty */}
          {difficulties.map((difficulty, diffIndex) => {
            const levelsInDifficulty = levelsByDifficulty.get(difficulty) || [];
            const isDifficultyUnlocked = difficulty <= unlockedDifficulty;
            const isDifficultyCompleted = levelsInDifficulty.every(level => 
              completedLevels.includes(level.id)
            );
            
            const difficultyLabel = difficultyLabels[difficulty] || { en: `Level ${difficulty}`, zh: `等级 ${difficulty}` };
            
            return (
              <div key={difficulty} className="mb-12">
                {/* Difficulty Header */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: diffIndex * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className={`px-4 py-2 rounded-lg border ${
                    isDifficultyUnlocked
                      ? 'bg-linear-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}>
                    <span className={`text-lg font-bold ${
                      isDifficultyUnlocked ? 'text-blue-400' : 'text-slate-600'
                    }`}>
                      {settings.language === 'en' ? difficultyLabel.en : difficultyLabel.zh}
                    </span>
                  </div>
                  
                  {isDifficultyCompleted && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: diffIndex * 0.1 + 0.2 }}
                      className="flex items-center gap-2 text-green-500"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {t.completed}
                      </span>
                    </motion.div>
                  )}
                  
                  {!isDifficultyUnlocked && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Lock className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {t.locked}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                  {levelsInDifficulty.map((level, levelIndex) => {
                    const isUnlocked = isDifficultyUnlocked;
                    const isCompleted = completedLevels.includes(level.id);

                    return (
                      <motion.div
                        key={level.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: diffIndex * 0.1 + levelIndex * 0.05,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        whileHover={isUnlocked ? { 
                          y: -8,
                          transition: { duration: 0.2 }
                        } : {}}
                      >
                        <Link
                          to={isUnlocked ? `/game/${level.id}` : '#'}
                          className={`block p-6 rounded-2xl border transition-all duration-300 h-full relative overflow-hidden group ${
                            isUnlocked 
                              ? 'border-slate-700 bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-800/90 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer backdrop-blur-sm' 
                              : 'border-slate-800 bg-slate-950/50 opacity-60 cursor-not-allowed grayscale'
                          }`}
                          onClick={(e) => !isUnlocked && e.preventDefault()}
                        >
                          {/* Card Background Gradient Effect */}
                          {isUnlocked && (
                            <>
                              <motion.div
                                className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.3 }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '200%' }}
                                transition={{ duration: 0.6 }}
                              />
                            </>
                          )}

                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <motion.span 
                              className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider bg-slate-800/50 px-2 py-1 rounded"
                              whileHover={isUnlocked ? { scale: 1.05 } : {}}
                            >
                              {t.level} {LEVELS.indexOf(level) + 1}
                            </motion.span>
                            {isCompleted ? (
                              <motion.div
                                className="bg-green-500/10 p-1.5 rounded-full"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: diffIndex * 0.1 + levelIndex * 0.05 + 0.2, type: "spring" }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              </motion.div>
                            ) : isUnlocked ? (
                              <motion.div
                                className="bg-blue-500/10 p-1.5 rounded-full group-hover:bg-blue-500/20 transition-colors"
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Play className="w-5 h-5 text-blue-400" />
                              </motion.div>
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
                                <motion.div 
                                  key={i} 
                                  className={`flex-1 rounded-full transition-all duration-300 ${
                                    i < level.difficulty 
                                      ? i < 3 ? 'bg-green-500' : i < 6 ? 'bg-yellow-500' : 'bg-red-500'
                                      : 'bg-slate-800'
                                  }`}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ delay: diffIndex * 0.1 + levelIndex * 0.05 + i * 0.03, duration: 0.3 }}
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
            );
          })}
        </motion.div>
      </main>
    </PageTransition>
  );
}
