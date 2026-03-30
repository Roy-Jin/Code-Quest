/**
 * Audio Manager - Centralized audio playback system
 * Manages background music and sound effects with volume control
 */

import { BGM, SFX } from "webaudiokit";

const bgm = new BGM({
  volume: 0.4,
  stopOnHidden: true,
  loop: true,
  preload: true,
});

const sfx = new SFX({
  volume: 0.6,
  stopOnHidden: true,
  preload: true,
});

bgm.load("bgm", "/bgm.mp3");
sfx.load("coinGet", "/coinGet.mp3");

export { bgm, sfx };
