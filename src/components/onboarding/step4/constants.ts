// Step 4 Review constants and utilities

// Traction/funding display helpers - aligned with backend storage
export const MRR_LABELS: Record<string, string> = {
  'pre_revenue': 'Pre-revenue',
  '0_1k': '$0 - $1K',
  '1k_10k': '$1K - $10K',
  '10k_50k': '$10K - $50K',
  '50k_100k': '$50K - $100K',
  '100k_plus': '$100K+',
};

export const GROWTH_LABELS: Record<string, string> = {
  'negative': 'Declining',
  '0_5': '0-5% MoM',
  '5_10': '5-10% MoM',
  '10_20': '10-20% MoM',
  '20_plus': '20%+ MoM',
};

export const USERS_LABELS: Record<string, string> = {
  '0_100': '0-100',
  '100_1k': '100-1K',
  '1k_10k': '1K-10K',
  '10k_100k': '10K-100K',
  '100k_plus': '100K+',
};

export const MAX_SCORES: Record<string, number> = {
  team: 25,
  traction: 25,
  market: 20,
  product: 15,
  fundraising: 15,
};

export function parseTractionValue(
  value: unknown, 
  labels: Record<string, string>, 
  fallback = 'Not set'
): string {
  if (typeof value === 'string' && labels[value]) {
    return labels[value];
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return fallback;
}

export function parseFundingStatus(extracted_funding?: Record<string, unknown>): string {
  if (!extracted_funding) return 'Not set';
  
  const isRaising = extracted_funding.is_raising;
  const targetAmount = extracted_funding.target_amount;
  
  if (isRaising === false || isRaising === 'no') {
    return 'Not raising';
  }
  if (isRaising === true || isRaising === 'yes') {
    if (typeof targetAmount === 'number') {
      return `Raising $${targetAmount.toLocaleString()}`;
    }
    if (typeof targetAmount === 'string') {
      return `Raising ${targetAmount}`;
    }
    return 'Currently raising';
  }
  return 'Not set';
}

export function getScoreLabel(score: number) {
  if (score >= 85) return { label: 'EXCELLENT', sublabel: 'Ready for Series A talks', color: 'text-primary' };
  if (score >= 70) return { label: 'STRONG', sublabel: 'Ready for Seed talks', color: 'text-primary/90' };
  if (score >= 55) return { label: 'GOOD', sublabel: 'Building momentum', color: 'text-primary/80' };
  if (score >= 40) return { label: 'FAIR', sublabel: 'Keep building', color: 'text-muted-foreground' };
  return { label: 'EARLY', sublabel: 'Focus on fundamentals', color: 'text-destructive' };
}
