'use client';

import { Film } from 'lucide-react';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog';

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/30">
      {/* Header */}
      <header className="flex shrink-0 items-center border-b bg-white">
        <div className="flex items-center gap-2.5 px-5 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
            <Film className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">AppReel</h1>
        </div>
        <div className="flex-1" />
        <div className="px-5">
          <NewProjectDialog />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your promotional videos
            </p>
          </div>
          <ProjectGrid />
        </div>
      </main>
    </div>
  );
}
