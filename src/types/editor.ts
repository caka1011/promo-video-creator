export type DeviceType = 'iphone-15-pro' | 'iphone-15' | 'pixel-8' | 'ipad-pro' | 'none';

export type AnimationType =
  | 'none'
  | 'fade-in'
  | 'fade-out'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce'
  | 'rotate-in'
  | 'typewriter'
  | 'word-reveal';

export type EasingType = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';

export type TransitionType = 'none' | 'fade' | 'slide-left' | 'slide-right' | 'wipe' | 'zoom';

export interface Animation {
  type: AnimationType;
  duration: number; // in frames
  delay: number; // in frames
  easing: EasingType;
}

export interface BaseElement {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  animation: Animation;
}

export interface ScreenshotElement extends BaseElement {
  type: 'screenshot';
  src: string; // data URL or blob URL
  borderRadius: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export interface DeviceFrameElement extends BaseElement {
  type: 'device-frame';
  deviceType: DeviceType;
  color: string;
  screenshotSrc: string; // screenshot inside the device
}

export type SceneElement = ScreenshotElement | TextElement | DeviceFrameElement;

export interface Scene {
  id: string;
  name: string;
  elements: SceneElement[];
  duration: number; // in frames
  background: string; // CSS color/gradient
  transition: TransitionType;
}

export type Platform = 'app-store' | 'google-play' | 'both';

export interface ResolutionPreset {
  name: string;
  width: number;
  height: number;
}

export const RESOLUTION_PRESETS: Record<string, ResolutionPreset> = {
  'app-store': { name: 'App Store', width: 1920, height: 1080 },
  'google-play': { name: 'Google Play', width: 1920, height: 1080 },
  'instagram-reel': { name: 'Instagram Reel', width: 1080, height: 1920 },
  'custom': { name: 'Custom', width: 1920, height: 1080 },
};

export interface ExportSettings {
  resolution: ResolutionPreset;
  fps: 30 | 60;
  quality: number; // 0.1 - 1
}

export interface ProjectSettings {
  platform: Platform;
  resolution: ResolutionPreset;
  fps: 30 | 60;
}

export interface Project {
  id: string;
  name: string;
  scenes: Scene[];
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}

export type ExportStatus = 'idle' | 'recording' | 'processing' | 'done' | 'error';
