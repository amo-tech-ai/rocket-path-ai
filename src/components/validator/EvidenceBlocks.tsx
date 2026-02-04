/**
 * Evidence Blocks
 * Clickable dimension cards with highlight animation for Coach sync
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCoachSync } from '@/contexts/CoachSyncContext';
import { 
  Lightbulb, 
  Users, 
  Rocket, 
  Shield, 
  TrendingUp, 
  DollarSign,
  Target,
  Zap
} from 'lucide-react';

const DIMENSION_ICONS: Record<string, typeof Lightbulb> = {
  problemClarity: Lightbulb,
  marketSize: Users,
  solutionFit: Rocket,
  competitiveMoat: Shield,
  traction: TrendingUp,
  unitEconomics: DollarSign,
  teamFit: Target,
  fundingFit: Zap,
};

const DIMENSION_LABELS: Record<string, string> = {
  problemClarity: 'Problem Clarity',
  marketSize: 'Market Size',
  solutionFit: 'Solution Fit',
  competitiveMoat: 'Competitive Moat',
  traction: 'Traction',
  unitEconomics: 'Unit Economics',
  teamFit: 'Team Fit',
  fundingFit: 'Funding Fit',
};

interface EvidenceBlockProps {
  dimension: string;
  score: number;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const EvidenceBlock = memo(function EvidenceBlock({ 
  dimension, 
  score, 
  isHighlighted,
  onClick,
}: EvidenceBlockProps) {
  const Icon = DIMENSION_ICONS[dimension] || Lightbulb;
  const label = DIMENSION_LABELS[dimension] || dimension;
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border text-left transition-all cursor-pointer",
        "hover:border-primary/50 hover:bg-primary/5",
        isHighlighted 
          ? "border-primary bg-primary/10 ring-2 ring-primary/30" 
          : "border-border bg-card"
      )}
      animate={isHighlighted ? {
        scale: 1.02,
        boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
      } : {
        scale: 1,
        boxShadow: 'none',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          isHighlighted ? "bg-primary/20" : "bg-muted"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            isHighlighted ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{label}</p>
          <p className={cn("text-lg font-bold", getScoreColor(score))}>
            {score}/10
          </p>
        </div>
      </div>
    </motion.button>
  );
});

interface EvidenceBlocksProps {
  scores: Record<string, number>;
  className?: string;
}

export default function EvidenceBlocks({ scores, className }: EvidenceBlocksProps) {
  const { highlightedElement, explainElement, liveScores } = useCoachSync();
  
  const handleBlockClick = (dimension: string) => {
    explainElement('dimension', dimension);
  };
  
  // Merge live scores with static scores
  const mergedScores = { ...scores, ...liveScores };
  
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
      {Object.entries(mergedScores).map(([dimension, score]) => (
        <EvidenceBlock
          key={dimension}
          dimension={dimension}
          score={score}
          isHighlighted={
            highlightedElement?.type === 'dimension' && 
            highlightedElement?.id === dimension
          }
          onClick={() => handleBlockClick(dimension)}
        />
      ))}
    </div>
  );
}
