import React, { useState } from 'react';
import { Info, Target, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TooltipButton } from './TooltipButton';
import { Position, LevelConfig } from '../types';
import { COMMAND_REGISTRY } from '../config';

interface GameGridProps {
  t: any;
  lang: 'en' | 'zh';
  levelConfig: LevelConfig;
  position: Position;
  collectedCoins: string[];
  moveCount: number;
  speed: number;
  onOpenEditor?: () => void;
  className?: string;
  hideControls?: boolean;
}

export function GameGrid({ t, lang, levelConfig, position, collectedCoins, moveCount, speed, onOpenEditor, className = '', hideControls = false }: GameGridProps) {
  const [showCommands, setShowCommands] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);

  const renderGrid = () => {
    const cells = [];
    const walls = levelConfig.walls || [];
    const coins = levelConfig.coins || [];

    for (let y = 0; y < levelConfig.gridSize; y++) {
      for (let x = 0; x < levelConfig.gridSize; x++) {
        const isPlayerHere = position.x === x && position.y === y;
        const isTarget = x === levelConfig.targetPos.x && y === levelConfig.targetPos.y;
        const isWall = walls.some(w => w.x === x && w.y === y);
        const isCoin = coins.some(c => c.x === x && c.y === y);
        const isCollected = collectedCoins.includes(`${x},${y}`);
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`border border-slate-800 flex items-center justify-center relative transition-colors duration-300
              ${isWall ? 'bg-slate-700' : isTarget ? 'bg-cyan-900/40' : 'bg-slate-900'}
            `}
          >
            {isTarget && !isWall && !isPlayerHere && (
              <div className="w-1/2 h-1/2 rounded-full bg-cyan-400 opacity-40 animate-pulse" />
            )}
            {isCoin && !isWall && (
              <AnimatePresence>
                {!isCollected && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0, y: -20, rotate: 45 }}
                    transition={{ duration: 0.3 }}
                    className="w-1/2 h-1/2 relative z-0 animate-coin" 
                    style={{ perspective: '1000px' }}
                  >
                    {/* Coin Body */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.6)] border-2 border-yellow-300 flex items-center justify-center">
                      {/* Coin Detail (Inner Ring) */}
                      <div className="w-[70%] h-[70%] rounded-full border border-yellow-500/50 flex items-center justify-center">
                      </div>
                    </div>
                    {/* Shine Effects */}
                    <div className="absolute top-1 left-1 w-1/4 h-1/4 bg-white/60 rounded-full blur-[1px] animate-pulse" />
                    <div className="absolute bottom-2 right-2 w-1/6 h-1/6 bg-white/40 rounded-full blur-[1px] animate-pulse delay-75" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className={`w-full h-full flex flex-col bg-slate-950 relative overflow-hidden shrink-0 ${className}`}>
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        <div 
          className="relative grid gap-0 bg-slate-800 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl aspect-square"
          style={{ 
            width: '100%',
            maxWidth: 'min(100%, 65vh)',
            gridTemplateColumns: `repeat(${levelConfig.gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${levelConfig.gridSize}, 1fr)`
          }}
        >
          {renderGrid()}
          
          {/* Robot */}
          <div 
            className="absolute flex items-center justify-center z-10 ease-in-out"
            style={{
              width: `${100 / levelConfig.gridSize}%`,
              height: `${100 / levelConfig.gridSize}%`,
              left: `${(position.x * 100) / levelConfig.gridSize}%`,
              top: `${(position.y * 100) / levelConfig.gridSize}%`,
              transitionProperty: 'all',
              transitionDuration: `${speed}ms`
            }}
          >
            <div
              className="w-[75%] h-[75%] bg-blue-500 rounded-[20%] flex items-center justify-center shadow-lg ease-in-out"
              style={{
                transform: `rotate(${position.rotation ?? 0}deg)`,
                transitionProperty: 'transform',
                transitionDuration: `${speed}ms`
              }}
            >
              <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 20L12 16L20 20L12 4Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Commands Button & Popover */}
      {!hideControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <TooltipButton
            icon={<Target size={18} />}
            tooltip={t.objectives}
            onClick={() => { setShowObjectives(!showObjectives); setShowCommands(false); }}
            tooltipAlign="right"
            className={`w-8 h-8 border rounded-full shadow-sm transition-colors ${showObjectives ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-cyan-400 hover:border-cyan-500/50'}`}
          />
          <TooltipButton
            icon={<Info size={18} />}
            tooltip={t.availableCommands}
            onClick={() => { setShowCommands(!showCommands); setShowObjectives(false); }}
            tooltipAlign="right"
            className={`w-8 h-8 border rounded-full shadow-sm transition-colors ${showCommands ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-cyan-400 hover:border-cyan-500/50'}`}
          />
          {onOpenEditor && (
            <TooltipButton
              icon={<Code2 size={16} />}
              tooltip="Open Editor"
              onClick={onOpenEditor}
              tooltipAlign="right"
              className="md:hidden w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-sm transition-colors ml-1"
            />
          )}
        </div>
        
        {showObjectives && (
          <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-slate-700 w-56 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">{t.objectives}</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                {t.reachTarget}
              </li>
              {(levelConfig.victoryConditions?.requiredCoins !== undefined || levelConfig.coins.length > 0) && (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  {t.collectCoins}: {collectedCoins.length} / {levelConfig.victoryConditions?.requiredCoins ?? levelConfig.coins.length}
                </li>
              )}
              {levelConfig.victoryConditions?.maxMoves !== undefined && (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500"></div>
                  {t.maxMoves}: {moveCount} / {levelConfig.victoryConditions.maxMoves}
                </li>
              )}
            </ul>
          </div>
        )}

        {showCommands && (
          <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-slate-700 w-64 animate-in fade-in slide-in-from-top-2 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.availableCommands}</h3>
            </div>
            <ul className="text-xs font-mono text-slate-300 space-y-2">
              {levelConfig.availableCommands.map(cmdId => {
                const cmd = COMMAND_REGISTRY[cmdId];
                if (!cmd) return null;
                return (
                  <li key={cmdId} className="bg-slate-900 px-2 py-1.5 rounded flex flex-col gap-1">
                    <span className="text-cyan-400 font-semibold">{cmd.signature}</span>
                    <span className="text-slate-500 text-[10px] leading-tight">{cmd.description[lang]}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
