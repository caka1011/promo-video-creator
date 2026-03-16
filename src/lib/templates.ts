import { v4 as uuidv4 } from 'uuid';
import type { Scene, Animation, TransitionType, DeviceFrameElement, TextElement } from '@/types/editor';

export interface MediaSlot {
  src: string;
  mediaType: 'image' | 'video';
}

// ─── Layout configs for multi-device showcase scenes ───

interface DevicePosition {
  xPercent: number;
  yPercent: number;
  rotation: number;
  perspectiveX: number;
  perspectiveY: number;
  scale: number;
}

const SCREEN_LAYOUTS: Record<number, DevicePosition[]> = {
  1: [
    { xPercent: 50, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 1 },
  ],
  2: [
    { xPercent: 32, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 12, scale: 0.9 },
    { xPercent: 68, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: -12, scale: 0.9 },
  ],
  3: [
    { xPercent: 22, yPercent: 52, rotation: -8, perspectiveX: 5, perspectiveY: -20, scale: 0.75 },
    { xPercent: 50, yPercent: 48, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 1 },
    { xPercent: 78, yPercent: 52, rotation: 8, perspectiveX: 5, perspectiveY: 20, scale: 0.75 },
  ],
  4: [
    { xPercent: 30, yPercent: 30, rotation: -5, perspectiveX: 0, perspectiveY: -8, scale: 0.7 },
    { xPercent: 70, yPercent: 30, rotation: 5, perspectiveX: 0, perspectiveY: 8, scale: 0.7 },
    { xPercent: 30, yPercent: 70, rotation: -3, perspectiveX: 0, perspectiveY: -5, scale: 0.7 },
    { xPercent: 70, yPercent: 70, rotation: 3, perspectiveX: 0, perspectiveY: 5, scale: 0.7 },
  ],
  5: [
    { xPercent: 15, yPercent: 50, rotation: -10, perspectiveX: 5, perspectiveY: -20, scale: 0.65 },
    { xPercent: 33, yPercent: 48, rotation: -5, perspectiveX: 3, perspectiveY: -10, scale: 0.75 },
    { xPercent: 50, yPercent: 46, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.85 },
    { xPercent: 67, yPercent: 48, rotation: 5, perspectiveX: 3, perspectiveY: 10, scale: 0.75 },
    { xPercent: 85, yPercent: 50, rotation: 10, perspectiveX: 5, perspectiveY: 20, scale: 0.65 },
  ],
};

// ─── Template definition ───

interface TemplateStyle {
  hookBg: string;
  sceneBg: string;
  interludeBg: string;
  showcaseBg: string;
  outroBg: string;
  titleColor: string;
  subtitleColor: string;
  featureTextColor: string;
  featureDescColor: string;
  hookTextColor: string;
  interludeTextColor: string;
  deviceColor: string;
  titleFontWeight: number;
  titleFontSize: number;
  hookFontSize: number;
  interludeFontSize: number;
  titleShadow: { color: string; blur: number; offsetX: number; offsetY: number };
  hookShadow: { color: string; blur: number; offsetX: number; offsetY: number };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string; // CSS gradient for card
  style: TemplateStyle;
  hookText: string;
  introTitle: string;
  introSubtitle: string;
  interludeTexts: string[];
  featureTexts: string[];
  featureDescriptions: string[];
  outroText: string;
  outroSubtext: string;
  upperCase: boolean;
  deviceAnimation: Animation;
  titleAnimation: Animation;
  subtitleAnimation: Animation;
  featureTextAnimation: Animation;
  featureDescAnimation: Animation;
  hookAnimation: Animation;
  interludeAnimation: Animation;
  transition: TransitionType;
  sceneDuration: number;
  interludeDuration: number;
  hookDuration: number;
  showcaseDuration: number;
  outroDuration: number;
}

// ─── No shadow constant ───
const NO_SHADOW = { color: 'transparent', blur: 0, offsetX: 0, offsetY: 0 };

