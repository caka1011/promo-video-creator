'use client';

import { useCallback } from 'react';
import { Player } from '@remotion/player';
import { PromoVideo } from '@/components/remotion/PromoVideo';
import { useEditorStore } from '@/stores/editor-store';

export function PreviewPlayer({ width, height }: { width?: number; height?: number }) {
  const project = useEditorStore((s) => s.project);

  const getTotalFrames = useEditorStore((s) => s.getTotalFrames);
  const totalFrames = getTotalFrames();

  if (!project || totalFrames === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground text-sm">
        No scenes to preview
      </div>
    );
  }

  const compositionWidth = project.settings.resolution.width;
  const compositionHeight = project.settings.resolution.height;

  return (
    <Player
      component={PromoVideo}
      inputProps={{ project }}
      durationInFrames={Math.max(1, totalFrames)}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      fps={project.settings.fps}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
      }}
      controls
      autoPlay={false}
      loop
    />
  );
}
