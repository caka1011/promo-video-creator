'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/stores/editor-store';

export function SlideStrip() {
  const project = useEditorStore((s) => s.project);
  const activeSceneId = useEditorStore((s) => s.activeSceneId);
  const setActiveScene = useEditorStore((s) => s.setActiveScene);
  const addScene = useEditorStore((s) => s.addScene);
  const removeScene = useEditorStore((s) => s.removeScene);
  const updateScene = useEditorStore((s) => s.updateScene);

  if (!project) return null;

  const slides = project.scenes;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-8 items-center justify-between px-3 border-b">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Screenshots ({slides.length})
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => {
            addScene();
            // Rename the new slide
            const newProject = useEditorStore.getState().project;
            if (newProject) {
              const lastScene = newProject.scenes[newProject.scenes.length - 1];
              updateScene(lastScene.id, { name: `Screenshot ${newProject.scenes.length}` });
            }
          }}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex gap-2 p-3 h-full">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveScene(slide.id)}
              className={`group relative flex-shrink-0 w-[80px] rounded-lg border-2 transition-all overflow-hidden ${
                activeSceneId === slide.id
                  ? 'border-purple-600 shadow-md'
                  : 'border-border hover:border-purple-300'
              }`}
            >
              {/* Slide preview thumbnail */}
              <div
                className="w-full h-[70px] flex items-center justify-center"
                style={{ backgroundColor: slide.background }}
              >
                <span className="text-[9px] text-white/60 font-medium">
                  {slide.elements.length} items
                </span>
              </div>

              {/* Slide label */}
              <div className="px-1.5 py-1 bg-white">
                <span className="text-[9px] font-medium text-foreground truncate block">
                  {index + 1}. {slide.name}
                </span>
              </div>

              {/* Delete button */}
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeScene(slide.id);
                  }}
                  className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
