'use client';

import { AbsoluteFill, Img } from 'remotion';
import { useAnimationStyle, AnimatedText } from './AnimatedElement';
import type { Scene as SceneType, SceneElement } from '@/types/editor';

function ScreenshotRenderer({
  element,
  sceneStartFrame,
}: {
  element: SceneElement & { type: 'screenshot' };
  sceneStartFrame: number;
}) {
  const animStyle = useAnimationStyle(element.animation, sceneStartFrame);

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        ...animStyle,
      }}
    >
      <Img
        src={element.src}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: element.borderRadius,
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

function DeviceFrameRenderer({
  element,
  sceneStartFrame,
}: {
  element: SceneElement & { type: 'device-frame' };
  sceneStartFrame: number;
}) {
  const animStyle = useAnimationStyle(element.animation, sceneStartFrame);

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        ...animStyle,
      }}
    >
      {/* Device body */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: element.color,
          borderRadius: 40,
          border: '2px solid rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 15,
            right: 15,
            bottom: 15,
            backgroundColor: '#000',
            borderRadius: 30,
            overflow: 'hidden',
          }}
        >
          {element.screenshotSrc && (
            <Img
              src={element.screenshotSrc}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        {/* Dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 28,
            backgroundColor: '#111',
            borderRadius: 14,
          }}
        />
      </div>
    </div>
  );
}

function ElementRenderer({
  element,
  sceneStartFrame,
}: {
  element: SceneElement;
  sceneStartFrame: number;
}) {
  if (!element.visible) return null;

  switch (element.type) {
    case 'screenshot':
      return <ScreenshotRenderer element={element} sceneStartFrame={sceneStartFrame} />;
    case 'text':
      return <AnimatedText element={element} sceneStartFrame={sceneStartFrame} />;
    case 'device-frame':
      return <DeviceFrameRenderer element={element} sceneStartFrame={sceneStartFrame} />;
  }
}

export function SceneComposition({
  scene,
  sceneStartFrame,
}: {
  scene: SceneType;
  sceneStartFrame: number;
}) {
  return (
    <AbsoluteFill style={{ backgroundColor: scene.background }}>
      {scene.elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          sceneStartFrame={sceneStartFrame}
        />
      ))}
    </AbsoluteFill>
  );
}
