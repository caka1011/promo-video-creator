export interface DevicePosition {
  xPercent: number; // 0-100, percentage of canvas width
  yPercent: number; // 0-100, percentage of canvas height
  rotation: number;
  perspectiveX: number;
  perspectiveY: number;
  scale: number; // 1 = 100%
}

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  deviceCount: number;
  positions: DevicePosition[];
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'single-center',
    name: 'Single Center',
    description: 'One device centered',
    deviceCount: 1,
    positions: [
      { xPercent: 50, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 1 },
    ],
  },
  {
    id: 'side-by-side',
    name: 'Side by Side',
    description: 'Two devices side by side',
    deviceCount: 2,
    positions: [
      { xPercent: 30, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 10, scale: 0.9 },
      { xPercent: 70, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: -10, scale: 0.9 },
    ],
  },
  {
    id: 'fan-left',
    name: 'Fan Left',
    description: '3 devices fanned from left',
    deviceCount: 3,
    positions: [
      { xPercent: 25, yPercent: 50, rotation: -10, perspectiveX: 5, perspectiveY: -15, scale: 0.8 },
      { xPercent: 45, yPercent: 48, rotation: -3, perspectiveX: 3, perspectiveY: -8, scale: 0.85 },
      { xPercent: 65, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.9 },
    ],
  },
  {
    id: 'fan-right',
    name: 'Fan Right',
    description: '3 devices fanned from right',
    deviceCount: 3,
    positions: [
      { xPercent: 35, yPercent: 50, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.9 },
      { xPercent: 55, yPercent: 48, rotation: 3, perspectiveX: 3, perspectiveY: 8, scale: 0.85 },
      { xPercent: 75, yPercent: 50, rotation: 10, perspectiveX: 5, perspectiveY: 15, scale: 0.8 },
    ],
  },
  {
    id: 'triple-showcase',
    name: 'Triple Showcase',
    description: '3 devices, center prominent',
    deviceCount: 3,
    positions: [
      { xPercent: 22, yPercent: 52, rotation: -8, perspectiveX: 5, perspectiveY: -20, scale: 0.75 },
      { xPercent: 50, yPercent: 48, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 1 },
      { xPercent: 78, yPercent: 52, rotation: 8, perspectiveX: 5, perspectiveY: 20, scale: 0.75 },
    ],
  },
  {
    id: 'quad-grid',
    name: 'Quad Grid',
    description: '4 devices in a 2x2 grid',
    deviceCount: 4,
    positions: [
      { xPercent: 30, yPercent: 30, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
      { xPercent: 70, yPercent: 30, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
      { xPercent: 30, yPercent: 70, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
      { xPercent: 70, yPercent: 70, rotation: 0, perspectiveX: 0, perspectiveY: 0, scale: 0.7 },
    ],
  },
];