export const TEMPLATES: Template[] = [
  // ─── 0. Fiverr Pro (exact reference match) ───
  {
    id: 'fiverr-pro',
    name: 'Fiverr Pro',
    description: 'Professional Fiverr-quality: zoom-rotate hook, 3D devices, letter-reveal interludes, fast zoom-blur transitions',
    category: 'professional',
    preview: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 30%, #0a1a3e 60%, #0f0f1a 100%)',
    style: {
      hookBg: '#0a0a0f',
      sceneBg: '#0f0f1a',
      interludeBg: '#0a0a0f',
      showcaseBg: '#0a0a0f',
      outroBg: '#0a0a0f',
      titleColor: '#ffffff',
      subtitleColor: '#94a3b8',
      featureTextColor: '#ffffff',
      featureDescColor: '#94a3b8',
      hookTextColor: '#ffffff',
      interludeTextColor: '#ffffff',
      deviceColor: '#1a1a2e',
      titleFontWeight: 900,
      titleFontSize: 60,
      hookFontSize: 88,
      interludeFontSize: 76,
      titleShadow: { color: 'rgba(0,0,0,0.5)', blur: 15, offsetX: 0, offsetY: 4 },
      hookShadow: { color: 'rgba(0,0,0,0.6)', blur: 20, offsetX: 0, offsetY: 0 },
    },
    hookText: 'THE BEST OF YOUR APP?',
    introTitle: '',
    introSubtitle: '',
    interludeTexts: [
      'BUY, SELL, SWAP\n10,000+ FEATURES',
      'SAVE UP TO 50%\nON EVERYTHING',
      'NO COMPROMISES,\nALWAYS RELIABLE',
    ],
    featureTexts: [
      'JOIN THE\nSMART WAY',
      'ACROSS MULTIPLE\nPLATFORMS',
      'NO LIMITS\nMANAGEMENT',
      'TRACK TRENDS\nIN REAL TIME',
      'TOP UP AND\nGO INSTANTLY',
    ],
    featureDescriptions: [
      '', '', '', '', '',
    ],
    outroText: 'DOWNLOAD NOW',
    outroSubtext: 'UNLEASHING THE BEST, FOR ALL.',
    upperCase: true,
    deviceAnimation: { type: 'slide-up-zoom', duration: 18, delay: 2, easing: 'spring' },
    titleAnimation: { type: 'word-reveal', duration: 22, delay: 6, easing: 'spring' },
    subtitleAnimation: { type: 'fade-in', duration: 15, delay: 20, easing: 'ease-out' },
    featureTextAnimation: { type: 'word-reveal', duration: 22, delay: 6, easing: 'spring' },
    featureDescAnimation: { type: 'fade-in', duration: 15, delay: 18, easing: 'ease-out' },
    hookAnimation: { type: 'zoom-rotate', duration: 25, delay: 3, easing: 'spring' },
    interludeAnimation: { type: 'letter-reveal', duration: 30, delay: 3, easing: 'spring' },
    transition: 'zoom-blur',
    sceneDuration: 65,
    interludeDuration: 55,
    hookDuration: 60,
    showcaseDuration: 80,
    outroDuration: 85,
  },

  // ─── 1. Cinematic Dark ───
  {
    id: 'cinematic-dark',
    name: 'Cinematic Dark',
    description: 'Professional dark theme, bold text, 3D perspective',
    category: 'professional',
    preview: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a3e 50%, #0f0f1a 100%)',
    style: {
      hookBg: '#0a0a0f',
      sceneBg: '#0f0f1a',
      interludeBg: '#0a0a0f',
      showcaseBg: '#0a0a0f',
      outroBg: '#0a0a0f',
      titleColor: '#ffffff',
      subtitleColor: '#94a3b8',
      featureTextColor: '#ffffff',
      featureDescColor: '#94a3b8',
      hookTextColor: '#ffffff',
      interludeTextColor: '#ffffff',
      deviceColor: '#1e293b',
      titleFontWeight: 900,
      titleFontSize: 56,
      hookFontSize: 80,
      interludeFontSize: 72,
      titleShadow: NO_SHADOW,
      hookShadow: NO_SHADOW,
    },
    hookText: 'YOUR NEXT FAVORITE APP?',
    introTitle: '',
    introSubtitle: '',
    interludeTexts: ['DESIGNED FOR YOU.', 'PURE PERFORMANCE.'],
    featureTexts: ['JOIN THE FUTURE', 'SMART & POWERFUL', 'TRACK EVERYTHING', 'STAY CONNECTED', 'UNLOCK MORE'],
    featureDescriptions: ['Experience the next generation', 'Intelligence built-in', 'Real-time insights at your fingertips', 'Seamless sync everywhere', 'Premium features unlocked'],
    outroText: 'DOWNLOAD NOW',
    outroSubtext: 'Available on the App Store',
    upperCase: true,
    deviceAnimation: { type: 'slide-up', duration: 20, delay: 3, easing: 'spring' },
    titleAnimation: { type: 'word-reveal', duration: 25, delay: 8, easing: 'ease-out' },
    subtitleAnimation: { type: 'fade-in', duration: 20, delay: 25, easing: 'ease-out' },
    featureTextAnimation: { type: 'word-reveal', duration: 25, delay: 8, easing: 'ease-out' },
    featureDescAnimation: { type: 'fade-in', duration: 18, delay: 20, easing: 'ease-out' },
    hookAnimation: { type: 'word-reveal', duration: 30, delay: 5, easing: 'ease-out' },
    interludeAnimation: { type: 'bounce', duration: 25, delay: 5, easing: 'spring' },
    transition: 'zoom-blur',
    sceneDuration: 75,
    interludeDuration: 60,
    hookDuration: 70,
    showcaseDuration: 90,
    outroDuration: 90,
  },

  // ─── 2. Neon Pulse ───
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    description: 'Dark theme with neon cyan/magenta accents and glow',
    category: 'bold',
    preview: 'linear-gradient(135deg, #0a0a12 0%, #06b6d4 50%, #ec4899 100%)',
    style: {
      hookBg: '#0a0a12',
      sceneBg: '#0a0a12',
      interludeBg: '#050510',
      showcaseBg: '#0a0a12',
      outroBg: '#050510',
      titleColor: '#06b6d4',
      subtitleColor: '#e2e8f0',
      featureTextColor: '#06b6d4',
      featureDescColor: '#94a3b8',
      hookTextColor: '#ec4899',
      interludeTextColor: '#06b6d4',
      deviceColor: '#1a1a2e',
      titleFontWeight: 900,
      titleFontSize: 56,
      hookFontSize: 80,
      interludeFontSize: 68,
      titleShadow: { color: 'rgba(6,182,212,0.4)', blur: 25, offsetX: 0, offsetY: 0 },
      hookShadow: { color: 'rgba(236,72,153,0.5)', blur: 30, offsetX: 0, offsetY: 0 },
    },
    hookText: 'EXPERIENCE THE FUTURE',
    introTitle: '',
    introSubtitle: '',
    interludeTexts: ['LIMITLESS POWER.', 'BEYOND IMAGINATION.'],
    featureTexts: ['NEON INTERFACE', 'SMART ENGINE', 'REAL-TIME DATA', 'INFINITE SYNC', 'ULTRA MODE'],
    featureDescriptions: ['A stunning visual experience', 'AI-powered intelligence', 'Live data, zero lag', 'Always connected', 'Push the limits'],
    outroText: 'GET STARTED',
    outroSubtext: 'Free download',
    upperCase: true,
    deviceAnimation: { type: 'bounce', duration: 22, delay: 3, easing: 'spring' },
    titleAnimation: { type: 'zoom-in', duration: 20, delay: 8, easing: 'spring' },
    subtitleAnimation: { type: 'fade-in', duration: 18, delay: 22, easing: 'ease-out' },
    featureTextAnimation: { type: 'zoom-in', duration: 20, delay: 8, easing: 'spring' },
    featureDescAnimation: { type: 'fade-in', duration: 18, delay: 20, easing: 'ease-out' },
    hookAnimation: { type: 'bounce', duration: 30, delay: 5, easing: 'spring' },
    interludeAnimation: { type: 'zoom-in', duration: 25, delay: 5, easing: 'spring' },
    transition: 'zoom',
    sceneDuration: 75,
    interludeDuration: 60,
    hookDuration: 70,
    showcaseDuration: 90,
    outroDuration: 90,
  },

  // ─── 3. Clean Studio ───
  {
    id: 'clean-studio',
    name: 'Clean Studio',
    description: 'Professional light theme, Apple-inspired elegance',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #fafafa 0%, #e0e0e0 50%, #f5f5f5 100%)',
    style: {
      hookBg: '#fafafa',
      sceneBg: '#f0f0f4',
      interludeBg: '#fafafa',
      showcaseBg: '#f0f0f4',
      outroBg: '#fafafa',
      titleColor: '#1a1a2e',
      subtitleColor: '#64748b',
      featureTextColor: '#1a1a2e',
      featureDescColor: '#94a3b8',
      hookTextColor: '#2563eb',
      interludeTextColor: '#1a1a2e',
      deviceColor: '#1a1a2e',
      titleFontWeight: 700,
      titleFontSize: 52,
      hookFontSize: 72,
      interludeFontSize: 60,
      titleShadow: NO_SHADOW,
      hookShadow: NO_SHADOW,
    },
    hookText: 'Introducing',
    introTitle: '',
    introSubtitle: '',
    interludeTexts: ['Simply beautiful.', 'Effortlessly powerful.'],
    featureTexts: ['Beautiful Design', 'Smart Features', 'Fast & Reliable', 'Always Connected', 'Made for You'],
    featureDescriptions: ['Crafted with precision', 'Intelligence everywhere', 'Lightning performance', 'Seamless sync', 'Personalized experience'],
    outroText: 'Available Now',
    outroSubtext: 'On the App Store',
    upperCase: false,
    deviceAnimation: { type: 'slide-up', duration: 25, delay: 5, easing: 'ease-out' },
    titleAnimation: { type: 'slide-right', duration: 22, delay: 10, easing: 'ease-out' },
    subtitleAnimation: { type: 'fade-in', duration: 20, delay: 22, easing: 'ease-out' },
    featureTextAnimation: { type: 'slide-right', duration: 22, delay: 10, easing: 'ease-out' },
    featureDescAnimation: { type: 'fade-in', duration: 20, delay: 22, easing: 'ease-out' },
    hookAnimation: { type: 'fade-in', duration: 30, delay: 5, easing: 'ease-out' },
    interludeAnimation: { type: 'fade-in', duration: 25, delay: 5, easing: 'ease-out' },
    transition: 'cross-dissolve',
    sceneDuration: 80,
    interludeDuration: 65,
    hookDuration: 75,
    showcaseDuration: 100,
    outroDuration: 90,
  },

  // ─── 4. Gradient Flow ───
  {
    id: 'gradient-flow',
    name: 'Gradient Flow',
    description: 'Rich purple/blue gradients with smooth animations',
    category: 'bold',
    preview: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    style: {
      hookBg: '#4f46e5',
      sceneBg: '#7c3aed',
      interludeBg: '#6d28d9',
      showcaseBg: '#4f46e5',
      outroBg: '#6d28d9',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.85)',
      featureTextColor: '#ffffff',
      featureDescColor: 'rgba(255,255,255,0.75)',
      hookTextColor: '#ffffff',
      interludeTextColor: '#ffffff',
      deviceColor: '#0f0f23',
      titleFontWeight: 900,
      titleFontSize: 56,
      hookFontSize: 88,
      interludeFontSize: 68,
      titleShadow: { color: 'rgba(0,0,0,0.3)', blur: 20, offsetX: 0, offsetY: 4 },
      hookShadow: { color: 'rgba(0,0,0,0.3)', blur: 20, offsetX: 0, offsetY: 4 },
    },
    hookText: 'NEXT LEVEL',
    introTitle: '',
    introSubtitle: '',
    interludeTexts: ['UNLEASH YOUR POTENTIAL.', 'SEAMLESS BY DESIGN.'],
    featureTexts: ['POWER UP', 'BOLD DESIGN', 'PURE SPEED', 'CONNECTED', 'NEXT GEN'],
    featureDescriptions: ['Maximum performance', 'Stand out beautifully', 'Zero lag experience', 'Everything in sync', 'Future-proof technology'],
    outroText: 'GET STARTED',
    outroSubtext: 'Free download',
    upperCase: true,
    deviceAnimation: { type: 'zoom-in', duration: 22, delay: 3, easing: 'spring' },
    titleAnimation: { type: 'bounce', duration: 22, delay: 8, easing: 'spring' },
    subtitleAnimation: { type: 'fade-in', duration: 18, delay: 22, easing: 'ease-out' },
    featureTextAnimation: { type: 'bounce', duration: 22, delay: 8, easing: 'spring' },
    featureDescAnimation: { type: 'fade-in', duration: 18, delay: 20, easing: 'ease-out' },
    hookAnimation: { type: 'bounce', duration: 30, delay: 5, easing: 'spring' },
    interludeAnimation: { type: 'word-reveal', duration: 28, delay: 5, easing: 'ease-out' },
    transition: 'slide-left',
    sceneDuration: 75,
    interludeDuration: 60,
    hookDuration: 70,
    showcaseDuration: 90,
    outroDuration: 90,
  },

  // ─── 5. Impact Reel ───
  {
    id: 'impact-reel',
    name: 'Impact Reel',
    description: 'Ultra fast-paced for Instagram/TikTok, red accents',
    category: 'social',
    preview: 'linear-gradient(135deg, #18181b 0%, #f43f5e 50%, #fb923c 100%)',
    style: {
      hookBg: '#111111',
      sceneBg: '#18181b',
      interludeBg: '#111111',
      showcaseBg: '#111111',
      outroBg: '#111111',
      titleColor: '#f43f5e',
      subtitleColor: '#ffffff',
      featureTextColor: '#ffffff',
      featureDescColor: '#a1a1aa',
      hookTextColor: '#f43f5e',
      interludeTextColor: '#ffffff',
      deviceColor: '#27272a',
      titleFontWeight: 900,
      titleFontSize: 56,
      hookFontSize: 88,
      interludeFontSize: 72,
      titleShadow: { color: 'rgba(244,63,94,0.4)', blur: 20, offsetX: 0, offsetY: 0 },
      hookShadow: { color: 'rgba(244,63,94,0.5)', blur: 25, offsetX: 0, offsetY: 0 },
    },
    hookText: 'YOU NEED THIS',
    introTitle: '',
    introSubtitle: '',
    interludeTexts: ['GAME CHANGER.', 'UNSTOPPABLE.'],
    featureTexts: ['FIRE UI', 'BLAZING FAST', 'LEVEL UP', 'MUST HAVE', 'NEXT LEVEL'],
    featureDescriptions: ['Hot new design', 'Speed like never before', 'Take it further', 'You need this', 'Beyond limits'],
    outroText: 'LINK IN BIO',
    outroSubtext: 'Download free',
    upperCase: true,
    deviceAnimation: { type: 'slide-up', duration: 15, delay: 2, easing: 'spring' },
    titleAnimation: { type: 'bounce', duration: 18, delay: 5, easing: 'spring' },
    subtitleAnimation: { type: 'fade-in', duration: 12, delay: 15, easing: 'ease-out' },
    featureTextAnimation: { type: 'slide-left', duration: 15, delay: 5, easing: 'spring' },
    featureDescAnimation: { type: 'fade-in', duration: 12, delay: 14, easing: 'ease-out' },
    hookAnimation: { type: 'bounce', duration: 22, delay: 3, easing: 'spring' },
    interludeAnimation: { type: 'slide-up', duration: 18, delay: 3, easing: 'spring' },
    transition: 'slide-left',
    sceneDuration: 55,
    interludeDuration: 45,
    hookDuration: 55,
    showcaseDuration: 70,
    outroDuration: 70,
  },
];

