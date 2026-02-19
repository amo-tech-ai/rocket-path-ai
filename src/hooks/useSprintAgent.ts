/**
 * useSprintAgent Hook
 * Calls sprint-agent edge function to AI-generate validation tasks.
 * Persists kanban tasks in sprint_tasks DB table (not localStorage).
 */

import { useMemo, useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type KanbanColumn = 'backlog' | 'todo' | 'doing' | 'done';

export interface SprintTask {
  id: string;
  title: string;
  source: string;
  sprint_number: number;
  success_criteria: string;
  ai_tip: string;
  priority: 'high' | 'medium' | 'low';
  column: KanbanColumn;
}

export function useSprintAgent(startupId?: string, campaignId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Load tasks from DB
  const { data: tasks = [] } = useQuery({
    queryKey: ['sprint-tasks', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from('sprint_tasks')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('position', { ascending: true });
      if (error) throw error;
      return (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        source: row.source as string,
        sprint_number: row.sprint_number as number,
        success_criteria: row.success_criteria as string,
        ai_tip: (row.ai_tip as string) || '',
        priority: (row.priority as SprintTask['priority']) || 'medium',
        column: (row.column as KanbanColumn) || 'backlog',
      }));
    },
    enabled: !!campaignId,
  });

  // Generate tasks via sprint-agent, then bulk insert to DB
  const generateTasks = useCallback(async () => {
    if (!startupId || !campaignId) return;
    setIsGenerating(true);
    try {
      const { data: refreshData } = await supabase.auth.refreshSession();
      const token = refreshData?.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('sprint-agent', {
        body: { startup_id: startupId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;

      // Delete existing tasks for this campaign before inserting new ones
      await supabase
        .from('sprint_tasks')
        .delete()
        .eq('campaign_id', campaignId);

      // Bulk insert generated tasks
      const rows = (data.tasks || []).map((t: Record<string, unknown>, i: number) => ({
        campaign_id: campaignId,
        sprint_number: (t.sprint_number as number) || 1,
        title: t.title as string,
        source: t.source as string,
        success_criteria: (t.success_criteria as string) || '',
        ai_tip: (t.ai_tip as string) || '',
        priority: (t.priority as string) || 'medium',
        column: 'backlog',
        position: i,
      }));

      if (rows.length > 0) {
        const { error: insertError } = await supabase
          .from('sprint_tasks')
          .insert(rows);
        if (insertError) throw insertError;
      }

      queryClient.invalidateQueries({ queryKey: ['sprint-tasks', campaignId] });
      toast({ title: `Generated ${rows.length} sprint tasks` });
    } catch (err) {
      console.error('[useSprintAgent]', err);
      toast({ title: 'Failed to generate tasks', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }, [startupId, campaignId, toast, queryClient]);

  // Move task to new column (optimistic update + DB persist)
  const moveTask = useCallback(async (taskId: string, newColumn: KanbanColumn) => {
    // Optimistic update
    queryClient.setQueryData<SprintTask[]>(['sprint-tasks', campaignId], (old) =>
      (old || []).map(t => t.id === taskId ? { ...t, column: newColumn } : t)
    );

    const { error } = await supabase
      .from('sprint_tasks')
      .update({ column: newColumn })
      .eq('id', taskId);

    if (error) {
      // Revert on failure
      queryClient.invalidateQueries({ queryKey: ['sprint-tasks', campaignId] });
      toast({ title: 'Failed to move task', variant: 'destructive' });
    }
  }, [campaignId, queryClient, toast]);

  const tasksBySprint = useMemo(() => {
    const map = new Map<number, SprintTask[]>();
    tasks.forEach(t => {
      const existing = map.get(t.sprint_number) || [];
      existing.push(t);
      map.set(t.sprint_number, existing);
    });
    return map;
  }, [tasks]);

  const tasksByColumn = useMemo(() => {
    const cols: Record<KanbanColumn, SprintTask[]> = { backlog: [], todo: [], doing: [], done: [] };
    tasks.forEach(t => cols[t.column].push(t));
    return cols;
  }, [tasks]);

  return {
    tasks,
    tasksBySprint,
    tasksByColumn,
    isGenerating,
    generateTasks,
    moveTask,
    hasTasks: tasks.length > 0,
  };
}
