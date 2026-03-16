'use client';

import React, { useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';
import { Phone3D } from './Phone3D';
import type { DeviceFrameElement, Animation } from '@/types/editor';

interface DeviceEntry {
  element: DeviceFrameElement;
  sceneStartFrame: number;
}

interface ThreeDeviceLayerProps {
  readonly devices: DeviceEntry[];
}

/**
 * Convert pixel coordinates on a 1920x1080 canvas to Three.js world coordinates
 * given camera FOV and distance.
 */
function pixelTo3D(
  pixelX: number,
  pixelY: number,
  canvasWidth: number,
  canvasHeight: number,
  cameraFov: number,
  cameraZ: number,
) {
  const halfFovRad = (cameraFov / 2) * (Math.PI / 180);
  const halfHeight = Math.tan(halfFovRad) * cameraZ;
  const halfWidth = halfHeight * (canvasWidth / canvasHeight);

  const x3d = ((pixelX - canvasWidth / 2) / (canvasWidth / 2)) * halfWidth;
  const y3d = -((pixelY - canvasHeight / 2) / (canvasHeight / 2)) * halfHeight;

  return { x: x3d, y: y3d };
}

/**
 * Map animation type to 3D entrance type
 */
function getEntranceType(animType: Animation['type']): 'slide-up' | 'zoom-in' | 'slide-up-zoom' | 'none' {
  switch (animType) {
    case 'slide-up':
    case 'slide-down':
      return 'slide-up';
    case 'zoom-in':
    case 'bounce':
    case 'scale-pop':
      return 'zoom-in';
    case 'slide-up-zoom':
      return 'slide-up-zoom';
    case 'none':
      return 'none';
    default:
      return 'slide-up-zoom';
  }
}

const CAMERA_FOV = 50;
const CAMERA_Z = 10;
const PHONE_MODEL_WIDTH = 3.2;

export const ThreeDeviceLayer: React.FC<ThreeDeviceLayerProps> = ({ devices }) => {
  const { width, height } = useVideoConfig();

  const phoneConfigs = useMemo(() => {
    const halfFovRad = (CAMERA_FOV / 2) * (Math.PI / 180);
    const visibleHeight = 2 * Math.tan(halfFovRad) * CAMERA_Z;
    const visibleWidth = visibleHeight * (width / height);

    return devices.map(({ element }) => {
      // Center of the device element in pixel space
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;

      const pos = pixelTo3D(centerX, centerY, width, height, CAMERA_FOV, CAMERA_Z);

      // Scale: how big is the device relative to the canvas
      const deviceFractionW = element.width / width;
      const desiredWorldWidth = deviceFractionW * visibleWidth;
      const scaleMultiplier = desiredWorldWidth / PHONE_MODEL_WIDTH;

      return {
        id: element.id,
        positionX: pos.x,
        positionY: pos.y,
        positionZ: 0,
        rotateX: element.perspectiveX ?? 0,
        rotateY: element.perspectiveY ?? 0,
        color: element.color || '#1a1a2e',
        screenshotSrc: element.screenshotSrc,
        entranceDelay: element.animation.delay,
        entranceDuration: element.animation.duration,
        entranceType: getEntranceType(element.animation.type),
        scale: scaleMultiplier,
      };
    });
  }, [devices, width, height]);

  if (devices.length === 0) return null;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      camera={{
        fov: CAMERA_FOV,
        position: [0, 0, CAMERA_Z],
        near: 0.1,
        far: 100,
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[8, 8, 8]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-6, 3, 6]} intensity={0.5} color="#e0e0ff" />
      <pointLight position={[0, -3, -5]} intensity={0.3} color="#ffffff" />

      {phoneConfigs.map((config) => (
        <group key={config.id} scale={[config.scale, config.scale, config.scale]}>
          <Phone3D
            screenshotSrc={config.screenshotSrc}
            color={config.color}
            rotateX={config.rotateX}
            rotateY={config.rotateY}
            positionX={config.positionX / config.scale}
            positionY={config.positionY / config.scale}
            positionZ={config.positionZ}
            entranceDelay={config.entranceDelay}
            entranceDuration={config.entranceDuration}
            entranceType={config.entranceType}
          />
        </group>
      ))}
    </ThreeCanvas>
  );
};
