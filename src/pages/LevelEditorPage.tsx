import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Download, Copy, Check, Info, Trash2, RotateCcw } from 'lucide-react';
import { LevelConfig, Direction, Coin, PressurePlate, CoinTier, AvailableAPIs, CoinSystem } from '../types';
import { COMMAND_REGISTRY, TRANSLATIONS } from '../config';
import { TooltipButton } from '../components/TooltipButton';
import { PageTransition } from '../components/PageTransition';
import { useStore } from '../context/StoreContext';

type EditorMode = 'start' | 'target' | 'wall' | 'coin' | 'plate' | 'erase';

const LevelEditorPage = () => {
  const navigate = useNavigate();
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState(5);
  const [levelName, setLevelName] = useState({ en: 'New Level', zh: '新关卡' });
  const [difficulty, setDifficulty] = useState(0);
  const [startPos, setStartPos] = useState<{ x: number; y: number; dir: Direction }>({ x: 0, y: 0, dir: 'E' });
  const [targetPos, setTargetPos] = useState({ x: 4, y: 4 });
  const [walls, setWalls] = useState<{ x: number; y: number }[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [plates, setPlates] = useState<PressurePlate[]>([]);
  const [mode, setMode] = useState<EditorMode>('wall');
  const [selectedTier, setSelectedTier] = useState<CoinTier>(1);
  const [maxMoves, setMaxMoves] = useState<number | undefined>(undefined);
  const [requiredScore, setRequiredScore] = useState<number | undefined>(undefined);
  const [selectedCommands, setSelectedCommands] = useState<string[]>([
    'moveForward', 'turnLeft', 'turnRight', 'robotX', 'robotY', 'robotDir', 'log'
  ]);
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  const handleCellClick = useCallback((x: number, y: number) => {
    switch (mode) {
      case 'start':
        setStartPos({ x, y, dir: startPos.dir });
        break;
      case 'target':
        setTargetPos({ x, y });
        break;
      case 'wall':
        setWalls(prev => {
          const exists = prev.some(w => w.x === x && w.y === y);
          if (exists) return prev.filter(w => !(w.x === x && w.y === y));
          return [...prev, { x, y }];
        });
        break;
      case 'coin':
        setCoins(prev => {
          const exists = prev.some(c => c.x === x && c.y === y);
          if (exists) return prev.filter(c => !(c.x === x && c.y === y));
          return [...prev, { x, y, tier: selectedTier }];
        });
        break;
      case 'plate':
        setPlates(prev => {
          const exists = prev.some(p => p.x === x && p.y === y);
          if (exists) return prev.filter(p => !(p.x === x && p.y === y));
          return [...prev, { x, y, tier: selectedTier }];
        });
        break;
      case 'erase':
        setWalls(prev => prev.filter(w => !(w.x === x && w.y === y)));
        setCoins(prev => prev.filter(c => !(c.x === x && c.y === y)));
        setPlates(prev => prev.filter(p => !(p.x === x && p.y === y)));
        break;
    }
  }, [mode, selectedTier, startPos.dir]);

  const clearAll = () => {
    setWalls([]);
    setCoins([]);
    setPlates([]);
  };

  const generateConfig = useCallback((): LevelConfig => {
    const availableCommands: AvailableAPIs = {
      Robot: [],
      Grid: [],
      Level: [],
      console: []
    };

    selectedCommands.forEach(cmd => {
      if (['moveForward', 'turnLeft', 'turnRight'].includes(cmd)) {
        availableCommands.Robot!.push(cmd);
      } else if (cmd === 'robotX') availableCommands.Robot!.push('x');
      else if (cmd === 'robotY') availableCommands.Robot!.push('y');
      else if (cmd === 'robotDir') availableCommands.Robot!.push('direction');
      else if (cmd === 'robotSpeed') availableCommands.Robot!.push('speed');
      else if (cmd === 'gridSize') availableCommands.Grid!.push('size');
      else if (cmd === 'gridWalls') availableCommands.Grid!.push('walls');
      else if (cmd === 'gridCoins') availableCommands.Grid!.push('coins');
      else if (cmd === 'gridTarget') availableCommands.Grid!.push('target');
      else if (cmd === 'requiredScore') availableCommands.Level!.push('requiredScore');
      else if (cmd === 'maxMoves') availableCommands.Level!.push('maxMoves');
      else if (cmd === 'currentScore') availableCommands.Level!.push('score');
      else if (cmd === 'currentMoves') availableCommands.Level!.push('moves');
      else if (cmd === 'log') availableCommands.console!.push('log');
    });

    const config: LevelConfig = {
      id: `level-${Date.now()}`,
      name: levelName,
      gridSize,
      startPos,
      targetPos,
      walls,
      coins,
      availableCommands,
      defaultCode: {
        en: `// ${levelName.en}\n// Write your code here!\n\n`,
        zh: `// ${levelName.zh}\n// 在这里编写代码！\n\n`
      },
      difficulty
    };

    if (plates.length > 0) {
      config.pressurePlates = plates;
    }

    if (maxMoves !== undefined || requiredScore !== undefined) {
      config.victoryConditions = {};
      if (maxMoves !== undefined) config.victoryConditions.maxMoves = maxMoves;
      if (requiredScore !== undefined) config.victoryConditions.requiredScore = requiredScore;
    }

    return config;
  }, [gridSize, levelName, difficulty, startPos, targetPos, walls, coins, plates, selectedCommands, maxMoves, requiredScore]);

  const exportConfig = () => {
    const config = generateConfig();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const config = generateConfig();
    const json = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCommand = (cmd: string) => {
    setSelectedCommands(prev =>
      prev.includes(cmd) ? prev.filter(c => c !== cmd) : [...prev, cmd]
    );
  };

  const DIR_ROTATION: Record<Direction, number> = { N: 0, E: 90, S: 180, W: 270 };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isStart = startPos.x === x && startPos.y === y;
        const isTarget = targetPos.x === x && targetPos.y === y;
        const isWall = walls.some(w => w.x === x && w.y === y);
        const coin = coins.find(c => c.x === x && c.y === y);
        const plate = plates.find(p => p.x === x && p.y === y);
        const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

        cells.push(
          <button
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            onMouseEnter={() => setHoveredCell({ x, y })}
            onMouseLeave={() => setHoveredCell(null)}
            className={`border border-slate-800 flex items-center justify-center relative transition-all duration-200 ${
              isWall ? 'bg-slate-700' :
              isTarget ? 'bg-cyan-900/40' :
              'bg-slate-900'
            } ${isHovered ? 'ring-2 ring-cyan-500/50' : ''}`}
          >
            {/* Target indicator */}
            {isTarget && !isWall && !isStart && (
              <div className="w-1/2 h-1/2 rounded-full bg-cyan-400 opacity-40" />
            )}

            {/* Pressure Plate */}
            {plate && !isWall && (
              <div className={`w-3/4 h-3/4 rounded-lg bg-gradient-to-br ${CoinSystem.PLATE_COLORS[plate.tier].gradient} border-2 ${CoinSystem.PLATE_COLORS[plate.tier].border} ${CoinSystem.PLATE_COLORS[plate.tier].shadow} flex items-center justify-center`}>
                <div className="w-1/2 h-1/2 rounded border border-white/20" />
              </div>
            )}

            {/* Coin */}
            {coin && !isWall && (
              <div className="w-1/2 h-1/2 relative">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${CoinSystem.TIER_COLORS[coin.tier].gradient} ${CoinSystem.TIER_COLORS[coin.tier].shadow} border-2 ${CoinSystem.TIER_COLORS[coin.tier].border} flex items-center justify-center`}>
                  <div className="w-[70%] h-[70%] rounded-full border border-white/30 flex items-center justify-center bg-black/20">
                    <div 
                      className="text-[10px] font-black"
                      style={{
                        color: coin.tier === 1 ? '#FFF' : 
                               coin.tier === 2 ? '#1E293B' : 
                               coin.tier === 3 ? '#78350F' : 
                               '#0C4A6E',
                        textShadow: coin.tier === 1 
                          ? '0 1px 2px rgba(0,0,0,0.8)' 
                          : '0 1px 2px rgba(255,255,255,0.8)'
                      }}
                    >
                      {CoinSystem.getScore(coin.tier)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Robot */}
            {isStart && (
              <div className="w-[75%] h-[75%] bg-blue-500 rounded-[20%] flex items-center justify-center shadow-lg"
                style={{ transform: `rotate(${DIR_ROTATION[startPos.dir]}deg)` }}
              >
                <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 text-white fill-current">
                  <path d="M12 4L4 20L12 16L20 20L12 4Z" />
                </svg>
              </div>
            )}
          </button>
        );
      }
    }
    return cells;
  };

  return (
    <PageTransition className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 shrink-0 z-50"
      >
        <div className="flex items-center gap-4">
          <TooltipButton
            icon={<Home size={20} />}
            tooltip={t.backToHome}
            onClick={() => navigate('/')}
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-md transition-colors"
          />
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">✏️</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight hidden sm:block">{t.levelEditor}</h1>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">DEV</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipButton
            icon={<Info size={18} />}
            tooltip={showConfig ? t.hideConfig : t.showConfig}
            onClick={() => setShowConfig(!showConfig)}
            tooltipAlign="right"
            className={`p-2 rounded-md transition-colors ${showConfig ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          />
          <TooltipButton
            icon={copied ? <Check size={18} /> : <Copy size={18} />}
            tooltip={copied ? t.copied : t.copyConfig}
            onClick={copyToClipboard}
            tooltipAlign="right"
            className={`p-2 rounded-md transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-500'}`}
          />
          <TooltipButton
            icon={<Download size={18} />}
            tooltip={t.exportJson}
            onClick={exportConfig}
            tooltipAlign="right"
            className="p-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-md transition-colors"
          />
        </div>
      </motion.header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Left: Grid Editor */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-slate-800 bg-slate-900/50 p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setMode('start')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'start' 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                🤖 {t.startPoint}
              </button>
              <button
                onClick={() => setMode('target')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'target' 
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                🎯 {t.target}
              </button>
              <button
                onClick={() => setMode('wall')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'wall' 
                    ? 'bg-gray-600 text-white shadow-lg shadow-gray-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                🧱 {t.wall}
              </button>
              <button
                onClick={() => setMode('coin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'coin' 
                    ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                💰 {t.coin}
              </button>
              <button
                onClick={() => setMode('plate')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'plate' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                ⚡ {t.pressurePlate}
              </button>
              <button
                onClick={() => setMode('erase')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'erase' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                🗑️ {t.erase}
              </button>
              
              <div className="flex-1"></div>
              
              <TooltipButton
                icon={<Trash2 size={16} />}
                tooltip={t.clearAll}
                onClick={clearAll}
                className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm border border-red-500/30"
              />
            </div>

            {(mode === 'coin' || mode === 'plate') && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{t.tier}:</span>
                {[1, 2, 3, 4].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier as CoinTier)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      CoinSystem.TIER_COLORS[tier as CoinTier].gradient.replace('bg-gradient-to-tr', 'bg-gradient-to-br')
                    } ${selectedTier === tier ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'} flex items-center justify-center text-xs font-bold`}
                  >
                    {tier}
                  </button>
                ))}
                <span className="text-xs text-slate-500 ml-2">
                  {selectedTier === 1 && `${t.wood} (1${t.score})`}
                  {selectedTier === 2 && `${t.silver} (5${t.score})`}
                  {selectedTier === 3 && `${t.gold} (15${t.score})`}
                  {selectedTier === 4 && `${t.diamond} (25${t.score})`}
                </span>
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
            <div 
              ref={gridRef}
              className="grid gap-0 bg-slate-800 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl aspect-square"
              style={{ 
                width: '100%',
                maxWidth: 'min(100%, 65vh)',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {renderGrid()}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="border-t border-slate-800 bg-slate-900/50 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex gap-4">
              <span>{t.grid}: {gridSize}×{gridSize}</span>
              <span>{t.wall}: {walls.length}</span>
              <span>{t.coin}: {coins.length}</span>
              <span>{t.pressurePlate}: {plates.length}</span>
            </div>
            <div className="text-slate-500">
              {t.clickGridToPlace}
            </div>
          </div>
        </div>

        {/* Right: Config Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full sm:w-96 border-l border-slate-800 bg-slate-900 overflow-y-auto shrink-0"
            >
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 text-cyan-400">{t.basicConfig}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.gridSize}</label>
                      <input
                        type="number"
                        min="3"
                        max="15"
                        value={gridSize}
                        onChange={(e) => setGridSize(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.levelName} (EN)</label>
                      <input
                        type="text"
                        value={levelName.en}
                        onChange={(e) => setLevelName(prev => ({ ...prev, en: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.levelName} (ZH)</label>
                      <input
                        type="text"
                        value={levelName.zh}
                        onChange={(e) => setLevelName(prev => ({ ...prev, zh: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.difficulty} (0-5)</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.startPoint} {t.direction}</label>
                      <select
                        value={startPos.dir}
                        onChange={(e) => setStartPos(prev => ({ ...prev, dir: e.target.value as Direction }))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="N">N (North) ↑</option>
                        <option value="E">E (East) →</option>
                        <option value="S">S (South) ↓</option>
                        <option value="W">W (West) ←</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-bold mb-4 text-purple-400">{t.victoryConditions}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.maxMoves} ({t.optional})</label>
                      <input
                        type="number"
                        min="1"
                        value={maxMoves ?? ''}
                        onChange={(e) => setMaxMoves(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder={t.unlimited}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">{t.requiredScore} ({t.optional})</label>
                      <input
                        type="number"
                        min="0"
                        value={requiredScore ?? ''}
                        onChange={(e) => setRequiredScore(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder={t.unlimited}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-bold mb-4 text-amber-400">{t.availableCommands}</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {Object.keys(COMMAND_REGISTRY).map(cmd => (
                      <label key={cmd} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCommands.includes(cmd)}
                          onChange={() => toggleCommand(cmd)}
                          className="mt-1 rounded text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-xs text-cyan-400 truncate">
                            {COMMAND_REGISTRY[cmd].signature}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {COMMAND_REGISTRY[cmd].description[settings.language]}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
};

export default LevelEditorPage;
