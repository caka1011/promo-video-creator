import { v4 as uuidv4 } from 'uuid';
import type { Scene, Animation, TransitionType, DeviceFrameElement, TextElement } from '@/types/editor';

// ─── Layout configs for different screen counts ───

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
    { xPercent: 32, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 10, scale: 0.9 },
    { xPercent: 68, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: -10, scale: 0.9 },
  ],
  3: [
    { xPercent: 22, yPercent: 52, rotation: -8, perspectiveX: 5, perspectiveY: -20, scale: 0.75 },
    { xPercent: 50, yPercent: 48, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 1 },
    { xPercent: 78, yPercent: 52, rotation: 8, perspectiveX: 5, perspectiveY: 20, scale: 0.75 },
  ],
  4: [
    { xPercent: 30, yPercent: 30, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
    { xPercent: 70, yPercent: 30, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
    { xPercent: 30, yPercent: 70, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
    { xPercent: 70, yPercent: 70, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
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
  introBg: string;
  sceneBg: string;
  outroBg: string;
  titleColor: string;
  subtitleColor: string;
  featureTextColor: string;
  featureDescColor: string;
  deviceColor: string;
  titleFontWeight: number;
  titleFontSize: number;
  titleShadow: { color: string; blur: number; offsetX: number; offsetY: number };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string; // CSS gradient for card
  style: TemplateStyle;
  introTitle: string;
  introSubtitle: string;
  featureTexts: string[];
  featureDescriptions: string[];
  outroText: string;
  outroSubtext: string;
  deviceAnimation: Animation;
  titleAnimation: Animation;
  subtitleAnimation: Animation;
  featureTextAnimation: Animation;
  featureDescAnimation: Animation;
  transition: TransitionType;
}

export const TEMPLATES: Template[] = [
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'White background, subtle fade animations',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
    style: {
      introBg: '#f8f8fa',
      sceneBg: '#f8f8fa',
      outroBg: '#f8f8fa',
      titleColor: '#1a1a2e',
      subtitleColor: '#666666',
      featureTextColor: '#1a1a2e',
      featureDescColor: '#888888',
      deviceColor: '#1a1a2e',
      titleFontWeight: 700,
      titleFontSize: 72,
      titleShadow: { color: 'transparent', blur: 0, offsetX: 0, offsetY: 0 },
    },
    introTitle: 'Your App Name',
    introSubtitle: 'A beautiful tagline goes here',
    featureTexts: ['Beautiful Interface', 'Smart Features', 'Fast & Reliable', 'Always Connected', 'Made for You'],
    featureDescriptions: ['Designed with care', 'Intelligent by default', 'Lightning-fast performance', 'Stay in sync everywhere', 'Personalized experience'],
    outroText: 'Download Now',
    outroSubtext: 'Available on the App Store',
    deviceAnimation: { type: 'slide-up', duration: 25, delay: 5, easing: 'spring' },
    titleAnimation: { type: 'fade-in', duration: 30, delay: 5, easing: 'ease-out' },
    subtitleAnimation: { type: 'fade-in', duration: 30, delay: 15, easing: 'ease-out' },
    featureTextAnimation: { type: 'slide-right', duration: 20, delay: 10, easing: 'ease-out' },
    featureDescAnimation: { type: 'fade-in', duration: 20, delay: 20, easing: 'ease-out' },
    transition: 'fade',
  },
  {
    id: 'bold-gradient',
    name: 'Bold Gradient',
    description: 'Vibrant gradients with bounce animations',
    category: 'bold',
    preview: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    style: {
      introBg: '#4f46e5',
      sceneBg: '#7c3aed',
      outroBg: '#6d28d9',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.9)',
      featureTextColor: '#ffffff',
      featureDescColor: 'rgba(255,255,255,0.8)',
      deviceColor: '#0f0f23',
      titleFontWeight: 900,
      titleFontSize: 96,
      titleShadow: { color: 'rgba(0,0,0,0.3)', blur: 20, offsetX: 0, offsetY: 4 },
    },
    introTitle: 'NEXT LEVEL',
    introSubtitle: 'Experience the difference',
    featureTexts: ['Unleash Power', 'Bold Design', 'Pure Speed', 'Seamless Flow', 'Next Gen'],
    featureDescriptions: ['Maximum performance', 'Stand out from the crowd', 'Zero lag experience', 'Everything just works', 'Future-proof technology'],
    outroText: 'Get Started',
    outroSubtext: 'Free download',
    deviceAnimation: { type: 'bounce', duration: 30, delay: 5, easing: 'spring' },
    titleAnimation: { type: 'bounce', duration: 30, delay: 5, easing: 'spring' },
    subtitleAnimation: { type: 'fade-in', duration: 20, delay: 20, easing: 'ease-out' },
    featureTextAnimation: { type: 'zoom-in', duration: 20, delay: 10, easing: 'spring' },
    featureDescAnimation: { type: 'fade-in', duration: 20, delay: 20, easing: 'ease-out' },
    transition: 'slide-left',
  },
  {
    id: 'dark-showcase',
    name: 'Dark Showcase',
    description: 'Dark theme with sleek animations and glow',
    category: 'showcase',
    preview: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 100%)',
    style: {
      introBg: '#0f0f1a',
      sceneBg: '#0f0f1a',
      outroBg: '#0f0f1a',
      titleColor: '#8b5cf6',
      subtitleColor: '#ffffff',
      featureTextColor: '#f8fafc',
      featureDescColor: '#94a3b8',
      deviceColor: '#1e293b',
      titleFontWeight: 700,
      titleFontSize: 72,
      titleShadow: { color: 'rgba(139,92,246,0.3)', blur: 30, offsetX: 0, offsetY: 0 },
    },
    introTitle: 'Your App',
    introSubtitle: 'Introducing',
    featureTexts: ['Smart & Intuitive', 'Dark Elegance', 'Precision Built', 'Zero Compromise', 'Premium Feel'],
    featureDescriptions: ['Designed to make your life easier', 'Beautiful in every detail', 'Crafted with precision', 'No shortcuts taken', 'A premium experience'],
    outroText: 'Try It Now',
    outroSubtext: 'Experience the difference',
    deviceAnimation: { type: 'zoom-in', duration: 25, delay: 5, easing: 'spring' },
    titleAnimation: { type: 'zoom-in', duration: 20, delay: 30, easing: 'spring' },
    subtitleAnimation: { type: 'typewriter', duration: 40, delay: 5, easing: 'linear' },
    featureTextAnimation: { type: 'word-reveal', duration: 40, delay: 10, easing: 'ease-out' },
    featureDescAnimation: { type: 'fade-in', duration: 20, delay: 30, easing: 'ease-out' },
    transition: 'zoom',
  },
  {
    id: 'app-store-ready',
    name: 'App Store Ready',
    description: 'Apple-style with perspective and word reveal',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    style: {
      introBg: '#000000',
      sceneBg: '#0f172a',
      outroBg: '#000000',
      titleColor: '#ffffff',
      subtitleColor: '#94a3b8',
      featureTextColor: '#ffffff',
      featureDescColor: '#64748b',
      deviceColor: '#1e293b',
      titleFontWeight: 600,
      titleFontSize: 64,
      titleShadow: { color: 'transparent', blur: 0, offsetX: 0, offsetY: 0 },
    },
    introTitle: 'Introducing',
    introSubtitle: 'The app that changes everything',
    featureTexts: ['Effortless', 'Powerful', 'Secure', 'Beautiful', 'Reliable'],
    featureDescriptions: ['Everything just works', 'Do more with less', 'Your data is safe', 'Pixel-perfect design', 'Always there for you'],
    outroText: 'Available Now',
    outroSubtext: 'On the App Store',
    deviceAnimation: { type: 'slide-up', duration: 30, delay: 5, easing: 'ease-out' },
    titleAnimation: { type: 'word-reveal', duration: 30, delay: 5, easing: 'ease-out' },
    subtitleAnimation: { type: 'fade-in', duration: 25, delay: 25, easing: 'ease-out' },
    featureTextAnimation: { type: 'slide-left', duration: 25, delay: 15, easing: 'ease-out' },
    featureDescAnimation: { type: 'fade-in', duration: 20, delay: 25, easing: 'ease-out' },
    transition: 'cross-dissolve',
  },
  {
    id: 'social-reel',
    name: 'Social Reel',
    description: 'Fast-paced for Instagram/TikTok',
    category: 'bold',
    preview: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    style: {
      introBg: '#18181b',
      sceneBg: '#18181b',
      outroBg: '#18181b',
      titleColor: '#f43f5e',
      subtitleColor: '#ffffff',
      featureTextColor: '#ffffff',
      featureDescColor: '#a1a1aa',
      deviceColor: '#27272a',
      titleFontWeight: 900,
      titleFontSize: 80,
      titleShadow: { color: 'rgba(244,63,94,0.4)', blur: 20, offsetX: 0, offsetY: 0 },
    },
    introTitle: 'CHECK THIS OUT',
    introSubtitle: 'You need this app',
    featureTexts: ['Fire UI', 'Blazing Fast', 'Game Changer', 'Must Have', 'Next Level'],
    featureDescriptions: ['Hot new design', 'Speed like never before', 'This changes the game', 'You need this', 'Take it further'],
    outroText: 'Link in Bio',
    outroSubtext: 'Download free',
    deviceAnimation: { type: 'slide-up', duration: 15, delay: 3, easing: 'spring' },
    titleAnimation: { type: 'bounce', duration: 20, delay: 3, easing: 'spring' },
    subtitleAnimation: { type: 'slide-up', duration: 15, delay: 12, easing: 'ease-out' },
    featureTextAnimation: { type: 'slide-left', duration: 15, delay: 5, easing: 'spring' },
    featureDescAnimation: { type: 'fade-in', duration: 10, delay: 12, easing: 'ease-out' },
    transition: 'slide-left',
  },
];

// ─── Scene generation ───

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
  shadow: TemplateStyle['titleShadow'] = { color: 'transparent', blur: 0, offsetX: 0, offsetY: 0 },
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
    perspectiveX,
    perspectiveY,
    animation,
  };
}

