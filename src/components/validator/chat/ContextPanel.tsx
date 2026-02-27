import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText, AlertCircle, Minus, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { FollowupCoverage, CoverageDepth, ConfidenceLevel, ExtractedFields, ConfidenceMap } from '@/hooks/useValidatorFollowup';
import { isCovered, isDeep, countAtDepth, countAtDepthForKeys, isCoreComplete, CORE_TOPIC_KEYS, DEEP_DIVE_TOPIC_KEYS } from '@/hooks/useValidatorFollowup';

interface ContextPanelProps {
  coverage: FollowupCoverage | null;
  extracted?: ExtractedFields | null;
  confidence?: ConfidenceMap | null;
  messageCount: number;
}

const CORE_FIELDS = [
  { key: 'company_name', label: 'Company Name', icon: '\u{1F3E2}' },
  { key: 'problem', label: 'Problem Statement', icon: '\u{1F3AF}' },
  { key: 'solution', label: 'Solution', icon: '\u{1F4A1}' },
  { key: 'customer', label: 'Target Customer', icon: '\u{1F465}' },
  { key: 'competitors', label: 'Competition', icon: '\u2694\uFE0F' },
  { key: 'websites', label: 'References', icon: '\u{1F517}' },
  { key: 'industry', label: 'Industry', icon: '\u{1F3ED}' },
  { key: 'business_model', label: 'Business Model', icon: '\u{1F4B0}' },
  { key: 'stage', label: 'Stage', icon: '\u{1F680}' },
  { key: 'innovation', label: 'Innovation', icon: '\u2728' },
  { key: 'uniqueness', label: 'Unique Value', icon: '\u{1F6E1}\uFE0F' },
  { key: 'demand', label: 'Market Demand', icon: '\u{1F4C8}' },
  { key: 'research', label: 'Research/Evidence', icon: '\u{1F52C}' },
] as const;

const DEEP_DIVE_FIELDS = [
  { key: 'ai_strategy', label: 'AI/Tech Strategy', icon: '\u{1F916}' },
  { key: 'execution_plan', label: 'Execution Plan', icon: '\u{1F4CB}' },
  { key: 'risk_awareness', label: 'Risk Awareness', icon: '\u26A0\uFE0F' },
  { key: 'investor_readiness', label: 'Investor Ready', icon: '\u{1F4BC}' },
] as const;

const FIELD_CONFIG = [...CORE_FIELDS, ...DEEP_DIVE_FIELDS] as const;

const DEPTH_CONFIG: Record<CoverageDepth, { label: string; badgeClass: string; barClass: string; barWidth: string }> = {
  none: {
    label: 'Needed',
    badgeClass: 'text-muted-foreground border-muted-foreground/20',
    barClass: 'bg-slate-300 dark:bg-slate-600',
    barWidth: '0%',
  },
  shallow: {
    label: 'Shallow',
    badgeClass: 'bg-status-warning-light text-status-warning border-status-warning/20',
    barClass: 'bg-status-warning',
    barWidth: '60%',
  },
  deep: {
    label: 'Deep',
    badgeClass: 'bg-status-success-light text-status-success border-status-success/20',
    barClass: 'bg-status-success',
    barWidth: '100%',
  },
};

const CONFIDENCE_CONFIG: Record<ConfidenceLevel, { label: string; badgeClass: string; Icon: typeof ShieldCheck }> = {
  low: {
    label: 'Low',
    badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20',
    Icon: ShieldAlert,
  },
  medium: {
    label: 'Med',
    badgeClass: 'bg-status-warning-light text-status-warning border-status-warning/20',
    Icon: Shield,
  },
  high: {
    label: 'High',
    badgeClass: 'bg-status-success-light text-status-success border-status-success/20',
    Icon: ShieldCheck,
  },
};

/** Maps extracted field keys to coverage topic keys */
const EXTRACTED_TO_COVERAGE: Record<string, string> = {
  company_name: 'company_name',
  problem: 'problem',
  customer: 'customer',
  solution: 'solution',
  differentiation: 'uniqueness',
  demand: 'demand',
  competitors: 'competitors',
  business_model: 'business_model',
  websites: 'websites',
  industry_categories: 'industry',
  stage: 'stage',
  linkedin_url: 'websites',
  ai_strategy: 'ai_strategy',
  risk_awareness: 'risk_awareness',
  execution_plan: 'execution_plan',
  investor_readiness: 'investor_readiness',
};

