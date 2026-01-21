import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react';
import { SaveState } from '@/hooks/useCanvasAutosave';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface AutosaveIndicatorProps {
  saveState: SaveState;
  lastSaved: Date | null;
  errorMessage?: string;
  className?: string;
}

export function AutosaveIndicator({ 
  saveState, 
  lastSaved, 
  errorMessage,
  className 
}: AutosaveIndicatorProps) {
  const getStateConfig = () => {
    switch (saveState) {
      case 'saving':
        return {
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
          text: 'Saving...',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
        };
      case 'saved':
        return {
          icon: <Check className="w-3.5 h-3.5" />,
          text: 'Saved',
          color: 'text-sage',
          bgColor: 'bg-sage/10',
        };
      case 'pending':
        return {
          icon: <Cloud className="w-3.5 h-3.5" />,
          text: 'Unsaved',
          color: 'text-warm-foreground',
          bgColor: 'bg-warm/20',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          text: 'Save failed',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
        };
      default:
        return {
          icon: <Cloud className="w-3.5 h-3.5" />,
          text: 'Ready',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/30',
        };
    }
  };

  const config = getStateConfig();

  const tooltipContent = () => {
    if (errorMessage) {
      return `Error: ${errorMessage}`;
    }
    if (lastSaved) {
      return `Last saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`;
    }
    return 'Changes will auto-save';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors",
            config.bgColor,
            config.color,
            className
          )}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={saveState}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {config.icon}
            </motion.span>
          </AnimatePresence>
          <span>{config.text}</span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltipContent()}
      </TooltipContent>
    </Tooltip>
  );
}