/**
 * Generate scenes from a template and a list of screenshot data URLs.
 * Each screenshot gets its own scene with a device frame and feature text.
 * Also generates intro and outro scenes.
 */
export function generateScenesFromTemplate(
  template: Template,
  screenshots: string[], // data URLs, can be empty strings for placeholders
): Scene[] {
  const screenCount = screenshots.length;
  const canvasW = 1920;
  const canvasH = 1080;
  const scenes: Scene[] = [];

  // ─── Intro scene ───
  const introElements: (TextElement | DeviceFrameElement)[] = [];

  // For intro with subtitle first (like Dark Showcase), swap order
  const isSubtitleFirst = template.id === 'dark-showcase';

  introElements.push(
    makeText(
      isSubtitleFirst ? 'Subtitle' : 'Title',
      isSubtitleFirst ? template.introSubtitle : template.introTitle,
      460,
      isSubtitleFirst ? 380 : 350,
      1000,
      isSubtitleFirst ? 64 : template.style.titleFontSize,
      isSubtitleFirst ? 300 : template.style.titleFontWeight,
      isSubtitleFirst ? template.style.subtitleColor : template.style.titleColor,
      'center',
      isSubtitleFirst ? template.subtitleAnimation : template.titleAnimation,
      isSubtitleFirst ? undefined : template.style.titleShadow,
    ),
    makeText(
      isSubtitleFirst ? 'Title' : 'Subtitle',
      isSubtitleFirst ? template.introTitle : template.introSubtitle,
      460,
      isSubtitleFirst ? 470 : 450,
      1000,
      isSubtitleFirst ? template.style.titleFontSize : 28,
      isSubtitleFirst ? template.style.titleFontWeight : 400,
      isSubtitleFirst ? template.style.titleColor : template.style.subtitleColor,
      'center',
      isSubtitleFirst ? template.titleAnimation : template.subtitleAnimation,
      isSubtitleFirst ? template.style.titleShadow : undefined,
    ),
  );

  scenes.push({
    id: uuidv4(),
    name: 'Intro',
    elements: introElements,
    duration: 90,
    background: template.style.introBg,
    transition: 'none',
  });

  // ─── Screen scenes ───
  // For 1-2 screens: one scene per screen with text beside device
  // For 3+ screens: one showcase scene with all devices, then individual feature scenes
  if (screenCount <= 2) {
    screenshots.forEach((src, i) => {
      const layout = SCREEN_LAYOUTS[1][0]; // Center layout for individual screens
      const deviceW = 320;
      const deviceH = 650;
      const deviceX = (canvasW * 0.6) - deviceW / 2;
      const deviceY = (canvasH - deviceH) / 2;

      const featureText = template.featureTexts[i] ?? `Feature ${i + 1}`;
      const featureDesc = template.featureDescriptions[i] ?? 'Description goes here';

      scenes.push({
        id: uuidv4(),
        name: `Screen ${i + 1}`,
        elements: [
          makeDevice(
            `Device ${i + 1}`,
            deviceX,
            deviceY,
            deviceW,
            deviceH,
            template.style.deviceColor,
            src,
            template.deviceAnimation,
          ),
          makeText(
            'Feature Title',
            featureText,
            80,
            canvasH * 0.38,
            canvasW * 0.4,
            48,
            700,
            template.style.featureTextColor,
            'left',
            template.featureTextAnimation,
          ),
          makeText(
            'Feature Description',
            featureDesc,
            80,
            canvasH * 0.48,
            canvasW * 0.4,
            24,
            400,
            template.style.featureDescColor,
            'left',
            template.featureDescAnimation,
          ),
        ],
        duration: 90,
        background: template.style.sceneBg,
        transition: template.transition,
      });
    });
  } else {
    // Showcase scene with all devices
    const layout = SCREEN_LAYOUTS[screenCount] ?? SCREEN_LAYOUTS[3];
    const showcaseElements: (TextElement | DeviceFrameElement)[] = [];

    screenshots.forEach((src, i) => {
      const pos = layout[i] ?? layout[layout.length - 1];
      const baseW = 320;
      const baseH = 650;
      const scaledW = baseW * pos.scale;
      const scaledH = baseH * pos.scale;
      const x = (pos.xPercent / 100) * canvasW - scaledW / 2;
      const y = (pos.yPercent / 100) * canvasH - scaledH / 2;

      showcaseElements.push(
        makeDevice(
          `Device ${i + 1}`,
          x,
          y,
          scaledW,
          scaledH,
          template.style.deviceColor,
          src,
          { ...template.deviceAnimation, delay: template.deviceAnimation.delay + i * 5 },
          pos.perspectiveX,
          pos.perspectiveY,
          pos.rotation,
        ),
      );
    });

    scenes.push({
      id: uuidv4(),
      name: 'Showcase',
      elements: showcaseElements,
      duration: 120,
      background: template.style.sceneBg,
      transition: template.transition,
    });

    // Individual feature scenes for each screen
    screenshots.forEach((src, i) => {
      const deviceW = 320;
      const deviceH = 650;
      const deviceX = (canvasW * 0.6) - deviceW / 2;
      const deviceY = (canvasH - deviceH) / 2;

      const featureText = template.featureTexts[i] ?? `Feature ${i + 1}`;
      const featureDesc = template.featureDescriptions[i] ?? 'Description goes here';

      scenes.push({
        id: uuidv4(),
        name: `Feature ${i + 1}`,
        elements: [
          makeDevice(
            `Device ${i + 1}`,
            deviceX,
            deviceY,
            deviceW,
            deviceH,
            template.style.deviceColor,
            src,
            template.deviceAnimation,
          ),
          makeText(
            'Feature Title',
            featureText,
            80,
            canvasH * 0.38,
            canvasW * 0.4,
            48,
            700,
            template.style.featureTextColor,
            'left',
            template.featureTextAnimation,
          ),
          makeText(
            'Feature Description',
            featureDesc,
            80,
            canvasH * 0.48,
            canvasW * 0.4,
            24,
            400,
            template.style.featureDescColor,
            'left',
            template.featureDescAnimation,
          ),
        ],
        duration: 90,
        background: template.style.sceneBg,
        transition: template.transition,
      });
    });
  }

  // ─── Outro scene ───
  scenes.push({
    id: uuidv4(),
    name: 'Outro',
    elements: [
      makeText(
        'CTA',
        template.outroText,
        460,
        400,
        1000,
        template.style.titleFontSize,
        template.style.titleFontWeight,
        template.style.titleColor,
        'center',
        template.titleAnimation,
        template.style.titleShadow,
      ),
      makeText(
        'CTA Subtext',
        template.outroSubtext,
        460,
        500,
        1000,
        28,
        400,
        template.style.subtitleColor,
        'center',
        template.subtitleAnimation,
      ),
    ],
    duration: 90,
    background: template.style.outroBg,
    transition: template.transition,
  });

  return scenes;
}
