import { cn } from '@/lib/utils';
import { CheckCircle2, User, Bot } from 'lucide-react';

type EvidenceTier = 'cited' | 'founder' | 'ai_inferred';

interface EvidenceTierBadgeProps {
  tier: EvidenceTier;
  className?: string;
}

const TIER_CONFIG: Record<EvidenceTier, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  cited: { label: 'Cited', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  founder: { label: 'Founder', icon: User, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  ai_inferred: { label: 'AI', icon: Bot, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
};

export function EvidenceTierBadge({ tier, className }: EvidenceTierBadgeProps) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border', config.bg, config.color, className)}>
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </span>
  );
}

/** Infer evidence tier from a scoring result's evidence_grades */
export function inferEvidenceTier(grades?: Array<{ grade?: string }>): EvidenceTier {
  if (!grades?.length) return 'ai_inferred';
  const best = grades.reduce((best, g) => {
    const rank = g.grade === 'A' ? 3 : g.grade === 'B' ? 2 : g.grade === 'C' ? 1 : 0;
    return rank > best ? rank : best;
  }, 0);
  if (best >= 2) return 'cited';
  if (best >= 1) return 'founder';
  return 'ai_inferred';
}
