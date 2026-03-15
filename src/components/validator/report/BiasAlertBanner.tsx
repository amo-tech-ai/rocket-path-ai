import { AlertTriangle } from 'lucide-react';

interface BiasFlag {
  bias_type: string;
  evidence_phrase?: string;
  counter_question?: string;
  description?: string;
  affected_dimensions?: string[];
}

interface BiasAlertBannerProps {
  biasFlags?: BiasFlag[];
}

const BIAS_LABELS: Record<string, string> = {
  confirmation: 'Confirmation Bias',
  optimism: 'Optimism Bias',
  sunk_cost: 'Sunk Cost Bias',
  survivorship: 'Survivorship Bias',
  anchoring: 'Anchoring Bias',
  bandwagon: 'Bandwagon Bias',
};

export function BiasAlertBanner({ biasFlags }: BiasAlertBannerProps) {
  if (!biasFlags?.length) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 space-y-2">
      <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>{biasFlags.length} bias signal{biasFlags.length > 1 ? 's' : ''} detected</span>
      </div>
      <div className="space-y-1.5 pl-6">
        {biasFlags.map((flag, i) => (
          <div key={i} className="text-xs text-amber-700">
            <span className="font-medium">{BIAS_LABELS[flag.bias_type] || flag.bias_type}</span>
            {flag.evidence_phrase && (
              <span className="text-amber-600"> &mdash; &ldquo;{flag.evidence_phrase}&rdquo;</span>
            )}
            {flag.description && (
              <span className="text-amber-600"> &mdash; {flag.description}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
