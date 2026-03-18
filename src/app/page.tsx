'use client';

import { useState } from 'react';
import { Film, Smartphone } from 'lucide-react';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog';
import { NewScreenshotProjectDialog } from '@/components/dashboard/NewScreenshotProjectDialog';
import type { ProjectType } from '@/types/editor';

type FilterValue = ProjectType | 'all';

const TABS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Videos' },
  { value: 'app-screens', label: 'App Screens' },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterValue>('all');

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
        <div className="flex items-center gap-2 px-5">
          <NewProjectDialog />
          <NewScreenshotProjectDialog />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your promotional videos and app store screenshots
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.value
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ProjectGrid filter={filter} />
        </div>
      </main>
    </div>
  );
}
