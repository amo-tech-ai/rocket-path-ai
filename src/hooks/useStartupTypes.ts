/**
 * useStartupTypes Hook
 * Fetches dynamic startup types from industry_packs for pitch deck sub-categories
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
  edtech: [
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

/**
 * Fetch startup types for a specific industry
 */
export function useStartupTypes(industryKey?: string) {
  return useQuery({
    queryKey: ['startup-types', industryKey],
    queryFn: async (): Promise<StartupType[]> => {
      if (!industryKey) return [];
      
      // First try to fetch from database
      const { data: pack, error } = await supabase
        .from('industry_packs')
        .select('startup_types')
        .eq('industry', industryKey)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.warn('[useStartupTypes] Database error, using fallback:', error);
        return STATIC_SUB_CATEGORIES[industryKey] || [];
      }
      
      if (pack?.startup_types && Array.isArray(pack.startup_types) && pack.startup_types.length > 0) {
        // Safely cast the JSON array to StartupType[]
        const types = pack.startup_types as unknown as StartupType[];
        return types.filter(t => t && typeof t === 'object' && 'id' in t && 'label' in t);
      }
      
      // Fallback to static data
      return STATIC_SUB_CATEGORIES[industryKey] || [];
    },
    enabled: !!industryKey,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

/**
 * Fetch all industries with their startup types
 */
export function useIndustriesWithTypes() {
  return useQuery({
    queryKey: ['industries-with-types'],
    queryFn: async (): Promise<IndustryWithTypes[]> => {
      const { data: packs, error } = await supabase
        .from('industry_packs')
        .select('industry, display_name, icon, startup_types')
        .eq('is_active', true)
        .order('display_name');
      
      if (error) {
        console.warn('[useIndustriesWithTypes] Database error:', error);
        return [];
      }
      
      return (packs || []).map(pack => {
        // Safely cast startup_types
        const types = Array.isArray(pack.startup_types) 
          ? (pack.startup_types as unknown as StartupType[]).filter(
              t => t && typeof t === 'object' && 'id' in t && 'label' in t
            )
          : [];
        
        return {
          industry: pack.industry,
          display_name: pack.display_name,
          icon: pack.icon || '🏢',
          startup_types: types,
        };
      });
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
