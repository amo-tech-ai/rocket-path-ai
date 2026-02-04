/**
 * Report Generation Progress
 * Animated 5-phase progress display during validation report generation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Search, 
  BarChart3, 
  FileText, 
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationProgressProps {
  isGenerating: boolean;
  currentPhase?: number;
  reportType: 'quick' | 'deep' | 'investor';
}

const PHASES = [
  { icon: Brain, label: 'Understanding', description: 'Analyzing your startup data' },
  { icon: Search, label: 'Researching', description: 'Gathering industry benchmarks' },
  { icon: BarChart3, label: 'Scoring', description: 'Calculating 7-dimension scores' },
  { icon: FileText, label: 'Writing', description: 'Generating 14 sections' },
  { icon: Sparkles, label: 'Finalizing', description: 'Polishing your report' },
];

export default function GenerationProgress({ 
  isGenerating, 
  currentPhase = 0,
  reportType 
}: GenerationProgressProps) {
  // Simulate phase progression during generation
  const simulatedPhase = isGenerating ? Math.min(currentPhase, PHASES.length - 1) : -1;
  
  const estimatedTime = reportType === 'quick' ? '~30 seconds' : reportType === 'deep' ? '~60 seconds' : '~45 seconds';

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="card-premium p-8 text-center"
        >
          {/* Main spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Generating Your Report
          </h3>
          <p className="text-sm text-muted-foreground mb-8">
            Estimated time: {estimatedTime}
          </p>
          
          {/* Progress phases */}
          <div className="max-w-md mx-auto space-y-3">
            {PHASES.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = index === simulatedPhase;
              const isComplete = index < simulatedPhase;
              const isPending = index > simulatedPhase;
              
              return (
                <motion.div
                  key={phase.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl transition-all",
                    isActive && "bg-primary/10 border border-primary/30",
                    isComplete && "bg-sage-light",
                    isPending && "opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isComplete && "bg-sage text-primary-foreground",
                    isPending && "bg-muted text-muted-foreground"
                  )}>
                    {isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={cn(
                      "font-medium text-sm",
                      isActive ? "text-primary" : isComplete ? "text-sage-foreground" : "text-muted-foreground"
                    )}>
                      {phase.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {phase.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Progress bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: '0%' }}
                animate={{ width: `${((simulatedPhase + 1) / PHASES.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Phase {simulatedPhase + 1} of {PHASES.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
