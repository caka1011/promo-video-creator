'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { Player } from '@remotion/player';
import { PromoVideo } from '@/components/remotion/PromoVideo';
import { useEditorStore } from '@/stores/editor-store';
import { downloadBlob } from '@/lib/export';
import type { ExportStatus } from '@/types/editor';

const RESOLUTION_OPTIONS = [
  { label: 'App Store (1920x1080)', width: 1920, height: 1080 },
  { label: 'Google Play (1920x1080)', width: 1920, height: 1080 },
  { label: 'Instagram Reel (1080x1920)', width: 1080, height: 1920 },
  { label: 'Square (1080x1080)', width: 1080, height: 1080 },
];

export function ExportDialog() {
  const project = useEditorStore((s) => s.project);
  const getTotalFrames = useEditorStore((s) => s.getTotalFrames);
  const totalFrames = getTotalFrames();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [resolution, setResolution] = useState('0');
  const [fps, setFps] = useState<'30' | '60'>('30');
  const [quality, setQuality] = useState(80);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const selectedRes = RESOLUTION_OPTIONS[Number(resolution)];

  const handleExport = useCallback(async () => {
    if (!project || !playerContainerRef.current) return;

    setStatus('recording');
    setProgress(0);

    try {
      // Find the canvas inside the Remotion Player
      const playerEl = playerContainerRef.current;
      const videoEl = playerEl.querySelector('video');
      const canvasEl = playerEl.querySelector('canvas');

      // Use a simpler approach: render to a hidden canvas via the Remotion Player
      // We'll use the MediaRecorder on the player's rendered output
      const targetEl = canvasEl || videoEl;

      if (!targetEl) {
        // Fallback: create a recording from the player's DOM
        setStatus('error');
        return;
      }

      const stream =
        targetEl instanceof HTMLCanvasElement
          ? targetEl.captureStream(Number(fps))
          : (targetEl as HTMLVideoElement & { captureStream(): MediaStream }).captureStream();

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: Math.floor((quality / 100) * 10_000_000),
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        downloadBlob(blob, `${project.name || 'appreel-video'}.webm`);
        setStatus('done');
        setProgress(1);
      };

      mediaRecorder.start();

      // Simulate playback progress
      const durationMs = (totalFrames / Number(fps)) * 1000;
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress(Math.min(elapsed / durationMs, 0.99));
        if (elapsed >= durationMs) {
          clearInterval(progressInterval);
          mediaRecorder.stop();
        }
      }, 100);
    } catch (err) {
      console.error('Export error:', err);
      setStatus('error');
    }
  }, [project, totalFrames, fps, quality]);

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStatus('idle'); }}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90" />}>
        <Download className="h-3.5 w-3.5" />
        Export
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Hidden player for recording */}
          <div ref={playerContainerRef} className="overflow-hidden rounded-lg border border-border" style={{ height: 200 }}>
            {project && totalFrames > 0 && (
              <Player
                component={PromoVideo}
                inputProps={{ project }}
                durationInFrames={Math.max(1, totalFrames)}
                compositionWidth={selectedRes.width}
                compositionHeight={selectedRes.height}
                fps={Number(fps)}
                style={{ width: '100%', height: '100%' }}
                controls={status === 'idle'}
                autoPlay={status === 'recording'}
                loop={false}
              />
            )}
          </div>

          {status === 'idle' && (
            <>
              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={resolution} onValueChange={(v) => v !== null && setResolution(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTION_OPTIONS.map((r, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>FPS</Label>
                <Select value={fps} onValueChange={(v) => v !== null && setFps(v as '30' | '60')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="60">60 FPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality: {quality}%</Label>
                <Slider
                  value={[quality]}
                  onValueChange={(v) => setQuality(typeof v === 'number' ? v : v[0])}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>

              <Button onClick={handleExport} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Start Export
              </Button>
            </>
          )}

          {status === 'recording' && (
            <div className="space-y-3 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Recording video... {Math.round(progress * 100)}%
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          )}

          {status === 'done' && (
            <div className="space-y-3 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
              <p className="text-sm">Video exported successfully!</p>
              <Button onClick={() => setStatus('idle')} variant="outline">
                Export Again
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3 text-center">
              <p className="text-sm text-destructive">
                Export failed. Please try again.
              </p>
              <Button onClick={() => setStatus('idle')} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