// ─── Scene generation helpers ───

function makeText(
  name: string,
  content: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  fontWeight: number,
  color: string,
  textAlign: 'left' | 'center' | 'right',
  animation: Animation,
  shadow: TemplateStyle['titleShadow'] = NO_SHADOW,
): TextElement {
  return {
    id: uuidv4(),
    type: 'text',
    name,
    x,
    y,
    width,
    height: fontSize * 1.5,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    content,
    fontFamily: 'Inter, sans-serif',
    fontSize,
    fontWeight,
    color,
    textAlign,
    lineHeight: 1.2,
    shadowColor: shadow.color,
    shadowBlur: shadow.blur,
    shadowOffsetX: shadow.offsetX,
    shadowOffsetY: shadow.offsetY,
    animation,
  };
}

function makeDevice(
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  screenshotSrc: string,
  animation: Animation,
  perspectiveX = 0,
  perspectiveY = 0,
  rotation = 0,
  mediaType: 'image' | 'video' = 'image',
): DeviceFrameElement {
  return {
    id: uuidv4(),
    type: 'device-frame',
    name,
    x,
    y,
    width,
    height,
    rotation,
    opacity: 1,
    visible: true,
    locked: false,
    deviceType: 'iphone-15-pro',
    color,
    screenshotSrc,
    screenshotMediaType: mediaType,
    perspectiveX,
    perspectiveY,
    animation,
  };
}

