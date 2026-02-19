/**
 * Sprint hooks — LIVE (rebuilt for new campaigns + sprints tables)
 *
 * campaigns: top-level 90-day validation plans per startup
 * sprints: 2-week sprints within a campaign (max 6), PDCA data in cards JSONB
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// ---------- Interfaces ----------

export interface Campaign {
  id: string;
  startup_id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

/** Rich Sprint interface — PDCA fields read from cards JSONB */
export interface Sprint {
  id: string;
  campaign_id: string;
  sprint_number: number;
  name: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  // PDCA fields (stored in cards jsonb)
  pdca_step: string;
  purpose: string;
  hypothesis: string | null;
  experiment_design: string | null;
  success_criteria: string | null;
  method: string | null;
  actions_taken: Json | null;
  notes: string | null;
  results: Json | null;
  metrics_achieved: Json | null;
  success: boolean | null;
  learnings: Json | null;
  decision: string | null;
  decision_rationale: string | null;
  next_steps: Json | null;
}

// ---------- Helpers ----------

/** Unpack PDCA fields from cards JSONB into Sprint interface */
function unpackSprint(row: Record<string, unknown>): Sprint {
  const cards = (row.cards && typeof row.cards === 'object' && !Array.isArray(row.cards))
    ? row.cards as Record<string, unknown>
    : {};

  // Derive pdca_step from which sections have data
  let pdca_step = 'plan';
  if (cards.act && typeof cards.act === 'object' && Object.keys(cards.act as object).length > 0) {
    pdca_step = 'act';
  } else if (cards.check && typeof cards.check === 'object' && Object.keys(cards.check as object).length > 0) {
    pdca_step = 'check';
  } else if (cards.do && typeof cards.do === 'object' && Object.keys(cards.do as object).length > 0) {
    pdca_step = 'do';
  } else if (cards.plan && typeof cards.plan === 'object' && Object.keys(cards.plan as object).length > 0) {
    pdca_step = 'do'; // Plan is filled → next step is Do
  }

  // Allow explicit pdca_step override
  if (typeof cards.pdca_step === 'string') pdca_step = cards.pdca_step;

  const plan = (cards.plan && typeof cards.plan === 'object') ? cards.plan as Record<string, unknown> : {};
  const doData = (cards.do && typeof cards.do === 'object') ? cards.do as Record<string, unknown> : {};
  const checkData = (cards.check && typeof cards.check === 'object') ? cards.check as Record<string, unknown> : {};
  const actData = (cards.act && typeof cards.act === 'object') ? cards.act as Record<string, unknown> : {};

  return {
    id: row.id as string,
    campaign_id: row.campaign_id as string,
    sprint_number: row.sprint_number as number,
    name: row.name as string | null,
    status: row.status as string,
    start_date: row.start_date as string | null,
    end_date: row.end_date as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    pdca_step,
    purpose: (row.name as string) || `Sprint ${row.sprint_number}`,
    hypothesis: (plan.hypothesis as string) || null,
    experiment_design: (plan.experiment_design as string) || null,
    success_criteria: (plan.success_criteria as string) || null,
    method: (plan.method as string) || null,
    actions_taken: (doData.actions_taken as Json) || null,
    notes: (doData.notes as string) || null,
    results: (checkData.results as Json) || null,
    metrics_achieved: (checkData.metrics_achieved as Json) || null,
    success: typeof checkData.success === 'boolean' ? checkData.success : null,
    learnings: (actData.learnings as Json) || null,
    decision: (actData.decision as string) || null,
    decision_rationale: (actData.decision_rationale as string) || null,
    next_steps: (actData.next_steps as Json) || null,
  };
}

