import type { AnimationType } from '@/types/editor';

export interface AnimationPreset {
  type: AnimationType;
  label: string;
  description: string;
  category: 'entrance' | 'exit' | 'text';
}

export const ANIMATION_PRESETS: AnimationPreset[] = [
  { type: 'none', label: 'None', description: 'No animation', category: 'entrance' },
  { type: 'fade-in', label: 'Fade In', description: 'Gradually appear', category: 'entrance' },
  { type: 'fade-out', label: 'Fade Out', description: 'Gradually disappear', category: 'exit' },
  { type: 'slide-left', label: 'Slide Left', description: 'Slide in from the right', category: 'entrance' },
  { type: 'slide-right', label: 'Slide Right', description: 'Slide in from the left', category: 'entrance' },
  { type: 'slide-up', label: 'Slide Up', description: 'Slide in from the bottom', category: 'entrance' },
  { type: 'slide-down', label: 'Slide Down', description: 'Slide in from the top', category: 'entrance' },
  { type: 'zoom-in', label: 'Zoom In', description: 'Scale up from small', category: 'entrance' },
  { type: 'zoom-out', label: 'Zoom Out', description: 'Scale down from large', category: 'entrance' },
  { type: 'bounce', label: 'Bounce', description: 'Bounce into view', category: 'entrance' },
  { type: 'rotate-in', label: 'Rotate In', description: 'Spin into view', category: 'entrance' },
  { type: 'typewriter', label: 'Typewriter', description: 'Type text character by character', category: 'text' },
  { type: 'word-reveal', label: 'Word Reveal', description: 'Reveal text word by word', category: 'text' },
];

export const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'spring', label: 'Spring' },
] as const;

export const TRANSITION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'wipe', label: 'Wipe' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'blur', label: 'Blur' },
  { value: 'zoom-blur', label: 'Zoom + Blur' },
  { value: 'cross-dissolve', label: 'Cross Dissolve' },
] as const;
