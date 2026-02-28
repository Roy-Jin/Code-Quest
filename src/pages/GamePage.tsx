import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, TRANSLATIONS } from '../config';
import { Header } from '../components/Header';
import { GameGrid } from '../components/GameGrid';
import { EditorPane } from '../components/EditorPane';
import { useGameEngine } from '../hooks/useGameEngine';
import { useStore } from '../context/StoreContext';

export function GamePage() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { settings, progress, updateProgress } = useStore();
  const t = TRANSLATIONS[settings.language];

  const unlockedLevelIndex = progress.unlockedLevelIndex;

  // Find level index based on ID
  const currentLevelIndex = LEVELS.findIndex(l => l.id === levelId);
  const levelConfig = LEVELS[currentLevelIndex];

  // Redirect if level not found or locked
  useEffect(() => {
    if (currentLevelIndex === -1) {
      navigate('/');
      return;
    }

    if (currentLevelIndex > unlockedLevelIndex) {
      navigate('/levels');
    }
  }, [currentLevelIndex, unlockedLevelIndex, navigate]);

  // If levelConfig is undefined (during redirect) or level is locked, don't render
  if (!levelConfig || currentLevelIndex > unlockedLevelIndex) return null;
  
  const [code, setCode] = useState<string>(() => {
    return progress.savedCode[levelId || ''] || levelConfig.defaultCode;
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Auto-save code to store
  useEffect(() => {
    if (levelId && code !== progress.savedCode[levelId]) {
      const timer = setTimeout(() => {
        updateProgress({
          savedCode: {
            ...progress.savedCode,
            [levelId]: code
          }
        });
      }, 1000); // 1 second debounce
      return () => clearTimeout(timer);
    }
  }, [code, levelId, progress.savedCode, updateProgress]);

  const handleSuccess = useCallback(() => {
    const next = Math.max(unlockedLevelIndex, currentLevelIndex + 1);
    if (next > unlockedLevelIndex) {
      updateProgress({ unlockedLevelIndex: next });
    }
  }, [currentLevelIndex, unlockedLevelIndex, updateProgress]);

  const {
    position,
    collectedCoins,
    logs,
    error,
    isRunning,
    isPaused,
    isSuccess,
    runCode,
    togglePause,
    reset,
    forceReset,
    moveCount,
    speed
  } = useGameEngine(levelConfig, t, handleSuccess);

  // When level changes, reset game state and load saved code
  useEffect(() => {
    const savedCode = progress.savedCode[levelConfig.id];
    setCode(savedCode || levelConfig.defaultCode);
    forceReset(levelConfig);
    setIsEditorOpen(false);
  }, [levelConfig.id]);

  const handleRunCode = () => {
    runCode(code);
  };

  const hasNextLevel = currentLevelIndex < LEVELS.length - 1;
  const goToNextLevel = () => {
    if (hasNextLevel) {
      navigate(`/game/${LEVELS[currentLevelIndex + 1].id}`);
    }
  };

  // Auto-open mobile editor drawer on error or success
  useEffect(() => {
    if (error || isSuccess) {
      setIsEditorOpen(true);
    }
  }, [error, isSuccess]);

  // Close drawer when running starts
  useEffect(() => {
    if (isRunning) {
      setIsEditorOpen(false);
    }
  }, [isRunning]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-200 font-sans">
      <Header 
        t={t} 
        isRunning={isRunning} 
        isPaused={isPaused}
        runCode={handleRunCode}
        togglePause={togglePause}
        reset={reset}
        currentLevelIndex={currentLevelIndex}
        setCurrentLevelIndex={(idx) => navigate(`/game/${LEVELS[idx].id}`)}
        unlockedLevelIndex={unlockedLevelIndex}
        levels={LEVELS}
        showHomeButton={true}
        onHomeClick={() => navigate('/levels')}
      />
      <main className="flex flex-1 overflow-hidden relative">
        <GameGrid 
          t={t} 
          lang={settings.language}
          levelConfig={levelConfig} 
          position={position} 
          collectedCoins={collectedCoins} 
          moveCount={moveCount}
          speed={speed}
          onOpenEditor={() => setIsEditorOpen(true)}
          className="md:w-1/2 border-b md:border-b-0 md:border-r border-slate-800"
        />

        {/* Mobile Overlay */}
        {isEditorOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsEditorOpen(false)}
          />
        )}

        {/* Editor Pane Container */}
        <div className={`
          absolute inset-y-0 right-0 z-50 w-full bg-slate-950 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          md:relative md:w-1/2 md:translate-x-0 md:shadow-none md:z-10
          ${isEditorOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <EditorPane 
            t={t}
            levelConfig={levelConfig}
            code={code}
            setCode={setCode}
            isRunning={isRunning}
            resetCode={() => setCode(levelConfig.defaultCode)}
            error={error}
            isSuccess={isSuccess}
            logs={logs}
            hasNextLevel={hasNextLevel}
            goToNextLevel={goToNextLevel}
            onClose={() => setIsEditorOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}
