/**
 * useDashboardProactiveMessage — Derive proactive AI greeting for the dashboard
 *
 * Pure client-side derivation from dashboard context data.
 * Greets the founder with health score, top risks, and daily focus.
 */

import { useMemo } from 'react';
import type { DashboardContextData } from '@/providers/AIAssistantProvider';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getHealthLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs attention';
  return 'Critical';
}

function getTrendLabel(trend: number | null): string {
  if (trend == null) return '';
  if (trend > 0) return ` (trending up +${trend})`;
  if (trend < 0) return ` (trending down ${trend})`;
  return ' (stable)';
}

export function useDashboardProactiveMessage(
  context: DashboardContextData | null,
  startupName?: string,
): { proactiveMessage: string | null } {
  return useMemo(() => {
    if (!context) return { proactiveMessage: null };

    const name = startupName || 'your startup';
    const greeting = getTimeGreeting();
    const lines: string[] = [];

    // Header
    lines.push(`**${greeting}!** Here's where ${name} stands today.`);
    lines.push('');

    // Health score
    if (context.healthScore != null) {
      const label = getHealthLabel(context.healthScore);
      const trend = getTrendLabel(context.healthTrend);
      lines.push(`**Health score:** ${context.healthScore}/100 — ${label}${trend}`);
    }

    // Stage + journey
    if (context.currentStage) {
      const stageName = context.currentStage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      lines.push(`**Stage:** ${stageName} (${context.journeyPercent}% journey complete)`);
    }

    // Top risks
    if (context.topRisks.length > 0) {
      lines.push('');
      lines.push(`**Top risks:** ${context.topRisks.slice(0, 3).join(' · ')}`);
    }

    // Suggested focus
    lines.push('');
    lines.push('**Today\'s focus:**');
    if (context.healthScore != null && context.healthScore < 60) {
      lines.push('1. Address your weakest health dimension');
      lines.push('2. Update your lean canvas with recent learnings');
      lines.push('3. Check your task board for overdue items');
    } else {
      lines.push('1. Review your top tasks for the week');
      lines.push('2. Follow up on any stalled investor conversations');
      lines.push('3. Run your next validation experiment');
    }

    return { proactiveMessage: lines.join('\n') };
  }, [context, startupName]);
}
