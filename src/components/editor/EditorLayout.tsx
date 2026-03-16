'use client';

import { Toolbar } from './Toolbar';
import { Canvas } from './Canvas';
import { LayerPanel } from './LayerPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { Timeline } from './Timeline';
import { PreviewPlayer } from './PreviewPlayer';
import { useEditorStore } from '@/stores/editor-store';

export function EditorLayout() {
  const previewMode = useEditorStore((s) => s.previewMode);

  if (previewMode) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Toolbar />
        <div className="flex flex-1 items-center justify-center bg-black">
          <PreviewPlayer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Layers */}
        <div className="w-[250px] flex-shrink-0 border-r bg-white">
          <LayerPanel />
        </div>

        {/* Center - Canvas + Preview + Timeline */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top: Canvas (editing) + Live Preview side by side */}
          <div className="flex flex-1 overflow-hidden">
            {/* Konva editing canvas */}
            <div className="flex-1 overflow-hidden">
              <Canvas />
            </div>
            {/* Live Remotion preview */}
            <div className="w-[360px] flex-shrink-0 border-l bg-black flex flex-col">
              <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Live Preview</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-2">
                <PreviewPlayer />
              </div>
            </div>
          </div>
          {/* Bottom - Timeline */}
          <div className="h-[200px] flex-shrink-0 border-t bg-white">
            <Timeline />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-[300px] flex-shrink-0 border-l bg-white">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
