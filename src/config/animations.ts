/**
 * Animation Configuration
 * Centralized animation settings for consistent motion design
 */

// Easing functions
export const EASINGS = {
  // Smooth and natural easing
  smooth: [0.22, 1, 0.36, 1],
  // Bouncy spring-like easing
  spring: [0.68, -0.55, 0.265, 1.55],
  // Quick and snappy
  snappy: [0.4, 0, 0.2, 1],
  // Gentle fade
  gentle: [0.25, 0.46, 0.45, 0.94],
} as const;

// Duration presets (in seconds)
export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// Page transition animations
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  },
} as const;

// Card animations
export const CARD_HOVER = {
  y: -8,
  transition: { duration: DURATIONS.fast },
} as const;

export const CARD_TAP = {
  scale: 0.98,
  transition: { duration: DURATIONS.instant },
} as const;

// Button animations
export const BUTTON_HOVER = {
  scale: 1.05,
  transition: { duration: DURATIONS.fast },
} as const;

export const BUTTON_TAP = {
  scale: 0.95,
  transition: { duration: DURATIONS.instant },
} as const;

// Fade animations
export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATIONS.fast },
} as const;

// Slide animations
export const SLIDE_UP = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  },
} as const;

export const SLIDE_RIGHT = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  },
} as const;

// Scale animations
export const SCALE_IN = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  },
} as const;

// Spring animations
export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export const GENTLE_SPRING = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};

// Stagger children animations
export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const;

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  },
} as const;

// Modal/Dialog animations
export const MODAL_BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATIONS.fast },
} as const;

export const MODAL_CONTENT = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  },
} as const;

// Drawer animations
export const DRAWER_RIGHT = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: SPRING_CONFIG,
} as const;

export const DRAWER_LEFT = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: SPRING_CONFIG,
} as const;

// Loading animations
export const PULSE = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
} as const;

export const SPIN = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
} as const;

// Utility function to create staggered animations
export function createStaggerAnimation(index: number, baseDelay = 0) {
  return {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      delay: baseDelay + index * 0.05,
      duration: DURATIONS.normal,
      ease: EASINGS.smooth,
    },
  };
}

// Utility function for hover animations
export function createHoverAnimation(scale = 1.05, duration = DURATIONS.fast) {
  return {
    whileHover: { scale },
    whileTap: { scale: scale * 0.95 },
    transition: { duration },
  };
}