// ─── Device positioning presets ───

type DevicePlacement = 'left' | 'right' | 'center';

interface PlacementConfig {
  device: { x: number; y: number; w: number; h: number; perspectiveY: number };
  title: { x: number; y: number; w: number; align: 'left' | 'center' | 'right' };
  desc: { x: number; y: number; w: number };
}

const CANVAS_W = 1920;
const CANVAS_H = 1080;

function getPlacement(position: DevicePlacement): PlacementConfig {
  switch (position) {
    case 'left':
      return {
        device: { x: 120, y: 60, w: 380, h: 770, perspectiveY: 12 },
        title: { x: 600, y: 340, w: 750, align: 'left' },
        desc: { x: 600, y: 440, w: 750 },
      };
    case 'right':
      return {
        device: { x: 1420, y: 60, w: 380, h: 770, perspectiveY: -12 },
        title: { x: 80, y: 340, w: 750, align: 'left' },
        desc: { x: 80, y: 440, w: 750 },
      };
    case 'center':
      return {
        device: { x: 770, y: 30, w: 380, h: 770, perspectiveY: 0 },
        title: { x: 260, y: 830, w: 1400, align: 'center' },
        desc: { x: 260, y: 910, w: 1400 },
      };
  }
}

// Alternate left/right/center for device scenes
function getPositionSequence(count: number): DevicePlacement[] {
  const cycle: DevicePlacement[] = ['left', 'right', 'center', 'left', 'right'];
  return cycle.slice(0, count);
}

