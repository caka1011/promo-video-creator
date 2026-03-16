'use client';

import { AbsoluteFill, Img } from 'remotion';
import { useAnimationStyle, AnimatedText } from './AnimatedElement';
import { DEVICE_FRAMES } from '@/lib/device-frames';
import type { Scene as SceneType, SceneElement, DeviceType } from '@/types/editor';

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
  const perspX = element.perspectiveX ?? 0;
  const perspY = element.perspectiveY ?? 0;
  const has3D = perspX !== 0 || perspY !== 0;

  const deviceType = element.deviceType as Exclude<DeviceType, 'none'>;
  const frameInfo = DEVICE_FRAMES[deviceType] ?? DEVICE_FRAMES['iphone-15-pro'];
  const scaleX = element.width / frameInfo.width;
  const scaleY = element.height / frameInfo.height;

  const isIPad = deviceType === 'ipad-pro';
  const isPixel = deviceType === 'pixel-8';
  const isProModel = deviceType === 'iphone-15-pro';

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        perspective: has3D ? 1000 : undefined,
        transformStyle: has3D ? 'preserve-3d' as const : undefined,
        ...animStyle,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `rotate(${element.rotation}deg) rotateX(${perspX}deg) rotateY(${perspY}deg)`,
          transformStyle: has3D ? 'preserve-3d' as const : undefined,
        }}
      >
        {/* Device body */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: element.color || frameInfo.bezelGradient.end,
            borderRadius: frameInfo.borderRadius * scaleX,
            border: isProModel
              ? '2px solid rgba(180,180,200,0.2)'
              : '1.5px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 8px 32px ${frameInfo.frameShadow}, inset 0 1px 0 ${frameInfo.frameHighlight}`,
          }}
        >
          {/* Top bezel highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              borderRadius: `${frameInfo.borderRadius * scaleX}px ${frameInfo.borderRadius * scaleX}px 0 0`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Screen */}
          <div
            style={{
              position: 'absolute',
              left: frameInfo.screenX * scaleX,
              top: frameInfo.screenY * scaleY,
              width: frameInfo.screenWidth * scaleX,
              height: frameInfo.screenHeight * scaleY,
              backgroundColor: '#000',
              borderRadius: frameInfo.screenRadius * scaleX,
              overflow: 'hidden',
            }}
          >
            {element.screenshotSrc && (
              <Img
                src={element.screenshotSrc}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            {/* Screen reflection */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Dynamic island (iPhone 15 Pro / iPhone 15) */}
          {frameInfo.hasDynamicIsland && frameInfo.dynamicIsland && (
            <div
              style={{
                position: 'absolute',
                top: frameInfo.dynamicIsland.y * scaleY,
                left: '50%',
                transform: 'translateX(-50%)',
                width: frameInfo.dynamicIsland.width * scaleX,
                height: frameInfo.dynamicIsland.height * scaleY,
                backgroundColor: '#111',
                borderRadius: frameInfo.dynamicIsland.radius * scaleX,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 8 * scaleX,
                zIndex: 2,
              }}
            >
              {/* Camera lens */}
              <div
                style={{
                  width: 8 * scaleX,
                  height: 8 * scaleX,
                  borderRadius: '50%',
                  backgroundColor: '#1a1a2e',
                  border: '0.5px solid #333',
                }}
              />
            </div>
          )}

          {/* Pixel hole-punch camera */}
          {isPixel && frameInfo.dynamicIsland && (
            <div
              style={{
                position: 'absolute',
                top: frameInfo.dynamicIsland.y * scaleY - (frameInfo.dynamicIsland.width * scaleX / 2),
                left: '50%',
                transform: 'translateX(-50%)',
                width: frameInfo.dynamicIsland.width * scaleX,
                height: frameInfo.dynamicIsland.width * scaleX,
                borderRadius: '50%',
                backgroundColor: '#111',
                border: '0.5px solid #222',
                zIndex: 2,
              }}
            />
          )}

          {/* iPad front camera */}
          {isIPad && frameInfo.dynamicIsland && (
            <div
              style={{
                position: 'absolute',
                top: frameInfo.dynamicIsland.y * scaleY - (frameInfo.dynamicIsland.width * scaleX / 2),
                left: '50%',
                transform: 'translateX(-50%)',
                width: frameInfo.dynamicIsland.width * scaleX,
                height: frameInfo.dynamicIsland.width * scaleX,
                borderRadius: '50%',
                backgroundColor: '#1a1a2e',
                border: '0.5px solid #333',
                zIndex: 2,
              }}
            />
          )}

          {/* Home indicator */}
          {frameInfo.homeIndicator && (
            <div
              style={{
                position: 'absolute',
                bottom: frameInfo.homeIndicator.bottomOffset * scaleY,
                left: '50%',
                transform: 'translateX(-50%)',
                width: frameInfo.homeIndicator.width * scaleX,
                height: frameInfo.homeIndicator.height * scaleY,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: frameInfo.homeIndicator.radius * scaleX,
                zIndex: 2,
              }}
            />
          )}

          {/* Side buttons */}
          {frameInfo.sideButtons.map((btn, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: btn.side === 'left' ? -2 * scaleX : undefined,
                right: btn.side === 'right' ? -2 * scaleX : undefined,
                top: btn.y * scaleY,
                width: btn.width * scaleX,
                height: btn.height * scaleY,
                backgroundColor: frameInfo.bezelGradient.start,
                borderRadius: 1.5,
              }}
            />
          ))}
        </div>
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
