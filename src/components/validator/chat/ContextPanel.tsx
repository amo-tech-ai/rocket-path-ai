import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FollowupCoverage } from '@/hooks/useValidatorFollowup';

interface ContextPanelProps {
  coverage: FollowupCoverage | null;
  messageCount: number;
}

const FIELD_CONFIG = [
  { key: 'customer', label: 'Target Customer', icon: '\u{1F465}' },
  { key: 'problem', label: 'Problem Statement', icon: '\u{1F3AF}' },
  { key: 'competitors', label: 'Competition', icon: '\u2694\uFE0F' },
  { key: 'innovation', label: 'Innovation', icon: '\u{1F4A1}' },
  { key: 'demand', label: 'Market Demand', icon: '\u{1F4C8}' },
  { key: 'research', label: 'Research/Evidence', icon: '\u{1F52C}' },
  { key: 'uniqueness', label: 'Unique Value', icon: '\u2728' },
  { key: 'websites', label: 'References', icon: '\u{1F517}' },
] as const;

export function ContextPanel({ coverage, messageCount }: ContextPanelProps) {
  const coveredCount = coverage
    ? Object.values(coverage).filter(Boolean).length
    : 0;

  const missingFields = FIELD_CONFIG.filter(
    f => !coverage?.[f.key as keyof FollowupCoverage]
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Extraction Progress</h3>
        <p className="text-xs text-muted-foreground">
          {coveredCount}/8 fields covered · {messageCount} messages
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(coveredCount / 8) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Covered fields */}
      <div className="space-y-1.5">
        {FIELD_CONFIG.map(({ key, label, icon }) => {
          const covered = coverage?.[key as keyof FollowupCoverage] ?? false;
          return (
            <motion.div
              key={key}
              layout
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                covered ? 'bg-primary/5 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="flex-1 truncate">{label}</span>
              {covered ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-1.5 py-0">
                  <CheckCircle2 className="w-3 h-3 mr-0.5" />
                  Captured
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground/50 text-[10px] px-1.5 py-0">
                  <Circle className="w-3 h-3 mr-0.5" />
                  Needed
                </Badge>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Missing fields summary */}
      {missingFields.length > 0 && missingFields.length < 8 && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-amber-500">Still needed</span>
              <p className="text-xs text-muted-foreground mt-1">
                {missingFields.map(f => f.label).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            The more details you provide, the stronger your validation report will be.
          </p>
        </div>
      </div>
    </div>
  );
}
