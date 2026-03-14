'use client';

import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, Image, Type, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/stores/editor-store';
import type { SceneElement } from '@/types/editor';

function getElementIcon(type: SceneElement['type']) {
  switch (type) {
    case 'screenshot':
      return <Image className="h-3.5 w-3.5 text-blue-400" />;
    case 'text':
      return <Type className="h-3.5 w-3.5 text-green-400" />;
    case 'device-frame':
      return <Smartphone className="h-3.5 w-3.5 text-purple-400" />;
  }
}

export function LayerPanel() {
  const activeScene = useEditorStore((s) => s.getActiveScene());
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const removeElement = useEditorStore((s) => s.removeElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);

  if (!activeScene) return null;

  const elements = [...activeScene.elements].reverse();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Layers
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2">
          {elements.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No elements yet.<br />
              Use the toolbar to add elements.
            </p>
          )}
          {elements.map((element) => (
            <div
              key={element.id}
              onClick={() => selectElement(element.id)}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                selectedElementId === element.id
                  ? 'bg-primary/15 text-foreground'
                  : 'hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              {getElementIcon(element.type)}
              <span className="flex-1 truncate text-xs">{element.name}</span>

              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateElement(element.id, { visible: !element.visible });
                  }}
                >
                  {element.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateElement(element.id, { locked: !element.locked });
                  }}
                >
                  {element.locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Unlock className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateElement(element.id);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
