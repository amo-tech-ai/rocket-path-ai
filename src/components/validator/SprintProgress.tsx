/**
 * Sprint Progress
 * Live-updating sprint progress bar with Coach sync
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCoachSync } from '@/contexts/CoachSyncContext';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2, Circle } from 'lucide-react';

interface SprintMilestone {
  id: string;
  title: string;
  completed: boolean;
}

interface SprintProgressProps {
  currentSprint: number;
  totalSprints: number;
  progress: number; // 0-100
  milestones?: SprintMilestone[];
  sprintGoal?: string;
  className?: string;
}

export default memo(function SprintProgress({
  currentSprint,
  totalSprints,
  progress,
  milestones = [],
  sprintGoal,
  className,
}: SprintProgressProps) {
  const { highlightedElement, explainElement } = useCoachSync();
  const isHighlighted = highlightedElement?.type === 'sprint';
  
  const handleClick = () => {
    explainElement('sprint', `sprint-${currentSprint}`);
  };
  
  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "card-premium p-4 w-full text-left cursor-pointer transition-all",
        isHighlighted && "ring-2 ring-primary",
        className
      )}
      animate={isHighlighted ? {
        scale: 1.01,
        boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
      } : {
        scale: 1,
        boxShadow: 'none',
      }}
      whileHover={{ scale: 1.005 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Sprint Progress</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Sprint {currentSprint}/{totalSprints}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress}% complete</span>
          <span>{sprintGoal || 'In progress'}</span>
        </div>
      </div>
      
      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Milestones</p>
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className="flex items-center gap-2 text-sm"
              >
                {milestone.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={cn(
                  milestone.completed 
                    ? "text-muted-foreground line-through" 
                    : "text-foreground"
                )}>
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Sprint Indicator Dots */}
      <div className="flex items-center gap-1 mt-4 justify-center">
        {Array.from({ length: totalSprints }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index + 1 < currentSprint 
                ? "bg-status-success"
                : index + 1 === currentSprint 
                  ? "bg-primary" 
                  : "bg-muted"
            )}
            animate={index + 1 === currentSprint ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.button>
  );
});
