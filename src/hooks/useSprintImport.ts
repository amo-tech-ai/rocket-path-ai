/**
 * useSprintImport — Import validator report priority actions into Sprint Board
 *
 * POST-02: Bridges validation insights → execution.
 *
 * Features:
 * - "Start Next Sprint": imports top 5 highest-impact actions across all dimensions
 * - Per-dimension import: imports all actions from a single dimension
 * - Deterministic deduplication via source_action_id = hash(reportId + dimensionId + rank)
 * - Due dates calculated from import date (not report date) + timeframe
 * - Auto-creates campaign if none exists
 */

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { DimensionId } from '@/config/dimensions';
import type { PriorityAction } from '@/types/v3-report';
import type { BuildItem } from '@/hooks/useStrategicSummary';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImportableAction {
  action: string;
  timeframe: string;
  effort: string;
  impact: string;
  rank: number;
  dimensionId: DimensionId;
  sourceActionId: string; // deterministic hash
}

interface ImportResult {
  imported: number;
  skipped: number; // already-imported duplicates
  campaignId: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministic dedup key: simple string hash (no crypto needed — not security-critical) */
function makeSourceActionId(reportId: string, dimensionId: string, rank: number): string {
  const input = `${reportId}:${dimensionId}:${rank}`;
  // Simple djb2 hash → hex string
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return `rpt_${(hash >>> 0).toString(16)}`;
}

/** Convert timeframe string to days from import date */
function timeframeToDays(timeframe: string): number {
  const lower = timeframe.toLowerCase().trim();
  if (/week\s*1/i.test(lower) || /1\s*week/i.test(lower) || /this\s*week/i.test(lower)) return 7;
  if (/week\s*2/i.test(lower) || /2\s*week/i.test(lower)) return 14;
  if (/week\s*3/i.test(lower) || /3\s*week/i.test(lower)) return 21;
  if (/week\s*4/i.test(lower) || /4\s*week/i.test(lower)) return 28;
  if (/month\s*1/i.test(lower) || /1\s*month/i.test(lower) || /this\s*month/i.test(lower) || /30\s*day/i.test(lower)) return 30;
  if (/month\s*2/i.test(lower) || /2\s*month/i.test(lower) || /60\s*day/i.test(lower)) return 60;
  if (/month\s*3/i.test(lower) || /3\s*month/i.test(lower) || /90\s*day/i.test(lower) || /quarter/i.test(lower)) return 90;
  if (/month\s*6/i.test(lower) || /6\s*month/i.test(lower)) return 180;
  // Default to 30 days if unrecognizable
  return 30;
}

/** Map effort string to sprint priority */
function effortToPriority(effort: string, impact: string): 'high' | 'medium' | 'low' {
  const impactLower = impact.toLowerCase();
  if (impactLower === 'critical') return 'high';
  if (impactLower === 'high') return 'high';
  if (impactLower === 'medium') return 'medium';
  return 'low';
}

/** Calculate due_date as ISO string */
function calculateDueDate(timeframe: string): string {
  const days = timeframeToDays(timeframe);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSprintImport(startupId: string | undefined, reportId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [importingState, setImportingState] = useState<'idle' | 'importing' | 'done'>('idle');

  // Fetch existing campaigns for this startup
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });

  // Fetch existing source_action_ids for dedup check
  const activeCampaignId = campaigns[0]?.id;
  const { data: existingActionIds = [] } = useQuery({
    queryKey: ['sprint-tasks-action-ids', activeCampaignId],
    queryFn: async () => {
      if (!activeCampaignId) return [];
      const { data, error } = await supabase
        .from('sprint_tasks')
        .select('source_action_id')
        .eq('campaign_id', activeCampaignId)
        .not('source_action_id', 'is', null);
      if (error) throw error;
      return (data || []).map((r: { source_action_id: string | null }) => r.source_action_id).filter(Boolean) as string[];
    },
    enabled: !!activeCampaignId,
  });

  const existingIdSet = useMemo(() => new Set(existingActionIds), [existingActionIds]);

  // Prepare importable actions from BuildItem[] (top 5 from useStrategicSummary)
  const prepareFromBuildItems = useCallback(
    (items: BuildItem[]): ImportableAction[] => {
      if (!reportId) return [];
      return items.map((item) => ({
        action: item.action,
        timeframe: item.timeframe,
        effort: 'Medium', // BuildItem doesn't carry effort, default
        impact: item.impact,
        rank: item.rank,
        dimensionId: item.source,
        sourceActionId: makeSourceActionId(reportId, item.source, item.rank),
      }));
    },
    [reportId],
  );

