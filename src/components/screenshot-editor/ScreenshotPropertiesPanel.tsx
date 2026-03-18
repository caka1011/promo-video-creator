'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editor-store';
import {
  PositionProps,
  ScreenshotProps,
  TextProps,
  DeviceFrameProps,
  SlideBackgroundProps,
} from '@/components/editor/property-sections';

export function ScreenshotPropertiesPanel() {
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
            </>
          ) : (
            <>
              <SlideBackgroundProps />
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
