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
      competitor_profiles: {
        Row: {
          competitor_type: string | null
          created_at: string
          description: string | null
          discovered_at: string | null
          employee_count: string | null
          funding_amount: number | null
          funding_currency: string | null
          funding_stage: string | null
          id: string
          industry: string | null
          last_updated_at: string | null
          market_share: number | null
          name: string
          pricing_model: string | null
          pricing_range: string | null
          raw_data: Json | null
          region: string | null
          source: string | null
          source_url: string | null
          startup_id: string | null
          strengths: string[] | null
          threat_level: string | null
          updated_at: string
          validation_report_id: string | null
          weaknesses: string[] | null
          website: string | null
        }
        Insert: {
          competitor_type?: string | null
          created_at?: string
          description?: string | null
          discovered_at?: string | null
          employee_count?: string | null
          funding_amount?: number | null
          funding_currency?: string | null
          funding_stage?: string | null
          id?: string
          industry?: string | null
          last_updated_at?: string | null
          market_share?: number | null
          name: string
          pricing_model?: string | null
          pricing_range?: string | null
          raw_data?: Json | null
          region?: string | null
          source?: string | null
          source_url?: string | null
          startup_id?: string | null
          strengths?: string[] | null
          threat_level?: string | null
          updated_at?: string
          validation_report_id?: string | null
          weaknesses?: string[] | null
          website?: string | null
        }
        Update: {
          competitor_type?: string | null
          created_at?: string
          description?: string | null
          discovered_at?: string | null
          employee_count?: string | null
          funding_amount?: number | null
          funding_currency?: string | null
          funding_stage?: string | null
          id?: string
          industry?: string | null
          last_updated_at?: string | null
          market_share?: number | null
          name?: string
          pricing_model?: string | null
          pricing_range?: string | null
          raw_data?: Json | null
          region?: string | null
          source?: string | null
          source_url?: string | null
          startup_id?: string | null
          strengths?: string[] | null
          threat_level?: string | null
          updated_at?: string
          validation_report_id?: string | null
          weaknesses?: string[] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_profiles_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_profiles_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
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
      critic_reviews: {
        Row: {
          adjusted_score: number | null
          assumptions: Json | null
          counter_arguments: Json | null
          created_at: string
          elephant_in_room: string | null
          id: string
          investor_questions: Json | null
          model_used: string | null
          risk_deduction: number | null
          risk_level: string | null
          risks: Json | null
          startup_id: string | null
          tokens_used: number | null
          top_3_risks: Json | null
          total_risk_score: number | null
          updated_at: string
          validation_report_id: string
        }
        Insert: {
          adjusted_score?: number | null
          assumptions?: Json | null
          counter_arguments?: Json | null
          created_at?: string
          elephant_in_room?: string | null
          id?: string
          investor_questions?: Json | null
          model_used?: string | null
          risk_deduction?: number | null
          risk_level?: string | null
          risks?: Json | null
          startup_id?: string | null
          tokens_used?: number | null
          top_3_risks?: Json | null
          total_risk_score?: number | null
          updated_at?: string
          validation_report_id: string
        }
        Update: {
          adjusted_score?: number | null
          assumptions?: Json | null
          counter_arguments?: Json | null
          created_at?: string
          elephant_in_room?: string | null
          id?: string
          investor_questions?: Json | null
          model_used?: string | null
          risk_deduction?: number | null
          risk_level?: string | null
          risks?: Json | null
          startup_id?: string | null
          tokens_used?: number | null
          top_3_risks?: Json | null
          total_risk_score?: number | null
          updated_at?: string
          validation_report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "critic_reviews_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "critic_reviews_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
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
          ai_generated: boolean | null
          content: string | null
          content_json: Json | null
          created_at: string | null
          created_by: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          metadata: Json | null
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
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
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
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
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
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hosted_events"
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
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hosted_events"
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
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_venues_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_venues_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hosted_events"
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
      framework_analyses: {
        Row: {
          analysis_data: Json
          created_at: string
          framework_score: number | null
          framework_type: string
          id: string
          industry: string | null
          key_insights: string[] | null
          model_used: string | null
          recommendations: string[] | null
          stage: string | null
          startup_id: string | null
          tokens_used: number | null
          updated_at: string
          validation_report_id: string | null
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          framework_score?: number | null
          framework_type: string
          id?: string
          industry?: string | null
          key_insights?: string[] | null
          model_used?: string | null
          recommendations?: string[] | null
          stage?: string | null
          startup_id?: string | null
          tokens_used?: number | null
          updated_at?: string
          validation_report_id?: string | null
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          framework_score?: number | null
          framework_type?: string
          id?: string
          industry?: string | null
          key_insights?: string[] | null
          model_used?: string | null
          recommendations?: string[] | null
          stage?: string | null
          startup_id?: string | null
          tokens_used?: number | null
          updated_at?: string
          validation_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_analyses_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "framework_analyses_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_ideas: {
        Row: {
          background_input: Json
          batch_id: string | null
          business_model: string[] | null
          comparison_notes: string | null
          created_at: string
          description: string | null
          generation_prompt: string | null
          generation_type: string | null
          id: string
          industry: string | null
          model_used: string | null
          one_liner: string | null
          pre_validation_score: number | null
          problem_statement: string | null
          rank_in_batch: number | null
          score_rationale: string | null
          solution_description: string | null
          status: string | null
          target_market: string | null
          title: string
          updated_at: string
          user_id: string | null
          validation_report_id: string | null
        }
        Insert: {
          background_input: Json
          batch_id?: string | null
          business_model?: string[] | null
          comparison_notes?: string | null
          created_at?: string
          description?: string | null
          generation_prompt?: string | null
          generation_type?: string | null
          id?: string
          industry?: string | null
          model_used?: string | null
          one_liner?: string | null
          pre_validation_score?: number | null
          problem_statement?: string | null
          rank_in_batch?: number | null
          score_rationale?: string | null
          solution_description?: string | null
          status?: string | null
          target_market?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          validation_report_id?: string | null
        }
        Update: {
          background_input?: Json
          batch_id?: string | null
          business_model?: string[] | null
          comparison_notes?: string | null
          created_at?: string
          description?: string | null
          generation_prompt?: string | null
          generation_type?: string | null
          id?: string
          industry?: string | null
          model_used?: string | null
          one_liner?: string | null
          pre_validation_score?: number | null
          problem_statement?: string | null
          rank_in_batch?: number | null
          score_rationale?: string | null
          solution_description?: string | null
          status?: string | null
          target_market?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          validation_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_ideas_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
            referencedColumns: ["id"]
          },
        ]
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
          case_studies: Json | null
          common_mistakes: Json | null
          competitive_intel: Json | null
          created_at: string | null
          description: string | null
          diagnostics: Json | null
          display_name: string
          icon: string | null
          id: string
          industry: string
          investor_expectations: Json | null
          is_active: boolean | null
          market_context: Json | null
          mental_models: Json | null
          playbooks_summary: Json | null
          question_intro: string | null
          startup_types: Json | null
          success_stories: Json | null
          terminology: Json | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          advisor_persona?: string | null
          advisor_system_prompt?: string | null
          benchmarks?: Json | null
          case_studies?: Json | null
          common_mistakes?: Json | null
          competitive_intel?: Json | null
          created_at?: string | null
          description?: string | null
          diagnostics?: Json | null
          display_name: string
          icon?: string | null
          id?: string
          industry: string
          investor_expectations?: Json | null
          is_active?: boolean | null
          market_context?: Json | null
          mental_models?: Json | null
          playbooks_summary?: Json | null
          question_intro?: string | null
          startup_types?: Json | null
          success_stories?: Json | null
          terminology?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          advisor_persona?: string | null
          advisor_system_prompt?: string | null
          benchmarks?: Json | null
          case_studies?: Json | null
          common_mistakes?: Json | null
          competitive_intel?: Json | null
          created_at?: string | null
          description?: string | null
          diagnostics?: Json | null
          display_name?: string
          icon?: string | null
          id?: string
          industry?: string
          investor_expectations?: Json | null
          is_active?: boolean | null
          market_context?: Json | null
          mental_models?: Json | null
          playbooks_summary?: Json | null
          question_intro?: string | null
          startup_types?: Json | null
          success_stories?: Json | null
          terminology?: Json | null
          updated_at?: string | null
          version?: number | null
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
      lean_canvases: {
        Row: {
          channels: string | null
          cost_structure: string | null
          created_at: string | null
          customer_segments: string | null
          id: string
          is_current: boolean | null
          key_metrics: string | null
          metadata: Json | null
          problem: string | null
          revenue_streams: string | null
          solution: string | null
          source: string | null
          startup_id: string
          unfair_advantage: string | null
          unique_value_proposition: string | null
          updated_at: string | null
          validation_score: number | null
          version: number | null
        }
        Insert: {
          channels?: string | null
          cost_structure?: string | null
          created_at?: string | null
          customer_segments?: string | null
          id?: string
          is_current?: boolean | null
          key_metrics?: string | null
          metadata?: Json | null
          problem?: string | null
          revenue_streams?: string | null
          solution?: string | null
          source?: string | null
          startup_id: string
          unfair_advantage?: string | null
          unique_value_proposition?: string | null
          updated_at?: string | null
          validation_score?: number | null
          version?: number | null
        }
        Update: {
          channels?: string | null
          cost_structure?: string | null
          created_at?: string | null
          customer_segments?: string | null
          id?: string
          is_current?: boolean | null
          key_metrics?: string | null
          metadata?: Json | null
          problem?: string | null
          revenue_streams?: string | null
          solution?: string | null
          source?: string | null
          startup_id?: string
          unfair_advantage?: string | null
          unique_value_proposition?: string | null
          updated_at?: string | null
          validation_score?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lean_canvases_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      market_sizes: {
        Row: {
          calculated_at: string | null
          confidence_level: string | null
          created_at: string
          data_quality: string | null
          expires_at: string | null
          growth_drivers: string[] | null
          growth_rate: number | null
          id: string
          industry: string
          market_trends: string[] | null
          region: string | null
          sam_percentage: number | null
          sam_rationale: string | null
          sam_value: number | null
          segment: string | null
          som_percentage: number | null
          som_rationale: string | null
          som_timeline: string | null
          som_value: number | null
          sources: Json | null
          startup_id: string | null
          tam_currency: string | null
          tam_methodology: string | null
          tam_source: string | null
          tam_unit: string | null
          tam_value: number | null
          tam_year: number | null
          updated_at: string
          validation_report_id: string | null
        }
        Insert: {
          calculated_at?: string | null
          confidence_level?: string | null
          created_at?: string
          data_quality?: string | null
          expires_at?: string | null
          growth_drivers?: string[] | null
          growth_rate?: number | null
          id?: string
          industry: string
          market_trends?: string[] | null
          region?: string | null
          sam_percentage?: number | null
          sam_rationale?: string | null
          sam_value?: number | null
          segment?: string | null
          som_percentage?: number | null
          som_rationale?: string | null
          som_timeline?: string | null
          som_value?: number | null
          sources?: Json | null
          startup_id?: string | null
          tam_currency?: string | null
          tam_methodology?: string | null
          tam_source?: string | null
          tam_unit?: string | null
          tam_value?: number | null
          tam_year?: number | null
          updated_at?: string
          validation_report_id?: string | null
        }
        Update: {
          calculated_at?: string | null
          confidence_level?: string | null
          created_at?: string
          data_quality?: string | null
          expires_at?: string | null
          growth_drivers?: string[] | null
          growth_rate?: number | null
          id?: string
          industry?: string
          market_trends?: string[] | null
          region?: string | null
          sam_percentage?: number | null
          sam_rationale?: string | null
          sam_value?: number | null
          segment?: string | null
          som_percentage?: number | null
          som_rationale?: string | null
          som_timeline?: string | null
          som_value?: number | null
          sources?: Json | null
          startup_id?: string | null
          tam_currency?: string | null
          tam_methodology?: string | null
          tam_source?: string | null
          tam_unit?: string | null
          tam_value?: number | null
          tam_year?: number | null
          updated_at?: string
          validation_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_sizes_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_sizes_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
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
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hosted_events"
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
          version: number | null
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
          version?: number | null
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
          version?: number | null
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
          metadata: Json | null
          signal_breakdown: Json | null
          signal_strength: number | null
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
          metadata?: Json | null
          signal_breakdown?: Json | null
          signal_strength?: number | null
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
          metadata?: Json | null
          signal_breakdown?: Json | null
          signal_strength?: number | null
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
      prompt_pack_steps: {
        Row: {
          created_at: string | null
          id: string
          input_schema: Json | null
          max_tokens: number | null
          model_preference: string | null
          output_schema: Json
          pack_id: string
          prompt_template: string
          purpose: string
          step_order: number
          temperature: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_schema?: Json | null
          max_tokens?: number | null
          model_preference?: string | null
          output_schema: Json
          pack_id: string
          prompt_template: string
          purpose: string
          step_order: number
          temperature?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_schema?: Json | null
          max_tokens?: number | null
          model_preference?: string | null
          output_schema?: Json
          pack_id?: string
          prompt_template?: string
          purpose?: string
          step_order?: number
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_pack_steps_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "prompt_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_packs: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          industry_tags: string[] | null
          is_active: boolean | null
          metadata: Json | null
          slug: string
          source: string | null
          stage_tags: string[] | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean | null
          metadata?: Json | null
          slug: string
          source?: string | null
          stage_tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean | null
          metadata?: Json | null
          slug?: string
          source?: string | null
          stage_tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      prompt_runs: {
        Row: {
          completed_at: string | null
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          id: string
          inputs_json: Json
          latency_ms: number | null
          model_used: string | null
          outputs_json: Json | null
          pack_id: string | null
          startup_id: string | null
          status: string | null
          step_id: string | null
          tokens_input: number | null
          tokens_output: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          inputs_json: Json
          latency_ms?: number | null
          model_used?: string | null
          outputs_json?: Json | null
          pack_id?: string | null
          startup_id?: string | null
          status?: string | null
          step_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          inputs_json?: Json
          latency_ms?: number | null
          model_used?: string | null
          outputs_json?: Json | null
          pack_id?: string | null
          startup_id?: string | null
          status?: string | null
          step_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_runs_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "prompt_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_runs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_runs_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "prompt_pack_steps"
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
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hosted_events"
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
      startup_memory: {
        Row: {
          content: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          source: string | null
          startup_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          source?: string | null
          startup_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          source?: string | null
          startup_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_memory_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
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
          problem_statement: string | null
          profile_strength: number | null
          raise_amount: number | null
          readiness_rationale: string | null
          readiness_score: number | null
          readiness_updated_at: string | null
          solution_description: string | null
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
          validation_verdict: string | null
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
          problem_statement?: string | null
          profile_strength?: number | null
          raise_amount?: number | null
          readiness_rationale?: string | null
          readiness_score?: number | null
          readiness_updated_at?: string | null
          solution_description?: string | null
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
          validation_verdict?: string | null
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
          problem_statement?: string | null
          profile_strength?: number | null
          raise_amount?: number | null
          readiness_rationale?: string | null
          readiness_score?: number | null
          readiness_updated_at?: string | null
          solution_description?: string | null
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
          validation_verdict?: string | null
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
      user_event_tracking: {
        Row: {
          created_at: string
          event_id: string
          id: string
          notes: string | null
          reminder_date: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          reminder_date?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          reminder_date?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_event_tracking_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "industry_events"
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
      validation_conditions: {
        Row: {
          category: string | null
          completed_at: string | null
          completion_evidence: string | null
          created_at: string
          current_state: string | null
          deadline: string | null
          description: string | null
          display_order: number | null
          evidence_needed: string | null
          expected_point_improvement: number | null
          id: string
          priority: string | null
          required_outcome: string | null
          startup_id: string | null
          status: string | null
          task_id: string | null
          title: string
          updated_at: string
          validation_report_id: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          completion_evidence?: string | null
          created_at?: string
          current_state?: string | null
          deadline?: string | null
          description?: string | null
          display_order?: number | null
          evidence_needed?: string | null
          expected_point_improvement?: number | null
          id?: string
          priority?: string | null
          required_outcome?: string | null
          startup_id?: string | null
          status?: string | null
          task_id?: string | null
          title: string
          updated_at?: string
          validation_report_id: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          completion_evidence?: string | null
          created_at?: string
          current_state?: string | null
          deadline?: string | null
          description?: string | null
          display_order?: number | null
          evidence_needed?: string | null
          expected_point_improvement?: number | null
          id?: string
          priority?: string | null
          required_outcome?: string | null
          startup_id?: string | null
          status?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string
          validation_report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_conditions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_conditions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_conditions_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_metadata: {
        Row: {
          api_errors: Json | null
          cache_data: Json | null
          cache_hit: boolean | null
          cache_key: string | null
          confidence_factors: Json | null
          created_at: string
          data_completeness: number | null
          expires_at: string | null
          external_apis_called: Json | null
          fallback_reason: string | null
          fallback_used: boolean | null
          id: string
          models_used: Json | null
          retry_count: number | null
          step_durations: Json | null
          total_cost_usd: number | null
          total_duration_ms: number | null
          total_tokens: number | null
          updated_at: string
          validation_report_id: string | null
        }
        Insert: {
          api_errors?: Json | null
          cache_data?: Json | null
          cache_hit?: boolean | null
          cache_key?: string | null
          confidence_factors?: Json | null
          created_at?: string
          data_completeness?: number | null
          expires_at?: string | null
          external_apis_called?: Json | null
          fallback_reason?: string | null
          fallback_used?: boolean | null
          id?: string
          models_used?: Json | null
          retry_count?: number | null
          step_durations?: Json | null
          total_cost_usd?: number | null
          total_duration_ms?: number | null
          total_tokens?: number | null
          updated_at?: string
          validation_report_id?: string | null
        }
        Update: {
          api_errors?: Json | null
          cache_data?: Json | null
          cache_hit?: boolean | null
          cache_key?: string | null
          confidence_factors?: Json | null
          created_at?: string
          data_completeness?: number | null
          expires_at?: string | null
          external_apis_called?: Json | null
          fallback_reason?: string | null
          fallback_used?: boolean | null
          id?: string
          models_used?: Json | null
          retry_count?: number | null
          step_durations?: Json | null
          total_cost_usd?: number | null
          total_duration_ms?: number | null
          total_tokens?: number | null
          updated_at?: string
          validation_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_metadata_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_reports: {
        Row: {
          blue_ocean_score: number | null
          business_score: number | null
          competition_score: number | null
          conditions: Json | null
          confidence: number | null
          cost_usd: number | null
          created_at: string | null
          execution_score: number | null
          id: string
          idea_description: string | null
          input_data: Json | null
          market_score: number | null
          model_used: string | null
          overall_score: number | null
          problem_score: number | null
          report_data: Json | null
          risk_adjustment: number | null
          solution_score: number | null
          startup_id: string | null
          tokens_used: number | null
          updated_at: string | null
          user_id: string | null
          validation_type: string | null
          verdict: string | null
        }
        Insert: {
          blue_ocean_score?: number | null
          business_score?: number | null
          competition_score?: number | null
          conditions?: Json | null
          confidence?: number | null
          cost_usd?: number | null
          created_at?: string | null
          execution_score?: number | null
          id?: string
          idea_description?: string | null
          input_data?: Json | null
          market_score?: number | null
          model_used?: string | null
          overall_score?: number | null
          problem_score?: number | null
          report_data?: Json | null
          risk_adjustment?: number | null
          solution_score?: number | null
          startup_id?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string | null
          validation_type?: string | null
          verdict?: string | null
        }
        Update: {
          blue_ocean_score?: number | null
          business_score?: number | null
          competition_score?: number | null
          conditions?: Json | null
          confidence?: number | null
          cost_usd?: number | null
          created_at?: string | null
          execution_score?: number | null
          id?: string
          idea_description?: string | null
          input_data?: Json | null
          market_score?: number | null
          model_used?: string | null
          overall_score?: number | null
          problem_score?: number | null
          report_data?: Json | null
          risk_adjustment?: number | null
          solution_score?: number | null
          startup_id?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string | null
          validation_type?: string | null
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_reports_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_scores: {
        Row: {
          base_score: number | null
          blue_ocean_bonus: number | null
          business_score: number | null
          competition_score: number | null
          created_at: string
          execution_score: number | null
          final_score: number | null
          id: string
          market_score: number | null
          problem_score: number | null
          risk_adjustment: number | null
          solution_score: number | null
          startup_id: string | null
          updated_at: string
          validation_report_id: string
          version: number | null
          weights: Json | null
        }
        Insert: {
          base_score?: number | null
          blue_ocean_bonus?: number | null
          business_score?: number | null
          competition_score?: number | null
          created_at?: string
          execution_score?: number | null
          final_score?: number | null
          id?: string
          market_score?: number | null
          problem_score?: number | null
          risk_adjustment?: number | null
          solution_score?: number | null
          startup_id?: string | null
          updated_at?: string
          validation_report_id: string
          version?: number | null
          weights?: Json | null
        }
        Update: {
          base_score?: number | null
          blue_ocean_bonus?: number | null
          business_score?: number | null
          competition_score?: number | null
          created_at?: string
          execution_score?: number | null
          final_score?: number | null
          id?: string
          market_score?: number | null
          problem_score?: number | null
          risk_adjustment?: number | null
          solution_score?: number | null
          startup_id?: string | null
          updated_at?: string
          validation_report_id?: string
          version?: number | null
          weights?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_scores_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_scores_validation_report_id_fkey"
            columns: ["validation_report_id"]
            isOneToOne: false
            referencedRelation: "validation_reports"
            referencedColumns: ["id"]
          },
        ]
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
      calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string | null
          location: string | null
          metadata: Json | null
          recurrence_rule: string | null
          related_contact_id: string | null
          related_deal_id: string | null
          related_project_id: string | null
          reminder_minutes: number | null
          start_date: string | null
          startup_id: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          title: string | null
          updated_at: string | null
          virtual_meeting_url: string | null
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string | null
          location?: string | null
          metadata?: Json | null
          recurrence_rule?: string | null
          related_contact_id?: string | null
          related_deal_id?: string | null
          related_project_id?: string | null
          reminder_minutes?: number | null
          start_date?: string | null
          startup_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string | null
          updated_at?: string | null
          virtual_meeting_url?: string | null
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string | null
          location?: string | null
          metadata?: Json | null
          recurrence_rule?: string | null
          related_contact_id?: string | null
          related_deal_id?: string | null
          related_project_id?: string | null
          reminder_minutes?: number | null
          start_date?: string | null
          startup_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string | null
          updated_at?: string | null
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
        }
        Relationships: []
      }
      hosted_events: {
        Row: {
          agenda: Json | null
          budget: number | null
          cancelled_at: string | null
          capacity: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          health_score: number | null
          id: string | null
          industry: string | null
          is_public: boolean | null
          location: string | null
          location_type:
            | Database["public"]["Enums"]["event_location_type"]
            | null
          name: string | null
          organizer_logo_url: string | null
          organizer_name: string | null
          published_at: string | null
          registration_deadline: string | null
          registration_url: string | null
          requires_approval: boolean | null
          slug: string | null
          sponsors_confirmed: number | null
          sponsors_target: number | null
          start_date: string | null
          startup_id: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string[] | null
          target_audience: string[] | null
          tasks_completed: number | null
          tasks_total: number | null
          ticket_price: number | null
          timezone: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          agenda?: Json | null
          budget?: number | null
          cancelled_at?: string | null
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          health_score?: number | null
          id?: string | null
          industry?: string | null
          is_public?: boolean | null
          location?: string | null
          location_type?:
            | Database["public"]["Enums"]["event_location_type"]
            | null
          name?: string | null
          organizer_logo_url?: string | null
          organizer_name?: string | null
          published_at?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          requires_approval?: boolean | null
          slug?: string | null
          sponsors_confirmed?: number | null
          sponsors_target?: number | null
          start_date?: string | null
          startup_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          target_audience?: string[] | null
          tasks_completed?: number | null
          tasks_total?: number | null
          ticket_price?: number | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          agenda?: Json | null
          budget?: number | null
          cancelled_at?: string | null
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          health_score?: number | null
          id?: string | null
          industry?: string | null
          is_public?: boolean | null
          location?: string | null
          location_type?:
            | Database["public"]["Enums"]["event_location_type"]
            | null
          name?: string | null
          organizer_logo_url?: string | null
          organizer_name?: string | null
          published_at?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          requires_approval?: boolean | null
          slug?: string | null
          sponsors_confirmed?: number | null
          sponsors_target?: number | null
          start_date?: string | null
          startup_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          target_audience?: string[] | null
          tasks_completed?: number | null
          tasks_total?: number | null
          ticket_price?: number | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
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
      check_realtime_setup: {
        Args: never
        Returns: {
          check_name: string
          details: string
          status: string
        }[]
      }
      complete_wizard_atomic: {
        Args: {
          p_session_id: string
          p_startup_data: Json
          p_tasks_data: Json
          p_user_id: string
        }
        Returns: Json
      }
      get_competitor_summary: {
        Args: { p_validation_report_id: string }
        Returns: {
          avg_funding: number
          direct_count: number
          high_threat_count: number
          indirect_count: number
          total_count: number
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
      get_industry_ai_context: { Args: { p_industry: string }; Returns: Json }
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
      get_pack_run_stats: {
        Args: { p_pack_id: string }
        Returns: {
          avg_latency_ms: number
          success_rate: number
          total_cost_usd: number
          total_runs: number
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
      get_pending_conditions: {
        Args: { p_validation_report_id: string }
        Returns: {
          category: string
          expected_point_improvement: number
          id: string
          priority: string
          title: string
        }[]
      }
      get_pitch_deck_with_slides: { Args: { p_deck_id: string }; Returns: Json }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_validation_history: {
        Args: { p_limit?: number; p_startup_id: string }
        Returns: {
          created_at: string
          id: string
          overall_score: number
          verdict: string
        }[]
      }
      get_validation_verdict: { Args: { p_score: number }; Returns: string }
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
      process_answer_atomic: {
        Args: {
          p_extracted_funding: Json
          p_extracted_traction: Json
          p_form_data: Json
          p_interview_answers: Json
          p_session_id: string
          p_signals: string[]
          p_user_id: string
        }
        Returns: Json
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
      pitch_deck_status:
        | "draft"
        | "in_progress"
        | "review"
        | "final"
        | "archived"
        | "generating"
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
      pitch_deck_status: [
        "draft",
        "in_progress",
        "review",
        "final",
        "archived",
        "generating",
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
