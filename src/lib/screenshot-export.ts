import { downloadBlob } from './export';
import type { OutputSize } from './output-sizes';
import { getOutputSizeById } from './output-sizes';

export async function exportSlideAsPng(
  stageNode: { toBlob: (config: Record<string, unknown>) => Promise<Blob> },
  canvasWidth: number,
  canvasHeight: number,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  const pixelRatio = targetWidth / canvasWidth;
  return stageNode.toBlob({
    pixelRatio,
    mimeType: 'image/png',
    quality: 1,
    x: 0,
    y: 0,
    width: canvasWidth,
    height: canvasHeight,
  });
}

export function downloadScreenshot(blob: Blob, filename: string) {
  downloadBlob(blob, filename);
}

export async function createZipFromFiles(
  files: { name: string; data: Uint8Array }[],
): Promise<Blob> {
  // Dynamic import of fflate to avoid SSR issues
  const { zipSync } = await import('fflate');
  const zipData: Record<string, Uint8Array> = {};
  for (const file of files) {
    zipData[file.name] = file.data;
  }
  const zipped = zipSync(zipData);
  return new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
}

export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}
