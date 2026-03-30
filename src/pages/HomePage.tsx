import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Settings, Info, Code } from 'lucide-react';
import { LEVELS, TRANSLATIONS, createHoverAnimation } from '../config';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { GameGrid } from '../components/GameGrid';
import { PageTransition } from '../components/PageTransition';
import { useStore } from '../context/StoreContext';
import { Direction, LevelConfig, Position } from '../types';
import { bgm, sfx } from '../utils';
import DemoLevel from '../config/levels/DemoLevel.json';

export function HomePage() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];

  // Demo Animation Logic
  const demoLevel = DemoLevel as LevelConfig;
  const [demoPosition, setDemoPosition] = useState(demoLevel.startPos);
  const [demoScore, setDemoScore] = useState(0);
  const [demoVisibleCoins, setDemoVisibleCoins] = useState<Map<string, any>>(
    new Map(demoLevel.coins.map(c => [`${c.x},${c.y}`, c]))
  );

  useEffect(() => {
    const DIR_ROTATION: Record<Direction, number> = { N: 0, E: 90, S: 180, W: 270 };
    const DIR_DELTA: Record<Direction, [number, number]> = { 
      N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] 
    };

    const generatePath = (moves: Array<{ dir: Direction; steps: number }>) => {
      const path: Position[] = [];
      let [x, y] = [demoLevel.startPos.x, demoLevel.startPos.y];
      let currentDir = demoLevel.startPos.dir;

      moves.forEach(({ dir, steps }) => {
        if (dir !== currentDir) {
          path.push({ x, y, dir, rotation: DIR_ROTATION[dir] });
          currentDir = dir;
        }
        const [dx, dy] = DIR_DELTA[dir];
        for (let i = 0; i < steps; i++) {
          x += dx;
          y += dy;
          path.push({ x, y, dir, rotation: DIR_ROTATION[dir] });
        }
      });

      // Add pause frames at end
      for (let i = 0; i < 3; i++) {
        path.push({ x, y, dir: currentDir, rotation: DIR_ROTATION[currentDir] });
      }
      return path;
    };

    const path = generatePath([
      { dir: 'S', steps: 4 },
      { dir: 'E', steps: 2 },
      { dir: 'N', steps: 4 },
      { dir: 'E', steps: 2 },
      { dir: 'S', steps: 4 },
    ]);

    const coinMap = new Map(demoLevel.coins.map(c => [`${c.x},${c.y}`, c]));
    let step = 0;
    const collectedCoins = new Set<string>();

    const interval = setInterval(() => {
      step = (step + 1) % path.length;
      const pos = path[step];
      setDemoPosition(pos);

      if (step === 0) {
        collectedCoins.clear();
        setDemoScore(0);
        setDemoVisibleCoins(new Map(coinMap));
      }

      const key = `${pos.x},${pos.y}`;
      const coin = coinMap.get(key);
      if (coin && !collectedCoins.has(key)) {
        collectedCoins.add(key);
        sfx.play("coinGet");
        setDemoScore(prev => prev + (coin.tier === 1 ? 1 : 0));
        setDemoVisibleCoins(prev => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition className="h-screen w-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden relative">
      <BackgroundGrid />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <main className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row h-full">
        {/* Left Side: Menu */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-8 lg:pl-24 lg:pr-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 mb-6 bg-slate-900/30 p-2 pr-6 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
              <img src="/icons/icon.svg" alt="CQ Logo" className="w-10 h-10 rounded-full shadow-lg shadow-cyan-500/20" />
              <span className="text-slate-300 font-medium tracking-wide">v{__APP_VERSION__}</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 tracking-tight leading-tight">
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
            <motion.button
              {...createHoverAnimation(1.02, 0.2)}
              onClick={() => navigate('/levels')}
              className="group relative px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play className="fill-current relative z-10" />
              <span className="relative z-10">{t.startGame}</span>
            </motion.button>

            <motion.button
              {...createHoverAnimation(1.02, 0.2)}
              onClick={() => navigate('/settings')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-lg"
            >
              <Settings size={20} />
              <span>{t.settings}</span>
            </motion.button>

            <motion.button
              {...createHoverAnimation(1.02, 0.2)}
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-lg"
            >
              <Info size={20} />
              <span>{t.about}</span>
            </motion.button>

            {import.meta.env.DEV && (
              <motion.button
                {...createHoverAnimation(1.02, 0.2)}
                onClick={() => navigate('/editor')}
                className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold border border-purple-400/30 transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20"
              >
                <Code size={20} />
                <span>{t.levelEditorDev}</span>
              </motion.button>
            )}
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
            <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10" />

            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-slate-950/80 backdrop-blur-sm transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
              <GameGrid
                t={t}
                lang={settings.language}
                levelConfig={demoLevel}
                position={demoPosition}
                score={demoScore}
                visibleCoins={demoVisibleCoins}
                moveCount={0}
                speed={500}
                className="w-full h-full"
                hideControls={true}
                settings={settings}
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
    </PageTransition>
  );
}
