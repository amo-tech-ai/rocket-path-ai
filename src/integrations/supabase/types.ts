export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_executions: {
        Row: {
          action_id: string
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          executed_at: string | null
          id: string
          result: Json | null
          rolled_back_at: string | null
          rolled_back_by: string | null
          status: string | null
          undo_state: Json | null
        }
        Insert: {
          action_id: string
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          result?: Json | null
          rolled_back_at?: string | null
          rolled_back_by?: string | null
          status?: string | null
          undo_state?: Json | null
        }
        Update: {
          action_id?: string
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          result?: Json | null
          rolled_back_at?: string | null
          rolled_back_by?: string | null
          status?: string | null
          undo_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "action_executions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "proposed_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_executions_rolled_back_by_fkey"
            columns: ["rolled_back_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          action: string
          activity_type: string | null
          changes: Json | null
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          org_id: string | null
          startup_id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          activity_type?: string | null
          changes?: Json | null
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          startup_id: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          activity_type?: string | null
          changes?: Json | null
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          startup_id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "activities_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "activities_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_configs: {
        Row: {
          agent_name: string
          created_at: string | null
          daily_budget: number | null
          description: string | null
          display_name: string
          enabled_tools: string[] | null
          fallback_model: string | null
          id: string
          is_active: boolean | null
          max_cost_per_run: number | null
          max_input_tokens: number | null
          max_output_tokens: number | null
          model: string
          org_id: string | null
          system_prompt: string | null
          temperature: number | null
          thinking_level: string | null
          updated_at: string | null
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          daily_budget?: number | null
          description?: string | null
          display_name: string
          enabled_tools?: string[] | null
          fallback_model?: string | null
          id?: string
          is_active?: boolean | null
          max_cost_per_run?: number | null
          max_input_tokens?: number | null
          max_output_tokens?: number | null
          model?: string
          org_id?: string | null
          system_prompt?: string | null
          temperature?: number | null
          thinking_level?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          daily_budget?: number | null
          description?: string | null
          display_name?: string
          enabled_tools?: string[] | null
          fallback_model?: string | null
          id?: string
          is_active?: boolean | null
          max_cost_per_run?: number | null
          max_input_tokens?: number | null
          max_output_tokens?: number | null
          model?: string
          org_id?: string | null
          system_prompt?: string | null
          temperature?: number | null
          thinking_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_configs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_runs: {
        Row: {
          action: string
          agent_type: string
          completed_at: string | null
          cost_cents: number | null
          created_at: string
          error_code: string | null
          error_message: string | null
          id: string
          input_data: Json
          latency_ms: number | null
          metadata: Json | null
          model: string
          output_data: Json | null
          provider: string
          session_id: string | null
          started_at: string | null
          startup_id: string | null
          status: string
          tokens_input: number | null
          tokens_output: number | null
          tokens_total: number | null
          user_id: string | null
        }
        Insert: {
          action: string
          agent_type: string
          completed_at?: string | null
          cost_cents?: number | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json
          latency_ms?: number | null
          metadata?: Json | null
          model: string
          output_data?: Json | null
          provider?: string
          session_id?: string | null
          started_at?: string | null
          startup_id?: string | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
          tokens_total?: number | null
          user_id?: string | null
        }
        Update: {
          action?: string
          agent_type?: string
          completed_at?: string | null
          cost_cents?: number | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json
          latency_ms?: number | null
          metadata?: Json | null
          model?: string
          output_data?: Json | null
          provider?: string
          session_id?: string | null
          started_at?: string | null
          startup_id?: string | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
          tokens_total?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_runs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_runs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "ai_runs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "ai_runs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assumptions: {
        Row: {
          ai_extracted: boolean | null
          created_at: string | null
          evidence_count: number | null
          extraction_confidence: number | null
          id: string
          impact_score: number
          lean_canvas_id: string | null
          notes: string | null
          priority_score: number | null
          risk_score: number | null
          source_block: Database["public"]["Enums"]["assumption_source"]
          startup_id: string
          statement: string
          status: Database["public"]["Enums"]["assumption_status"]
          tested_at: string | null
          uncertainty_score: number
          updated_at: string | null
        }
        Insert: {
          ai_extracted?: boolean | null
          created_at?: string | null
          evidence_count?: number | null
          extraction_confidence?: number | null
          id?: string
          impact_score?: number
          lean_canvas_id?: string | null
          notes?: string | null
          priority_score?: number | null
          risk_score?: number | null
          source_block: Database["public"]["Enums"]["assumption_source"]
          startup_id: string
          statement: string
          status?: Database["public"]["Enums"]["assumption_status"]
          tested_at?: string | null
          uncertainty_score?: number
          updated_at?: string | null
        }
        Update: {
          ai_extracted?: boolean | null
          created_at?: string | null
          evidence_count?: number | null
          extraction_confidence?: number | null
          id?: string
          impact_score?: number
          lean_canvas_id?: string | null
          notes?: string | null
          priority_score?: number | null
          risk_score?: number | null
          source_block?: Database["public"]["Enums"]["assumption_source"]
          startup_id?: string
          statement?: string
          status?: Database["public"]["Enums"]["assumption_status"]
          tested_at?: string | null
          uncertainty_score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assumptions_lean_canvas_id_fkey"
            columns: ["lean_canvas_id"]
            isOneToOne: false
            referencedRelation: "lean_canvases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assumptions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "assumptions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "assumptions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          startup_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          startup_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          startup_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "campaigns_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "campaigns_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_facts: {
        Row: {
          confidence: number | null
          content: string
          created_at: string | null
          expires_at: string | null
          fact_type: string
          id: string
          source_message_id: string | null
          startup_id: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          fact_type: string
          id?: string
          source_message_id?: string | null
          startup_id?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          fact_type?: string
          id?: string
          source_message_id?: string | null
          startup_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_facts_source_message_id_fkey"
            columns: ["source_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_facts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "chat_facts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "chat_facts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_facts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          feedback: string | null
          feedback_text: string | null
          id: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          role: string
          session_id: string
          tokens_used: number | null
          tool_calls: Json | null
          tool_results: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          feedback?: string | null
          feedback_text?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          role: string
          session_id: string
          tokens_used?: number | null
          tool_calls?: Json | null
          tool_results?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          feedback?: string | null
          feedback_text?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          role?: string
          session_id?: string
          tokens_used?: number | null
          tool_calls?: Json | null
          tool_results?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          agent_type: string
          context: Json | null
          created_at: string
          id: string
          last_message_at: string | null
          message_count: number
          startup_id: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_type?: string
          context?: Json | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          message_count?: number
          startup_id: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_type?: string
          context?: Json | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          message_count?: number
          startup_id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "chat_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "chat_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          action_items: string[] | null
          contact_id: string
          content: string | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          direction: string | null
          duration_minutes: number | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          key_points: string[] | null
          occurred_at: string | null
          participants: string[] | null
          sentiment: string | null
          startup_id: string
          subject: string | null
          summary: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          action_items?: string[] | null
          contact_id: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          direction?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          key_points?: string[] | null
          occurred_at?: string | null
          participants?: string[] | null
          sentiment?: string | null
          startup_id: string
          subject?: string | null
          summary?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          action_items?: string[] | null
          contact_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          direction?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          key_points?: string[] | null
          occurred_at?: string | null
          participants?: string[] | null
          sentiment?: string | null
          startup_id?: string
          subject?: string | null
          summary?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "communications_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "communications_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_tags: {
        Row: {
          color: string | null
          contact_id: string
          created_at: string | null
          created_by: string | null
          id: string
          tag: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          contact_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          contact_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_tags_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          source: string | null
          startup_id: string
          tags: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          source?: string | null
          startup_id: string
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          source?: string | null
          startup_id?: string
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "contacts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "contacts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      context_injection_configs: {
        Row: {
          categories: string[]
          created_at: string
          description: string | null
          feature_context: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          categories: string[]
          created_at?: string
          description?: string | null
          feature_context: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          description?: string | null
          feature_context?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      context_injection_map: {
        Row: {
          created_at: string
          description: string | null
          feature_context: Database["public"]["Enums"]["feature_context"]
          id: string
          knowledge_categories: string[]
          max_tokens: number | null
          prompt_template: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_context: Database["public"]["Enums"]["feature_context"]
          id?: string
          knowledge_categories: string[]
          max_tokens?: number | null
          prompt_template?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_context?: Database["public"]["Enums"]["feature_context"]
          id?: string
          knowledge_categories?: string[]
          max_tokens?: number | null
          prompt_template?: string | null
        }
        Relationships: []
      }
      daily_focus_recommendations: {
        Row: {
          action_completed_at: string | null
          computed_at: string
          created_at: string
          expires_at: string
          id: string
          primary_action: Json
          scoring_breakdown: Json | null
          secondary_actions: Json | null
          signal_weights: Json | null
          skipped_at: string | null
          startup_id: string
        }
        Insert: {
          action_completed_at?: string | null
          computed_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          primary_action: Json
          scoring_breakdown?: Json | null
          secondary_actions?: Json | null
          signal_weights?: Json | null
          skipped_at?: string | null
          startup_id: string
        }
        Update: {
          action_completed_at?: string | null
          computed_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          primary_action?: Json
          scoring_breakdown?: Json | null
          secondary_actions?: Json | null
          signal_weights?: Json | null
          skipped_at?: string | null
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_focus_recommendations_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "daily_focus_recommendations_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "daily_focus_recommendations_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_metrics_cache: {
        Row: {
          computed_at: string
          id: string
          metric_type: string
          startup_id: string
          value: Json
        }
        Insert: {
          computed_at?: string
          id?: string
          metric_type: string
          startup_id: string
          value?: Json
        }
        Update: {
          computed_at?: string
          id?: string
          metric_type?: string
          startup_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_metrics_cache_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "dashboard_metrics_cache_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "dashboard_metrics_cache_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          amount: number | null
          contact_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          stage: string | null
          startup_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          contact_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          stage?: string | null
          startup_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          contact_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          stage?: string | null
          startup_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "deals_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "deals_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_evidence: {
        Row: {
          created_at: string | null
          decision_id: string
          evidence_id: string | null
          evidence_table: string | null
          evidence_type: string
          id: string
          summary: string
          supports_decision: boolean | null
        }
        Insert: {
          created_at?: string | null
          decision_id: string
          evidence_id?: string | null
          evidence_table?: string | null
          evidence_type: string
          id?: string
          summary: string
          supports_decision?: boolean | null
        }
        Update: {
          created_at?: string | null
          decision_id?: string
          evidence_id?: string | null
          evidence_table?: string | null
          evidence_type?: string
          id?: string
          summary?: string
          supports_decision?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_evidence_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          ai_suggested: boolean | null
          created_at: string | null
          decided_at: string | null
          decided_by: string | null
          decision_type: string
          id: string
          outcome: string | null
          outcome_at: string | null
          reasoning: string | null
          startup_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_suggested?: boolean | null
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_type: string
          id?: string
          outcome?: string | null
          outcome_at?: string | null
          reasoning?: string | null
          startup_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_suggested?: boolean | null
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_type?: string
          id?: string
          outcome?: string | null
          outcome_at?: string | null
          reasoning?: string | null
          startup_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decisions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "decisions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "decisions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category"]
          color_scheme: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          fonts: Json | null
          id: string
          is_default: boolean | null
          is_public: boolean | null
          name: string
          org_id: string | null
          preview_url: string | null
          slide_count: number | null
          structure: Json
          theme: string
          thumbnail_url: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["template_category"]
          color_scheme?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          fonts?: Json | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          name: string
          org_id?: string | null
          preview_url?: string | null
          slide_count?: number | null
          structure?: Json
          theme?: string
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["template_category"]
          color_scheme?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          fonts?: Json | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          name?: string
          org_id?: string | null
          preview_url?: string | null
          slide_count?: number | null
          structure?: Json
          theme?: string
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          content_json: Json
          created_at: string | null
          created_by: string | null
          document_id: string
          id: string
          label: string | null
          metadata: Json | null
          version_number: number
        }
        Insert: {
          content_json: Json
          created_at?: string | null
          created_by?: string | null
          document_id: string
          id?: string
          label?: string | null
          metadata?: Json | null
          version_number?: number
        }
        Update: {
          content_json?: Json
          created_at?: string | null
          created_by?: string | null
          document_id?: string
          id?: string
          label?: string | null
          metadata?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          startup_id: string
          status: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          startup_id: string
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          startup_id?: string
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      event_assets: {
        Row: {
          ai_generated: boolean | null
          ai_model: string | null
          ai_prompt: string | null
          approved_at: string | null
          approved_by: string | null
          asset_type: Database["public"]["Enums"]["event_asset_type"]
          call_to_action: string | null
          caption: string | null
          clicks: number | null
          comments: number | null
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          dimensions: Json | null
          engagement: Json | null
          event_id: string | null
          expires_at: string | null
          external_post_id: string | null
          external_url: string | null
          file_size_bytes: number | null
          generation_params: Json | null
          hashtags: string[] | null
          id: string
          impressions: number | null
          likes: number | null
          link_url: string | null
          media_type: string | null
          media_url: string | null
          media_urls: string[] | null
          name: string
          notes: string | null
          parent_asset_id: string | null
          platform: Database["public"]["Enums"]["asset_platform"]
          published_at: string | null
          rejection_reason: string | null
          scheduled_at: string | null
          shares: number | null
          status: Database["public"]["Enums"]["asset_status"]
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_model?: string | null
          ai_prompt?: string | null
          approved_at?: string | null
          approved_by?: string | null
          asset_type: Database["public"]["Enums"]["event_asset_type"]
          call_to_action?: string | null
          caption?: string | null
          clicks?: number | null
          comments?: number | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          engagement?: Json | null
          event_id?: string | null
          expires_at?: string | null
          external_post_id?: string | null
          external_url?: string | null
          file_size_bytes?: number | null
          generation_params?: Json | null
          hashtags?: string[] | null
          id?: string
          impressions?: number | null
          likes?: number | null
          link_url?: string | null
          media_type?: string | null
          media_url?: string | null
          media_urls?: string[] | null
          name: string
          notes?: string | null
          parent_asset_id?: string | null
          platform?: Database["public"]["Enums"]["asset_platform"]
          published_at?: string | null
          rejection_reason?: string | null
          scheduled_at?: string | null
          shares?: number | null
          status?: Database["public"]["Enums"]["asset_status"]
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_model?: string | null
          ai_prompt?: string | null
          approved_at?: string | null
          approved_by?: string | null
          asset_type?: Database["public"]["Enums"]["event_asset_type"]
          call_to_action?: string | null
          caption?: string | null
          clicks?: number | null
          comments?: number | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          engagement?: Json | null
          event_id?: string | null
          expires_at?: string | null
          external_post_id?: string | null
          external_url?: string | null
          file_size_bytes?: number | null
          generation_params?: Json | null
          hashtags?: string[] | null
          id?: string
          impressions?: number | null
          likes?: number | null
          link_url?: string | null
          media_type?: string | null
          media_url?: string | null
          media_urls?: string[] | null
          name?: string
          notes?: string | null
          parent_asset_id?: string | null
          platform?: Database["public"]["Enums"]["asset_platform"]
          published_at?: string | null
          rejection_reason?: string | null
          scheduled_at?: string | null
          shares?: number | null
          status?: Database["public"]["Enums"]["asset_status"]
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_assets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assets_parent_asset_id_fkey"
            columns: ["parent_asset_id"]
            isOneToOne: false
            referencedRelation: "event_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          accessibility_needs: string | null
          attended_sessions: Json | null
          attendee_type: Database["public"]["Enums"]["attendee_type"]
          badge_printed: boolean | null
          cancelled_at: string | null
          checked_in: boolean | null
          checked_in_at: string | null
          checked_in_by: string | null
          company: string | null
          confirmed_at: string | null
          contact_id: string | null
          created_at: string
          dietary_requirements: string | null
          email: string
          email_opted_in: boolean | null
          event_id: string | null
          feedback_rating: number | null
          feedback_submitted: boolean | null
          feedback_text: string | null
          id: string
          internal_notes: string | null
          invited_at: string | null
          last_messaged_at: string | null
          linkedin_url: string | null
          messages_received: number | null
          name: string
          notes: string | null
          phone: string | null
          referral_code: string | null
          registered_at: string | null
          registration_code: string | null
          registration_source: string | null
          rsvp_status: Database["public"]["Enums"]["rsvp_status"]
          session_preferences: Json | null
          ticket_price: number | null
          ticket_type: string | null
          title: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp_opted_in: boolean | null
        }
        Insert: {
          accessibility_needs?: string | null
          attended_sessions?: Json | null
          attendee_type?: Database["public"]["Enums"]["attendee_type"]
          badge_printed?: boolean | null
          cancelled_at?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          checked_in_by?: string | null
          company?: string | null
          confirmed_at?: string | null
          contact_id?: string | null
          created_at?: string
          dietary_requirements?: string | null
          email: string
          email_opted_in?: boolean | null
          event_id?: string | null
          feedback_rating?: number | null
          feedback_submitted?: boolean | null
          feedback_text?: string | null
          id?: string
          internal_notes?: string | null
          invited_at?: string | null
          last_messaged_at?: string | null
          linkedin_url?: string | null
          messages_received?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          referral_code?: string | null
          registered_at?: string | null
          registration_code?: string | null
          registration_source?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
          session_preferences?: Json | null
          ticket_price?: number | null
          ticket_type?: string | null
          title?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp_opted_in?: boolean | null
        }
        Update: {
          accessibility_needs?: string | null
          attended_sessions?: Json | null
          attendee_type?: Database["public"]["Enums"]["attendee_type"]
          badge_printed?: boolean | null
          cancelled_at?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          checked_in_by?: string | null
          company?: string | null
          confirmed_at?: string | null
          contact_id?: string | null
          created_at?: string
          dietary_requirements?: string | null
          email?: string
          email_opted_in?: boolean | null
          event_id?: string | null
          feedback_rating?: number | null
          feedback_submitted?: boolean | null
          feedback_text?: string | null
          id?: string
          internal_notes?: string | null
          invited_at?: string | null
          last_messaged_at?: string | null
          linkedin_url?: string | null
          messages_received?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          referral_code?: string | null
          registered_at?: string | null
          registration_code?: string | null
          registration_source?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
          session_preferences?: Json | null
          ticket_price?: number | null
          ticket_type?: string | null
          title?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp_opted_in?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_speakers: {
        Row: {
          appearance_type: string | null
          appearance_year: number | null
          created_at: string
          event_id: string | null
          id: string
          is_confirmed: boolean | null
          source_url: string | null
          speaker_company: string | null
          speaker_linkedin: string | null
          speaker_name: string
          speaker_title: string | null
          updated_at: string
        }
        Insert: {
          appearance_type?: string | null
          appearance_year?: number | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_confirmed?: boolean | null
          source_url?: string | null
          speaker_company?: string | null
          speaker_linkedin?: string | null
          speaker_name: string
          speaker_title?: string | null
          updated_at?: string
        }
        Update: {
          appearance_type?: string | null
          appearance_year?: number | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_confirmed?: boolean | null
          source_url?: string | null
          speaker_company?: string | null
          speaker_linkedin?: string | null
          speaker_name?: string
          speaker_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_speakers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "industry_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_venues: {
        Row: {
          accessibility_info: string | null
          additional_fees: Json | null
          address: string | null
          ai_analysis: string | null
          amenities: Json | null
          av_equipment: boolean | null
          booked_at: string | null
          capacity: number | null
          catering_available: boolean | null
          catering_minimum: number | null
          catering_required: boolean | null
          city: string | null
          cons: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contract_signed_at: string | null
          country: string | null
          created_at: string
          created_by: string | null
          deposit_amount: number | null
          deposit_paid_at: string | null
          description: string | null
          discovery_source: string | null
          equipment_included: Json | null
          event_id: string | null
          fit_score: number | null
          floor_plan_url: string | null
          google_place_id: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          parking_info: string | null
          photos: string[] | null
          postal_code: string | null
          pros: string | null
          rental_cost: number | null
          seated_capacity: number | null
          standing_capacity: number | null
          state: string | null
          status: Database["public"]["Enums"]["venue_status"]
          updated_at: string
          venue_type: string | null
          virtual_tour_url: string | null
          visited_at: string | null
          website: string | null
          wifi_available: boolean | null
        }
        Insert: {
          accessibility_info?: string | null
          additional_fees?: Json | null
          address?: string | null
          ai_analysis?: string | null
          amenities?: Json | null
          av_equipment?: boolean | null
          booked_at?: string | null
          capacity?: number | null
          catering_available?: boolean | null
          catering_minimum?: number | null
          catering_required?: boolean | null
          city?: string | null
          cons?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_signed_at?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          description?: string | null
          discovery_source?: string | null
          equipment_included?: Json | null
          event_id?: string | null
          fit_score?: number | null
          floor_plan_url?: string | null
          google_place_id?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          parking_info?: string | null
          photos?: string[] | null
          postal_code?: string | null
          pros?: string | null
          rental_cost?: number | null
          seated_capacity?: number | null
          standing_capacity?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["venue_status"]
          updated_at?: string
          venue_type?: string | null
          virtual_tour_url?: string | null
          visited_at?: string | null
          website?: string | null
          wifi_available?: boolean | null
        }
        Update: {
          accessibility_info?: string | null
          additional_fees?: Json | null
          address?: string | null
          ai_analysis?: string | null
          amenities?: Json | null
          av_equipment?: boolean | null
          booked_at?: string | null
          capacity?: number | null
          catering_available?: boolean | null
          catering_minimum?: number | null
          catering_required?: boolean | null
          city?: string | null
          cons?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_signed_at?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          description?: string | null
          discovery_source?: string | null
          equipment_included?: Json | null
          event_id?: string | null
          fit_score?: number | null
          floor_plan_url?: string | null
          google_place_id?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          parking_info?: string | null
          photos?: string[] | null
          postal_code?: string | null
          pros?: string | null
          rental_cost?: number | null
          seated_capacity?: number | null
          standing_capacity?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["venue_status"]
          updated_at?: string
          venue_type?: string | null
          virtual_tour_url?: string | null
          visited_at?: string | null
          website?: string | null
          wifi_available?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_venues_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          agenda: Json | null
          all_day: boolean | null
          attendees: Json | null
          attending_status:
            | Database["public"]["Enums"]["attending_status"]
            | null
          budget: number | null
          cancelled_at: string | null
          capacity: number | null
          cfp_deadline: string | null
          cfp_url: string | null
          color: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          discovered_at: string | null
          end_date: string | null
          event_scope: Database["public"]["Enums"]["event_scope"]
          event_type: Database["public"]["Enums"]["event_type"]
          external_url: string | null
          health_score: number | null
          id: string
          industry: string | null
          is_featured: boolean | null
          is_public: boolean | null
          location: string | null
          location_type:
            | Database["public"]["Enums"]["event_location_type"]
            | null
          metadata: Json | null
          name: string | null
          organizer_logo_url: string | null
          organizer_name: string | null
          published_at: string | null
          recurrence_rule: string | null
          registration_deadline: string | null
          registration_url: string | null
          related_contact_id: string | null
          related_deal_id: string | null
          related_project_id: string | null
          relevance_score: number | null
          reminder_minutes: number | null
          requires_approval: boolean | null
          slug: string | null
          source: string | null
          sponsors_confirmed: number | null
          sponsors_target: number | null
          start_date: string
          startup_id: string
          status: Database["public"]["Enums"]["event_status"]
          tags: string[] | null
          target_audience: string[] | null
          tasks_completed: number | null
          tasks_total: number | null
          ticket_price: number | null
          timezone: string | null
          title: string
          updated_at: string
          virtual_meeting_url: string | null
        }
        Insert: {
          agenda?: Json | null
          all_day?: boolean | null
          attendees?: Json | null
          attending_status?:
            | Database["public"]["Enums"]["attending_status"]
            | null
          budget?: number | null
          cancelled_at?: string | null
          capacity?: number | null
          cfp_deadline?: string | null
          cfp_url?: string | null
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discovered_at?: string | null
          end_date?: string | null
          event_scope?: Database["public"]["Enums"]["event_scope"]
          event_type?: Database["public"]["Enums"]["event_type"]
          external_url?: string | null
          health_score?: number | null
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          location?: string | null
          location_type?:
            | Database["public"]["Enums"]["event_location_type"]
            | null
          metadata?: Json | null
          name?: string | null
          organizer_logo_url?: string | null
          organizer_name?: string | null
          published_at?: string | null
          recurrence_rule?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          related_contact_id?: string | null
          related_deal_id?: string | null
          related_project_id?: string | null
          relevance_score?: number | null
          reminder_minutes?: number | null
          requires_approval?: boolean | null
          slug?: string | null
          source?: string | null
          sponsors_confirmed?: number | null
          sponsors_target?: number | null
          start_date: string
          startup_id: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          target_audience?: string[] | null
          tasks_completed?: number | null
          tasks_total?: number | null
          ticket_price?: number | null
          timezone?: string | null
          title: string
          updated_at?: string
          virtual_meeting_url?: string | null
        }
        Update: {
          agenda?: Json | null
          all_day?: boolean | null
          attendees?: Json | null
          attending_status?:
            | Database["public"]["Enums"]["attending_status"]
            | null
          budget?: number | null
          cancelled_at?: string | null
          capacity?: number | null
          cfp_deadline?: string | null
          cfp_url?: string | null
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discovered_at?: string | null
          end_date?: string | null
          event_scope?: Database["public"]["Enums"]["event_scope"]
          event_type?: Database["public"]["Enums"]["event_type"]
          external_url?: string | null
          health_score?: number | null
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          location?: string | null
          location_type?:
            | Database["public"]["Enums"]["event_location_type"]
            | null
          metadata?: Json | null
          name?: string | null
          organizer_logo_url?: string | null
          organizer_name?: string | null
          published_at?: string | null
          recurrence_rule?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          related_contact_id?: string | null
          related_deal_id?: string | null
          related_project_id?: string | null
          relevance_score?: number | null
          reminder_minutes?: number | null
          requires_approval?: boolean | null
          slug?: string | null
          source?: string | null
          sponsors_confirmed?: number | null
          sponsors_target?: number | null
          start_date?: string
          startup_id?: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          target_audience?: string[] | null
          tasks_completed?: number | null
          tasks_total?: number | null
          ticket_price?: number | null
          timezone?: string | null
          title?: string
          updated_at?: string
          virtual_meeting_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_related_contact_id_fkey"
            columns: ["related_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_related_deal_id_fkey"
            columns: ["related_deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "events_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "events_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_pack_routing: {
        Row: {
          created_at: string
          default_pack_slug: string
          feature_route: string
          id: string
          industry_override_pattern: string | null
          intent: string | null
          priority: number | null
          stage_override_pattern: string | null
        }
        Insert: {
          created_at?: string
          default_pack_slug: string
          feature_route: string
          id?: string
          industry_override_pattern?: string | null
          intent?: string | null
          priority?: number | null
          stage_override_pattern?: string | null
        }
        Update: {
          created_at?: string
          default_pack_slug?: string
          feature_route?: string
          id?: string
          industry_override_pattern?: string | null
          intent?: string | null
          priority?: number | null
          stage_override_pattern?: string | null
        }
        Relationships: []
      }
      industry_events: {
        Row: {
          audience_types: string[] | null
          categories: Database["public"]["Enums"]["event_category"][] | null
          cfp_url: string | null
          cloudinary_folder: string | null
          cloudinary_public_id: string | null
          cloudinary_version: number | null
          created_at: string
          dates_confirmed: boolean | null
          description: string | null
          end_date: string | null
          enriched_at: string | null
          enrichment_metadata: Json | null
          enrichment_status: string | null
          event_date: string | null
          expected_attendance: number | null
          format: Database["public"]["Enums"]["event_format"] | null
          full_name: string | null
          id: string
          image_path: string | null
          image_url: string | null
          linkedin_url: string | null
          location_city: string | null
          location_country: string | null
          media_pass_available:
            | Database["public"]["Enums"]["media_pass_status"]
            | null
          metadata: Json | null
          name: string
          notable_speakers: string[] | null
          registration_url: string | null
          slug: string | null
          source_domain: string | null
          startup_relevance: number | null
          tags: string[] | null
          ticket_cost_max: number | null
          ticket_cost_min: number | null
          ticket_cost_tier:
            | Database["public"]["Enums"]["ticket_cost_tier"]
            | null
          timezone: string | null
          topics: string[] | null
          twitter_handle: string | null
          typical_month: string | null
          updated_at: string
          venue: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          audience_types?: string[] | null
          categories?: Database["public"]["Enums"]["event_category"][] | null
          cfp_url?: string | null
          cloudinary_folder?: string | null
          cloudinary_public_id?: string | null
          cloudinary_version?: number | null
          created_at?: string
          dates_confirmed?: boolean | null
          description?: string | null
          end_date?: string | null
          enriched_at?: string | null
          enrichment_metadata?: Json | null
          enrichment_status?: string | null
          event_date?: string | null
          expected_attendance?: number | null
          format?: Database["public"]["Enums"]["event_format"] | null
          full_name?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          media_pass_available?:
            | Database["public"]["Enums"]["media_pass_status"]
            | null
          metadata?: Json | null
          name: string
          notable_speakers?: string[] | null
          registration_url?: string | null
          slug?: string | null
          source_domain?: string | null
          startup_relevance?: number | null
          tags?: string[] | null
          ticket_cost_max?: number | null
          ticket_cost_min?: number | null
          ticket_cost_tier?:
            | Database["public"]["Enums"]["ticket_cost_tier"]
            | null
          timezone?: string | null
          topics?: string[] | null
          twitter_handle?: string | null
          typical_month?: string | null
          updated_at?: string
          venue?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          audience_types?: string[] | null
          categories?: Database["public"]["Enums"]["event_category"][] | null
          cfp_url?: string | null
          cloudinary_folder?: string | null
          cloudinary_public_id?: string | null
          cloudinary_version?: number | null
          created_at?: string
          dates_confirmed?: boolean | null
          description?: string | null
          end_date?: string | null
          enriched_at?: string | null
          enrichment_metadata?: Json | null
          enrichment_status?: string | null
          event_date?: string | null
          expected_attendance?: number | null
          format?: Database["public"]["Enums"]["event_format"] | null
          full_name?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          media_pass_available?:
            | Database["public"]["Enums"]["media_pass_status"]
            | null
          metadata?: Json | null
          name?: string
          notable_speakers?: string[] | null
          registration_url?: string | null
          slug?: string | null
          source_domain?: string | null
          startup_relevance?: number | null
          tags?: string[] | null
          ticket_cost_max?: number | null
          ticket_cost_min?: number | null
          ticket_cost_tier?:
            | Database["public"]["Enums"]["ticket_cost_tier"]
            | null
          timezone?: string | null
          topics?: string[] | null
          twitter_handle?: string | null
          typical_month?: string | null
          updated_at?: string
          venue?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      industry_packs: {
        Row: {
          advisor_persona: string | null
          advisor_system_prompt: string | null
          benchmarks: Json | null
          common_mistakes: Json | null
          competitive_intel: Json | null
          created_at: string
          description: string | null
          diagnostics: Json | null
          display_name: string | null
          icon: string | null
          id: string
          industry: string
          investor_expectations: Json | null
          is_active: boolean | null
          market_context: Json | null
          mental_models: Json | null
          question_intro: string | null
          startup_types: Json | null
          success_stories: Json | null
          terminology: Json | null
          updated_at: string
          version: string | null
        }
        Insert: {
          advisor_persona?: string | null
          advisor_system_prompt?: string | null
          benchmarks?: Json | null
          common_mistakes?: Json | null
          competitive_intel?: Json | null
          created_at?: string
          description?: string | null
          diagnostics?: Json | null
          display_name?: string | null
          icon?: string | null
          id?: string
          industry: string
          investor_expectations?: Json | null
          is_active?: boolean | null
          market_context?: Json | null
          mental_models?: Json | null
          question_intro?: string | null
          startup_types?: Json | null
          success_stories?: Json | null
          terminology?: Json | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          advisor_persona?: string | null
          advisor_system_prompt?: string | null
          benchmarks?: Json | null
          common_mistakes?: Json | null
          competitive_intel?: Json | null
          created_at?: string
          description?: string | null
          diagnostics?: Json | null
          display_name?: string | null
          icon?: string | null
          id?: string
          industry?: string
          investor_expectations?: Json | null
          is_active?: boolean | null
          market_context?: Json | null
          mental_models?: Json | null
          question_intro?: string | null
          startup_types?: Json | null
          success_stories?: Json | null
          terminology?: Json | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      industry_playbooks: {
        Row: {
          benchmarks: Json
          created_at: string
          decision_frameworks: Json
          display_name: string
          failure_patterns: Json
          gtm_patterns: Json
          id: string
          industry_id: string
          investor_expectations: Json
          investor_questions: Json
          is_active: boolean
          narrative_arc: string | null
          prompt_context: string | null
          slide_emphasis: Json | null
          source: string | null
          stage_checklists: Json
          success_stories: Json
          terminology: Json
          updated_at: string
          version: number
          warning_signs: Json
        }
        Insert: {
          benchmarks?: Json
          created_at?: string
          decision_frameworks?: Json
          display_name: string
          failure_patterns?: Json
          gtm_patterns?: Json
          id?: string
          industry_id: string
          investor_expectations?: Json
          investor_questions?: Json
          is_active?: boolean
          narrative_arc?: string | null
          prompt_context?: string | null
          slide_emphasis?: Json | null
          source?: string | null
          stage_checklists?: Json
          success_stories?: Json
          terminology?: Json
          updated_at?: string
          version?: number
          warning_signs?: Json
        }
        Update: {
          benchmarks?: Json
          created_at?: string
          decision_frameworks?: Json
          display_name?: string
          failure_patterns?: Json
          gtm_patterns?: Json
          id?: string
          industry_id?: string
          investor_expectations?: Json
          investor_questions?: Json
          is_active?: boolean
          narrative_arc?: string | null
          prompt_context?: string | null
          slide_emphasis?: Json | null
          source?: string | null
          stage_checklists?: Json
          success_stories?: Json
          terminology?: Json
          updated_at?: string
          version?: number
          warning_signs?: Json
        }
        Relationships: []
      }
      industry_questions: {
        Row: {
          ai_coach_prompt: string | null
          category: string
          contexts: string[] | null
          created_at: string
          display_order: number
          examples: Json | null
          id: string
          input_options: Json | null
          input_type: string
          is_active: boolean | null
          is_required: boolean | null
          outputs_to: string[] | null
          pack_id: string
          quality_criteria: Json | null
          question: string
          question_key: string
          red_flags: Json | null
          stage_filter: string[] | null
          thinking_prompt: string | null
          updated_at: string
          why_this_matters: string | null
        }
        Insert: {
          ai_coach_prompt?: string | null
          category: string
          contexts?: string[] | null
          created_at?: string
          display_order?: number
          examples?: Json | null
          id?: string
          input_options?: Json | null
          input_type?: string
          is_active?: boolean | null
          is_required?: boolean | null
          outputs_to?: string[] | null
          pack_id: string
          quality_criteria?: Json | null
          question: string
          question_key: string
          red_flags?: Json | null
          stage_filter?: string[] | null
          thinking_prompt?: string | null
          updated_at?: string
          why_this_matters?: string | null
        }
        Update: {
          ai_coach_prompt?: string | null
          category?: string
          contexts?: string[] | null
          created_at?: string
          display_order?: number
          examples?: Json | null
          id?: string
          input_options?: Json | null
          input_type?: string
          is_active?: boolean | null
          is_required?: boolean | null
          outputs_to?: string[] | null
          pack_id?: string
          quality_criteria?: Json | null
          question?: string
          question_key?: string
          red_flags?: Json | null
          stage_filter?: string[] | null
          thinking_prompt?: string | null
          updated_at?: string
          why_this_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "industry_questions_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "industry_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          check_size_max: number | null
          check_size_min: number | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          firm_name: string | null
          first_contact_date: string | null
          id: string
          investment_focus: string[] | null
          last_contact_date: string | null
          linkedin_url: string | null
          meetings_count: number | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          portfolio_companies: string[] | null
          priority: string | null
          stage_focus: string[] | null
          startup_id: string
          status: string | null
          tags: string[] | null
          title: string | null
          twitter_url: string | null
          type: string | null
          updated_at: string
          warm_intro_from: string | null
          website_url: string | null
        }
        Insert: {
          check_size_max?: number | null
          check_size_min?: number | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          firm_name?: string | null
          first_contact_date?: string | null
          id?: string
          investment_focus?: string[] | null
          last_contact_date?: string | null
          linkedin_url?: string | null
          meetings_count?: number | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          portfolio_companies?: string[] | null
          priority?: string | null
          stage_focus?: string[] | null
          startup_id: string
          status?: string | null
          tags?: string[] | null
          title?: string | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string
          warm_intro_from?: string | null
          website_url?: string | null
        }
        Update: {
          check_size_max?: number | null
          check_size_min?: number | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          firm_name?: string | null
          first_contact_date?: string | null
          id?: string
          investment_focus?: string[] | null
          last_contact_date?: string | null
          linkedin_url?: string | null
          meetings_count?: number | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          portfolio_companies?: string[] | null
          priority?: string | null
          stage_focus?: string[] | null
          startup_id?: string
          status?: string | null
          tags?: string[] | null
          title?: string | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string
          warm_intro_from?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investors_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "investors_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "investors_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_chunks: {
        Row: {
          category: string
          confidence: string
          content: string
          created_at: string
          document_id: string | null
          embedding: string | null
          fetch_count: number
          id: string
          industry: string | null
          last_fetched_at: string | null
          page_end: number | null
          page_start: number | null
          region: string | null
          sample_size: number | null
          section_title: string | null
          source: string
          source_type: string
          source_url: string | null
          stage: string | null
          subcategory: string | null
          tags: string[] | null
          updated_at: string
          year: number
        }
        Insert: {
          category: string
          confidence?: string
          content: string
          created_at?: string
          document_id?: string | null
          embedding?: string | null
          fetch_count?: number
          id?: string
          industry?: string | null
          last_fetched_at?: string | null
          page_end?: number | null
          page_start?: number | null
          region?: string | null
          sample_size?: number | null
          section_title?: string | null
          source: string
          source_type: string
          source_url?: string | null
          stage?: string | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
          year: number
        }
        Update: {
          category?: string
          confidence?: string
          content?: string
          created_at?: string
          document_id?: string | null
          embedding?: string | null
          fetch_count?: number
          id?: string
          industry?: string | null
          last_fetched_at?: string | null
          page_end?: number | null
          page_start?: number | null
          region?: string | null
          sample_size?: number | null
          section_title?: string | null
          source?: string
          source_type?: string
          source_url?: string | null
          stage?: string | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          created_at: string
          id: string
          llama_parse_id: string | null
          source_type: string | null
          title: string
          year: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          llama_parse_id?: string | null
          source_type?: string | null
          title: string
          year?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          llama_parse_id?: string | null
          source_type?: string | null
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      knowledge_map: {
        Row: {
          confidence_score: number
          created_at: string
          dimension: string
          evidence_count: number
          gaps: Json
          id: string
          key_insights: Json
          last_updated_from: string | null
          source_tier: string
          startup_id: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          dimension: string
          evidence_count?: number
          gaps?: Json
          id?: string
          key_insights?: Json
          last_updated_from?: string | null
          source_tier?: string
          startup_id: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          dimension?: string
          evidence_count?: number
          gaps?: Json
          id?: string
          key_insights?: Json
          last_updated_from?: string | null
          source_tier?: string
          startup_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_map_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "knowledge_map_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "knowledge_map_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      lean_canvases: {
        Row: {
          ai_generated: boolean | null
          ai_suggestions: Json | null
          channels: string | null
          completeness_score: number | null
          cost_structure: string | null
          created_at: string
          customer_segments: Json | null
          early_adopters: string | null
          existing_alternatives: string | null
          high_level_concept: string | null
          id: string
          is_current: boolean
          key_metrics: string | null
          metadata: Json | null
          parent_version_id: string | null
          problem: string | null
          revenue_streams: string | null
          solution: string | null
          source: string | null
          startup_id: string
          status: string | null
          unfair_advantage: string | null
          unique_value_proposition: string | null
          updated_at: string
          validation_score: number | null
          version: number
        }
        Insert: {
          ai_generated?: boolean | null
          ai_suggestions?: Json | null
          channels?: string | null
          completeness_score?: number | null
          cost_structure?: string | null
          created_at?: string
          customer_segments?: Json | null
          early_adopters?: string | null
          existing_alternatives?: string | null
          high_level_concept?: string | null
          id?: string
          is_current?: boolean
          key_metrics?: string | null
          metadata?: Json | null
          parent_version_id?: string | null
          problem?: string | null
          revenue_streams?: string | null
          solution?: string | null
          source?: string | null
          startup_id: string
          status?: string | null
          unfair_advantage?: string | null
          unique_value_proposition?: string | null
          updated_at?: string
          validation_score?: number | null
          version?: number
        }
        Update: {
          ai_generated?: boolean | null
          ai_suggestions?: Json | null
          channels?: string | null
          completeness_score?: number | null
          cost_structure?: string | null
          created_at?: string
          customer_segments?: Json | null
          early_adopters?: string | null
          existing_alternatives?: string | null
          high_level_concept?: string | null
          id?: string
          is_current?: boolean
          key_metrics?: string | null
          metadata?: Json | null
          parent_version_id?: string | null
          problem?: string | null
          revenue_streams?: string | null
          solution?: string | null
          source?: string | null
          startup_id?: string
          status?: string | null
          unfair_advantage?: string | null
          unique_value_proposition?: string | null
          updated_at?: string
          validation_score?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lean_canvases_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "lean_canvases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lean_canvases_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "lean_canvases_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "lean_canvases_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_questions: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          options: Json | null
          text: string
          topic: string
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
          why_matters: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id: string
          is_active?: boolean
          options?: Json | null
          text: string
          topic: string
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
          why_matters?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          options?: Json | null
          text?: string
          topic?: string
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
          why_matters?: string | null
        }
        Relationships: []
      }
      opportunity_canvas: {
        Row: {
          adoption_barriers: Json | null
          competitive_advantage: number | null
          created_at: string | null
          enablers: Json | null
          execution_capability: number | null
          id: string
          market_readiness: number | null
          opportunity_score: number | null
          reasoning: string | null
          recommendation: string | null
          startup_id: string
          strategic_fit: string | null
          technical_feasibility: number | null
          timing_score: number | null
          updated_at: string | null
          vpc_data: Json | null
        }
        Insert: {
          adoption_barriers?: Json | null
          competitive_advantage?: number | null
          created_at?: string | null
          enablers?: Json | null
          execution_capability?: number | null
          id?: string
          market_readiness?: number | null
          opportunity_score?: number | null
          reasoning?: string | null
          recommendation?: string | null
          startup_id: string
          strategic_fit?: string | null
          technical_feasibility?: number | null
          timing_score?: number | null
          updated_at?: string | null
          vpc_data?: Json | null
        }
        Update: {
          adoption_barriers?: Json | null
          competitive_advantage?: number | null
          created_at?: string | null
          enablers?: Json | null
          execution_capability?: number | null
          id?: string
          market_readiness?: number | null
          opportunity_score?: number | null
          reasoning?: string | null
          recommendation?: string | null
          startup_id?: string
          strategic_fit?: string | null
          technical_feasibility?: number | null
          timing_score?: number | null
          updated_at?: string | null
          vpc_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_canvas_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "opportunity_canvas_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "opportunity_canvas_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          org_id: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          org_id: string
          role?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          org_id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pitch_deck_slides: {
        Row: {
          ai_generated: boolean | null
          ai_suggestions: Json | null
          chart_data: Json | null
          content: string | null
          created_at: string
          deck_id: string
          id: string
          image_url: string | null
          layout: string | null
          notes: string | null
          position: number
          slide_type: string
          title: string | null
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean | null
          ai_suggestions?: Json | null
          chart_data?: Json | null
          content?: string | null
          created_at?: string
          deck_id: string
          id?: string
          image_url?: string | null
          layout?: string | null
          notes?: string | null
          position: number
          slide_type: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean | null
          ai_suggestions?: Json | null
          chart_data?: Json | null
          content?: string | null
          created_at?: string
          deck_id?: string
          id?: string
          image_url?: string | null
          layout?: string | null
          notes?: string | null
          position?: number
          slide_type?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_deck_slides_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "pitch_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_decks: {
        Row: {
          ai_generated: boolean | null
          completeness_score: number | null
          created_at: string
          critique: Json | null
          deck_type: string
          description: string | null
          export_url: string | null
          funding_stage: string | null
          id: string
          industry_pack: string | null
          is_current: boolean
          is_public: boolean
          parent_version_id: string | null
          share_token: string | null
          slides: Json[] | null
          startup_id: string
          status: string
          title: string
          updated_at: string
          version: number
          wizard_data: Json | null
        }
        Insert: {
          ai_generated?: boolean | null
          completeness_score?: number | null
          created_at?: string
          critique?: Json | null
          deck_type?: string
          description?: string | null
          export_url?: string | null
          funding_stage?: string | null
          id?: string
          industry_pack?: string | null
          is_current?: boolean
          is_public?: boolean
          parent_version_id?: string | null
          share_token?: string | null
          slides?: Json[] | null
          startup_id: string
          status?: string
          title?: string
          updated_at?: string
          version?: number
          wizard_data?: Json | null
        }
        Update: {
          ai_generated?: boolean | null
          completeness_score?: number | null
          created_at?: string
          critique?: Json | null
          deck_type?: string
          description?: string | null
          export_url?: string | null
          funding_stage?: string | null
          id?: string
          industry_pack?: string | null
          is_current?: boolean
          is_public?: boolean
          parent_version_id?: string | null
          share_token?: string | null
          slides?: Json[] | null
          startup_id?: string
          status?: string
          title?: string
          updated_at?: string
          version?: number
          wizard_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pitch_decks_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "pitch_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitch_decks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "pitch_decks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "pitch_decks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      pivot_logs: {
        Row: {
          assumption_id: string | null
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          pivot_type: string
          reason: string
          startup_id: string
        }
        Insert: {
          assumption_id?: string | null
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          pivot_type: string
          reason: string
          startup_id: string
        }
        Update: {
          assumption_id?: string | null
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          pivot_type?: string
          reason?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pivot_logs_assumption_id_fkey"
            columns: ["assumption_id"]
            isOneToOne: false
            referencedRelation: "assumptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pivot_logs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "pivot_logs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "pivot_logs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_active_at: string | null
          onboarding_completed: boolean | null
          org_id: string | null
          preferences: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_active_at?: string | null
          onboarding_completed?: boolean | null
          org_id?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          onboarding_completed?: boolean | null
          org_id?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          health: string | null
          id: string
          name: string
          owner_id: string | null
          progress: number | null
          start_date: string | null
          startup_id: string
          status: string | null
          tags: string[] | null
          team_members: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          health?: string | null
          id?: string
          name: string
          owner_id?: string | null
          progress?: number | null
          start_date?: string | null
          startup_id: string
          status?: string | null
          tags?: string[] | null
          team_members?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          health?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          progress?: number | null
          start_date?: string | null
          startup_id?: string
          status?: string | null
          tags?: string[] | null
          team_members?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "projects_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "projects_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_pack_steps: {
        Row: {
          created_at: string
          id: string
          input_schema: Json | null
          max_tokens: number | null
          model_preference: string | null
          output_schema: Json | null
          pack_id: string
          prompt_template: string
          purpose: string
          step_order: number
          temperature: number | null
          tools: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_schema?: Json | null
          max_tokens?: number | null
          model_preference?: string | null
          output_schema?: Json | null
          pack_id: string
          prompt_template: string
          purpose: string
          step_order: number
          temperature?: number | null
          tools?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          input_schema?: Json | null
          max_tokens?: number | null
          model_preference?: string | null
          output_schema?: Json | null
          pack_id?: string
          prompt_template?: string
          purpose?: string
          step_order?: number
          temperature?: number | null
          tools?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_pack_steps_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "prompt_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_pack_steps_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "v_prompt_packs_summary"
            referencedColumns: ["pack_id"]
          },
        ]
      }
      prompt_packs: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          industry_tags: string[] | null
          is_active: boolean
          metadata: Json | null
          slug: string
          source: string | null
          stage_tags: string[] | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id: string
          industry_tags?: string[] | null
          is_active?: boolean
          metadata?: Json | null
          slug: string
          source?: string | null
          stage_tags?: string[] | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean
          metadata?: Json | null
          slug?: string
          source?: string | null
          stage_tags?: string[] | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      proposed_actions: {
        Row: {
          action_type: string
          after_state: Json | null
          agent_name: string
          ai_run_id: string | null
          approved_at: string | null
          approved_by: string | null
          before_state: Json | null
          confidence: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          org_id: string
          payload: Json
          reasoning: string | null
          rejection_reason: string | null
          startup_id: string | null
          status: string | null
          target_id: string | null
          target_table: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          after_state?: Json | null
          agent_name: string
          ai_run_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          before_state?: Json | null
          confidence?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          org_id: string
          payload: Json
          reasoning?: string | null
          rejection_reason?: string | null
          startup_id?: string | null
          status?: string | null
          target_id?: string | null
          target_table: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          after_state?: Json | null
          agent_name?: string
          ai_run_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          before_state?: Json | null
          confidence?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          org_id?: string
          payload?: Json
          reasoning?: string | null
          rejection_reason?: string | null
          startup_id?: string | null
          status?: string | null
          target_id?: string | null
          target_table?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposed_actions_ai_run_id_fkey"
            columns: ["ai_run_id"]
            isOneToOne: false
            referencedRelation: "ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposed_actions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposed_actions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposed_actions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "proposed_actions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "proposed_actions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposed_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      share_views: {
        Row: {
          country: string | null
          id: string
          ip_hash: string | null
          link_id: string
          referrer: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          country?: string | null
          id?: string
          ip_hash?: string | null
          link_id: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          country?: string | null
          id?: string
          ip_hash?: string | null
          link_id?: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_views_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "shareable_links"
            referencedColumns: ["id"]
          },
        ]
      }
      shareable_links: {
        Row: {
          access_count: number | null
          created_at: string | null
          created_by: string
          expires_at: string
          id: string
          last_accessed_at: string | null
          resource_id: string
          resource_type: string
          revoked_at: string | null
          startup_id: string
          token: string
        }
        Insert: {
          access_count?: number | null
          created_at?: string | null
          created_by: string
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          resource_id: string
          resource_type: string
          revoked_at?: string | null
          startup_id: string
          token?: string
        }
        Update: {
          access_count?: number | null
          created_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          resource_id?: string
          resource_type?: string
          revoked_at?: string | null
          startup_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "shareable_links_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "shareable_links_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "shareable_links_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      sprint_tasks: {
        Row: {
          ai_tip: string | null
          campaign_id: string
          column: string
          created_at: string
          id: string
          position: number
          priority: string
          source: string
          sprint_number: number
          success_criteria: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_tip?: string | null
          campaign_id: string
          column?: string
          created_at?: string
          id?: string
          position?: number
          priority?: string
          source: string
          sprint_number: number
          success_criteria?: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_tip?: string | null
          campaign_id?: string
          column?: string
          created_at?: string
          id?: string
          position?: number
          priority?: string
          source?: string
          sprint_number?: number
          success_criteria?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprint_tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      sprints: {
        Row: {
          act: string | null
          campaign_id: string
          cards: Json
          check: string | null
          created_at: string
          do: string | null
          end_date: string | null
          id: string
          name: string | null
          plan: string | null
          sprint_number: number
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          act?: string | null
          campaign_id: string
          cards?: Json
          check?: string | null
          created_at?: string
          do?: string | null
          end_date?: string | null
          id?: string
          name?: string | null
          plan?: string | null
          sprint_number: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          act?: string | null
          campaign_id?: string
          cards?: Json
          check?: string | null
          created_at?: string
          do?: string | null
          end_date?: string | null
          id?: string
          name?: string | null
          plan?: string | null
          sprint_number?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprints_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_members: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: string
          startup_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          startup_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          startup_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_members_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "startup_members_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "startup_members_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          channels: string | null
          created_at: string | null
          current_bet: Json | null
          deleted_at: string | null
          description: string | null
          elevator_pitch: string | null
          existing_alternatives: string | null
          id: string
          industry: string | null
          logo_url: string | null
          market_category: string | null
          market_trends: Json | null
          name: string
          one_liner: string | null
          org_id: string
          problem: string | null
          problem_one_liner: string | null
          sam_size: number | null
          solution: string | null
          som_size: number | null
          stage: string | null
          tagline: string | null
          tam_size: number | null
          updated_at: string | null
          validation_stage: string
          value_prop: string | null
          website_url: string | null
          why_now: string | null
        }
        Insert: {
          channels?: string | null
          created_at?: string | null
          current_bet?: Json | null
          deleted_at?: string | null
          description?: string | null
          elevator_pitch?: string | null
          existing_alternatives?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          market_category?: string | null
          market_trends?: Json | null
          name: string
          one_liner?: string | null
          org_id: string
          problem?: string | null
          problem_one_liner?: string | null
          sam_size?: number | null
          solution?: string | null
          som_size?: number | null
          stage?: string | null
          tagline?: string | null
          tam_size?: number | null
          updated_at?: string | null
          validation_stage?: string
          value_prop?: string | null
          website_url?: string | null
          why_now?: string | null
        }
        Update: {
          channels?: string | null
          created_at?: string | null
          current_bet?: Json | null
          deleted_at?: string | null
          description?: string | null
          elevator_pitch?: string | null
          existing_alternatives?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          market_category?: string | null
          market_trends?: Json | null
          name?: string
          one_liner?: string | null
          org_id?: string
          problem?: string | null
          problem_one_liner?: string | null
          sam_size?: number | null
          solution?: string | null
          som_size?: number | null
          stage?: string | null
          tagline?: string | null
          tam_size?: number | null
          updated_at?: string | null
          validation_stage?: string
          value_prop?: string | null
          website_url?: string | null
          why_now?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startups_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          due_at: string | null
          id: string
          priority: string | null
          project_id: string | null
          source: string | null
          startup_id: string
          status: string | null
          title: string
          trigger_rule_id: string | null
          trigger_score: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          source?: string | null
          startup_id: string
          status?: string | null
          title: string
          trigger_rule_id?: string | null
          trigger_score?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          source?: string | null
          startup_id?: string
          status?: string | null
          title?: string
          trigger_rule_id?: string | null
          trigger_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "tasks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "tasks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      validator_agent_runs: {
        Row: {
          agent_name: string
          attempt: number
          created_at: string
          duration_ms: number | null
          ended_at: string | null
          error: string | null
          id: string
          output_json: Json | null
          session_id: string
          started_at: string | null
          status: string
        }
        Insert: {
          agent_name: string
          attempt?: number
          created_at?: string
          duration_ms?: number | null
          ended_at?: string | null
          error?: string | null
          id?: string
          output_json?: Json | null
          session_id: string
          started_at?: string | null
          status?: string
        }
        Update: {
          agent_name?: string
          attempt?: number
          created_at?: string
          duration_ms?: number | null
          ended_at?: string | null
          error?: string | null
          id?: string
          output_json?: Json | null
          session_id?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "validator_agent_runs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "validator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      validator_reports: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          key_findings: string[] | null
          report_type: string
          run_id: string | null
          score: number | null
          session_id: string | null
          startup_id: string | null
          summary: string | null
          updated_at: string | null
          verification_json: Json | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          key_findings?: string[] | null
          report_type: string
          run_id?: string | null
          score?: number | null
          session_id?: string | null
          startup_id?: string | null
          summary?: string | null
          updated_at?: string | null
          verification_json?: Json | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          key_findings?: string[] | null
          report_type?: string
          run_id?: string | null
          score?: number | null
          session_id?: string | null
          startup_id?: string | null
          summary?: string | null
          updated_at?: string | null
          verification_json?: Json | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "validator_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_reports_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "validation_reports_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "validation_reports_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      validator_runs: {
        Row: {
          agent_name: string
          citations: Json | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          finished_at: string | null
          id: string
          input_json: Json | null
          model_used: string
          output_json: Json | null
          session_id: string
          started_at: string | null
          status: string
          tool_used: Json | null
        }
        Insert: {
          agent_name: string
          citations?: Json | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_json?: Json | null
          model_used?: string
          output_json?: Json | null
          session_id: string
          started_at?: string | null
          status?: string
          tool_used?: Json | null
        }
        Update: {
          agent_name?: string
          citations?: Json | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_json?: Json | null
          model_used?: string
          output_json?: Json | null
          session_id?: string
          started_at?: string | null
          status?: string
          tool_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "validator_runs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "validator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      validator_sessions: {
        Row: {
          created_at: string
          error_message: string | null
          failed_steps: string[] | null
          id: string
          input_text: string
          startup_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          failed_steps?: string[] | null
          id?: string
          input_text: string
          startup_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          failed_steps?: string[] | null
          id?: string
          input_text?: string
          startup_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "validator_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "validator_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "validator_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reviews: {
        Row: {
          ai_generated: boolean | null
          assumptions_tested: number | null
          created_at: string | null
          created_by: string
          decisions_made: number | null
          edited_by_user: boolean | null
          experiments_run: number | null
          health_score_end: number | null
          health_score_start: number | null
          id: string
          key_learnings: Json | null
          metrics: Json | null
          priorities_next_week: Json | null
          startup_id: string
          summary: string | null
          tasks_completed: number | null
          updated_at: string | null
          week_end: string
          week_start: string
        }
        Insert: {
          ai_generated?: boolean | null
          assumptions_tested?: number | null
          created_at?: string | null
          created_by: string
          decisions_made?: number | null
          edited_by_user?: boolean | null
          experiments_run?: number | null
          health_score_end?: number | null
          health_score_start?: number | null
          id?: string
          key_learnings?: Json | null
          metrics?: Json | null
          priorities_next_week?: Json | null
          startup_id: string
          summary?: string | null
          tasks_completed?: number | null
          updated_at?: string | null
          week_end: string
          week_start: string
        }
        Update: {
          ai_generated?: boolean | null
          assumptions_tested?: number | null
          created_at?: string | null
          created_by?: string
          decisions_made?: number | null
          edited_by_user?: boolean | null
          experiments_run?: number | null
          health_score_end?: number | null
          health_score_start?: number | null
          id?: string
          key_learnings?: Json | null
          metrics?: Json | null
          priorities_next_week?: Json | null
          startup_id?: string
          summary?: string | null
          tasks_completed?: number | null
          updated_at?: string | null
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reviews_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "weekly_reviews_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "weekly_reviews_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_sessions: {
        Row: {
          abandoned_at: string | null
          ai_enrichments: Json | null
          ai_extractions: Json | null
          ai_summary: Json | null
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          diagnostic_answers: Json | null
          enrichment_confidence: number | null
          enrichment_sources: string[] | null
          extracted_funding: Json | null
          extracted_traction: Json | null
          form_data: Json | null
          grounding_metadata: Json | null
          id: string
          industry_pack_id: string | null
          interview_answers: Json | null
          interview_progress: number | null
          investor_score: number | null
          last_activity_at: string | null
          profile_strength: number | null
          signals: string[] | null
          started_at: string | null
          startup_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          abandoned_at?: string | null
          ai_enrichments?: Json | null
          ai_extractions?: Json | null
          ai_summary?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          diagnostic_answers?: Json | null
          enrichment_confidence?: number | null
          enrichment_sources?: string[] | null
          extracted_funding?: Json | null
          extracted_traction?: Json | null
          form_data?: Json | null
          grounding_metadata?: Json | null
          id?: string
          industry_pack_id?: string | null
          interview_answers?: Json | null
          interview_progress?: number | null
          investor_score?: number | null
          last_activity_at?: string | null
          profile_strength?: number | null
          signals?: string[] | null
          started_at?: string | null
          startup_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          abandoned_at?: string | null
          ai_enrichments?: Json | null
          ai_extractions?: Json | null
          ai_summary?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          diagnostic_answers?: Json | null
          enrichment_confidence?: number | null
          enrichment_sources?: string[] | null
          extracted_funding?: Json | null
          extracted_traction?: Json | null
          form_data?: Json | null
          grounding_metadata?: Json | null
          id?: string
          industry_pack_id?: string | null
          interview_answers?: Json | null
          interview_progress?: number | null
          investor_score?: number | null
          last_activity_at?: string | null
          profile_strength?: number | null
          signals?: string[] | null
          started_at?: string | null
          startup_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "wizard_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "wizard_sessions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_activity_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          metadata: Json | null
          org_id: string | null
          rule_id: string | null
          score_value: number | null
          source: string
          startup_id: string | null
          task_id: string | null
          threshold_value: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          rule_id?: string | null
          score_value?: number | null
          source: string
          startup_id?: string | null
          task_id?: string | null
          threshold_value?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          rule_id?: string | null
          score_value?: number | null
          source?: string
          startup_id?: string | null
          task_id?: string | null
          threshold_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_activity_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_activity_log_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "workflow_activity_log_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "mv_startup_metrics"
            referencedColumns: ["startup_id"]
          },
          {
            foreignKeyName: "workflow_activity_log_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_activity_log_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      dashboard_metrics: {
        Row: {
          activities_this_week: number | null
          activities_total: number | null
          canvas_completion_pct: number | null
          canvas_count: number | null
          contacts_this_week: number | null
          contacts_total: number | null
          deal_win_rate: number | null
          deals_active: number | null
          deals_total: number | null
          deals_total_value: number | null
          deals_won: number | null
          experiments_completed: number | null
          experiments_total: number | null
          health_score: number | null
          interviews_this_week: number | null
          interviews_total: number | null
          org_id: string | null
          pitch_deck_count: number | null
          pitch_deck_slides: number | null
          refreshed_at: string | null
          startup_id: string | null
          startup_name: string | null
          task_completion_rate: number | null
          tasks_completed: number | null
          tasks_in_progress: number | null
          tasks_overdue: number | null
          tasks_total: number | null
          validation_active: boolean | null
          validation_score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "startups_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      events_directory: {
        Row: {
          budget: number | null
          cancelled_at: string | null
          capacity: number | null
          categories: Database["public"]["Enums"]["event_category"][] | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          display_location: string | null
          display_name: string | null
          end_date: string | null
          event_scope: Database["public"]["Enums"]["event_scope"] | null
          event_source: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          external_url: string | null
          id: string | null
          industry: string | null
          is_public: boolean | null
          location: string | null
          name: string | null
          organizer_logo_url: string | null
          organizer_name: string | null
          published_at: string | null
          registration_url: string | null
          related_contact_id: string | null
          related_deal_id: string | null
          slug: string | null
          start_date: string | null
          startup_id: string | null
          startup_relevance: number | null
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string[] | null
          target_audience: string[] | null
          ticket_cost_max: number | null
          ticket_cost_min: number | null
          ticket_cost_tier: string | null
          ticket_price: number | null
          topics: string[] | null
          updated_at: string | null
          virtual_meeting_url: string | null
          youtube_url: string | null
        }
        Relationships: []
      }
      mv_startup_metrics: {
        Row: {
          activities_7d: number | null
          canvas_completeness: number | null
          last_activity_at: string | null
          org_id: string | null
          refreshed_at: string | null
          revenue_won: number | null
          startup_id: string | null
          startup_name: string | null
          tasks_completed: number | null
          tasks_in_progress: number | null
          tasks_overdue: number | null
          tasks_pending: number | null
          total_contacts: number | null
          total_deals: number | null
          total_documents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "startups_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_industry_playbooks_summary: {
        Row: {
          benchmark_count: number | null
          created_at: string | null
          display_name: string | null
          failure_pattern_count: number | null
          gtm_pattern_count: number | null
          industry_id: string | null
          investor_question_count: number | null
          is_active: boolean | null
          stage_checklist_count: number | null
          success_story_count: number | null
          updated_at: string | null
          version: number | null
          warning_sign_count: number | null
        }
        Insert: {
          benchmark_count?: never
          created_at?: string | null
          display_name?: string | null
          failure_pattern_count?: never
          gtm_pattern_count?: never
          industry_id?: string | null
          investor_question_count?: never
          is_active?: boolean | null
          stage_checklist_count?: never
          success_story_count?: never
          updated_at?: string | null
          version?: number | null
          warning_sign_count?: never
        }
        Update: {
          benchmark_count?: never
          created_at?: string | null
          display_name?: string | null
          failure_pattern_count?: never
          gtm_pattern_count?: never
          industry_id?: string | null
          investor_question_count?: never
          is_active?: boolean | null
          stage_checklist_count?: never
          success_story_count?: never
          updated_at?: string | null
          version?: number | null
          warning_sign_count?: never
        }
        Relationships: []
      }
      v_prompt_packs_summary: {
        Row: {
          category: string | null
          industry_tags: string[] | null
          is_active: boolean | null
          pack_id: string | null
          pack_slug: string | null
          pack_title: string | null
          stage_tags: string[] | null
          step_count: number | null
          step_purposes: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_validation_score: {
        Args: {
          p_business: number
          p_competition: number
          p_execution: number
          p_market: number
          p_problem: number
          p_solution: number
          p_weights?: Json
        }
        Returns: number
      }
      can_access_realtime_channel: {
        Args: { channel_topic: string }
        Returns: boolean
      }
      capture_metric_snapshot: {
        Args: { p_startup_id: string }
        Returns: string
      }
      check_condition_rules: {
        Args: { p_payload: Json; p_rules: Json }
        Returns: boolean
      }
      check_realtime_setup: {
        Args: never
        Returns: {
          check_name: string
          details: string
          status: string
        }[]
      }
      cleanup_zombie_sessions: { Args: never; Returns: number }
      emit_automation_event: {
        Args: { p_event_name: string; p_payload?: Json; p_source?: string }
        Returns: string
      }
      find_matching_triggers: {
        Args: { p_event_name: string; p_payload?: Json }
        Returns: {
          auto_apply_outputs: boolean
          execution_mode: string
          output_targets: Json
          pack_id: string
          playbook_id: string
          trigger_id: string
          trigger_name: string
        }[]
      }
      get_current_canvas: {
        Args: { p_startup_id: string }
        Returns: {
          channels: string
          cost_structure: string
          customer_segments: string
          id: string
          key_metrics: string
          problem: string
          revenue_streams: string
          solution: string
          unfair_advantage: string
          unique_value_proposition: string
          validation_score: number
        }[]
      }
      get_filtered_industry_context: {
        Args: {
          p_feature_context: string
          p_industry_id: string
          p_stage?: string
        }
        Returns: Json
      }
      get_industry_ai_context: { Args: { p_industry: string }; Returns: Json }
      get_industry_playbook: {
        Args: { p_industry_id: string }
        Returns: {
          benchmarks: Json
          created_at: string
          decision_frameworks: Json
          display_name: string
          failure_patterns: Json
          gtm_patterns: Json
          id: string
          industry_id: string
          investor_expectations: Json
          investor_questions: Json
          is_active: boolean
          narrative_arc: string | null
          prompt_context: string | null
          slide_emphasis: Json | null
          source: string | null
          stage_checklists: Json
          success_stories: Json
          terminology: Json
          updated_at: string
          version: number
          warning_signs: Json
        }
        SetofOptions: {
          from: "*"
          to: "industry_playbooks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_industry_questions: {
        Args: { p_context?: string; p_industry: string; p_stage?: string }
        Returns: {
          ai_coach_prompt: string
          category: string
          display_order: number
          examples: Json
          id: string
          input_options: Json
          input_type: string
          is_required: boolean
          outputs_to: string[]
          quality_criteria: Json
          question: string
          question_key: string
          red_flags: Json
          thinking_prompt: string
          why_this_matters: string
        }[]
      }
      get_knowledge_stats: { Args: never; Returns: Json }
      get_metric_trends: {
        Args: { p_days?: number; p_startup_id: string }
        Returns: {
          contacts_total: number
          deals_won: number
          health_score: number
          snapshot_date: string
          tasks_completed: number
          validation_score: number
        }[]
      }
      get_next_pack_step: {
        Args: { p_current_step_order?: number; p_pack_id: string }
        Returns: {
          model_preference: string
          output_schema: Json
          prompt_template: string
          purpose: string
          step_id: string
          step_order: number
          temperature: number
        }[]
      }
      get_pack_steps: {
        Args: { p_pack_id: string }
        Returns: {
          model_preference: string
          output_schema: Json
          prompt_template: string
          purpose: string
          step_id: string
          step_order: number
          temperature: number
        }[]
      }
      get_pending_automations: {
        Args: never
        Returns: {
          execution_id: string
          pack_id: string
          playbook_id: string
          retry_attempt: number
          startup_id: string
          trigger_id: string
          trigger_payload: Json
          user_id: string
        }[]
      }
      get_pitch_deck_with_slides: { Args: { p_deck_id: string }; Returns: Json }
      get_share_token: { Args: never; Returns: string }
      get_user_org_id: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_startup_id: { Args: { p_user_id: string }; Returns: string }
      get_validation_verdict: { Args: { p_score: number }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_knowledge_fetch: {
        Args: { chunk_ids: string[] }
        Returns: undefined
      }
      increment_share_access: {
        Args: {
          share_token: string
          viewer_ip?: string
          viewer_referrer?: string
          viewer_ua?: string
        }
        Returns: undefined
      }
      increment_template_usage: {
        Args: { template_id: string }
        Returns: undefined
      }
      is_org_member: { Args: { check_org_id: string }; Returns: boolean }
      list_industries: {
        Args: never
        Returns: {
          display_name: string
          industry_id: string
        }[]
      }
      log_activity: {
        Args: {
          p_activity_type: Database["public"]["Enums"]["activity_type"]
          p_description?: string
          p_entity_id?: string
          p_entity_type?: string
          p_is_system?: boolean
          p_metadata?: Json
          p_startup_id: string
          p_title: string
        }
        Returns: string
      }
      log_prompt_pack_run: {
        Args: {
          p_action: string
          p_duration_ms?: number
          p_input_tokens?: number
          p_metadata?: Json
          p_model?: string
          p_output_tokens?: number
          p_pack_id: string
          p_status?: string
          p_user_id: string
        }
        Returns: string
      }
      org_role: { Args: never; Returns: string }
      refresh_dashboard_metrics: { Args: never; Returns: undefined }
      refresh_startup_metrics: { Args: never; Returns: undefined }
      search_best_pack: {
        Args: {
          p_industry?: string
          p_module: string
          p_stage?: string
          p_use_case?: string
        }
        Returns: {
          category: string
          description: string
          first_step_id: string
          first_step_name: string
          match_score: number
          pack_id: string
          slug: string
          step_count: number
          title: string
        }[]
      }
      search_knowledge: {
        Args: {
          filter_category?: string
          filter_industry?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          confidence: string
          content: string
          document_id: string
          document_title: string
          id: string
          industry: string
          page_end: number
          page_start: number
          section_title: string
          similarity: number
          source: string
          source_type: string
          year: number
        }[]
      }
      search_prompt_pack: {
        Args: { p_industry?: string; p_module: string; p_stage?: string }
        Returns: {
          pack_category: string
          pack_id: string
          pack_slug: string
          pack_title: string
          step_count: number
        }[]
      }
      search_prompt_packs: {
        Args: {
          p_category?: string
          p_industry?: string
          p_limit?: number
          p_stage?: string
        }
        Returns: {
          category: string
          description: string
          pack_id: string
          slug: string
          step_count: number
          title: string
        }[]
      }
      send_realtime_event: {
        Args: { event_name: string; payload: Json; topic: string }
        Returns: undefined
      }
      slide_in_org: { Args: { slide_deck_id: string }; Returns: boolean }
      start_automation_execution: {
        Args: { p_event_payload?: Json; p_trigger_id: string }
        Returns: string
      }
      startup_in_org: { Args: { check_startup_id: string }; Returns: boolean }
      update_automation_execution: {
        Args: {
          p_applied_to?: Json
          p_error_message?: string
          p_execution_id: string
          p_outputs?: Json
          p_status: string
          p_steps_completed?: number
        }
        Returns: undefined
      }
      user_org_id: { Args: never; Returns: string }
    }
    Enums: {
      action_type:
        | "create_task"
        | "send_notification"
        | "update_record"
        | "call_api"
        | "send_email"
        | "ai_generate"
        | "delay"
        | "condition"
      activity_type:
        | "task_created"
        | "task_updated"
        | "task_completed"
        | "task_deleted"
        | "task_assigned"
        | "deal_created"
        | "deal_updated"
        | "deal_stage_changed"
        | "deal_won"
        | "deal_lost"
        | "contact_created"
        | "contact_updated"
        | "contact_deleted"
        | "email_sent"
        | "call_logged"
        | "meeting_scheduled"
        | "project_created"
        | "project_updated"
        | "project_completed"
        | "milestone_reached"
        | "document_created"
        | "document_updated"
        | "document_shared"
        | "deck_created"
        | "deck_updated"
        | "deck_shared"
        | "deck_exported"
        | "ai_insight_generated"
        | "ai_task_suggested"
        | "ai_analysis_completed"
        | "ai_extraction_completed"
        | "user_joined"
        | "user_left"
        | "settings_changed"
        | "other"
      app_role: "admin" | "moderator" | "user"
      asset_platform:
        | "twitter"
        | "linkedin"
        | "instagram"
        | "facebook"
        | "tiktok"
        | "youtube"
        | "email"
        | "website"
        | "whatsapp"
        | "press"
        | "internal"
        | "other"
      asset_status:
        | "draft"
        | "review"
        | "approved"
        | "scheduled"
        | "published"
        | "failed"
        | "archived"
      assumption_source:
        | "problem"
        | "solution"
        | "unique_value_proposition"
        | "unfair_advantage"
        | "customer_segments"
        | "channels"
        | "revenue_streams"
        | "cost_structure"
        | "key_metrics"
      assumption_status:
        | "untested"
        | "testing"
        | "validated"
        | "invalidated"
        | "obsolete"
      attendee_type:
        | "general"
        | "vip"
        | "speaker"
        | "panelist"
        | "sponsor_rep"
        | "press"
        | "investor"
        | "founder"
        | "mentor"
        | "staff"
        | "volunteer"
      attending_status:
        | "interested"
        | "registered"
        | "attending"
        | "attended"
        | "not_attending"
      coach_phase:
        | "onboarding"
        | "assessment"
        | "constraint"
        | "campaign_setup"
        | "sprint_planning"
        | "sprint_execution"
        | "cycle_review"
      confidence_level: "high" | "medium" | "low"
      constraint_type:
        | "acquisition"
        | "monetization"
        | "retention"
        | "scalability"
      event_asset_type:
        | "social_post"
        | "email"
        | "graphic"
        | "banner"
        | "flyer"
        | "press_release"
        | "blog_post"
        | "video"
        | "landing_page"
        | "registration_form"
        | "agenda"
        | "speaker_bio"
        | "sponsor_logo_pack"
        | "photo"
        | "other"
      event_category:
        | "research"
        | "industry"
        | "startup_vc"
        | "trade_show"
        | "enterprise"
        | "government_policy"
        | "developer"
      event_format: "in_person" | "virtual" | "hybrid"
      event_location_type: "in_person" | "virtual" | "hybrid"
      event_scope: "internal" | "hosted" | "external"
      event_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rescheduled"
      event_task_category:
        | "planning"
        | "venue"
        | "sponsors"
        | "speakers"
        | "marketing"
        | "registration"
        | "logistics"
        | "catering"
        | "av_tech"
        | "content"
        | "communications"
        | "post_event"
        | "other"
      event_type:
        | "meeting"
        | "deadline"
        | "reminder"
        | "milestone"
        | "call"
        | "demo"
        | "pitch"
        | "funding_round"
        | "other"
        | "demo_day"
        | "pitch_night"
        | "networking"
        | "workshop"
        | "conference"
        | "meetup"
        | "webinar"
        | "hackathon"
      experiment_status:
        | "designed"
        | "recruiting"
        | "running"
        | "collecting"
        | "analyzing"
        | "completed"
        | "paused"
        | "cancelled"
      experiment_type:
        | "customer_interview"
        | "survey"
        | "landing_page"
        | "prototype_test"
        | "concierge"
        | "wizard_of_oz"
        | "smoke_test"
        | "a_b_test"
        | "fake_door"
        | "other"
      feature_context:
        | "onboarding"
        | "lean_canvas"
        | "pitch_deck"
        | "tasks"
        | "chatbot"
        | "validator"
        | "gtm_planning"
        | "fundraising"
      force_type: "push" | "pull" | "inertia" | "friction"
      funding_stage: "pre_seed" | "seed" | "series_a" | "series_b" | "growth"
      insight_type:
        | "pain_point"
        | "desired_outcome"
        | "current_behavior"
        | "switching_trigger"
        | "objection"
        | "feature_request"
        | "competitor_mention"
        | "pricing_feedback"
        | "aha_moment"
        | "job_to_be_done"
        | "quote"
        | "other"
      interview_status:
        | "scheduled"
        | "completed"
        | "transcribed"
        | "analyzed"
        | "cancelled"
        | "no_show"
      interview_type:
        | "problem_discovery"
        | "solution_validation"
        | "usability_test"
        | "customer_development"
        | "sales_call"
        | "support_call"
        | "other"
      job_type: "functional" | "emotional" | "social"
      knowledge_source_type:
        | "deloitte"
        | "bcg"
        | "pwc"
        | "mckinsey"
        | "cb_insights"
        | "gartner"
        | "forrester"
        | "harvard_business_review"
        | "mit_sloan"
        | "yc_research"
        | "a16z"
        | "sequoia"
        | "internal"
        | "other"
      media_pass_status: "yes" | "no" | "unclear"
      message_channel: "whatsapp" | "sms" | "email" | "in_app"
      message_direction: "inbound" | "outbound"
      message_status:
        | "pending"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
        | "cancelled"
      message_type:
        | "text"
        | "template"
        | "broadcast"
        | "image"
        | "document"
        | "location"
        | "contact"
        | "interactive"
      model_preference: "gemini" | "claude" | "claude-sonnet" | "auto"
      pack_category:
        | "validation"
        | "ideation"
        | "pitch"
        | "canvas"
        | "market"
        | "gtm"
        | "pricing"
        | "planning"
        | "fundraising"
      pdca_step: "plan" | "do" | "check" | "act"
      pitch_deck_status:
        | "draft"
        | "in_progress"
        | "review"
        | "final"
        | "archived"
        | "generating"
      playbook_status:
        | "suggested"
        | "active"
        | "in_progress"
        | "completed"
        | "skipped"
      question_type: "multiple_choice" | "multi_select" | "text" | "number"
      rsvp_status:
        | "invited"
        | "pending"
        | "registered"
        | "confirmed"
        | "waitlist"
        | "declined"
        | "cancelled"
        | "no_show"
      run_status: "pending" | "running" | "completed" | "failed" | "cancelled"
      segment_type:
        | "early_adopter"
        | "mainstream"
        | "enterprise"
        | "smb"
        | "consumer"
        | "prosumer"
        | "developer"
        | "other"
      slide_type:
        | "title"
        | "problem"
        | "solution"
        | "product"
        | "market"
        | "business_model"
        | "traction"
        | "competition"
        | "team"
        | "financials"
        | "ask"
        | "contact"
        | "custom"
      sponsor_status:
        | "prospect"
        | "researching"
        | "contacted"
        | "negotiating"
        | "interested"
        | "confirmed"
        | "declined"
        | "cancelled"
      sponsor_tier:
        | "platinum"
        | "gold"
        | "silver"
        | "bronze"
        | "in_kind"
        | "media"
        | "community"
      startup_event_status:
        | "draft"
        | "planning"
        | "confirmed"
        | "live"
        | "completed"
        | "cancelled"
        | "postponed"
      startup_event_type:
        | "demo_day"
        | "pitch_night"
        | "networking"
        | "workshop"
        | "investor_meetup"
        | "founder_dinner"
        | "hackathon"
        | "conference"
        | "webinar"
        | "other"
      template_category:
        | "startup"
        | "series_a"
        | "series_b"
        | "growth"
        | "enterprise"
        | "saas"
        | "marketplace"
        | "fintech"
        | "healthtech"
        | "general"
        | "custom"
      ticket_cost_tier: "free" | "low" | "medium" | "high" | "premium"
      trigger_type: "event" | "schedule" | "webhook" | "manual"
      validation_verdict: "go" | "conditional" | "pivot" | "no_go"
      venue_status:
        | "researching"
        | "shortlisted"
        | "contacted"
        | "visiting"
        | "negotiating"
        | "booked"
        | "cancelled"
        | "rejected"
      warning_severity: "critical" | "warning" | "watch"
      workflow_status: "draft" | "active" | "paused" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_type: [
        "create_task",
        "send_notification",
        "update_record",
        "call_api",
        "send_email",
        "ai_generate",
        "delay",
        "condition",
      ],
      activity_type: [
        "task_created",
        "task_updated",
        "task_completed",
        "task_deleted",
        "task_assigned",
        "deal_created",
        "deal_updated",
        "deal_stage_changed",
        "deal_won",
        "deal_lost",
        "contact_created",
        "contact_updated",
        "contact_deleted",
        "email_sent",
        "call_logged",
        "meeting_scheduled",
        "project_created",
        "project_updated",
        "project_completed",
        "milestone_reached",
        "document_created",
        "document_updated",
        "document_shared",
        "deck_created",
        "deck_updated",
        "deck_shared",
        "deck_exported",
        "ai_insight_generated",
        "ai_task_suggested",
        "ai_analysis_completed",
        "ai_extraction_completed",
        "user_joined",
        "user_left",
        "settings_changed",
        "other",
      ],
      app_role: ["admin", "moderator", "user"],
      asset_platform: [
        "twitter",
        "linkedin",
        "instagram",
        "facebook",
        "tiktok",
        "youtube",
        "email",
        "website",
        "whatsapp",
        "press",
        "internal",
        "other",
      ],
      asset_status: [
        "draft",
        "review",
        "approved",
        "scheduled",
        "published",
        "failed",
        "archived",
      ],
      assumption_source: [
        "problem",
        "solution",
        "unique_value_proposition",
        "unfair_advantage",
        "customer_segments",
        "channels",
        "revenue_streams",
        "cost_structure",
        "key_metrics",
      ],
      assumption_status: [
        "untested",
        "testing",
        "validated",
        "invalidated",
        "obsolete",
      ],
      attendee_type: [
        "general",
        "vip",
        "speaker",
        "panelist",
        "sponsor_rep",
        "press",
        "investor",
        "founder",
        "mentor",
        "staff",
        "volunteer",
      ],
      attending_status: [
        "interested",
        "registered",
        "attending",
        "attended",
        "not_attending",
      ],
      coach_phase: [
        "onboarding",
        "assessment",
        "constraint",
        "campaign_setup",
        "sprint_planning",
        "sprint_execution",
        "cycle_review",
      ],
      confidence_level: ["high", "medium", "low"],
      constraint_type: [
        "acquisition",
        "monetization",
        "retention",
        "scalability",
      ],
      event_asset_type: [
        "social_post",
        "email",
        "graphic",
        "banner",
        "flyer",
        "press_release",
        "blog_post",
        "video",
        "landing_page",
        "registration_form",
        "agenda",
        "speaker_bio",
        "sponsor_logo_pack",
        "photo",
        "other",
      ],
      event_category: [
        "research",
        "industry",
        "startup_vc",
        "trade_show",
        "enterprise",
        "government_policy",
        "developer",
      ],
      event_format: ["in_person", "virtual", "hybrid"],
      event_location_type: ["in_person", "virtual", "hybrid"],
      event_scope: ["internal", "hosted", "external"],
      event_status: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      event_task_category: [
        "planning",
        "venue",
        "sponsors",
        "speakers",
        "marketing",
        "registration",
        "logistics",
        "catering",
        "av_tech",
        "content",
        "communications",
        "post_event",
        "other",
      ],
      event_type: [
        "meeting",
        "deadline",
        "reminder",
        "milestone",
        "call",
        "demo",
        "pitch",
        "funding_round",
        "other",
        "demo_day",
        "pitch_night",
        "networking",
        "workshop",
        "conference",
        "meetup",
        "webinar",
        "hackathon",
      ],
      experiment_status: [
        "designed",
        "recruiting",
        "running",
        "collecting",
        "analyzing",
        "completed",
        "paused",
        "cancelled",
      ],
      experiment_type: [
        "customer_interview",
        "survey",
        "landing_page",
        "prototype_test",
        "concierge",
        "wizard_of_oz",
        "smoke_test",
        "a_b_test",
        "fake_door",
        "other",
      ],
      feature_context: [
        "onboarding",
        "lean_canvas",
        "pitch_deck",
        "tasks",
        "chatbot",
        "validator",
        "gtm_planning",
        "fundraising",
      ],
      force_type: ["push", "pull", "inertia", "friction"],
      funding_stage: ["pre_seed", "seed", "series_a", "series_b", "growth"],
      insight_type: [
        "pain_point",
        "desired_outcome",
        "current_behavior",
        "switching_trigger",
        "objection",
        "feature_request",
        "competitor_mention",
        "pricing_feedback",
        "aha_moment",
        "job_to_be_done",
        "quote",
        "other",
      ],
      interview_status: [
        "scheduled",
        "completed",
        "transcribed",
        "analyzed",
        "cancelled",
        "no_show",
      ],
      interview_type: [
        "problem_discovery",
        "solution_validation",
        "usability_test",
        "customer_development",
        "sales_call",
        "support_call",
        "other",
      ],
      job_type: ["functional", "emotional", "social"],
      knowledge_source_type: [
        "deloitte",
        "bcg",
        "pwc",
        "mckinsey",
        "cb_insights",
        "gartner",
        "forrester",
        "harvard_business_review",
        "mit_sloan",
        "yc_research",
        "a16z",
        "sequoia",
        "internal",
        "other",
      ],
      media_pass_status: ["yes", "no", "unclear"],
      message_channel: ["whatsapp", "sms", "email", "in_app"],
      message_direction: ["inbound", "outbound"],
      message_status: [
        "pending",
        "sent",
        "delivered",
        "read",
        "failed",
        "cancelled",
      ],
      message_type: [
        "text",
        "template",
        "broadcast",
        "image",
        "document",
        "location",
        "contact",
        "interactive",
      ],
      model_preference: ["gemini", "claude", "claude-sonnet", "auto"],
      pack_category: [
        "validation",
        "ideation",
        "pitch",
        "canvas",
        "market",
        "gtm",
        "pricing",
        "planning",
        "fundraising",
      ],
      pdca_step: ["plan", "do", "check", "act"],
      pitch_deck_status: [
        "draft",
        "in_progress",
        "review",
        "final",
        "archived",
        "generating",
      ],
      playbook_status: [
        "suggested",
        "active",
        "in_progress",
        "completed",
        "skipped",
      ],
      question_type: ["multiple_choice", "multi_select", "text", "number"],
      rsvp_status: [
        "invited",
        "pending",
        "registered",
        "confirmed",
        "waitlist",
        "declined",
        "cancelled",
        "no_show",
      ],
      run_status: ["pending", "running", "completed", "failed", "cancelled"],
      segment_type: [
        "early_adopter",
        "mainstream",
        "enterprise",
        "smb",
        "consumer",
        "prosumer",
        "developer",
        "other",
      ],
      slide_type: [
        "title",
        "problem",
        "solution",
        "product",
        "market",
        "business_model",
        "traction",
        "competition",
        "team",
        "financials",
        "ask",
        "contact",
        "custom",
      ],
      sponsor_status: [
        "prospect",
        "researching",
        "contacted",
        "negotiating",
        "interested",
        "confirmed",
        "declined",
        "cancelled",
      ],
      sponsor_tier: [
        "platinum",
        "gold",
        "silver",
        "bronze",
        "in_kind",
        "media",
        "community",
      ],
      startup_event_status: [
        "draft",
        "planning",
        "confirmed",
        "live",
        "completed",
        "cancelled",
        "postponed",
      ],
      startup_event_type: [
        "demo_day",
        "pitch_night",
        "networking",
        "workshop",
        "investor_meetup",
        "founder_dinner",
        "hackathon",
        "conference",
        "webinar",
        "other",
      ],
      template_category: [
        "startup",
        "series_a",
        "series_b",
        "growth",
        "enterprise",
        "saas",
        "marketplace",
        "fintech",
        "healthtech",
        "general",
        "custom",
      ],
      ticket_cost_tier: ["free", "low", "medium", "high", "premium"],
      trigger_type: ["event", "schedule", "webhook", "manual"],
      validation_verdict: ["go", "conditional", "pivot", "no_go"],
      venue_status: [
        "researching",
        "shortlisted",
        "contacted",
        "visiting",
        "negotiating",
        "booked",
        "cancelled",
        "rejected",
      ],
      warning_severity: ["critical", "warning", "watch"],
      workflow_status: ["draft", "active", "paused", "archived"],
    },
  },
} as const
