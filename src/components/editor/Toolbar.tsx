'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Image,
  Type,
  Smartphone,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Eye,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditorStore } from '@/stores/editor-store';
import { v4 as uuidv4 } from 'uuid';
import type { ScreenshotElement, TextElement, DeviceFrameElement } from '@/types/editor';
import { ExportDialog } from './ExportDialog';

function ToolbarButton({
  tooltip,
  onClick,
  children,
  variant = 'ghost',
}: {
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'ghost' | 'default';
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant={variant} size="icon" className="h-8 w-8" />}
        onClick={onClick}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function Toolbar() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const project = useEditorStore((s) => s.project);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const resetView = useEditorStore((s) => s.resetView);
  const addElement = useEditorStore((s) => s.addElement);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const previewMode = useEditorStore((s) => s.previewMode);
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode);
  const saveProject = useEditorStore((s) => s.saveProject);

  const handleAddScreenshot = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxW = 400;
        const scale = maxW / img.width;
        const element: ScreenshotElement = {
          id: uuidv4(),
          type: 'screenshot',
          name: file.name.replace(/\.[^.]+$/, ''),
          x: 200,
          y: 100,
          width: img.width * scale,
          height: img.height * scale,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          src: reader.result as string,
          borderRadius: 0,
          animation: { type: 'none', duration: 30, delay: 0, easing: 'ease-out' },
        };
        addElement(element);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddText = () => {
    const element: TextElement = {
      id: uuidv4(),
      type: 'text',
      name: 'Text',
      x: 300,
      y: 200,
      width: 400,
      height: 60,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      content: 'Your text here',
      fontFamily: 'Inter, sans-serif',
      fontSize: 36,
      fontWeight: 700,
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
      shadowColor: 'transparent',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      animation: { type: 'none', duration: 30, delay: 0, easing: 'ease-out' },
    };
    addElement(element);
  };

  const handleAddDevice = () => {
    const element: DeviceFrameElement = {
      id: uuidv4(),
      type: 'device-frame',
      name: 'iPhone 15 Pro',
      x: 300,
      y: 50,
      width: 320,
      height: 650,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      deviceType: 'iphone-15-pro',
      color: '#1a1a2e',
      screenshotSrc: '',
      animation: { type: 'none', duration: 30, delay: 0, easing: 'ease-out' },
    };
    addElement(element);
  };

  return (
    <div className="glass flex h-12 items-center gap-1 border-b border-border px-2">
      <ToolbarButton tooltip="Back to Dashboard" onClick={() => router.push('/')}>
        <ArrowLeft className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-2 text-sm font-medium truncate max-w-[150px]">
        {project?.name}
      </span>

      <Separator orientation="vertical" className="h-6" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <ToolbarButton tooltip="Add Screenshot" onClick={handleAddScreenshot}>
        <Image className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Add Text" onClick={handleAddText}>
        <Type className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Add Device Frame" onClick={handleAddDevice}>
        <Smartphone className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6" />

      <ToolbarButton tooltip="Undo" onClick={undo}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Redo" onClick={redo}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6" />

      <ToolbarButton tooltip="Zoom Out" onClick={() => setZoom(zoom - 0.1)}>
        <ZoomOut className="h-4 w-4" />
      </ToolbarButton>

      <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
        {Math.round(zoom * 100)}%
      </span>

      <ToolbarButton tooltip="Zoom In" onClick={() => setZoom(zoom + 0.1)}>
        <ZoomIn className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Reset View" onClick={resetView}>
        <Maximize2 className="h-4 w-4" />
      </ToolbarButton>

      <div className="flex-1" />

      <ToolbarButton tooltip={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6" />

      <ToolbarButton
        tooltip="Preview"
        onClick={() => setPreviewMode(!previewMode)}
        variant={previewMode ? 'default' : 'ghost'}
      >
        <Eye className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Save" onClick={saveProject}>
        <Save className="h-4 w-4" />
      </ToolbarButton>

      <ExportDialog />
    </div>
  );
}
