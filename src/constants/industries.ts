/**
 * Universal Industry Categories
 * Broad, scalable categories for startup classification
 */

export interface IndustryOption {
  id: string;
  label: string;
  icon: string;
}

export const UNIVERSAL_INDUSTRIES: IndustryOption[] = [
  { id: 'saas_software', label: 'SaaS & Software', icon: '💻' },
  { id: 'ai_data', label: 'Artificial Intelligence & Data', icon: '🤖' },
  { id: 'fintech_payments', label: 'FinTech & Payments', icon: '💳' },
  { id: 'ecommerce_marketplaces', label: 'E-commerce & Marketplaces', icon: '🛒' },
  { id: 'healthcare_life_sciences', label: 'Healthcare & Life Sciences', icon: '🏥' },
  { id: 'education_learning', label: 'Education & Learning', icon: '📚' },
  { id: 'media_content_creator', label: 'Media, Content & Creator Economy', icon: '🎬' },
  { id: 'enterprise_b2b', label: 'Enterprise & B2B Solutions', icon: '🏢' },
  { id: 'consumer_apps', label: 'Consumer Apps & Platforms', icon: '📱' },
  { id: 'logistics_mobility', label: 'Logistics, Supply Chain & Mobility', icon: '🚚' },
  { id: 'real_estate', label: 'Real Estate', icon: '🏠' },
  { id: 'gaming_entertainment', label: 'Gaming & Entertainment', icon: '🎮' },
];

// Mapping from enum ID to display label
export const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
  UNIVERSAL_INDUSTRIES.map(ind => [ind.id, ind.label])
);

// Get industry by ID
export function getIndustryById(id: string): IndustryOption | undefined {
  return UNIVERSAL_INDUSTRIES.find(ind => ind.id === id);
}

// Get label by ID (with fallback)
export function getIndustryLabel(id: string): string {
  return INDUSTRY_LABELS[id] || id;
}
