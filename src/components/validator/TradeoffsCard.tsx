/**
 * Tradeoffs Card
 * Shows strengths, concerns, and next steps with click-to-explain
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCoachSync } from '@/contexts/CoachSyncContext';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface TradeoffItem {
  id: string;
  text: string;
}

interface TradeoffsCardProps {
  strengths: TradeoffItem[];
  concerns: TradeoffItem[];
  nextSteps: TradeoffItem[];
  className?: string;
}

const StrengthItem = memo(function StrengthItem({ 
  item, 
  isHighlighted, 
  onClick 
}: { 
  item: TradeoffItem; 
  isHighlighted: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex items-start gap-2 p-2 rounded-lg text-left w-full transition-all",
        "hover:bg-emerald-500/10",
        isHighlighted && "bg-emerald-500/20 ring-1 ring-emerald-500/30"
      )}
      animate={isHighlighted ? { scale: 1.02 } : { scale: 1 }}
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-foreground">{item.text}</span>
    </motion.button>
  );
});

const ConcernItem = memo(function ConcernItem({ 
  item, 
  isHighlighted, 
  onClick 
}: { 
  item: TradeoffItem; 
  isHighlighted: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex items-start gap-2 p-2 rounded-lg text-left w-full transition-all",
        "hover:bg-rose-500/10",
        isHighlighted && "bg-rose-500/20 ring-1 ring-rose-500/30"
      )}
      animate={isHighlighted ? { scale: 1.02 } : { scale: 1 }}
    >
      <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-foreground">{item.text}</span>
    </motion.button>
  );
});

const NextStepItem = memo(function NextStepItem({ 
  item, 
  index,
  onClick 
}: { 
  item: TradeoffItem; 
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-start gap-2 p-2 rounded-lg text-left w-full hover:bg-primary/10 transition-all"
      whileHover={{ x: 4 }}
    >
      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
        {index + 1}
      </span>
      <span className="text-sm text-foreground flex-1">{item.text}</span>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
    </motion.button>
  );
});

export default function TradeoffsCard({ 
  strengths, 
  concerns, 
  nextSteps,
  className 
}: TradeoffsCardProps) {
  const { highlightedElement, explainElement } = useCoachSync();
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Strengths Column */}
      <div className="card-premium p-4">
        <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Strengths
        </h3>
        <div className="space-y-1">
          {strengths.map((item) => (
            <StrengthItem
              key={item.id}
              item={item}
              isHighlighted={
                highlightedElement?.type === 'strength' && 
                highlightedElement?.id === item.id
              }
              onClick={() => explainElement('strength', item.id)}
            />
          ))}
          {strengths.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Run validation to see strengths</p>
          )}
        </div>
      </div>
      
      {/* Concerns Column */}
      <div className="card-premium p-4">
        <h3 className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Concerns
        </h3>
        <div className="space-y-1">
          {concerns.map((item) => (
            <ConcernItem
              key={item.id}
              item={item}
              isHighlighted={
                highlightedElement?.type === 'concern' && 
                highlightedElement?.id === item.id
              }
              onClick={() => explainElement('concern', item.id)}
            />
          ))}
          {concerns.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Run validation to identify concerns</p>
          )}
        </div>
      </div>
      
      {/* Next Steps Column */}
      <div className="card-premium p-4">
        <h3 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          Next Steps
        </h3>
        <div className="space-y-1">
          {nextSteps.map((item, index) => (
            <NextStepItem
              key={item.id}
              item={item}
              index={index}
              onClick={() => explainElement('evidence', item.id)}
            />
          ))}
          {nextSteps.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Complete validation for recommendations</p>
          )}
        </div>
      </div>
    </div>
  );
}