// Fiverr Pro uses a dramatic position sequence with varied 3D perspectives
function getFiverrPositionSequence(count: number): DevicePlacement[] {
  // Match reference: left, center-tilt, left, center-dramatic, center-large
  const cycle: DevicePlacement[] = ['left', 'center', 'left', 'center', 'center'];
  return cycle.slice(0, count);
}

// Fiverr Pro: more dramatic perspective values per device scene
function getFiverrPlacement(position: DevicePlacement, sceneIndex: number): PlacementConfig {
  switch (position) {
    case 'left':
      return {
        device: { x: 80, y: 40, w: 420, h: 850, perspectiveY: 15 },
        title: { x: 580, y: 320, w: 800, align: 'left' },
        desc: { x: 580, y: 460, w: 800 },
      };
    case 'right':
      return {
        device: { x: 1380, y: 40, w: 420, h: 850, perspectiveY: -15 },
        title: { x: 60, y: 320, w: 800, align: 'left' },
        desc: { x: 60, y: 460, w: 800 },
      };
    case 'center':
      // Alternate between dramatic tilt and large center
      if (sceneIndex % 2 === 1) {
        // Dramatic 3D tilt
        return {
          device: { x: 100, y: 20, w: 450, h: 910, perspectiveY: 20 },
          title: { x: 580, y: 380, w: 850, align: 'left' },
          desc: { x: 580, y: 520, w: 850 },
        };
      }
      // Large center device with text at top
      return {
        device: { x: 660, y: 100, w: 440, h: 890, perspectiveY: 0 },
        title: { x: 100, y: 80, w: 560, align: 'left' },
        desc: { x: 100, y: 240, w: 560 },
      };
  }
}

