import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Languages } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../config';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { settings, updateSettings } = useStore();
  const t = TRANSLATIONS[settings.language];
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowButton(true), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [animationKey]);

  const toggleLanguage = () => {
    const newLang = settings.language === 'zh' ? 'en' : 'zh';
    updateSettings({ language: newLang });
    
    // 重置动画
    setProgress(0);
    setShowButton(false);
    setAnimationKey(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden"
      >
        {/* Language Toggle Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-20 p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-cyan-500/50 rounded-xl backdrop-blur-md transition-all shadow-lg group"
        >
          <Languages className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          {/* <span className="absolute -bottom-8 right-0 text-xs text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {settings.language === 'zh' ? 'English' : '中文'}
          </span> */}
        </motion.button>
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-8">
          {/* Logo Animation */}
          <motion.div
            key={`logo-${animationKey}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 0.8 
            }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-3xl shadow-2xl shadow-cyan-500/50 relative overflow-hidden">
              <img 
                src="/icons/icon.svg" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>

            {/* Orbiting Icons */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            key={`title-${animationKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3">
              {t.title}
            </h1>
            <p className="text-slate-400 text-lg">
              {t.programmingAdventure}
            </p>
          </motion.div>

          {/* Loading Bar */}
          <motion.div
            key={`loading-${animationKey}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-80 max-w-full"
          >
            <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            
            <motion.p
              className="text-center text-slate-500 text-sm mt-3 font-mono"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {progress < 100 
                ? `${t.loading} ${progress}%`
                : t.ready}
            </motion.p>
          </motion.div>

          {/* Enter Button */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="group relative px-12 py-5 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  {t.letsGo}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Hint Text */}
          {showButton && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 text-sm"
            >
              {t.clickToStart}
            </motion.p>
          )}
        </div>

        {/* Corner Decorations */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
