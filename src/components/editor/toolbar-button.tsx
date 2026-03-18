'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ToolbarButton({
  tooltip,
  onClick,
  children,
  variant = 'ghost',
  active = false,
}: {
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'ghost' | 'default';
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={active ? 'default' : variant}
            size="icon"
            className={`h-8 w-8 ${active ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
          />
        }
        onClick={onClick}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
