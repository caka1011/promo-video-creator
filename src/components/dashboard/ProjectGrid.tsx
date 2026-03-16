'use client';

import { useEffect } from 'react';
import { Film } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { ProjectCard } from './ProjectCard';
import { NewProjectDialog } from './NewProjectDialog';

export function ProjectGrid() {
  const projects = useEditorStore((s) => s.projects);
  const loadProjects = useEditorStore((s) => s.loadProjects);
  const deleteProject = useEditorStore((s) => s.deleteProject);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Film className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">No projects yet</h2>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Create your first promotional video for the App Store or Google Play
        </p>
        <NewProjectDialog />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {projects
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={deleteProject}
          />
        ))}
    </div>
  );
}
