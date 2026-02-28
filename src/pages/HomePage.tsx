import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Settings, Info, Github } from 'lucide-react';
import { LEVELS, TRANSLATIONS } from '../config';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { GameGrid } from '../components/GameGrid';
import { TooltipButton } from '../components/TooltipButton';
import { useStore } from '../context/StoreContext';

export function HomePage() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];

  // Demo Animation Logic
  const demoLevel = LEVELS[3]; // Level 4
  const [demoPosition, setDemoPosition] = useState(demoLevel.startPos);
  const [demoCoins, setDemoCoins] = useState<string[]>([]);
  
  useEffect(() => {
    // Path: South 4, East 2, North 4, Collect, East 2, South 5, Collect, East 1
    const path = [
      // Start (0,0) E
      { x: 0, y: 0, rotation: 90, dir: 'E' as const },
      // Turn S
      { x: 0, y: 0, rotation: 180, dir: 'S' as const },
      // South 4
      { x: 0, y: 1, rotation: 180, dir: 'S' as const },
      { x: 0, y: 2, rotation: 180, dir: 'S' as const },
      { x: 0, y: 3, rotation: 180, dir: 'S' as const },
      { x: 0, y: 4, rotation: 180, dir: 'S' as const },
      // Turn E
      { x: 0, y: 4, rotation: 90, dir: 'E' as const },
      // East 2
      { x: 1, y: 4, rotation: 90, dir: 'E' as const },
      { x: 2, y: 4, rotation: 90, dir: 'E' as const },
      // Turn N
      { x: 2, y: 4, rotation: 0, dir: 'N' as const },
      // North 4
      { x: 2, y: 3, rotation: 0, dir: 'N' as const },
      { x: 2, y: 2, rotation: 0, dir: 'N' as const },
      { x: 2, y: 1, rotation: 0, dir: 'N' as const },
      { x: 2, y: 0, rotation: 0, dir: 'N' as const },
      // Turn E
      { x: 2, y: 0, rotation: 90, dir: 'E' as const },
      // East 2
      { x: 3, y: 0, rotation: 90, dir: 'E' as const },
      { x: 4, y: 0, rotation: 90, dir: 'E' as const },
      // Turn S
      { x: 4, y: 0, rotation: 180, dir: 'S' as const },
      // South 5
      { x: 4, y: 1, rotation: 180, dir: 'S' as const },
      { x: 4, y: 2, rotation: 180, dir: 'S' as const },
      { x: 4, y: 3, rotation: 180, dir: 'S' as const },
      { x: 4, y: 4, rotation: 180, dir: 'S' as const },
      { x: 4, y: 5, rotation: 180, dir: 'S' as const },
      // Turn E
      { x: 4, y: 5, rotation: 90, dir: 'E' as const },
      // East 1
      { x: 5, y: 5, rotation: 90, dir: 'E' as const },
      // Finish (Wait)
      { x: 5, y: 5, rotation: 90, dir: 'E' as const },
      { x: 5, y: 5, rotation: 90, dir: 'E' as const },
    ];

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % path.length;
      const nextPos = path[step];
      setDemoPosition(nextPos);

      // Reset coins at start
      if (step === 0) {
        setDemoCoins([]);
      }

      // Collect coin 1 at (2,0)
      if (nextPos.x === 2 && nextPos.y === 0 && !demoCoins.includes('2,0')) {
        setDemoCoins(prev => [...prev, '2,0']);
      }
      
      // Collect coin 2 at (4,5)
      if (nextPos.x === 4 && nextPos.y === 5 && !demoCoins.includes('4,5')) {
        setDemoCoins(prev => [...prev, '4,5']);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden relative">
      <BackgroundGrid />
      
      {/* Header for Language Switch - REMOVED */}
      {/* <header className="absolute top-0 right-0 p-6 z-50">
        <TooltipButton
          icon={<Globe size={24} />}
          tooltip={t.switchLang}
          onClick={() => handleSetLang(lang === 'en' ? 'zh' : 'en')}
          className="p-3 bg-slate-900/30 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 rounded-full border border-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-md shadow-lg"
        />
      </header> */}

      <main className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Side: Menu */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-8 lg:pl-24 lg:pr-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 mb-6 bg-slate-900/30 p-2 pr-6 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-xl font-bold text-white">CQ</span>
              </div>
              <span className="text-slate-300 font-medium tracking-wide">v{__APP_VERSION__}</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 tracking-tight leading-tight">
              {t.title}
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              {t.aboutDesc}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <button
              onClick={() => navigate('/levels')}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play className="fill-current" />
              <span>{t.startGame}</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-lg"
            >
              <Settings size={20} />
              <span>{t.settings}</span>
            </button>

            <button
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-lg"
            >
              <Info size={20} />
              <span>{t.about}</span>
            </button>
          </motion.div>
        </div>

        {/* Right Side: Demo Grid */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none lg:static lg:opacity-100 lg:pointer-events-auto lg:z-auto flex-1 flex items-center justify-center p-8 lg:p-12 lg:bg-transparent overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative w-full max-w-lg aspect-square"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10" />
            
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-slate-950/80 backdrop-blur-sm transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
              <GameGrid
                t={t}
                lang={settings.language}
                levelConfig={demoLevel}
                position={demoPosition}
                collectedCoins={demoCoins}
                moveCount={0}
                speed={500}
                className="w-full h-full"
                hideControls={true}
              />
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl z-20 backdrop-blur-xl"
            >
              <div className="text-4xl">✨</div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 w-24 h-24 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl z-20 p-4 backdrop-blur-xl"
            >
              <div className="text-4xl">🎉</div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
