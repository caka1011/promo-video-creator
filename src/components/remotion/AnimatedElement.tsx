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
  let rotateX = 0;
  let rotateY = 0;
  let blur = 0;

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

    case 'bounce': {
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
    }

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

    // ─── NEW ANIMATIONS ───

    case 'zoom-rotate': {
      // Zoom in + 3D rotation — used for dramatic hook text
      const zrSpring = spring({
        frame: localFrame - startFrame,
        fps,
        config: { damping: 12, stiffness: 150, mass: 0.8 },
      });
      scale = interpolate(zrSpring, [0, 1], [0.1, 1]);
      rotateX = interpolate(zrSpring, [0, 1], [-25, 0]);
      rotateY = interpolate(zrSpring, [0, 1], [15, 0]);
      opacity = interpolate(localFrame, [startFrame, startFrame + 4], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    }

    case 'zoom-blur-in': {
      // Zoom in with blur clearing — used for text interludes
      const zbProgress = isSpring
        ? spring({ frame: localFrame - startFrame, fps, config: { damping: 14, stiffness: 120, mass: 0.6 } })
        : interpolate(localFrame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing,
          });
      scale = interpolate(zbProgress, [0, 1], [0.3, 1]);
      blur = interpolate(zbProgress, [0, 1], [20, 0]);
      opacity = interpolate(localFrame, [startFrame, startFrame + 3], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    }

    case 'slide-up-zoom': {
      // Slide up + zoom in — used for device entrances
      const suzSpring = spring({
        frame: localFrame - startFrame,
        fps,
        config: { damping: 10, stiffness: 180, mass: 0.6 },
      });
      translateY = interpolate(suzSpring, [0, 1], [350, 0]);
      scale = interpolate(suzSpring, [0, 1], [0.7, 1]);
      opacity = interpolate(localFrame, [startFrame, startFrame + 4], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    }

    case 'scale-pop': {
      // Quick scale pop with overshoot — snappier than bounce
      const spSpring = spring({
        frame: localFrame - startFrame,
        fps,
        config: { damping: 6, stiffness: 300, mass: 0.4 },
      });
      scale = interpolate(spSpring, [0, 1], [0, 1]);
      opacity = interpolate(localFrame, [startFrame, startFrame + 2], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    }
  }

  const style: React.CSSProperties = {
    opacity,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
  };

  if (rotateX !== 0 || rotateY !== 0) {
    style.perspective = 1200;
    style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  if (blur > 0) {
    style.filter = `blur(${blur}px)`;
  }

  return style;
}

export function AnimatedText({
  element,
  sceneStartFrame,
}: {
  element: SceneElement & { type: 'text' };
  sceneStartFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const animStyle = useAnimationStyle(element.animation, sceneStartFrame);

  const baseStyle: React.CSSProperties = {
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
  };

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
      <div style={baseStyle}>
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
          ...baseStyle,
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
          const wordSpring = spring({
            frame: localFrame - wordStart,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.5 },
          });
          const wordOpacity = interpolate(localFrame, [wordStart, wordStart + 4], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const wordY = interpolate(wordSpring, [0, 1], [30, 0]);
          const wordScale = interpolate(wordSpring, [0, 1], [0.7, 1]);
          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                transform: `translateY(${wordY}px) scale(${wordScale})`,
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

  if (element.animation.type === 'letter-reveal') {
    const chars = element.content.split('');
    const startFrame = element.animation.delay;
    const framesPerChar = Math.max(1, element.animation.duration / chars.length);

    return (
      <div
        style={{
          ...baseStyle,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent:
            element.textAlign === 'center'
              ? 'center'
              : element.textAlign === 'right'
              ? 'flex-end'
              : 'flex-start',
        }}
      >
        {chars.map((char, i) => {
          const charStart = startFrame + i * framesPerChar;
          const charSpring = spring({
            frame: localFrame - charStart,
            fps,
            config: { damping: 14, stiffness: 250, mass: 0.3 },
          });
          const charOpacity = interpolate(localFrame, [charStart, charStart + 3], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const letterSpacing = interpolate(charSpring, [0, 1], [40, 0]);
          const charY = interpolate(charSpring, [0, 1], [15, 0]);
          return (
            <span
              key={i}
              style={{
                opacity: charOpacity,
                transform: `translateY(${charY}px)`,
                letterSpacing: char === ' ' ? '0.25em' : `${letterSpacing}px`,
                display: 'inline-block',
                minWidth: char === ' ' ? '0.3em' : undefined,
              }}
            >
              {char}
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
        ...baseStyle,
        ...animStyle,
      }}
    >
      {element.content}
    </div>
  );
}
