'use client';

import { useState, useRef } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Monitor, Smartphone, Upload, X, Image } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { RESOLUTION_PRESETS, type Platform, type Project } from '@/types/editor';
import { TemplateGallery } from './TemplateGallery';
import { TEMPLATES, generateScenesFromTemplate, type Template } from '@/lib/templates';
import { v4 as uuidv4 } from 'uuid';

export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('app-store');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [screenCount, setScreenCount] = useState(3);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const createProject = useEditorStore((s) => s.createProject);
  const projects = useEditorStore((s) => s.projects);
  const router = useRouter();

  const handleTemplateSelect = (template: Template | null) => {
    setSelectedTemplate(template);
    if (template) {
      // Reset screenshots array to match screen count
      setScreenshots(new Array(screenCount).fill(''));
    } else {
      setScreenshots([]);
    }
  };

  const handleScreenCountChange = (count: number) => {
    setScreenCount(count);
    // Adjust screenshots array
    const newScreenshots = [...screenshots];
    while (newScreenshots.length < count) newScreenshots.push('');
    setScreenshots(newScreenshots.slice(0, count));
  };

  const handleScreenshotUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newScreenshots = [...screenshots];
      while (newScreenshots.length <= index) newScreenshots.push('');
      newScreenshots[index] = reader.result as string;
      setScreenshots(newScreenshots);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = [...screenshots];
    newScreenshots[index] = '';
    setScreenshots(newScreenshots);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const resolution =
      platform === 'google-play'
        ? RESOLUTION_PRESETS['google-play']
        : RESOLUTION_PRESETS['app-store'];

    if (selectedTemplate) {
      // Generate scenes from template with screenshots
      const screenshotsList = screenshots.slice(0, screenCount);
      while (screenshotsList.length < screenCount) screenshotsList.push('');
      const scenes = generateScenesFromTemplate(selectedTemplate, screenshotsList);

      const project: Project = {
        id: uuidv4(),
        name: name.trim(),
        scenes,
        settings: { platform, resolution, fps: 30 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newProjects = [...projects, project];
      if (typeof window !== 'undefined') {
        localStorage.setItem('appreel-projects', JSON.stringify(newProjects));
      }
      useEditorStore.setState({ projects: newProjects });
      resetAndClose();
      router.push(`/editor/${project.id}`);
    } else {
      const id = createProject(name.trim(), { platform, resolution, fps: 30 });
      resetAndClose();
      router.push(`/editor/${id}`);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setName('');
    setSelectedTemplate(null);
    setScreenCount(3);
    setScreenshots([]);
  };

  const platforms: { value: Platform; label: string; icon: React.ReactNode }[] = [
    { value: 'app-store', label: 'App Store', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'google-play', label: 'Google Play', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'both', label: 'Both', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); else setOpen(true); }}>
      <DialogTrigger render={<Button className="gap-2 bg-primary hover:bg-primary/90" />}>
        <Plus className="h-4 w-4" />
        New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pt-2 pb-4">
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
                  onSelect={handleTemplateSelect}
                />
              </ScrollArea>
            </div>

            {/* Screen count selector — only when template is selected */}
            {selectedTemplate && (
              <div className="space-y-2">
                <Label>Number of Screens</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleScreenCountChange(count)}
                      className={`flex-1 rounded-lg border p-2 text-center text-sm font-medium transition-colors ${
                        screenCount === count
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {screenCount === 1 && 'Single centered device'}
                  {screenCount === 2 && 'Side by side with perspective'}
                  {screenCount === 3 && 'Triple showcase with center focus'}
                  {screenCount === 4 && '2x2 grid layout'}
                  {screenCount === 5 && 'Panoramic fan layout'}
                </p>
              </div>
            )}

            {/* Screenshot upload slots — only when template is selected */}
            {selectedTemplate && (
              <div className="space-y-2">
                <Label>Upload Screenshots <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: screenCount }).map((_, i) => (
                    <div key={i} className="relative">
                      <input
                        ref={(el) => { fileInputRefs.current[i] = el; }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleScreenshotUpload(i, e)}
                        className="hidden"
                      />
                      {screenshots[i] ? (
                        <div className="relative group">
                          <img
                            src={screenshots[i]}
                            alt={`Screen ${i + 1}`}
                            className="w-full aspect-[9/19.5] rounded-md object-cover border border-border"
                          />
                          <button
                            onClick={() => removeScreenshot(i)}
                            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">
                            {i + 1}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRefs.current[i]?.click()}
                          className="w-full aspect-[9/19.5] rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        >
                          <Image className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[9px] text-muted-foreground">{i + 1}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  You can also upload screenshots later in the editor
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Resolution: 1920 x 1080 ({platform === 'app-store' ? 'App Store' : platform === 'google-play' ? 'Google Play' : 'Universal'})
            </div>

            <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
              Create Project
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
