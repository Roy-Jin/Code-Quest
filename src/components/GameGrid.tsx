import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, Target, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TooltipButton } from './TooltipButton';
import { Position, LevelConfig, Coin, CoinSystem } from '../types';
import { COMMAND_REGISTRY } from '../config';

interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
  tier: number;
}

interface GameGridProps {
  t: any;
  lang: 'en' | 'zh';
  levelConfig: LevelConfig;
  position: Position;
  score: number;
  visibleCoins: Map<string, Coin>;
  moveCount: number;
  speed: number;
  onOpenEditor?: () => void;
  className?: string;
  hideControls?: boolean;
  settings: any;
}

export function GameGrid({ t, lang, levelConfig, position, score, visibleCoins, moveCount, speed, onOpenEditor, className = '', hideControls = false, settings }: GameGridProps) {
  const [showCommands, setShowCommands] = useState(false);
  const [showObjectives, setShowObjectives] = useState(settings.autoShowObjectives); // 根据设置决定初始状态
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [prevScore, setPrevScore] = useState(score);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; tooltip: string } | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState({});
  const prevLevelIdRef = React.useRef<string>(levelConfig.id);

  // Auto-open objectives when level changes
  useEffect(() => {
    if (prevLevelIdRef.current !== levelConfig.id) {
      prevLevelIdRef.current = levelConfig.id;
      
      // Only auto-show if setting is enabled
      if (settings.autoShowObjectives) {
        setShowObjectives(true);
        setShowCommands(false);
        
        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
          setShowObjectives(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [levelConfig.id, settings.autoShowObjectives]);

  // Auto-close objectives on first load
  useEffect(() => {
    if (settings.autoShowObjectives) {
      const timer = setTimeout(() => {
        setShowObjectives(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [settings.autoShowObjectives]);

  // Force re-render on window resize to update tooltip position
  useEffect(() => {
    const handleResize = () => forceUpdate({});
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect score changes and create popup
  useEffect(() => {
    if (score > prevScore) {
      const scoreDiff = score - prevScore;
      const popup: ScorePopup = {
        id: `${Date.now()}-${Math.random()}`,
        x: position.x,
        y: position.y,
        score: scoreDiff,
        tier: scoreDiff === 1 ? 1 : scoreDiff === 5 ? 2 : scoreDiff === 15 ? 3 : 4
      };
      setScorePopups(prev => [...prev, popup]);
      
      // Remove popup after animation
      setTimeout(() => {
        setScorePopups(prev => prev.filter(p => p.id !== popup.id));
      }, 1500);
    }
    setPrevScore(score);
  }, [score, prevScore, position.x, position.y]);

  const renderGrid = () => {
    const cells = [];
    const walls = levelConfig.walls || [];
    const coins = levelConfig.coins || [];
    const pressurePlates = levelConfig.pressurePlates || [];

    const getTooltip = (x: number, y: number): string | null => {
      const isPlayerHere = position.x === x && position.y === y;
      const isTarget = x === levelConfig.targetPos.x && y === levelConfig.targetPos.y;
      const isWall = walls.some(w => w.x === x && w.y === y);
      const coinKey = CoinSystem.getCoinKey(x, y);
      const visibleCoin = visibleCoins.get(coinKey);
      const plate = pressurePlates.find(p => p.x === x && p.y === y);

      if (isPlayerHere) return t.tooltipRobot;
      if (isWall) return t.tooltipWall;
      if (plate) {
        const plateTooltips = [t.tooltipPlateWood, t.tooltipPlateSilver, t.tooltipPlateGold, t.tooltipPlateDiamond];
        return plateTooltips[plate.tier - 1];
      }
      if (visibleCoin) {
        const coinTooltips = [t.tooltipCoinWood, t.tooltipCoinSilver, t.tooltipCoinGold, t.tooltipCoinDiamond];
        return coinTooltips[visibleCoin.tier - 1];
      }
      if (isTarget) return t.tooltipTarget;
      return null;
    };

    for (let y = 0; y < levelConfig.gridSize; y++) {
      for (let x = 0; x < levelConfig.gridSize; x++) {
        const isPlayerHere = position.x === x && position.y === y;
        const isTarget = x === levelConfig.targetPos.x && y === levelConfig.targetPos.y;
        const isWall = walls.some(w => w.x === x && w.y === y);
        const coinKey = CoinSystem.getCoinKey(x, y);
        const visibleCoin = visibleCoins.get(coinKey);
        const plate = pressurePlates.find(p => p.x === x && p.y === y);
        const tooltip = getTooltip(x, y);
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`border border-slate-800 flex items-center justify-center relative transition-colors duration-300
              ${isWall ? 'bg-slate-700' : isTarget ? 'bg-cyan-900/40' : 'bg-slate-900'}
            `}
            onMouseEnter={() => settings.showTooltips && tooltip && setHoveredCell({ x, y, tooltip })}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {isTarget && !isWall && !isPlayerHere && (
              <div className="w-1/2 h-1/2 rounded-full bg-cyan-400 opacity-40 animate-pulse" />
            )}
            
            {/* Pressure Plate Rendering */}
            {plate && !isWall && (
              <div className={`w-3/4 h-3/4 rounded-lg bg-gradient-to-br ${CoinSystem.PLATE_COLORS[plate.tier].gradient} border-2 ${CoinSystem.PLATE_COLORS[plate.tier].border} ${CoinSystem.PLATE_COLORS[plate.tier].shadow} flex items-center justify-center`}>
                <div className="w-1/2 h-1/2 rounded border border-white/20" />
              </div>
            )}
            
            {/* Coin Rendering */}
            {visibleCoin && !isWall && (
              <AnimatePresence>
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0, y: -20, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                  className="w-1/2 h-1/2 relative z-0 animate-coin" 
                  style={{ perspective: '1000px' }}
                >
                  {/* Coin Body */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${CoinSystem.TIER_COLORS[visibleCoin.tier].gradient} ${CoinSystem.TIER_COLORS[visibleCoin.tier].shadow} border-2 ${CoinSystem.TIER_COLORS[visibleCoin.tier].border} flex items-center justify-center`}>
                    {/* Coin Detail (Inner Ring) */}
                    <div className="w-[70%] h-[70%] rounded-full border border-white/30 flex items-center justify-center bg-black/20">
                      {/* Tier indicator with better contrast */}
                      <div 
                        className="text-[10px] font-black tracking-tight"
                        style={{
                          color: visibleCoin.tier === 1 ? '#FFF' : 
                                 visibleCoin.tier === 2 ? '#1E293B' : 
                                 visibleCoin.tier === 3 ? '#78350F' : 
                                 '#0C4A6E',
                          textShadow: visibleCoin.tier === 1 
                            ? '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)' 
                            : '0 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.5)',
                          WebkitTextStroke: visibleCoin.tier === 1 ? '0.5px rgba(0,0,0,0.5)' : '0.5px rgba(255,255,255,0.5)'
                        }}
                      >
                        {CoinSystem.getScore(visibleCoin.tier)}
                      </div>
                    </div>
                  </div>
                  {/* Shine Effects */}
                  <div className="absolute top-1 left-1 w-1/4 h-1/4 bg-white/60 rounded-full blur-[1px] animate-pulse" />
                  <div className="absolute bottom-2 right-2 w-1/6 h-1/6 bg-white/40 rounded-full blur-[1px] animate-pulse delay-75" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                  {/* Diamond sparkle effect */}
                  {visibleCoin.tier === 4 && (
                    <>
                      <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
                      <div className="absolute left-0 top-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse delay-150" />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const requiredScore = levelConfig.victoryConditions?.requiredScore ?? 0;
  const maxMoves = levelConfig.victoryConditions?.maxMoves;

  return (
    <div className={`w-full h-full flex flex-col bg-slate-950 overflow-hidden relative shrink-0 ${className}`}>
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-visible relative">
        <div 
          ref={gridRef}
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
            className="absolute flex items-center justify-center z-10 ease-in-out pointer-events-none"
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

        {/* Score Popups (Floating +score animations) - Rendered via Portal to avoid clipping */}
        {createPortal(
          <AnimatePresence>
            {scorePopups.map(popup => {
              if (!gridRef.current) return null;
              
              const gridRect = gridRef.current.getBoundingClientRect();
              const cellSize = gridRect.width / levelConfig.gridSize;
              const popupX = gridRect.left + (popup.x + 0.5) * cellSize;
              const popupY = gridRect.top + (popup.y + 0.5) * cellSize;
              
              return (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -50, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="fixed z-[9999] pointer-events-none"
                  style={{
                    left: `${popupX}px`,
                    top: `${popupY}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    className="font-black text-xl tracking-tight"
                    style={{
                      color: popup.tier === 1 ? '#FCD34D' : 
                             popup.tier === 2 ? '#E2E8F0' : 
                             popup.tier === 3 ? '#FBBF24' : 
                             '#67E8F9',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
                      WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                      filter: 'drop-shadow(0 0 8px currentColor)'
                    }}
                  >
                    +{popup.score}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>,
          document.body
        )}

        {/* Tooltip - Rendered via Portal to avoid overflow clipping */}
        {hoveredCell && gridRef.current && createPortal(
          (() => {
            const gridRect = gridRef.current!.getBoundingClientRect();
            const cellSize = gridRect.width / levelConfig.gridSize;
            const tooltipX = gridRect.left + (hoveredCell.x + 0.5) * cellSize;
            const tooltipY = gridRect.top + hoveredCell.y * cellSize - 10;
            
            return (
              <div
                className="fixed z-[9999] bg-slate-900/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-slate-700 text-xs text-slate-200 pointer-events-none whitespace-nowrap"
                style={{
                  left: `${tooltipX}px`,
                  top: `${tooltipY}px`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                {hoveredCell.tooltip}
                <div 
                  className="absolute left-1/2 bottom-0 w-2 h-2 bg-slate-900/95 border-r border-b border-slate-700"
                  style={{ transform: 'translate(-50%, 50%) rotate(45deg)' }}
                />
              </div>
            );
          })(),
          document.body
        )}
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
                {requiredScore > 0 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    {t.score}: {score} / {requiredScore}
                  </li>
                )}
                {maxMoves !== undefined && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500"></div>
                    {t.maxMoves}: {moveCount} / {maxMoves}
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
