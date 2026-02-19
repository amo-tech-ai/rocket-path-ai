/**
 * GuidedOverlay Component
 *
 * Wraps dashboard sections to show them as locked/dimmed during guided mode.
 * Shows a tooltip explaining how to unlock.
 */

import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface GuidedOverlayProps {
  /** Whether the section is locked */
  isLocked: boolean;
  /** Tooltip message explaining how to unlock */
  tooltip?: string;
  /** Whether to apply blur effect */
  blur?: boolean;
  /** Child components to wrap */
  children: ReactNode;
  /** Additional className for the container */
  className?: string;
}

export function GuidedOverlay({
  isLocked,
  tooltip = 'Complete your first task to unlock this section',
  blur = true,
  children,
  className,
}: GuidedOverlayProps) {
  // If not locked, just render children
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={cn('relative', className)}>
            {/* Content with blur/dim effect */}
            <div
              className={cn(
                'transition-all duration-300 pointer-events-none select-none',
                blur ? 'blur-[2px] opacity-50' : 'opacity-40'
              )}
            >
              {children}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm border border-border/50">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Locked</span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default GuidedOverlay;
