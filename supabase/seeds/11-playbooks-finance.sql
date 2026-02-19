-- ============================================================================
-- Seed: Industry Playbooks - Finance Sector
-- Contains: financial_services (fintech already in 04-industry-playbooks.sql)
-- ============================================================================

-- Financial Services (Traditional)
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, success_stories, benchmarks,
  terminology, gtm_patterns, decision_frameworks, investor_questions,
  warning_signs, stage_checklists, slide_emphasis,
  version, is_active, source
) VALUES (
  'financial_services',
  'Financial Services',
  'Legacy systems → modern infrastructure → efficiency gains → trusted partner → industry transformation',
  '{
    "pre_seed": {
      "focus": ["Domain expertise in specific vertical", "Regulatory awareness", "Clear efficiency gains"],
      "metrics": ["Team with finance background", "LOIs from institutions", "Regulatory strategy documented"],
      "deal_breakers": ["No finance experience", "Unclear regulatory path", "Generic B2B positioning"]
    },
    "seed": {
      "focus": ["Pilot with institution", "Compliance framework", "Measurable efficiency gains"],
      "metrics": ["1-2 institutional pilots", "$50-100K ARR", "Documented time/cost savings"],
      "deal_breakers": ["No institutional relationships", "Compliance gaps", "Unable to pass vendor review"]
    },
    "series_a": {
      "focus": ["Multiple institutional customers", "Proven ROI", "Scalable compliance"],
      "metrics": ["$500K+ ARR", "5+ institutional logos", "Regulatory approvals if needed"],
      "deal_breakers": ["Single customer dependency", "Regulatory issues", "Cant scale beyond pilot"]
    }
  }'::jsonb,
  '[
    {"pattern": "Underestimating Sales Cycles", "why_fatal": "12-18 month sales cycles drain runway", "early_warning": "Expecting enterprise close in 3 months", "how_to_avoid": "Budget for 12-18 month cycles. Raise accordingly"},
    {"pattern": "Vendor Management Hell", "why_fatal": "Months spent on security questionnaires", "early_warning": "No SOC 2, no security documentation", "how_to_avoid": "Start SOC 2 at incorporation. Document everything"},
    {"pattern": "One Big Customer", "why_fatal": "Customer has all leverage. If they leave youre dead", "early_warning": ">50% revenue from one customer", "how_to_avoid": "Diversify before Series A. No customer >30% of revenue"}
  ]'::jsonb,
  '[
    {"archetype": "Compliance Automation", "pattern": "Painful compliance → automated workflows → expand to adjacent", "outcome": "Land with compliance pain, expand to operations"},
    {"archetype": "Data Infrastructure", "pattern": "Fragmented data → unified view → analytics → decision support", "outcome": "Becomes critical infrastructure. High switching costs"}
  ]'::jsonb,
  '[
    {"metric": "ARR", "good": "$200K-500K", "great": ">$500K", "stage": "Seed"},
    {"metric": "Enterprise Logos", "good": "2-3", "great": ">5", "stage": "Seed"},
    {"metric": "Net Retention", "good": "110-120%", "great": ">120%", "stage": "Series A"},
    {"metric": "Sales Cycle", "good": "6-9 months", "great": "<6 months", "stage": "Series A"}
  ]'::jsonb,
  '{
    "use_phrases": ["Enterprise-grade security", "SOC 2 Type II certified", "Regulatory compliant", "Audit trail", "Risk management", "Operational efficiency"],
    "avoid_phrases": ["Disrupting banks", "Move fast break things", "Well figure out compliance later"],
    "investor_vocabulary": ["AUM", "Basis points", "RIA", "Broker-dealer", "Custodian", "Prime broker", "Fund admin"]
  }'::jsonb,
  '[
    {"name": "Enterprise Direct", "stages": ["Seed", "Series A"], "channels": ["Industry conferences", "Warm intros via advisors", "Consultant relationships"], "best_for": "High ACV enterprise sales"},
    {"name": "Integration Partners", "stages": ["Series A"], "channels": ["Core banking vendors", "Wealth platforms", "Trading systems"], "best_for": "Distribution through existing platforms"}
  ]'::jsonb,
  '[
    {"decision": "Build vs Partner for Compliance", "if": "Compliance is your moat", "then": "Build in-house", "because": "Own the differentiation"},
    {"decision": "Enterprise vs SMB", "if": "Product requires heavy implementation", "then": "Enterprise only", "because": "SMB cant support deployment costs"}
  ]'::jsonb,
  '[
    {"question": "How do you handle vendor due diligence?", "good_answer": "SOC 2 Type II since month 6. Dedicated security team. Pre-filled questionnaires for top 20 institutions", "bad_answer": "We work with their security team"},
    {"question": "Whats your sales cycle?", "good_answer": "Average 8 months. Shortened to 5 with warm intro. We budget for 12", "bad_answer": "A few months"}
  ]'::jsonb,
  '[
    {"signal": "Vendor review taking >3 months", "trigger": "Security gaps or slow responses", "action": "Dedicated resource for vendor reviews. Pre-build documentation", "severity": "warning"},
    {"signal": ">50% revenue from one customer", "trigger": "Concentration risk", "action": "Prioritize diversification over growth", "severity": "critical"}
  ]'::jsonb,
  '[
    {"stage": "pre_seed", "tasks": ["Build team with finance credentials", "Get 3-5 LOIs from institutions", "Document regulatory strategy", "Start SOC 2 process"]},
    {"stage": "seed", "tasks": ["Land 2-3 pilots", "Complete SOC 2 Type II", "Document sales process", "Build reference customer base"]},
    {"stage": "series_a", "tasks": ["5+ paying institutions", "Prove expansion revenue", "Hire enterprise sales team", "Build customer success"]}
  ]'::jsonb,
  '[
    {"slide": "Team", "weight": "critical", "guidance": "Finance credentials are table stakes. Show domain expertise"},
    {"slide": "Security", "weight": "critical", "guidance": "SOC 2, security architecture, compliance. This will be verified"},
    {"slide": "Traction", "weight": "important", "guidance": "Institutional logos matter more than revenue numbers"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  success_stories = EXCLUDED.success_stories,
  benchmarks = EXCLUDED.benchmarks,
  terminology = EXCLUDED.terminology,
  updated_at = now();
