/**
 * AI Quick Actions Component
 * 
 * Grid of quick action buttons for common queries.
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QuickAction } from '@/lib/ai-capabilities';

interface AIQuickActionsProps {
  actions: QuickAction[];
  onAction: (action: QuickAction) => void;
  variant?: 'default' | 'mobile';
}

export function AIQuickActions({ actions, onAction, variant = 'default' }: AIQuickActionsProps) {
  return (
    <div className={cn(
      "grid gap-2 w-full",
      variant === 'mobile' ? "grid-cols-1" : "grid-cols-2"
    )}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          onClick={() => onAction(action)}
          className={cn(
            "justify-start text-left h-auto py-2.5 px-3",
            "text-xs font-medium",
            "hover:bg-muted/80",
            variant === 'mobile' && "text-sm py-3"
          )}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export default AIQuickActions;
