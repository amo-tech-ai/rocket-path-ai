/**
 * Auto-Save Indicator Component
 * Shows saving status during interview
 * Implements Task 24: Fix Interview Answer Persistence
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, Cloud } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved?: string;
}

export function AutoSaveIndicator({ isSaving, lastSaved }: AutoSaveIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {isSaving ? (
        <motion.div
          key="saving"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-muted-foreground text-sm"
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </motion.div>
      ) : lastSaved ? (
        <motion.div
          key="saved"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-muted-foreground text-sm"
        >
          <Cloud className="h-3 w-3 text-primary" />
          <Check className="h-3 w-3 text-primary" />
          <span className="text-primary">Saved</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default AutoSaveIndicator;
