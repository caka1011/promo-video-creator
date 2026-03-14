'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Monitor, Smartphone } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { RESOLUTION_PRESETS, type Platform, type Project } from '@/types/editor';
import { TemplateGallery } from './TemplateGallery';
import { TEMPLATES, type Template } from '@/lib/templates';
import { v4 as uuidv4 } from 'uuid';

export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('app-store');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const createProject = useEditorStore((s) => s.createProject);
  const loadProject = useEditorStore((s) => s.loadProject);
  const projects = useEditorStore((s) => s.projects);
  const router = useRouter();

  const handleCreate = () => {
    if (!name.trim()) return;
    const resolution =
      platform === 'google-play'
        ? RESOLUTION_PRESETS['google-play']
        : RESOLUTION_PRESETS['app-store'];

    if (selectedTemplate) {
      // Create from template
      const project: Project = {
        id: uuidv4(),
        name: name.trim(),
        scenes: structuredClone(selectedTemplate.scenes).map((s) => ({
          ...s,
          id: uuidv4(),
          elements: s.elements.map((e) => ({ ...e, id: uuidv4() })),
        })),
        settings: { platform, resolution, fps: 30 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newProjects = [...projects, project];
      if (typeof window !== 'undefined') {
        localStorage.setItem('appreel-projects', JSON.stringify(newProjects));
      }
      useEditorStore.setState({ projects: newProjects });
      setOpen(false);
      setName('');
      setSelectedTemplate(null);
      router.push(`/editor/${project.id}`);
    } else {
      const id = createProject(name.trim(), { platform, resolution, fps: 30 });
      setOpen(false);
      setName('');
      router.push(`/editor/${id}`);
    }
  };

  const platforms: { value: Platform; label: string; icon: React.ReactNode }[] = [
    { value: 'app-store', label: 'App Store', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'google-play', label: 'Google Play', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'both', label: 'Both', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 bg-primary hover:bg-primary/90" />}>
        <Plus className="h-4 w-4" />
        New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="My App Promo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Target Platform</Label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors ${
                    platform === p.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <ScrollArea className="h-[200px] rounded-md border border-border p-2">
              <TemplateGallery
                selectedId={selectedTemplate?.id ?? null}
                onSelect={setSelectedTemplate}
              />
            </ScrollArea>
          </div>

          <div className="text-xs text-muted-foreground">
            Resolution: 1920 x 1080 ({platform === 'app-store' ? 'App Store' : platform === 'google-play' ? 'Google Play' : 'Universal'})
          </div>

          <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
