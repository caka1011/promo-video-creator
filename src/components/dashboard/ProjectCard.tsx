'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical, Trash2, Film, Smartphone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/editor';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();

  const isScreenshot = project.type === 'app-screens';
  const href = isScreenshot ? `/screens/${project.id}` : `/editor/${project.id}`;
  const Icon = isScreenshot ? Smartphone : Film;

  return (
    <div
      onClick={() => router.push(href)}
      className="group cursor-pointer rounded-xl border bg-card shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-muted">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {isScreenshot && (
          <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
            Screens
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{project.name}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(project.updatedAt)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" />}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
