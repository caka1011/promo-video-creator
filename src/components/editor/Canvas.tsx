'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer, Group } from 'react-konva';
import { useEditorStore } from '@/stores/editor-store';
import type { SceneElement } from '@/types/editor';
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

function ScreenshotNode({ element, isSelected, onSelect }: {
  element: SceneElement & { type: 'screenshot' };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const image = useImage(element.src);
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateElement = useEditorStore((s) => s.updateElement);

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
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable={!element.locked}
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
      {isSelected && (
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

function TextNode({ element, isSelected, onSelect }: {
  element: SceneElement & { type: 'text' };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateElement = useEditorStore((s) => s.updateElement);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        text={element.content}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fontStyle={element.fontWeight >= 700 ? 'bold' : 'normal'}
        fill={element.color}
        align={element.textAlign}
        lineHeight={element.lineHeight}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable={!element.locked}
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
      {isSelected && (
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

function DeviceFrameNode({ element, isSelected, onSelect }: {
  element: SceneElement & { type: 'device-frame' };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const screenshotImage = useImage(element.screenshotSrc);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable={!element.locked}
        onClick={onSelect}
        onTap={onSelect}
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
            width: Math.max(100, element.width * scaleX),
            height: Math.max(100, element.height * scaleY),
            rotation: node.rotation(),
          });
        }}
      >
        {/* Device body */}
        <Rect
          width={element.width}
          height={element.height}
          fill={element.color}
          cornerRadius={40}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={2}
        />
        {/* Screen area */}
        <Rect
          x={15}
          y={15}
          width={element.width - 30}
          height={element.height - 30}
          fill="#000"
          cornerRadius={30}
        />
        {/* Screenshot inside device */}
        {screenshotImage && (
          <KonvaImage
            image={screenshotImage}
            x={15}
            y={15}
            width={element.width - 30}
            height={element.height - 30}
            cornerRadius={30}
          />
        )}
        {/* Notch / dynamic island */}
        <Rect
          x={element.width / 2 - 50}
          y={22}
          width={100}
          height={28}
          fill="#111"
          cornerRadius={14}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 100 || newBox.height < 100) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

function ElementRenderer({ element, isSelected, onSelect }: {
  element: SceneElement;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (!element.visible) return null;

  switch (element.type) {
    case 'screenshot':
      return <ScreenshotNode element={element} isSelected={isSelected} onSelect={onSelect} />;
    case 'text':
      return <TextNode element={element} isSelected={isSelected} onSelect={onSelect} />;
    case 'device-frame':
      return <DeviceFrameNode element={element} isSelected={isSelected} onSelect={onSelect} />;
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

  const canvasWidth = project?.settings.resolution.width ?? 1920;
  const canvasHeight = project?.settings.resolution.height ?? 1080;

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
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
