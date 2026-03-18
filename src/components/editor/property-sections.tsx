'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { DEVICE_FRAMES } from '@/lib/device-frames';
import type { DeviceType, SceneElement } from '@/types/editor';

export function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="w-20 flex-shrink-0 text-xs text-muted-foreground">{label}</Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function NumberInput({ value, onChange, min, max, step = 1 }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <Input
      type="number"
      value={Math.round(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="h-7 text-xs"
    />
  );
}

export function PositionProps({ element }: { element: SceneElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const u = (updates: Partial<SceneElement>) => updateElement(element.id, updates);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Transform
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <PropertyRow label="X">
          <NumberInput value={element.x} onChange={(x) => u({ x })} />
        </PropertyRow>
        <PropertyRow label="Y">
          <NumberInput value={element.y} onChange={(y) => u({ y })} />
        </PropertyRow>
        <PropertyRow label="W">
          <NumberInput value={element.width} onChange={(width) => u({ width })} min={10} />
        </PropertyRow>
        <PropertyRow label="H">
          <NumberInput value={element.height} onChange={(height) => u({ height })} min={10} />
        </PropertyRow>
      </div>
      <PropertyRow label="Rotation">
        <NumberInput value={element.rotation} onChange={(rotation) => u({ rotation })} min={0} max={360} />
      </PropertyRow>
      <PropertyRow label="Opacity">
        <Slider
          value={[element.opacity * 100]}
          onValueChange={(v) => u({ opacity: (typeof v === 'number' ? v : v[0]) / 100 })}
          min={0}
          max={100}
          step={1}
          className="flex-1"
        />
      </PropertyRow>
    </div>
  );
}

export function ScreenshotProps({ element }: { element: SceneElement & { type: 'screenshot' } }) {
  const updateElement = useEditorStore((s) => s.updateElement);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Screenshot
      </h4>
      <PropertyRow label="Radius">
        <NumberInput
          value={element.borderRadius}
          onChange={(borderRadius) => updateElement(element.id, { borderRadius })}
          min={0}
          max={100}
        />
      </PropertyRow>
    </div>
  );
}

export function TextProps({ element }: { element: SceneElement & { type: 'text' } }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const u = (updates: Partial<SceneElement>) => updateElement(element.id, updates);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Text
      </h4>
      <PropertyRow label="Content">
        <Input
          value={element.content}
          onChange={(e) => u({ content: e.target.value } as Partial<SceneElement>)}
          className="h-7 text-xs"
        />
      </PropertyRow>
      <PropertyRow label="Size">
        <NumberInput
          value={element.fontSize}
          onChange={(fontSize) => u({ fontSize } as Partial<SceneElement>)}
          min={8}
          max={200}
        />
      </PropertyRow>
      <PropertyRow label="Weight">
        <Select
          value={String(element.fontWeight)}
          onValueChange={(v) => v && u({ fontWeight: Number(v) } as Partial<SceneElement>)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300">Light</SelectItem>
            <SelectItem value="400">Regular</SelectItem>
            <SelectItem value="500">Medium</SelectItem>
            <SelectItem value="600">Semibold</SelectItem>
            <SelectItem value="700">Bold</SelectItem>
            <SelectItem value="900">Black</SelectItem>
          </SelectContent>
        </Select>
      </PropertyRow>
      <PropertyRow label="Color">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => u({ color: e.target.value } as Partial<SceneElement>)}
            className="h-7 w-7 cursor-pointer rounded border border-border bg-transparent"
          />
          <Input
            value={element.color}
            onChange={(e) => u({ color: e.target.value } as Partial<SceneElement>)}
            className="h-7 flex-1 text-xs"
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Align">
        <Select
          value={element.textAlign}
          onValueChange={(v) => v && u({ textAlign: v } as Partial<SceneElement>)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </PropertyRow>
    </div>
  );
}

export const PERSPECTIVE_PRESETS = [
  { name: 'Flat', x: 0, y: 0 },
  { name: 'Left', x: 0, y: -20 },
  { name: 'Right', x: 0, y: 20 },
  { name: 'Tilt Fwd', x: 15, y: 0 },
  { name: 'Tilt Back', x: -15, y: 0 },
  { name: 'Drama L', x: 10, y: -30 },
  { name: 'Drama R', x: 10, y: 30 },
];