/** Pack PDCA updates back into cards JSONB for DB write */
function packCardsUpdate(updates: Partial<Sprint>, existingCards: Record<string, unknown> = {}): Record<string, unknown> {
  const cards = { ...existingCards };

  // Plan fields
  if ('hypothesis' in updates || 'experiment_design' in updates || 'success_criteria' in updates || 'method' in updates) {
    const plan = (cards.plan && typeof cards.plan === 'object') ? { ...(cards.plan as object) } : {};
    if ('hypothesis' in updates) (plan as Record<string, unknown>).hypothesis = updates.hypothesis;
    if ('experiment_design' in updates) (plan as Record<string, unknown>).experiment_design = updates.experiment_design;
    if ('success_criteria' in updates) (plan as Record<string, unknown>).success_criteria = updates.success_criteria;
    if ('method' in updates) (plan as Record<string, unknown>).method = updates.method;
    cards.plan = plan;
  }

  // Do fields
  if ('actions_taken' in updates || 'notes' in updates) {
    const doData = (cards.do && typeof cards.do === 'object') ? { ...(cards.do as object) } : {};
    if ('actions_taken' in updates) (doData as Record<string, unknown>).actions_taken = updates.actions_taken;
    if ('notes' in updates) (doData as Record<string, unknown>).notes = updates.notes;
    cards.do = doData;
  }

  // Check fields
  if ('results' in updates || 'metrics_achieved' in updates || 'success' in updates) {
    const checkData = (cards.check && typeof cards.check === 'object') ? { ...(cards.check as object) } : {};
    if ('results' in updates) (checkData as Record<string, unknown>).results = updates.results;
    if ('metrics_achieved' in updates) (checkData as Record<string, unknown>).metrics_achieved = updates.metrics_achieved;
    if ('success' in updates) (checkData as Record<string, unknown>).success = updates.success;
    cards.check = checkData;
  }

  // Act fields
  if ('learnings' in updates || 'decision' in updates || 'decision_rationale' in updates || 'next_steps' in updates) {
    const actData = (cards.act && typeof cards.act === 'object') ? { ...(cards.act as object) } : {};
    if ('learnings' in updates) (actData as Record<string, unknown>).learnings = updates.learnings;
    if ('decision' in updates) (actData as Record<string, unknown>).decision = updates.decision;
    if ('decision_rationale' in updates) (actData as Record<string, unknown>).decision_rationale = updates.decision_rationale;
    if ('next_steps' in updates) (actData as Record<string, unknown>).next_steps = updates.next_steps;
    cards.act = actData;
  }

  // pdca_step
  if ('pdca_step' in updates) cards.pdca_step = updates.pdca_step;

  return cards;
}

// ---------- Hooks ----------

export function useCampaigns(startupId: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!startupId,
  });
}

export function useSprints(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['sprints', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('sprint_number', { ascending: true });
      if (error) throw error;
      return (data || []).map((row) => unpackSprint(row as Record<string, unknown>));
    },
    enabled: !!campaignId,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaign: { startup_id: string; name?: string }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({ startup_id: campaign.startup_id, name: campaign.name || '90-Day Validation Plan' })
        .select()
        .single();
      if (error) throw error;
      return data as Campaign;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['campaigns', data.startup_id] });
    },
  });
}

export function useCreateSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sprint: {
      campaign_id: string;
      sprint_number: number;
      purpose: string;
    }) => {
      const { data, error } = await supabase
        .from('sprints')
        .insert({
          campaign_id: sprint.campaign_id,
          sprint_number: sprint.sprint_number,
          name: sprint.purpose,
        })
        .select()
        .single();
      if (error) throw error;
      return unpackSprint(data as Record<string, unknown>);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['sprints', vars.campaign_id] });
    },
  });
}

export function useUpdateSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sprint> & { id: string }) => {
      // First fetch existing cards to merge
      const { data: existing, error: fetchErr } = await supabase
        .from('sprints')
        .select('cards')
        .eq('id', id)
        .single();
      if (fetchErr) throw fetchErr;

      const existingCards = (existing?.cards && typeof existing.cards === 'object' && !Array.isArray(existing.cards))
        ? existing.cards as Record<string, unknown>
        : {};

      const newCards = packCardsUpdate(updates, existingCards);

      // Build DB update
      const dbUpdate: Record<string, unknown> = { cards: newCards };
      if ('name' in updates || 'purpose' in updates) {
        dbUpdate.name = updates.name || updates.purpose;
      }
      if ('status' in updates) dbUpdate.status = updates.status;
      if ('start_date' in updates) dbUpdate.start_date = updates.start_date;
      if ('end_date' in updates) dbUpdate.end_date = updates.end_date;

      const { error } = await supabase
        .from('sprints')
        .update(dbUpdate)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useCompleteSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sprints')
        .update({ status: 'completed' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}
