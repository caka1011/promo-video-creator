'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { ALL_OUTPUT_SIZES, getOutputSizeById } from '@/lib/output-sizes';
import { downloadBlob } from '@/lib/export';
import { blobToUint8Array, createZipFromFiles } from '@/lib/screenshot-export';
import Konva from 'konva';

export function ScreenshotExportDialog() {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState('');
  const project = useEditorStore((s) => s.project);

  const screenshotSettings = project?.screenshotSettings;
  const defaultSizes = screenshotSettings?.outputSizes ?? ['ios-6.7'];

  const [selectedSizes, setSelectedSizes] = useState<string[]>(defaultSizes);

  const toggleSize = (id: string) => {
    setSelectedSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const totalFiles = (project?.scenes.length ?? 0) * selectedSizes.length;

  const handleExport = async () => {
    if (!project || selectedSizes.length === 0) return;
    setExporting(true);

    try {
      const files: { name: string; data: Uint8Array }[] = [];
      const canvasWidth = project.settings.resolution.width;
      const canvasHeight = project.settings.resolution.height;

      // Save current state
      const currentSceneId = useEditorStore.getState().activeSceneId;

      for (let slideIdx = 0; slideIdx < project.scenes.length; slideIdx++) {
        const slide = project.scenes[slideIdx];
        setProgress(`Rendering screenshot ${slideIdx + 1} of ${project.scenes.length}...`);

        // Switch to this slide to ensure canvas renders it
        useEditorStore.getState().setActiveScene(slide.id);
        // Small delay to let the canvas re-render
        await new Promise((r) => setTimeout(r, 200));

        // Find the Konva stage in the DOM
        const stageContainer = document.querySelector('.konvajs-content');
        if (!stageContainer) continue;

        const konvaStage = Konva.stages[Konva.stages.length - 1];
        if (!konvaStage) continue;

        for (const sizeId of selectedSizes) {
          const size = getOutputSizeById(sizeId);
          if (!size) continue;

          const pixelRatio = size.width / canvasWidth;

          const blob = await new Promise<Blob>((resolve, reject) => {
            // Find the main layer (first layer)
            const layer = konvaStage.getLayers()[0];
            if (!layer) { reject(new Error('No layer')); return; }

            // Create a temporary stage at the right resolution
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            document.body.appendChild(tempContainer);

            const tempStage = new Konva.Stage({
              container: tempContainer,
              width: canvasWidth,
              height: canvasHeight,
            });

            // Clone the layer
            const clonedLayer = layer.clone();
            // Reset transform to remove zoom/pan offset
            clonedLayer.x(0);
            clonedLayer.y(0);
            clonedLayer.scaleX(1);
            clonedLayer.scaleY(1);

            tempStage.add(clonedLayer);
            tempStage.draw();

            tempStage.toBlob({
              pixelRatio,
              mimeType: 'image/png',
              callback: (b: Blob | null) => {
                tempStage.destroy();
                document.body.removeChild(tempContainer);
                if (b) resolve(b);
                else reject(new Error('Failed to create blob'));
              },
            });
          });

          const sanitizedName = project.name.replace(/[^a-zA-Z0-9-_]/g, '_');
          const filename = `${sanitizedName}_${slideIdx + 1}_${size.name.replace(/[^a-zA-Z0-9-_"]/g, '_')}.png`;

          if (totalFiles === 1) {
            // Single file — download directly
            downloadBlob(blob, filename);
            setExporting(false);
            setProgress('');
            // Restore scene
            if (currentSceneId) useEditorStore.getState().setActiveScene(currentSceneId);
            return;
          }

          const data = await blobToUint8Array(blob);
          files.push({ name: filename, data });
        }
      }

      // Restore original scene
      if (currentSceneId) useEditorStore.getState().setActiveScene(currentSceneId);

      if (files.length > 1) {
        setProgress('Creating ZIP archive...');
        const zip = await createZipFromFiles(files);
        const sanitizedName = project.name.replace(/[^a-zA-Z0-9-_]/g, '_');
        downloadBlob(zip, `${sanitizedName}_screenshots.zip`);
      }
    } catch (err) {
      console.error('Export failed:', err);
      setProgress('Export failed. Please try again.');
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(''), 2000);
    }
  };

  const availableSizes = ALL_OUTPUT_SIZES;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
        <Download className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Screenshots</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Output Sizes */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Output Sizes</p>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {availableSizes.map((size) => (
                <label
                  key={size.id}
                  className={`flex items-center gap-3 rounded-lg border p-2 cursor-pointer transition-colors ${
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
                    disabled={exporting}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{size.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({size.store === 'app-store' ? 'iOS' : 'Android'})
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {size.width}x{size.height}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              {project?.scenes.length ?? 0} screenshot{(project?.scenes.length ?? 0) !== 1 ? 's' : ''} x{' '}
              {selectedSizes.length} size{selectedSizes.length !== 1 ? 's' : ''} ={' '}
              <strong className="text-foreground">{totalFiles} file{totalFiles !== 1 ? 's' : ''}</strong>
              {totalFiles > 1 && ' (ZIP)'}
            </p>
          </div>

          {/* Progress */}
          {progress && (
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {exporting && <Loader2 className="h-3 w-3 animate-spin" />}
              {progress}
            </p>
          )}

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={exporting || selectedSizes.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {totalFiles} PNG{totalFiles !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
