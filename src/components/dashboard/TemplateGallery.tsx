'use client';

import { TEMPLATES, type Template } from '@/lib/templates';
import { Badge } from '@/components/ui/badge';

interface TemplateGalleryProps {
  selectedId: string | null;
  onSelect: (template: Template | null) => void;
}

export function TemplateGallery({ selectedId, onSelect }: TemplateGalleryProps) {
  return (
    <div className="space-y-3">
      {/* Blank option */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full rounded-lg border p-3 text-left transition-colors ${
          selectedId === null
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-20 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
            Blank
          </div>
          <div>
            <p className="text-sm font-medium">Start from scratch</p>
            <p className="text-xs text-muted-foreground">Empty canvas</p>
          </div>
        </div>
      </button>

      {/* Templates */}
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className={`w-full rounded-lg border p-3 text-left transition-colors ${
            selectedId === template.id
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-20 rounded"
              style={{ background: template.preview }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{template.name}</p>
                <Badge variant="secondary" className="text-[10px]">
                  {template.scenes.length} scene{template.scenes.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
