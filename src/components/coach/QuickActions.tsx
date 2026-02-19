/**
 * Quick Actions
 * Suggested action buttons for coach chat
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  actions: string[];
  onSelect: (action: string) => void;
  disabled?: boolean;
}

export default function QuickActions({ actions, onSelect, disabled }: QuickActionsProps) {
  if (actions.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {actions.map((action, index) => (
        <motion.div
          key={action}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(action)}
            disabled={disabled}
            className="text-xs h-8 hover:bg-primary/5 hover:border-primary/30"
          >
            {action}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
