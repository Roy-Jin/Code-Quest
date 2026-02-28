import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Pause, RotateCcw, Home, ChevronDown, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TooltipButton } from './TooltipButton';
import { LevelConfig } from '../types';
import { LANGUAGE_NAMES } from '../config';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  t: any;
  isRunning: boolean;
  isPaused: boolean;
  runCode: () => void;
  togglePause: () => void;
  reset: () => void;
  currentLevelIndex: number;
  setCurrentLevelIndex: (index: number) => void;
  unlockedLevelIndex: number;
  levels: LevelConfig[];
  showHomeButton?: boolean;
  onHomeClick?: () => void;
}

export function Header({ 
  t, isRunning, isPaused, runCode, togglePause, reset, 
  currentLevelIndex, setCurrentLevelIndex, unlockedLevelIndex, levels,
  showHomeButton, onHomeClick
}: HeaderProps) {
  const { settings } = useStore();
  const lang = settings.language;
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const levelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (levelMenuRef.current && !levelMenuRef.current.contains(event.target as Node)) {
        setIsLevelMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 shrink-0 z-[60]">
      <div className="flex items-center gap-2 md:gap-4">
        {showHomeButton && (
          <button 
            onClick={onHomeClick}
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-md transition-colors"
            title={t.backToHome}
          >
            <Home size={20} />
          </button>
        )}
        <div className={`flex items-center gap-2 text-cyan-400 ${showHomeButton ? 'hidden md:flex' : 'flex'}`}>
          <Terminal size={24} />
          <h1 className="text-lg font-bold tracking-tight text-slate-200 hidden lg:block">{t.title}</h1>
        </div>
        
        <div className={`h-6 w-px bg-slate-700 mx-2 ${showHomeButton ? 'hidden md:block' : 'block'}`}></div>
        
        {/* Custom Level Selector */}
        <div className="relative" ref={levelMenuRef}>
          <button
            onClick={() => !isRunning && setIsLevelMenuOpen(!isLevelMenuOpen)}
            disabled={isRunning}
            className={`flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 hover:bg-slate-700 hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-between ${isLevelMenuOpen ? 'ring-2 ring-cyan-500/50 border-cyan-500/50' : ''}`}
          >
            <span className="truncate max-w-[150px] font-medium">
              {t.level} {currentLevelIndex + 1}: {levels[currentLevelIndex]?.name[lang]}
            </span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isLevelMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLevelMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 mt-2 w-72 max-h-[60vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 py-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
              >
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/50 mb-1">
                  {t.selectLevel}
                </div>
                {levels.map((level, idx) => {
                  const isUnlocked = idx <= unlockedLevelIndex;
                  const isSelected = idx === currentLevelIndex;
                  
                  return (
                    <button
                      key={level.id}
                      onClick={() => {
                        if (isUnlocked) {
                          setCurrentLevelIndex(idx);
                          setIsLevelMenuOpen(false);
                        }
                      }}
                      disabled={!isUnlocked}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between group transition-colors ${
                        isSelected 
                          ? 'bg-cyan-500/10 text-cyan-400' 
                          : isUnlocked 
                            ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100' 
                            : 'text-slate-600 cursor-not-allowed bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-xs font-mono ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-400' : isUnlocked ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300' : 'bg-slate-800/50 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate font-medium">
                          {level.name[lang]}
                        </span>
                      </div>
                      
                      {isSelected && <Check size={14} className="text-cyan-400 flex-shrink-0" />}
                      {!isUnlocked && <Lock size={14} className="text-slate-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipButton
          icon={<RotateCcw size={18} />}
          tooltip={t.resetGame}
          onClick={reset}
          tooltipAlign="right"
          className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-md"
        />
        <TooltipButton
          icon={isRunning ? (isPaused ? <Play size={18} /> : <Pause size={18} />) : <Play size={18} />}
          tooltip={isRunning ? (isPaused ? t.resume : t.pause) : t.runCode}
          onClick={isRunning ? togglePause : () => runCode()}
          tooltipAlign="right"
          className={`p-2 rounded-md shadow-sm transition-colors ${isRunning && !isPaused ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
        />
      </div>
    </header>
  );
}
