import { motion } from "framer-motion";
import { AlertCircle, Lightbulb } from "lucide-react";

interface AnalysisScreenProps {
  uiState: string | null;
  isCompleted?: boolean;
}

const AnalysisScreen = ({ uiState, isCompleted = false }: AnalysisScreenProps) => {
  const score = 72;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-display text-xl font-medium text-foreground">
          Startup Readiness Analysis
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your profile
        </p>
      </div>

      {/* Score Section */}
      <div className="p-4 rounded-xl border border-border bg-secondary/20">
        <p className="text-sm text-muted-foreground mb-2">Readiness Score</p>
        
        {/* Large Score */}
        <div className="flex items-baseline gap-1 mb-3">
          <motion.span
            className="font-display text-4xl font-medium text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {score}
          </motion.span>
          <span className="text-xl text-muted-foreground">/100</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sage to-sage/80"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Detected Gaps</p>
        
        {[
          { label: 'Market Validation', status: 'Weak' },
          { label: 'Traction Metrics', status: 'Missing' },
          { label: 'Pricing Strategy', status: 'Undefined' },
        ].map((gap, index) => (
          <motion.div
            key={gap.label}
            className="flex items-center gap-3 text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <AlertCircle className="w-4 h-4 text-accent" />
            <span className="text-foreground">{gap.label}</span>
            <span className="text-muted-foreground">— {gap.status}</span>
          </motion.div>
        ))}
      </div>

      {/* AI Intelligence Panel */}
      <motion.div
        className="p-4 rounded-xl bg-secondary/40 border border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-sage" />
          <span className="text-sm font-medium text-foreground">AI Intelligence</span>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Your technical foundation is strong, but market positioning needs clarity.
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-sage">→</span>
          <span className="text-foreground">Define pricing tiers</span>
          <span className="px-2 py-0.5 rounded-full bg-sage/10 text-sage text-xs font-medium">
            +18 pts
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisScreen;
