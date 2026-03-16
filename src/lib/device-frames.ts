import type { DeviceType } from '@/types/editor';

export interface DeviceFrameInfo {
  type: DeviceType;
  label: string;
  width: number;
  height: number;
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  borderRadius: number;
  // Visual properties
  screenRadius: number;
  hasDynamicIsland: boolean;
  hasNotch: boolean;
  dynamicIsland?: { width: number; height: number; y: number; radius: number };
  notch?: { width: number; height: number; radius: number };
  homeIndicator?: { width: number; height: number; bottomOffset: number; radius: number };
  sideButtons: { x: number; y: number; width: number; height: number; side: 'left' | 'right' }[];
  // Colors for realistic rendering
  bezelGradient: { start: string; end: string };
  frameHighlight: string;
  frameShadow: string;
}

export const DEVICE_FRAMES: Record<Exclude<DeviceType, 'none'>, DeviceFrameInfo> = {
  'iphone-15-pro': {
    type: 'iphone-15-pro',
    label: 'iPhone 15 Pro',
    width: 320,
    height: 650,
    screenX: 12,
    screenY: 12,
    screenWidth: 296,
    screenHeight: 626,
    borderRadius: 44,
    screenRadius: 38,
    hasDynamicIsland: true,
    hasNotch: false,
    dynamicIsland: { width: 96, height: 28, y: 18, radius: 14 },
    homeIndicator: { width: 100, height: 4, bottomOffset: 8, radius: 2 },
    sideButtons: [
      // Power button (right)
      { x: 318, y: 160, width: 3, height: 60, side: 'right' },
      // Volume up (left)
      { x: -1, y: 140, width: 3, height: 40, side: 'left' },
      // Volume down (left)
      { x: -1, y: 195, width: 3, height: 40, side: 'left' },
      // Action button (left)
      { x: -1, y: 105, width: 3, height: 24, side: 'left' },
    ],
    bezelGradient: { start: '#2a2a3e', end: '#1a1a2e' },
    frameHighlight: 'rgba(255,255,255,0.12)',
    frameShadow: 'rgba(0,0,0,0.6)',
  },
  'iphone-15': {
    type: 'iphone-15',
    label: 'iPhone 15',
    width: 320,
    height: 650,
    screenX: 12,
    screenY: 12,
    screenWidth: 296,
    screenHeight: 626,
    borderRadius: 44,
    screenRadius: 38,
    hasDynamicIsland: true,
    hasNotch: false,
    dynamicIsland: { width: 96, height: 28, y: 18, radius: 14 },
    homeIndicator: { width: 100, height: 4, bottomOffset: 8, radius: 2 },
    sideButtons: [
      { x: 318, y: 160, width: 3, height: 60, side: 'right' },
      { x: -1, y: 140, width: 3, height: 40, side: 'left' },
      { x: -1, y: 195, width: 3, height: 40, side: 'left' },
      // Mute switch (left)
      { x: -1, y: 105, width: 3, height: 20, side: 'left' },
    ],
    bezelGradient: { start: '#3a3a4e', end: '#2a2a3e' },
    frameHighlight: 'rgba(255,255,255,0.10)',
    frameShadow: 'rgba(0,0,0,0.5)',
  },
  'pixel-8': {
    type: 'pixel-8',
    label: 'Pixel 8',
    width: 310,
    height: 645,
    screenX: 10,
    screenY: 10,
    screenWidth: 290,
    screenHeight: 625,
    borderRadius: 36,
    screenRadius: 30,
    hasDynamicIsland: false,
    hasNotch: false,
    // Pixel has a camera cutout (hole punch)
    dynamicIsland: { width: 20, height: 20, y: 18, radius: 10 },
    homeIndicator: { width: 90, height: 4, bottomOffset: 8, radius: 2 },
    sideButtons: [
      { x: 308, y: 150, width: 3, height: 50, side: 'right' },
      { x: 308, y: 220, width: 3, height: 35, side: 'right' },
    ],
    bezelGradient: { start: '#2e2e2e', end: '#1a1a1a' },
    frameHighlight: 'rgba(255,255,255,0.08)',
    frameShadow: 'rgba(0,0,0,0.5)',
  },
  'ipad-pro': {
    type: 'ipad-pro',
    label: 'iPad Pro',
    width: 560,
    height: 760,
    screenX: 16,
    screenY: 16,
    screenWidth: 528,
    screenHeight: 728,
    borderRadius: 24,
    screenRadius: 16,
    hasDynamicIsland: false,
    hasNotch: false,
    // iPad front camera (small dot)
    dynamicIsland: { width: 12, height: 12, y: 6, radius: 6 },
    homeIndicator: { width: 120, height: 4, bottomOffset: 6, radius: 2 },
    sideButtons: [
      { x: 558, y: 80, width: 3, height: 50, side: 'right' },
      { x: -1, y: 100, width: 3, height: 35, side: 'left' },
      { x: -1, y: 145, width: 3, height: 35, side: 'left' },
    ],
    bezelGradient: { start: '#333340', end: '#22222e' },
    frameHighlight: 'rgba(255,255,255,0.10)',
    frameShadow: 'rgba(0,0,0,0.5)',
  },
};
