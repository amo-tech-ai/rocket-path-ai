/**
 * PlaybookProvider
 * 
 * Provides industry context and playbook data to all child screens.
 * Ensures consistent industry/stage context is available for AI calls.
 * 
 * Features:
 * - Auto-detects industry from startup profile
 * - Caches context for performance
 * - Provides knowledge categories for Right Panel
 */

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useIndustryContext, IndustryContext } from '@/hooks/useIndustryExpert';
import { useStartup } from '@/hooks/useDashboardData';

// ============================================================================
// Types
// ============================================================================

export interface PlaybookContextValue {
  /** Current industry key (e.g., 'fintech', 'healthcare') */
  industry: string | null;
  /** Current stage (e.g., 'seed', 'series_a') */
  stage: string | null;
  /** Full industry context from the expert agent */
  context: IndustryContext | null;
  /** Whether context is loading */
  isLoading: boolean;
  /** Error if context failed to load */
  error: Error | null;
  /** Get knowledge for specific categories */
  getKnowledge: (categories: string[]) => KnowledgeSlice;
  /** Feature context for pack routing */
  getFeatureContext: (route: string) => FeatureContext;
}

export interface KnowledgeSlice {
  terminology: { term: string; definition: string }[];
  benchmarks: Record<string, unknown>;
  mental_models: string[];
  common_mistakes: string[];
  investor_expectations: Record<string, unknown>;
  success_stories: unknown[];
}

export interface FeatureContext {
  featureContext: string;
  primaryPack: string;
  categories: string[];
}

// Feature-to-pack routing map (mirrors feature_pack_routing table)
const FEATURE_PACK_ROUTING: Record<string, FeatureContext> = {
  '/onboarding': {
    featureContext: 'onboarding',
    primaryPack: 'industry-onboarding',
    categories: ['terminology', 'failure_patterns', 'mental_models'],
  },
  '/validator': {
    featureContext: 'validator',
    primaryPack: 'industry-validation',
    categories: ['benchmarks', 'warning_signs', 'diagnostics'],
  },
  '/canvas': {
    featureContext: 'canvas',
    primaryPack: 'industry-canvas',
    categories: ['gtm_patterns', 'benchmarks', 'competitive_intel'],
  },
  '/pitch': {
    featureContext: 'pitch',
    primaryPack: 'industry-pitch-prep',
    categories: ['investor_expectations', 'investor_questions', 'success_stories'],
  },
  '/app/dashboard': {
    featureContext: 'dashboard',
    primaryPack: 'dashboard-insights',
    categories: ['benchmarks', 'market_context', 'mental_models'],
  },
  '/crm': {
    featureContext: 'crm',
    primaryPack: 'crm-intelligence',
    categories: ['investor_expectations', 'competitive_intel'],
  },
  '/investors': {
    featureContext: 'investors',
    primaryPack: 'investor-outreach',
    categories: ['investor_expectations', 'investor_questions'],
  },
  '/tasks': {
    featureContext: 'tasks',
    primaryPack: 'task-prioritization',
    categories: ['diagnostics', 'mental_models'],
  },
};

// ============================================================================
// Context
// ============================================================================

const PlaybookContext = createContext<PlaybookContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface PlaybookProviderProps {
  children: ReactNode;
}

export function PlaybookProvider({ children }: PlaybookProviderProps) {
  // Get startup data to detect industry/stage
  const { data: startup } = useStartup();
  
  // Extract industry and stage from startup
  const industry = startup?.industry || null;
  const stage = startup?.stage || null;
  
  // Fetch full industry context
  const { 
    data: context, 
    isLoading, 
    error 
  } = useIndustryContext(industry || undefined);
  
  // Extract knowledge for specific categories
  const getKnowledge = useMemo(() => {
    return (categories: string[]): KnowledgeSlice => {
      if (!context) {
        return {
          terminology: [],
          benchmarks: {},
          mental_models: [],
          common_mistakes: [],
          investor_expectations: {},
          success_stories: [],
        };
      }
      
      const slice: KnowledgeSlice = {
        terminology: categories.includes('terminology') ? context.terminology : [],
        benchmarks: categories.includes('benchmarks') ? context.benchmarks : {},
        mental_models: categories.includes('mental_models') ? context.mental_models : [],
        common_mistakes: categories.includes('common_mistakes') ? context.common_mistakes : [],
        investor_expectations: categories.includes('investor_expectations') 
          ? context.investor_expectations 
          : {},
        success_stories: categories.includes('success_stories') ? context.success_stories : [],
      };
      
      return slice;
    };
  }, [context]);
  
  // Get feature context for routing
  const getFeatureContext = useMemo(() => {
    return (route: string): FeatureContext => {
      // Find matching route (supports partial matching)
      const match = Object.entries(FEATURE_PACK_ROUTING).find(([path]) => 
        route.startsWith(path)
      );
      
      if (match) {
        return match[1];
      }
      
      // Default fallback
      return {
        featureContext: 'general',
        primaryPack: 'general-assistant',
        categories: ['terminology', 'benchmarks'],
      };
    };
  }, []);
  
  const value: PlaybookContextValue = useMemo(() => ({
    industry,
    stage,
    context: context || null,
    isLoading,
    error: error as Error | null,
    getKnowledge,
    getFeatureContext,
  }), [industry, stage, context, isLoading, error, getKnowledge, getFeatureContext]);
  
  return (
    <PlaybookContext.Provider value={value}>
      {children}
    </PlaybookContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function usePlaybook(): PlaybookContextValue {
  const context = useContext(PlaybookContext);
  
  if (!context) {
    // Return a safe default for components outside the provider
    return {
      industry: null,
      stage: null,
      context: null,
      isLoading: false,
      error: null,
      getKnowledge: () => ({
        terminology: [],
        benchmarks: {},
        mental_models: [],
        common_mistakes: [],
        investor_expectations: {},
        success_stories: [],
      }),
      getFeatureContext: () => ({
        featureContext: 'general',
        primaryPack: 'general-assistant',
        categories: [],
      }),
    };
  }
  
  return context;
}

export default PlaybookProvider;
