// Step 3 Interview constants and utilities

export const SIGNAL_LABELS: Record<string, { label: string; color: string }> = {
  b2b_saas: { label: 'B2B SaaS', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  has_revenue: { label: 'Has Revenue', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  pre_revenue: { label: 'Pre-Revenue', color: 'bg-muted text-muted-foreground' },
  raising_seed: { label: 'Raising Seed', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  technical_founder: { label: 'Technical Team', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  early_traction: { label: 'Early Traction', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
  product_market_fit: { label: 'PMF Signals', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
};

export const TOPICS = ['Business Model', 'Market', 'Traction', 'Team', 'Funding'] as const;

// Normalize topic strings for comparison (handles "Business Model" vs "business_model" vs "businessmodel")
export const normalizeTopic = (s: string): string => s.trim().toLowerCase().replace(/[\s_-]+/g, '');
