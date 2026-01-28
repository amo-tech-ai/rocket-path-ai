/**
 * Startup Type Selector
 * Allows selection of specific startup type within an industry
 */

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StartupType } from '@/hooks/useIndustryPacks';

interface StartupTypeSelectorProps {
  industryName: string;
  startupTypes: StartupType[];
  selectedType: StartupType | null;
  onSelect: (type: StartupType) => void;
}

export function StartupTypeSelector({
  industryName,
  startupTypes,
  selectedType,
  onSelect,
}: StartupTypeSelectorProps) {
  if (startupTypes.length === 0) return null;

  return (
    <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium">
          What type of {industryName} startup are you building?
        </h4>
      </div>

      {/* Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {startupTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => onSelect(type)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              'relative p-3 rounded-lg border text-left transition-all duration-200',
              selectedType?.id === type.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-primary/50 bg-background'
            )}
          >
            {/* Selected indicator */}
            {selectedType?.id === type.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </motion.div>
            )}

            <div className="space-y-1 pr-6">
              <span className={cn(
                'font-medium text-sm',
                selectedType?.id === type.id ? 'text-primary' : 'text-foreground'
              )}>
                {type.label}
              </span>
              {type.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {type.description}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Skip option */}
      <button
        onClick={() => onSelect({ id: 'other', label: 'Other', description: 'Not listed above' })}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        None of these apply →
      </button>
    </div>
  );
}
