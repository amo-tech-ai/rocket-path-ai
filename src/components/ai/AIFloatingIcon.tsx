/**
 * AI Floating Icon Component
 * 
 * Fixed bottom-right corner icon to open the AI assistant.
 */

import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useGlobalAIAssistant } from '@/hooks/useGlobalAIAssistant';

interface AIFloatingIconProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export const AIFloatingIcon = forwardRef<HTMLButtonElement, AIFloatingIconProps>(
  ({ onClick, isOpen, className }, ref) => {
    const { isAuthenticated, isLoading } = useGlobalAIAssistant();

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="default"
            size="icon"
            onClick={onClick}
            aria-label="Open AI Assistant"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={cn(
              "fixed z-[9998] rounded-full shadow-lg",
              "w-14 h-14 min-w-[44px] min-h-[44px]",
              "bottom-4 right-4",
              "sm:bottom-6 sm:right-6",
              "mb-safe",
              "transition-all duration-200",
              "hover:scale-105 hover:shadow-xl",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              // Hide when panel is open
              isOpen && "scale-0 opacity-0 pointer-events-none",
              // Different styling based on mode
              isAuthenticated 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-sage hover:bg-sage/90",
              className
            )}
          >
            <Sparkles className={cn(
              "w-6 h-6",
              isLoading && "animate-pulse"
            )} />
            
            {/* Pulse indicator for authenticated mode */}
            {isAuthenticated && !isOpen && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-sage rounded-full border-2 border-background animate-pulse" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>{isAuthenticated ? 'AI Assistant (Connected)' : 'Ask StartupAI'}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

AIFloatingIcon.displayName = 'AIFloatingIcon';

export default AIFloatingIcon;
