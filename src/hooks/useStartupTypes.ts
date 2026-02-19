/**
 * useStartupTypes Hook
 * Fetches dynamic startup types via edge function
 * Falls back to static data if database unavailable
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StartupType {
  id: string;
  label: string;
  description?: string;
}

export interface IndustryWithTypes {
  industry: string;
  display_name: string;
  icon: string;
  startup_types: StartupType[];
}

// Static fallback mapping
const STATIC_SUB_CATEGORIES: Record<string, StartupType[]> = {
  ai_saas: [
    { id: 'b2b_saas', label: 'B2B SaaS' },
    { id: 'ai_infrastructure', label: 'AI Infrastructure' },
    { id: 'vertical_ai', label: 'Vertical AI' },
    { id: 'ai_agents', label: 'AI Agents' },
    { id: 'mlops', label: 'MLOps' },
  ],
  fintech: [
    { id: 'payments', label: 'Payments' },
    { id: 'banking', label: 'Banking' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'wealth_management', label: 'Wealth Management' },
    { id: 'crypto', label: 'Crypto' },
  ],
  healthcare: [
    { id: 'digital_health', label: 'Digital Health' },
    { id: 'biotech', label: 'Biotech' },
    { id: 'medtech', label: 'MedTech' },
    { id: 'mental_health', label: 'Mental Health' },
    { id: 'telemedicine', label: 'Telemedicine' },
  ],
  education: [
    { id: 'k12', label: 'K-12' },
    { id: 'higher_ed', label: 'Higher Ed' },
    { id: 'corporate_training', label: 'Corporate Training' },
    { id: 'tutoring', label: 'Tutoring' },
    { id: 'skills_platform', label: 'Skills Platform' },
  ],
  ecommerce: [
    { id: 'd2c', label: 'D2C' },
    { id: 'b2b_marketplace', label: 'B2B Marketplace' },
    { id: 'retail_tech', label: 'Retail Tech' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'food_beverage', label: 'Food & Beverage' },
  ],
  marketplace: [
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'b2b', label: 'B2B' },
    { id: 'gig_economy', label: 'Gig Economy' },
    { id: 'local', label: 'Local' },
  ],
  enterprise: [
    { id: 'security', label: 'Security' },
    { id: 'devtools', label: 'DevTools' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'hr_tech', label: 'HR Tech' },
    { id: 'data', label: 'Data' },
  ],
  consumer: [
    { id: 'social', label: 'Social' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'travel', label: 'Travel' },
  ],
  climate: [
    { id: 'clean_energy', label: 'Clean Energy' },
    { id: 'carbon', label: 'Carbon' },
    { id: 'mobility', label: 'Mobility' },
    { id: 'agriculture', label: 'Agriculture' },
    { id: 'circular_economy', label: 'Circular Economy' },
  ],
  proptech: [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'construction', label: 'Construction' },
    { id: 'property_management', label: 'Property Management' },
    { id: 'mortgage', label: 'Mortgage' },
  ],
  logistics: [
    { id: 'freight', label: 'Freight' },
    { id: 'last_mile', label: 'Last Mile' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'supply_chain', label: 'Supply Chain' },
  ],
  logistics_supply_chain: [
    { id: 'freight', label: 'Freight' },
    { id: 'last_mile', label: 'Last Mile' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'supply_chain', label: 'Supply Chain' },
  ],
  cybersecurity: [
    { id: 'endpoint', label: 'Endpoint Security' },
    { id: 'network', label: 'Network Security' },
    { id: 'identity', label: 'Identity & Access' },
    { id: 'cloud', label: 'Cloud Security' },
    { id: 'compliance', label: 'Compliance' },
  ],
  legal_professional: [
    { id: 'legal_tech', label: 'Legal Tech' },
    { id: 'accounting', label: 'Accounting' },
    { id: 'consulting', label: 'Consulting' },
    { id: 'hr_services', label: 'HR Services' },
    { id: 'compliance', label: 'Compliance' },
  ],
  media: [
    { id: 'streaming', label: 'Streaming' },
    { id: 'news', label: 'News' },
    { id: 'creator_economy', label: 'Creator Economy' },
    { id: 'advertising', label: 'Advertising' },
    { id: 'publishing', label: 'Publishing' },
  ],
  other: [
    { id: 'other', label: 'Other' },
  ],
};

// Static industry list
const STATIC_INDUSTRIES: IndustryWithTypes[] = [
  { industry: 'ai_saas', display_name: 'AI SaaS', icon: '🤖', startup_types: STATIC_SUB_CATEGORIES.ai_saas || [] },
  { industry: 'fintech', display_name: 'FinTech', icon: '💳', startup_types: STATIC_SUB_CATEGORIES.fintech || [] },
  { industry: 'healthcare', display_name: 'Healthcare', icon: '🏥', startup_types: STATIC_SUB_CATEGORIES.healthcare || [] },
  { industry: 'education', display_name: 'Education', icon: '📚', startup_types: STATIC_SUB_CATEGORIES.education || [] },
  { industry: 'ecommerce', display_name: 'E-commerce', icon: '🛒', startup_types: STATIC_SUB_CATEGORIES.ecommerce || [] },
  { industry: 'cybersecurity', display_name: 'Cybersecurity', icon: '🔐', startup_types: STATIC_SUB_CATEGORIES.cybersecurity || [] },
  { industry: 'logistics_supply_chain', display_name: 'Logistics', icon: '📦', startup_types: STATIC_SUB_CATEGORIES.logistics_supply_chain || [] },
  { industry: 'legal_professional', display_name: 'Legal & Professional', icon: '⚖️', startup_types: STATIC_SUB_CATEGORIES.legal_professional || [] },
];

/**
 * Fetch startup types for a specific industry via edge function
 */
