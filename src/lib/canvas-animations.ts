import type { Animation } from '@/types/editor';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function interpolate(
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const t = clamp((frame - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

// Simple cubic easing functions
function easeIn(t: number): number {
  return t * t * t;
}
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function applyEasing(t: number, easing: Animation['easing']): number {
  const clamped = clamp(t, 0, 1);
  switch (easing) {
    case 'ease-in': return easeIn(clamped);
    case 'ease-out': return easeOut(clamped);
    case 'ease-in-out': return easeInOut(clamped);
    case 'spring': return springEasing(clamped);
    default: return clamped;
  }
}

function springEasing(t: number): number {
  // Approximation of spring physics
  const damping = 8;
  const stiffness = 200;
  const w = Math.sqrt(stiffness);
  const d = damping / (2 * Math.sqrt(stiffness));
  if (d < 1) {
    const wd = w * Math.sqrt(1 - d * d);
    return 1 - Math.exp(-d * w * t) * (Math.cos(wd * t) + (d * w / wd) * Math.sin(wd * t));
  }
  return 1 - (1 + w * t) * Math.exp(-w * t);
}

export interface AnimatedProps {
  opacity: number;
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

const DEFAULT_PROPS: AnimatedProps = {
  opacity: 1,
  offsetX: 0,
  offsetY: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
};

/**
 * Compute animated properties for a canvas element given the current frame.
 * Pure function — no React/Remotion dependencies.
 */
export function computeAnimatedProps(
  animation: Animation,
  localFrame: number,
): AnimatedProps {
  if (animation.type === 'none') {
    return { ...DEFAULT_PROPS };
  }

  const startFrame = animation.delay;
  const endFrame = animation.delay + animation.duration;
  const rawT = (localFrame - startFrame) / Math.max(1, animation.duration);
  const t = applyEasing(clamp(rawT, 0, 1), animation.easing);

  let opacity = 1;
  let offsetX = 0;
  let offsetY = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;

  // Fade for entrance animations
  const fadeIn = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1]);

  switch (animation.type) {
    case 'fade-in':
      opacity = t;
      break;

    case 'fade-out':
      opacity = 1 - t;
      break;

    case 'slide-left':
      offsetX = (1 - t) * 500;
      opacity = fadeIn;
      break;

    case 'slide-right':
      offsetX = (1 - t) * -500;
      opacity = fadeIn;
      break;

    case 'slide-up':
      offsetY = (1 - t) * 400;
      opacity = fadeIn;
      break;

    case 'slide-down':
      offsetY = (1 - t) * -400;
      opacity = fadeIn;
      break;

    case 'zoom-in':
      scaleX = t;
      scaleY = t;
      opacity = fadeIn;
      break;

    case 'zoom-out':
      scaleX = 2 - t;
      scaleY = 2 - t;
      opacity = fadeIn;
      break;

    case 'bounce': {
      const springT = springEasing(clamp(rawT, 0, 1));
      scaleX = springT;
      scaleY = springT;
      opacity = interpolate(localFrame, [startFrame, startFrame + 3], [0, 1]);
      break;
    }

    case 'rotate-in':
      rotation = (1 - t) * -180;
      scaleX = t;
      scaleY = t;
      opacity = fadeIn;
      break;

    case 'typewriter':
    case 'word-reveal':
    case 'letter-reveal':
      // Text animations — just fade in on canvas, full effect in Remotion
      opacity = t;
      break;

    case 'zoom-rotate': {
      const zrT = springEasing(clamp(rawT, 0, 1));
      scaleX = interpolate(localFrame, [startFrame, endFrame], [0.1, 1]);
      scaleY = scaleX;
      scaleX = 0.1 + zrT * 0.9;
      scaleY = scaleX;
      opacity = interpolate(localFrame, [startFrame, startFrame + 4], [0, 1]);
      break;
    }

    case 'zoom-blur-in': {
      const zbT = springEasing(clamp(rawT, 0, 1));
      scaleX = 0.3 + zbT * 0.7;
      scaleY = scaleX;
      opacity = interpolate(localFrame, [startFrame, startFrame + 3], [0, 1]);
      break;
    }

    case 'slide-up-zoom': {
      const suzT = springEasing(clamp(rawT, 0, 1));
      offsetY = (1 - suzT) * 350;
      scaleX = 0.7 + suzT * 0.3;
      scaleY = scaleX;
      opacity = interpolate(localFrame, [startFrame, startFrame + 4], [0, 1]);
      break;
    }

    case 'scale-pop': {
      const spT = springEasing(clamp(rawT, 0, 1));
      scaleX = spT;
      scaleY = spT;
      opacity = interpolate(localFrame, [startFrame, startFrame + 2], [0, 1]);
      break;
    }
  }

  return { opacity, offsetX, offsetY, scaleX, scaleY, rotation };
}

/**
 * Given the total currentFrame and project scenes, determine which scene is active
 * and what the local frame within that scene is.
 */
export function getSceneAtFrame(
  scenes: { id: string; duration: number }[],
  currentFrame: number,
): { sceneId: string; localFrame: number } | null {
  let offset = 0;
  for (const scene of scenes) {
    if (currentFrame < offset + scene.duration) {
      return { sceneId: scene.id, localFrame: currentFrame - offset };
    }
    offset += scene.duration;
  }
  // Past the end — return last scene at its last frame
  const last = scenes[scenes.length - 1];
  if (last) {
    return { sceneId: last.id, localFrame: last.duration - 1 };
  }
  return null;
}
