-- migration: add_vpc_data_to_opportunity_canvas
-- description: Add VPC (Value Proposition Canvas) JSONB column to opportunity_canvas
-- task_ref: 08-value-proposition
-- depends_on: opportunity_canvas

-- ============================================================
-- VPC data stores the 6-box Strategyzer canvas + fit score
-- Structure: {
--   customer_jobs: [{text, priority}],
--   pains: [{text, severity}],
--   gains: [{text, importance}],
--   products_services: [{text}],
--   pain_relievers: [{text, matched_pain_index}],
--   gain_creators: [{text, matched_gain_index}],
--   fit_score: number (0-100),
--   unmatched_pains: [index],
--   unmatched_gains: [index]
-- }
-- ============================================================

alter table public.opportunity_canvas
  add column vpc_data jsonb default '{}'::jsonb;

comment on column public.opportunity_canvas.vpc_data
  is 'Value Proposition Canvas: 6-box layout (jobs/pains/gains vs products/relievers/creators) + fit_score';