export function useStartupTypes(industryKey?: string) {
  return useQuery({
    queryKey: ['startup-types', industryKey],
    queryFn: async (): Promise<StartupType[]> => {
      if (!industryKey) return [];
      
      try {
        const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
          body: { action: 'get_industry_context', industry: industryKey },
        });

        if (error) {
          console.warn('[useStartupTypes] Edge function error, using fallback:', error);
          return STATIC_SUB_CATEGORIES[industryKey] || [];
        }

        // Check if context has startup_types
        if (data?.context?.startup_types && Array.isArray(data.context.startup_types)) {
          return data.context.startup_types as StartupType[];
        }

        // Fallback to static data
        return STATIC_SUB_CATEGORIES[industryKey] || [];
      } catch (err) {
        console.warn('[useStartupTypes] Fetch error, using fallback:', err);
        return STATIC_SUB_CATEGORIES[industryKey] || [];
      }
    },
    enabled: !!industryKey,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

/**
 * Fetch all industries with their startup types via edge function
 */
export function useIndustriesWithTypes() {
  return useQuery({
    queryKey: ['industries-with-types'],
    queryFn: async (): Promise<IndustryWithTypes[]> => {
      try {
        const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
          body: { action: 'get_industry_context' },
        });

        if (error) {
          console.warn('[useIndustriesWithTypes] Edge function error, using fallback:', error);
          return STATIC_INDUSTRIES;
        }

        // Edge function returns { success: true, packs: [...] }
        if (data?.packs && Array.isArray(data.packs)) {
          return data.packs.map((pack: Record<string, unknown>) => ({
            industry: pack.industry as string,
            display_name: pack.display_name as string,
            icon: (pack.icon as string) || '🏢',
            startup_types: Array.isArray(pack.startup_types) 
              ? (pack.startup_types as StartupType[])
              : [],
          }));
        }

        return STATIC_INDUSTRIES;
      } catch (err) {
        console.warn('[useIndustriesWithTypes] Fetch error, using fallback:', err);
        return STATIC_INDUSTRIES;
      }
    },
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Get static fallback sub-categories (for backward compatibility)
 */
export function getStaticSubCategories(industryKey: string): StartupType[] {
  return STATIC_SUB_CATEGORIES[industryKey] || [];
}
