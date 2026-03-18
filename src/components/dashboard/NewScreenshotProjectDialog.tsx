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
import { Plus, Smartphone, Monitor } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import {
  APP_STORE_SIZES,
  GOOGLE_PLAY_SIZES,
  ALL_OUTPUT_SIZES,
  type OutputSize,
} from '@/lib/output-sizes';
import type { ScreenOrientation } from '@/types/editor';

type StoreTarget = 'app-store' | 'google-play' | 'both';

export function NewScreenshotProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [storeTarget, setStoreTarget] = useState<StoreTarget>('app-store');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['ios-6.7']);
  const [slideCount, setSlideCount] = useState(5);
  const [orientation, setOrientation] = useState<ScreenOrientation>('portrait');
  const createScreenshotProject = useEditorStore((s) => s.createScreenshotProject);
  const router = useRouter();

  const availableSizes =
    storeTarget === 'app-store'
      ? APP_STORE_SIZES
      : storeTarget === 'google-play'
        ? GOOGLE_PLAY_SIZES
        : ALL_OUTPUT_SIZES;

  const toggleSize = (id: string) => {
    setSelectedSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleStoreChange = (target: StoreTarget) => {
    setStoreTarget(target);
    // Pre-select first size of the new store
    const sizes =
      target === 'app-store'
        ? APP_STORE_SIZES
        : target === 'google-play'
          ? GOOGLE_PLAY_SIZES
          : ALL_OUTPUT_SIZES;
    setSelectedSizes([sizes[0].id]);
  };

  const handleCreate = () => {
    if (!name.trim() || selectedSizes.length === 0) return;

    const id = createScreenshotProject(name.trim(), {
      outputSizes: selectedSizes,
      orientation,
    });

    // Add extra slides if requested
    const store = useEditorStore.getState();
    store.loadProject(store.projects.find((p) => p.id === id)!);
    for (let i = 1; i < slideCount; i++) {
      store.addScene();
    }
    // Rename slides to "Screenshot N"
    const project = useEditorStore.getState().project;
    if (project) {
      project.scenes.forEach((scene, idx) => {
        store.updateScene(scene.id, { name: `Screenshot ${idx + 1}` });
      });
      store.setActiveScene(project.scenes[0].id);
      store.saveProject();
    }

    resetAndClose();
    router.push(`/screens/${id}`);
  };

  const resetAndClose = () => {
    setOpen(false);
    setName('');
    setStoreTarget('app-store');
    setSelectedSizes(['ios-6.7']);
    setSlideCount(5);
    setOrientation('portrait');
  };

  const stores: { value: StoreTarget; label: string; icon: React.ReactNode }[] = [
    { value: 'app-store', label: 'App Store', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'google-play', label: 'Google Play', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'both', label: 'Both', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); else setOpen(true); }}>
      <DialogTrigger render={<Button className="gap-2 bg-purple-600 text-white hover:bg-purple-700" />}>
        <Plus className="h-4 w-4" />
        New App Screens
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create App Screens Project</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="space-y-4 pt-2 pb-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="screenshot-project-name">Project Name</Label>
              <Input
                id="screenshot-project-name"
                placeholder="My App Screenshots"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>

            {/* Target Store */}
            <div className="space-y-2">
              <Label>Target Store</Label>
              <div className="grid grid-cols-3 gap-2">
                {stores.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleStoreChange(s.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors ${
                      storeTarget === s.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Sizes */}
            <div className="space-y-2">
              <Label>Output Sizes</Label>
              <div className="space-y-1.5">
                {availableSizes.map((size) => (
                  <label
                    key={size.id}
                    className={`flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                      selectedSizes.includes(size.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size.id)}
                      onChange={() => toggleSize(size.id)}
                      className="accent-purple-600"
                    />
                    <span className="text-sm font-medium">{size.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {size.width} x {size.height}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <Label>Orientation</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['portrait', 'landscape'] as ScreenOrientation[]).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm capitalize transition-colors ${
                      orientation === o
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <div
                      className={`border-2 rounded-sm ${
                        orientation === o ? 'border-purple-600' : 'border-muted-foreground'
                      } ${o === 'portrait' ? 'w-3 h-5' : 'w-5 h-3'}`}
                    />
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Screenshots */}
            <div className="space-y-2">
              <Label>Number of Screenshots</Label>
              <div className="flex gap-2">
                {[1, 3, 5, 8, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSlideCount(count)}
                    className={`flex-1 rounded-lg border p-2 text-center text-sm font-medium transition-colors ${
                      slideCount === count
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                onClick={handleCreate}
                className="w-60 bg-purple-600 hover:bg-purple-700"
                disabled={!name.trim() || selectedSizes.length === 0}
              >
                Create App Screens
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