  // Prepare importable actions from PriorityAction[] for a single dimension
  const prepareFromDimension = useCallback(
    (dimensionId: DimensionId, actions: PriorityAction[]): ImportableAction[] => {
      if (!reportId) return [];
      return actions.map((a) => ({
        action: a.action,
        timeframe: a.timeframe,
        effort: a.effort,
        impact: a.impact,
        rank: a.rank,
        dimensionId,
        sourceActionId: makeSourceActionId(reportId, dimensionId, a.rank),
      }));
    },
    [reportId],
  );

  // Check which actions are already imported
  const getImportStatus = useCallback(
    (actions: ImportableAction[]): { newActions: ImportableAction[]; alreadyImported: number } => {
      const newActions = actions.filter((a) => !existingIdSet.has(a.sourceActionId));
      return { newActions, alreadyImported: actions.length - newActions.length };
    },
    [existingIdSet],
  );

  // Core import mutation
  const importMutation = useMutation({
    mutationFn: async (actions: ImportableAction[]): Promise<ImportResult> => {
      if (!startupId) throw new Error('No startup selected');

      // 1. Ensure a campaign exists (auto-create if needed)
      let campaignId = activeCampaignId;
      if (!campaignId) {
        const { data: newCampaign, error: campErr } = await supabase
          .from('campaigns')
          .insert({ startup_id: startupId, name: '90-Day Validation Plan' })
          .select()
          .single();
        if (campErr) throw campErr;
        campaignId = newCampaign.id;
      }

      // 2. Filter out already-imported actions
      const { newActions, alreadyImported } = getImportStatus(actions);
      if (newActions.length === 0) {
        return { imported: 0, skipped: alreadyImported, campaignId };
      }

      // 3. Get max position for ordering
      const { data: maxPosData } = await supabase
        .from('sprint_tasks')
        .select('position')
        .eq('campaign_id', campaignId)
        .order('position', { ascending: false })
        .limit(1);
      const startPos = (maxPosData?.[0]?.position ?? -1) + 1;

      // 4. Build rows and insert
      const rows = newActions.map((a, i) => ({
        campaign_id: campaignId,
        sprint_number: 1, // imported tasks go to sprint 1
        title: a.action,
        source: a.dimensionId,
        success_criteria: `${a.timeframe} — ${a.impact} impact`,
        ai_tip: `Imported from validation report. Due: ${calculateDueDate(a.timeframe)}`,
        priority: effortToPriority(a.effort, a.impact),
        column: 'backlog' as const,
        position: startPos + i,
        source_action_id: a.sourceActionId,
      }));

      const { error: insertErr } = await supabase
        .from('sprint_tasks')
        .insert(rows);
      if (insertErr) throw insertErr;

      return { imported: newActions.length, skipped: alreadyImported, campaignId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['sprint-tasks', result.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['sprint-tasks-action-ids', result.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', startupId] });

      if (result.imported > 0) {
        toast({
          title: `Imported ${result.imported} action${result.imported > 1 ? 's' : ''} to Sprint Board`,
          description: result.skipped > 0
            ? `${result.skipped} already imported — skipped.`
            : 'View them in your Sprint Board.',
        });
      } else {
        toast({
          title: 'All actions already imported',
          description: 'No new actions to add.',
        });
      }
      setImportingState('done');
    },
    onError: (err) => {
      console.error('[useSprintImport]', err);
      toast({
        title: 'Import failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      setImportingState('idle');
    },
  });

  // Import top 5 (from BuildItems)
  const importTopActions = useCallback(
    async (buildItems: BuildItem[]) => {
      setImportingState('importing');
      const actions = prepareFromBuildItems(buildItems);
      await importMutation.mutateAsync(actions);
    },
    [prepareFromBuildItems, importMutation],
  );

  // Import per-dimension
  const importDimensionActions = useCallback(
    async (dimensionId: DimensionId, actions: PriorityAction[]) => {
      setImportingState('importing');
      const importable = prepareFromDimension(dimensionId, actions);
      await importMutation.mutateAsync(importable);
    },
    [prepareFromDimension, importMutation],
  );

  // Check if a specific action is already imported
  const isActionImported = useCallback(
    (dimensionId: DimensionId, rank: number): boolean => {
      if (!reportId) return false;
      const id = makeSourceActionId(reportId, dimensionId, rank);
      return existingIdSet.has(id);
    },
    [reportId, existingIdSet],
  );

  // Check how many of the given actions are already imported
  const countImported = useCallback(
    (dimensionId: DimensionId, actions: PriorityAction[]): number => {
      if (!reportId) return 0;
      return actions.filter((a) => {
        const id = makeSourceActionId(reportId, dimensionId, a.rank);
        return existingIdSet.has(id);
      }).length;
    },
    [reportId, existingIdSet],
  );

  return {
    importTopActions,
    importDimensionActions,
    isActionImported,
    countImported,
    isImporting: importingState === 'importing' || importMutation.isPending,
    importDone: importingState === 'done',
    hasExistingCampaign: !!activeCampaignId,
  };
}
