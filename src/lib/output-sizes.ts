export interface OutputSize {
  id: string;
  name: string;
  width: number;
  height: number;
  store: 'app-store' | 'google-play';
  deviceCategory: string;
}

export const APP_STORE_SIZES: OutputSize[] = [
  { id: 'ios-6.9', name: 'iPhone 6.9"', width: 1320, height: 2868, store: 'app-store', deviceCategory: 'iPhone 6.9"' },
  { id: 'ios-6.7', name: 'iPhone 6.7"', width: 1290, height: 2796, store: 'app-store', deviceCategory: 'iPhone 6.7"' },
  { id: 'ios-6.5', name: 'iPhone 6.5"', width: 1242, height: 2688, store: 'app-store', deviceCategory: 'iPhone 6.5"' },
  { id: 'ios-5.5', name: 'iPhone 5.5"', width: 1242, height: 2208, store: 'app-store', deviceCategory: 'iPhone 5.5"' },
  { id: 'ios-ipad-13', name: 'iPad Pro 13"', width: 2048, height: 2732, store: 'app-store', deviceCategory: 'iPad Pro 13"' },
  { id: 'ios-ipad-11', name: 'iPad Pro 11"', width: 1668, height: 2388, store: 'app-store', deviceCategory: 'iPad Pro 11"' },
];

export const GOOGLE_PLAY_SIZES: OutputSize[] = [
  { id: 'gp-phone', name: 'Phone', width: 1080, height: 1920, store: 'google-play', deviceCategory: 'Phone' },
  { id: 'gp-tablet-7', name: '7" Tablet', width: 1200, height: 1920, store: 'google-play', deviceCategory: '7" Tablet' },
  { id: 'gp-tablet-10', name: '10" Tablet', width: 1600, height: 2560, store: 'google-play', deviceCategory: '10" Tablet' },
];

export const ALL_OUTPUT_SIZES: OutputSize[] = [...APP_STORE_SIZES, ...GOOGLE_PLAY_SIZES];

export function getOutputSizeById(id: string): OutputSize | undefined {
  return ALL_OUTPUT_SIZES.find((s) => s.id === id);
}

export function getOutputSizesForStore(store: 'app-store' | 'google-play' | 'both'): OutputSize[] {
  if (store === 'app-store') return APP_STORE_SIZES;
  if (store === 'google-play') return GOOGLE_PLAY_SIZES;
  return ALL_OUTPUT_SIZES;
}
