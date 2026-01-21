import { Cloud, CloudOff, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveState } from '@/hooks/useCanvasAutosave';

interface AutosaveIndicatorProps {
  status: SaveState;
  lastSaved: Date | null;
  className?: string;
}

const statusConfig: Record<SaveState, { icon: React.ReactNode; label: string; color: string }> = {
  idle: {
    icon: <Cloud className="w-3.5 h-3.5" />,
    label: 'All changes saved',
    color: 'text-muted-foreground',
  },
  pending: {
    icon: <Cloud className="w-3.5 h-3.5" />,
    label: 'Unsaved changes',
    color: 'text-warm-foreground',
  },
  saving: {
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: 'Saving...',
    color: 'text-muted-foreground',
  },
  saved: {
    icon: <Check className="w-3.5 h-3.5" />,
    label: 'Saved',
    color: 'text-sage',
  },
  error: {
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: 'Save failed',
    color: 'text-destructive',
  },
};

export function AutosaveIndicator({ status, lastSaved, className }: AutosaveIndicatorProps) {
  const config = statusConfig[status];

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className={cn(
          'flex items-center gap-1.5 text-xs transition-colors',
          config.color,
          className
        )}
      >
        {config.icon}
        <span>{config.label}</span>
        {status === 'saved' && lastSaved && (
          <span className="text-muted-foreground/60">• {formatLastSaved()}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
