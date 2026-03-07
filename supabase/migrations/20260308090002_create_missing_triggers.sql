-- ============================================================================
-- Part 3: All missing triggers (DO blocks only, no function definitions)
-- ============================================================================

-- 3.1 Domain-specific triggers

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_task_completed_at') THEN
    CREATE TRIGGER trg_set_task_completed_at
      BEFORE UPDATE ON public.tasks
      FOR EACH ROW EXECUTE FUNCTION public.set_task_completed_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_version_number') THEN
    CREATE TRIGGER set_version_number
      BEFORE INSERT ON public.document_versions
      FOR EACH ROW EXECUTE FUNCTION public.set_document_version_number();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_deck_slide_count') THEN
    CREATE TRIGGER update_deck_slide_count
      AFTER INSERT OR UPDATE OR DELETE ON public.pitch_deck_slides
      FOR EACH ROW EXECUTE FUNCTION public.update_pitch_deck_slide_count();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'validator_reports_broadcast') THEN
    CREATE TRIGGER validator_reports_broadcast
      AFTER INSERT ON public.validator_reports
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_validator_report_insert();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'validator_sessions_broadcast') THEN
    CREATE TRIGGER validator_sessions_broadcast
      AFTER INSERT OR UPDATE OF status ON public.validator_sessions
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_validator_session_change();
  END IF;
END $$;

-- 3.2 Broadcast triggers for existing tables

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_activities_changes') THEN
    CREATE TRIGGER broadcast_activities_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.activities
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_chat_messages_changes') THEN
    CREATE TRIGGER broadcast_chat_messages_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.chat_messages
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_contacts_changes') THEN
    CREATE TRIGGER broadcast_contacts_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.contacts
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_deals_changes') THEN
    CREATE TRIGGER broadcast_deals_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.deals
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_documents_changes') THEN
    CREATE TRIGGER broadcast_documents_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.documents
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_investors_changes') THEN
    CREATE TRIGGER broadcast_investors_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.investors
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_lean_canvases_changes') THEN
    CREATE TRIGGER broadcast_lean_canvases_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.lean_canvases
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_pitch_decks_changes') THEN
    CREATE TRIGGER broadcast_pitch_decks_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.pitch_decks
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_projects_changes') THEN
    CREATE TRIGGER broadcast_projects_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.projects
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_startups_changes') THEN
    CREATE TRIGGER broadcast_startups_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.startups
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_tasks_changes') THEN
    CREATE TRIGGER broadcast_tasks_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.tasks
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'broadcast_events_changes') THEN
    CREATE TRIGGER broadcast_events_changes
      AFTER INSERT OR UPDATE OR DELETE ON public.events
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_table_changes();
  END IF;
END $$;

