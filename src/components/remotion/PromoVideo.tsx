'use client';

import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Audio } from 'remotion';
import { SceneComposition } from './Scene';
import type { Project, TransitionType } from '@/types/editor';

function TransitionOverlay({
  type,
  durationInFrames,
}: {
  type: TransitionType;
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();

  if (type === 'none' || durationInFrames === 0) return null;

  const transFrames = Math.min(15, durationInFrames);

  switch (type) {
    case 'fade': {
      const opacity = interpolate(frame, [0, transFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{ backgroundColor: '#000', opacity, zIndex: 100 }}
        />
      );
    }
    case 'slide-left': {
      const x = interpolate(frame, [0, transFrames], [0, -100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            transform: `translateX(${x}%)`,
            zIndex: 100,
          }}
        />
      );
    }
    case 'slide-right': {
      const x = interpolate(frame, [0, transFrames], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            transform: `translateX(${x}%)`,
            zIndex: 100,
          }}
        />
      );
    }
    case 'wipe': {
      const width = interpolate(frame, [0, transFrames], [100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill style={{ zIndex: 100 }}>
          <div
            style={{
              width: `${width}%`,
              height: '100%',
              backgroundColor: '#000',
            }}
          />
        </AbsoluteFill>
      );
    }
    case 'zoom': {
      const scale = interpolate(frame, [0, transFrames], [1, 3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const opacity = interpolate(frame, [0, transFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            transform: `scale(${scale})`,
            opacity,
            zIndex: 100,
          }}
        />
      );
    }
    case 'blur': {
      const blurAmount = interpolate(frame, [0, transFrames / 2, transFrames], [0, 20, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const opacity = interpolate(frame, [0, transFrames / 2, transFrames], [0, 0.5, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(0,0,0,${opacity})`,
            filter: `blur(${blurAmount}px)`,
            zIndex: 100,
          }}
        />
      );
    }
    case 'zoom-blur': {
      const scale = interpolate(frame, [0, transFrames], [1, 3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const blurAmount = interpolate(frame, [0, transFrames], [0, 20], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const opacity = interpolate(frame, [0, transFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            transform: `scale(${scale})`,
            filter: `blur(${blurAmount}px)`,
            opacity,
            zIndex: 100,
          }}
        />
      );
    }
    case 'cross-dissolve': {
      const opacity = interpolate(frame, [0, transFrames], [0.8, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255,255,255,${opacity})`,
            zIndex: 100,
          }}
        />
      );
    }
    default:
      return null;
  }
}

export function PromoVideo({ project }: { project: Project }) {
  let frameOffset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {project.audioSrc && (
        <Audio
          src={project.audioSrc}
          volume={project.audioVolume ?? 1}
        />
      )}
      {project.scenes.map((scene, i) => {
        const start = frameOffset;
        frameOffset += scene.duration;

        return (
          <Sequence key={scene.id} from={start} durationInFrames={scene.duration}>
            <SceneComposition scene={scene} sceneStartFrame={0} />
            {i > 0 && scene.transition !== 'none' && (
              <TransitionOverlay
                type={scene.transition}
                durationInFrames={scene.duration}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
