export interface Settings {
  language: 'en' | 'zh';
  theme: 'dark' | 'light'; // Kept for potential future use, though UI is dark-only for now
  fontSize: number;
  minimap: boolean;
  wordWrap: boolean;
  musicVolume: number;
  sfxVolume: number;
  lineNumbers: boolean;
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  tabSize: number;
  folding: boolean;
  bracketPairColorization: boolean;
  formatOnType: boolean;
}

export interface GameProgress {
  unlockedLevelIndex: number;
  completedLevels: string[]; // Array of level IDs
  savedCode: Record<string, string>; // levelId -> code
}

export interface StoreState {
  settings: Settings;
  progress: GameProgress;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  theme: 'dark',
  fontSize: 16,
  minimap: false,
  wordWrap: true,
  musicVolume: 60,
  sfxVolume: 100,
  lineNumbers: true,
  cursorBlinking: 'smooth',
  cursorStyle: 'line',
  tabSize: 2,
  folding: true,
  bracketPairColorization: true,
  formatOnType: false,
};

export const DEFAULT_PROGRESS: GameProgress = {
  unlockedLevelIndex: 0,
  completedLevels: [],
  savedCode: {},
};

export const DEFAULT_STORE_STATE: StoreState = {
  settings: DEFAULT_SETTINGS,
  progress: DEFAULT_PROGRESS,
};
