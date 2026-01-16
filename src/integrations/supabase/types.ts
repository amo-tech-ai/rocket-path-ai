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
          team_size: number | null
          traction_data: Json | null
          twitter_url: string | null
          unique_value: string | null
          updated_at: string | null
          use_of_funds: string[] | null
          valuation_cap: number | null
          website_url: string | null
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
          team_size?: number | null
          traction_data?: Json | null
          twitter_url?: string | null
          unique_value?: string | null
          updated_at?: string | null
          use_of_funds?: string[] | null
          valuation_cap?: number | null
          website_url?: string | null
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
          team_size?: number | null
          traction_data?: Json | null
          twitter_url?: string | null
          unique_value?: string | null
          updated_at?: string | null
          use_of_funds?: string[] | null
          valuation_cap?: number | null
          website_url?: string | null
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
          form_data: Json | null
          id: string
          industry_pack_id: string | null
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
          form_data?: Json | null
          id?: string
          industry_pack_id?: string | null
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
          form_data?: Json | null
          id?: string
          industry_pack_id?: string | null
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
      is_org_member: { Args: { check_org_id: string }; Returns: boolean }
      org_role: { Args: never; Returns: string }
      startup_in_org: { Args: { check_startup_id: string }; Returns: boolean }
      user_org_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