function getDepth(coverage: FollowupCoverage | null, key: string): CoverageDepth {
  if (!coverage) return 'none';
  const val = coverage[key as keyof FollowupCoverage];
  if (typeof val === 'boolean') return val ? 'shallow' : 'none';
  return val || 'none';
}

export function ContextPanel({ coverage, extracted, confidence, messageCount }: ContextPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  // Core topic stats
  const coreCoveredCount = coverage ? countAtDepthForKeys(coverage, 'shallow', CORE_TOPIC_KEYS) : 0;
  const coreDeepCount = coverage ? countAtDepthForKeys(coverage, 'deep', CORE_TOPIC_KEYS) : 0;
  const coreComplete = coverage ? isCoreComplete(coverage) : false;

  // Deep dive topic stats
  const deepDiveCoveredCount = coverage ? countAtDepthForKeys(coverage, 'shallow', DEEP_DIVE_TOPIC_KEYS) : 0;
  const deepDiveDeepCount = coverage ? countAtDepthForKeys(coverage, 'deep', DEEP_DIVE_TOPIC_KEYS) : 0;

  const shallowCoreFields = CORE_FIELDS.filter(f => getDepth(coverage, f.key) === 'shallow');
  const noneCoreFields = CORE_FIELDS.filter(f => getDepth(coverage, f.key) === 'none');

  return (
    <div className="space-y-4" role="region" aria-label="Coverage tracking">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Coverage Depth</h3>
        <p className="text-xs text-muted-foreground">
          Core: {coreCoveredCount}/{CORE_FIELDS.length} · Deep dive: {deepDiveCoveredCount}/{DEEP_DIVE_FIELDS.length} · {messageCount} messages
        </p>
      </div>

      {/* Core progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Core Topics</span>
          <span className="text-[10px] text-muted-foreground">{coreCoveredCount}/{CORE_FIELDS.length}</span>
        </div>
        <div
          className="h-1.5 bg-muted rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Core coverage progress"
          aria-valuenow={Math.round(((coreDeepCount + (coreCoveredCount - coreDeepCount) * 0.5) / CORE_FIELDS.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full bg-status-success rounded-full"
            initial={shouldReduceMotion ? false : { width: 0 }}
            animate={{ width: `${((coreDeepCount + (coreCoveredCount - coreDeepCount) * 0.5) / CORE_FIELDS.length) * 100}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          />
        </div>
      </div>

      {/* Core field depth bars */}
      <div className="space-y-1.5">
        {CORE_FIELDS.map(({ key, label, icon }) => {
          const depth = getDepth(coverage, key);
          const config = DEPTH_CONFIG[depth];
          const DepthIcon = depth === 'deep' ? CheckCircle2 : depth === 'shallow' ? Minus : Circle;

          return (
            <motion.div
              key={key}
              layout={!shouldReduceMotion}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                depth !== 'none' ? 'bg-primary/5 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="flex-1 truncate">{label}</span>

              {/* Mini depth bar */}
              <div
                className="w-12 h-1.5 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-label={`${label} coverage`}
                aria-valuenow={depth === 'deep' ? 100 : depth === 'shallow' ? 60 : 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className={`h-full rounded-full ${config.barClass}`}
                  initial={shouldReduceMotion ? false : { width: 0 }}
                  animate={{ width: config.barWidth }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                />
              </div>

              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.badgeClass}`}>
                <DepthIcon className="w-3 h-3 mr-0.5" />
                {config.label}
              </Badge>
            </motion.div>
          );
        })}
      </div>

      {/* Core complete milestone */}
      {coreComplete && (
        <div className="p-3 rounded-lg bg-status-success-light border border-status-success/20">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-status-success">Core interview complete!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generate your report now, or continue for deeper analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deep dive section */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Deep Dive (Optional)</span>
          <span className="text-[10px] text-muted-foreground">{deepDiveCoveredCount}/{DEEP_DIVE_FIELDS.length}</span>
        </div>
        {deepDiveCoveredCount > 0 && (
          <div
            className="h-1 bg-muted rounded-full overflow-hidden mb-2"
            role="progressbar"
            aria-label="Deep dive coverage progress"
            aria-valuenow={Math.round((deepDiveCoveredCount / DEEP_DIVE_FIELDS.length) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full bg-primary/60 rounded-full"
              initial={shouldReduceMotion ? false : { width: 0 }}
              animate={{ width: `${(deepDiveCoveredCount / DEEP_DIVE_FIELDS.length) * 100}%` }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            />
          </div>
        )}
        <div className="space-y-1.5">
          {DEEP_DIVE_FIELDS.map(({ key, label, icon }) => {
            const depth = getDepth(coverage, key);
            const config = DEPTH_CONFIG[depth];
            const DepthIcon = depth === 'deep' ? CheckCircle2 : depth === 'shallow' ? Minus : Circle;

            return (
              <motion.div
                key={key}
                layout={!shouldReduceMotion}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  depth !== 'none' ? 'bg-primary/5 text-foreground' : 'text-muted-foreground'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span className="flex-1 truncate">{label}</span>

                <div
                  className="w-10 h-1.5 bg-muted rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={`${label} coverage`}
                  aria-valuenow={depth === 'deep' ? 100 : depth === 'shallow' ? 60 : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    className={`h-full rounded-full ${config.barClass}`}
                    initial={shouldReduceMotion ? false : { width: 0 }}
                    animate={{ width: config.barWidth }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                  />
                </div>

                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.badgeClass}`}>
                  <DepthIcon className="w-3 h-3 mr-0.5" />
                  {config.label}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Guidance: what to improve next (core topics only) */}
      {shallowCoreFields.length > 0 && (
        <div className="p-3 rounded-lg bg-status-warning-light border border-status-warning/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-status-warning">Could go deeper</span>
              <p className="text-xs text-muted-foreground mt-1">
                {shallowCoreFields.map(f => f.label).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {noneCoreFields.length > 0 && noneCoreFields.length < CORE_FIELDS.length && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-muted-foreground">Not yet discussed</span>
              <p className="text-xs text-muted-foreground mt-1">
                {noneCoreFields.map(f => f.label).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {noneCoreFields.length === 0 && shallowCoreFields.length === 0 && !coreComplete && (
        <div className="p-3 rounded-lg bg-status-success-light border border-status-success/20">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success mt-0.5 flex-shrink-0" />
            <p className="text-xs text-status-success">
              All core topics covered in depth. Ready for validation!
            </p>
          </div>
        </div>
      )}

      {/* Extracted fields with confidence badges */}
      {extracted && hasExtractedContent(extracted) && (
        <div className="pt-2 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Captured Details</h3>
          <div className="space-y-2">
            {EXTRACTED_FIELD_CONFIG.map(({ key, label }) => {
              const value = extracted[key as keyof ExtractedFields];
              if (!value) return null;
              const conf = confidence?.[key as keyof ConfidenceMap] || 'low';
              const confConfig = CONFIDENCE_CONFIG[conf];
              const ConfIcon = confConfig.Icon;
              return (
                <motion.div
                  key={key}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-medium text-foreground">{label}</span>
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 ${confConfig.badgeClass}`}>
                      <ConfIcon className="w-2.5 h-2.5 mr-0.5" />
                      {confConfig.label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-snug pl-0.5">{value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const EXTRACTED_FIELD_CONFIG = [
  { key: 'company_name', label: 'Company' },
  { key: 'problem', label: 'Problem' },
  { key: 'customer', label: 'Customer' },
  { key: 'solution', label: 'Solution' },
  { key: 'differentiation', label: 'Differentiator' },
  { key: 'competitors', label: 'Competitors' },
  { key: 'demand', label: 'Demand' },
  { key: 'business_model', label: 'Business Model' },
  { key: 'industry_categories', label: 'Industry' },
  { key: 'stage', label: 'Stage' },
  { key: 'websites', label: 'URLs' },
  { key: 'linkedin_url', label: 'LinkedIn' },
  { key: 'ai_strategy', label: 'AI/Tech Strategy' },
  { key: 'risk_awareness', label: 'Risk Awareness' },
  { key: 'execution_plan', label: 'Execution Plan' },
  { key: 'investor_readiness', label: 'Investor Readiness' },
];

function hasExtractedContent(extracted: ExtractedFields): boolean {
  return Object.values(extracted).some(v => v && v.trim().length > 0);
}