export function DeviceFrameProps({ element }: { element: SceneElement & { type: 'device-frame' } }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);
      videoEl.src = objectUrl;
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        if (videoEl.duration > 30) {
          alert('Video must be 30 seconds or less');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          updateElement(element.id, {
            screenshotSrc: reader.result as string,
            screenshotMediaType: 'video',
          } as Partial<SceneElement>);
        };
        reader.readAsDataURL(file);
      };
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        updateElement(element.id, {
          screenshotSrc: reader.result as string,
          screenshotMediaType: 'image',
        } as Partial<SceneElement>);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Device Frame
      </h4>
      <PropertyRow label="Device">
        <Select
          value={element.deviceType}
          onValueChange={(v) => {
            if (!v) return;
            const deviceType = v as DeviceType;
            const frame = DEVICE_FRAMES[deviceType as Exclude<DeviceType, 'none'>];
            if (frame) {
              updateElement(element.id, {
                deviceType,
                width: frame.width,
                height: frame.height,
              } as Partial<SceneElement>);
            } else {
              updateElement(element.id, { deviceType } as Partial<SceneElement>);
            }
          }}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iphone-15-pro">iPhone 15 Pro</SelectItem>
            <SelectItem value="iphone-15">iPhone 15</SelectItem>
            <SelectItem value="pixel-8">Pixel 8</SelectItem>
            <SelectItem value="ipad-pro">iPad Pro</SelectItem>
          </SelectContent>
        </Select>
      </PropertyRow>
      <PropertyRow label="Color">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) =>
              updateElement(element.id, { color: e.target.value } as Partial<SceneElement>)
            }
            className="h-7 w-7 cursor-pointer rounded border border-border bg-transparent"
          />
          <Input
            value={element.color}
            onChange={(e) =>
              updateElement(element.id, { color: e.target.value } as Partial<SceneElement>)
            }
            className="h-7 flex-1 text-xs"
          />
        </div>
      </PropertyRow>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-3">
        3D Perspective
      </h4>
      <PropertyRow label="Rotate X">
        <div className="flex items-center gap-2">
          <Slider
            value={[element.perspectiveX ?? 0]}
            onValueChange={(v) =>
              updateElement(element.id, { perspectiveX: typeof v === 'number' ? v : v[0] } as Partial<SceneElement>)
            }
            min={-45}
            max={45}
            step={1}
            className="flex-1"
          />
          <span className="w-8 text-right text-[10px] text-muted-foreground">{element.perspectiveX ?? 0}&deg;</span>
        </div>
      </PropertyRow>
      <PropertyRow label="Rotate Y">
        <div className="flex items-center gap-2">
          <Slider
            value={[element.perspectiveY ?? 0]}
            onValueChange={(v) =>
              updateElement(element.id, { perspectiveY: typeof v === 'number' ? v : v[0] } as Partial<SceneElement>)
            }
            min={-45}
            max={45}
            step={1}
            className="flex-1"
          />
          <span className="w-8 text-right text-[10px] text-muted-foreground">{element.perspectiveY ?? 0}&deg;</span>
        </div>
      </PropertyRow>
      <div className="flex flex-wrap gap-1">
        {PERSPECTIVE_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2"
            onClick={() =>
              updateElement(element.id, {
                perspectiveX: preset.x,
                perspectiveY: preset.y,
              } as Partial<SceneElement>)
            }
          >
            {preset.name}
          </Button>
        ))}
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleScreenshotUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3 w-3" />
          {element.screenshotSrc ? 'Replace Media' : 'Add Image / Video'}
        </Button>
      </div>
    </div>
  );
}

export function SlideBackgroundProps() {
  const activeScene = useEditorStore((s) => s.getActiveScene());
  const updateScene = useEditorStore((s) => s.updateScene);

  if (!activeScene) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Slide
      </h4>
      <PropertyRow label="Name">
        <Input
          value={activeScene.name}
          onChange={(e) => updateScene(activeScene.id, { name: e.target.value })}
          className="h-7 text-xs"
        />
      </PropertyRow>
      <PropertyRow label="Background">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={activeScene.background}
            onChange={(e) => updateScene(activeScene.id, { background: e.target.value })}
            className="h-7 w-7 cursor-pointer rounded border border-border bg-transparent"
          />
          <Input
            value={activeScene.background}
            onChange={(e) => updateScene(activeScene.id, { background: e.target.value })}
            className="h-7 flex-1 text-xs"
          />
        </div>
      </PropertyRow>
    </div>
  );
}