-- 3.3 Updated_at triggers for tables that don't have them yet

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_campaigns_updated_at') THEN
    CREATE TRIGGER set_campaigns_updated_at
      BEFORE UPDATE ON public.campaigns
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_chat_sessions_updated_at') THEN
    CREATE TRIGGER handle_chat_sessions_updated_at
      BEFORE UPDATE ON public.chat_sessions
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_opportunity_canvas_updated_at') THEN
    CREATE TRIGGER set_opportunity_canvas_updated_at
      BEFORE UPDATE ON public.opportunity_canvas
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_sprints_updated_at') THEN
    CREATE TRIGGER set_sprints_updated_at
      BEFORE UPDATE ON public.sprints
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_events_updated_at') THEN
    CREATE TRIGGER set_events_updated_at
      BEFORE UPDATE ON public.events
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_weekly_reviews_updated_at') THEN
    CREATE TRIGGER set_weekly_reviews_updated_at
      BEFORE UPDATE ON public.weekly_reviews
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_industry_events_updated_at') THEN
    CREATE TRIGGER update_industry_events_updated_at
      BEFORE UPDATE ON public.industry_events
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_knowledge_chunks_updated_at') THEN
    CREATE TRIGGER trigger_knowledge_chunks_updated_at
      BEFORE UPDATE ON public.knowledge_chunks
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_knowledge_map_updated_at') THEN
    CREATE TRIGGER set_knowledge_map_updated_at
      BEFORE UPDATE ON public.knowledge_map
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_context_injection_configs_updated_at') THEN
    CREATE TRIGGER handle_context_injection_configs_updated_at
      BEFORE UPDATE ON public.context_injection_configs
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_assumptions_updated_at') THEN
    CREATE TRIGGER trigger_assumptions_updated_at
      BEFORE UPDATE ON public.assumptions
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_prompt_packs_updated_at') THEN
    CREATE TRIGGER handle_prompt_packs_updated_at
      BEFORE UPDATE ON public.prompt_packs
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_prompt_pack_steps_updated_at') THEN
    CREATE TRIGGER handle_prompt_pack_steps_updated_at
      BEFORE UPDATE ON public.prompt_pack_steps
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_shareable_links_updated_at') THEN
    CREATE TRIGGER handle_shareable_links_updated_at
      BEFORE UPDATE ON public.shareable_links
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- 3.4 Additional updated_at triggers (conditional on table existence)

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_agent_configs_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agent_configs') THEN
      CREATE TRIGGER handle_agent_configs_updated_at
        BEFORE UPDATE ON public.agent_configs
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_communications_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'communications') THEN
      CREATE TRIGGER handle_communications_updated_at
        BEFORE UPDATE ON public.communications
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_contact_tags_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_tags') THEN
      CREATE TRIGGER handle_contact_tags_updated_at
        BEFORE UPDATE ON public.contact_tags
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_contacts_updated_at') THEN
    CREATE TRIGGER handle_contacts_updated_at
      BEFORE UPDATE ON public.contacts
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_deals_updated_at') THEN
    CREATE TRIGGER handle_deals_updated_at
      BEFORE UPDATE ON public.deals
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_documents_updated_at') THEN
    CREATE TRIGGER handle_documents_updated_at
      BEFORE UPDATE ON public.documents
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_deck_templates_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'deck_templates') THEN
      CREATE TRIGGER set_deck_templates_updated_at
        BEFORE UPDATE ON public.deck_templates
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_event_assets_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_assets') THEN
      CREATE TRIGGER set_event_assets_updated_at
        BEFORE UPDATE ON public.event_assets
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_event_attendees_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_attendees') THEN
      CREATE TRIGGER set_event_attendees_updated_at
        BEFORE UPDATE ON public.event_attendees
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_event_speakers_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_speakers') THEN
      CREATE TRIGGER handle_event_speakers_updated_at
        BEFORE UPDATE ON public.event_speakers
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_event_venues_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_venues') THEN
      CREATE TRIGGER set_event_venues_updated_at
        BEFORE UPDATE ON public.event_venues
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_industry_playbooks_updated_at') THEN
    CREATE TRIGGER handle_industry_playbooks_updated_at
      BEFORE UPDATE ON public.industry_playbooks
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_org_members_updated_at') THEN
    CREATE TRIGGER handle_org_members_updated_at
      BEFORE UPDATE ON public.org_members
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_organizations_updated_at') THEN
    CREATE TRIGGER handle_organizations_updated_at
      BEFORE UPDATE ON public.organizations
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_profiles_updated_at') THEN
    CREATE TRIGGER handle_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_projects_updated_at') THEN
    CREATE TRIGGER handle_projects_updated_at
      BEFORE UPDATE ON public.projects
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_proposed_actions_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'proposed_actions') THEN
      CREATE TRIGGER handle_proposed_actions_updated_at
        BEFORE UPDATE ON public.proposed_actions
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_sprint_tasks_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sprint_tasks') THEN
      CREATE TRIGGER set_sprint_tasks_updated_at
        BEFORE UPDATE ON public.sprint_tasks
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_startups_updated_at') THEN
    CREATE TRIGGER handle_startups_updated_at
      BEFORE UPDATE ON public.startups
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_tasks_updated_at') THEN
    CREATE TRIGGER handle_tasks_updated_at
      BEFORE UPDATE ON public.tasks
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_validator_reports_updated_at') THEN
    CREATE TRIGGER handle_validator_reports_updated_at
      BEFORE UPDATE ON public.validator_reports
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_validator_sessions_updated_at') THEN
    CREATE TRIGGER handle_validator_sessions_updated_at
      BEFORE UPDATE ON public.validator_sessions
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'lean_canvases_updated_at') THEN
    CREATE TRIGGER lean_canvases_updated_at
      BEFORE UPDATE ON public.lean_canvases
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_onboarding_questions_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'onboarding_questions') THEN
      CREATE TRIGGER set_onboarding_questions_updated_at
        BEFORE UPDATE ON public.onboarding_questions
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pitch_deck_slides_updated_at') THEN
    CREATE TRIGGER update_pitch_deck_slides_updated_at
      BEFORE UPDATE ON public.pitch_deck_slides
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pitch_decks_updated_at') THEN
    CREATE TRIGGER update_pitch_decks_updated_at
      BEFORE UPDATE ON public.pitch_decks
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_wizard_sessions_updated_at') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wizard_sessions') THEN
      CREATE TRIGGER set_wizard_sessions_updated_at
        BEFORE UPDATE ON public.wizard_sessions
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
  END IF;
END $$;
