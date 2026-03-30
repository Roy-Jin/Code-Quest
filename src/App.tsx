import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { LevelSelectPage } from './pages/LevelSelectPage';
import { GamePage } from './pages/GamePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { SplashScreen } from './components/SplashScreen';
import { TRANSLATIONS } from './config';
import { useStore } from './context/StoreContext';
import { bgm, sfx } from './utils';

// Lazy load editor only in dev mode
const LevelEditorPage = import.meta.env.DEV 
  ? React.lazy(() => import('./pages/LevelEditorPage'))
  : null;

function AnimatedRoutes() {
  const location = useLocation();
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];
  const isDev = import.meta.env.DEV;

  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/levels" element={<LevelSelectPage />} />
      <Route path="/game/:levelId" element={<GamePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<AboutPage />} />
      {isDev && LevelEditorPage && (
        <Route 
          path="/editor" 
          element={
            <React.Suspense fallback={
              <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                  <p>{t.loadingEditor}</p>
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
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];

  useEffect(() => {
    
    // Check for PWA updates during splash screen
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check if there's already a waiting service worker
        if (reg.waiting) {
          setUpdateAvailable(true);
          console.log('Update already waiting!');
        }

        // Listen for updates
        const handleUpdateFound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          const handleStateChange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              console.log('New version available!');
            }
          };

          newWorker.addEventListener('statechange', handleStateChange);
        };

        reg.addEventListener('updatefound', handleUpdateFound);

        // Check for updates immediately
        reg.update();
      });

      // Listen for controller change (when new SW takes over)
      let refreshing = false;
      const handleControllerChange = () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      };
      
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
    
    // Cleanup on unmount
    return () => {
      bgm.destroy();
      sfx.destroy();
    };
  }, []);

  const handleSplashComplete = () => {
    // User interaction occurred, now we can play audio
    if (!audioInitialized) {
      bgm.play('bgm')
      setAudioInitialized(true);
    }
    setShowSplash(false);
  };

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Fallback: just reload
      window.location.reload();
    }
  };

  if (showSplash) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        updateAvailable={updateAvailable}
        onUpdate={handleUpdate}
      />
    );
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
