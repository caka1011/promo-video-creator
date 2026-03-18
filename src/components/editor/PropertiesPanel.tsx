'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editor-store';
import { ANIMATION_PRESETS, EASING_OPTIONS } from '@/lib/animations';
import type { AnimationType, EasingType, SceneElement } from '@/types/editor';
import {
  PropertyRow,
  NumberInput,
  PositionProps,
  ScreenshotProps,
  TextProps,
  DeviceFrameProps,
} from './property-sections';

function AnimationProps({ element }: { element: SceneElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);

  const filteredPresets = ANIMATION_PRESETS.filter((p) => {
    if (p.category === 'text' && element.type !== 'text') return false;
    return true;
  });

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Animation
      </h4>
      <PropertyRow label="Type">
        <Select
          value={element.animation.type}
          onValueChange={(v) =>
            v && updateElement(element.id, {
              animation: { ...element.animation, type: v as AnimationType },
            })
          }
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filteredPresets.map((p) => (
              <SelectItem key={p.type} value={p.type}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PropertyRow>
      {element.animation.type !== 'none' && (
        <>
          <PropertyRow label="Duration">
            <NumberInput
              value={element.animation.duration}
              onChange={(duration) =>
                updateElement(element.id, {
                  animation: { ...element.animation, duration },
                })
              }
              min={1}
              max={300}
            />
          </PropertyRow>
          <PropertyRow label="Delay">
            <NumberInput
              value={element.animation.delay}
              onChange={(delay) =>
                updateElement(element.id, {
                  animation: { ...element.animation, delay },
                })
              }
              min={0}
              max={300}
            />
          </PropertyRow>
          <PropertyRow label="Easing">
            <Select
              value={element.animation.easing}
              onValueChange={(v) =>
                v && updateElement(element.id, {
                  animation: { ...element.animation, easing: v as EasingType },
                })
              }
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EASING_OPTIONS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PropertyRow>
        </>
      )}
    </div>
  );
}

function SceneProps() {
  const activeScene = useEditorStore((s) => s.getActiveScene());
  const updateScene = useEditorStore((s) => s.updateScene);

  if (!activeScene) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Scene
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
      <PropertyRow label="Duration">
        <NumberInput
          value={activeScene.duration}
          onChange={(duration) => updateScene(activeScene.id, { duration })}
          min={30}
          max={900}
        />
      </PropertyRow>
    </div>
  );
}

function AudioProps() {
  const project = useEditorStore((s) => s.project);
  const setAudioVolume = useEditorStore((s) => s.setAudioVolume);
  const saveProject = useEditorStore((s) => s.saveProject);

  if (!project?.audioSrc) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Background Audio
      </h4>
      <p className="text-[10px] text-muted-foreground truncate">
        {project.audioFileName}
      </p>
      <PropertyRow label="Volume">
        <div className="flex items-center gap-2">
          <Slider
            value={[(project.audioVolume ?? 1) * 100]}
            onValueChange={(v) => {
              setAudioVolume((typeof v === 'number' ? v : v[0]) / 100);
            }}
            onPointerUp={() => saveProject()}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-8 text-right text-[10px] text-muted-foreground">
            {Math.round((project.audioVolume ?? 1) * 100)}%
          </span>
        </div>
      </PropertyRow>
    </div>
  );
}

export function PropertiesPanel() {
  const selectedElement = useEditorStore((s) => s.getSelectedElement());

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Properties
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {selectedElement ? (
            <>
              <PositionProps element={selectedElement} />
              <Separator />
              {selectedElement.type === 'screenshot' && (
                <ScreenshotProps element={selectedElement} />
              )}
              {selectedElement.type === 'text' && (
                <TextProps element={selectedElement} />
              )}
              {selectedElement.type === 'device-frame' && (
                <DeviceFrameProps element={selectedElement} />
              )}
              <Separator />
              <AnimationProps element={selectedElement} />
            </>
          ) : (
            <>
              <SceneProps />
              <Separator />
              <AudioProps />
              <Separator />
              <p className="py-4 text-center text-xs text-muted-foreground">
                Select an element to edit its properties
              </p>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
