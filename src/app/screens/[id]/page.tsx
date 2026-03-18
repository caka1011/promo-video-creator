'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditorStore } from '@/stores/editor-store';
import { ScreenshotEditorLayout } from '@/components/screenshot-editor/ScreenshotEditorLayout';

export default function ScreenshotEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const loadProjects = useEditorStore((s) => s.loadProjects);
  const projects = useEditorStore((s) => s.projects);
  const project = useEditorStore((s) => s.project);
  const loadProject = useEditorStore((s) => s.loadProject);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (projects.length === 0) return;
    const found = projects.find((p) => p.id === id);
    if (found && found.type === 'app-screens') {
      loadProject(found);
    } else {
      router.push('/');
    }
  }, [projects, id, loadProject, router]);

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  return <ScreenshotEditorLayout />;
}
