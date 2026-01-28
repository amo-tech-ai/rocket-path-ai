import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ============ TYPES ============

export interface DiscoveredEvent {
  name: string;
  event_type: string;
  relevance_score: number;
  industry_fit: string;
  expected_attendees: string;
  networking_value: "high" | "medium" | "low";
  typical_date: string;
  typical_location: string;
  estimated_cost: string;
  key_benefits: string[];
}

export interface EventAnalysis {
  fit_score: number;
  value_breakdown: Record<string, { score: number; reason: string }>;
  should_attend: boolean;
  recommendation: string;
  preparation_tips: string[];
  networking_targets: string[];
  roi_estimate: string;
  risks: string[];
}

export interface SpeakerAnalysis {
  name: string;
  relevance_score: number;
  connection_value: string;
  common_ground: string;
  approach_strategy: string;
  key_questions: string[];
}

export interface EventPrep {
  elevator_pitch: Record<string, string>;
  talking_points: Array<{ topic: string; key_message: string; supporting_fact: string }>;
  questions_to_ask: Array<{ target: string; question: string; why: string }>;
  goals: { primary: string; secondary: string[]; success_metrics: string[] };
  logistics_checklist: string[];
  materials_needed: string[];
  follow_up_template: string;
}

// ============ HOOKS ============

export function useDiscoverEvents() {
  return useMutation({
    mutationFn: async ({
      startupId,
      criteria,
    }: {
      startupId: string;
      criteria?: {
        location?: string;
        eventType?: string;
        dateRange?: { start: string; end: string };
        maxBudget?: number;
      };
    }) => {
      const { data, error } = await supabase.functions.invoke("event-agent", {
        body: {
          action: "discover_events",
          startup_id: startupId,
          criteria,
        },
      });

      if (error) throw error;
      return data as {
        success: boolean;
        events: DiscoveredEvent[];
        strategy: string;
        priority_events: string[];
      };
    },
  });
}

export function useAnalyzeEvent() {
  return useMutation({
    mutationFn: async ({
      startupId,
      eventId,
    }: {
      startupId: string;
      eventId: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("event-agent", {
        body: {
          action: "analyze_event",
          startup_id: startupId,
          event_id: eventId,
        },
      });

      if (error) throw error;
      return data as { success: boolean; event_name: string } & EventAnalysis;
    },
  });
}

export function useResearchSpeakers() {
  return useMutation({
    mutationFn: async ({
      startupId,
      eventId,
    }: {
      startupId: string;
      eventId: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("event-agent", {
        body: {
          action: "research_speakers",
          startup_id: startupId,
          event_id: eventId,
        },
      });

      if (error) throw error;
      return data as {
        success: boolean;
        speakers_found: boolean;
        speaker_analysis?: SpeakerAnalysis[];
        speaker_types?: unknown[];
        priority_connections: string[];
        networking_plan: string;
      };
    },
  });
}

export function useGenerateEventPrep() {
  return useMutation({
    mutationFn: async ({
      startupId,
      eventId,
    }: {
      startupId: string;
      eventId: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("event-agent", {
        body: {
          action: "generate_prep",
          startup_id: startupId,
          event_id: eventId,
        },
      });

      if (error) throw error;
      return data as { success: boolean; event_name: string } & EventPrep;
    },
  });
}

export function useTrackEventAttendance() {
  return useMutation({
    mutationFn: async ({
      startupId,
      eventId,
      attendance,
    }: {
      startupId: string;
      eventId: string;
      attendance: {
        status: "registered" | "attended" | "cancelled" | "no_show";
        connections_made?: number;
        leads_generated?: number;
        notes?: string;
        rating?: number;
      };
    }) => {
      const { data, error } = await supabase.functions.invoke("event-agent", {
        body: {
          action: "track_attendance",
          startup_id: startupId,
          event_id: eventId,
          attendance,
        },
      });

      if (error) throw error;
      return data as {
        success: boolean;
        event_name: string;
        status_updated: string;
        insights?: {
          roi_assessment: string;
          follow_up_actions: string[];
          lessons_learned: string[];
          similar_events: string[];
        };
      };
    },
  });
}
