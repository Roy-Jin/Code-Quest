import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Settings, 
  GameProgress, 
  StoreState, 
  DEFAULT_SETTINGS, 
  DEFAULT_PROGRESS, 
  DEFAULT_STORE_STATE 
} from '../config/defaultSettings';
import { bgm, sfx } from '../utils';

interface StoreContextType {
  settings: Settings;
  progress: GameProgress;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateProgress: (newProgress: Partial<GameProgress>) => void;
  resetSettings: () => void;
  resetProgress: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'cq-store';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          progress: { ...DEFAULT_PROGRESS, ...parsed.progress }
        };
      }

      return DEFAULT_STORE_STATE;
    } catch (error) {
      console.error('Failed to load store from localStorage:', error);
      return DEFAULT_STORE_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save store to localStorage:', error);
    }
  }, [state]);

  useEffect(() => {
    bgm.config.enable = state.settings.musicEnabled;
    bgm.config.volume = state.settings.musicVolume / 100;
    sfx.config.enable = state.settings.sfxEnabled;
    sfx.config.volume = state.settings.sfxVolume / 100;

    if (state.settings.musicEnabled && bgm.paused) {
      bgm.play("bgm");
    }
  }, [
    state.settings.musicEnabled,
    state.settings.musicVolume,
    state.settings.sfxEnabled,
    state.settings.sfxVolume,
  ]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const updateProgress = (newProgress: Partial<GameProgress>) => {
    setState(prev => ({
      ...prev,
      progress: { ...prev.progress, ...newProgress }
    }));
  };

  const resetSettings = () => {
    setState(prev => ({
      ...prev,
      settings: {
        ...DEFAULT_SETTINGS,
        language: prev.settings.language // Preserve language
      }
    }));
  };

  const resetProgress = () => {
    setState(prev => ({
      ...prev,
      progress: DEFAULT_PROGRESS
    }));
  };

  const resetAll = () => {
    setState(DEFAULT_STORE_STATE);
  };

  return (
    <StoreContext.Provider value={{
      settings: state.settings,
      progress: state.progress,
      updateSettings,
      updateProgress,
      resetSettings,
      resetProgress,
      resetAll
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
