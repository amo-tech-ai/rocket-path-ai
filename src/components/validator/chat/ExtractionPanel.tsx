import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FollowupCoverage } from '@/hooks/useValidatorFollowup';

interface ExtractionPanelProps {
  coverage: FollowupCoverage | null;
  canGenerate: boolean;
  onSuggestionClick?: (text: string) => void;
}

const COVERAGE_GROUPS = [
  {
    label: 'Problem-Solution Fit',
    fields: ['problem', 'customer', 'innovation'] as const,
    color: 'bg-blue-500',
  },
  {
    label: 'Market Validation',
    fields: ['competitors', 'demand', 'research'] as const,
    color: 'bg-emerald-500',
  },
  {
    label: 'Differentiation',
    fields: ['uniqueness', 'websites'] as const,
    color: 'bg-amber-500',
  },
];

export function ExtractionPanel({ coverage, canGenerate, onSuggestionClick }: ExtractionPanelProps) {
  const getGroupScore = (fields: readonly string[]) => {
    if (!coverage) return 0;
    const covered = fields.filter(f => coverage[f as keyof FollowupCoverage]).length;
    return Math.round((covered / fields.length) * 100);
  };

  const overallScore = coverage
    ? Math.round((Object.values(coverage).filter(Boolean).length / 8) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Validation Readiness</h3>
        <p className="text-xs text-muted-foreground">
          How ready your idea is for full analysis
        </p>
      </div>

      {/* Overall score */}
      <div className="p-4 rounded-lg bg-card border border-border text-center">
        <motion.div
          className="text-3xl font-bold text-foreground"
          key={overallScore}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {overallScore}%
        </motion.div>
        <p className="text-xs text-muted-foreground mt-1">Coverage Score</p>
      </div>

      {/* Group scores */}
      <div className="space-y-3">
        {COVERAGE_GROUPS.map((group) => {
          const score = getGroupScore(group.fields);
          return (
            <div key={group.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{group.label}</span>
                <span className="text-xs text-muted-foreground">{score}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${group.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestions as clickable chips */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Quick prompts
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {!coverage?.customer && (
            <SuggestionChip
              text="My target customer is..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.problem && (
            <SuggestionChip
              text="The problem I'm solving is..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.competitors && (
            <SuggestionChip
              text="Current alternatives include..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.demand && (
            <SuggestionChip
              text="I know there's demand because..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.innovation && (
            <SuggestionChip
              text="What makes us different is..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.research && (
            <SuggestionChip
              text="I've validated this by..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.uniqueness && (
            <SuggestionChip
              text="Our unique advantage is..."
              onClick={onSuggestionClick}
            />
          )}
          {!coverage?.websites && (
            <SuggestionChip
              text="Check out these links..."
              onClick={onSuggestionClick}
            />
          )}
        </div>
        {overallScore >= 50 && !canGenerate && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 text-xs text-primary">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Keep going — a few more details will unlock Generate</span>
          </div>
        )}
      </div>

      {/* Generate CTA */}
      {canGenerate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ready to generate!</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Click Generate in the chat to create your validation report.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SuggestionChip({ text, onClick }: { text: string; onClick?: (text: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(text)}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 text-xs text-muted-foreground transition-colors cursor-pointer"
    >
      <Sparkles className="w-3 h-3" />
      {text}
    </button>
  );
}
