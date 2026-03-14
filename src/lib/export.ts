export interface ExportOptions {
  fps: number;
  quality: number;
  onProgress?: (progress: number) => void;
}

export async function captureCanvasToVideo(
  playerElement: HTMLElement,
  durationInFrames: number,
  options: ExportOptions
): Promise<Blob> {
  const canvas = playerElement.querySelector('canvas');
  if (!canvas) {
    throw new Error('No canvas found in player element');
  }

  const stream = canvas.captureStream(options.fps);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: Math.floor(options.quality * 10_000_000),
  });

  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    mediaRecorder.onerror = (e) => {
      reject(new Error('MediaRecorder error'));
    };

    mediaRecorder.start();

    const durationMs = (durationInFrames / options.fps) * 1000;
    const startTime = Date.now();

    const checkProgress = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      options.onProgress?.(progress);

      if (elapsed >= durationMs) {
        clearInterval(checkProgress);
        mediaRecorder.stop();
      }
    }, 100);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