// ─── Main generation function ───

/**
 * Generate a professional promo video from a template and uploaded media.
 * Produces: Hook → Feature scenes (with interludes) → Showcase → Outro
 */
export function generateScenesFromTemplate(
  template: Template,
  mediaSlots: MediaSlot[],
): Scene[] {
  const screenCount = mediaSlots.length;
  const scenes: Scene[] = [];
  const uc = (text: string) => template.upperCase ? text.toUpperCase() : text;

  // ─── Scene 1: Hook ───
  scenes.push({
    id: uuidv4(),
    name: 'Hook',
    elements: [
      makeText(
        'Hook Text',
        uc(template.hookText),
        160,
        360,
        1600,
        template.style.hookFontSize,
        900,
        template.style.hookTextColor,
        'center',
        template.hookAnimation,
        template.style.hookShadow,
      ),
    ],
    duration: template.hookDuration,
    background: template.style.hookBg,
    transition: 'none',
  });

  // ─── Feature scenes with interludes ───
  const isFiverrPro = template.id === 'fiverr-pro';
  const positions = isFiverrPro
    ? getFiverrPositionSequence(screenCount)
    : getPositionSequence(screenCount);
  let interludeIndex = 0;

  mediaSlots.forEach((slot, i) => {
    const placement = isFiverrPro
      ? getFiverrPlacement(positions[i], i)
      : getPlacement(positions[i]);
    const featureText = template.featureTexts[i] ?? `Feature ${i + 1}`;
    const featureDesc = template.featureDescriptions[i] ?? 'Description goes here';

    // Feature scene
    const elements: (TextElement | DeviceFrameElement)[] = [
      makeDevice(
        `Device ${i + 1}`,
        placement.device.x,
        placement.device.y,
        placement.device.w,
        placement.device.h,
        template.style.deviceColor,
        slot.src,
        template.deviceAnimation,
        0,
        placement.device.perspectiveY,
        0,
        slot.mediaType,
      ),
      makeText(
        'Feature Title',
        uc(featureText),
        placement.title.x,
        placement.title.y,
        placement.title.w,
        template.style.titleFontSize,
        template.style.titleFontWeight,
        template.style.featureTextColor,
        placement.title.align,
        template.featureTextAnimation,
        template.style.titleShadow,
      ),
    ];

    // Only add description if it's not empty
    if (featureDesc) {
      elements.push(
        makeText(
          'Feature Description',
          featureDesc,
          placement.desc.x,
          placement.desc.y,
          placement.desc.w,
          24,
          400,
          template.style.featureDescColor,
          placement.title.align,
          template.featureDescAnimation,
        ),
      );
    }

    scenes.push({
      id: uuidv4(),
      name: `Screen ${i + 1}`,
      elements,
      duration: template.sceneDuration,
      background: template.style.sceneBg,
      transition: template.transition,
    });

    // Fiverr Pro: interlude after EVERY device scene (like the reference video)
    // Other templates: interlude after screen 1 and screen 3
    const shouldAddInterlude = isFiverrPro
      ? (i < screenCount - 1) // after every scene except the last
      : ((i === 0 && screenCount >= 2) || (i === 2 && screenCount >= 4));

    if (shouldAddInterlude && interludeIndex < template.interludeTexts.length) {
      const interludeText = template.interludeTexts[interludeIndex];
      // Alternate interlude animations for variety (Fiverr Pro)
      const interludeAnim = isFiverrPro
        ? (interludeIndex % 3 === 0
            ? template.interludeAnimation  // letter-reveal
            : interludeIndex % 3 === 1
            ? { type: 'scale-pop' as const, duration: 22, delay: 3, easing: 'spring' as const }
            : { type: 'zoom-blur-in' as const, duration: 25, delay: 3, easing: 'spring' as const })
        : template.interludeAnimation;

      scenes.push({
        id: uuidv4(),
        name: `Interlude ${interludeIndex + 1}`,
        elements: [
          makeText(
            'Interlude Text',
            uc(interludeText),
            160,
            340,
            1600,
            template.style.interludeFontSize,
            900,
            template.style.interludeTextColor,
            'center',
            interludeAnim,
            template.style.hookShadow,
          ),
        ],
        duration: template.interludeDuration,
        background: template.style.interludeBg,
        transition: template.transition,
      });
      interludeIndex++;
    }
  });

  // ─── Showcase scene (3+ screens) ───
  if (screenCount >= 3) {
    const layout = SCREEN_LAYOUTS[screenCount] ?? SCREEN_LAYOUTS[3];
    const showcaseElements: (TextElement | DeviceFrameElement)[] = [];

    mediaSlots.forEach((slot, i) => {
      const pos = layout[i] ?? layout[layout.length - 1];
      const baseW = 320;
      const baseH = 650;
      const scaledW = baseW * pos.scale;
      const scaledH = baseH * pos.scale;
      const x = (pos.xPercent / 100) * CANVAS_W - scaledW / 2;
      const y = (pos.yPercent / 100) * CANVAS_H - scaledH / 2;

      showcaseElements.push(
        makeDevice(
          `Device ${i + 1}`,
          x,
          y,
          scaledW,
          scaledH,
          template.style.deviceColor,
          slot.src,
          { ...template.deviceAnimation, delay: template.deviceAnimation.delay + i * 4 },
          pos.perspectiveX,
          pos.perspectiveY,
          pos.rotation,
          slot.mediaType,
        ),
      );
    });

    scenes.push({
      id: uuidv4(),
      name: 'Showcase',
      elements: showcaseElements,
      duration: template.showcaseDuration,
      background: template.style.showcaseBg,
      transition: template.transition,
    });
  }

  // ─── Outro ───
  scenes.push({
    id: uuidv4(),
    name: 'Outro',
    elements: [
      makeText(
        'CTA',
        uc(template.outroText),
        260,
        390,
        1400,
        template.style.hookFontSize,
        900,
        template.style.hookTextColor,
        'center',
        template.hookAnimation,
        template.style.hookShadow,
      ),
      makeText(
        'CTA Subtext',
        template.outroSubtext,
        260,
        500,
        1400,
        28,
        400,
        template.style.subtitleColor,
        'center',
        { type: 'fade-in', duration: 20, delay: 25, easing: 'ease-out' },
      ),
    ],
    duration: template.outroDuration,
    background: template.style.outroBg,
    transition: template.transition,
  });

  return scenes;
}
