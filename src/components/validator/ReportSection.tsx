import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ReportSectionProps {
  number: number;
  title: string;
  content?: string;
  agent: string;
  verified: boolean;
  citations?: string[];
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ReportSection({
  number,
  title,
  content,
  agent,
  verified,
  citations,
  children,
  defaultExpanded = true,
}: ReportSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.05 }}
      className="card-premium overflow-hidden"
    >
      {/* Header - always visible, clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">
            {number}
          </span>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {verified && (
            <Badge variant="outline" className="text-xs text-status-success">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {agent}
            </Badge>
          )}
          {citations && citations.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {citations.length} sources
            </Badge>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Content - collapsible */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {content && (
                <p className="text-muted-foreground whitespace-pre-line">{content}</p>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
