'use client';

import { Toolbar } from './Toolbar';
import { Canvas } from './Canvas';
import { LayerPanel } from './LayerPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { Timeline } from './Timeline';
import { useEditorStore } from '@/stores/editor-store';

export function EditorLayout() {
  const previewMode = useEditorStore((s) => s.previewMode);

  if (previewMode) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Toolbar />
        <div className="flex flex-1 items-center justify-center bg-black">
          <Canvas />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Layers */}
        <div className="glass w-[250px] flex-shrink-0 border-r border-border">
          <LayerPanel />
        </div>

        {/* Center - Canvas */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>
          {/* Bottom - Timeline */}
          <div className="glass h-[200px] flex-shrink-0 border-t border-border">
            <Timeline />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="glass w-[300px] flex-shrink-0 border-l border-border">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
