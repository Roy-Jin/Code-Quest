/**
 * Audio Manager - Centralized audio playback system
 * Manages background music and sound effects with volume control
 */

export type SoundEffect = 'coinGet';
export type BackgroundMusic = 'bgm';

interface AudioSettings {
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
}

class AudioManager {
  private static instance: AudioManager;
  
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxCache: Map<SoundEffect, HTMLAudioElement> = new Map();
  
  private settings: AudioSettings = {
    musicEnabled: true,
    musicVolume: 40,
    sfxEnabled: true,
    sfxVolume: 60,
  };

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance of AudioManager
   */
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Update audio settings
   */
  updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    // Update background music volume if it's playing
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.settings.musicEnabled 
        ? this.settings.musicVolume / 100 
        : 0;
      
      // Pause or resume based on enabled state
      if (this.settings.musicEnabled && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(err => {
          console.warn('Failed to resume background music:', err);
        });
      } else if (!this.settings.musicEnabled && !this.bgmAudio.paused) {
        this.bgmAudio.pause();
      }
    }
  }

  /**
   * Initialize and play background music (loops continuously)
   */
  playBackgroundMusic(music: BackgroundMusic = 'bgm'): void {
    if (!this.settings.musicEnabled) {
      return;
    }

    // If already playing the same music, don't restart
    if (this.bgmAudio && !this.bgmAudio.paused) {
      return;
    }

    // Create audio element if it doesn't exist
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(`/${music}.mp3`);
      this.bgmAudio.loop = true;
    }

    this.bgmAudio.volume = this.settings.musicVolume / 100;
    
    this.bgmAudio.play().catch(err => {
      console.warn('Failed to play background music:', err);
    });
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic(): void {
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  /**
   * Pause background music (can be resumed)
   */
  pauseBackgroundMusic(): void {
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
  }

  /**
   * Resume background music
   */
  resumeBackgroundMusic(): void {
    if (this.bgmAudio && this.bgmAudio.paused && this.settings.musicEnabled) {
      this.bgmAudio.play().catch(err => {
        console.warn('Failed to resume background music:', err);
      });
    }
  }

  /**
   * Play a sound effect
   */
  playSoundEffect(effect: SoundEffect): void {
    if (!this.settings.sfxEnabled) {
      return;
    }

    // Get or create audio element for this sound effect
    let audio = this.sfxCache.get(effect);
    
    if (!audio) {
      audio = new Audio(`/${effect}.mp3`);
      this.sfxCache.set(effect, audio);
    }

    // Clone the audio to allow overlapping plays
    const audioClone = audio.cloneNode() as HTMLAudioElement;
    audioClone.volume = this.settings.sfxVolume / 100;
    
    audioClone.play().catch(err => {
      console.warn(`Failed to play sound effect ${effect}:`, err);
    });
  }

  /**
   * Preload audio files for better performance
   */
  preloadAudio(): void {
    // Preload background music
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.settings.musicVolume / 100;
    }

    // Preload sound effects
    const effects: SoundEffect[] = ['coinGet'];
    effects.forEach(effect => {
      if (!this.sfxCache.has(effect)) {
        const audio = new Audio(`/${effect}.mp3`);
        this.sfxCache.set(effect, audio);
      }
    });
  }

  /**
   * Clean up audio resources
   */
  cleanup(): void {
    this.stopBackgroundMusic();
    this.bgmAudio = null;
    this.sfxCache.clear();
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();
