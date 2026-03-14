'use client';

import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import type { Animation, SceneElement } from '@/types/editor';

function getEasing(easing: Animation['easing']) {
  switch (easing) {
    case 'linear': return Easing.linear;
    case 'ease-in': return Easing.in(Easing.cubic);
    case 'ease-out': return Easing.out(Easing.cubic);
    case 'ease-in-out': return Easing.inOut(Easing.cubic);
    default: return Easing.out(Easing.cubic);
  }
}

export function useAnimationStyle(animation: Animation, sceneStartFrame: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - sceneStartFrame;
  const startFrame = animation.delay;
  const endFrame = animation.delay + animation.duration;
  const isSpring = animation.easing === 'spring';

  if (animation.type === 'none') {
    return {};
  }

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  let rotate = 0;

  const easing = getEasing(animation.easing);

  switch (animation.type) {
    case 'fade-in':
      opacity = isSpring
        ? spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration })
        : interpolate(localFrame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      break;

    case 'fade-out':
      opacity = interpolate(localFrame, [startFrame, endFrame], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      });
      break;

    case 'slide-left':
      translateX = isSpring
        ? interpolate(
            spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration }),
            [0, 1],
            [500, 0]
          )
        : interpolate(localFrame, [startFrame, endFrame], [500, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'slide-right':
      translateX = isSpring
        ? interpolate(
            spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration }),
            [0, 1],
            [-500, 0]
          )
        : interpolate(localFrame, [startFrame, endFrame], [-500, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'slide-up':
      translateY = isSpring
        ? interpolate(
            spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration }),
            [0, 1],
            [400, 0]
          )
        : interpolate(localFrame, [startFrame, endFrame], [400, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'slide-down':
      translateY = isSpring
        ? interpolate(
            spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration }),
            [0, 1],
            [-400, 0]
          )
        : interpolate(localFrame, [startFrame, endFrame], [-400, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'zoom-in':
      scale = isSpring
        ? interpolate(
            spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration }),
            [0, 1],
            [0, 1]
          )
        : interpolate(localFrame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'zoom-out':
      scale = interpolate(localFrame, [startFrame, endFrame], [2, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'bounce':
      const springVal = spring({
        frame: localFrame - startFrame,
        fps,
        config: { damping: 8, stiffness: 200, mass: 0.5 },
      });
      scale = interpolate(springVal, [0, 1], [0, 1]);
      opacity = interpolate(localFrame, [startFrame, startFrame + 3], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;

    case 'rotate-in':
      rotate = isSpring
        ? interpolate(
            spring({ frame: localFrame - startFrame, fps, durationInFrames: animation.duration }),
            [0, 1],
            [-180, 0]
          )
        : interpolate(localFrame, [startFrame, endFrame], [-180, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      scale = interpolate(localFrame, [startFrame, endFrame], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      });
      opacity = interpolate(localFrame, [startFrame, startFrame + 5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
  }

  return {
    opacity,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
  };
}

export function AnimatedText({
  element,
  sceneStartFrame,
}: {
  element: SceneElement & { type: 'text' };
  sceneStartFrame: number;
}) {
  const frame = useCurrentFrame();
  const localFrame = frame - sceneStartFrame;
  const animStyle = useAnimationStyle(element.animation, sceneStartFrame);

  // Special text animations
  if (element.animation.type === 'typewriter') {
    const startFrame = element.animation.delay;
    const endFrame = element.animation.delay + element.animation.duration;
    const progress = interpolate(localFrame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const chars = Math.floor(progress * element.content.length);
    const displayText = element.content.slice(0, chars);

    return (
      <div
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          color: element.color,
          textAlign: element.textAlign,
          lineHeight: element.lineHeight,
          opacity: element.opacity,
          transform: `rotate(${element.rotation}deg)`,
          textShadow:
            element.shadowBlur > 0
              ? `${element.shadowOffsetX}px ${element.shadowOffsetY}px ${element.shadowBlur}px ${element.shadowColor}`
              : undefined,
        }}
      >
        {displayText}
        <span style={{ opacity: Math.round(localFrame / 15) % 2 === 0 ? 1 : 0 }}>|</span>
      </div>
    );
  }

  if (element.animation.type === 'word-reveal') {
    const words = element.content.split(' ');
    const startFrame = element.animation.delay;
    const framesPerWord = element.animation.duration / words.length;

    return (
      <div
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          color: element.color,
          textAlign: element.textAlign,
          lineHeight: element.lineHeight,
          opacity: element.opacity,
          transform: `rotate(${element.rotation}deg)`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25em',
          justifyContent:
            element.textAlign === 'center'
              ? 'center'
              : element.textAlign === 'right'
              ? 'flex-end'
              : 'flex-start',
        }}
      >
        {words.map((word, i) => {
          const wordStart = startFrame + i * framesPerWord;
          const wordOpacity = interpolate(localFrame, [wordStart, wordStart + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const wordY = interpolate(localFrame, [wordStart, wordStart + 8], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  // Default: use CSS-based animations
  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        transform: `rotate(${element.rotation}deg)`,
        textShadow:
          element.shadowBlur > 0
            ? `${element.shadowOffsetX}px ${element.shadowOffsetY}px ${element.shadowBlur}px ${element.shadowColor}`
            : undefined,
        ...animStyle,
      }}
    >
      {element.content}
    </div>
  );
}
