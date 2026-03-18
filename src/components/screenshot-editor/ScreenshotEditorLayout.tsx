'use client';

import { ScreenshotToolbar } from './ScreenshotToolbar';
import { SlideStrip } from './SlideStrip';
import { ScreenshotPropertiesPanel } from './ScreenshotPropertiesPanel';
import { Canvas } from '@/components/editor/Canvas';
import { LayerPanel } from '@/components/editor/LayerPanel';

export function ScreenshotEditorLayout() {
  return (
    <div className="flex h-screen flex-col bg-muted/30">
      <ScreenshotToolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Layers */}
        <div className="w-[250px] flex-shrink-0 border-r bg-white">
          <LayerPanel />
        </div>

        {/* Center - Canvas */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>
          {/* Bottom - Slide Strip */}
          <div className="h-[140px] flex-shrink-0 border-t bg-white">
            <SlideStrip />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-[300px] flex-shrink-0 border-l bg-white">
          <ScreenshotPropertiesPanel />
        </div>
      </div>
    </div>
  );
}
