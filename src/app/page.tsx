'use client';

import { Film } from 'lucide-react';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Film className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold">PromoVid</h1>
          </div>
          <NewProjectDialog />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your promotional videos
          </p>
        </div>
        <ProjectGrid />
      </main>
    </div>
  );
}
