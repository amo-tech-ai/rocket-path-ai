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
          activity_type: Database["public"]["Enums"]["activity_type"]
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string | null
          document_id: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          importance: string | null
          is_system_generated: boolean | null
          metadata: Json | null
          project_id: string | null
          startup_id: string
          task_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          document_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          importance?: string | null
          is_system_generated?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          startup_id: string
          task_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          document_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          importance?: string | null
          is_system_generated?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          startup_id?: string
          task_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
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
          agent_name: string
          context_id: string | null
          context_type: string | null
          cost_usd: number | null
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          input_tokens: number | null
          model: string
          org_id: string
          output_tokens: number | null
          provider: string | null
          request_metadata: Json | null
          response_metadata: Json | null
          startup_id: string | null
          status: string | null
          thinking_tokens: number | null
          user_id: string
        }
        Insert: {
          action: string
          agent_name: string
          context_id?: string | null
          context_type?: string | null
          cost_usd?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          model: string
          org_id: string
          output_tokens?: number | null
          provider?: string | null
          request_metadata?: Json | null
          response_metadata?: Json | null
          startup_id?: string | null
          status?: string | null
          thinking_tokens?: number | null
          user_id: string
        }
        Update: {
          action?: string
          agent_name?: string
          context_id?: string | null
          context_type?: string | null
          cost_usd?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          model?: string
          org_id?: string
          output_tokens?: number | null
          provider?: string | null
          request_metadata?: Json | null
          response_metadata?: Json | null
          startup_id?: string | null
          status?: string | null
          thinking_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_runs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
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
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          org_id: string | null
          proposed_action_id: string | null
          record_id: string | null
          startup_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          org_id?: string | null
          proposed_action_id?: string | null
          record_id?: string | null
          startup_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          org_id?: string | null
          proposed_action_id?: string | null
          record_id?: string | null
          startup_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_proposed_action_id_fkey"
            columns: ["proposed_action_id"]
            isOneToOne: false
            referencedRelation: "proposed_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean | null
          id: string
          name: string
          requires_approval: boolean | null
          startup_id: string
          trigger_config: Json
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          action_config: Json
          action_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          requires_approval?: boolean | null
          startup_id: string
          trigger_config: Json
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          requires_approval?: boolean | null
          startup_id?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmark_snapshots: {
        Row: {
          ai_analysis: string | null
          benchmarks: Json
          created_at: string | null
          id: string
          industry_pack_id: string | null
          metrics: Json
          percentiles: Json | null
          snapshot_date: string
          startup_id: string
        }
        Insert: {
          ai_analysis?: string | null
          benchmarks: Json
          created_at?: string | null
          id?: string
          industry_pack_id?: string | null
          metrics: Json
          percentiles?: Json | null
          snapshot_date?: string
          startup_id: string
        }
        Update: {
          ai_analysis?: string | null
          benchmarks?: Json
          created_at?: string | null
          id?: string
          industry_pack_id?: string | null
          metrics?: Json
          percentiles?: Json | null
          snapshot_date?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "benchmark_snapshots_industry_pack_id_fkey"
            columns: ["industry_pack_id"]
            isOneToOne: false
            referencedRelation: "industry_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benchmark_snapshots_startup_id_fkey"
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
          ai_run_id: string | null
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          routing: Json | null
          session_id: string
          sources: Json | null
          suggested_actions: Json | null
          tab: string
          user_id: string
        }
        Insert: {
          ai_run_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          routing?: Json | null
          session_id: string
          sources?: Json | null
          suggested_actions?: Json | null
          tab: string
          user_id: string
        }
        Update: {
          ai_run_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          routing?: Json | null
          session_id?: string
          sources?: Json | null
          suggested_actions?: Json | null
          tab?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_ai_run_id_fkey"
            columns: ["ai_run_id"]
            isOneToOne: false
            referencedRelation: "ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_pending: {
        Row: {
          content: Json
          created_at: string | null
          expires_at: string | null
          id: string
          message_id: string | null
          reasoning: string | null
          status: string | null
          suggestion_type: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message_id?: string | null
          reasoning?: string | null
          status?: string | null
          suggestion_type: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message_id?: string | null
          reasoning?: string | null
          status?: string | null
          suggestion_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_pending_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_pending_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context_snapshot: Json | null
          created_at: string | null
          ended_at: string | null
          id: string
          last_tab: string | null
          message_count: number | null
          started_at: string | null
          startup_id: string | null
          summary: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          context_snapshot?: Json | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          last_tab?: string | null
          message_count?: number | null
          started_at?: string | null
          startup_id?: string | null
          summary?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          context_snapshot?: Json | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          last_tab?: string | null
          message_count?: number | null
          started_at?: string | null
          startup_id?: string | null
          summary?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
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
        }
        Insert: {
          color?: string | null
          contact_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag: string
        }
        Update: {
          color?: string | null
          contact_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag?: string
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
          ai_summary: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          enriched_at: string | null
          id: string
          last_contacted_at: string | null
          linkedin_url: string | null
          name: string
          phone: string | null
          referred_by: string | null
          relationship_strength: string | null
          source: string | null
          startup_id: string
          sub_type: string | null
          tags: string[] | null
          title: string | null
          twitter_url: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          ai_summary?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          enriched_at?: string | null
          id?: string
          last_contacted_at?: string | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          referred_by?: string | null
          relationship_strength?: string | null
          source?: string | null
          startup_id: string
          sub_type?: string | null
          tags?: string[] | null
          title?: string | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_summary?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          enriched_at?: string | null
          id?: string
          last_contacted_at?: string | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          referred_by?: string | null
          relationship_strength?: string | null
          source?: string | null
          startup_id?: string
          sub_type?: string | null
          tags?: string[] | null
          title?: string | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
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
      deals: {
        Row: {
          actual_close: string | null
          ai_insights: Json | null
          ai_score: number | null
          amount: number | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expected_close: string | null
          id: string
          is_active: boolean | null
          lost_reason: string | null
          name: string
          notes: string | null
          probability: number | null
          risk_factors: string[] | null
          stage: string | null
          startup_id: string
          tags: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_close?: string | null
          ai_insights?: Json | null
          ai_score?: number | null
          amount?: number | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expected_close?: string | null
          id?: string
          is_active?: boolean | null
          lost_reason?: string | null
          name: string
          notes?: string | null
          probability?: number | null
          risk_factors?: string[] | null
          stage?: string | null
          startup_id: string
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_close?: string | null
          ai_insights?: Json | null
          ai_score?: number | null
          amount?: number | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expected_close?: string | null
          id?: string
          is_active?: boolean | null
          lost_reason?: string | null
          name?: string
          notes?: string | null
          probability?: number | null
          risk_factors?: string[] | null
          stage?: string | null
          startup_id?: string
          tags?: string[] | null
          type?: string | null
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
      documents: {
        Row: {
          ai_generated: boolean | null
          content: string | null
          content_json: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          startup_id: string
          status: string | null
          title: string
          type: string
          updated_at: string | null
          version: number | null
          wizard_session_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          content?: string | null
          content_json?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          startup_id: string
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          version?: number | null
          wizard_session_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          content?: string | null
          content_json?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          startup_id?: string
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          version?: number | null
          wizard_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_wizard_session_id_fkey"
            columns: ["wizard_session_id"]
            isOneToOne: false
            referencedRelation: "wizard_sessions"
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
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          ai_extracted: boolean | null
          ai_summary: string | null
          bucket: string | null
          category: string | null
          created_at: string | null
          filename: string
          id: string
          metadata: Json | null
          mime_type: string
          original_filename: string
          size_bytes: number
          startup_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          ai_extracted?: boolean | null
          ai_summary?: string | null
          bucket?: string | null
          category?: string | null
          created_at?: string | null
          filename: string
          id?: string
          metadata?: Json | null
          mime_type: string
          original_filename: string
          size_bytes: number
          startup_id: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          ai_extracted?: boolean | null
          ai_summary?: string | null
          bucket?: string | null
          category?: string | null
          created_at?: string | null
          filename?: string
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          size_bytes?: number
          startup_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_packs: {
        Row: {
          advisor_persona: string | null
          advisor_system_prompt: string | null
          benchmarks: Json | null
          case_studies: Json | null
          competitive_intel: Json | null
          created_at: string | null
          description: string | null
          diagnostics: Json | null
          display_name: string
          icon: string | null
          id: string
          industry: string
          is_active: boolean | null
          mental_models: Json | null
          playbooks_summary: Json | null
          terminology: Json | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          advisor_persona?: string | null
          advisor_system_prompt?: string | null
          benchmarks?: Json | null
          case_studies?: Json | null
          competitive_intel?: Json | null
          created_at?: string | null
          description?: string | null
          diagnostics?: Json | null
          display_name: string
          icon?: string | null
          id?: string
          industry: string
          is_active?: boolean | null
          mental_models?: Json | null
          playbooks_summary?: Json | null
          terminology?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          advisor_persona?: string | null
          advisor_system_prompt?: string | null
          benchmarks?: Json | null
          case_studies?: Json | null
          competitive_intel?: Json | null
          created_at?: string | null
          description?: string | null
          diagnostics?: Json | null
          display_name?: string
          icon?: string | null
          id?: string
          industry?: string
          is_active?: boolean | null
          mental_models?: Json | null
          playbooks_summary?: Json | null
          terminology?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          access_token_encrypted: string | null
          created_at: string | null
          error_message: string | null
          id: string
          last_sync_at: string | null
          org_id: string
          provider: string
          refresh_token_encrypted: string | null
          scopes: string[] | null
          settings: Json | null
          status: string | null
          token_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          access_token_encrypted?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          org_id: string
          provider: string
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          settings?: Json | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token_encrypted?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          org_id?: string
          provider?: string
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          settings?: Json | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_confidence: number | null
          ai_handled: boolean | null
          ai_intent: string | null
          ai_response_time_ms: number | null
          attendee_id: string | null
          broadcast_id: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          content: string
          conversation_id: string | null
          created_at: string
          created_by: string | null
          delivered_at: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          error_message: string | null
          escalated: boolean | null
          escalated_at: string | null
          escalated_to: string | null
          escalation_reason: string | null
          event_id: string | null
          external_message_id: string | null
          failed_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          message_type: Database["public"]["Enums"]["message_type"]
          read_at: string | null
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          resolved: boolean | null
          resolved_at: string | null
          sent_at: string | null
          startup_event_id: string
          status: Database["public"]["Enums"]["message_status"]
          template_name: string | null
          template_params: Json | null
          updated_at: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_handled?: boolean | null
          ai_intent?: string | null
          ai_response_time_ms?: number | null
          attendee_id?: string | null
          broadcast_id?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          content: string
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          error_message?: string | null
          escalated?: boolean | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          event_id?: string | null
          external_message_id?: string | null
          failed_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"]
          read_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          sent_at?: string | null
          startup_event_id: string
          status?: Database["public"]["Enums"]["message_status"]
          template_name?: string | null
          template_params?: Json | null
          updated_at?: string
        }
        Update: {
          ai_confidence?: number | null
          ai_handled?: boolean | null
          ai_intent?: string | null
          ai_response_time_ms?: number | null
          attendee_id?: string | null
          broadcast_id?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          content?: string
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"]
          error_message?: string | null
          escalated?: boolean | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          event_id?: string | null
          external_message_id?: string | null
          failed_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"]
          read_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          sent_at?: string | null
          startup_event_id?: string
          status?: Database["public"]["Enums"]["message_status"]
          template_name?: string | null
          template_params?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_messages_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "event_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          metadata: Json | null
          priority: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string | null
          id: string
          invited_by: string | null
          invited_email: string | null
          joined_at: string | null
          org_id: string
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string | null
          org_id: string
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string | null
          org_id?: string
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          background_url: string | null
          content: Json | null
          created_at: string
          deck_id: string
          id: string
          image_url: string | null
          is_visible: boolean | null
          layout: string | null
          notes: string | null
          slide_number: number
          slide_type: Database["public"]["Enums"]["slide_type"]
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_url?: string | null
          content?: Json | null
          created_at?: string
          deck_id: string
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          layout?: string | null
          notes?: string | null
          slide_number: number
          slide_type?: Database["public"]["Enums"]["slide_type"]
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_url?: string | null
          content?: Json | null
          created_at?: string
          deck_id?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          layout?: string | null
          notes?: string | null
          slide_number?: number
          slide_type?: Database["public"]["Enums"]["slide_type"]
          subtitle?: string | null
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
          created_at: string
          created_by: string | null
          deck_type: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_edited_by: string | null
          slide_count: number | null
          startup_id: string
          status: Database["public"]["Enums"]["pitch_deck_status"]
          template: string | null
          theme: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deck_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_edited_by?: string | null
          slide_count?: number | null
          startup_id: string
          status?: Database["public"]["Enums"]["pitch_deck_status"]
          template?: string | null
          theme?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deck_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_edited_by?: string | null
          slide_count?: number | null
          startup_id?: string
          status?: Database["public"]["Enums"]["pitch_deck_status"]
          template?: string | null
          theme?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_decks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      playbooks: {
        Row: {
          content: string
          content_structured: Json | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          estimated_duration: string | null
          id: string
          is_active: boolean | null
          outcomes: string[] | null
          pack_id: string
          prerequisites: string[] | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          content: string
          content_structured?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_duration?: string | null
          id?: string
          is_active?: boolean | null
          outcomes?: string[] | null
          pack_id: string
          prerequisites?: string[] | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          content?: string
          content_structured?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_duration?: string | null
          id?: string
          is_active?: boolean | null
          outcomes?: string[] | null
          pack_id?: string
          prerequisites?: string[] | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playbooks_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "industry_packs"
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
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
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
      sponsors: {
        Row: {
          ai_notes: string | null
          amount: number | null
          benefits: Json | null
          company_name: string | null
          confirmed_at: string | null
          contact_email: string | null
          contact_id: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          contract_signed_at: string | null
          created_at: string
          created_by: string | null
          deliverables: Json | null
          description: string | null
          discovery_source: string | null
          event_id: string | null
          follow_up_date: string | null
          id: string
          in_kind_description: string | null
          in_kind_value: number | null
          internal_notes: string | null
          last_contacted_at: string | null
          logo_url: string | null
          match_score: number | null
          name: string
          notes: string | null
          outreach_sent_at: string | null
          outreach_template: string | null
          payment_received_at: string | null
          response_received_at: string | null
          status: Database["public"]["Enums"]["sponsor_status"]
          tier: Database["public"]["Enums"]["sponsor_tier"]
          updated_at: string
          website: string | null
        }
        Insert: {
          ai_notes?: string | null
          amount?: number | null
          benefits?: Json | null
          company_name?: string | null
          confirmed_at?: string | null
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          contract_signed_at?: string | null
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          discovery_source?: string | null
          event_id?: string | null
          follow_up_date?: string | null
          id?: string
          in_kind_description?: string | null
          in_kind_value?: number | null
          internal_notes?: string | null
          last_contacted_at?: string | null
          logo_url?: string | null
          match_score?: number | null
          name: string
          notes?: string | null
          outreach_sent_at?: string | null
          outreach_template?: string | null
          payment_received_at?: string | null
          response_received_at?: string | null
          status?: Database["public"]["Enums"]["sponsor_status"]
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          ai_notes?: string | null
          amount?: number | null
          benefits?: Json | null
          company_name?: string | null
          confirmed_at?: string | null
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          contract_signed_at?: string | null
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          discovery_source?: string | null
          event_id?: string | null
          follow_up_date?: string | null
          id?: string
          in_kind_description?: string | null
          in_kind_value?: number | null
          internal_notes?: string | null
          last_contacted_at?: string | null
          logo_url?: string | null
          match_score?: number | null
          name?: string
          notes?: string | null
          outreach_sent_at?: string | null
          outreach_template?: string | null
          payment_received_at?: string | null
          response_received_at?: string | null
          status?: Database["public"]["Enums"]["sponsor_status"]
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_event_tasks: {
        Row: {
          blocks: string[] | null
          category: Database["public"]["Enums"]["event_task_category"]
          created_at: string
          depends_on: string[] | null
          due_offset_days: number | null
          id: string
          is_critical_path: boolean | null
          is_milestone: boolean | null
          notes: string | null
          startup_event_id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          blocks?: string[] | null
          category?: Database["public"]["Enums"]["event_task_category"]
          created_at?: string
          depends_on?: string[] | null
          due_offset_days?: number | null
          id?: string
          is_critical_path?: boolean | null
          is_milestone?: boolean | null
          notes?: string | null
          startup_event_id: string
          task_id: string
          updated_at?: string
        }
        Update: {
          blocks?: string[] | null
          category?: Database["public"]["Enums"]["event_task_category"]
          created_at?: string
          depends_on?: string[] | null
          due_offset_days?: number | null
          id?: string
          is_critical_path?: boolean | null
          is_milestone?: boolean | null
          notes?: string | null
          startup_event_id?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_event_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_playbooks: {
        Row: {
          completed_at: string | null
          match_confidence: number | null
          match_reason: string | null
          matched_at: string | null
          notes: string | null
          playbook_id: string
          progress: number | null
          started_at: string | null
          startup_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          match_confidence?: number | null
          match_reason?: string | null
          matched_at?: string | null
          notes?: string | null
          playbook_id: string
          progress?: number | null
          started_at?: string | null
          startup_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          match_confidence?: number | null
          match_reason?: string | null
          matched_at?: string | null
          notes?: string | null
          playbook_id?: string
          progress?: number | null
          started_at?: string | null
          startup_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_playbooks_playbook_id_fkey"
            columns: ["playbook_id"]
            isOneToOne: false
            referencedRelation: "playbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_playbooks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          ai_summary: string | null
          business_model: string[] | null
          competitors: string[] | null
          created_at: string | null
          customer_segments: Json | null
          deep_research_report: string | null
          description: string | null
          founders: Json | null
          funding_rounds: Json | null
          github_url: string | null
          id: string
          industry: string | null
          interview_signals: string[] | null
          investor_ready_score: number | null
          investor_score_breakdown: Json | null
          is_raising: boolean | null
          key_features: string[] | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          org_id: string
          pricing_model: string | null
          profile_strength: number | null
          raise_amount: number | null
          stage: string | null
          sub_industry: string | null
          tagline: string | null
          target_customers: string[] | null
          target_market: string | null
          team_size: number | null
          traction_data: Json | null
          twitter_url: string | null
          unique_value: string | null
          updated_at: string | null
          use_of_funds: string[] | null
          valuation_cap: number | null
          website_url: string | null
          year_founded: number | null
        }
        Insert: {
          ai_summary?: string | null
          business_model?: string[] | null
          competitors?: string[] | null
          created_at?: string | null
          customer_segments?: Json | null
          deep_research_report?: string | null
          description?: string | null
          founders?: Json | null
          funding_rounds?: Json | null
          github_url?: string | null
          id?: string
          industry?: string | null
          interview_signals?: string[] | null
          investor_ready_score?: number | null
          investor_score_breakdown?: Json | null
          is_raising?: boolean | null
          key_features?: string[] | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          org_id: string
          pricing_model?: string | null
          profile_strength?: number | null
          raise_amount?: number | null
          stage?: string | null
          sub_industry?: string | null
          tagline?: string | null
          target_customers?: string[] | null
          target_market?: string | null
          team_size?: number | null
          traction_data?: Json | null
          twitter_url?: string | null
          unique_value?: string | null
          updated_at?: string | null
          use_of_funds?: string[] | null
          valuation_cap?: number | null
          website_url?: string | null
          year_founded?: number | null
        }
        Update: {
          ai_summary?: string | null
          business_model?: string[] | null
          competitors?: string[] | null
          created_at?: string | null
          customer_segments?: Json | null
          deep_research_report?: string | null
          description?: string | null
          founders?: Json | null
          funding_rounds?: Json | null
          github_url?: string | null
          id?: string
          industry?: string | null
          interview_signals?: string[] | null
          investor_ready_score?: number | null
          investor_score_breakdown?: Json | null
          is_raising?: boolean | null
          key_features?: string[] | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          org_id?: string
          pricing_model?: string | null
          profile_strength?: number | null
          raise_amount?: number | null
          stage?: string | null
          sub_industry?: string | null
          tagline?: string | null
          target_customers?: string[] | null
          target_market?: string | null
          team_size?: number | null
          traction_data?: Json | null
          twitter_url?: string | null
          unique_value?: string | null
          updated_at?: string | null
          use_of_funds?: string[] | null
          valuation_cap?: number | null
          website_url?: string | null
          year_founded?: number | null
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
          ai_generated: boolean | null
          ai_source: string | null
          assigned_to: string | null
          category: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          description: string | null
          due_at: string | null
          id: string
          parent_task_id: string | null
          phase: string | null
          priority: string | null
          project_id: string | null
          startup_id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_source?: string | null
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          parent_task_id?: string | null
          phase?: string | null
          priority?: string | null
          project_id?: string | null
          startup_id: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_source?: string | null
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          parent_task_id?: string | null
          phase?: string | null
          priority?: string | null
          project_id?: string | null
          startup_id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_contact_id"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_deal_id"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
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
      wizard_extractions: {
        Row: {
          ai_run_id: string | null
          confidence: number | null
          created_at: string | null
          extracted_data: Json
          extraction_type: string
          id: string
          raw_content: string | null
          session_id: string
          source_url: string | null
        }
        Insert: {
          ai_run_id?: string | null
          confidence?: number | null
          created_at?: string | null
          extracted_data: Json
          extraction_type: string
          id?: string
          raw_content?: string | null
          session_id: string
          source_url?: string | null
        }
        Update: {
          ai_run_id?: string | null
          confidence?: number | null
          created_at?: string | null
          extracted_data?: Json
          extraction_type?: string
          id?: string
          raw_content?: string | null
          session_id?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wizard_extractions_ai_run_id_fkey"
            columns: ["ai_run_id"]
            isOneToOne: false
            referencedRelation: "ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_extractions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "wizard_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_sessions: {
        Row: {
          ai_extractions: Json | null
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          diagnostic_answers: Json | null
          enrichment_confidence: number | null
          enrichment_sources: string[] | null
          extracted_funding: Json | null
          extracted_traction: Json | null
          form_data: Json | null
          id: string
          industry_pack_id: string | null
          interview_answers: Json | null
          interview_progress: number | null
          last_activity_at: string | null
          profile_strength: number | null
          signals: string[] | null
          started_at: string | null
          startup_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          ai_extractions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          diagnostic_answers?: Json | null
          enrichment_confidence?: number | null
          enrichment_sources?: string[] | null
          extracted_funding?: Json | null
          extracted_traction?: Json | null
          form_data?: Json | null
          id?: string
          industry_pack_id?: string | null
          interview_answers?: Json | null
          interview_progress?: number | null
          last_activity_at?: string | null
          profile_strength?: number | null
          signals?: string[] | null
          started_at?: string | null
          startup_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          ai_extractions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          diagnostic_answers?: Json | null
          enrichment_confidence?: number | null
          enrichment_sources?: string[] | null
          extracted_funding?: Json | null
          extracted_traction?: Json | null
          form_data?: Json | null
          id?: string
          industry_pack_id?: string | null
          interview_answers?: Json | null
          interview_progress?: number | null
          last_activity_at?: string | null
          profile_strength?: number | null
          signals?: string[] | null
          started_at?: string | null
          startup_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_wizard_sessions_industry_pack_id"
            columns: ["industry_pack_id"]
            isOneToOne: false
            referencedRelation: "industry_packs"
            referencedColumns: ["id"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_template_usage: {
        Args: { template_id: string }
        Returns: undefined
      }
      is_org_member: { Args: { check_org_id: string }; Returns: boolean }
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
      org_role: { Args: never; Returns: string }
      slide_in_org: { Args: { slide_deck_id: string }; Returns: boolean }
      startup_in_org: { Args: { check_startup_id: string }; Returns: boolean }
      user_org_id: { Args: never; Returns: string }
    }
    Enums: {
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
      pitch_deck_status:
        | "draft"
        | "in_progress"
        | "review"
        | "final"
        | "archived"
      rsvp_status:
        | "invited"
        | "pending"
        | "registered"
        | "confirmed"
        | "waitlist"
        | "declined"
        | "cancelled"
        | "no_show"
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
      venue_status:
        | "researching"
        | "shortlisted"
        | "contacted"
        | "visiting"
        | "negotiating"
        | "booked"
        | "cancelled"
        | "rejected"
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
      ],
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
      pitch_deck_status: [
        "draft",
        "in_progress",
        "review",
        "final",
        "archived",
      ],
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
    },
  },
} as const
