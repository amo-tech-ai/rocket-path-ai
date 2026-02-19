import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionShellProps {
  id: string;
  number: number;
  title: string;
  agent?: string;
  sourceCount?: number;
  children: ReactNode;
}

export const SectionShell = memo(function SectionShell({
  id,
  number,
  title,
  agent,
  sourceCount,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className="bg-card rounded-xl border border-border p-4 sm:p-6 lg:p-8 shadow-premium-sm"
    >
      <div className="eyebrow">Section {number}</div>

      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-lg sm:text-xl lg:text-2xl text-foreground">
          {title}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          {agent && (
            <span className="text-xs text-muted-foreground">{agent}</span>
          )}
          {sourceCount != null && sourceCount > 0 && (
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
            </span>
          )}
        </div>
      </div>

      <hr className="border-border/50 my-4" />

      {children}
    </section>
  );
});
