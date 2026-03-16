'use client';

import { useRef, useCallback, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Play,
  Pause,
  SkipBack,
  Music,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEditorStore } from '@/stores/editor-store';
import { TRANSITION_OPTIONS } from '@/lib/animations';
import { formatDuration } from '@/lib/utils';
import type { TransitionType } from '@/types/editor';

export function Timeline() {
  const project = useEditorStore((s) => s.project);
  const activeSceneId = useEditorStore((s) => s.activeSceneId);
  const setActiveScene = useEditorStore((s) => s.setActiveScene);
  const addScene = useEditorStore((s) => s.addScene);
  const removeScene = useEditorStore((s) => s.removeScene);
  const updateScene = useEditorStore((s) => s.updateScene);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const setCurrentFrame = useEditorStore((s) => s.setCurrentFrame);
  const getTotalFrames = useEditorStore((s) => s.getTotalFrames);

  const timelineRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const fps = project?.settings.fps ?? 30;
  const totalFrames = getTotalFrames();

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - lastTimeRef.current;
      const framesToAdvance = (elapsed / 1000) * fps;
      if (framesToAdvance >= 1) {
        lastTimeRef.current = now;
        setCurrentFrame((currentFrame + Math.floor(framesToAdvance)) % Math.max(1, totalFrames));
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentFrame, fps, totalFrames, setCurrentFrame]);

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!timelineRef.current || totalFrames === 0) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      setCurrentFrame(Math.floor(pct * totalFrames));
    },
    [totalFrames, setCurrentFrame]
  );

  if (!project) return null;

  const playheadPct = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  // Calculate scene start frames for the scrubber
  let frameOffset = 0;
  const sceneOffsets = project.scenes.map((s) => {
    const start = frameOffset;
    frameOffset += s.duration;
    return { scene: s, start, end: frameOffset };
  });

  return (
    <div className="flex h-full flex-col">
      {/* Controls */}
      <div className="flex items-center gap-2 border-b px-3 py-1.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentFrame(0)}>
          <SkipBack className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <span className="min-w-[80px] text-xs text-muted-foreground tabular-nums">
          {formatDuration(currentFrame, fps)} / {formatDuration(totalFrames, fps)}
        </span>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">{fps} FPS</span>
      </div>

      {/* Timeline track */}
      <div className="flex-1 overflow-x-auto px-3 py-2">
        {/* Scrubber bar */}
        <div
          ref={timelineRef}
          className="relative mb-2 h-4 cursor-pointer rounded bg-slate-100"
          onClick={handleTimelineClick}
        >
          {/* Frame ticks */}
          <div
            className="absolute top-0 h-full w-0.5 bg-blue-600 z-10 transition-[left] duration-75"
            style={{ left: `${playheadPct}%` }}
          />
        </div>

        {/* Scene strips */}
        <div className="flex gap-1.5">
          {project.scenes.map((scene, i) => {
            const widthPct = totalFrames > 0 ? (scene.duration / totalFrames) * 100 : 100;
            return (
              <div
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={`group relative flex-shrink-0 cursor-pointer rounded-lg border p-2 transition-colors ${
                  scene.id === activeSceneId
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-border bg-card hover:border-blue-200'
                }`}
                style={{ width: `${Math.max(widthPct, 15)}%`, minWidth: 120 }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium truncate ${scene.id === activeSceneId ? 'text-blue-700' : ''}`}>{scene.name}</span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                    {project.scenes.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScene(scene.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {formatDuration(scene.duration, fps)}
                  </span>
                  {i > 0 && (
                    <Select
                      value={scene.transition}
                      onValueChange={(v) =>
                        v && updateScene(scene.id, { transition: v as TransitionType })
                      }
                    >
                      <SelectTrigger
                        className="h-5 w-[70px] text-[10px] border-0 bg-transparent p-0 px-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSITION_OPTIONS.map((t) => (
                          <SelectItem key={t.value} value={t.value} className="text-xs">
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Element indicators */}
                <div className="mt-1.5 flex gap-0.5">
                  {scene.elements.map((el) => (
                    <div
                      key={el.id}
                      className={`h-1 flex-1 rounded-full ${
                        el.type === 'screenshot'
                          ? 'bg-blue-400/60'
                          : el.type === 'text'
                          ? 'bg-emerald-400/60'
                          : 'bg-violet-400/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add scene button */}
          <button
            onClick={addScene}
            className="flex h-[80px] w-[80px] flex-shrink-0 items-center justify-center rounded-lg border border-dashed transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Audio indicator */}
        {project.audioSrc && (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-blue-50 px-2 py-1">
            <Music className="h-3 w-3 flex-shrink-0 text-blue-600" />
            <span className="text-[10px] text-muted-foreground truncate flex-1">
              {project.audioFileName ?? 'Background Music'}
            </span>
            <div className="h-1 w-24 rounded-full bg-blue-200">
              <div className="h-full rounded-full bg-blue-500" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
