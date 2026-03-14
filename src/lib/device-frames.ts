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
}

export const DEVICE_FRAMES: Record<Exclude<DeviceType, 'none'>, DeviceFrameInfo> = {
  'iphone-15-pro': {
    type: 'iphone-15-pro',
    label: 'iPhone 15 Pro',
    width: 320,
    height: 650,
    screenX: 15,
    screenY: 15,
    screenWidth: 290,
    screenHeight: 620,
    borderRadius: 40,
  },
  'iphone-15': {
    type: 'iphone-15',
    label: 'iPhone 15',
    width: 320,
    height: 650,
    screenX: 15,
    screenY: 15,
    screenWidth: 290,
    screenHeight: 620,
    borderRadius: 40,
  },
  'pixel-8': {
    type: 'pixel-8',
    label: 'Pixel 8',
    width: 310,
    height: 645,
    screenX: 12,
    screenY: 12,
    screenWidth: 286,
    screenHeight: 621,
    borderRadius: 30,
  },
  'ipad-pro': {
    type: 'ipad-pro',
    label: 'iPad Pro',
    width: 560,
    height: 760,
    screenX: 20,
    screenY: 20,
    screenWidth: 520,
    screenHeight: 720,
    borderRadius: 18,
  },
};
