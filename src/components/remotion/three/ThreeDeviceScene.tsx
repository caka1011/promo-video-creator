'use client';

import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';
import { Phone3D } from './Phone3D';

interface ThreeDeviceSceneProps {
  readonly screenshotSrc?: string;
  readonly color?: string;
  readonly rotateX?: number;
  readonly rotateY?: number;
  readonly positionX?: number;
  readonly positionY?: number;
  readonly positionZ?: number;
  readonly entranceDelay?: number;
  readonly entranceDuration?: number;
  readonly entranceType?: 'slide-up' | 'zoom-in' | 'slide-up-zoom' | 'none';
  readonly cameraFov?: number;
  readonly cameraZ?: number;
}

export const ThreeDeviceScene: React.FC<ThreeDeviceSceneProps> = ({
  screenshotSrc,
  color = '#1a1a2e',
  rotateX = 0,
  rotateY = 0,
  positionX = 0,
  positionY = 0,
  positionZ = 0,
  entranceDelay = 0,
  entranceDuration = 20,
  entranceType = 'slide-up-zoom',
  cameraFov = 50,
  cameraZ = 10,
}) => {
  const { width, height } = useVideoConfig();

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
        fov: cameraFov,
        position: [0, 0, cameraZ],
        near: 0.1,
        far: 100,
      }}
    >
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.6} />

      {/* Main key light from upper-right */}
      <pointLight position={[8, 8, 8]} intensity={1.2} color="#ffffff" />

      {/* Fill light from left */}
      <pointLight position={[-6, 3, 6]} intensity={0.5} color="#e0e0ff" />

      {/* Rim light from behind */}
      <pointLight position={[0, -3, -5]} intensity={0.3} color="#ffffff" />

      <Phone3D
        screenshotSrc={screenshotSrc}
        color={color}
        rotateX={rotateX}
        rotateY={rotateY}
        positionX={positionX}
        positionY={positionY}
        positionZ={positionZ}
        entranceDelay={entranceDelay}
        entranceDuration={entranceDuration}
        entranceType={entranceType}
      />
    </ThreeCanvas>
  );
};
