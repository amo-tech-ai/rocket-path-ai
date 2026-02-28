/**
 * useDashboardAIContext — Dashboard-Aware AI Panel Context
 *
 * Detects when user is on /dashboard and provides:
 * - 4 dashboard-specific quick action chips
 * - Context summary for the AI system prompt
 *
 * Pattern: follows useReportAIContext.ts (route-based detection)
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { QuickAction } from '@/lib/ai-capabilities';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardContextSummary {
  healthScore: number | null;
  healthTrend: number | null;
  topRisks: string[];
  currentStage: string | null;
  journeyPercent: number;
}

export interface DashboardAIContext {
  /** True when on /dashboard */
  isOnDashboard: boolean;
  /** 4 dashboard-specific quick action chips */
  quickActions: QuickAction[];
  /** Summary data for the AI system prompt (set externally) */
  contextSummary: DashboardContextSummary | null;
}

// ---------------------------------------------------------------------------
// Dashboard-specific quick actions
// ---------------------------------------------------------------------------

const DASHBOARD_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'dashboard_status',
    label: 'My startup status',
    prompt:
      'Summarize my startup health score, top risks, and current stage. What should I focus on today?',
  },
  {
    id: 'dashboard_prioritize',
    label: 'Prioritize my tasks',
    prompt:
      'Based on my health score breakdown and risks, rank my most impactful next tasks.',
  },
  {
    id: 'dashboard_next_steps',
    label: 'Suggest next steps',
    prompt:
      'What are the 3 most important actions I should take this week to improve my startup health?',
  },
  {
    id: 'dashboard_weekly',
    label: 'Weekly insights',
    prompt:
      'Give me a weekly digest: key changes in my health score, completed tasks, and what to watch for.',
  },
];

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashboardAIContext(
  summary?: DashboardContextSummary | null,
): DashboardAIContext {
  const { pathname } = useLocation();

  return useMemo(() => {
    const isOnDashboard = pathname === '/dashboard' || pathname === '/';

    if (!isOnDashboard) {
      return {
        isOnDashboard: false,
        quickActions: [],
        contextSummary: null,
      };
    }

    return {
      isOnDashboard: true,
      quickActions: DASHBOARD_QUICK_ACTIONS,
      contextSummary: summary ?? null,
    };
  }, [pathname, summary]);
}
