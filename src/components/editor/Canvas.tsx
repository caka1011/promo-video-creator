'use client';

import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer, Group, Circle } from 'react-konva';
import { useEditorStore } from '@/stores/editor-store';
import { DEVICE_FRAMES } from '@/lib/device-frames';
import { computeAnimatedProps, getSceneAtFrame } from '@/lib/canvas-animations';
import type { SceneElement, DeviceType } from '@/types/editor';
import Konva from 'konva';

function useImage(src: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) { setImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);
  return image;
}

function useAnimatedElement(element: SceneElement, isPlaying: boolean, localFrame: number) {
  return useMemo(() => {
    if (!isPlaying) {
      return { opacity: element.opacity, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 };
    }
    const anim = computeAnimatedProps(element.animation, localFrame);
    return {
      opacity: element.opacity * anim.opacity,
      offsetX: anim.offsetX,
      offsetY: anim.offsetY,
      scaleX: anim.scaleX,
      scaleY: anim.scaleY,
      rotation: anim.rotation,
    };
  }, [element.animation, element.opacity, isPlaying, localFrame]);
}

function ScreenshotNode({ element, isSelected, onSelect, isPlaying, localFrame }: {
  element: SceneElement & { type: 'screenshot' };
  isSelected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  localFrame: number;
}) {
  const image = useImage(element.src);
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const anim = useAnimatedElement(element, isPlaying, localFrame);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!image) return null;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={element.x + anim.offsetX}
        y={element.y + anim.offsetY}
        width={element.width}
        height={element.height}
        rotation={element.rotation + anim.rotation}
        opacity={anim.opacity}
        scaleX={anim.scaleX}
        scaleY={anim.scaleY}
        draggable={!element.locked && !isPlaying}
        onClick={onSelect}
        onTap={onSelect}
        cornerRadius={element.borderRadius}
        onDragEnd={(e) => {
          updateElement(element.id, { x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          updateElement(element.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * scaleX),
            height: Math.max(20, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && !isPlaying && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

function TextNode({ element, isSelected, onSelect, isPlaying, localFrame }: {
  element: SceneElement & { type: 'text' };
  isSelected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  localFrame: number;
}) {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const anim = useAnimatedElement(element, isPlaying, localFrame);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // For typewriter animation during playback, show partial text
  let displayText = element.content;
  if (isPlaying && element.animation.type === 'typewriter') {
    const startFrame = element.animation.delay;
    const endFrame = element.animation.delay + element.animation.duration;
    const progress = Math.min(1, Math.max(0, (localFrame - startFrame) / Math.max(1, endFrame - startFrame)));
    const chars = Math.floor(progress * element.content.length);
    displayText = element.content.slice(0, chars);
  }

  return (
    <>
      <Text
        ref={shapeRef}
        x={element.x + anim.offsetX}
        y={element.y + anim.offsetY}
        width={element.width}
        text={displayText}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fontStyle={element.fontWeight >= 700 ? 'bold' : 'normal'}
        fill={element.color}
        align={element.textAlign}
        lineHeight={element.lineHeight}
        rotation={element.rotation + anim.rotation}
        opacity={anim.opacity}
        scaleX={anim.scaleX}
        scaleY={anim.scaleY}
        draggable={!element.locked && !isPlaying}
        shadowColor={element.shadowColor}
        shadowBlur={element.shadowBlur}
        shadowOffsetX={element.shadowOffsetX}
        shadowOffsetY={element.shadowOffsetY}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          updateElement(element.id, { x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          updateElement(element.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(50, node.width() * scaleX),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && !isPlaying && (
        <Transformer
          ref={trRef}
          enabledAnchors={['middle-left', 'middle-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

function DeviceFrameNode({ element, isSelected, onSelect, isPlaying, localFrame }: {
  element: SceneElement & { type: 'device-frame' };
  isSelected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  localFrame: number;
}) {
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const screenshotImage = useImage(element.screenshotSrc);
  const anim = useAnimatedElement(element, isPlaying, localFrame);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const deviceType = element.deviceType as Exclude<DeviceType, 'none'>;
  const frameInfo = DEVICE_FRAMES[deviceType] ?? DEVICE_FRAMES['iphone-15-pro'];

  // Scale factor: element size vs frame info base size
  const scaleFactorX = element.width / frameInfo.width;
  const scaleFactorY = element.height / frameInfo.height;

  const isIPad = deviceType === 'ipad-pro';
  const isPixel = deviceType === 'pixel-8';

  return (
    <>
      <Group
        ref={shapeRef}
        x={element.x + anim.offsetX}
        y={element.y + anim.offsetY}
        width={element.width}
        height={element.height}
        rotation={element.rotation + anim.rotation}
        opacity={anim.opacity}
        scaleX={anim.scaleX * (isPlaying ? 1 : 1)}
        scaleY={anim.scaleY * (isPlaying ? 1 : 1)}
        skewX={((element.perspectiveY ?? 0)) * 0.3}
        skewY={((element.perspectiveX ?? 0)) * -0.15}
        draggable={!element.locked && !isPlaying}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          updateElement(element.id, { x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const sx = node.scaleX();
          const sy = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          updateElement(element.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(100, element.width * sx),
            height: Math.max(100, element.height * sy),
            rotation: node.rotation(),
          });
        }}
      >
        {/* Drop shadow */}
        <Rect
          x={6}
          y={8}
          width={element.width}
          height={element.height}
          fill="transparent"
          cornerRadius={frameInfo.borderRadius * scaleFactorX}
          shadowColor="rgba(0,0,0,0.5)"
          shadowBlur={20}
          shadowOffsetX={0}
          shadowOffsetY={4}
        />

        {/* Device body - main frame */}
        <Rect
          width={element.width}
          height={element.height}
          fill={element.color || frameInfo.bezelGradient.end}
          cornerRadius={frameInfo.borderRadius * scaleFactorX}
          stroke={frameInfo.frameHighlight}
          strokeWidth={1.5}
        />

        {/* Inner bezel highlight (top edge light reflection) */}
        <Rect
          x={1}
          y={1}
          width={element.width - 2}
          height={element.height * 0.5}
          fill="transparent"
          cornerRadius={[
            frameInfo.borderRadius * scaleFactorX - 1,
            frameInfo.borderRadius * scaleFactorX - 1,
            0,
            0,
          ]}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />

        {/* Side buttons */}
        {frameInfo.sideButtons.map((btn, i) => (
          <Rect
            key={i}
            x={btn.x * scaleFactorX}
            y={btn.y * scaleFactorY}
            width={btn.width * scaleFactorX}
            height={btn.height * scaleFactorY}
            fill={frameInfo.bezelGradient.start}
            cornerRadius={1.5}
          />
        ))}

        {/* Screen area - black background */}
        <Rect
          x={frameInfo.screenX * scaleFactorX}
          y={frameInfo.screenY * scaleFactorY}
          width={frameInfo.screenWidth * scaleFactorX}
          height={frameInfo.screenHeight * scaleFactorY}
          fill="#000"
          cornerRadius={frameInfo.screenRadius * scaleFactorX}
        />

        {/* Screenshot inside device */}
        {screenshotImage && (
          <KonvaImage
            image={screenshotImage}
            x={frameInfo.screenX * scaleFactorX}
            y={frameInfo.screenY * scaleFactorY}
            width={frameInfo.screenWidth * scaleFactorX}
            height={frameInfo.screenHeight * scaleFactorY}
            cornerRadius={frameInfo.screenRadius * scaleFactorX}
          />
        )}

        {/* Screen reflection overlay */}
        <Rect
          x={frameInfo.screenX * scaleFactorX}
          y={frameInfo.screenY * scaleFactorY}
          width={frameInfo.screenWidth * scaleFactorX}
          height={frameInfo.screenHeight * scaleFactorY * 0.4}
          cornerRadius={[
            frameInfo.screenRadius * scaleFactorX,
            frameInfo.screenRadius * scaleFactorX,
            0,
            0,
          ]}
          fill="rgba(255,255,255,0.03)"
        />

        {/* Dynamic island (iPhone 15 Pro / iPhone 15) */}
        {frameInfo.hasDynamicIsland && frameInfo.dynamicIsland && (
          <>
            <Rect
              x={(element.width / 2) - (frameInfo.dynamicIsland.width * scaleFactorX / 2)}
              y={frameInfo.dynamicIsland.y * scaleFactorY}
              width={frameInfo.dynamicIsland.width * scaleFactorX}
              height={frameInfo.dynamicIsland.height * scaleFactorY}
              fill="#111"
              cornerRadius={frameInfo.dynamicIsland.radius * scaleFactorX}
            />
            {/* Camera lens dot inside dynamic island */}
            <Circle
              x={(element.width / 2) + (frameInfo.dynamicIsland.width * scaleFactorX * 0.25)}
              y={(frameInfo.dynamicIsland.y + frameInfo.dynamicIsland.height / 2) * scaleFactorY}
              radius={4 * scaleFactorX}
              fill="#1a1a2e"
              stroke="#333"
              strokeWidth={0.5}
            />
          </>
        )}

        {/* Pixel camera cutout (hole punch) */}
        {isPixel && frameInfo.dynamicIsland && (
          <Circle
            x={element.width / 2}
            y={frameInfo.dynamicIsland.y * scaleFactorY}
            radius={frameInfo.dynamicIsland.width * scaleFactorX / 2}
            fill="#111"
            stroke="#222"
            strokeWidth={0.5}
          />
        )}

        {/* iPad front camera dot */}
        {isIPad && frameInfo.dynamicIsland && (
          <Circle
            x={element.width / 2}
            y={frameInfo.dynamicIsland.y * scaleFactorY}
            radius={frameInfo.dynamicIsland.width * scaleFactorX / 2}
            fill="#1a1a2e"
            stroke="#333"
            strokeWidth={0.5}
          />
        )}

        {/* Home indicator bar */}
        {frameInfo.homeIndicator && (
          <Rect
            x={(element.width / 2) - (frameInfo.homeIndicator.width * scaleFactorX / 2)}
            y={element.height - (frameInfo.homeIndicator.bottomOffset + frameInfo.homeIndicator.height) * scaleFactorY}
            width={frameInfo.homeIndicator.width * scaleFactorX}
            height={frameInfo.homeIndicator.height * scaleFactorY}
            fill="rgba(255,255,255,0.3)"
            cornerRadius={frameInfo.homeIndicator.radius * scaleFactorX}
          />
        )}

        {/* Titanium-like frame edge for Pro models */}
        {deviceType === 'iphone-15-pro' && (
          <Rect
            width={element.width}
            height={element.height}
            fill="transparent"
            cornerRadius={frameInfo.borderRadius * scaleFactorX}
            stroke="rgba(180,180,200,0.15)"
            strokeWidth={2}
          />
        )}
      </Group>

      {isSelected && !isPlaying && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 100 || newBox.height < 100) return oldBox;
            return newBox;
          }}
        />
      )}
      {((element.perspectiveX ?? 0) !== 0 || (element.perspectiveY ?? 0) !== 0) && (
        <Text
          x={element.x}
          y={element.y - 18}
          text={`3D: ${element.perspectiveX ?? 0}\u00B0, ${element.perspectiveY ?? 0}\u00B0`}
          fontSize={10}
          fill="#8b5cf6"
          opacity={0.7}
        />
      )}
    </>
  );
}

function ElementRenderer({ element, isSelected, onSelect, isPlaying, localFrame }: {
  element: SceneElement;
  isSelected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  localFrame: number;
}) {
  if (!element.visible) return null;

  switch (element.type) {
    case 'screenshot':
      return <ScreenshotNode element={element} isSelected={isSelected} onSelect={onSelect} isPlaying={isPlaying} localFrame={localFrame} />;
    case 'text':
      return <TextNode element={element} isSelected={isSelected} onSelect={onSelect} isPlaying={isPlaying} localFrame={localFrame} />;
    case 'device-frame':
      return <DeviceFrameNode element={element} isSelected={isSelected} onSelect={onSelect} isPlaying={isPlaying} localFrame={localFrame} />;
  }
}

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const project = useEditorStore((s) => s.project);
  const activeScene = useEditorStore((s) => s.getActiveScene());
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const setActiveScene = useEditorStore((s) => s.setActiveScene);

  const canvasWidth = project?.settings.resolution.width ?? 1920;
  const canvasHeight = project?.settings.resolution.height ?? 1080;

  // During playback, determine which scene should be active and the local frame
  const playbackInfo = useMemo(() => {
    if (!isPlaying || !project) return null;
    return getSceneAtFrame(project.scenes, currentFrame);
  }, [isPlaying, project, currentFrame]);

  // Auto-switch active scene during playback
  useEffect(() => {
    if (playbackInfo && playbackInfo.sceneId !== useEditorStore.getState().activeSceneId) {
      setActiveScene(playbackInfo.sceneId);
    }
  }, [playbackInfo, setActiveScene]);

  const localFrame = playbackInfo?.localFrame ?? 0;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const delta = e.evt.deltaY > 0 ? -0.05 : 0.05;
      setZoom(zoom + delta);
    },
    [zoom, setZoom]
  );

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) {
      selectElement(null);
    }
  };

  const offsetX = (stageSize.width - canvasWidth * zoom) / 2;
  const offsetY = (stageSize.height - canvasHeight * zoom) / 2;

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer x={offsetX} y={offsetY} scaleX={zoom} scaleY={zoom}>
          {/* Checkerboard background */}
          <Rect
            x={-2}
            y={-2}
            width={canvasWidth + 4}
            height={canvasHeight + 4}
            fill="#1a1a2e"
            cornerRadius={4}
            shadowColor="rgba(0,0,0,0.5)"
            shadowBlur={20}
            shadowOffsetY={4}
          />
          {/* Scene background */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={activeScene?.background ?? '#0f0f1a'}
          />

          {/* Elements */}
          {activeScene?.elements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              onSelect={() => selectElement(element.id)}
              isPlaying={isPlaying}
              localFrame={localFrame}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
