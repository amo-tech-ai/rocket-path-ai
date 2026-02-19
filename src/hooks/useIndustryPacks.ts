/**
 * useIndustryPacks Hook
 * Fetches industry packs via edge function to bypass type generation issues
 * Falls back to static data if edge function unavailable
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// Types
// ============================================================================

export interface StartupType {
  id: string;
  label: string;
  description?: string;
}

export interface IndustryPack {
  id: string;
  industry: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  startup_types: StartupType[] | null;
  is_active: boolean;
  benchmarks?: Record<string, unknown>;
  terminology?: { term: string; definition: string }[];
}

// Static fallback data for core industries
const STATIC_INDUSTRY_PACKS: IndustryPack[] = [
  { id: '1', industry: 'ai_saas', display_name: 'AI SaaS', description: 'AI-powered software as a service', icon: '🤖', startup_types: null, is_active: true },
  { id: '2', industry: 'fintech', display_name: 'FinTech', description: 'Financial technology', icon: '💳', startup_types: null, is_active: true },
  { id: '3', industry: 'healthcare', display_name: 'Healthcare', description: 'Healthcare and medical technology', icon: '🏥', startup_types: null, is_active: true },
  { id: '4', industry: 'education', display_name: 'Education', description: 'Educational technology', icon: '📚', startup_types: null, is_active: true },
  { id: '5', industry: 'ecommerce', display_name: 'E-commerce', description: 'Online retail and commerce', icon: '🛒', startup_types: null, is_active: true },
  { id: '6', industry: 'cybersecurity', display_name: 'Cybersecurity', description: 'Security technology', icon: '🔐', startup_types: null, is_active: true },
  { id: '7', industry: 'logistics_supply_chain', display_name: 'Logistics & Supply Chain', description: 'Supply chain and logistics', icon: '📦', startup_types: null, is_active: true },
  { id: '8', industry: 'legal_professional', display_name: 'Legal & Professional', description: 'Professional services technology', icon: '⚖️', startup_types: null, is_active: true },
  { id: '9', industry: 'retail_ecommerce', display_name: 'Retail & E-commerce', description: 'Retail technology', icon: '🏪', startup_types: null, is_active: true },
  { id: '10', industry: 'travel_hospitality', display_name: 'Travel & Hospitality', description: 'Travel and hospitality tech', icon: '✈️', startup_types: null, is_active: true },
  { id: '11', industry: 'events_management', display_name: 'Events Management', description: 'Event technology', icon: '🎉', startup_types: null, is_active: true },
  { id: '12', industry: 'crm_social_media', display_name: 'CRM & Social Media', description: 'Customer relationship and social', icon: '📱', startup_types: null, is_active: true },
  { id: '13', industry: 'financial_services', display_name: 'Financial Services', description: 'Financial services technology', icon: '🏦', startup_types: null, is_active: true },
  { id: '14', industry: 'content_marketing', display_name: 'Content Marketing', description: 'Content and marketing tech', icon: '📝', startup_types: null, is_active: true },
  { id: '15', industry: 'sales_marketing_ai', display_name: 'Sales & Marketing AI', description: 'AI for sales and marketing', icon: '📈', startup_types: null, is_active: true },
  { id: '16', industry: 'fashion_apparel', display_name: 'Fashion & Apparel', description: 'Fashion technology', icon: '👗', startup_types: null, is_active: true },
  { id: '17', industry: 'photography_production', display_name: 'Photography & Production', description: 'Creative production tech', icon: '📸', startup_types: null, is_active: true },
  { id: '18', industry: 'video_production', display_name: 'Video Production', description: 'Video technology', icon: '🎬', startup_types: null, is_active: true },
  { id: '19', industry: 'social_media_marketing', display_name: 'Social Media Marketing', description: 'Social media marketing tech', icon: '📲', startup_types: null, is_active: true },
];

// ============================================================================
// Hook - Uses Edge Function
// ============================================================================

export function useIndustryPacks() {
  return useQuery({
    queryKey: ['industry-packs'],
    queryFn: async (): Promise<IndustryPack[]> => {
      try {
        const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
          body: { action: 'get_industry_context' },
        });

        if (error) {
          console.warn('[useIndustryPacks] Edge function error, using fallback:', error);
          return STATIC_INDUSTRY_PACKS;
        }

        // Edge function returns { success: true, packs: [...] }
        if (data?.packs && Array.isArray(data.packs)) {
          return data.packs as IndustryPack[];
        }

        // If single context returned, wrap in array
        if (data?.context) {
          return [data.context as IndustryPack];
        }

        return STATIC_INDUSTRY_PACKS;
      } catch (err) {
        console.warn('[useIndustryPacks] Fetch error, using fallback:', err);
        return STATIC_INDUSTRY_PACKS;
      }
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

/**
 * Get a single industry pack by industry slug
 */
export function useIndustryPack(industry: string | undefined) {
  return useQuery({
    queryKey: ['industry-pack', industry],
    queryFn: async (): Promise<IndustryPack | null> => {
      if (!industry) return null;

      try {
        const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
          body: { action: 'get_industry_context', industry },
        });

        if (error) {
          console.warn('[useIndustryPack] Edge function error, using fallback:', error);
          return STATIC_INDUSTRY_PACKS.find(p => p.industry === industry) || null;
        }

        // Edge function returns { success: true, context: {...} }
        if (data?.context) {
          return data.context as IndustryPack;
        }

        return STATIC_INDUSTRY_PACKS.find(p => p.industry === industry) || null;
      } catch (err) {
        console.warn('[useIndustryPack] Fetch error, using fallback:', err);
        return STATIC_INDUSTRY_PACKS.find(p => p.industry === industry) || null;
      }
    },
    enabled: !!industry,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Get static fallback packs (for offline/testing)
 */
export function getStaticIndustryPacks(): IndustryPack[] {
  return STATIC_INDUSTRY_PACKS;
}
