'use client';

import React, { useMemo, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import * as THREE from 'three';
import { RoundedBox } from './RoundedBox';

const PHONE_WIDTH = 3.2;
const PHONE_HEIGHT = 6.5;
const PHONE_DEPTH = 0.25;
const PHONE_RADIUS = 0.5;
const PHONE_CURVE_SEGMENTS = 16;

// Screen inset from edges
const SCREEN_INSET = 0.18;
const SCREEN_WIDTH = PHONE_WIDTH - SCREEN_INSET * 2;
const SCREEN_HEIGHT = PHONE_HEIGHT - SCREEN_INSET * 2;

interface Phone3DProps {
  readonly screenshotSrc?: string;
  readonly color?: string;
  readonly rotateX?: number; // degrees
  readonly rotateY?: number; // degrees
  readonly positionX?: number;
  readonly positionY?: number;
  readonly positionZ?: number;
  readonly entranceDelay?: number; // frames
  readonly entranceDuration?: number; // frames
  readonly entranceType?: 'slide-up' | 'zoom-in' | 'slide-up-zoom' | 'none';
}

export const Phone3D: React.FC<Phone3DProps> = ({
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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meshRef = useRef<THREE.Group>(null);

  // Load screenshot texture
  const texture = useMemo(() => {
    if (!screenshotSrc) return null;
    const loader = new THREE.TextureLoader();
    try {
      const tex = loader.load(screenshotSrc);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    } catch {
      return null;
    }
  }, [screenshotSrc]);

  // Entrance animation
  const entranceProgress = useMemo(() => {
    if (entranceType === 'none') return 1;
    return spring({
      frame: frame - entranceDelay,
      fps,
      config: { damping: 12, stiffness: 150, mass: 0.8 },
    });
  }, [frame, entranceDelay, fps, entranceType]);

  let animY = positionY;
  let animScale = 1;
  let animOpacity = 1;

  if (entranceType !== 'none') {
    animOpacity = interpolate(frame, [entranceDelay, entranceDelay + 4], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    switch (entranceType) {
      case 'slide-up':
        animY = positionY + interpolate(entranceProgress, [0, 1], [-4, 0]);
        break;
      case 'zoom-in':
        animScale = interpolate(entranceProgress, [0, 1], [0.1, 1]);
        break;
      case 'slide-up-zoom':
        animY = positionY + interpolate(entranceProgress, [0, 1], [-3, 0]);
        animScale = interpolate(entranceProgress, [0, 1], [0.7, 1]);
        break;
    }
  }

  // Convert degrees to radians for 3D rotation
  const rotX = (rotateX * Math.PI) / 180;
  const rotY = (rotateY * Math.PI) / 180;

  // Phone body color
  const bodyColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group
      ref={meshRef}
      position={[positionX, animY, positionZ]}
      rotation={[rotX, rotY, 0]}
      scale={[animScale, animScale, animScale]}
    >
      {/* Phone body */}
      <RoundedBox
        width={PHONE_WIDTH}
        height={PHONE_HEIGHT}
        depth={PHONE_DEPTH}
        radius={PHONE_RADIUS}
        curveSegments={PHONE_CURVE_SEGMENTS}
        position={[-PHONE_WIDTH / 2, -PHONE_HEIGHT / 2, -PHONE_DEPTH / 2]}
      >
        <meshPhongMaterial
          color={bodyColor}
          shininess={80}
          specular={new THREE.Color('#444444')}
          transparent
          opacity={animOpacity}
        />
      </RoundedBox>

      {/* Screen bezel (dark inset) */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 - 0.01]}>
        <planeGeometry args={[SCREEN_WIDTH + 0.04, SCREEN_HEIGHT + 0.04]} />
        <meshBasicMaterial color="#000000" transparent opacity={animOpacity} />
      </mesh>

      {/* Screen with screenshot */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 + 0.001]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        {texture ? (
          <meshBasicMaterial map={texture} transparent opacity={animOpacity} />
        ) : (
          <meshBasicMaterial color="#111111" transparent opacity={animOpacity} />
        )}
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, PHONE_HEIGHT / 2 - 0.55, PHONE_DEPTH / 2 + 0.002]}>
        <planeGeometry args={[0.9, 0.22]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={animOpacity}
        />
      </mesh>

      {/* Screen edge highlight (subtle) */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 + 0.002]}>
        <ringGeometry args={[
          Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 2 - 0.01,
          Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 2,
          32,
        ]} />
        <meshBasicMaterial
          color="#333333"
          transparent
          opacity={animOpacity * 0.3}
        />
      </mesh>

      {/* Side button (right) */}
      <mesh position={[PHONE_WIDTH / 2 + 0.02, 0.8, 0]}>
        <boxGeometry args={[0.04, 0.5, 0.12]} />
        <meshPhongMaterial
          color={bodyColor}
          shininess={60}
          transparent
          opacity={animOpacity}
        />
      </mesh>

      {/* Volume buttons (left) */}
      <mesh position={[-PHONE_WIDTH / 2 - 0.02, 1.0, 0]}>
        <boxGeometry args={[0.04, 0.35, 0.12]} />
        <meshPhongMaterial
          color={bodyColor}
          shininess={60}
          transparent
          opacity={animOpacity}
        />
      </mesh>
      <mesh position={[-PHONE_WIDTH / 2 - 0.02, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.35, 0.12]} />
        <meshPhongMaterial
          color={bodyColor}
          shininess={60}
          transparent
          opacity={animOpacity}
        />
      </mesh>
    </group>
  );
};
