import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { LevelSelectPage } from './pages/LevelSelectPage';
import { GamePage } from './pages/GamePage';
import { SettingsPage } from './pages/SettingsPage';
import { SplashScreen } from './components/SplashScreen';
import { audioManager } from './utils/audioManager';

// Lazy load editor only in dev mode
const LevelEditorPage = import.meta.env.DEV 
  ? React.lazy(() => import('./pages/LevelEditorPage'))
  : null;

function AnimatedRoutes() {
  const location = useLocation();
  const isDev = import.meta.env.DEV;

  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/levels" element={<LevelSelectPage />} />
      <Route path="/game/:levelId" element={<GamePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      {isDev && LevelEditorPage && (
        <Route 
          path="/editor" 
          element={
            <React.Suspense fallback={
              <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                  <p>Loading Editor...</p>
                </div>
              </div>
            }>
              <LevelEditorPage />
            </React.Suspense>
          } 
        />
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Preload audio files on app mount
    audioManager.preloadAudio();
    
    // Cleanup on unmount
    return () => {
      audioManager.cleanup();
    };
  }, []);

  const handleSplashComplete = () => {
    // User interaction occurred, now we can play audio
    if (!audioInitialized) {
      audioManager.playBackgroundMusic();
      setAudioInitialized(true);
    }
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <BrowserRouter>
      <div className="fixed inset-0 bg-slate-950">
        <AnimatePresence mode="wait">
          <AnimatedRoutes />
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
